var message;
var timeoutTyping;
var touchSupport = false;
var swipeData = [];
var PDV_expanded = false;
document.body.ontouchstart = function(event) {
	touchSupport = true;
	document.getElementById("infotext-swipe").style.display = "block";
}
document.getElementById("poimenu").ontouchstart = function(event) { swipeData.push(event.changedTouches[0].clientY) };
function swipeUp() {
	for (var elem of document.getElementsByClassName("tabcontent")) {
			elem.classList.add("tab-visible");
	}
	PDV_expanded = true;
}
function swipeDown() {
	for (var elem of document.getElementsByClassName("tabcontent")) {
			elem.classList.remove("tab-visible");
	}
	document.getElementsByClassName("tabcontent")[0].classList.add("tab-visible");
	PDV_expanded = false;
}
document.getElementById("infotext-swipe").onclick = function() { if (PDV_expanded) {swipeDown()} else {swipeUp()} }
document.getElementById("poimenu").ontouchend = function(event) {
	swipeData.push(event.changedTouches[0].clientY);
	if (swipeData[0] - swipeData[1] > 55) {
		swipeUp(); //swipe up
	} else if (swipeData[0] - swipeData[1] < -55){
		swipeDown(); //swipe down
	}
	swipeData = [];
};
function hideAll(classes) {
	for (var dropdown of document.getElementsByClassName("dropdown-menu")) {
		dropdown.classList.remove(classes[1]);
	}
	for (var menuitem of document.getElementsByClassName("bar-icon")) {
		menuitem.classList.remove(classes[0]);
	}
}
function intern_toggle(elem, mode, classes, menu=undefined) {
	mode = mode || "all";
	menu = ((menu == undefined) ? elem.nextElementSibling : document.getElementById(menu));
	var parent = elem.parentElement;
	var active = menu.classList.contains(classes[1]);
	if (mode == "all") {
		hideAll(classes);
	}
	if (mode == "justopen") {
		active = false;	
	}
	if (!active) {
		elem.classList.add(classes[0]);
		menu.classList.add(classes[1]);
	} else {
		elem.classList.remove(classes[0]);
		menu.classList.remove(classes[1]);
	}
}
function toggleMenu(elem, mode) {
	intern_toggle(elem, mode, ["item-active", "dropdown-active"]);
}
function toggleTooltip(elem) {
	intern_toggle(elem, "all", ["tooltip-active", "tooltip-content-active"]);
}
function toggleTab(elem, menu) {
	intern_toggle(elem, "all", ["tab-active", "tab-content-active"], menu);
}
function spinner(value) { //Show/hide spinner
	var elem = document.getElementById("spinner");
	if (value) { //Show spinner
		elem.style.display = "flex";
	} else { //Hide spinner
		elem.style.display = "none";
	}
}
function showGlobalPopup(m) { // Triggers the blue rounded message popup
	message = m
	setTimeout(function() {
		document.getElementById("infoPopup").innerHTML = message;
		document.getElementsByClassName("info")[0].style.display = "block"; //Display the message
		setTimeout(function() {
			document.getElementsByClassName("info")[0].style.display = "none"; //Wait for 3sec and then close the popup
		}, 3000);
		}, 1000);
}
function jumpto(elem, lat, lon) { // Function which fires when user clicks on a search suggestion. Forcing Babykarte to jump to a new position (e.g. Berlin central station)
	if (elem.innerHTML) {
		hideAll(["dropdown-active", "item-active"])
		spinner(true);
		$("#autocomplete").hide(); // Hide the search suggestions
		map.on("moveend", function() {}); //Deactivate the dynamic loading of content
		map.setView([lat, lon]); //Set the view (e.g. Berlin central station)
		location.hash = String(map.getZoom()) + "&" + String(lat) + "&" + String(lon); //Set the url
		saved_lat = lat;
		saved_lon = lon;
		for (var id in activeFilter) {
			//Resets all filters
			resetFilter(id);
		}
		map.on("moveend", onMapMove); //Activate the dynamic loading of content
		setTimeout(function() {onMapMove();}, 300); //After 5sec trigger the dynamic loading of content manually without user action.
		showGlobalPopup(elem.innerHTML); //Show the message displaying the location is user is viewing
	}
}
function geocode_intern() { // Function which powers the search suggestion list
	var searchword = $("#searchfield").val();
	if (searchword.length == 0) {
		$("#autocomplete").hide();
	}
	if(searchword.length > 3) { //Request and show search suggestions after the third char has been typed in by user
		spinner(true);
		$.getJSON("https://photon.komoot.de/api/", { //Sends user input to search suggestion provider komoot
			"q": searchword,
			"limit": 5,
			"lang": languageOfUser //Sends the determined language or the language set by user
		}, function(data) {
			var current_bounds = map.getBounds();
			var autocomplete_content = "";

			$.each(data.features, function(number, feature) {
				var latlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]; //Get the coordinates of the search suggestion entry
				autocomplete_content += "<div class='entry' style='border-bottom:5px solid white;padding:5px;' onclick='jumpto(this, " + latlng[0] + ", " + latlng[1] + ")'><span>" + feature.properties.name + "</span><br/><address style='font-size:14px;'>" + feature.properties.country + "</address></div>"; //Adds a entry in the search suggestion popup (e.g. Berlin central station)
			});
			if (autocomplete) {
				$("#autocomplete").html(autocomplete_content); //Add them all to the search suggestion popup
				$("#autocomplete").show(); //Display the suggestion popup to the user
			}
			spinner(false);
		});
	} else {
		$("#autocomplete").hide();
	}
};
function geocode() {
	clearTimeout(timeoutTyping);
	timeoutTyping = setTimeout(geocode_intern, 500);
}
// Makes the search happen directly after a char is typed in searchfield.
$("#searchfield").keyup(function() {
	geocode();
});
function getLastUpdate() {
	var d = new Date().toString().split(" ");
	var time = d[4].split(":");
	if (time[1] > 15) {
		return time[0] + ":15";
	} else {
		return String(parseInt(time[0])-1) + ":15";
	}	
}
