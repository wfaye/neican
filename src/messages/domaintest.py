'''
Created on 2013-8-30

@author: haojinming
'''
import domain
import message_dispatcher


def test_create_user():
    domain.User.create('lily', '123456')


def test_find_by_id():
    result = domain.User.find_by_id(1)
    print result.__dict__

def test_find_by_username():
    result = domain.User.find_by_username('tom')
    print result.__dict__
    
def test_user_followers():
    pass

def test_create_post():
    user = domain.User.find_by_username('lily')
    content =  "hello taiyuan!"
    domain.Post.create(user, content)
    
def test_get_from_to():
    result = domain.get_from_to(1)
    print result
    
def test_timeline():
    user = domain.User.find_by_username('tom')
    result = user.timeline(1)
    print result[0].__dict__
    
def test_create_inmessage():
    user = domain.User.find_by_username('tom')
    method = 0
    subject = "test"
    content = "tom to tom"
    result = domain.InMessage.create(user, method, subject, content)
    print result
    
    
def test_create_outmessage():
    user = domain.User.find_by_username('tom')
    method = 1
    subject = "hello lily"
    content = "nice to meet you, this is from tom, this is a real messages, aaaaa"
    result = domain.OutMessage.create(user, method, subject, content)
    print result
    
def test_dispatch():
    result =message_dispatcher.Dispatcher.dispatch(['lily'], 4)
    print result
    



if __name__ == '__main__':
    test_find_by_username()