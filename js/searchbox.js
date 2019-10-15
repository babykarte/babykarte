var saved_lat = 54.32308131652028;
var saved_lon = 10.139915941399524;
var message;
function hideAll() {
	for (var dropdown of document.getElementsByClassName("dropdown-menu")) {
		dropdown.classList.remove("dropdown-active");
		//dropdown.style.display = "none";
	}
	for (var menuitem of document.getElementsByClassName("menuitem")) {
		menuitem.classList.remove("item-active");
	}
}
function toggleMenu(elem, mode) {
	mode = mode || "all"
	var parent = elem.parentElement;
	var menu = elem.nextElementSibling;
	var active = menu.classList.contains("dropdown-active");
	if (mode == "all") {
		hideAll();
	}
	if (mode == "justopen") {
		active = false;	
	}
	if (!active) {
		elem.classList.add("item-active");
		menu.classList.add("dropdown-active");
		//menu.style.display = "block";
	} else {
		elem.classList.remove("item-active");
		menu.classList.remove("dropdown-active");
		//menu.style.display = "none";
	}
}
function spinner(value) { //Triggers the processbar and or its process
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
		hideAll()
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
		setTimeout(function() {onMapMove();}, 500); //After 5sec trigger the dynamic loading of content manually without user action.
		showGlobalPopup(elem.innerHTML); //Show the message displaying the location is user is viewing
	}
}
function geocode() { // Function which powers the search suggestion list
	var searchword = $("#searchfield").val();
	if (searchword.length == 0) {
		$("#autocomplete").hide();
	}
	if(searchword.length > 3) { //Request and show search suggestions after the third char has been typed in by user
		$.getJSON("https://photon.komoot.de/api/", { //Sends user input to search suggestion provider komoot
			"q": searchword,
			"limit": 5,
			"lang": languageOfUser //Sends the determined language or the language set by user
		}, function(data) {
			var current_bounds = map.getBounds();
			var autocomplete_content = "<ul>";

			$.each(data.features, function(number, feature) {
				var latlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]; //Get the coordinates of the search suggestion entry
				autocomplete_content += "<li onclick='jumpto(this, " + latlng[0] + ", " + latlng[1] + ")'>" + feature.properties.name + ", " + feature.properties.country + "</li>"; //Adds a entry in the search suggestion popup (e.g. Berlin central station)
			});
			if (autocomplete) {
				$("#autocomplete").html(autocomplete_content+"</ul>"); //Add them all to the search suggestion popup
				$("#autocomplete").show(); //Display the suggestion popup to the user
			}
		});
	} else {
		$("#autocomplete").hide();
	}
};
// Makes the search happen directly after a char is typed in searchfield.
$("#searchfield").keyup(function() {
	geocode();
});
