var timerForFilter, markerCode;
var activeSubcategory = "";
var subcategories = { //The subcategories and their category as dictionary (JSON)
"paediatrics": {"category" : "health"},
"midwife": {"category" : "health"},
"birthing_center": {"category" : "health"},
"playground": {"category" : "activity"},
"play-equipment": {"category" : "activity"},
"park": {"category" : "rest"},
"shop-babygoods": {"category" : "shop"},
"shop-toys": {"category" : "shop"},
"shop-clothes": {"category" : "shop"},
"childcare": {"category" : "childcare"},
"zoo": {"category" : "activity"},
"changingtable": {"category" : "changingtable"},
"cafe": {"category" : "eat"},
"restaurant": {"category" : "eat"},
"fast_food": {"category" : "eat"}
};
var filters = ["changingtable", "highchair", "stroller", "kidsarea"]
function getSubtitle(poi) {
	var json = getText().maintagtranslations;
	for (var i in json) {
		var key = i.split("=");
		if (!poi.tags[key[0]]) {continue;}
		if (poi.tags[key[0]] && poi.tags[key[0]] == key[1]) {
			return getText().maintagtranslations[i][0];
		}
	}
	return undefined;
}
function activateSubcategory(i) {
	activeSubcategory = i;
	createQueryFunctionCall = function() {return createSQL(map.getBounds().getSouth() + "," + map.getBounds().getWest() + "," + map.getBounds().getNorth() + "," +  map.getBounds().getEast(), i)};
	loadPOIS("");
	var crack = Object()
	crack.key = "Escape";
	crack.preventDefault = function() {return 1;}
	escapeFromFunc(crack);
}
function initMarkerObject(poi) {
	marker = new Object();
	marker.category = poi.category;
	marker.usePopup = popupforcategory[marker.category];
	return marker
}
