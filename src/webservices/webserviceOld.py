'''
Created on Feb 14, 2013

@author: lyb
'''
from bottle import jinja2_template as template, jinja2_view as view, run, route, \
    static_file, install, get, put, request, post, delete, template, TEMPLATE_PATH, \
    redirect
from bottle_redis import RedisPlugin
from functools import wraps
from yunti import um, sm, cm
import bottle

#run, route, \
#    install, get, put, request, post, delete, template, TEMPLATE_PATH, redirect


install(RedisPlugin(host='localhost'))

TEMPLATE_PATH.append("templates/")

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

@get('/')
def home():
    return redirect('/login')
 
@get('/newContactPage')
@view('newContact.html')
def newContactPage():
    return {}

@get('/contactListPage')
@view('contactListPage.html')
def contactListPage():
    contacts = cm.getContactList()
    #["zhang san", "li si", "wang wu"]
    contactlist = ''
    for contact in contacts:
        a = '<li>' + contact[0] + '</li>'
        contactlist = contactlist + a
    return {'contactlist':contactlist}

@get('/contactListPage')
@view('contactListPage.html')
def contactListPageByUser(uid):
    contacts = cm.getContactListByUser(uid)
    #["zhang san", "li si", "wang wu"]
    contactlist = ''
    for contact in contacts:
        a = '<li>' + contact[0] + '</li>'
        contactlist = contactlist + a
    return {'contactlist':contactlist}

@get('/ws/contacts/:contactid') 
def getContact(contactid):
    return cm.getContact(contactid)

def deleteContact(contactid):
    return cm.removeContact(contactid)
    
@put('/ws/contacts/:contactid')
def modifyContact(contactid):
    contact = request.json
    return cm.modifyContact(contactid, contact)

@post('/ws/contacts')
def addContact(rdb):
    contact = request.json
    return cm.addContact(contact)
    
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
@login_required
@view('index.html')
def mainpage():
    return {}

@get('/login')
@view('webpages/login.html')
def getLoginPage():
    #return template('login.html', request=request, error=None)
    return {}

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

    
@get('/ws/users/:uid') 
def getUser(uid):
    return um.getUser(uid)

@put('/ws/users/:uid')
def modifyUser(uid):
    user = request.json
    return um.modifyUser(uid, user)

@post('/ws/users')
def addUser(rdb):
    user = request.json
    return um.addUser(user)

@delete('/ws/users/:uid')
def deleteUser(uid):
    return um.removeUser(uid)


@route('/:filepath#.+#')
def server_all(filepath):
    return static_file(filepath, root='webpages')




app = bottle.app()

application = sm.initApp(app)

def _initialize():
    sm.clearOldSessions();
    
if __name__=="__main__":
    _initialize()
    run(app=application, host='127.0.0.1', port=8080)

