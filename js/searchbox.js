var saved_lat = 54.32308131652028;
var saved_lon = 10.139915941399524;
var mobile = false;
var message;
function mobileTrue() {mobile = true;} // Gets triggered when user triggers the menu button which is available for mobile devices only (small screen size)
function togglemenu(value=false) {
	var obj = document.getElementsByClassName("layermenu")[0]; // JS code for the menu button
	if (value == true) { // Opens the menu by order from inside the JS code (calibrating its real state)
		obj.style.height = "auto";
	}
	if (obj.style.height != "auto") { //Opens the menu by just knowing its current height (any value ecept 'auto')
		obj.style.height = "auto";
	} else {
		obj.style.height = "80px"; //Closes the menu and applies given height for the searchbar, language buttons and legal links
	}
}
function hideFilterListOnMobile() { //Hides the menu when a filter loads (the green loading bar appears)
	if (mobile) {
		togglemenu(true); //Forces to close menu by opening it internally and then closing it internally. Its real state is being ignored.
	}
}
function progressbar(value=false) { //Triggers the processbar and or its process
	var elem = document.getElementById("progressbar");
	if (!value) { //Reset the progressbar: Set its width to zero and hide it
		elem.style.width = "0%";
		elem.style.display = "none";
	} else { //Set the width and show it
		elem.style.width = String(value) + "%";
		elem.style.display = "block";
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
		progressbar(50);
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
	}
};
// Makes the search happen directly after a char is typed in searchfield.
$("#searchfield").keyup(function() {
	geocode();
});
