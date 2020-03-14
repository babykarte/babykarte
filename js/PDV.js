var colorcode = {"yes": "color-green", "no": "color-red", "room": "color-green", "bench": "color-green", undefined: "color-grey", "limited": "color-yellow", "playground": "color-green", "*": "color-green"};
// 'undefined' is equal to 'tag does not exist'. In JS, 'undefined' is also a value
// '*' is a placeholder for notes from mappers and any other value (even 'undefined')
var tocategory = {
	"healthcare=doctor": ["health", "POIpopup"],
	"healthcare=hospital": ["health", "POIpopup"],
	"healthcare=midwife": ["health", "POIpopup"],
	"healthcare=birthing_center": ["health", "POIpopup"],
	"amenity=toilets": ["childcare", "POIpopup"],
	"amenity=cafe": ["eat", "POIpopup"],
	"amenity=restaurant": ["eat", "POIpopup"],
	"amenity=fast_food": ["eat", "POIpopup"],
	"amenity=kindergarten": ["eat", "POIpopup"],
	"amenity=childcare": ["childcare", "POIpopup"],
	"leisure=playground": ["activity", "POIpopup"],
	"playground=*": ["playground-equipment", "playgroundPopup"],
	"leisure=park": ["activity", "POIpopup"],
	"tourism=zoo": ["activity", "POIpopup"],
	"shop=baby_goods": ["shop", "POIpopup"],
	"shop=toys": ["shop", "POIpopup"],
	"shop=clothes": ["shop", "POIpopup"],
	"shop=chemist": ["shop", "POIpopup"],
	"shop=supermarket": ["shop", "POIpopup"]
}
var PEP_data = {// PEP = Playground Equipment Popup
				"wheelchair": {"nameInherit": true, "applyfor": {"activity": true}, "values": ["yes", "limited", "no", "designated", undefined], "children": {}},
				"description": {"nameInherit": true, "applyfor": {"activity": true}, "values": [undefined, "*"], "children": {}},
				"min_age": {"nameInherit": true, "applyfor": {"activity": true}, "values": [undefined, "*"], "children": {}},
				"max_age": {"nameInherit": true, "applyfor": {"activity": true}, "values": [undefined, "*"], "children": {}},
				"material": {"nameInherit": true, "applyfor": {"activity": true}, "values": ["wood", "metal", "steel", "plastic", "rope", undefined], "children": {}},
				"capacity": {"nameInherit": true, "applyfor": {"activity": true}, "values": [undefined, "*"],
					"children":
						{"disabled": {"values": ["yes", "no", undefined]}}
						},
				"baby": {"nameInherit": true, "applyfor": {"activity": true}, "values": ["yes", "no", "only", undefined], "children": {}},
				"surface": {"nameInherit": true, "applyfor": {"activity": true}, "values": ["sand", "grass", "woodchips", "rubbercrumb", "tartan", "gravel", "paving_stones", "wood", "asphalt", undefined], "children": {}},
				"access": {"nameInherit": true, "applyfor": {"activity": true}, "values": ["yes", "no", "customers", "private", undefined], "children": {}},
		};
var PDV_contact = { //PDV = POI Details View
				"contact:website": {"nameInherit": false, "values": [undefined, "*"], "applyfor": {"shop": true, "eat": true, "health": true}, "symbol": "🌍"},
				"contact:email": {"nameInherit": false, "values": [undefined, "*"], "applyfor": {"shop": true, "eat": true, "health": true}, "symbol": "📧"},
				"contact:facebook": {"nameInherit": false, "values": [undefined, "*"], "applyfor": {"shop": true, "eat": true, "health": true}, "symbol": "images/facebook-logo.svg"},
				"contact:phone": {"nameInherit": false, "values": [undefined, "*"],  "applyfor": {"shop": true, "eat": true, "health": true}, "symbol": "☎️"},
				"website": {"nameInherit": false, "values": [undefined, "*"],  "applyfor": {"shop": true, "eat": true, "health": true}, "symbol": "🌍"},
				"email": {"nameInherit": false, "values": [undefined, "*"],  "applyfor": {"shop": true, "eat": true, "health": true}, "symbol": "📧"},
				"facebook": {"nameInherit": false, "values": [undefined, "*"],  "applyfor": {"shop": true, "eat": true, "health": true}, "symbol": "images/facebook-logo.svg"},
				"phone": {"nameInherit": false, "values": [undefined, "*"],  "applyfor": {"shop": true, "eat": true, "health": true}, "symbol": "☎️"},
}
var PDV_baby = { //PDV = POI Details View
				"leisure": {"nameInherit": false, "applyfor": {"activity": true}, "values": ["playground", undefined], "triggers": function(data, local) {if (Object.keys(local.children).length == 0) {delete data["leisure"];} return data}, "symbol": "&nbsp;",
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
				"diaper": {"nameInherit": true, "applyfor": {"health": true, "eat": true, "shop": true, "changingtable": true}, "symbol": "changingtable", "values": ["yes", "no", "room", "bench", undefined, "*"],											// diaper=yes|no|room|bench|undefined
					"children": 
						{"female": {"values": ["yes", "no", undefined]},		//		diaper:female=yes|no|undefined
						"male": {"values": ["yes", "no", undefined]},			//		diaper:male=yes|no|undefined
						"unisex": {"values": ["yes", "no", undefined]},			//		diaper:unisex=yes|no|undefined
						"fee": {"values": ["yes", "no", undefined]}/*,			//		diaper:fee=yes|no|undefined
						"description": {"values": [undefined, "*"]}*/				//		diaper:description=undefined|* (implicit specification)
						}
				},
				"changing_table": {"nameInherit": true, "applyfor": {"health": true, "eat": true, "shop": true, "changingtable": true}, "triggers": function(data, local) {if (data.changing_table) {if (data.diaper) {delete data.diaper;}} return data;}, "symbol": "changingtable", "values": ["yes", "no", "limited", undefined, "*"],		//changing_table=yes|no|limited|undefined
					"children":
						{"fee": {"values": ["yes", "no", undefined]},	//changing_table:fee=yes|no|undefined
						"location": {"values": ["wheelchair_toilet", "female_toilet", "male_toilet", "unisex_toilet", "dedicated_room", "room", "sales_area", undefined]}/*,	//changing_table:location=wheelchair_toilet|female_toilet|male_toilet|unisex_toilet|dedicated_room|room|sales_area|undefined
						"description": {"values": [undefined, "*"]}*/	//changing_table:description=undefined|* (implicit specification)
						}
				},
				"highchair": {"nameInherit": true, "applyfor": {"eat": true}, "symbol": "highchair", "values": ["yes", "no", undefined, "*"]},					// highchair=yes|no|undefined|*
				"stroller": {"nameInherit": true, "applyfor": {"eat": true, "shop": true, "health": true, "changingtable": true}, "symbol": "stroller", "values": ["yes", "limited", "no", undefined],									// stroller=yes|limited|no|undefined
					"children": {"description": {"values" : [undefined, "*"]}}			//		stroller:description=undefined|* (implicit specification) (implicit specification)
				},
				"kids_area": {"nameInherit": true, "applyfor": {"eat": true, "shop": true}, "symbol": "ball", "values": ["yes", "no", undefined],																// kids_area=yes|no|undefined
					"children":
						{"indoor" :  {"values": ["yes", "no", undefined]},		//		kids_area:indoor=yes|no|undefined
						"outdoor": {"values": ["yes", "no", undefined]},		//		kids_area:outdoor=yes|no|undefined
						"supervised": {"values": ["yes", "no", undefined]},		//		kids_area:supervised=yes|no|undefined
						"fee": {"values": ["yes", "no", undefined]},			//		kids_area:fee=yes|no|undefined
						"description": {"values" : [undefined, "*"]}			//		kids_area:description=*
						}
				},
				"baby_feeding": {"nameInherit": true, "applyfor": {"eat": true, "shop": true, "changingtable": true}, "symbol": "&#129329;", "values": ["yes", "no", "room", undefined],							// baby_feeding=yes|no|room|undefined
					"children":
						{"female" : {"values": ["yes", "no", undefined]},		//		baby_feeding:female=yes|no|undefined
						"male" : {"values": ["yes", "no", undefined]}			//		baby_feeding:male=yes|no|undefined
						}
				}
			};
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
function formataddrdata(poi, address) {
	var content = "";
	if (address) {
		var street = address["addr:street"] || address["road"] || address["pedestrian"] || address["street"] || address["footway"] || address["path"] || address["address26"] || getText().PDV_STREET_UNKNOWN;
		var housenumber = address["addr:housenumber"] || address["housenumber"] || address["house_number"] || "";
		var postcode = address["addr:postcode"] || address["postcode"] || getText().PDV_ZIPCODE_UNKNOWN;
		var city = address["addr:city"] || address["city"] || address["town"] || address["county"] || address["state"] || getText().PDV_COMMUNE_UNKNOWN;
		housenumber = ((housenumber != "") ? " " + housenumber : "")
		content = street + housenumber + ", " + postcode + " " + city;
	} else {
		content = `<i><a href='${ "geo:" + poi.lat + "," + poi.lon }'>${ getText().LNK_OPEN_WITH }</a></i>`;
	}
	return content;
}
function addrTrigger_intern(poi, marker) {
	if (marker.popupContent.indexOf(getText().PDV_ADDRESS_LOADING) > -1) {
		$.get("https://nominatim.openstreetmap.org/reverse?accept-language=" + languageOfUser + "&format=json&osm_type=" + String(poi.type)[0].toUpperCase() + "&osm_id=" + String(poi.osm_id), function(data, status, xhr, trash) {
			$("#address").html(formataddrdata(poi, data["address"]));
		});
	}
}
function addrTrigger(poi, marker, mode) {
	var tmp = formataddrdata(poi, poi.tags);
	if (tmp.indexOf(getText().PDV_STREET_UNKNOWN) > -1 || tmp.indexOf(getText().PDV_COMMUNE_UNKNOWN) > -1 || tmp.indexOf(getText().PDV_ZIPCODE_UNKNOWN)) {
		var timeout = setTimeout(addrTrigger_intern, 500, poi, marker);
		return getText().PDV_ADDRESS_LOADING;
	}
	return tmp;
}
function processContentDatabase_intern(marker, poi, database, tag, values, data, parent) {
	if (!parent) {parent = tag;}
	for (var i in values) {
		var title;
		if (values[i] == "*" && poi.tags[tag] || poi.tags[tag] == values[i] || poi.tags[tag] && poi.tags[tag].indexOf(values[i]) > -1) {
			var langcode = tag.replace("_", "").replace(":", "_");
			if (values[i] == undefined) {
				langcode += "_UNKNOWN";
			} else {
				langcode += "_" + values[i].replace("_", "").replace(":", "_")
			}
			if (database[parent].applyfor[marker.category]) {
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
					break;
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
	for (var tag in data) {
		if (data[tag].title == "NODISPLAY") {
			delete data[tag];
		} 
	}
	for (var tag in data) {
		if (database[tag].triggers) {data = database[tag].triggers(data, data[tag]);}
	}
	return data;
}
function babyfriendliness_text(marker, data, database) {
	var output = "";
	for (var tag in data) {
		if (Object.keys(data[tag].children).length == 0 || Object.keys(data[tag]).length == 0) {
			output += "<ul><li class='" + data[tag].color + "'>" + data[tag].title + "</i></ul>"
		} else {
			output += "<ul><li class='" + data[tag].color + "'>" + data[tag].title;
			var content = ""
			if (data[tag].title != "NODISPLAY") {
				for (var child in data[tag].children) {
					if (content == "") {
						data[tag].children[child].title = data[tag].children[child].title.replace(data[tag].children[child].title[0], data[tag].children[child].title[0].toUpperCase()) + "\n";
					}
					if (content != "") {content += ", "}
					content += data[tag].children[child].title + "\n";
				}
			}
			output += " (\n" + content.trim() + "\n)"; 
			output += "</i></ul>";
		}
	}
	var result = output.split("\n");
	output = ""
	for (var i in result) {
		if (result[i].indexOf("NODISPLAY") == -1) {
			output += result[i];
		}
	}
	return output;
}
function babyfriendliness_symbol(marker, data, database) {
	var output = "";
	var changingTable = false;
	for (var tag in database) {
		if (!database[tag].applyfor[marker.category]) {
			continue;
		}
		if (data["changing_table"] && !data["diaper"] && tag == "diaper" || !data["changing_table"] && data["diaper"] && tag == "changing_table" || data["leisure"] && !data["kids_area"] && tag == "kids_area" || !data["leisure"] && data["kids_area"] && tag == "leisure") {} else {
			if (!data[tag]) {
				data[tag] = {}
				data[tag].color = colorcode.undefined;
			}
			if (database[tag].symbol.indexOf("/") > -1) {
				output += "\n<img src='" + database[tag].symbol + "' class='small-icon' />\n";
			} else if (database[tag].symbol.startsWith("&") == false) {
				output += "\n<svg class='small-icon' title='" + data[tag].title + "' alt='" + data[tag].title + "'>" + symbols[database[tag].symbol].html.replace(new RegExp("rating-color", "g"), data[tag].color) + "</svg>\n"
			} else {
				output += "\n<svg class='small-icon " + data[tag].color + "' title='" + data[tag].title + "' alt='" + data[tag].title + "'>" + database[tag].symbol + "</svg>\n"
			}
		}
	}
	return output;
}
function contact_text(marker, data, database) {
	var output = "";
	for (var tag in data) {
		var url = ((tag.endsWith("phone")) ? "tel:" + data[tag].title : ((tag.endsWith("email")) ? "mailto:" + data[tag].title : ((tag.endsWith("facebook") && !data[tag].title.startsWith("http:")) ? "https://facebook.com/" + data[tag].title : data[tag].title)));
		output += "\n<ul><li><a href='" + url + "' rel='noopener' style='text-align:justify;' target='_blank'>" + data[tag].title + "</a></li></ul>\n"
	}
	var result = output.split("\n");
	output = ""
	for (var i in result) {
		if (result[i].indexOf("NODISPLAY") == -1) {
			output += result[i];
		}
	}
	return output;
}
function contact_symbol(marker, data, database) {
	var output = "";
	for (var tag in data) {
		var url = ((tag.endsWith("phone")) ? "tel:" + data[tag].title : ((tag.endsWith("email")) ? "mailto:" + data[tag].title : ((tag.endsWith("facebook") && !data[tag].title.startsWith("http:")) ? "https://facebook.com/" + data[tag].title : data[tag].title)));
		if (database[tag].symbol.indexOf("/") > -1) {
			output += "\n<a class='nounderlinestyle' title='" + data[tag].title + "' alt='" + data[tag].title + "' rel='noopener' href='" + url + "' target='_blank'><img src='" + database[tag].symbol + "' class='small-icon' style='margin-top:0px;' /></a>\n";
		} else {
			output += "\n<a class='nounderlinestyle' title='" + data[tag].title + "' alt='" + data[tag].title + "' rel='noopener' href='" + url + "' target='_blank'><span class='small-icon'>" + database[tag].symbol + "</span></a>\n"
		}
	}
	var result = output.split("\n");
	output = "";
	for (var i in result) {
		if (result[i].indexOf("NODISPLAY") == -1) {
			output += result[i];
		}
	}
	if (output == "") {output = "NODISPLAY";}
	return output;
}
function getRightPopup(marker, usePopup) {
	marker = marker.target || marker;
	var poi = marker.data;
	if (activeMarker && activeMarker._icon != null && marker._icon != null) { //Expression which prevents a JS error from ocurring when user loads a new map object or moves the map because both actions clean and refresh the map. That means some objects will be deleted and this expression can handle such cases by validating the object itself. See https://github.com/babykarte/babykarte/issues/17
		activeMarker._icon.children[0].children[0].children[2].classList.remove("marker-active") || false;
	}
	if (marker._icon != null) {
		marker._icon.children[0].children[0].children[2].classList.add("marker-active") || false
	}
	activeMarker = marker;
	marker.name = getSubtitle(poi); //Sets the subtitle which appears under the POI's name as text in grey
	var popup = {"POIpopup":
		{"home": {"content": `<h1 style='display:flex;width:100%;'><div style='padding-top:4px;padding-bottom:4px;padding-right:3px;width:100%;'>${ ((poi.tags["name"] == undefined) ? ((poi.tags["amenity"] == "toilets") ? getText().TOILET : getText().PDV_UNNAME) : poi.tags["name"]) }</div> <a class='nounderlinestyle small-icon' target=\"_blank\" href=\"https://www.openstreetmap.org/edit?` + String(poi.type.toLowerCase()) + "=" + String(poi.osm_id) + `\">✏️</a><div class='tooltip'><img class='small-icon' src='images/share.svg' onclick='toggleTooltip(this)' /><div class='tooltip-content'><a target='_blank' href='${ "https://www.openstreetmap.org/" + String(poi.type).toLowerCase() + "/" + String(poi.osm_id) }'>${ getText().LNK_OSM_VIEW }</a><br/>\n<a href='${ "geo:" + poi.lat + "," + poi.lon }'>${ getText().LNK_OPEN_WITH }</a></div></div></h1>\n<div class='subtitle'><span>${ String(marker.name) }</span>&nbsp;&#8231;&nbsp;<span id='address'>${ addrTrigger(poi, marker) }</span>\n</div>\n<div class='socialmenu'>${ babyfriendliness_symbol(marker, processContentDatabase(marker, poi, PDV_baby), PDV_baby) } ${ ((marker.category == "health" && poi.tags["min_age"] && poi.tags["max_age"]) ? "<span class='small-icon'>" + getText().AGE_RANGE + "</span>" : "") }</div>\n<hr/><div class='socialmenu'>${ contact_symbol(marker, processContentDatabase(marker, poi, PDV_contact ), PDV_contact)}</div>\n</div></div>`, "symbol": "🏠", "title": getText().PDV_TITLE_HOME, "active": true, "default": true},
		"baby": {"content": `${ babyfriendliness_text(marker, processContentDatabase(marker, poi, PDV_baby), PDV_baby) }`, "symbol": "👶", "title": getText().PDV_TITLE_BABY, "active": true},
		"opening_hours": {"content": `${ parseOpening_hours(poi.tags["opening_hours"]) || "NODISPLAY" }`},
		"contact" : {"content": `${ contact_text(marker, processContentDatabase(marker, poi, PDV_contact), PDV_contact)}`, "symbol": "🕰️", "title": getText().PDV_TITLE_OH, "active": true},
		"moreinfo": {"content": `${ ((poi.tags["description"]) ? "<i>" + poi.tags["description"] + "</i><hr/>" : "") } ${ ((poi.tags["operator"]) ? poi.tags["operator"].replace(new RegExp(";", "g"), ", ") : "NODISPLAY") }`}
		},
	"playgroundPopup":
		{"home": {"content": `<h1 style='display:flex;width:100%;'>	<div style='padding-top:4px;padding-bottom:4px;padding-right:3px;width:100%;'>${ ((poi.tags["name"] != undefined) ? poi.tags["name"] : marker.name) }</div><a class='nounderlinestyle small-icon' target=\"_blank\" href=\"https://www.openstreetmap.org/edit?` + String(poi.type.toLowerCase()) + "=" + String(poi.osm_id) + `\">✏️</a><div class='tooltip'><img class='small-icon' src='images/share.svg' onclick='toggleTooltip(this)' /><div class='tooltip-content'><a target='_blank' href='${ "https://www.openstreetmap.org/" + String(poi.type).toLowerCase() + "/" + String(poi.osm_id) }'>${ getText().LNK_OSM_VIEW }</a><br/>\n<a href='${ "geo:" + poi.lat + "," + poi.lon }'>${ getText().LNK_OPEN_WITH }</a></div></div></h1><div class='subtitle'><span>${ ((poi.tags["name"] != undefined) ? String(marker.name) + "&nbsp;&#8231;&nbsp;" : "") }</span><a href='${ "geo:" + poi.lat + "," + poi.lon }'>${ getText().LNK_OPEN_WITH }</a>\n</div>${ babyfriendliness_text(marker, processContentDatabase(marker, poi, PEP_data), PEP_data) }`, "symbol": "🏠", "title": getText().PDV_TITLE_HOME, "active": true, "default": true},
		}
	};
	createDialog(marker, poi, popup[usePopup]);
}
function createDialog(marker, poi, details_data) {
	var popupContent = "";
	var popupContent_header = "";
	document.getElementById("infotext-swipe").innerHTML = "&nbsp;";
	for (var entry in details_data) {
		var tabContent = "";
		var classList = "";
		var result = "";
		var content = details_data[entry].content;
		content = content.split("\n");
		for (var i in content) {
			if (content[i].indexOf("NODISPLAY") == -1) {
				result += content[i];
			}
		}
		if (result != "") {
			if (details_data[entry].default == true) {
				classList = "tab-visible";
			} else {
				document.getElementById("infotext-swipe").innerHTML = "<span class=\"mobile-handle\"></span>";
				details_data[entry].active = false;
			}
			tabContent = "<div class='tabcontent " + classList + "' id='" + poi.classId + entry + "'>" + result + "</div>";
		}
		popupContent += tabContent + "</div>";
	}
	marker.popupContent = "<div>" + popupContent_header + popupContent/*+ "</div> <a target=\"_blank\" href=\"https://www.openstreetmap.org/note/new#map=17/" + poi.lat + "/" + poi.lon + "&layers=N\">" + getText().LNK_OSM_REPORT + "</a>"*/;
	$("#poidetails").html(marker.popupContent);
	toggleMenu(document.getElementById("poimenu").previousElementSibling, "justopen")
	freezeMapMoveEvent = true;
	map.setView([poi.lat, poi.lon]); //Center the map relative to the POI the user opens
}
