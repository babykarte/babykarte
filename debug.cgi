#!/usr/bin/python3
import wsgiref.handlers
import cgi, time
import os, json, sys

languageOfUser = "en"
root = ""
directory = "index"
query = {}
def application(environ, start_response):
	global languageOfUser, root, directory, query
	start_response('200 OK', [("Content-Type:", "text/html;charset=utf-8")])
	return [str(environ).encode("utf-8")]
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
