var activeMarker;
var symbols = {};
var mapobjects = [];
var markerStyles = {};
var saved_lat = 54.32308131652028;
var saved_lon = 10.139915941399524;
var freezeMapMoveEvent = false;
var zoomLevel = "";
var url = "https://babykarte.openstreetmap.de/getDataForBabykarte.cgi";
function locationFound(e) {
	showGlobalPopup(getText().LOCATING_SUCCESS);
	spinner(false);
}
function locationError(e) {
	//Fires the notification that Babykarte shows NOT the location of the user, because it has no permission to do so.
	showGlobalPopup(getText().LOCATING_FAILURE);
	spinner(false);
}
function locateNewAreaBasedOnSubcategory() {
	if (createQueryFunctionCall) {
		return createQueryFunctionCall();
	}
}
function onMapMove() {
	if (freezeMapMoveEvent != true) {
		loadPOIS("", locateNewAreaBasedOnSubcategory());
	}
	freezeMapMoveEvent = false;
}
function ratePOI(marker, poi) {
	var i;
	if (!poi.rating) {poi.rating = {};poi.rating.green = 0;poi.rating.red = 0;}
	if (!marker.category.startsWith("eat")) {return poi;}
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
function addMarkerIcon(poi, marker) {
	var iconObject = JSON.parse(JSON.stringify(markerStyles["dot"]));
	var result = determineRateColor(poi);
	if (result) {iconObject.html = iconObject.html.replace("rating-default", result)}
	iconObject = L.divIcon(iconObject) //Creates the colourized marker icon
	var markerObject = L.marker([poi.lat, poi.lon], {icon: iconObject}); //Set the right coordinates
	marker = $.extend(true, markerObject, marker); //Adds the colourized marker icon
	mapobjects.push(marker); //Adds the POI to the list of objects on the map.
	return marker;
}
function errorHandler(poi) {
	var notes = poi.notes || undefined;
	if (notes == "No Data") {
		showGlobalPopup(getText().NODATA);
	} else if (notes == "ERROR 404") {
		showGlobalPopup(getText().ERROR404);
	} else if (notes.startsWith("ERROR 503")) {
		showGlobalPopup(getText().ERROR503);
	} else {
		showGlobalPopup(getText().ERROR);
	}
	spinner(false);
}
function createPOIobject(poi, mode) {
	var marker;
	if (poi.notes) {errorHandler(poi);return false;}
	if (!poi.tags) {poi.tags = {};}
	poi.lat = poi.geometry.coordinates[1];
	poi.lon = poi.geometry.coordinates[0];
	//creates a new Marker() Object, put data in it, determine the right category and do the rating (add yellow, green or a red dot on the icon).
	marker = initMarkerObject(poi);
			
	poi = ratePOI(marker, poi);
	marker = addMarkerIcon(poi, marker);
	marker.data = poi;
	marker.data.classId = String(poi.type)[0].toUpperCase() + String(poi.osm_id);
	marker.on("click", function(event) {getRightPopup(event, marker.usePopup)});
	//Add marker to map
	cluster.addLayer(marker);
	if (mode == "singlepoi") {
		getRightPopup(marker, marker.usePopup);
	}
	if (mapobjects.length > 0) {
		document.getElementById("map-overlay-notify").style.display = "none";
	} else {
		document.getElementById("map-overlay-notify").style.display = "block";
	}
}
function loadPOIS(e, post) {
	spinner(true);
	//Main function of POI loading.
	//Handles connection to OSM Overpass server and parses the response into beautiful looking details views for each POI
	if (!post) {
		//No data to send was specified, so we fetch activated subcategory
		post = locateNewAreaBasedOnSubcategory();
		if (!post) {
			spinner(false);
			return 0;
		}
	}
	//Connect to OSM server
	getData(url, "json", post, undefined, function (elements) {
		//Go through all elements (ways, relations, nodes) sent by Overpass and delete them all from map
		for (var i in mapobjects) {
			map.removeLayer(mapobjects[i]);
		}
		mapobjects = [];
		cluster.clearLayers();
		for (var poi in elements) {
			if (Object.keys(elements).length == 1) {
				createPOIobject(elements[poi], "singlepoi")
			} else {
				createPOIobject(elements[poi]);
			}
		}
		spinner(false);
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
function hashCoords(e) {
location.hash = String(map.getZoom()) + "&" + String(e.latlng.lat).split(".")[0] + "." + String(e.latlng.lat).split(".")[1].slice(0, 4) + "&" + String(e.latlng.lng).split(".")[0] + "." + String(e.latlng.lng).split(".")[1].slice(0, 4);
}

//init map
var map = L.map('map');
map.zoomControl.setPosition("topright");
map.setView([saved_lat, saved_lon], 15);
getStateFromHash();
map.on("zoom", function() {zoomLevel = String(map.getZoom());})
map.on("locationfound", locationFound);
map.on("locationerror", locationError);
map.on("click", hashCoords);
map.on("moveend", onMapMove);
var Layergroup = new L.LayerGroup();
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  minZoom: 9,
  attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> data under <a href="https://opendatacommons.org/licenses/odbl/">ODbL</a>, Tiles OSMF: <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA</a>'
}).addTo(map);
var cluster = L.markerClusterGroup({"disableClusteringAtZoom": 17});
map.addLayer(cluster);
spinner(false);

zoomLevel = String(map.getZoom());
loadLang("", languageOfUser);

getData("markers/marker.svg", "text", "", undefined, function (data) {markerStyles["dot"] = {iconSize: [20, 20], popupAnchor: [0, 0], iconAnchor: [10, 10], className: "leaflet-marker-icon leaflet-zoom-animated leaflet-interactive", html: "<svg style='width:20px;height:20px;'>" + data + "</svg>"}; /* Caches the marker for later altering*/}); //Triggers the loading and caching of the marker icon at startup of Babykarte
getData("images/stroller.svg", "text", "", undefined, function (data) {symbols["stroller"] = {"html": data};});
getData("images/ball.svg", "text", "", undefined, function (data) {symbols["ball"] = {"html": data};});
getData("images/changingtable.svg", "text", "", undefined, function (data) {symbols["changingtable"] = {"html": data};});
getData("images/highchair.svg", "text", "", undefined, function (data) {symbols["highchair"] = {"html": data};});
map.on("click", function () {
	if (activeMarker && activeMarker._icon != null) {
		activeMarker._icon.children[0].getElementById("layer1").classList.remove("marker-active") || false;
	}
	hideAll(["item-active", "dropdown-active"]);
})
