var activeFilter = {}; //Dictionary of the current selected filters
var timerForFilter, markerCode, filtersSorted;
var profiles = { //Colour profiles for the filters
"defaultMarker": {code: "#004387"},
"redMarker": {code: "#ff0000"},
"darkredMarker": {code: "#6b1c1c"},
"lightredMarker": {code: "#d25151"},
"greenMarker": {code: "#00c700"},
"lightgreenMarker": {code: "#99ff99"},
"darkgreenMarker": {code: "#19641b"},
"blueMarker": {code: "#000dff"},
"darkblueMarker": {code: "#001369"},
"lightblueMarker": {code: "#3274c7"},
"orangeMarker": {code: "#d76b00"},
"yellowMarker": {code: "#ddc600"},
"darkyellowMarker": {code: "#877800"},
"lightyellowMarker": {code: "#ffe92c"},
"greyMarker": {code: "#5c5c5c"},
"lightgreyMarker": {code: "#a0a0a0"},
"violetMarker": {code: "#7a00b7"},
"lightvioletMarker": {code: "#dc1369"},
"oldrosa": {code: "#f07575"}
};
var filter_defaultValues = {"active": false, "layers": [], "littleboxes": {},"usedBefore" : false}; //its active state, markers belonging to that filter, the boundings of a filter (area downloaded and cached)
var orderOfFilters = ["paediatrics", "midwife", "birthing_center", "playground", "play-equipment", "park", "shop-babygoods", "shop-toys", "shop-clothes", "childcare", "zoo", "changingtable", "changingtable-men", "cafe", "restaurant", "fast_food"]
var filter = { //The filters, the query they trigger, their colour profile, their category and technical description as dictionary (JSON)
"paediatrics": {"color": profiles.redMarker, "category" : "health paediatrics", "priorize": 1, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"},
"midwife": {"color": profiles.darkredMarker, "category" : "health midwife", "priorize": 1, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"},
"birthing_center": {"color": profiles.lightredMarker, "category" : "health birth", "priorize": 1, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"},
"playground": {"color": profiles.greenMarker, "category" : "activity playground", "priorize": 1, "triggers": {onclick: function() {;setFilter("play-equipment");}}, "popup": "POIpopup", "markerStyle": "marker"},
"play-equipment": {"color": profiles.lightgreenMarker, "category" : "activity playground-equipment", "priorize": 2, "triggers": {}, "beforeFilter": "<span style='font-size:22px'>↳</span>", "popup": "playgroundPopup", "markerStyle": "dot"},
"park": {"color": profiles.darkgreenMarker, "category" : "rest park", "priorize": 1, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"},
"shop-babygoods": {"color": profiles.blueMarker, "category" : "shop baby_goods", "priorize": 1, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"},
"shop-toys": {"color": profiles.darkblueMarker, "category" : "shop toys", "priorize": 1, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"},
"shop-clothes": {"color": profiles.lightblueMarker, "category" : "shop clothes", "priorize": 1, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"},
"childcare": {"color": profiles.orangeMarker, "category" : "childcare kindergarten", "priorize": 1, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"},
"zoo": {"color": profiles.yellowMarker, "category" : "activity zoo", "priorize": 1, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"},
"changingtable": {"color": profiles.lightgreyMarker, "category" : "changingtable diaper", "priorize": 3, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"},
"changingtable-men": {"color": profiles.greyMarker, "category" : "changingtable diaper", "priorize": 2, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"},
"cafe": {"color": profiles.violetMarker, "category" : "eat cafe", "priorize": 1, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"},
"restaurant": {"color": profiles.lightvioletMarker, "category" : "eat restaurant", "priorize": 1, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"},
"fast_food": {"color": profiles.oldrosa, "category" : "eat fast_food", "priorize": 1, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"}
};
function triggerActivationOfFilters() {
	clearTimeout(timerForFilter);
	timerForFilter = setTimeout(activateFilters, 1000); // Activate fillters after every user action regarding the filter menu has taken place. Gives the user 1sec time to react (activate/deactivate one or more filters)
}
function compareFunction(a,b) {
	return b-a;
}
function getSortedListOfFilters(priorizeList) {
	var int, fltr;
	var output = [];
	for (int in priorizeList) {
		for (fltr in priorizeList[int]) {
			output.push(priorizeList[int][fltr]);
		}
	}
	return output.join(",").split(","); //Workaround for a weird bug
}
function toggleLayers(id, toggle) {
	// Removes/Adds cached filter data to the map
	if (toggle == 0) {
		//Removes the filter marker from the map. (e.g. red marker). Data remains in cache.
		if (filter[id].layers.length > 0) {
			for (var layer in filter[id].layers) {
				//Removes every single marker that belongs to the filter.
				filter[id].layers[layer].removeFrom(map);
			}
		}
	} else {
		//Readds a recently used filter marker to the map (e.g. red marker)
		if (filter[id].layers.length > 0) {
			for (var layer in filter[id].layers) {
				//Adds every single POI that belongs to the filter.
				filter[id].layers[layer].addTo(map);
			}
		}
	}
}
function activateFilters() {
	for (var fltr of filtersSorted) {
		if (filter[fltr].active) {
			activeFilter[fltr] = true;
			toggleLayers(fltr, 1) //Adds the POIs belonging to the filter to the map.
		} else {
			if (activeFilter[fltr]) {
				delete activeFilter[fltr];
				toggleLayers(fltr, 0) //Removes the POIs belonging to the filter from the map.
			}
		}
	}
	if (Object.keys(activeFilter).length > 0) {
		document.getElementById("map-overlay-notify").style.display = "none";
		loadPOIS(""); //Send request to overpass and interpret/render the results for the POI popup
	} else {
		document.getElementById("map-overlay-notify").style.display = "block";
	}
	hideAll(["item-active", "dropdown-active"]);
}
function setFilter(id) {
	//Gets called when the user (un)checks a filter.
	if (filter[id].active) {
		//The filter is currently active, deactivate it because the user unchecked it.
		filter[id].active = false;
		document.getElementById("filter" + id).checked = false;
		
	} else {
		//The filter is deactivated, activate it because the user checked it.
		filter[id].active = true;
		document.getElementById("filter" + id).checked = true;
	}
	if (filter[id].triggers.onclick) {filter[id].triggers.onclick()}
	triggerActivationOfFilters();
}
function setAllFilters() {
	var checkbox = document.getElementById("setFilters"); //Gets the "(Un)check them all" checkbox
	if (checkbox.checked) { //User checked it. Activate all filters
		for (var i in filter) {
			if (!filter[i].active) {
				setFilter(i);
				document.getElementById("filter" + i).checked = true; //Check all filters
			}
		}
	} else { //Deactivate all filters
		for (var i in filter) {
			if (filter[i].active) {
				setFilter(i);
				document.getElementById("filter" + i).checked = false; //Uncheck all filters
			}
		}
	}
}
function initFilters() {
	//Initialize filters at startup of this webapp
	var output = "";
	var priorizeList = {}; //Dictionary used for priorizing filters like priorizing the 'restaurant' filter over the 'cafe' filter
	var filtersGround = document.getElementById("filtersGround");
	output += "<label style='color:#3090b5ff'><input id='setFilters' onclick='setAllFilters()' type='checkbox'><span style='color:white;font-weight:bold;font-size:16px;'>&#9632; </span><span>" + String(getText().FLTR_SELECTALL) + "</span></label>"; //Adds the necessary HTML for checkbox element of '(Un)check them all'
	for (var id of orderOfFilters) {
		var beforeFilter = "";
		if (filter[id].layers == undefined) {
			filter[id] = $.extend(true, filter[id], filter_defaultValues); //Initialize the JSON variable 'filter'.
		}
		if (!priorizeList[filter[id].priorize]) {priorizeList[filter[id].priorize] = [];}
		priorizeList[filter[id].priorize].push(id);
		var fltr = filter[id];
		if (filter[id].beforeFilter) {beforeFilter = filter[id].beforeFilter}
		output += "<label>" + beforeFilter + "<input id='filter" + String(id) + "' onclick='setFilter(\"" + String(id) + "\")' type='checkbox'><span style='color:" + fltr.color.code + ";font-weight:bold;font-size:16px;'>&#9632; </span><span>" + String(getText().subcategories[id][0]) + "</span></label>";  //Adds the necessary HTML for checkbox element of every single filter
	}
	filtersGround.innerHTML = output; //Add filters to the site (displaying them to user)
	filtersSorted = getSortedListOfFilters(priorizeList);
	document.getElementById("map-overlay-notify").style.display = "block";
}
function resetFilter(fltr) {
	var values = {"south": 0, "west": 0, "north": 0, "east": 0};
	toggleLayers(fltr, 0);
	filter[fltr].usedBefore = true;
	setCoordinatesOfFilter(fltr, values);
	filter[fltr].layers = [];
}
function hardReset() {
	initFilters();
	for (var fltr in filter) {
		toggleLayers(fltr, 0);
		activeFilter = {};
		filter[fltr].usedBefore = false;
		filter[fltr].active = false;
	}
}
function getSubtitle(poi) {
	var json = getText().filtertranslations;
	for (var i in json) {
		var key = i.split("=");
		if (!poi.tags[key[0]]) {continue;}
		if (poi.tags[key[0]] && poi.tags[key[0]] == key[1]) {
			return getText().filtertranslations[i][0];
		}
	}
	return undefined;
}
function initMarkerObject(poi) {
	marker = new Object();
	marker.category = poi.category;
	marker.fltr = poi.filter;
	marker.color = filter[poi.filter].color.code;
	marker.priorize = filter[poi.filter].priorize;
	return marker
}
