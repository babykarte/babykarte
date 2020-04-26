#!/usr/bin/python3
import wsgiref.handlers
import cgi, time
import os, json, sys

languageOfUser = "en"
root = ""
directory = "index"
query = {}
content = """<!DOCTYPE html>
<html>
  <head>
    <title>Babykarte - {BABYKARTE_TITLE}</title>
    <meta charset='utf-8'>
    <meta name='description' content='{BABYKARTE_DESCR}'> 
    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'>
    <link rel='stylesheet' href='https://unpkg.com/leaflet@1.0.3/dist/leaflet.css' /> <!--https://policies.google.com/privacy#infocollect-->
    <link rel='stylesheet' href='https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css' /> <!--https://policies.google.com/privacy#infocollect-->
    <link rel='stylesheet' href='https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css'> <!--https://policies.google.com/privacy#infocollect-->
    <link rel='stylesheet' href='css/style.css' />
    <link rel='icon' href='favicon.ico' type='image/x-icon'>
  </head>
  <body id='site-map'>
  <section>
  	<div class='leftbar'>
  		<div class='spinner-collection'>
  		<div id='spinner'>
    		<div class='circle' id='circle1'></div>
    		<div class='circle' id='circle2'></div>
    		<div class='circle' id='circle3'></div>
    	</div>
    	</div>
  		<div class='menuitem-collection'>
  		<div class='menuitem dropdown'><img class='bar-icon item-active' id='btn_search' alt='{btn_search}' title='{btn_search}' src='images/search.svg' onclick='toggleMenu(this);document.getElementById("searchfield").focus();' />
  			<div class='dropdown-menu searchbar dropdown-active' id='searchgroup'>
     			<input type='text' onclick='geocode()' placeholder='{TB_SEARCHFIELD}' id='searchfield'>
     			<img src='images/settings.svg' class='small-icon' style='margin:0px;' onclick='toggleTab(this, "advanced-search")' />
     				<div id='advanced-search' class='tab-content'>
     					<h3 id='advanced-search_title'>{LABEL_ADVANCEDSEARCH_TITLE}</h3>
     					<input type='text' placeholder='{TB_SEARCHBYNAME}' id='searchbyname' /><br/>
     					<select id='subcategoryselect'></select>
     					<h4 id='advanced-search-babyfriendliness'>{LABEL_ADVANCEDSEARCH_BABYFRIENDLINESS}</h4>
     					<div id='filtersGround'></div><br/>
     					<button id='advanced-search-btnSend' onclick='sendAdvancedSearch()'>{BTN_ADVANCEDSEARCHSEND}</button>
     				</div>
     			<div id='autocomplete'></div>
			</div>
		</div>
		<div class='menuitem dropdown'><img class='bar-icon' id='btn_info' alt='{btn_info}' title='{btn_info}' src='images/info.svg.png' onclick='toggleMenu(this)' />
  			<div class='dropdown-menu about' id='aboutus'>
  				<a href='https://github.com/babykarte/babykarte' target='_blank' id='linkToGitHub'>{LNK_GITHUB}</a>
        		<a href='https://wiki.openstreetmap.org/wiki/Baby-Karte' target='_blank' id='linkToOSMWiki'>{LNK_OSMWIKI}</a>
        		<a href='impress?lang={languageOfUser}' id='lnk-impress' target='_blank'>{LNK_IMPRESS}</a>
        		<a href='privacypolicy/{languageOfUser}.html' id='linkToPP' target='_blank;'>{LNK_PP_SITE}</a>
        		<div style='padding-top:10px;box-sizing:border-box;'>
        			<a id='lnk_about' class='tab-active' onclick='toggleTab(this, "about")'>{LNK_ABOUT}</a>,
        			<a id='lnk_explanation-menubuttons' onclick='toggleTab(this, "explanation-menubuttons")'>{LNK_EXPLANATIONMENUBUTTONS}</a>,
        			<a id='lnk_explanation-markerdots' onclick='toggleTab(this, "explanation-markerdots")'>{LNK_EXPLANATIONMARKERDOTS}</a>,
        			<a id='lnk_explanation-pdvicons' onclick='toggleTab(this, "explanation-pdvicons")'>{LNK_EXPLANATIONPDVICONS}</a>
        		</div>
        		<div id='about' class='tab-content tab-content-active'>{ABOUT}</div>
				<div id='explanation-menubuttons' class='tab-content'>
					<img class='small-icon' src='images/search.svg' />{btn_search}<br/>
					<img class='small-icon' src='images/info.svg.png' />{btn_info}<br/>
					<img class='small-icon' src='images/www.svg' />{btn_lang}<br/>
					<img class='small-icon' src='images/locating.svg' />{btn_locating}
				</div>
				<div id='explanation-markerdots' class='tab-content'>
					<p>{MAP_MARKERDOTS_GENERAL}</p>
					<span id='rating-green' class='small-icon'>&#8226;</span> {rating-green}<br/>
					<span id='rating-yellow' class='small-icon'>&#8226;</span> {rating-yellow}<br/>
					<span id='rating-red' class='small-icon'>&#8226;</span> {rating-red}
				</div>
				<div id='usage' class='tab-content'>{USAGE}</div>
        		<div id='explanation-pdvicons' class='tab-content'>
        			<p>{USAGE}</ü>
        			<p>{PDV_ICONS_EXPLANATION_GENERAL}</p>
        			<img class='small-icon' src='images/changingtable.svg' /> {PDV_ICON_CHANGINGTABLE}<br/>
        			<img class='small-icon' src='images/highchair.svg' /> {PDV_ICON_HIGHCHAIR}<br/>
        			<img class='small-icon' src='images/stroller.svg' /> {PDV_ICON_STROLLER}<br/>
        			<img class='small-icon' src='images/ball.svg' /> {PDV_ICON_BALL}<br/>
        			<span class='small-icon'>&#129329;</span> {PDV_ICON_BREASTFEEDING}<br/>
        			<span class='small-icon'>✏️</span> {PDV_ICON_PEN}<br/>
        			<img class='small-icon' src='images/share.svg' /> {PDV_ICON_SHARE}
        		</div>
        		<p id='lastupdate'>{LASTUPDATE} {TRIG_LASTUPDATE}</p>
  			</div>
  		</div>
  		<div class='menuitem dropdown'><img class='bar-icon' id='btn_lang' alt='{btn_lang}' title='{btn_lang}' src='images/www.svg' onclick='toggleMenu(this)' />
  			<div class='dropdown-menu lang-select'>
  				<a href='?lang=en' class='nounderlinestyle'><span class='small-icon'>EN</span></a>
  				<a href='?lang=de' class='nounderlinestyle'><span class='small-icon'>DE</span></a>
  				<a href='?lang=fr' class='nounderlinestyle'><span class='small-icon'>FR</span></a>
  			</div>
  		</div>
  		<div class='dropdown'><div style='display:none;' class='bar-icon'><!-- Pseudo button ---></div>
  			<div class='dropdown-menu bigmenu' id='poimenu'>
  				<div id='infotext-swipe'></div>
  				<div id='poidetails' class='beautifulmenu'>
  				</div>
  				<div id='osm-attribution'>{OSM_ATTRIBUTION}</div>
  			</div>
  		</div>
  		<div class='menuitem' onclick='requestLocation()'><img class='bar-icon' id='btn_locating' alt='{btn_locating}' title='{btn_locating}' src='images/locating.svg' />
  		</div>
  		</div>
  	</div>
  	<div id='map'>
    	<div class='info'><div id='infoPopup'></div></div>
    	<div id='map-overlay-notify' contenteditable>{MAPEMPTY}</div>
    </div>
	</section>
	<script>
		var languageOfUser = "{languageOfUser}";
	</script>
    <script src='https://unpkg.com/leaflet@1.0.3/dist/leaflet.js'></script> <!--https://policies.google.com/privacy#infocollect-->
    <script src='https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js'></script> <!--https://policies.google.com/privacy#infocollect-->
    <script src='https://code.jquery.com/jquery-3.4.1.min.js'></script> <!--https://www.digitalocean.com/legal/privacy-policy/-->
    <script src='js/request.js'></script>
    <script src='js/lang.js'></script>
    <script src='js/filters.js'></script>
    <script src='js/ui.js'></script>
    <script src='js/PDV.js'></script>
    <script src='js/map.js'></script>
  </body>
</html>
"""
def triggers(LRF):
	d = time.asctime(time.localtime()).split(" ")
	t = d[3].split(":");
	if int(t[1]) > 15:
		LRF["TRIG_LASTUPDATE"] = t[0] + ":15"
	else:
		LRF["TRIG_LASTUPDATE"] = str(int(t[0])-1) + ":15"
	return LRF	
def index():
	sfile = open(os.path.join(root, "lang", directory, languageOfUser + ".json"), "r", encoding='utf8')
	LRF = json.loads(sfile.read())
	sfile.close()
	sfile = open(os.path.join(root ,"lang", "general", languageOfUser + ".json"), "r", encoding='utf8')
	LRF.update(json.loads(sfile.read()))
	sfile.close() 
	LRF["languageOfUser"] = languageOfUser
	LRF = triggers(LRF)

	return content.format(**LRF)
def application(environ, start_response):
	global languageOfUser, root, directory, query
	start_response('200 OK', [("Content-Type", "text/html;charset=utf-8")])
	if "QUERY_STRING" in environ and not environ["QUERY_STRING"] == "":
		for q in environ["QUERY_STRING"].split("&"):
			key, value = q.split("=")
			query[key] = value
	if "lang" in query:
		languageOfUser = query["lang"]
	else:
		languageOfUser = environ["HTTP_ACCEPT_LANGUAGE"].split(",")[0][0:2]
	root = os.path.dirname(environ["SCRIPT_FILENAME"])
	while True:
		if os.path.exists(os.path.join(root, "lang")):
			break
		root = os.path.dirname(root)
	return([index().encode("utf-8")])


wsgiref.handlers.CGIHandler().run(application)
