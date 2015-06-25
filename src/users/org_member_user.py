'''
Created on 2013-5-14

@author: haojinming
'''
from users import personal_user
from contacts import organization 

class Org_memberUser(personal_user.PersonalUser, organization.Organization):
    def __init__(self,user_create_date, user_effective_start_date, user_password, user_contact_id, user_created_by, 
                 contact_create_date, contact_effective_start_date, contact_contact_name, contact_primary_email, contact_secondary_email, contact_office_phone,
                 contact_mobile_phone, contact_fax, contact_gender, contact_status, contact_date_of_birth, contact_image, contact_created_by,
                 orgmember_create_date, orgmember_effective_start_date, orgmember_org_id, orgmember_contact_id,
                 orgmember_user_id, orgmember_job_position, orgmember_is_admin, orgmember_status, orgmember_created_by,
                 org_create_date, org_effective_start_date, org_org_name, org_org_start_date, org_parent_org_id, org_in_charge_person_name,
                 org_main_phone_num, org_org_website, org_registered_user_id, org_industry_class_id, org_registered_capital, org_capital_currency_id,
                 org_industry_key_words, org_core_business, org_status, org_license_nbr, org_org_code, org_registration_type, org_created_by):
        personal_user.PersonalUser.__init__(self, user_create_date, user_effective_start_date, user_password, user_contact_id, user_created_by, contact_create_date, contact_effective_start_date, contact_contact_name, contact_primary_email, contact_secondary_email, contact_office_phone, contact_mobile_phone, contact_fax, contact_gender, contact_status, contact_date_of_birth, contact_image, contact_created_by)
        organization.Organization.__init__(self, org_create_date, org_effective_start_date, org_org_name, org_org_start_date, org_parent_org_id, org_in_charge_person_name, org_main_phone_num, org_org_website, org_registered_user_id, org_industry_class_id, org_registered_capital, org_capital_currency_id, org_industry_key_words, org_core_business, org_status, org_license_nbr, org_org_code, org_registration_type, org_created_by)
        