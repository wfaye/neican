'''
Created on 2013-5-2

@author: haojinming
'''
from contacts import tag

class User_contact_tag(tag.Tag):
    def __init__(self, usercontacttag_user_contact_id, usercontacttag_tag_id, create_date, usercontacttag_created_by,
                 tag_scope, tag_item_id, tag_tag_name, tag_create_date, tag_created_by):
        self.usercontacttag_user_contact_id = usercontacttag_user_contact_id
        self.usercontacttag_tag_id = usercontacttag_tag_id
        self.create_date = create_date
        self.usercontacttag_created_by = usercontacttag_created_by
        tag.Tag.__init__(self, tag_scope, tag_item_id, tag_tag_name, tag_create_date, tag_created_by)
        
        