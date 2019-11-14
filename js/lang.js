var languageOfUser;
var lang_default = "de";
/*Meaning of the abreviations used in 'langRef' JSON.
PDV - POI Details view (The view displayed to the user when the user clicks on a POI marker).
BTN - A 'button' element.
LNK - A 'a' (hyperlink) element.
TB - Textbox (or input type 'text') element.
OH - Opening Hours
MI - More Information
*/
var langRef = {};
//determine language of user
languageOfUser = navigator.language.toLowerCase();
if (languageOfUser.indexOf("-") > -1) {
	languageOfUser = languageOfUser.split("-");
	languageOfUser = languageOfUser[0];
}
function getText(address=undefined) {
	if (!address) {
		return langRef[document.body.id][languageOfUser]
	}
	return langRef[document.body.id][languageOfUser][address]
}
function getLangFromHash() {
	var hash = location.hash;
	if (hash != "") {
		hash = hash.replace("#", "").split("&");
		if (String(Number(hash[0])) == "NaN") {
			languageOfUser = hash[0];
			location.hash = location.hash.replace(hash[0] + "&", "").replace(hash[0], "");
		}
	}
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
		script.setAttribute("src", "/js/" + String(lang) + ".js");
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
		var data = {
		1: ((document.getElementById("linkToPP") != null) ? document.getElementById("linkToPP").innerHTML = getText().LNK_PP_SITE : ""),
		2: ((document.getElementById("linkToPP") != null) ? document.getElementById("linkToPP").href = getText().LNK_PP_SITE_URL : ""),
		3: ((document.getElementById("searchfield") != null) ? document.getElementById("searchfield").placeholder = getText().TB_SEARCHFIELD : ""),
		4: ((document.getElementById("lnk-impress") != null) ? document.getElementById("lnk-impress").innerHTML = getText().LNK_IMPRESS : ""),
		5: ((document.getElementById("lnk-impress") != null) ? document.getElementById("lnk-impress").href = getText().LNK_IMPRESS_URL : ""),
		6: ((document.getElementById("title") != null) ? document.getElementById("title").innerHTML = getText().IMPRESS_TITLE : ""),
		7: ((document.getElementById("subtitle") != null) ? document.getElementById("subtitle").innerHTML = getText().IMPRESS_SUBTITLE : ""),
		8: ((document.getElementById("country") != null) ? document.getElementById("country").innerHTML = getText().IMPRESS_COUNTRY : ""),
		9: ((document.getElementById("contact") != null) ? document.getElementById("contact").innerHTML = getText().IMPRESS_CONTACT : ""),
		10: ((document.getElementById("note") != null) ? document.getElementById("note").innerHTML = getText().IMPRESS_NOTE : ""),
		11: ((document.getElementById("linkToGitHub") != null) ? document.getElementById("linkToGitHub").innerHTML = getText().LNK_GITHUB : ""),
		12: ((document.getElementById("linkToOSMWiki") != null) ? document.getElementById("linkToOSMWiki").innerHTML = getText().LNK_OSMWIKI : ""),
		13: ((document.getElementById("languageOfUser") != null) ? document.getElementById("languageOfUser").innerHTML = languageOfUser : ""),
		14: ((document.getElementById("map-overlay-notify") != null) ? document.getElementById("map-overlay-notify").innerHTML = getText().FLTR_NOTHINGSELECTED : "")
		};
		//Search for the names of playground equipment in the language reference
		for (var json in getText()) {
			if (json.startsWith("PDV_PLAYGROUND_") && json.endsWith("_YES")) { //Just add to the database 'filtertranslations' (needed by the 'filters.js/getSubtitle' function) what belongs to the playground equipment
				var equipment = json.replace("PDV_PLAYGROUND_", "").replace("_YES",""); //Generate key from scratch
				getText().filtertranslations["playground=" + equipment.toLowerCase()] = getText()[json];
			}
		}
		hardReset();
	} else {
		alert("Language data couldn't be loaded.");
	}
}
getLangFromHash();
