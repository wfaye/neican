'''
Created on Mar 6, 2013

@author: lyb
'''
import redis

from settings.settings import REDIS_DB, REDIS_PORT, REDIS_HOST
from users.UserManager import BLUserManager
from session import SessionManager, login_required
from contacts.ContactManager import BLIVManager
from contacts.GroupManager import BLGroupManager



rdb = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)

sm = SessionManager()
im = BLIVManager()
gm = BLGroupManager()
um = BLUserManager()






