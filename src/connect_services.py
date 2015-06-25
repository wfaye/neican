'''
Created on May 12, 2013

@author: lyb
'''
from bottle import install, redirect, post, request, template, get
from bottle_redis import RedisPlugin
from functools import wraps
from webservices.webservice import WebService
from yunti import *
import bottle

install(RedisPlugin(host=REDIS_HOST, port=REDIS_PORT, database=REDIS_DB))

app = sm.initApp(app)

ws = WebService()

def login_required(test):
    @wraps(test)
    def wrap(*args, **kwargs):
        session = bottle.request.environ['beaker.session']
        bottle.request.session = session
        if 'isAuthed' in session:
            return test(*args, **kwargs)
        else:
            #flash('You need to login first')
            return redirect('/log')
    return wrap


@post('/login')
def doAuthentication():
    error = None
    if request.forms['username'] != 'admin' or request.forms['password'] != 'admin':
        error = 'Invalid username/password. Please try again.'
    else:
        session = bottle.request.environ['beaker.session']
        session['isAuthed'] = 1
        session.save()
        return redirect('/hello')
    return template('webpages/login1.html', request=request, error=error)
  

@post('/ws/login')
def login(rdb):
    loginPara = bottle.request.json
    username = loginPara[u'username']
    if username == u'a':
        session = bottle.request.environ['beaker.session']
        session['isAuthed'] = 1
        session.save()
    return {'ec':0}

@get('/logout')
def logout(rdb):
    session = bottle.request.environ['beaker.session']
    session.pop('isAuthed', None)
    return redirect("/")

   

