# -*- coding: utf-8 -*-
'''
Created on 2013-5-29

@author: haojinming
'''
from yunti import *
from webservices import webservice
from contacts import contact
from bottle import jinja2_template as template, jinja2_view as view, run, route, \
  static_file, install, get, put, request, post, delete, template, TEMPLATE_PATH, \
  redirect, response
import bottle
import jsonpickle
from contacts import ContactManager


app = bottle.app()

@get('/ekb/watchList/<uid>')
def get_watchlist(uid):
    return ContactManager.BLIVManager.getWatchlistInfo(uid)
    



    
if __name__ == '__main__':
    run(app=app, host='127.0.0.1', port=8080)
