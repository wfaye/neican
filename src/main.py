# -*- coding: utf-8 -*-
'''
Created on Feb 14, 2013

@author: lyb
'''


import sys
reload(sys)
sys.setdefaultencoding('utf8')

import bottle


from settings import settings
#from settings import session_opts,SIMPLE_WEBSERVER

app = bottle.app()

if settings.SIMPLE_WEBSERVER:
    import testdata
else: 
    import webservices.webservice
    from yunti import sm
    app = sm.initApp(app, settings.session_opts)


import webpages.ui






if __name__=="__main__":
    bottle.run(app=app, host='localhost', port=8080)


