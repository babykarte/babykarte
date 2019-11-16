#!/usr/bin/python3
import psycopg2, os, json, sys, io
#sys.stderr = sys.stdout
# st_makeEnvelope(ymin, xmin,ymax, xmax)
debug = "" #"""cafe - 10.1207,54.3152,10.1593,54.3309"""
verbose = False
data = {}
elem_count = 0
dbconnstr="dbname=poi"
sqls = {"normal": "SELECT to_json(tags), osm_id, 'Node' AS osm_type, St_asgeojson(St_centroid(geom)) ::json AS geometry FROM osm_poi_point WHERE geom && ST_makeEnvelope(%lat1, %lon1, %lat2, %lon2) and (%condition) UNION ALL SELECT to_json(tags), osm_id, 'Way' AS osm_type, st_asgeojson(St_centroid(geom)) ::json AS geometry FROM osm_poi_poly WHERE geom && ST_makeEnvelope(%lat1, %lon1, %lat2, %lon2) and (%condition);",
			"playground": "SELECT to_json(tags), osm_id, osm_type, St_asgeojson(St_centroid(geom)) ::json AS geometry, equipment from osm_poi_playgrounds where geom && ST_makeEnvelope(%lat1, %lon1, %lat2, %lon2) and (%condition);"}
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
def convertToJSON(query, mode, name, category, source):
	global data, elem_count
	for row in query:
		data[elem_count] = {}
		if mode == "playground":
			data[elem_count]["tags"], data[elem_count]["osm_id"], data[elem_count]["type"], data[elem_count]["geometry"], data[elem_count]["equipment"] = row
			if data[elem_count]["equipment"] != 'null':
				for equip in data[elem_count]["equipment"]:
					data[elem_count]["tags"]["playground:" + equip] = "yes"
		else:
			data[elem_count]["tags"], data[elem_count]["osm_id"], data[elem_count]["type"], data[elem_count]["geometry"] = row
		data[elem_count]["category"] = category
		data[elem_count]["filter"] = name
		data[elem_count]["osm_id"] = int(str(data[elem_count]["osm_id"]).replace("-", ""))
		elem_count += 1
	if len(data) == 0:
		data[elem_count] = {}
		data[elem_count]["notes"] = "No Data"
		data[elem_count]["filter"] = name
def lookupQuery(name, bbox):
	if name in queryLookUp:
		condition, mode, category = queryLookUp[name]
		try:
			bbox[0] = str(float(bbox[0]))
			bbox[1] = str(float(bbox[1]))
			bbox[2] = str(float(bbox[2]))
			bbox[3] = str(float(bbox[3]))
		except:
			bbox[0] = 0
			bbox[1] = 0
			bbox[2] = 0
			bbox[3] = 0
		return sqls[mode].replace("%lon1", bbox[0]).replace("%lat1", bbox[1]).replace("%lon2", bbox[2]).replace("%lat2", bbox[3]).replace("%condition", condition), mode, name, category
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
		query, bbox = entry.split(" - ")
		query, mode, name, category = lookupQuery(query.strip(), bbox.split(","))
		if query == "":
			errorCreation(name, "ERROR 404")
		else:
			try:
				conn = psycopg2.connect(dbconnstr)
				cur = conn.cursor()
				cur.execute(query)
				result = cur.fetchall()
				convertToJSON(result, mode, name, category, query);
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
