var timerForFilter, markerCode;
var activeSubcategory = "";
var orderOfFilters = ["paediatrics", "midwife", "birthing_center", "playground", "play-equipment", "park", "shop-babygoods", "shop-toys", "shop-clothes", "childcare", "zoo", "changingtable", "changingtable-men", "cafe", "restaurant", "fast_food"]
var subcategory = { //The filters, the query they trigger, their colour profile, their category and technical description as dictionary (JSON)
"paediatrics": {"category" : "health paediatrics"},
"midwife": {"category" : "health midwife"},
"birthing_center": {"category" : "health birth"},
"playground": {"category" : "activity playground"},
"play-equipment": {"category" : "activity playground-equipment"},
"park": {"category" : "rest park"},
"shop-babygoods": {"category" : "shop baby_goods"},
"shop-toys": {"category" : "shop toys"},
"shop-clothes": {"category" : "shop clothes"},
"childcare": {"category" : "childcare kindergarten"},
"zoo": {"category" : "activity zoo"},
"changingtable": {"category" : "changingtable diaper", "priorize": 3, "triggers": {}, "popup": "POIpopup", "markerStyle": "marker"},
"changingtable-men": {"category" : "changingtable diaper"},
"cafe": {"category" : "eat cafe"},
"restaurant": {"category" : "eat restaurant"},
"fast_food": {"category" : "eat fast_food"}
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
