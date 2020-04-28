var createQueryFunctionCall;
function createSQL(bbox, subcategory) {
	createQueryFunctionCall = function() {return createSQL(getBbox(), subcategory)};
	return String(subcategory) + " - " + String(bbox) + "\n";
}
function requestSinglePOI(address) {
	createQueryFunctionCall = undefined;
	loadPOIS("", "id=" + address);
}
function getData(url, dataType, data,  fail, success, type) {
	if (type == undefined) {type = "GET"}
	if (fail == undefined) {fail = function() {showGlobalPopup(getText().LOADING_FAILURE);spinner(false);}}
	$.ajax({
		type: type,
		url: String(url),
		dataType: String(dataType),
		data: data,
		error: fail,
		success: success,
	});
}
