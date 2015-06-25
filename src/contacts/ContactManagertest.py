'''
Created on 2013-4-22

@author: admin
'''
from contacts import ContactManager
from bottle import jinja2_template as template, jinja2_view as view, run, route, \
  static_file, install, get, put, request, post, delete, template, TEMPLATE_PATH, \
  redirect, response
import bottle


app = bottle.app()

im = ContactManager.BLIVManager()


@get('/ekb/company/<id:int>/overview')
def test_getCompanyOverview(id):
    return im.getCompanyOverview(id)
    

    

if __name__ == '__main__':
    run(app=app, host='127.0.0.1', port=8080)







