'''
Created on Feb 25, 2013

@author: lyb
'''
       
class User(object):
    def __init__(self, user_create_date, user_effective_start_date, user_password, user_contact_id, user_created_by):                 
        self.user_create_date = user_create_date 
        self.user_effective_start_date = user_effective_start_date 
        self.user_password = user_password
        self.user_contact_id = user_contact_id
        self.user_created_by = user_created_by


