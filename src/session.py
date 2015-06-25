'''
Created on Feb 24, 2013

@author: lyb
'''

from beaker.middleware import SessionMiddleware
from bottle import redirect, get, install, request, response
from bottle_redis import RedisPlugin
from functools import wraps

from settings.settings import REDIS_HOST,REDIS_PORT
#from messages.domain import User



class SessionManager(object):
    def initApp(self, app, session_opts):
        self.clearOldSessions();
        install(RedisPlugin(host=REDIS_HOST, port=REDIS_PORT))
        return SessionMiddleware(app, session_opts)
    
    def clearOldSessions(self):
        pass
      
    def get_user(self, session):
        return 
"""        
class Context(object):
    def __init__(self, userid, session):
        self.cur_userid = userid
        self.session = session
    
    def get_cur_userid(self):
        return self.cur_userid
    
    def get_cur_user(self):
        return User.find_user_byid(self.cur_userid)
   
def login_required(handler):
    @wraps(handler)
    def wrap(*args, **kwargs):
        session = bottle.request.environ['beaker.session']
        bottle.request.session = session
        
        '''
        The following is for test, assume all requests are sent by user whose id is '1'
        '''
        context = Context(1, session)
        return handler(context, *args,**kwargs)
        
      
      
        if 'isAuthed' in session:
            userid =  session['cur_userid']
            if userid:
                context = Context(userid, session)
                return handler(context, *args,**kwargs)
        else:
            #flash('You need to login first')
            return redirect('/log')
    return wrap
"""

def login_required(handler):
    @wraps(handler)
    def wrap(*args, **kwargs):
        session = request.environ['beaker.session']
        if 'isAuthed' in session:
            return handler(*args,**kwargs)
        else:
            return redirect('/login.html')
    return wrap

"""
@get('/test')
def test():
    s = request.environ['beaker.session']
    s['test'] = s.get('test', 0) + 1
    s.save()
    return 'Test conter: %d' % s['test']
"""


        
        
        
        
        
        