# -*- coding: utf-8 -*-
'''
Created on May 14, 2013

@author: lyb
'''
from bottle import get, post, request
from domain import User, Post, Timeline
from messages.domain import OutMessage, STATUS_SENT_SUCCESS
from messages.message_dispatcher import dispatcher
from session import login_required
from webservices.webservice import respond_success, respond_failure
from yunti import EC_USER_NOT_FOUND
import bottle


class CompoundMessage(object):
    def __init__(self, text, image=None, location=None):
        self.text = text
        self.image = image
        self.location = location

'''  
# 发表一条动态
@post("/ws/posts")
@login_required
def post(context):
    user = context.get_cur_user()
    content = CompoundMessage(bottle.request.POST['content'])
    return respond_success({'post_id': Post.create(user, content)})

# 获取动态墙
@get("/ws/posts/self")
@login_required
def get_posts(context):
    user = context.get_cur_user()
    return respond_success({'posts': user.posts()})
  
# 关注
@post("/ws/follow/:name_to_follow")
@login_required
def follow(context, name_to_follow):
    user_to_follow = User.find_by_username(name_to_follow)
    if user_to_follow:
        user = context.get_cur_user()    
        user.follow(user_to_follow)
        return respond_success()
    else:
        return respond_failure(EC_USER_NOT_FOUND)

# 取消关注
@post("/ws/unfollow/:name_to_follow")
@login_required
def unfollow(context, name_to_unfollow):
    user_to_unfollow = User.find_by_username(name_to_unfollow)
    if user_to_unfollow:
        user = context.get_cur_user()
        user.follow(user_to_unfollow)
        return respond_success()
    else:
        return respond_failure(EC_USER_NOT_FOUND)
'''  
# 发消息
@post("/ws/send_message")
#@login_required
def send_message():
    #user = context.get_cur_user()
    user = User.find_by_id(1) 
    '''
    content = CompoundMessage(bottle.request.POST['content'])
    recepients = bottle.request.POST['recepients']
    method = bottle.request.POST['method']
    subject = bottle.request.POST['subject']
    '''
    inmessage_json = request.json
    content = inmessage_json['content']            #compoundMessage中的image和location从哪里来？？？？？
    recepients = inmessage_json['recepients']
    method = inmessage_json['method']
    subject = inmessage_json['subject']
    outmessage_id= OutMessage.create(user, method, subject, content)
    #rc = dispatcher.dispatch(method, recepients, out_message)
    rc = dispatcher.dispatch(recepients, outmessage_id)
    out_message = OutMessage.find_by_id(outmessage_id)
    if rc == STATUS_SENT_SUCCESS:
        out_message.set_sent_ok()        
        return respond_success()
    else:
        out_message.set_sent_error(rc)
        return respond_failure(rc)
    #log


# 取收件箱信息列表
@get("/ws/users/self/inbox")
#@login_required
def get_inbox():
    '''
    user = context.get_cur_user()
    messages = user.inbox()
    return respond_success({'messages': messages})
    '''
    user = User.find_by_id(1)
    messages = user.inbox(1)
    return respond_success({'messages': messages})

  


    
  

