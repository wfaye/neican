'''
Created on Mar 11, 2013

@author: lyb
'''
from bottle import jinja2_template as template, jinja2_view as view, run, route, \
    static_file, install, get, put, request, post, delete, template, TEMPLATE_PATH, \
    redirect
from orm.db import proxy_db


@get('removeContactPage')
@view('removeContact.html')
def removeContactPage():
    return {}
 
 
pg = proxy_db()
    

@get('/contactListPage')
@view('contactListPage.html')
def contactListPage():
    contacts = pg.getContactList()
    #["zhang san", "li si", "wang wu"]
    contactlist = ''
    for contact in contacts:
        a = '<li>' + contact[0] + '</li>'
        contactlist = contactlist + a
    return {'contactlist':contactlist}

