var timerForFilter, markerCode;
var activeSubcategory = "";
var orderOfFilters = ["paediatrics", "midwife", "birthing_center", "playground", "play-equipment", "park", "shop-babygoods", "shop-toys", "shop-clothes", "childcare", "zoo", "changingtable", "changingtable-men", "cafe", "restaurant", "fast_food"]
var subcategory = { //The filters, the query they trigger, their colour profile, their category and technical description as dictionary (JSON)
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
"changingtable-men": {"category" : "changingtable"},
"cafe": {"category" : "eat"},
"restaurant": {"category" : "eat"},
"fast_food": {"category" : "eat"}
};
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
	for (var i in tocategory) {
		i = i.split("=");
		if (poi.tags[i[0]] == i[1] || poi.tags[i[0]] && i[1] == "*") {
			i = i.join("=");
			marker.usePopup = tocategory[i][1];
			marker.category = tocategory[i][0];
			break;
		}
	}
	return marker
}
