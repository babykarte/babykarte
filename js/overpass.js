var debug_markerobj;
var markerStyles = {};
var area = {};
var zoomLevel = "";
var url = "https://overpass-api.de/api/interpreter";
var colorcode = {"yes": "color-green", "no": "color-red", "room": "color-green", "bench": "color-green", undefined: "color-grey", "limited": "color-yellow", "playground": "color-green"};
// 'undefined' is equal to 'tag does not exist'. In JS, 'undefined' is also a value
// '*' is a placeholder for notes from mappers and any other value (even 'undefined')
var PEP_data = {// PEP = Playground Equipment Popup
				"wheelchair": {"nameInherit": true, "applyfor": {"activity": true}, "values": ["yes", "limited", "no", "designated", undefined], "children": {}},
				"description": {"nameInherit": true, "applyfor": {"activity": true}, "values": [undefined, "*"], "children": {}},
				"min_age": {"nameInherit": true, "applyfor": {"activity": true}, "values": [undefined, "*"], "children": {}},
				"max_age": {"nameInherit": true, "applyfor": {"activity": true}, "values": [undefined, "*"], "children": {}},
				"material": {"nameInherit": true, "applyfor": {"activity": true}, "values": ["wood", "metal", "steel", "plastic", "rope", undefined], "children": {}},
				"capacity": {"nameInherit": true, "applyfor": {"activity": true}, "values": [undefined, "*"],
					"children":
						{"disabled": {"values": ["yes", "no", undefined, "*"]}}
						},
				"baby": {"nameInherit": true, "applyfor": {"activity": true}, "values": ["yes", "no", "only", undefined], "children": {}},
				"surface": {"nameInherit": true, "applyfor": {"activity": true}, "values": ["sand", "grass", "woodchips", "rubbercrumb", "tartan", "gravel", "paving_stones", "wood", "asphalt", undefined], "children": {}},
				"access": {"nameInherit": true, "applyfor": {"activity": true}, "values": ["yes", "no", "customers", "private", undefined], "children": {}},
		};
var PDV_babyTab = { //PDV = POI Details View
				"leisure": {"nameInherit": false, "applyfor": {"activity": true}, "values": ["playground", undefined], "triggers": function(data, local) {if (Object.keys(local.children).length == 0) {delete data["leisure"];} return data},
					"children": 
						{"playground:slide": {"values": ["yes", undefined]},
						"playground:swing": {"values": ["yes", undefined]},
						"playground:climbingframe": {"values": ["yes", undefined]},
						"playground:climbingwall": {"values": ["yes", undefined]},
						"playground:sledding": {"values": ["yes", undefined]},
						"playground:sandpit": {"values": ["yes", undefined]},
						"playground:seesaw": {"values": ["yes", undefined]},
						"playground:springy": {"values": ["yes", undefined]},
						"playground:playhouse": {"values": ["yes", undefined]},
						"playground:roundabout": {"values": ["yes", undefined]},
						"playground:multi_play": {"values": ["yes", undefined]},
						"playground:basketswing": {"values": ["yes", undefined]},
						"playground:structure": {"values": ["yes", undefined]},
						"playground:zipwire": {"values": ["yes", undefined]},
						"playground:balancebeam": {"values": ["yes", undefined]},
						"playground:water": {"values": ["yes", undefined]},
						"playground:trampoline": {"values": ["yes", undefined]},
						"playground:teenshelter": {"values": ["yes", undefined]},
						"playground:chain_ladder": {"values": ["yes", undefined]},
						"playground:hopscotch": {"values": ["yes", undefined]},
						"playground:climb_wall": {"values": ["yes", undefined]},
						"playground:tunnel_tube": {"values": ["yes", undefined]},
						"playground:chess_table": {"values": ["yes", undefined]},
						"playground:tree_house": {"values": ["yes", undefined]},
						"playground:basketball_backboards": {"values": ["yes", undefined]},
						"playground:cushion": {"values": ["yes", undefined]},
						"playground:Skate_equipment": {"values": ["yes", undefined]}
						}
				},
				"diaper": {"nameInherit": true, "applyfor": {"health": true, "eat": true, "shop": true, "changingtable": true}, "values": ["yes", "no", "room", "bench", undefined, "*"],											// diaper=yes|no|room|bench|undefined
					"children": 
						{"female": {"values": ["yes", "no", undefined]},		//		diaper:female=yes|no|undefined
						"male": {"values": ["yes", "no", undefined]},			//		diaper:male=yes|no|undefined
						"unisex": {"values": ["yes", "no", undefined]},			//		diaper:unisex=yes|no|undefined
						"fee": {"values": ["yes", "no", undefined]},			//		diaper:fee=yes|no|undefined
						"description": {"values": [undefined, "*"]}				//		diaper:description=undefined|* (implicit specification)
						}
				},
				"changing_table": {"nameInherit": true, "applyfor": {"health": true, "eat": true, "shop": true, "changingtable": true}, "triggers": function(data, local) {if (data.changing_table) {if (data.diaper) {delete data.diaper;}} return data;}, "values": ["yes", "no", "limited", undefined, "*"],		//changing_table=yes|no|limited|undefined
					"children":
						{"fee": {"values": ["yes", "no", undefined]},	//changing_table:fee=yes|no|undefined
						"location": {"values": ["wheelchair_toilet", "female_toilet", "male_toilet", "unisex_toilet", "dedicated_room", "room", "sales_area", undefined]},	//changing_table:location=wheelchair_toilet|female_toilet|male_toilet|unisex_toilet|dedicated_room|room|sales_area|undefined
						"description": {"values": [undefined, "*"]}	//changing_table:description=undefined|* (implicit specification)
						}
				},
				"highchair": {"nameInherit": true, "applyfor": {"eat": true}, "values": ["yes", "no", undefined, "*"]},					// highchair=yes|no|undefined|*
				"stroller": {"nameInherit": true, "applyfor": {"eat": true, "shop": true, "health": true, "changingtable": true}, "values": ["yes", "limited", "no", undefined],									// stroller=yes|limited|no|undefined
					"children": {"description": {"values" : [undefined, "*"]}}			//		stroller:description=undefined|* (implicit specification) (implicit specification)
				},
				"kids_area": {"nameInherit": true, "applyfor": {"eat": true, "shop": true}, "values": ["yes", "no", undefined],																// kids_area=yes|no|undefined
					"children":
						{"indoor" :  {"values": ["yes", "no", undefined]},		//		kids_area:indoor=yes|no|undefined
						"outdoor": {"values": ["yes", "no", undefined]},		//		kids_area:outdoor=yes|no|undefined
						"supervised": {"values": ["yes", "no", undefined]},		//		kids_area:supervised=yes|no|undefined
						"fee": {"values": ["yes", "no", undefined]}				//		kids_area:fee=yes|no|undefined
						}
				},
				"baby_feeding": {"nameInherit": true, "applyfor": {"eat": true, "shop": true, "changingtable": true}, "values": ["yes", "no", "room", undefined],							// baby_feeding=yes|no|room|undefined
					"children":
						{"female" : {"values": ["yes", "no", undefined]},		//		baby_feeding:female=yes|no|undefined
						"male" : {"values": ["yes", "no", undefined]}			//		baby_feeding:male=yes|no|undefined
						}
				}
			};
var ratingRules = {"max": 23, "green": {"default": 12, "color": "rating-green"}, "red": {"default": 18, "color": "rating-red"}};
var ratingData = {"diaper": {"multiplicator": 4,	// diaper=* 4
					"values" :
						{"yes": 2,				//     yes 2
						"no": 2}				//     no  2
					},
				"changing_table": {"multiplicator": 4,	// changing_table=* 4
					"values" :
						{"yes": 2,				//     yes 2
						"no": 2}				//     no  2
					},
				"highchair": {"multiplicator": 4,	// highchair=* 4  (POIs where you can get meal or something simliar)
					"values" :
						{"yes": 2,				//     yes 2
						"no": 2}				//     no  2
					},
				"kids_area": {"multiplicator": 2,	// kids_area=* 2
					"values" :
						{"yes": 2,				//     yes 2
						"no": 2}				//     no  2
					},
				"stroller": {"multiplicator": 1,	// stroller=* 1
					"values" :
						{"yes": 2,				//     yes 3
						"no": 2,				//     no  3
						"limited": 1}			//     limited 1 (green)
					}
			};
function locationFound(e) {
	//Fires the notification that Babykarte shows the location of the user.
	showGlobalPopup(getText().LOCATING_SUCCESS);
	progressbar();
}
function locationError(e) {
	//Fires the notification that Babykarte shows NOT the location of the user, because it has no permission to do so.
	showGlobalPopup(getText().LOCATING_FAILURE);
	progressbar();
}
function createSQL(bbox, fltr) {
	var andquery = "(";
	for (var value in filter[fltr].query) {
		var content = filter[fltr].query[value];
		var name = value.trim();
		name = value.split("|");
		for (var type in name) {
			andquery += name[type].replace(RegExp("_", "g"), "");
			for (var i in content) {
				andquery += content[i];
			}
			andquery += "(" + bbox + ");"
		}
	}
	return andquery + ");";
}
function roundIt(number) {
	number = String(number)
	console.log(Number(number.slice(0, 5)));
	return Number(number.slice(0, 5))
}
function locateNewArea(fltr) {
	//Complex algorithm. It calculates the coordinates when the user moves the map. Then the coordinates will be used to fetch just more POIs without overwriting/overlaying the existing ones.
	//NORTH: Number increases when moving to the top (North)
	//SOUTH: Number decreases when moving to the bottom (South)
	//WEST: Number decreases when moving to the left (West)
	//EAST: Number increases when moving to the right (East)
	//LB: little box
	var result = "";
	var north_new = Number(map.getBounds().getNorth());
	var east_new = Number(map.getBounds().getEast());
	var south_new = Number(map.getBounds().getSouth());
	var west_new = Number(map.getBounds().getWest());
	south_new = roundIt(south_new); //Number(south_new.toFixed(2));
	west_new = roundIt(west_new); //Number(west_new.toFixed(2));
	east_new = roundIt(east_new); //Number(east_new.toFixed(2));
	north_new = roundIt(north_new); //Number(north_new.toFixed(2));
	var size = Number(0.02);
	var LBs_vertical = roundIt(Number(north_new - south_new)/size ) //Number(Number((north_new - south_new) / size).toFixed());
	var LBs_horizontal = roundIt(Number(east_new - west_new)/size ) //Number(Number((east_new - west_new) / size).toFixed());
	console.log(south_new)
	for (var i = 0;i <= LBs_vertical;i++) {
		console.log(south_new);
		for (var u = 0;u < LBs_horizontal;u++) {
			console.log("  ", west_new);
			if (!filter[fltr].littleboxes[String(south_new) + "+" + String(west_new)]) {
				//var result2 = createSQL(south_new + "," + west_new + "," +  Number(Number(south_new + size).toFixed(2)) + "," +  Number(Number(west_new + size).toFixed(2)), fltr);
				var result2 = createSQL(south_new + "," + west_new + "," + Number(south_new + size) + "," +  Number(west_new + size), fltr);
				result += result2;
				filter[fltr].littleboxes[String(south_new) + "+" + String(west_new)] = true;
			}
			west_new += size;
			west_new = Number(west_new); //Number(Number(west_new).toFixed(2));
		}
	south_new += size;
	south_new = Number(south_new); //Number(Number(south_new).toFixed(2));
	}
	if (result) {
		return result;
	} else {
		return false;
	}
}
function locateNewAreaBasedOnFilter() {
	//Wrapper around locateNewArea().
	//Adds filter compactibility to locateNewArea() function.
	var url = "";
	var result = "";
	for (var fltr in activeFilter) {
		result = locateNewArea(fltr);
		if (result) {
			url += result
		}
		url = url.replace(");(", "") //Removes the delimiter between Overpass union syntax, because we want to have just one 'union' tag. Combines two (or more 'union's (we're in a loop)) into one.
		fltr++;
	}
	return url
}
function onMapMove() {
	loadPOIS("", locateNewAreaBasedOnFilter());
}
function parseOpening_hours(value) {
	if (!value) {
		return value;
	}
	//Parsing opening hours syntax of OSM.
	// var toTranslate = {"<OSM expression>": "<human expression, will be shown to user instead of <OSM expression>>", ...}
	var toTranslate = getText().opening_hours;
	var syntaxToHTML = {"; " : "<br/>", ";" : "<br/>",  "," : ", ", "-" : " - "}
	//Translates by replacing <OSM expression>'s with the respective <human expression>'s.
	for (var item in toTranslate) {
		if (value.indexOf("%" + item) == -1) {
			value = value.replace(new RegExp(item, "g"), "<b>%" + toTranslate[item] + "</b>");
		}
	}
	value = value.replace(new RegExp("%", "g"), "");
	//Do some translating of special command chars into HTML code or beautiful looking human speech.
	for (var item in syntaxToHTML) {
		value = value.replace(new RegExp(item, "g"), "<b>" + syntaxToHTML[item] + "</b>");
	}
   	return value
}
function addrTrigger_intern(poi, marker) {
	if (marker.popupContent.indexOf("%data_address%") > -1) {
		$.get("https://nominatim.openstreetmap.org/reverse?accept-language=" + languageOfUser + "&format=json&osm_type=" + String(poi.type)[0].toUpperCase() + "&osm_id=" + String(poi.id), function(data, status, xhr, trash) {
			var content = "";
			var address = data["address"];
			if (address) {
				var street = address["road"] || address["pedestrian"] || address["street"] || address["footway"] || address["path"] || address["address26"] || getText().PDV_STREET_UNKNOWN;
				var housenumber = address["housenumber"] || address["house_number"] || getText().PDV_HOUSENUMBER_UNKNOWN;
				var postcode = address["postcode"] || getText().PDV_ZIPCODE_UNKNOWN;
				var city = address["city"] || address["town"] || address["county"] || address["state"] || getText().PDV_COMMUNE_UNKNOWN;
				content = street + " " + housenumber + "<br/>" + postcode + " " + city;
			} else {
				content = "<i><span style='color:red;'>" + getText().PDV_ADDRESS_UNKNOWN + "</span></i>";
			}
			marker.popupContent = marker.popupContent.replace("%data_address%", content);
			marker.bindPopup(marker.popupContent);
		});
	}
}
function addrTrigger(poi, marker) {
	var timeout = setTimeout(addrTrigger_intern, 500, poi, marker);
	return "%data_address%";
}
function toggleTab(bla, id) {
	var tab = document.getElementById(id);
	var icon = document.getElementById("icon" + id);
	if (icon.classList.contains("inactive") == true) {
		return 0;
	}
	if (!bla) {
		tab.setAttribute("active", true);
		return 0;
	}
	var tabs = document.getElementsByClassName("tabcontent");
	var icons = document.getElementsByClassName("pdv-icon");
	for (var item = 0;item < tabs.length;item++) {
		tabs[item].style.display = "none";
		if (bla.id.endsWith(icons[item].id)) {
			icons[item].setAttribute("active", true);
		} else {
			icons[item].removeAttribute("active");
		}
	}
	tab.style.display = "block";
}
function addrTab(poi, prefix , condition, symbol, nounicode) {
	var result = eval(condition);
	if (nounicode == true) {
		symbol = "<img class='small-icon' src='" + symbol + "' />";
	} else {
		symbol = "<span class='small-icon'>" + symbol + "</span>";
	}
	if (result.startsWith("www.") && !prefix.startsWith("mail")) {result = "http://" + result}
	return "<div class='grid-container'><a class='nounderlinestyle' target='_blank' href='" + prefix  + result + "'>" + symbol + "'</a><a target='_blank' href='"+ prefix + result + "'>" + result + "</a></div>\n";
}
function processContentDatabase_intern(marker, poi, database, tag, values, data, parent) {
	if (!parent) {parent = tag;}
	for (var i in values) {
		var title;
		if (values[i] == "*" || poi.tags[tag] == values[i] || poi.tags[tag] && poi.tags[tag].indexOf(values[i]) > -1) {
			var langcode = tag.replace("_", "").replace(":", "_");
			if (values[i] == undefined) {
				langcode += "_UNKNOWN";
			} else {
				langcode += "_" + values[i].replace("_", "").replace(":", "_");;
			}
			if (database[parent].applyfor[marker.category.split(" ")[0]]) {
				title = getText("PDV_" + langcode.toUpperCase()) || undefined;
				if (title != undefined && title.indexOf("%s") > -1 && poi.tags[tag]) {
					title = title.replace("%s", poi.tags[tag]);
				} else if (title != undefined && title.indexOf("%s") > -1) {
					title = undefined;
				}
			}
			if (title != undefined) {
				data.title = title;
				data.color = colorcode[values[i]] || "";
				break;
			} else {
				if (tag.endsWith("description") && poi.tags[tag] != undefined) {
					data.title = "\"" + poi.tags[tag] + "\"";
					break;
				} else {
					data.title = "NODISPLAY";
				}
			}
		} else {
			data.title = "NODISPLAY";
			data.color = "";
		}
		i += 1;
	}
	return data
}
function processContentDatabase(marker, poi, database) {
	var data = {};
	var output = "";
	for (var tag in database) {
		var values = database[tag].values;
		var children = database[tag].children;
		data[tag] = {};
		data[tag].children = {};
		data[tag] = processContentDatabase_intern(marker, poi, database, tag, values, data[tag]);
		for (var child in children) {
			var childname = child;
			data[tag].children[child] = {};
			if (database[tag].nameInherit) {childname = tag + ":" + child}
			data[tag].children[child] = processContentDatabase_intern(marker, poi, database, childname,  database[tag].children[child].values, data[tag].children[child], tag)
			
			if (data[tag].children[child].title == "NODISPLAY") {
				delete data[tag].children[child];
			}
		}
	}
	for (var tag in database) {
		if (database[tag].triggers) {data = database[tag].triggers(data, data[tag]);}
	}
	for (var tag in data) {
		if (Object.keys(data[tag].children).length == 0 || Object.keys(data[tag]).length == 0) {
			output += "<ul><li class='" + data[tag].color + "'>" + data[tag].title + "</li></ul>\n";
		} else {
			output += "<details><summary class='" + data[tag].color + "'>" + data[tag].title + "</summary>\n<div>\n%content</div>\n</details>\n";
			var childrenHTML = "";
			if (data[tag].title != "NODISPLAY") {
				for (var child in data[tag].children) {
					childrenHTML += "<ul><li>" + data[tag].children[child].title + "</li></ul>\n";
				}
			}
			output = output.replace("%content", childrenHTML);
		}
	}
	var result = output.split("\n");
	output = ""
	for (var i in result) {if (result[i].indexOf("NODISPLAY") == -1) {output += result[i];}}
	objref = data;
	return output;
}
function ratePOI(marker, poi) {
	var i;
	if (!poi.rating) {poi.rating = {};poi.rating.green = 0;poi.rating.red = 0;}
	if (!filter[marker.fltr].category.startsWith("eat")) {return poi;}
	for (i in ratingData) {
		var value = poi.tags[i];
		if (value == undefined) {
			poi.rating.green += 0;
			poi.rating.red += 0;
		} else {
			var points = ratingData[i].multiplicator * ratingData[i].values[value] || 0;
			poi.rating.green += ((value == "yes" || value == "limited") ? points : 0);
			poi.rating.red += ((value == "no" || value == "limited") ? points : 0);
		}
	}
	return poi;
}
function determineRateColor(poi) {
	var exception = {"yellow": {"default": 6, "color": "rating-yellow"}};
	var i, u;
	var colours = [];
	for (i in ratingRules) {
		if (poi.rating[i]) {
			if (poi.rating[i] >= ratingRules[i].default) {
				colours.push(ratingRules[i]);
			} else if (poi.rating[i] >= exception.yellow.default) {
				colours.push(exception.yellow);
			}
		}
	}
	if (colours.length == 2) {
		return exception.yellow.color;
	} else if (colours.length == 0) {
		return false;
	} else {
		return colours[0].color;
	}
}
function addMarkerIcon(poi, marker) {
	var iconObject = JSON.parse(JSON.stringify(markerStyles[filter[marker.fltr].markerStyle]));
	var result = determineRateColor(poi);
	if (marker.color != "default") {
		iconObject.html = iconObject.html.replace("#004387", marker.color);
	}
	if (result) {iconObject.html = iconObject.html.replace("rating-default", result)}
	iconObject = L.divIcon(iconObject) //Creates the colourized marker icon
	var markerObject = L.marker([poi.lat, poi.lon], {icon: iconObject}); //Set the right coordinates
	marker = $.extend(true, markerObject, marker); //Adds the colourized marker icon
	filter[marker.fltr].layers.push(marker); //Adds the POI to the filter's layers list.
	return marker;
}
function getRightPopup(marker, usePopup) {
	marker = marker.target;
	var poi = marker.data;
	var name = getSubtitle(poi);
	marker.name = name || getText().filtername[marker.fltr]; //Sets the subtitle which appears under the POI's name as text in grey
	var popup = {"POIpopup": 
		{"home": {"content": `<h1>${ ((poi.tags["name"] == undefined) ? ((poi.tags["amenity"] == "toilets") ? getText().TOILET : getText().PDV_UNNAME) : poi.tags["name"]) }</h1><h2>${  String(marker.name) }</h2><address id='address${poi.classId}'>${addrTrigger(poi, marker)}</address>`, "symbol": "🏠", "title": getText().PDV_TITLE_HOME, "active": true, "default": true},
		"baby": {"content": `${processContentDatabase(marker, poi, PDV_babyTab)}`, "symbol": "👶", "title": getText().PDV_TITLE_BABY, "active": true},
		"opening_hours": {"content": `${ parseOpening_hours(poi.tags["opening_hours"]) || "NODISPLAY" }`, "symbol": "🕰️", "title": getText().PDV_TITLE_OH, "active": true},
		"contact" : {"content": `${ addrTab(poi, "", "poi.tags['website'] || poi.tags['contact:website'] || 'NODISPLAY'", "🌍") }${ addrTab(poi, "tel:", "poi.tags['phone'] || poi.tags['contact:phone'] || 'NODISPLAY'", "☎️") }${ addrTab(poi, "mailto:", "poi.tags['email'] || poi.tags['contact:email'] || 'NODISPLAY'", "📧") }${ addrTab(poi, "", "((poi.tags['facebook'] != undefined) ? ((poi.tags['facebook'].indexOf('/') > -1) ? poi.tags['facebook'] : ((poi.tags['facebook'] == -1) ? 'https://www.facebook.com/' + poi.tags['facebook'] : undefined)) : ((poi.tags['contact:facebook'] != undefined) ? ((poi.tags['contact:facebook'].indexOf('/') > -1) ? poi.tags['contact:facebook'] : ((poi.tags['contact:facebook'] == -1) ? 'https://www.facebook.com/' + poi.tags['contact:facebook'] : 'NODISPLAY')) : 'NODISPLAY'))", "/images/facebook-logo.svg", true) }`, "symbol": "📧", "title": getText().PDV_TITLE_CONTACT, "active": true},
		"furtherInfos": {"content": `<b>${ getText().PDV_OPERATOR }:</b><br/> ${ ((poi.tags["operator"]) ? poi.tags["operator"] + "<br/>" : "NODISPLAY") }\n<b>${ getText().PDV_DESCRIPTION }:</b><br/>"${ ((poi.tags["description:" + languageOfUser]) ? getText().PDV_DESCRIPTION + ": " + poi.tags["description:" + languageOfUser] : ((poi.tags["description"]) ? getText().PDV_DESCRIPTION + ": " + poi.tags["description"] : "NODISPLAY")) }"<br/>\n<a target='_blank' href='${ "https://www.openstreetmap.org/" + String(poi.type).toLowerCase() + "/" + String(poi.id) }'>${ getText().LNK_OSM_VIEW }</a><br/>\n<a href='${ "geo:" + poi.lat + "," + poi.lon }'>${ getText().LNK_OPEN_WITH }</a>`, "symbol": "ℹ️", "title": getText().PDV_TITLE_MI, "active": true}
		},
	"playgroundPopup":
		{"home": {"content": `<h1>${ ((poi.tags["name"] != undefined) ? poi.tags["name"] : marker.name) }</h1><h2>${ ((poi.tags["name"] == undefined) ? "" : marker.name) }</h2>${ processContentDatabase(marker, poi, PEP_data) }`, "symbol": "🏠", "title": getText().PDV_TITLE_HOME, "active": true, "default": true},
		"furtherInfos": {"content": `<a target='_blank' href='${ "https://www.openstreetmap.org/" + String(poi.type).toLowerCase() + "/" + String(poi.id) }'>${ getText().LNK_OSM_VIEW }</a><br/>\n<a href='${ "geo:" + poi.lat + "," + poi.lon }'>${ getText().LNK_OPEN_WITH }</a>`, "symbol": "ℹ️", "title": getText().PDV_TITLE_MI, "active": true}
		}
	};
	createDialog(marker, poi, popup[usePopup]);
}
function createDialog(marker, poi, details_data) {
	var popupContent = "";
	var popupContent_header = "";
	for (var entry in details_data) {
		var tabContent = "";
		var defaultOpen = "";
		var content = details_data[entry].content;
		content = content.split("\n");
		if (details_data[entry].default == true) {
			defaultOpen = "style='display:block;'"
		}
		popupContent += "<div class='tabcontent' id='" + poi.classId + entry + "' " + defaultOpen + ">";
		for (var i in content) {
			var tmp = "";
			var result = "";
			result += content[i];
			if (result.indexOf("NODISPLAY") > -1) {result = "";}
				tabContent += result;
			}
		if (tabContent == "") {
			details_data[entry].active = false;
		} else {
			popupContent += tabContent;
		}
		popupContent += "</div>";
	}
	popupContent_header += "<div style='display:flex;height:50px;'>";
	for (var entry in details_data) {
		var classList = "pdv-icon active";
		var symbol = details_data[entry].symbol;
		if (!details_data[entry].active) {
			classList = "pdv-icon inactive";
		}
		if (symbol.startsWith("/")) {
			popupContent_header += "<img class='" + classList + "' id='icon" + poi.classId + entry + "' onclick='toggleTab(this, \"" + poi.classId + entry + "\")' src='" + symbol + "' alt='" + details_data[entry].title + "' title='" + details_data[entry].title + "' />";
		} else {
			popupContent_header += "<div class='" + classList + "' id='icon" + poi.classId + entry + "' onclick='toggleTab(this, \"" + poi.classId + entry + "\")' alt='" + details_data[entry].title + "' title='" + details_data[entry].title + "' />" + symbol + "</div>";
		}
	}
	popupContent_header += "</div>";
	marker.popupContent = popupContent_header + popupContent + "<hr/><a target=\"_blank\" href=\"https://www.openstreetmap.org/edit?" + String(poi.type) + "=" + String(poi.id) + "\">" + getText().LNK_OSM_EDIT + "</a>&nbsp;&nbsp;<a target=\"_blank\" href=\"https://www.openstreetmap.org/note/new#map=17/" + poi.lat + "/" + poi.lon + "&layers=N\">" + getText().LNK_OSM_REPORT + "</a>";
	marker.bindPopup(marker.popupContent);
	debug_markerobj = marker;
	setTimeout(function() {debug_markerobj.openPopup();}, 100); //workaround for a Bug in Leaflet;
} 
function loadPOIS(e, post) {
	hideFilterListOnMobile();
	progressbar(50);
	//Main function of POI loading.
	//Handles connection to OSM Overpass server and parses the response into beautiful looking details views for each POI
	if (!post) {
		//No data to send was specified, because none of the filter functions called it.
		post = locateNewAreaBasedOnFilter();
		if (!post) {
			progressbar();
			return 0;
		}
	}
	//Connect to OSM server
	post = "[out:json][timeout:50];" + post + "out body center;";
	getData(url, "json", post, undefined, function (osmDataAsJson) {
		//Go throw all elements (ways, relations, nodes) sent by Overpass
		for (var poi in osmDataAsJson.elements) {
			var marker;
			poi = osmDataAsJson.elements[poi];
			if (!poi.tags) {poi.tags = {};}
			if (poi.center != undefined) {
				poi.lat = poi.center.lat;
				poi.lon = poi.center.lon;
			}
			//creates a new Marker() Object, put data in it, determine the right filter and do the rating (add yellow, green or a red dot on the icon).
			marker = groupIntoLayers(poi);
			
			poi = ratePOI(marker, poi);
			marker = addMarkerIcon(poi, marker);
			marker.data = poi;
			marker.data.classId = String(poi.type)[0].toUpperCase() + String(poi.id);
			//marker.once("click", function(marker) {getRightPopup(marker, filter[marker.target.fltr].popup);});
			marker.on("click", function(event) {getRightPopup(event, filter[event.target.fltr].popup)});
			//Add marker to map
			map.addLayer(marker);
			/*if (poi.lat == saved_lat && poi.lon == saved_lon) {
				addrTrigger_intern(poi, marker);
			}*/
		}
		progressbar();
	}, "POST");
}
function getStateFromHash() {
	var hash = location.hash;
	if (hash != "") {
		hash = hash.replace("#", "").split("&");
		if (String(Number(hash[0])) == "NaN") {
			languageOfUser = hash[0];
			zoomLevel = Number(hash[1]);
			saved_lat = Number(hash[2]);
			saved_lon = Number(hash[3]);
		} else {
			zoomLevel = Number(hash[0]);
			saved_lat = Number(hash[1]);
			saved_lon = Number(hash[2]);
		}
		map.setView([saved_lat, saved_lon], zoomLevel);
	}
}
function requestLocation() {map.locate({setView: true, zoom: zoomLevel});}


//init map
progressbar(30);
var map = L.map('map');
map.setView([saved_lat, saved_lon], 15);
getStateFromHash();
map.on("locationfound", locationFound);
map.on("locationerror", locationError);
map.on("click", function(e) {location.hash = String(map.getZoom()) + "&" + String(e.latlng.lat) + "&" + String(e.latlng.lng);})
map.on("moveend", onMapMove);
var Layergroup = new L.LayerGroup();
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  minZoom: 10,
  attribution: 'Map data &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Map Tiles &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

progressbar();

zoomLevel = String(map.getZoom());
loadLang("", languageOfUser);

getData("/markers/marker.svg", "text", "", undefined, function (data) {markerStyles["marker"] = {iconSize: [31, 48], popupAnchor: [4, -32], iconAnchor: [12, 45], className: "leaflet-marker-icon leaflet-zoom-animated leaflet-interactive", html: "<svg style='width:25px;height:41px;'>" + data + "</svg>"} /* Caches the marker for later altering (change of its colour for every single individual filter) */}); //Triggers the loading and caching of the marker icon at startup of Babykarte
getData("/markers/dot.svg", "text", "", undefined, function (data) {markerStyles["dot"] = {iconSize: [20, 20], popupAnchor: [0, 0], iconAnchor: [10, 10], className: "leaflet-marker-icon leaflet-zoom-animated leaflet-interactive", html: "<svg style='width:20px;height:20px;'>" + data + "</svg>"}; /* Caches the marker for later altering (change of its colour for every single individual filter) */}); //Triggers the loading and caching of the marker icon at startup of Babykarte
