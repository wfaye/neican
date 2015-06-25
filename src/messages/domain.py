#!/usr/bin/env python
# -*- coding: utf-8 -*-
import re
from  yunti import rdb

SALT = "yunti"

PAGE_SIZE = 10
def get_from_to(page):
    _from, _to = (page-1)*PAGE_SIZE, page*PAGE_SIZE
    return _from, _to

class Timeline:
    def page(self,page):
        _from, _to = get_from_to(page)
        return [Post(post_id) for post_id in rdb.list_range('timeline',_from,_to)] #list_range??????


class Model(object):
    def __init__(self, obj_id):
        self.__dict__['id'] = obj_id

    def __eq__(self,other):
        return self.id == other.id

    def __setattr__(self,name,value):
        if name not in self.__dict__:
            klass = self.__class__.__name__.lower()
            key = '%s:id:%s:%s' % (klass,self.id,name.lower())  #????怎么理解 比如  'user:id:1:content'
            rdb.set(key,value)
        else:
            self.__dict__[name] = value

    def __getattr__(self,name):
        if name not in self.__dict__:
            klass = self.__class__.__name__.lower()
            v = rdb.get('%s:id:%s:%s' % (klass,self.id,name.lower()))
            if v:
                return v
                raise AttributeError('%s doesn\'t exist' % name) 
            else:
                return self.__dict__[name]
          
class User(Model):
    @staticmethod
    def find_by_username(username):
        _id = rdb.get("user:username:%s" % username)
        if _id is not None:
            return User(int(_id))
        else:
            return None

    @staticmethod
    def find_by_id(_id):
        if rdb.exists("user:id:%s:username" % _id):
            return User(int(_id))                   # 这个方法是不是没什么用啊，参数是id返回的还是id
        else:
            return None

    @staticmethod
    def create(username, password):
        user_id = rdb.incr("user:uid")
        if not rdb.get("user:username:%s" % username):
            rdb.set("user:id:%s:username" % user_id, username)
            rdb.set("user:username:%s" % username, user_id)
            
            salt = SALT
            rdb.set("user:id:%s:password" % user_id, salt+password)
            rdb.lpush("users", user_id)
            return User(user_id)
        return None

    def posts(self,page=1):
        _from, _to = get_from_to(page)
        posts = rdb.lrange("user:id:%s:posts" % self.id, _from, _to)
        if posts:
            return [Post(int(post_id)) for post_id in posts]  #返回某用户的某一页的动态
        return []
  
    def timeline(self,page=1): #什么是timeline？？？？？ timeline 和posts的区别
        _from, _to = get_from_to(page)
        timeline= rdb.lrange("user:id:%s:timeline" % self.id, _from, _to)
        if timeline:
            return [Post(int(post_id)) for post_id in timeline]
        return []

    def mentions(self,page=1):
        _from, _to = get_from_to(page)
        mentions = rdb.lrange("user:id:%s:mentions" % self.id, _from, _to)
        if mentions:
            return [Post(int(post_id)) for post_id in mentions]
        return []

    def inbox(self,page=1):
        _from, _to = get_from_to(page)
        inbox = rdb.lrange("user:id:%s:inbox" % self.id, _from, _to)
        if inbox:
            return [InMessage(int(message_id)) for message_id in inbox]
        return []

    def add_post(self,post):
        rdb.lpush("user:id:%s:posts" % self.id, post.id)
        rdb.lpush("user:id:%s:timeline" % self.id, post.id)
        rdb.sadd('posts:id', post.id)

    def add_inmessage(self, inmessage):
        rdb.lpush("user:id:%s:inbox" % self.id, inmessage.id)
        rdb.sadd('inbox:id', inmessage.id)
    
    def add_outmessage(self, outmessage):
        rdb.lpush("user:id:%s:outbox" % self.id, outmessage.id)
        rdb.sadd('outbox:id', outmessage.id)
    
    def add_timeline_post(self,post):                           #这个方法是干什么的？？？？？和add_post的区别？？？
        rdb.lpush("user:id:%s:timeline" % self.id, post.id)
    
    def add_mention(self,post):                                 #@???????
        rdb.lpush("user:id:%s:mentions" % self.id, post.id)       
    
    def follow(self,user):
        if user == self:
            return
        else:
            rdb.sadd("user:id:%s:followees" % self.id, user.id)
            user.add_follower(self)
    
    def stop_following(self,user):
        rdb.srem("user:id:%s:followees" % self.id, user.id)
        user.remove_follower(self)

    def following(self,user):
        if rdb.sismember("user:id:%s:followees" % self.id, user.id):  #follow 和 following 的区别？？？
            return True
        return False

    @property
    def followers(self):                                            #followers?????  我关注的人？？？
        followers = rdb.smembers("user:id:%s:followers" % self.id)  #获取与该Key关联的Set中所有的成员。
        if followers:
            return [User(int(user_id)) for user_id in followers]
        return []
    
    @property
    def followees(self):                                            #followees??????  关注我的人？？？
        followees = rdb.smembers("user:id:%s:followees" % self.id)
        if followees:
            return [User(int(user_id)) for user_id in followees]
        return []
    
    #added
    @property
    def tweet_count(self):
        return rdb.llen("user:id:%s:posts" % self.id) or 0    #??????
    
    @property
    def followees_count(self):
        return rdb.scard("user:id:%s:followees" % self.id) or 0
      
    @property
    def followers_count(self):
        return rdb.scard("user:id:%s:followers" % self.id) or 0
    
    def add_follower(self,user):
        rdb.sadd("user:id:%s:followers" % self.id, user.id)
    
    def remove_follower(self,user):
        rdb.srem("user:id:%s:followers" % self.id, user.id)

class Post(Model):
    @staticmethod
    def create(user, content):
        post_id = rdb.incr("post:pid")
        post = Post(post_id)
        post.content = content
        post.user_id = user.id
        #post.created_at = Time.now.to_s
        user.add_post(post)                                         #add_post?????
        rdb.lpush("timeline", post_id)
        for follower in user.followers:                             #user.followers??????
            follower.add_timeline_post(post)                        #add_timeline_post?????
        
        mentions = re.findall('@\w+', content)
        for mention in mentions:
            u = User.find_by_username(mention[1:])
            if u:
                u.add_mention(post)                                 #add_mention?????
        return post_id
    
    @staticmethod
    def find_by_id(id):
        if rdb.sismember('posts:id', int(id)):                        #判断参数中指定成员是否已经存在于与Key相关联的Set集合中
            return Post(id)
        return None
    
    @property
    def user(self):
        return User.find_by_id(rdb.get("post:id:%s:user_id" % self.id))

class InMessage(Model):
    @staticmethod
    def create(user, method, subject, content):
        inmessage_id = rdb.incr("inmessage:mid")
        inmessage = InMessage(inmessage_id)
        inmessage.content = content
        inmessage.user_id = user.id
        inmessage.method = method
        inmessage.subject = subject
        #inmessage.created_at = Time.now.to_s
        user.add_inmessage(inmessage)
        return inmessage_id
    
    @staticmethod
    def find_by_id(id):
        if rdb.sismember('inbox:id', int(id)):
            return InMessage(id)
        return None
    
    @property
    def user(self):
        return User.find_by_id(rdb.get("inmessage:id:%s:user_id" % self.id))

STATUS_UNSENT = 0
STATUS_SENT_SUCCESS = 1
STATUS_SENT_FAILURE = 2

SEND_ERROR_NONE = 0
SEND_ERROR_TIMEOUT = 1
SEND_ERROR_ROUTE = 2
class OutMessage(Model):
    @staticmethod
    def create(user, method, subject, content):
        outmessage_id = rdb.incr("outmessage:mid")
        #outmessage = InMessage(outmessage_id)?????/
        outmessage = OutMessage(outmessage_id)
        outmessage.content = content
        outmessage.user_id = user.id
        outmessage.method = method
        outmessage.subject = subject
        outmessage.status = STATUS_UNSENT
        outmessage.sent_error = SEND_ERROR_NONE
        #outmessage.created_at = Time.now.to_s
        user.add_outmessage(outmessage)
        return outmessage_id
    
    @staticmethod
    def find_by_id(id):
        if rdb.sismember('outbox:id', int(id)):
            return OutMessage(id)
        return None
    
    @property
    def user(self):
        return User.find_by_id(rdb.get("outmessage:id:%s:user_id" % self.id))
    
    def set_sent_ok(self):
        self.status = STATUS_SENT_SUCCESS
      
    def set_sent_error(self, error):
        self.status = STATUS_SENT_FAILURE
        self.sent_error = error
  

