'''
Created on 2013-8-30

@author: haojinming
'''
import message_services
import bottle
from bottle import jinja2_template as template, jinja2_view as view, run, route, \
  static_file, install, get, put, request, post, delete, template, TEMPLATE_PATH, \
  redirect, response


app = bottle.app()
@get("/ws/users/self/inbox")
def test_get_inbox():
    result = message_services.get_inbox()
    print result['resp']['messages'][0].content
    
@post('/request/post')
def test_requestpost():
    '''
    method = bottle.request.POST['method']
    subject = bottle.request.POST['subject']
    print method,subject
    '''
    post = bottle.request.POST
    print post.__dict__
    
@post("/ws/send_message")
def test_send_message():
    result = message_services.send_message()
    print result
    
    
if __name__ == '__main__':
    run(app=app, host='127.0.0.1', port=8080)