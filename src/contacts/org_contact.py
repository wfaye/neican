'''
Created on 2013-4-25

@author: haojinming
'''

from contacts import contact

class Org_contact(contact.Contact):
    def __init__(self, orgcontact_org_id, orgcontact_contact_id, orgcontact_contact_org_id, orgcontact_contact_nick_name, 
                 orgcontact_contact_type,orgcontact_contact_get_channel, orgcontact_contact_get_date, orgcontact_status, 
                 orgcontact_comments, orgcontact_memo, orgcontact_org_member_id, orgcontact_created_by,
                 contact_create_date, contact_effective_start_date, contact_contact_name, contact_primary_email, contact_secondary_email, contact_office_phone,
                 contact_mobile_phone, contact_fax, contact_gender, contact_status, contact_date_of_birth, contact_image, contact_created_by):
        self.orgcontact_org_id = orgcontact_org_id 
        self.orgcontact_contact_id = orgcontact_contact_id 
        self.orgcontact_contact_org_id = orgcontact_contact_org_id
        self.orgcontact_contact_nick_name = orgcontact_contact_nick_name
        self.orgcontact_contact_type = orgcontact_contact_type
        self.orgcontact_contact_get_channel = orgcontact_contact_get_channel
        self.orgcontact_contact_get_date = orgcontact_contact_get_date
        self.orgcontact_status = orgcontact_status
        self.orgcontact_comments = orgcontact_comments
        self.orgcontact_memo = orgcontact_memo
        self.orgcontact_org_member_id = orgcontact_org_member_id
        self.orgcontact_created_by = orgcontact_created_by
        contact.Contact.__init__(self, contact_create_date, contact_effective_start_date, contact_contact_name, contact_primary_email, contact_secondary_email, contact_office_phone, contact_mobile_phone, contact_fax, contact_gender, contact_status, contact_date_of_birth, contact_image, contact_created_by)
        
        
