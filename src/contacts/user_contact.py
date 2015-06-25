# -*- coding: utf-8 -*-
'''
Created on 2013-5-14

@author: haojinming
'''
from contacts import contact
import copy


class User_contact(contact.Contact):
    def __init__(self, usercontact_user_id, usercontact_contact_id, usercontact_org_id, usercontact_contact_nick_name, usercontact_user_contact_type,usercontact_contact_get_channel, usercontact_contact_get_date,
                 usercontact_status, usercontact_comments, usercontact_memo, usercontact_create_date, usercontact_created_by,
                 contact_create_date, contact_effective_start_date, contact_contact_name, contact_primary_email, contact_secondary_email, contact_office_phone,
                 contact_mobile_phone, contact_fax, contact_gender, contact_status, contact_date_of_birth, contact_image, contact_created_by):
        self.user_id = usercontact_user_id 
        self.org_id = usercontact_org_id
        self.contact_nick_name = usercontact_contact_nick_name
        self.user_contact_type = usercontact_user_contact_type
        self.contact_get_channel = usercontact_contact_get_channel
        self.contact_get_date = usercontact_contact_get_date
        self.comments = usercontact_comments
        self.memo = usercontact_memo
        contact.Contact.__init__(self, usercontact_contact_id, usercontact_create_date, contact_effective_start_date, contact_contact_name, contact_primary_email, contact_secondary_email, contact_office_phone, contact_mobile_phone, contact_fax, contact_gender, usercontact_status, contact_date_of_birth, contact_image, usercontact_created_by)
      
      
class DetailedOrganization(object):
  def __init__(self, id, name, is_yunti_reg, address=None, postcode=None, main_phone_number=None, 
               fax_number=None, website=None, primary_email=None, logo_image=None,  
               status=0, created_by=None, yunti_reg_user_id=None, profile_manager=None, parent_org_id=None, in_charge_person_name=None, 
               industry_class_id=None, registered_capital=None, capital_currency_id=None, industry_key_words=None, core_business=None, 
               license_nbr=None, code=None, registration_type=None,  
               social_medias=[], tags=[]
               ):
        self.id = id    
        self.name = name
        self.parent_org_id = parent_org_id
        self.in_charge_person_name = in_charge_person_name
        self.is_yunti_reg = is_yunti_reg
        self.yunti_reg_user_id = yunti_reg_user_id          
        self.profile_manager = profile_manager    
        self.logo_image = logo_image         
        self.address = address
        self.postcode = postcode     
        self.main_phone_number = main_phone_number
        self.fax_number = fax_number   
        self.primary_email = primary_email  
        self.website = website
        self.industry_class_id = industry_class_id
        self.registered_capital = registered_capital
        self.capital_currency_id = capital_currency_id
        self.industry_key_words = industry_key_words
        self.core_business = core_business
        self.status = status        
        self.license_nbr = license_nbr
        self.code = code       
        self.registration_type = registration_type
        self.created_by = created_by
        self.social_medias = social_medias    
        self.tags = tags

      
class ShortOrganization(object):
    def __init__(self, id, name, addr, job_titles):
        self.org_id = id
        self.org_name = name
        self.org_address = addr
        self.job_positions = job_titles

class Struct(object):
    def __init__(self, **entries): 
        self.__dict__.update(entries)
        
class ExtraPhones(Struct):
    def __init__(self, dict):
        Struct.__init__(self, **dict)

class ShortSocialMedia():
    def __init__(self, party_sm_id, sm_name, type, url):
        self.party_sm_id = party_sm_id
        self.sm_name = sm_name
        self.type = type
        self.url = url
        
class DetailedSocialMedia():
    def __init__(self, id, party_id, party_rel_id, sm_type_name, sm_name, url, is_active, description):
        self.id = id
        self.party_id = party_id
        self.party_rel_id = party_rel_id
        self.sm_type_name = sm_type_name
        self.sm_name = sm_name
        self.url = url
        self.is_active = is_active
        self.description = description

        
class ShortTag():
    def __init__(self, id, oid, name):
        self.id = id
        self.oid = oid
        self.name = name
  
class DetailedContact(object):
    def __init__(self, id, name, first_name, last_name, nick_name, primary_email, extra_emails, mobile_phone, extra_phones,
                 gender, status, date_of_birth, image, isUser, effective_start_date, create_date, created_by, organizations,
                 social_medias, tags):
        self.id = id
        self.name = name
        self.first_name = first_name
        self.last_name = last_name
        self.nick_name = nick_name
        self.primary_email = primary_email
        #self.extra_emails = []
        #self.extra_emails.append(secondary_email)
        self.extra_emails = extra_emails
        self.mobile_phone = mobile_phone
        self.extra_phones = extra_phones
        #self.extra_phones = {'office_phone':office_phone, 'fax': fax}
        self.gender = gender
        self.status = status
        self.date_of_birth = date_of_birth
        self.image = image
        self.isUser = isUser
        
        self.effective_start_date = effective_start_date
        self.create_date = create_date 
        self.created_by = created_by    
        self.organizations = organizations
        '''
        self.organizations = [
            {
             'org_id': org_id,
             'org_name': org_name,
             'job_position': job_pos
            },
            {
             'org_id': org_id2,
             'org_name': org_name2,
             'job_position': job_pos2
             }]
      
        self.social_medias = [
            {
             'id': facebookid,
             'type': 'facebook',
             'url': facebook_url
            },
            {
             'id': sina_id,
             'type': 'weibo',
             'url': weibo_url
            }
          ]
        
        self.tags = [tag1, tag2]
        '''
        self.social_medias = social_medias
        self.tags = tags
        
        
        
      
      
              
class ShortContact(object):
    def __init__(self, dc):
        self.id = dc.id
        self.name = dc.name
#        org = dc.organizations[0]
#        self.org_id = org.org_id
#        self.org_name = org.org_name
#        self.org_address = org.org_address
#        self.job_positions = org.job_positions
        
        self.primary_email = dc.primary_email
        self.mobile_phone = dc.mobile_phone
        extraPhones = dc.extra_phones
        self.office_phone = extraPhones.office_phone
        self.gender = dc.gender
        self.status = dc.status
        self.image = dc.image
        
        self.tags = dc.tags
        self.social_medias = dc.social_medias
        self.organizations = dc.organizations
        


