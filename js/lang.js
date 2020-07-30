var lang_default = "en";
var langRef = {};
function getText(address=undefined) {
	if (!address) {
		return langRef[document.body.id][languageOfUser]
	}
	return langRef[document.body.id][languageOfUser][address]
}
function registerLang(lang, json) {
	langRef[document.body.id][lang] = json[document.body.id];
}
function loadLang(e, lang) {
	if (!langRef[document.body.id]) {
		langRef[document.body.id] = {};
	}
	if (lang in langRef[document.body.id] == false) {
		var script = document.createElement("script");
		script.setAttribute("src", "js/" + String(lang) + ".js");
		document.body.appendChild(script);
	} else {
		setLang(e, lang);
	}
}
function setLang(e, lang) {
	if (lang != undefined) {
		languageOfUser = lang;
	}
	if (languageOfUser in langRef[document.body.id]) {
		//Search for the names of playground equipment in the language reference
		for (var json in getText()) {
			if (json.startsWith("PDV_PLAYGROUND_") && json.endsWith("_YES")) { //Just add to the database 'maintagtranslations' (needed by the 'filters.js/getSubtitle' function) what belongs to the playground equipment
				var equipment = json.replace("PDV_PLAYGROUND_", "").replace("_YES",""); //Generate key from scratch
				getText().maintagtranslations["playground=" + equipment.toLowerCase()] = [getText()[json], getText().PDV_LEISURE_PLAYGROUND];
			}
		}
		var output = "";
		output = "<option value='all'>" + getText().SELECT_DEFAULTALL + "</option>";
		for (var subcat in subcategories) {
			var text = getText().subcategories[subcat][0];
			output += "<option value='" + subcat + "'>" + text + "</option>";
		}
		document.getElementById("subcategoryselect").innerHTML = output;
		output = ""
		for (var fltr in getText().filters) {
			output += "<label>";
			output += "<input type='checkbox' id='" + fltr + "' value='" + fltr + "' class='filter'>";
			output += "<span>" + getText().filters[fltr][0] + "</span>";
			output += "</label>";
		}
		document.getElementById("filtersGround").innerHTML = output;
	} else {
		alert("Language data couldn't be loaded.");
	}
}
