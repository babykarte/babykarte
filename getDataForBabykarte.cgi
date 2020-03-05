#!/usr/bin/python3
import psycopg2, os, json, sys, io
#sys.stderr = sys.stdout
# st_makeEnvelope(ymin, xmin,ymax, xmax)
debug = "" #"""cafe - 10.1207,54.3152,10.1593,54.3309"""
verbose = False
data = {}
elem_count = 0
dbconnstr="dbname=poi"
sqls = {"normal": "SELECT to_json(tags), osm_id, St_asgeojson(St_centroid(geom)) ::json AS geometry FROM osm_poi_all WHERE geom && ST_makeEnvelope(%lat1, %lon1, %lat2, %lon2) and (%condition);",
		"playground": "SELECT to_json(tags), osm_id, osm_type, St_asgeojson(St_centroid(geom)) ::json AS geometry, equipment from osm_poi_playgrounds where geom && ST_makeEnvelope(%lat1, %lon1, %lat2, %lon2) and (%condition);",
		"singlenode": "SELECT to_json(tags), osm_id, ST_asgeojson(ST_centroid(geom)) ::json AS geometry FROM osm_poi_point WHERE osm_id=%id",
		"singleway:": "SELECT to_json(tags), osm_id, ST_asgeojson(ST_centroid(geom)) ::json AS geometry FROM osm_poi_point WHERE osm_id=%id"}
queryLookUp = {"paediatrics": ("tags->'healthcare:speciality' LIKE 'paediatrics'", "normal", "health"),
				"midwife": ("tags->'healthcare'='midwife'", "normal", "health"),
				"birthing_center": ("tags->'healthcare'='birthing_center'", "normal", "health"),
				"playground": ("tags->'leisure'='playground' AND (CASE WHEN tags->'min_age' IS NOT NULL THEN tags->'min_age'>='3' ELSE TRUE END) AND NOT (CASE WHEN tags->'access' IS NOT NULL THEN tags->'access'='private' ELSE FALSE END)", "playground", "activity"),
				"play-equipment": ("tags->'playground' IS NOT NULL AND (CASE WHEN tags->'min_age' IS NOT NULL THEN tags->'min_age'>='3' ELSE TRUE END)", "normal", "activity"),
				"park": ("tags->'leisure'='park' AND tags->'name' IS NOT NULL AND (CASE WHEN tags->'min_age' IS NOT NULL THEN tags->'min_age'>='3' ELSE TRUE END) AND NOT (CASE WHEN tags->'access' IS NOT NULL THEN tags->'access'='private' ELSE FALSE END)", "normal", "rest"),
				"shop-babygoods": ("tags->'shop'='baby_goods'", "normal", "shop"),
				"shop-toys": ("tags->'shop'='toys'", "normal", "shop"),
				"shop-clothes": ("tags->'shop'='clothes' and (tags->'clothes' LIKE 'babies' or tags->'clothes' LIKE 'children')", "normal", "shop"),
				"childcare": ("tags->'amenity'='kindergarten' OR tags->'amenity'='childcare'", "normal", "childcare"),
				"zoo": ("tags->'tourism'='zoo'", "normal", "activity"),
				"changingtable": ("(tags->'diaper' IS NOT NULL AND tags->'diaper'!='no') OR (tags->'changing_table' IS NOT NULL AND tags->'changing_table'!='no')", "normal", "changingtable"),
				"changingtable-men": ("tags->'diaper:male'='yes' OR tags->'diaper:unisex'='yes' OR tags->'diaper'='room' OR tags->'diaper:wheelchair'='yes' OR tags->'changing_table:location' NOT LIKE 'female_toilet'", "normal", "changingtable"),
				"cafe": ("tags->'amenity'='cafe' AND (CASE WHEN tags->'min_age' IS NOT NULL THEN tags->'min_age'>='3' ELSE TRUE END) OR tags ? 'cafe' AND (CASE WHEN tags->'min_age' IS NOT NULL THEN tags->'min_age'>='3' ELSE TRUE END)", "normal", "eat"),
				"restaurant": ("tags->'amenity'='restaurant' AND (CASE WHEN tags->'min_age' IS NOT NULL THEN tags->'min_age'>='3' ELSE TRUE END)", "normal", "eat"),
				"fast_food": ("tags->'amenity'='fast_food'", "normal", "eat"),
			}

def errorCreation(name, text):
	global data, elem_count
	data[elem_count] = {}
	data[elem_count]["notes"] = text
	data[elem_count]["filter"] = name
	elem_count += 1
def errorLog(message):
	global debug
	if not debug == "":
		print(message, file=sys.stderr)
def convertToJSON(query, mode, name, subcategory, source):
	global data, elem_count
	for row in query:
		data[elem_count] = {}
		data[elem_count]["type"] = ""
		if mode == "playground":
			data[elem_count]["tags"], data[elem_count]["osm_id"], data[elem_count]["type"], data[elem_count]["geometry"], data[elem_count]["equipment"] = row
			if data[elem_count]["equipment"] != 'null':
				for equip in data[elem_count]["equipment"]:
					data[elem_count]["tags"]["playground:" + equip] = "yes"
		else:
			data[elem_count]["tags"], data[elem_count]["osm_id"], data[elem_count]["geometry"] = row
			if -1e+17 >= int(data[elem_count]["osm_id"]): # True when object is a relation
				data[elem_count]["type"] = "Relation"
			if -1 >= int(data[elem_count]["osm_id"]): #True when object is a way
				data[elem_count]["type"] = "Way"
			if int(data[elem_count]["osm_id"]) >= 1: ##True when object is a node
				data[elem_count]["type"] = "Node"
		data[elem_count]["category"] = subcategory #Delete this line when the new version of Babykarte gets released.
		data[elem_count]["subcategory"] = subcategory
		data[elem_count]["filter"] = name
		data[elem_count]["osm_id"] = int(str(data[elem_count]["osm_id"]).replace("-", ""))
		#data[elem_count]["osm_id"] = int(data[elem_count]["osm_id"])
		elem_count += 1
	if len(data) == 0:
		data[elem_count] = {}
		data[elem_count]["notes"] = "No Data"
		data[elem_count]["filter"] = name
def anotherLookup(query):
	if entry.startswith("id="):
		entry = entry.split("=")[1] #Need to a machine readable convertion list from e.g. W46464655 --> -46464655
		osm_type = list(entry)[0]
		osm_id = entry.replace(osm_type, "")
		osm_type = osm_type.upper()
		if osm_type == "N":
			return sqls["singlenode"].replace("%id", osm_id), "singlenode", str(osm_type) + str(osm_id), "None"
		elif osm_type == "W":
			return sqls["singleway"].replace("%id", osm_id), "singleway", str(osm_type) + str(osm_id), "None"
		elif osm_type == "R":
			return sqls["singleway"].replace("%id", -1*(osm_id+1e17)), "singleway", str(osm_type) + str(osm_id), "None"
def lookupQuery(name, bbox=None):
	if name in queryLookUp: 
		condition, mode, subcategory = queryLookUp[name]
		if not bbox == None:
			bbox[0] = str(float(bbox[0]))
			bbox[1] = str(float(bbox[1]))
			bbox[2] = str(float(bbox[2]))
			bbox[3] = str(float(bbox[3]))
			return sqls[mode].replace("%lon1", bbox[0]).replace("%lat1", bbox[1]).replace("%lon2", bbox[2]).replace("%lat2", bbox[3]).replace("%condition", condition), mode, name, subcategory
	else:
		return "", "", name, "" 
def getData():
	if debug == "":
		filebuffer = sys.stdin.read()
	else:
		filebuffer = debug
	for entry in filebuffer.split("\n"):
		if entry == "":
			continue
		if entry.find(" - ") > -1:
			query, bbox = entry.split(" - ")
			query, mode, name, subcategory = lookupQuery(query.strip(), bbox.split(","))
		else:
			query, mode, name, subcategory = anotherLookup(entry)
		if query == "":
			errorCreation(name, "ERROR 404")
		else:
			try:
				conn = psycopg2.connect(dbconnstr)
				cur = conn.cursor()
				cur.execute(query)
				result = cur.fetchall()
				convertToJSON(result, mode, name, subcategory, query);
			except Exception as e:
				if not debug == "" or verbose:
					errorCreation(name, "ERROR 503" + str(e))
				else:
					errorCreation(name, "ERROR 503")
				errorLog("SQL Input: " + query)
	stream = io.StringIO()
	json.dump(data, stream)
	return stream.getvalue()
def application(environ):
	print("Content-Type:", "application/json;charset=utf-8\r\n\r\n", end="")
	if "HTTP_COOKIE" in environ:
		environ["HTTP_COOKIE"] = ""
	print(getData())


application(os.environ)
