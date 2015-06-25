'''
Created on 2013-5-14

@author: haojinming
'''
from contacts import contact
from users import user

class PersonalUser(user.User, contact.Contact):
    def __init__(self, user_create_date, user_effective_start_date, user_password, user_contact_id, user_created_by, 
                 contact_create_date, contact_effective_start_date, contact_contact_name, contact_primary_email, contact_secondary_email, contact_office_phone,
                 contact_mobile_phone, contact_fax, contact_gender, contact_status, contact_date_of_birth, contact_image, contact_created_by):
        user.User.__init__(self, user_create_date, user_effective_start_date, user_password, user_contact_id, user_created_by)
        contact.Contact.__init__(self, contact_create_date, contact_effective_start_date, contact_contact_name, contact_primary_email, contact_secondary_email, contact_office_phone, contact_mobile_phone, contact_fax, contact_gender, contact_status, contact_date_of_birth, contact_image, contact_created_by)
