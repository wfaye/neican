'''
Created on 2013-4-25

@author: haojinming
'''


from contacts import organization
from contacts import contact

class Org_member(organization.Organization, contact.Contact):
    def __init__(self, orgmember_create_date, orgmember_effective_start_date, orgmember_org_id, orgmember_contact_id,
                 orgmember_user_id, orgmember_job_position, orgmember_is_admin, orgmember_status, orgmember_created_by,
                 contact_create_date, contact_effective_start_date, contact_contact_name, contact_primary_email, contact_secondary_email, contact_office_phone,
                 contact_mobile_phone, contact_fax, contact_gender, contact_status, contact_date_of_birth, contact_image, contact_created_by,
                 org_create_date, org_effective_start_date, org_org_name, org_org_start_date, org_parent_org_id, org_in_charge_person_name,
                 org_main_phone_num, org_org_website, org_registered_user_id, org_industry_class_id, org_registered_capital, org_capital_currency_id,
                 org_industry_key_words, org_core_business, org_status, org_license_nbr, org_org_code, org_org_reg_type, org_created_by):
        self.orgmember_create_date = orgmember_create_date 
        self.orgmember_effective_start_date = orgmember_effective_start_date 
        self.orgmember_org_id = orgmember_org_id
        self.orgmember_contact_id = orgmember_contact_id
        self.orgmember_user_id = orgmember_user_id
        self.orgmember_job_position = orgmember_job_position
        self.orgmember_is_admin = orgmember_is_admin
        self.orgmember_status = orgmember_status
        self.orgmember_created_by = orgmember_created_by
        contact.Contact.__init__(self, contact_create_date, contact_effective_start_date, contact_contact_name, contact_primary_email, contact_secondary_email, contact_office_phone, contact_mobile_phone, contact_fax, contact_gender, contact_status, contact_date_of_birth, contact_image, contact_created_by)
        organization.Organization.__init__(self, org_create_date, org_effective_start_date, org_org_name, org_org_start_date, org_parent_org_id, org_in_charge_person_name, org_main_phone_num, org_org_website, org_registered_user_id, org_industry_class_id, org_registered_capital, org_capital_currency_id, org_industry_key_words, org_core_business, org_status, org_license_nbr, org_org_code, org_org_reg_type, org_created_by)
'''
class Org_memberUser(Org_member, user.PsersonalUser):
    def __init__(self,orgmember_create_date, orgmember_effective_start_date, orgmember_org_id, orgmember_contact_id,
                 orgmember_user_id, orgmember_job_position, orgmember_is_admin, orgmember_status, orgmember_created_by,
                 org_create_date, org_effective_start_date, org_org_name, org_org_start_date, org_parent_org_id, org_in_charge_person_name,
                 org_main_phone_num, org_org_website, org_registered_user_id, org_industry_class_id, org_registered_capital, org_capital_currency_id,
                 org_industry_key_words, org_core_business, org_status, org_license_nbr, org_org_code, org_registration_type, org_created_by,
                 user_create_date, user_effective_start_date, user_password, user_contact_id, user_created_by, 
                 contact_create_date, contact_effective_start_date, contact_contact_name, contact_primary_email, contact_secondary_email, contact_office_phone,
                 contact_mobile_phone, contact_fax, contact_gender, contact_status, contact_date_of_birth, contact_image, contact_created_by):
        Org_member.__init__(self, orgmember_create_date, orgmember_effective_start_date, orgmember_org_id, orgmember_contact_id, orgmember_user_id, orgmember_job_position, orgmember_is_admin, orgmember_status, orgmember_created_by, org_create_date, org_effective_start_date, org_org_name, org_org_start_date, org_parent_org_id, org_in_charge_person_name, org_main_phone_num, org_org_website, org_registered_user_id, org_industry_class_id, org_registered_capital, org_capital_currency_id, org_industry_key_words, org_core_business, org_status, org_license_nbr, org_org_code, org_registration_type, org_created_by)
        user.PsersonalUser.__init__(self, user_create_date, user_effective_start_date, user_password, user_contact_id, user_created_by, contact_create_date, contact_effective_start_date, contact_contact_name, contact_primary_email, contact_secondary_email, contact_office_phone, contact_mobile_phone, contact_fax, contact_gender, contact_status, contact_date_of_birth, contact_image, contact_created_by)
       
        
        
class Oer_memberContact(Org_member, contact.Contact):
    def __init__(self, orgmember_create_date, orgmember_effective_start_date, orgmember_org_id, orgmember_contact_id,
                 orgmember_user_id, orgmember_job_position, orgmember_is_admin, orgmember_status, orgmember_created_by,
                 org_create_date, org_effective_start_date, org_org_name, org_org_start_date, org_parent_org_id, org_in_charge_person_name,
                 org_main_phone_num, org_org_website, org_registered_user_id, org_industry_class_id, org_registered_capital, org_capital_currency_id,
                 org_industry_key_words, org_core_business, org_status, org_license_nbr, org_org_code, org_registration_type, org_created_by,
                 contact_create_date, contact_effective_start_date, contact_contact_name, contact_primary_email, contact_secondary_email, contact_office_phone,
                 contact_mobile_phone, contact_fax, contact_gender, contact_status, contact_date_of_birth, contact_image, contact_created_by):
        Org_member.__init__(self, orgmember_create_date, orgmember_effective_start_date, orgmember_org_id, orgmember_contact_id, orgmember_user_id, orgmember_job_position, orgmember_is_admin, orgmember_status, orgmember_created_by, org_create_date, org_effective_start_date, org_org_name, org_org_start_date, org_parent_org_id, org_in_charge_person_name, org_main_phone_num, org_org_website, org_registered_user_id, org_industry_class_id, org_registered_capital, org_capital_currency_id, org_industry_key_words, org_core_business, org_status, org_license_nbr, org_org_code, org_registration_type, org_created_by)
        contact.Contact.__init__(self, contact_create_date, contact_effective_start_date, contact_contact_name, contact_primary_email, contact_secondary_email, contact_office_phone, contact_mobile_phone, contact_fax, contact_gender, contact_status, contact_date_of_birth, contact_image, contact_created_by)
'''        