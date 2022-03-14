#!/usr/bin/python3
import wsgiref.handlers
import cgi
import os, json, sys

languageOfUser = "en"
root = ""
directory = "impress"
query = {}
content = """<!DOCTYPE html>
<html>
  <head>
    <title>Babykarte - {IMPRESS_TITLE}</title>
    <meta charset='utf-8' />
	<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'>
    <link rel='stylesheet' href='../css/style.css' />
    <link rel='stylesheet' href='../css/specialsite.css' />
    <link rel='icon' href='../favicon.ico' type='image/x-icon' />
  </head>
  <body id='site-impress'>
  	<section>
  	<div class='leftbar'>
  		<div class='menuitem dropdown'><img class='bar-icon' id='btn_info' src='../images/info.svg.png' onclick='toggleMenu(this)' />
  			<div class='dropdown-menu about' id='aboutus'>
  				<a href='https://github.com/babykarte/babykarte' target='_blank' id='linkToGitHub'>{LNK_GITHUB}</a>
        		<a href='https://wiki.openstreetmap.org/wiki/Baby-Karte' target='_blank' id='linkToOSMWiki'>{LNK_OSMWIKI}</a>
        		<a href='../impress?lang={languageOfUser}' id='lnk-impress' target='_blank'>{LNK_IMPRESS}</a>
        		<a href='../privacypolicy/{languageOfUser}.html' id='linkToPP' target='_blank;'>{LNK_PP_SITE}</a>
  			</div>
  		</div>
  		<div class='menuitem dropdown'><img class='bar-icon' id='btn_lang' src='../images/www.svg' onclick='toggleMenu(this)' />
  			<div class='dropdown-menu lang-select'>
  				<a href='?lang=en' class='nounderlinestyle'><span class='small-icon'>EN</span></a>
  				<a href='?lang=de' class='nounderlinestyle'><span class='small-icon'>DE</span></a>
  				<a href='?lang=fr' class='nounderlinestyle'><span class='small-icon'>FR</span></a>
  			</div>
  		</div>
  		<div class='menuitem' onclick='location = "../?lang={languageOfUser}"'><img class='bar-icon' id='btn_locating' src='../images/return.svg' />
  		</div>
  	</div>
    <main>
		<h1 id='title'>{IMPRESS_TITLE}</h1>
		<br>
		<h2 id='subtitle'>{IMPRESS_SUBTITLE}</h2>
		<address>
			Michael Brandtner<br>
			Weißenburgstr. 3<br>
			24116 Kiel<br>
			<span id='country'>{IMPRESS_COUNTRY}</span><br>
		</address>
		<br>
		<h2 id='contact'>{IMPRESS_CONTACT}</h2>
		<address>
			<b>E-Mail:</b> babykarte@posteo.de<br>
		</address>
		<br>
		<span id='note'>
		{IMPRESS_NOTE}
		</span>
	</main>
	<script src='../js/ui.js'></script>
	</section>
  </body>
</html>
"""
def index():
	sfile = open(os.path.join(root, "lang", directory, languageOfUser + ".json"), "r", encoding='utf8')
	LRF = json.loads(sfile.read())
	sfile.close()
	sfile = open(os.path.join(root ,"lang", "general", languageOfUser + ".json"), "r", encoding='utf8')
	LRF.update(json.loads(sfile.read()))
	sfile.close()
	LRF["languageOfUser"] = languageOfUser

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
		if os.path.exists(os.path.join(os.path.dirname(root), "lang")):
			root = os.path.dirname(root)
			break
	return([index().encode("utf-8")])


wsgiref.handlers.CGIHandler().run(application)
