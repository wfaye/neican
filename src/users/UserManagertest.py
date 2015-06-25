# -*- coding: utf-8 -*-
'''
Created on 2013-8-14

@author: haojinming
'''
from users import UserManager
from contacts import contact
from bottle import jinja2_template as template, jinja2_view as view, run, route, \
  static_file, install, get, put, request, post, delete, template, TEMPLATE_PATH, \
  redirect, response
import bottle
import jsonpickle

app = bottle.app()

um = UserManager.BLUserManager()

def test_register():
    result = um.register('526662774@qq.com', '12345678')
    print result

def test_activate():
    result = um.activate("TuX49hE6vNxfGy58w7nb")
    print result

def test_login():
    result = um.login('526662774@qq.com', '12345678')
    print result





if __name__ == '__main__':
    test_login()
    