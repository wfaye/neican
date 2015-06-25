'''
Created on May 12, 2013

@author: lyb
'''

from bottle import get, redirect, view, route, static_file
from session import login_required

"""
@get('/')
def home():
    return redirect('/login')
"""
 
@get('/newContactPage')
@view('newContact.html')
def newContactPage():
    return {}

@get('/help')
@view('help.html')
def get_help():
    return {}

@get('/contactus')
@view('contactus.html')
def contactus():
    return {}

@get('/hello')
@view('hello.html')
def hello():
    return {}

@get('/login/index.html')
@view('index.html')
def mainpage():
    return {}

"""static files controller
"""
"""
@route('/:filepath#.+#')
def server_all(filepath):
    return static_file(filepath, root='webpages')
"""
@route('/<filepath:re:(mainpage|detailProfile)\.html>')
@login_required
def server_limited(filepath):
    return static_file(filepath, root='webpages')

@route('/:filepath#.+#')
def server_all(filepath):
    return static_file(filepath, root='webpages')

"""
@get('/login')
@view('webpages/login.html')
def getLoginPage():
    #return template('login.html', request=request, error=None)
    return {}
"""