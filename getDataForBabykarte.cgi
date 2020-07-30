#!/usr/bin/python3
import psycopg2, os, json, sys, io
#sys.stderr = sys.stdout
# st_makeEnvelope(ymin, xmin,ymax, xmax)
debug = "" #"""cafe - 10.1207,54.3152,10.1593,54.3309"""
verbose = False
data = {}
elem_count = 0
dbconnstr="dbname=poi"
tocategory = {"healthcare=doctor": "health",
	"healthcare=hospital": "health",
	"healthcare=midwife": "health",
	"healthcare=birthing_center": "health",
	"amenity=toilets": "childcare",
	"amenity=cafe": "eat",
	"amenity=restaurant": "eat",
	"amenity=fast_food": "eat",
	"amenity=kindergarten": "eat",
	"amenity=childcare": "childcare",
	"leisure=playground": "activity",
	"playground=*": "playground-equipment",
	"leisure=park": "activity",
	"tourism=zoo": "activity",
	"shop=baby_goods": "shop",
	"shop=toys": "shop",
	"shop=clothes": "shop",
	"shop=chemist": "shop",
	"shop=supermarket": "shop"}
ratingData = {"diaper": {"multiplicator": 4,	# diaper=* 4
				"values" :
					{"yes": 2,				#     yes 2
					"no": -2}				#     no  -2
				},
			"changing_table": {"multiplicator": 4,	# changing_table=* 4
				"values" :
					{"yes": 2,				#     yes 2
					"no": -2}				#     no  -2
				},
			"highchair": {"multiplicator": 4,	# highchair=* 4  (POIs where you can get meal or something simliar)
				"values" :
					{"yes": 2,				#     yes 2
					"no": -2}				#     no  -2
				},
			"kids_area": {"multiplicator": 2,	# kids_area=* 2
				"values" :
					{"yes": 2,				#     yes 2
					"no": -2}				#     no  -2
				},
			"stroller": {"multiplicator": 1,	# stroller=* 1
				"values" :
					{"yes": 2,				#     yes 3
					"no": -2,				#     no  -2
					"limited": 1}			#     limited 1 (green)
				}
			};
sqls = {"normal": "SELECT to_json(tags), osm_id, St_asgeojson(St_centroid(geom)) ::json AS geometry FROM osm_poi_all WHERE %s",
		"playground": "SELECT to_json(tags), osm_id, osm_type, St_asgeojson(St_centroid(geom)) ::json AS geometry, equipment FROM osm_poi_playgrounds WHERE %s",
		"singlenode": "SELECT to_json(tags), osm_id, ST_asgeojson(ST_centroid(geom)) ::json AS geometry FROM osm_poi_point WHERE osm_id=%id",
		"singleway": "SELECT to_json(tags), osm_id, ST_asgeojson(ST_centroid(geom)) ::json AS geometry FROM osm_poi_poly WHERE osm_id=%id",
		"advancedSearch": "SELECT to_json(tags), osm_id, St_asgeojson(St_centroid(geom)) ::json AS geometry FROM osm_poi_all WHERE "}
queryLookUp = { "bbox": ("(geom && ST_makeEnvelope(%lat1, %lon1, %lat2, %lon2))", "normal", ""),
				"paediatrics": ("(tags->'healthcare:speciality' LIKE 'paediatrics')", "normal", "health"),
				"midwife": ("(tags->'healthcare'='midwife')", "normal", "health"),
				"birthing_center": ("(tags->'healthcare'='birthing_center')", "normal", "health"),
				"playground": ("(tags->'leisure'='playground' AND (CASE WHEN tags->'min_age' IS NOT NULL THEN tags->'min_age'>='3' ELSE TRUE END) AND NOT (CASE WHEN tags->'access' IS NOT NULL THEN tags->'access'='private' ELSE FALSE END))", "playground", "activity"),
				"play-equipment": ("(tags->'playground' IS NOT NULL AND (CASE WHEN tags->'min_age' IS NOT NULL THEN tags->'min_age'>='3' ELSE TRUE END))", "normal", "activity"),
				"park": ("(tags->'leisure'='park' AND tags->'name' IS NOT NULL AND (CASE WHEN tags->'min_age' IS NOT NULL THEN tags->'min_age'>='3' ELSE TRUE END) AND NOT (CASE WHEN tags->'access' IS NOT NULL THEN tags->'access'='private' ELSE FALSE END))", "normal", "rest"),
				"shop-babygoods": ("(tags->'shop'='baby_goods')", "normal", "shop"),
				"shop-toys": ("(tags->'shop'='toys')", "normal", "shop"),
				"shop-clothes": ("(tags->'shop'='clothes' and (tags->'clothes' LIKE 'babies' or tags->'clothes' LIKE 'children'))", "normal", "shop"),
				"childcare": ("(tags->'amenity'='kindergarten' OR tags->'amenity'='childcare')", "normal", "childcare"),
				"zoo": ("(tags->'tourism'='zoo')", "normal", "activity"),
				"changingtable": ("((tags->'diaper' IS NOT NULL AND tags->'diaper'!='no') OR (tags->'changing_table' IS NOT NULL AND tags->'changing_table'!='no'))", "normal", "changingtable"),
				"changingtable-men": ("(tags->'diaper:male'='yes' OR tags->'diaper:unisex'='yes' OR tags->'diaper'='room' OR tags->'diaper:wheelchair'='yes' OR tags->'changing_table:location' NOT LIKE 'female_toilet')", "normal", "changingtable"),
				"highcair": ("(tags->'highcair'='yes' OR tags->'highchair'>'0')", "normal", ""),
				"stroller": ("(tags->'stroller'='yes' OR tags->'stroller'='limited')", "normal", ""),
				"kidsarea": ("(tags->'kids_area'='yes')", "normal", ""),
				"cafe": ("(tags->'amenity'='cafe' AND (CASE WHEN tags->'min_age' IS NOT NULL THEN tags->'min_age'>='3' ELSE TRUE END) OR tags ? 'cafe' AND (CASE WHEN tags->'min_age' IS NOT NULL THEN tags->'min_age'>='3' ELSE TRUE END))", "normal", "eat"),
				"restaurant": ("(tags->'amenity'='restaurant' AND (CASE WHEN tags->'min_age' IS NOT NULL THEN tags->'min_age'>='3' ELSE TRUE END))", "normal", "eat"),
				"fast_food": ("(tags->'amenity'='fast_food')", "normal", "eat"),
				"directname": ("(tags->'name' LIKE '%s')"),
				"singlepoi": ("(osm_id=%s)")
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
def rating(tags, category):
	if category == "eat":
		countabletags = 0
		points = 0
		for key in ratingData:
			for value in ratingData[key]["values"]:
				if key in tags and tags[key] == value:
					countabletags += 1
					points += ratingData[key]["multiplicator"] * ratingData[key]["values"][value]
		if countabletags >= 2:
			if 0 >= points:
				return "red"
			elif 8 >= points:
				return "yellow"
			elif points >= 9:
				return "green"
	return "norating"
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
		data[elem_count]["category"] = "general"
		data[elem_count]["subcategory"] = subcategory
		data[elem_count]["filter"] = name
		data[elem_count]["osm_id"] = int(str(data[elem_count]["osm_id"]).replace("-", ""))
		for cat in tocategory:
			key, value = cat.split("=")
			if key in data[elem_count]["tags"] and data[elem_count]["tags"][key] == value:
				data[elem_count]["category"] = tocategory[cat]
		data[elem_count]["rating"] = rating(data[elem_count]["tags"], data[elem_count]["category"])
		elem_count += 1
	if len(data) == 0:
		data[elem_count] = {}
		data[elem_count]["notes"] = "No Data"
		data[elem_count]["filter"] = name
def createBboxQuery(bbox):
	bbox[0] = str(float(bbox[0]))
	bbox[1] = str(float(bbox[1]))
	bbox[2] = str(float(bbox[2]))
	bbox[3] = str(float(bbox[3]))
	return queryLookUp["bbox"][0].replace("%lon1", bbox[0]).replace("%lat1", bbox[1]).replace("%lon2", bbox[2]).replace("%lat2", bbox[3])
def preventHack(inp):
	for i in ["--", "/*", "*/", ";", "//"]:
		inp = inp.replace(i, "")
	return inp
def createFltrQuery(fltrs):
	output = []
	for fltr in fltrs.split(","):
		output.append(queryLookUp[fltr][0])
	return " AND ".join(output)
def anotherLookup(entry):
	if entry.startswith("id="):
		entry = entry.split("=")[1]
		osm_type = list(entry)[0]
		osm_id = entry.replace(osm_type, "")
		osm_type = osm_type.upper()
		if osm_type == "N":
			return sqls["singlenode"].replace("%id", osm_id), "singlenode", str(osm_type) + str(osm_id), "None"
		elif osm_type == "W":
			return sqls["singleway"].replace("%id", "-" + osm_id), "singleway", str(osm_type) + str(osm_id), "None"
		elif osm_type == "R":
			return sqls["singleway"].replace("%id", -1*(osm_id+1e17)), "singleway", str(osm_type) + str(osm_id), "None"
	elif entry.find(" | ") > -1:
		sql = sqls["advancedSearch"]
		args = []
		name, subcategory, fltr, bbox = entry.split(" | ")
		if name == "":
			args.append(createBboxQuery(bbox.split(",")))
		else:
			args.append(queryLookUp["directname"].replace("%s", preventHack(name)))
		if not subcategory == "all":
			args.append(queryLookUp[subcategory][0])
		if not fltr == "":
			args.append(createFltrQuery(fltr))
		sql = sql + " AND ".join(args)
		return sql, "advancedSearch", "None", "None"
def lookupQuery(name, bbox=None):
	if name in queryLookUp: 
		condition, mode, subcategory = queryLookUp[name]
		if not bbox == None:
			query = sqls[mode]
			return query.replace("%s", createBboxQuery(bbox)) + " AND (" + condition + ")", mode, name, subcategory
			#return sqls[mode].replace("%lon1", bbox[0]).replace("%lat1", bbox[1]).replace("%lon2", bbox[2]).replace("%lat2", bbox[3]).replace("%condition", condition), mode, name, subcategory
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
			errorCreation(name, "No Data")
		else:
			try:
				conn = psycopg2.connect(dbconnstr)
				cur = conn.cursor()
				cur.execute(query)
				result = cur.fetchall()
				convertToJSON(result, mode, name, subcategory, query)
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
	os.environ["LANG"] = "en_US.UTF-8"
	print("Content-Type:", "application/json;charset=utf-8\r\n\r\n", end="")
	if "HTTP_COOKIE" in environ:
		environ["HTTP_COOKIE"] = ""
	print(getData())


application(os.environ)
