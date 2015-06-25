# -*- coding: utf-8 -*-
'''
Created on 2013-4-7

@author: haojinming
'''

from datetime import datetime, date
from sqlalchemy import MetaData, Sequence, ForeignKey, and_, func, or_
from sqlalchemy.engine import create_engine
from sqlalchemy.orm import mapper, relationship
from sqlalchemy.orm.session import sessionmaker
from sqlalchemy.schema import Table, Column
from sqlalchemy.types import Integer, String, DateTime, Date, Text, Numeric, Boolean, Float, LargeBinary
from sqlalchemy import desc
import json
import jsonpickle
import string
from contacts import user_contact as blUser_contact

from settings.settings import create_redis, REDIS_PWD_FORGOT_DB
                             

class ConnectionStringCreator(object):
    def __init__(self, server_name, db_name, user_name, pwd):
        self.server_name = server_name
        self.db_name = db_name
        self.user_name = user_name
        self.pwd = pwd 
        self.connection_string = 'postgresql+psycopg2://'+ self.user_name + ':' + self.pwd + '@'+ self.server_name + '/' + self.db_name
        
    
    def __call__(self):
        """Defines a custom creator to be passed to sqlalchemy.create_engine
         http://stackoverflow.com/questions/111234/what-is-a-callable-in-python#111255"""
        return self.connection_string
    
    def create_engine(self):
        return create_engine(self.connection_string, echo = True)


creator = ConnectionStringCreator('192.168.30.173','yunti','ws_dblayer','progress*2013')
engine = creator.create_engine()
metadata1 = MetaData(engine,schema='warehouse')
metadata2 = MetaData(engine,schema='neican')



class Address(object):
    def __init__(self, address_key, data_loaded_date, data_loader, country, province, city,
                 county, district, mail_address, zipcode, post_office_box, latitude, longitude, prefectural_city):
        self.address_key = address_key   
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.country = country
        self.province = province
        self.city = city
        self.county = county
        self.district = district
        self.mail_address = mail_address
        self.zipcode = zipcode
        self.post_office_box = post_office_box
        self.latitude = latitude
        self.longitude = longitude
        self.prefectural_city = prefectural_city
        
address = Table('address', metadata1, autoload=True)

mapper(Address, address)



class Calendar_date(object):
    def __init__(self, calendar_date_key, year_date, year, quarter_date, quarter, month_date,
                 month, month_name, sunday_week_date, sunday_week, monday_week_date, monday_week,
                 week_in_month, julian_week_numeric, julian_day, day_date, day_name, holiday_flag, holiday_name):
        self.calendar_date_key = calendar_date_key   
        self.year_date = year_date
        self.year = year
        self.quarter_date = quarter_date
        self.quarter = quarter
        self.month_date = month_date
        self.month = month
        self.month_name = month_name
        self.sunday_week_date = sunday_week_date
        self.sunday_week = sunday_week
        self.monday_week_date = monday_week_date
        self.monday_week = monday_week
        self.week_in_month = week_in_month
        self.julian_week_numeric = julian_week_numeric
        self.julian_day = julian_day
        self.day_date = day_date
        self.day_name = day_name
        self.holiday_flag = holiday_flag
        self.holiday_name = holiday_name
        
calendar_date = Table('calendar_date', metadata1, autoload=True)

mapper(Calendar_date, calendar_date)

class Currency(object):
    def __init__(self, currency_key, data_loaded_date, data_loader, currency_name, discription,
                 currency_sign, exchange_rate):
        self.currency_key = currency_key   
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.currency_name = currency_name
        self.discription = discription
        self.currency_sign = currency_sign
        self.exchange_rate = exchange_rate

currency = Table('currency', metadata1, autoload=True)

mapper(Currency, currency)

class Data_source(object):
    def __init__(self, data_source_key, data_source_name, data_loaded_date, data_loader, data_source_desc):
        self.data_source_key = data_source_key 
        self.data_source_name = data_source_name
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.data_source_desc = data_source_desc
        
data_source = Table('data_source', metadata1, autoload=True)     

mapper(Data_source, data_source)

class Industry_class(object):
    def __init__(self, industry_class_key, data_loaded_date, data_loader, industry_class_name, intusrty_class_desc):
        self.industry_class_key = industry_class_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.industry_class_name = industry_class_name
        self.intusrty_class_desc = intusrty_class_desc   
        
        
industry_class = Table('industry_class', metadata1, autoload=True)

mapper(Industry_class, industry_class)


class National_industry_class(object):
    def __init__(self, nic_key, nic_code, nic_name, description, parent_code, level1_code, level2_code,
                 level3_code, level4_code, data_loaded_date, data_loader):
        self.nic_key = nic_key 
        self.nic_code = nic_code
        self.nic_name = nic_name
        self.description = description
        self.parent_code = parent_code
        self.level1_code = level1_code
        self.level2_code = level2_code
        self.level3_code = level3_code
        self.level4_code = level4_code 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader  
        
        
national_industry_class = Table('national_industry_class', metadata1, autoload=True)

mapper(National_industry_class, national_industry_class)

class Org_registration_type(object):
    def __init__(self, org_reg_type_key, data_loaded_date, org_reg_type, description, data_loader):
        self.org_reg_type_key = org_reg_type_key 
        self.data_loaded_date = data_loaded_date
        self.org_reg_type = org_reg_type
        self.description = description
        self.data_loader = data_loader
        
org_registration_type = Table('org_registration_type', metadata1, autoload=True)

mapper(Org_registration_type, org_registration_type)


class Org_shareholder_fact(object):
    def __init__(self, org_shareholder_fact_key, data_loaded_date, data_loader, effective_start_date, org_key,
                 stock_key, stock_code, stock_name, shareholder_person_key, shareholder_org_key, 
                 src_shareholder_name, share_stat_base_key, stock_type_group_key, src_stock_type,
                 number_of_shares, share_percentage, ranking):
        self.org_shareholder_fact_key = org_shareholder_fact_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.effective_start_date = effective_start_date
        self.org_key = org_key
        self.stock_key = stock_key 
        self.stock_code = stock_code
        self.stock_name = stock_name
        self.shareholder_person_key = shareholder_person_key
        self.shareholder_org_key = shareholder_org_key
        self.src_shareholder_name = src_shareholder_name 
        self.share_stat_base_key = share_stat_base_key
        self.stock_type_group_key = stock_type_group_key
        self.src_stock_type = src_stock_type
        self.number_of_shares = number_of_shares
        self.share_percentage = share_percentage
        self.ranking = ranking
        
org_shareholder_fact = Table('org_shareholder_fact', metadata1, autoload=True)

mapper(Org_shareholder_fact, org_shareholder_fact)


class Org_status(object):
    def __init__(self, org_status_key, data_loaded_date, org_status, description, data_loader):
        self.org_status_key = org_status_key 
        self.data_loaded_date = data_loaded_date
        self.org_status = org_status
        self.description = description
        self.data_loader = data_loader

org_status = Table('org_status', metadata1, autoload=True)

mapper(Org_status, org_status)


class Share_stat_base(object):
    def __init__(self, share_stat_base_key, data_loaded_date, data_loader, share_stat_base, description):
        self.share_stat_base_key = share_stat_base_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.share_stat_base = share_stat_base
        self.description = description
        
share_stat_base = Table('share_stat_base', metadata1, autoload=True)

mapper(Share_stat_base, share_stat_base)



class Stock_type(object):
    def __init__(self, stock_type_key, data_loaded_date, data_loader, stock_type, description):
        self.stock_type_key = stock_type_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.stock_type = stock_type
        self.description = description
        
stock_type = Table('stock_type', metadata1, autoload=True)

mapper(Stock_type, stock_type)


class Stock_type_group(object):
    def __init__(self, stock_type_group_key, stock_type_key, data_loaded_date, data_loader):
        self.stock_type_group_key = stock_type_group_key 
        self.stock_type_key = stock_type_key
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        
stock_type_group = Table('stock_type_group', metadata1, autoload=True)

mapper(Stock_type_group, stock_type_group)


class Person(object):
    def __init__(self, person_key, data_loaded_date, data_loader, effective_start_date, name, first_name, last_name,
                 nick_name, gender, birth_date_key, image, search_criteria):
        self.person_key = person_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.effective_start_date = effective_start_date
        self.name = name
        self.first_name = first_name
        self.last_name = last_name 
        self.nick_name = nick_name
        self.gender = gender
        self.birth_date_key = birth_date_key
        self.image = image
        self.search_criteria = search_criteria

person = Table('person', metadata1, autoload=True)

mapper(Person, person)

class Organization(object):
    def __init__(self, org_key, data_loaded_date, data_loader, effective_start_date, org_name, org_desc, org_short_name,
                 org_english_name, org_english_name_abbr, org_start_date_key, org_start_date_src, industry_class_key,
                 nic_key, org_website, in_charge_person_key, main_phone_num, 
                 registered_capital, capital_currency_key, registered_address_key, office_address_key, core_business,
                 org_status_key, license_number, org_code, revenue, org_size, data_source_key, org_reg_type_key,
                 business_scope, business_term, org_seq, shareholder_org_seq, org_size_src, affiliated_org_seq,
                 duplicated, high_tech_zone_key, company_value):
        self.org_key = org_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.effective_start_date = effective_start_date
        self.org_name = org_name
        self.org_desc = org_desc
        self.org_short_name = org_short_name
        self.org_english_name = org_english_name
        self.org_english_name_abbr = org_english_name_abbr        
        self.org_start_date_key = org_start_date_key
        self.org_start_date_src = org_start_date_src
        self.industry_class_key = industry_class_key
        self.nic_key = nic_key
        self.org_website = org_website 
        self.in_charge_person_key = in_charge_person_key
        self.main_phone_num = main_phone_num
        self.registered_capital = registered_capital
        self.capital_currency_key = capital_currency_key 
        self.registered_address_key = registered_address_key
        self.office_address_key = office_address_key
        self.core_business = core_business
        self.org_status_key = org_status_key
        self.license_number = license_number
        self.org_code = org_code
        self.revenue = revenue
        self.org_size = org_size
        self.data_source_key = data_source_key
        self.org_reg_type_key = org_reg_type_key
        self.business_scope = business_scope
        self.business_term = business_term
        self.org_seq = org_seq
        self.shareholder_org_seq = shareholder_org_seq
        self.org_size_src = org_size_src
        self.affiliated_org_seq = affiliated_org_seq
        self.duplicated = duplicated
        self.high_tech_zone_key = high_tech_zone_key
        self.company_value = company_value
        
        
organization = Table('organization', metadata1, autoload=True)

mapper(Organization, organization, properties={'registeredAddress':relationship(Address, foreign_keys = [organization.c.registered_address_key],backref='organization'),
                                               'officeAddress':relationship(Address, foreign_keys = [organization.c.office_address_key]),
                                               'capitalCurrency':relationship(Currency),
                                               'dataSource':relationship(Data_source),
                                               'industry':relationship(Industry_class),
                                               'orgStartDate':relationship(Calendar_date),
                                               'orgStatus':relationship(Org_status),
                                               'nationalIndustry':relationship(National_industry_class, backref='nicOrganiztions'),
                                               'inChargePerson':relationship(Person, foreign_keys = [organization.c.in_charge_person_key]),
                                               'orgRegType':relationship(Org_registration_type)
                                               })


class Stock(object):
    def __init__(self, stock_key, data_loaded_date, data_loader, effective_start_date, stock_code,
                 stock_name, org_key, new_csrc_industry_class,new_csrc_industry_class_code, csrc_industry_class,
                 csrc_industry_class_code, gics_name, gics_code, company_stock_list, auditing_org, asset_appraisal_org, b_share_abbr,
                 b_share_code, type_of_share, ipo_date_key, place_of_listing, delisting_date_key,
                 isin_code, sedol_code, new_csrc_industry_class_all, new_csrc_industry_class_code_all, stock_link):
        self.stock_key = stock_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.effective_start_date = effective_start_date
        self.stock_code = stock_code
        self.stock_name = stock_name 
        self.org_key = org_key
        self.new_csrc_industry_class = new_csrc_industry_class 
        self.new_csrc_industry_class_code = new_csrc_industry_class_code
        self.csrc_industry_class = csrc_industry_class
        self.csrc_industry_class_code = csrc_industry_class_code
        self.gics_name = gics_name
        self.gics_code = gics_code 
        self.company_stock_list = company_stock_list
        self.auditing_org = auditing_org
        self.asset_appraisal_org = asset_appraisal_org
        self.b_share_abbr = b_share_abbr
        self.b_share_code = b_share_code 
        self.type_of_share = type_of_share
        self.ipo_date_key = ipo_date_key
        self.place_of_listing = place_of_listing
        self.delisting_date_key = delisting_date_key
        self.isin_code = isin_code
        self.sedol_code = sedol_code
        self.new_csrc_industry_class_all = new_csrc_industry_class_all 
        self.new_csrc_industry_class_code_all = new_csrc_industry_class_code_all
        self.stock_link = stock_link
        
stock = Table('stock', metadata1, autoload=True)

mapper(Stock, stock, properties = {'organization':relationship(Organization, backref='stock'),
                                   'delistingDate':relationship(Calendar_date, foreign_keys = [stock.c.delisting_date_key]),
                                   'ipoDate':relationship(Calendar_date, foreign_keys = [stock.c.ipo_date_key]),
                                   })


class Org_gong_shang_fact(object):
    def __init__(self, org_gong_shang_fact_key, data_loaded_date, data_loader, effective_start_date, org_key,
                 org_start_date_key, in_charge_person_key, main_phone_num, registered_capital, capital_currency_key,
                 registered_address_key, core_business, org_status_key, license_number, org_code, org_reg_type_key,
                 admin_district, reg_bureau, annual_inspection_year, annual_inspection_result, license_inspection_year,
                 license_inspection_result, operator_key, place_of_business, operation_start_date_key, operation_end_date_key,
                 canceled_date_key, license_issue_date_key, license_revoke_date_key, biz_structure_desc, data_source_key):
        self.org_gong_shang_fact_key = org_gong_shang_fact_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.effective_start_date = effective_start_date
        self.org_key = org_key
        self.org_start_date_key = org_start_date_key 
        self.in_charge_person_key = in_charge_person_key
        self.main_phone_num = main_phone_num
        self.registered_capital = registered_capital
        self.capital_currency_key = capital_currency_key
        self.registered_address_key = registered_address_key 
        self.core_business = core_business
        self.org_status_key = org_status_key
        self.license_number = license_number
        self.org_code = org_code
        self.org_reg_type_key = org_reg_type_key 
        self.admin_district = admin_district
        self.reg_bureau = reg_bureau
        self.annual_inspection_year = annual_inspection_year
        self.annual_inspection_result = annual_inspection_result
        self.license_inspection_year = license_inspection_year 
        self.license_inspection_result = license_inspection_result
        self.operator_key = operator_key
        self.place_of_business = place_of_business
        self.operation_start_date_key = operation_start_date_key
        self.operation_end_date_key = operation_end_date_key
        self.canceled_date_key = canceled_date_key   
        self.license_issue_date_key = license_issue_date_key
        self.license_revoke_date_key = license_revoke_date_key
        self.biz_structure_desc = biz_structure_desc
        self.data_source_key = data_source_key 
        

org_gong_shang_fact = Table('org_gong_shang_fact', metadata1, autoload=True)

mapper(Org_gong_shang_fact, org_gong_shang_fact)


class Comm_media(object):
    def __init__(self, comm_media_key, data_loaded_date, data_loader, comm_media_name, comm_media_category, description, comm_media_alias):
        self.comm_media_key = comm_media_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.comm_media_name = comm_media_name
        self.comm_media_category = comm_media_category
        self.description = description
        self.comm_media_alias = comm_media_alias
        
comm_media = Table('comm_media', metadata1, autoload=True)

mapper(Comm_media, comm_media)


class Comm_media_status(object):
    def __init__(self, comm_media_status_key, data_loaded_date, data_loader, comm_media_status, description):
        self.comm_media_status_key = comm_media_status_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.comm_media_status = comm_media_status
        self.description = description
        
comm_media_status = Table('comm_media_status', metadata1, autoload=True)

mapper(Comm_media_status, comm_media_status)


class Job_position(object):
    def __init__(self, job_position_key, data_loaded_date, data_loader, job_position_name, job_position_alias, job_position_desc, job_position_type, job_position_src, display_seq):
        self.job_position_key = job_position_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.job_position_name = job_position_name
        self.job_position_alias = job_position_alias
        self.job_position_desc = job_position_desc
        self.job_position_type = job_position_type
        self.job_position_src = job_position_src
        self.display_seq = display_seq
        
job_position = Table('job_position', metadata1, autoload=True)

mapper(Job_position, job_position)

class Org_department(object):
    def __init__(self, org_department_key, data_loaded_date, data_loader, dept_name, description):
        self.org_department_key = org_department_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.dept_name = dept_name
        self.description = description
        
org_department = Table('org_department', metadata1, autoload=True)

mapper(Org_department, org_department)


class Org_comm_media_fact(object):
    def __init__(self, org_comm_media_fact_key, data_loaded_date, data_loader, org_key, comm_media_key,
                 comm_media_status_key, comm_media_number, comm_media_alias):
        self.org_comm_media_fact_key = org_comm_media_fact_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.org_key = org_key
        self.comm_media_key = comm_media_key
        self.comm_media_status_key = comm_media_status_key
        self.comm_media_number = comm_media_number
        self.comm_media_alias = comm_media_alias
        
org_comm_media_fact = Table('org_comm_media_fact', metadata1, autoload=True)

mapper(Org_comm_media_fact, org_comm_media_fact, properties = {'organizations':relationship(Organization, backref='communicationMedia'),
                                                               'communicationMedia':relationship(Comm_media),
                                                               'communicationMediaStatus':relationship(Comm_media_status)})


class Person_employment_fact(object):
    def __init__(self, person_employment_fact_key, data_loaded_date, data_loader, person_key, empl_start_date, 
                 empl_end_date, org_key, job_position_key, data_source_key, org_department_key):
        self.person_employment_fact_key = person_employment_fact_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.person_key = person_key
        self.empl_start_date = empl_start_date
        self.empl_end_date = empl_end_date
        self.org_key = org_key 
        self.job_position_key = job_position_key
        self.data_source_key = data_source_key
        self.org_department_key = org_department_key
        
person_employment_fact = Table('person_employment_fact', metadata1, autoload=True)

mapper(Person_employment_fact, person_employment_fact, properties = {'person':relationship(Person,backref='employment'),
                                                               'organization':relationship(Organization),
                                                               'jobPosition':relationship(Job_position),
                                                               'dataSource':relationship(Data_source),
                                                               'orgDepartment':relationship(Org_department)})

class Org_announcement_fact(object):
    def __init__(self, org_announcement_fact_key, data_loaded_date, data_loader, org_key, announcement_title, announcement_url, announcement_date_key):
        self.org_announcement_fact_key = org_announcement_fact_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.org_key = org_key
        self.announcement_title = announcement_title
        self.announcement_url = announcement_url
        self.announcement_date_key = announcement_date_key

org_announcement_fact = Table('org_announcement_fact', metadata1, autoload=True)

mapper(Org_announcement_fact, org_announcement_fact)


class News_category(object):
    def __init__(self, news_category_key, data_loaded_date, data_loader, news_category_name, news_category_desc):
        self.news_category_key = news_category_key   
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.news_category_name = news_category_name
        self.news_category_desc = news_category_desc
        
news_category = Table('news_category', metadata1, autoload=True)

mapper(News_category, news_category)


class News_source(object):
    def __init__(self, news_source_key, data_loaded_date, data_loader, news_source_name, official_web_site, news_agent_name):
        self.news_category_key = news_source_key   
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.news_source_name = news_source_name
        self.official_web_site = official_web_site
        self.news_agent_name = news_agent_name
        
news_source = Table('news_source', metadata1, autoload=True)

mapper(News_source, news_source)


class Org_news_fact(object):
    def __init__(self, org_news_fact_key, data_loaded_date, data_loader, org_key, news_title, news_summary,
                 news_link, report_date_key, event_date_key, news_source_key, news_category_key):
        self.org_news_fact_key = org_news_fact_key   
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.org_key = org_key
        self.news_title = news_title
        self.news_summary = news_summary
        self.news_link = news_link   
        self.report_date_key = report_date_key
        self.event_date_key = event_date_key
        self.news_source_key = news_source_key
        self.news_category_key = news_category_key
        
org_news_fact = Table('org_news_fact', metadata1, autoload=True)

mapper(Org_news_fact, org_news_fact, properties={'newsCategory':relationship(News_category),
                                                 'newsSource':relationship(News_source),
                                                 'eventDate':relationship(Calendar_date, foreign_keys = [org_news_fact.c.event_date_key]),
                                                 'reportDate':relationship(Calendar_date, foreign_keys = [org_news_fact.c.report_date_key]),
                                                 'organization':relationship(Organization),
                                               })


class Org_affiliation_type(object):
    def __init__(self, org_affiliation_type_key, data_loaded_date, data_loader, org_affiliation_type, org_affiliation_type_desc):
        self.org_affiliation_type_key = org_affiliation_type_key   
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.org_affiliation_type = org_affiliation_type
        self.org_affiliation_type_desc = org_affiliation_type_desc
        
org_affiliation_type = Table('org_affiliation_type', metadata1, autoload=True)

mapper(Org_affiliation_type, org_affiliation_type)


class Org_family_fact(object):
    def __init__(self, org_family_fact_key, data_loaded_date, data_loader, org_key, affiliated_org_key, org_affiliation_type_key):
        self.org_family_fact_key = org_family_fact_key   
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.org_key = org_key
        self.affiliated_org_key = affiliated_org_key
        self.org_affiliation_type_key = org_affiliation_type_key
        
org_family_fact = Table('org_family_fact', metadata1, autoload=True)

mapper(Org_family_fact, org_family_fact, properties={'orgAffiliationType':relationship(Org_affiliation_type),
                                                     'organization':relationship(Organization, foreign_keys = [org_family_fact.c.org_key]),
                                                     'affiliatedOrg':relationship(Organization, foreign_keys = [org_family_fact.c.affiliated_org_key])
                                                     })


class Hiring_position(object):
    def __init__(self, hiring_position_key, data_loaded_date, data_loader, hiring_position_name, hiring_position_alias, hiring_position_desc):
        self.hiring_position_key = hiring_position_key   
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.hiring_position_name = hiring_position_name
        self.hiring_position_alias = hiring_position_alias
        self.hiring_position_desc = hiring_position_desc
        
hiring_position = Table('hiring_position', metadata1, autoload=True)

mapper(Hiring_position, hiring_position)


class Org_hiring_fact(object):
    def __init__(self, data_loaded_date, data_loader, org_key, hiring_position_key, num_of_vacancies, job_location, wage, publish_date_key, url, data_source_key, data_catched_date):
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.org_key = org_key
        self.hiring_position_key = hiring_position_key
        self.num_of_vacancies = num_of_vacancies
        self.job_location = job_location   
        self.wage = wage
        self.publish_date_key = publish_date_key
        self.url = url
        self.data_source_key = data_source_key
        self.data_catched_date = data_catched_date
        
org_hiring_fact = Table('org_hiring_fact', metadata1, autoload=True)

mapper(Org_hiring_fact, org_hiring_fact,properties={'hirePosition':relationship(Hiring_position),
                                                    'dataSource':relationship(Data_source)})



class Org_certification_type(object):
    def __init__(self, data_loaded_date, data_loader, org_cert_type_name, org_cert_type_english_name, org_cert_type_desc, certification_authority):
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.org_cert_type_name = org_cert_type_name
        self.org_cert_type_english_name = org_cert_type_english_name
        self.org_cert_type_desc = org_cert_type_desc
        self.certification_authority = certification_authority   
        
org_certification_type = Table('org_certification_type', metadata1, autoload=True)

mapper(Org_certification_type, org_certification_type)


class Org_certification_fact(object):
    def __init__(self, data_loaded_date, data_loader, org_key, org_name_src, org_certification_type_key, certification_level, certification_scope, certified_product, government_approvals, certification_date, expiry_date):
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.org_key = org_key
        self.org_name_src = org_name_src
        self.org_certification_type_key = org_certification_type_key
        self.certification_level = certification_level   
        self.certification_scope = certification_scope
        self.certified_product = certified_product
        self.government_approvals = government_approvals
        self.certification_date = certification_date
        self.expiry_date = expiry_date
        
org_certification_fact = Table('org_certification_fact', metadata1, autoload=True)

mapper(Org_certification_fact, org_certification_fact)


class Gov_announcement_fact(object):
    def __init__(self, data_loaded_date, data_loader, org_key, gov_ministry, web_column, sub_column, url, title, publish_date_key, data_source_key):
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.org_key = org_key
        self.gov_ministry = gov_ministry
        self.web_column = web_column
        self.sub_column = sub_column   
        self.url = url
        self.title = title
        self.publish_date_key = publish_date_key
        self.data_source_key = data_source_key
        
gov_announcement_fact = Table('gov_announcement_fact', metadata1, autoload=True)

mapper(Gov_announcement_fact, gov_announcement_fact)
                                              

class Geo_division(object):
    def __init__(self, geo_division_id, level, name, suffix, parent_id, create_date, created_by):
        self.geo_division_id = geo_division_id
        self.level = level
        self.name = name
        self.suffix = suffix
        self.parent_id = parent_id
        self.create_date = create_date
        self.created_by = created_by   
        
        
geo_division = Table('geo_division', metadata1, autoload=True)

mapper(Geo_division, geo_division)

class Public_org_group(object):
    def __init__(self, public_org_group_key, data_loaded_date, data_loader, public_org_group_name, public_org_group_desc):
        self.public_org_group_key = public_org_group_key
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.public_org_group_name = public_org_group_name
        self.public_org_group_desc = public_org_group_desc        
        
public_org_group = Table('public_org_group', metadata1, autoload=True)

mapper(Public_org_group, public_org_group)


class Public_org_group_dtl(object):
    def __init__(self, public_org_group_dtl_key, data_loaded_date, data_loader, public_org_group_key, org_key):
        self.public_org_group_dtl_key = public_org_group_dtl_key
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.public_org_group_key = public_org_group_key
        self.org_key = org_key        
        
public_org_group_dtl = Table('public_org_group_dtl', metadata1, autoload=True)

mapper(Public_org_group_dtl, public_org_group_dtl)
#############
##
##apart from neican
##
#############

class Org_department_neican(object):
    def __init__(self, dept_name, description, created_by, create_date, updated_by, update_date):
        self.dept_name = dept_name 
        self.description = description
        self.created_by = created_by
        self.create_date = create_date
        self.updated_by = updated_by
        self.update_date = update_date
        
org_department = Table('org_department', metadata2, autoload=True)

mapper(Org_department_neican, org_department)


class Job_position_neican(object):
    def __init__(self, job_position_name, job_position_alias, job_position_desc, org_dept_id, created_by, create_date, updated_by, update_date):
        self.job_position_name = job_position_name 
        self.job_position_alias = job_position_alias
        self.job_position_desc = job_position_desc
        self.org_dept_id = org_dept_id
        self.created_by = created_by
        self.create_date = create_date
        self.updated_by = updated_by
        self.update_date = update_date
        
job_position = Table('job_position', metadata2, autoload=True)

mapper(Job_position_neican, job_position, properties = {'department':relationship(Org_department_neican)})


class Attribute_type(object):
    def __init__(self, attribute_type_id, attribute_type_name, create_date, created_by, udpate_date, updated_by):
        self.attribute_type_id = attribute_type_id
        self.attribute_type_name = attribute_type_name
        self.create_date = create_date
        self.created_by = created_by
        self.udpate_date = udpate_date
        self.updated_by = updated_by
        
attribute_type = Table('attribute_type', metadata2, autoload=True)

mapper(Attribute_type, attribute_type)


class Attributes(object):
    def __init__(self, attribute_id, attribute_value, attribute_type_id, is_user_defined, create_date, created_by, udpate_date, updated_by):
        self.attribute_id = attribute_id
        self.attribute_value = attribute_value
        self.attribute_type_id = attribute_type_id
        self.is_user_defined = is_user_defined
        self.create_date = create_date
        self.created_by = created_by
        self.udpate_date = udpate_date
        self.updated_by = updated_by
        
attributes = Table('attributes', metadata2, autoload=True)

mapper(Attributes, attributes)


class School_type(object):
    def __init__(self, school_type_name, school_type_desc, create_date, created_by, udpate_date, updated_by):
        self.school_type_name = school_type_name
        self.school_type_desc = school_type_desc
        self.create_date = create_date
        self.created_by = created_by
        self.udpate_date = udpate_date
        self.updated_by = updated_by
        
school_type = Table('school_type', metadata2, autoload=True)

mapper(School_type, school_type)


class School(object):
    def __init__(self, school_name, school_type_id, school_short_name, school_nick_name, school_english_name, school_desc, create_date, created_by, udpate_date, updated_by, school_level_id):
        self.school_name = school_name
        self.school_type_id = school_type_id
        self.school_short_name = school_short_name
        self.school_nick_name = school_nick_name
        self.school_english_name = school_english_name
        self.school_desc = school_desc
        self.create_date = create_date
        self.created_by = created_by
        self.udpate_date = udpate_date
        self.updated_by = updated_by
        self.school_level_id = school_level_id
        
school = Table('school', metadata2, autoload=True)

mapper(School, school)


class Academic_degree(object):
    def __init__(self, academic_degree_name, academic_degree_desc, create_date, created_by, udpate_date, updated_by):
        self.academic_degree_name = academic_degree_name
        self.academic_degree_desc = academic_degree_desc
        self.create_date = create_date
        self.created_by = created_by
        self.udpate_date = udpate_date
        self.updated_by = updated_by
        
academic_degree = Table('academic_degree', metadata2, autoload=True)

mapper(Academic_degree, academic_degree)


class User(object):
    def __init__(self, name, first_name, last_name, nick_name, gender, password, 
                 website, status, date_of_birth, avatar, is_activated,
                 activation_code, memo, created_by, create_date, updated_by, update_date, is_first_time, person_key):
        self.name = name
        self.first_name = first_name
        self.last_name = last_name
        self.nick_name = nick_name
        self.gender = gender
        self.password = password
        self.website = website
        self.status = status
        self.date_of_birth = date_of_birth
        self.avatar = avatar
        self.is_activated = is_activated
        self.activation_code = activation_code
        self.memo = memo
        self.created_by = created_by
        self.create_date = create_date
        self.updated_by = updated_by
        self.update_date = update_date
        self.is_first_time = is_first_time
        self.person_key = person_key
        
        
user = Table('user', metadata2, autoload=True)

mapper(User, user)


class Org_watchlist(object):
    def __init__(self, user_id, org_key, created_by, create_date):
        self.user_id = user_id
        self.org_key = org_key
        self.created_by = created_by
        self.create_date = create_date
        
org_watchlist = Table('org_watchlist', metadata2, autoload=True)

mapper(Org_watchlist, org_watchlist, properties = {'user':relationship(User)})


class Person_watchlist(object):
    def __init__(self, user_id, person_key, created_by, create_date):
        self.user_id = user_id
        self.person_key = person_key
        self.created_by = created_by
        self.create_date = create_date
        
person_watchlist = Table('person_watchlist', metadata2, autoload=True)

mapper(Person_watchlist, person_watchlist, properties = {'user':relationship(User)})


class Token_map(object):
    def __init__(self, token_type, token_value, uid, maitool_id, created_by, create_date, updated_by, update_date):
        self.token_type = token_type
        self.token_value = token_value
        self.uid = uid
        self.maitool_id = maitool_id
        self.created_by = created_by
        self.create_date = create_date
        self.updated_by = updated_by
        self.update_date = update_date
        
token_map = Table('token_map', metadata2, autoload=True)

mapper(Token_map, token_map)


class User_email(object):
    def __init__(self, user_id, email_type, email, is_primary, is_logon, created_by, create_date, updated_by, update_date):
        self.user_id = user_id
        self.email_type = email_type
        self.email = email
        self.is_primary = is_primary
        self.is_logon = is_logon
        self.created_by = created_by
        self.create_date = create_date
        self.updated_by = updated_by
        self.update_date = update_date
        
user_email = Table('user_email', metadata2, autoload=True)

mapper(User_email, user_email, properties = {'user':relationship(User, backref='emails')})



class User_phone(object):
    def __init__(self, user_id, phone_type, phone_number, is_primary, is_logon, created_by, create_date, updated_by, update_date):
        self.user_id = user_id
        self.phone_type = phone_type
        self.phone_number = phone_number
        self.is_primary = is_primary
        self.is_logon = is_logon
        self.created_by = created_by
        self.create_date = create_date
        self.updated_by = updated_by
        self.update_date = update_date
        
user_phone = Table('user_phone', metadata2, autoload=True)

mapper(User_phone, user_phone, properties = {'user':relationship(User, backref='phones')})


class Social_media_type(object):
    def __init__(self, social_media_type_name, url, description, created_by, create_date, updated_by, update_date):
        self.social_media_type_name = social_media_type_name
        self.url = url
        self.description = description
        self.created_by = created_by
        self.create_date = create_date
        self.updated_by = updated_by
        self.update_date = update_date
        
social_media_type = Table('social_media_type', metadata2, autoload=True)

mapper(Social_media_type, social_media_type)



class User_social_media(object):
    def __init__(self, user_id, sm_type_id, sm_name, is_active, is_logon, user_sm_url, created_by, create_date, updated_by, update_date):
        self.user_id = user_id
        self.sm_type_id = sm_type_id
        self.sm_name = sm_name
        self.is_active = is_active
        self.is_logon = is_logon
        self.user_sm_url = user_sm_url
        self.created_by = created_by
        self.create_date = create_date
        self.updated_by = updated_by
        self.update_date = update_date
        
user_social_media = Table('user_social_media', metadata2, autoload=True)

mapper(User_social_media, user_social_media)


class User_address(object):
    def __init__(self, user_id, country, province, city, county, district, mail_address, zipcode, created_by, create_date, updated_by, update_date):
        self.user_id = user_id
        self.country = country
        self.province = province
        self.city = city
        self.county = county
        self.district = district
        self.mail_address = mail_address
        self.zipcode = zipcode
        self.created_by = created_by
        self.create_date = create_date
        self.updated_by = updated_by
        self.update_date = update_date
        
user_address = Table('user_address', metadata2, autoload=True)

mapper(User_address, user_address, properties = {'user':relationship(User, backref='addresses')})


class User_education(object):
    def __init__(self, user_id, start_date, end_date, school_id, academic_degree_id, created_by, create_date, updated_by, update_date):
        self.user_id = user_id
        self.start_date = start_date
        self.end_date = end_date
        self.school_id = school_id
        self.academic_degree_id = academic_degree_id
        self.created_by = created_by
        self.create_date = create_date
        self.updated_by = updated_by
        self.update_date = update_date
        
user_education = Table('user_education', metadata2, autoload=True)

mapper(User_education, user_education, properties = {'user':relationship(User, backref='educations'),
                                                     'school':relationship(School),
                                                     'degree':relationship(Academic_degree)})


class User_work_history(object):
    def __init__(self, user_id, start_date, end_date, org_key, org_name, job_position_id, is_current ,created_by, create_date, updated_by, update_date):
        self.user_id = user_id
        self.start_date = start_date
        self.end_date = end_date
        self.org_key = org_key
        self.org_name = org_name
        self.job_position_id = job_position_id
        self.is_current = is_current
        self.created_by = created_by
        self.create_date = create_date
        self.updated_by = updated_by
        self.update_date = update_date
        
user_work_history = Table('user_work_history', metadata2, autoload=True)

mapper(User_work_history, user_work_history, properties = {'user':relationship(User, backref='workHistory'),
                                                           'jobPosition':relationship(Job_position_neican)})


class User_audit(object):
    def __init__(self, user_id, person_key, org_key, created_by, log_create_time):
        self.user_id = user_id
        self.person_key = person_key
        self.org_key = org_key
        self.created_by = created_by
        self.log_create_time = log_create_time
        
user_audit = Table('user_audit', metadata2, autoload=True)

mapper(User_audit, user_audit)


class Org_group(object):
    def __init__(self, org_group_name, org_group_desc, created_by, create_date):
        self.org_group_name = org_group_name
        self.org_group_desc = org_group_desc
        self.created_by = created_by
        self.create_date = create_date
        
org_group = Table('org_group', metadata2, autoload=True)

mapper(Org_group, org_group)


class Org_group_detail(object):
    def __init__(self, org_group_id, org_key, created_by, create_date):
        self.org_group_id = org_group_id
        self.org_key = org_key
        self.created_by = created_by
        self.create_date = create_date
        
org_group_detail = Table('org_group_detail', metadata2, autoload=True)

mapper(Org_group_detail, org_group_detail, properties = {'group':relationship(Org_group)})


class User_org_group(object):
    def __init__(self, user_id, org_group_id, user_org_grp_status, created_by, create_date):
        self.user_id = user_id
        self.org_group_id = org_group_id
        self.user_org_grp_status = user_org_grp_status
        self.created_by = created_by
        self.create_date = create_date
        
user_org_group = Table('user_org_group', metadata2, autoload=True)

mapper(User_org_group, user_org_group, properties = {'group':relationship(Org_group)})



Session = sessionmaker(bind = engine)





class DLIVManager(object):
    @staticmethod
    def getCompanyOverview(orgId):
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            org = session.query(Organization).filter(Organization.org_key == orgId).one()
        
            companyInfo = {}.fromkeys(['id', 'name', 'shortName', 'englishName', 'englishNameAbbr', 'isPublic', 'publicCode', 'stockLink', 'industry', 'industryId', 'revenue', 'employees', 'registered_capital', 'in_charge_person_key', 'in_charge_person_name', 'core_business', 'org_status', 'license_number', 'operation_start_date', 'operation_end_date', 'license_issue_date', 'canceled_date_key', 'license_revoke_date', 'description','currency_sign'],'')
            companyInfo['id'] = org.org_key
            companyInfo['name'] = org.org_name
            companyInfo['shortName'] = org.org_short_name
            companyInfo['englishName'] = org.org_english_name
            companyInfo['englishNameAbbr'] = org.org_english_name_abbr
            
            if len(org.stock) == 0:#这个分支已测试
                companyInfo['isPublic'] = "false"
                companyInfo['publicCode'] = ""
                companyInfo['stockLink'] = ""
            elif len(org.stock) == 1:#这个分支已测试
                companyInfo['isPublic'] = True
                companyInfo['publicCode'] = [(org.stock)[0].place_of_listing + u" A股: " + (org.stock)[0].stock_code]
                companyInfo['stockLink'] = (org.stock)[0].stock_link
            else:
                companyInfo['isPublic'] = True
                companyInfo['publicCode'] = [u"A股: " + (org.stock)[0].stock_code, u"B股: " + (org.stock)[1].stock_code]
                if org.stock[0].stock_link != None and org.stock[1].stock_link != None :
                    companyInfo['stockLink'] = [u"A股: " + (org.stock)[0].stock_link, u"B股: " + (org.stock)[1].stock_link]
                else:
                    companyInfo['stockLink'] = None
             
            companyInfo['industry'] = org.nationalIndustry.nic_name
            companyInfo['industryId'] = org.nationalIndustry.nic_code
            
            if org.revenue == None:
                companyInfo['revenue'] = ""
            else:
                companyInfo['revenue'] = str(org.revenue)+org.capitalCurrency.currency_sign
                
            companyInfo['employees'] = str(org.org_size)+"人" if org.org_size != None else ""
            companyInfo['registered_capital'] = str(org.registered_capital/10000)+"万元人民币" if org.registered_capital != None else ""

            companyInfo['currency_sign'] = org.capitalCurrency.currency_sign
            companyInfo['in_charge_person_key'] = org.in_charge_person_key
            companyInfo['in_charge_person_name'] = org.inChargePerson.name
            companyInfo['core_business'] = org.core_business
            companyInfo['org_status'] = org.orgStatus.org_status
            companyInfo['license_number'] = org.license_number
            companyInfo['operation_start_date'] = "2001-03-01"
            companyInfo['operation_end_date'] = "2022-03-01"
            companyInfo['license_issue_date'] = "2010-10-28"
            companyInfo['canceled_date_key'] = ""
            companyInfo['license_revoke_date'] = ""
            
            companyInfo['description'] = org.org_desc
            
            contactDetails = {}.fromkeys(['address', 'country', 'website', 'phone'])
            contactDetails['address'] = org.registeredAddress.mail_address
            contactDetails['country'] = org.registeredAddress.country
            contactDetails['website'] = org.org_website
            contactDetails['phone'] = org.main_phone_num
            
            sourceData = {}.fromkeys(['id', 'link', 'title', 'image'])
            sourceData['id'] = org.dataSource.data_source_key
            sourceData['title'] = org.dataSource.data_source_name
            
            companyOverviewDict = dict(companyInfo = companyInfo, contactDetails = contactDetails, sourceData = sourceData)
            companyOverviewJson = jsonpickle.encode(companyOverviewDict, unpicklable="false")
            return companyOverviewJson
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
        
        
        
    @staticmethod
    def getSmartAgentList(orgId, searchDays):
        newsCategoryCopy = {1:"负面新闻", 
                            2:"法律诉讼", 
                            3:"领导层变化", 
                            4:"新产品/新服务", 
                            5:"并购", 
                            6:"合作伙伴", 
                            7:"运营扩展", 
                            8:"成本消减", 
                            9:"超预期表现",
                            10:"不如预期的表现",
                            11:"公司形象展示",
                            12:"合规（政府，行业）",
                            13:"研发",
                            14:"数据安全",
                            15:"融资",
                            16:"破产和重组",
                            17:"房地产：交易",
                            18:"房地产：建筑",
                            19:"企业挑战",
                            20:"知识产权"}
        
        newsSourceCopy = {1:"新浪新闻",
                          2:"陕西传媒网",
                          3:"凤凰网",
                          4:"东北新闻网",
                          5:"搜狐焦点",
                          6:"网易财经",
                          7:"南方报业网",
                          8:"新华网",
                          9:"南都网",
                          10:"腾讯财经",
                          11:"合肥房地产交易网",
                          12:"新浪财经",
                          13:"西部网",
                          14:"新华财经",
                          15:"搜狐财经",
                          16:"搜狐网",
                          17:"和讯股票",
                          18:"中国质检网",
                          19:"东方财富网",
                          20:"北方网",
                          21:"中国网",
                          22:"证券之星",
                          23:"和讯网",
                          24:"证券时报网",
                          25:"全景网",
                          26:"金融界",
                          27:"腾讯网",
                          28:"中国侨网",
                          29:"搜狐理财",
                          30:"中国证券网",
                          31:"中国证券网",
                          32:"挖贝网",
                          33:"华律网",
                          34:"法律教育网",
                          35:"北大法律网",
                          36:"找法网",
                          37:"110法律咨询",
                          38:"北京律师网"
                          }
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['error', 'data', 'errorMessage'])
        
            orgNewsList = session.query(Org_news_fact).filter(Org_news_fact.org_key == orgId).all()
            orgNewsCategoryList = []
            for orgNews in orgNewsList:
                if orgNews.news_category_key not in orgNewsCategoryList:
                    orgNewsCategoryList.append(orgNews.news_category_key)
    
            data = {}.fromkeys(['searchDays', 'totalAgents', 'showChatter', 'showSaveAs', 'showDynamicsActivityFeed', 'agentResultSets', 'peopleUpdates', 'totalAgentHits'])
            
            data['searchDays'] = searchDays
            data['totalAgents'] = len(orgNewsCategoryList)
            data['showChatter'] = "false"
            data['showSaveAs'] = "false"
            data['showDynamicsActivityFeed'] = "false"
    
            data['peopleUpdates'] = []
            data['totalAgentHits'] = 17
            
            agentResultSets = []
            for orgNewsCategory in orgNewsCategoryList:
                agentResultItem = {}.fromkeys(['category', 'resultCount', 'results', 'agentId', 'agentName', 'mode'])
                
                resultList = session.query(Org_news_fact).filter(Org_news_fact.org_key == orgId, Org_news_fact.news_category_key == orgNewsCategory).all()
                
                agentResultItem['category'] = "default"
                agentResultItem['resultCount'] = len(resultList)
                agentResultItem['agentId'] = orgNewsCategory
                agentResultItem['agentName'] = newsCategoryCopy[orgNewsCategory]
                agentResultItem['mode'] = "SellingTrigger"
                
                
                results = []
                for result in resultList:
                    resultItem = {}.fromkeys(['id', 'articleId', 'sourceCount', 'groupId', 'newsText', 'source', 'dateText', 'sourceAccessStatus', 'docType', 'commonArticles'])
                    resultItem['id'] = ""
                    resultItem['articleId'] = result.org_news_fact_key
                    resultItem['sourceCount'] = 0
                    resultItem['groupId'] = 0
                    resultItem['newsText'] = result.news_summary
                    resultItem['source'] = newsSourceCopy[result.news_source_key]
                    resultItem['dateText'] = result.report_date_key
                    resultItem['sourceAccessStatus'] = 0
                    resultItem['docType'] = ""
                    resultItem['commonArticles'] = []
                
                    results.append(resultItem)
                    
                agentResultItem['results'] = results
                
                agentResultSets.append(agentResultItem)
            
            data['agentResultSets'] = agentResultSets
            
            response['error'] = "false"
            response['data'] = data
            response['errorMessage'] = None
            
            reponse = jsonpickle.encode(response, unpicklable="false")
            return reponse
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
        

    
    @staticmethod
    def getSmartAgentArticles(orgId, searchDays, smartAgentId):
        newsCategoryCopy = {1:"负面新闻", 
                            2:"法律诉讼", 
                            3:"领导层变化", 
                            4:"新产品/新服务", 
                            5:"并购", 
                            6:"合作伙伴", 
                            7:"运营扩展", 
                            8:"成本消减", 
                            9:"超预期表现",
                            10:"不如预期的表现",
                            11:"公司形象展示",
                            12:"合规（政府，行业）",
                            13:"研发",
                            14:"数据安全",
                            15:"融资",
                            16:"破产和重组",
                            17:"房地产：交易",
                            18:"房地产：建筑",
                            19:"企业挑战",
                            20:"知识产权"}
        
        newsSourceCopy = {1:"新浪新闻",
                          2:"陕西传媒网",
                          3:"凤凰网",
                          4:"东北新闻网",
                          5:"搜狐焦点",
                          6:"网易财经",
                          7:"南方报业网",
                          8:"新华网",
                          9:"南都网",
                          10:"腾讯财经",
                          11:"合肥房地产交易网",
                          12:"新浪财经",
                          13:"西部网",
                          14:"新华财经",
                          15:"搜狐财经",
                          16:"搜狐网",
                          17:"和讯股票",
                          18:"中国质检网",
                          19:"东方财富网",
                          20:"北方网",
                          21:"中国网",
                          22:"证券之星",
                          23:"和讯网",
                          24:"证券时报网",
                          25:"全景网",
                          26:"金融界",
                          27:"腾讯网",
                          28:"中国侨网",
                          29:"搜狐理财",
                          30:"中国证券网",
                          31:"中国证券网",
                          32:"挖贝网",
                          33:"华律网",
                          34:"法律教育网",
                          35:"北大法律网",
                          36:"找法网",
                          37:"110法律咨询",
                          38:"北京律师网"
                          }
        
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['error', 'data', 'errorMessage'])
        
            resultList = session.query(Org_news_fact).filter(Org_news_fact.org_key == orgId, Org_news_fact.news_category_key == smartAgentId).all()
            data = {}.fromkeys(['searchDays', 'category', 'resultCount', 'results', 'agentId', 'agentName', 'mode'])
            
            data['searchDays'] = searchDays
            data['category'] = 'default'
            data['resultCount'] = len(resultList)
            data['agentId'] = resultList[0].news_category_key
            data['agentName'] = newsCategoryCopy[resultList[0].news_category_key]
            data['mode'] = "SellingTrigger"
            
            results = []
            for result in resultList:
                resultItem = {}.fromkeys(['id', 'articleId', 'sourceCount', 'groupId', 'newsText', 'source', 'dateText', 'sourceAccessStatus', 'docType', 'commonArticles'])
                resultItem['id'] = ""
                resultItem['articleId'] = result.org_news_fact_key
                resultItem['sourceCount'] = 0
                resultItem['groupId'] = 0
                resultItem['newsText'] = result.news_summary
                resultItem['source'] = newsSourceCopy[result.news_source_key]
                resultItem['dateText'] = result.report_date_key
                resultItem['sourceAccessStatus'] = 0
                resultItem['docType'] = ""
                resultItem['commonArticles'] = []
                
                results.append(resultItem)
    
            data['results'] = results
            
            response['error'] = "false"
            response['data'] = data
            response['errorMessage'] = ""
            
            reponse = jsonpickle.encode(response, unpicklable="false")
            return reponse
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
        
    @staticmethod
    def get_employee_job_types(orgId):
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['jobPositionTypes','count'],'')
            
            job_position_list = session.query(Job_position).join(Person_employment_fact, Person_employment_fact.job_position_key == Job_position.job_position_key).filter(Person_employment_fact.org_key == orgId).all()
            display_seq_list = []
            if len(job_position_list) > 0:
                for item in job_position_list:
                    if item.display_seq not in display_seq_list:
                        display_seq_list.append(item.display_seq)
            
            job_position_type_list = []
            for seq in display_seq_list:
                job_type_item = {}.fromkeys(['jobPositionType','displaySeq','count'],'')
                job_position_item = session.query(Job_position).join(Person_employment_fact, Person_employment_fact.job_position_key == Job_position.job_position_key).filter(Person_employment_fact.org_key == orgId, Job_position.display_seq == seq).all() 
                job_type_item['displaySeq'] = seq
                job_type_item['jobPositionType'] = job_position_item[0].job_position_type
                emp_fact_item = session.query(Person_employment_fact).join(Job_position, Person_employment_fact.job_position_key == Job_position.job_position_key).filter(Person_employment_fact.org_key == orgId, Job_position.display_seq == seq).all()
                job_type_item['count'] = len(emp_fact_item)
                
                job_position_type_list.append(job_type_item)
            
            li = []
            if len(job_position_type_list) > 0:
                li = sorted(job_position_type_list, key = lambda s: s['displaySeq'])
                
            data['jobPositionTypes'] = li
            data['count'] = len(li)
            
            response['no'] = 0
            response['data'] = data
            
            reponse = jsonpickle.encode(response, unpicklable=False)
            return reponse
        except:
            session.rollback()
            raise
        finally:
            session.close()
    
    @staticmethod
    def getPepole(orgId, seqs):
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['employees'],'')
            
            if len(seqs) == 0:
                job_position_list = session.query(Job_position).join(Person_employment_fact, Person_employment_fact.job_position_key == Job_position.job_position_key).filter(Person_employment_fact.org_key == orgId).all()
                display_seq_list = []
                if len(job_position_list) > 0:
                    for item in job_position_list:
                        if item.display_seq not in display_seq_list:
                            display_seq_list.append(item.display_seq)
                            
                seqs = display_seq_list
                
            person_list = []
            for seq in seqs:
                emp_list = session.query(Person_employment_fact).join(Person_employment_fact.jobPosition).filter(Person_employment_fact.org_key == orgId, Job_position.display_seq == seq).all()
                if len(emp_list) > 0:
                    for item in emp_list:
                        emp_item = {}.fromkeys(['name', 'seq', 'title', 'companyId', 'employmentId', 'executiveId', 'imageUrl', 'count', 'executiveConnectionImageUrls', 'employmentType'])
                        
                        emp_item['name'] = item.person.name
                        emp_item['seq'] = seq
                        emp_item['title'] = item.jobPosition.job_position_name
                        emp_item['companyId'] = item.org_key
                        emp_item['employmentId'] = item.person_employment_fact_key
                        emp_item['executiveId'] = ""
                        emp_item['imageUrl'] = ""
                        emp_item['count'] = ""
                        emp_item['executiveConnectionImageUrls'] = ""
                        emp_item['employmentType'] = ""
                        
                        person_list.append(emp_item)         
            
            data['employees'] = person_list
            
            response['no'] = 0
            response['data'] = data
            
            reponse = jsonpickle.encode(response, unpicklable=False)
            return reponse
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
            
    
        

    @staticmethod     
    def getSocialMediasProfile(id, sm = None):
        pass
    
    @staticmethod
    def getSocialMediasPosts(id):
        pass
    
    @staticmethod
    def getSocialMediasMentioned(id):
        pass
    
    @staticmethod
    def getFamilyTree(id):
        '''
        response = {
           "error":"false",
           "errorType":None,
           "errorMessage":"",
           "data":{
                "count": 4,
                "root": [{
                    "companyName": "HootSuite Media, Inc.",
                    "companyId": "2867257",
                    "isCurrent": True,
                    "location": "Vancouver, Canada",
                    "children": [{
                        "companyName": "Geotoko",
                        "companyId": "3770719",
                        "isCurrent": "false",
                        "location": "Vancouver, Canada"
                        },
                        {
                        "companyName": "OB-Tech LLC",
                        "companyId": "3735082",
                        "isCurrent": "false",
                        "location": "Cumming, United States"
                        },
                        {
                        "companyName": "Seesmic, Inc.",
                        "companyId": "2670052",
                        "isCurrent": "false",
                        "location": "San Francisco, United States",
                        "children": [{
                            "companyName": "Ping.fm, Inc.",
                            "companyId": "2677126",
                            "isCurrent": "false",
                            "location": "Tulsa, United States"
                            }
                                     ]
                        }
                               ]
                        }]
                    }
                    }
        response = jsonpickle.encode(response, unpicklable="false")
        return response
        '''
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['error', 'errorType', 'errorMessage', 'data'])
        
            data = {}.fromkeys(['count', 'root'])
            org = session.query(Organization).filter(Organization.org_key == id).one()
            root = []
            rootItem = {}.fromkeys(['companyName', 'companyId', 'isCurrent', 'location', 'children'])
            rootItem['companyName'] = org.org_name
            rootItem['companyId'] = org.org_key
            rootItem['isCurrent'] = True
            rootItem['location'] = org.registeredAddress.mail_address
    
            childrenList = session.query(Org_family_fact).filter(Org_family_fact.org_key == id).all()
            children = []
            if len(childrenList) > 0:
                for child in childrenList:
                    clildItem = {}.fromkeys(['companyName', 'companyId', 'isCurrent', 'location'])
                    clildItem['companyName'] = child.affiliatedOrg.org_name
                    clildItem['companyId'] = child.affiliatedOrg.org_key
                    clildItem['isCurrent'] = "false"
                    clildItem['location'] = child.affiliatedOrg.registeredAddress.mail_address
                    
                    grandchildrenList = session.query(Org_family_fact).filter(Org_family_fact.org_key == child.affiliatedOrg.org_key).all()
                    grandchildren = []
                    if len(grandchildrenList) > 0:
                        for grandchild in grandchildrenList:
                            grandchildrenItem = {}.fromkeys(['companyName', 'companyId', 'isCurrent', 'location'])
                            grandchildrenItem['companyName'] = grandchild.affiliatedOrg.org_name
                            grandchildrenItem['companyId'] = grandchild.affiliatedOrg.org_key
                            grandchildrenItem['isCurrent'] = "false"
                            grandchildrenItem['location'] = grandchild.affiliatedOrg.registeredAddress.mail_address
                            
                            grandchildren.append(grandchildrenItem)
                    else:
                        pass
                    
                    if len(grandchildren) > 0:
                        clildItem['children'] = grandchildren
                    else:
                        pass
                    
                    children.append(clildItem)
            else:
                pass
                
            rootItem['children'] = children
            
            root.append(rootItem)
            
            
            data['count'] = len(childrenList)
            data['root'] = root
            
            response['error'] = False    
            response['errorType'] = None
            response['errorMessage'] = ""
            response['data'] = data
            
            response = jsonpickle.encode(response, unpicklable="false")
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
        
    
    @staticmethod
    def getCompetitors(id):
        pass
    
    @staticmethod
    def getJobs(orgKey, num = 10):
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count', 'results'],'')
            results = []
            org_hiring_list = session.query(Org_hiring_fact).filter(Org_hiring_fact.org_key == orgKey).order_by(desc(Org_hiring_fact.publish_date_key))[0:num]
            
            if len(org_hiring_list) > 0:
                for item in org_hiring_list:
                    hiringItem = {}.fromkeys(['position','number','location','link','publishDate','wage', 'source'],'')
                    
                    hiringItem['position'] = item.hirePosition.hiring_position_name
                    hiringItem['number'] = item.num_of_vacancies
                    hiringItem['location'] = item.job_location
                    hiringItem['link'] = item.url
                    hiringItem['publishDate'] = item.publish_date_key
                    hiringItem['wage'] = item.wage
                    hiringItem['source'] = item.dataSource.data_source_name
                    
                    results.append(hiringItem)
            
            data['count'] = len(org_hiring_list)
            data['results'] = results
            
            response['no'] = 0
            response['data'] = data
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
    
    """
    @staticmethod
    def autocomplete(searchString):
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            d1 = datetime.now()
            org_list_db = session.query(Organization).filter(Organization.org_name.ilike('%'+searchString+'%'))[0:5]
            org_list = []
            i = 0
            while i < len(org_list_db):
                orgItem = org_list_db[i]
                org = {}.fromkeys(['id', 'value',])
                org['id'] = orgItem.org_key
                org['value'] = orgItem.org_name
                org_list.append(org)
                i = i + 1
                
            response = jsonpickle.encode(org_list, unpicklable=False)
            d2 = datetime.now()
            d = d2-d1
            print d.microseconds
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
    """
       
    @staticmethod
    def autocomplete(in_search_string, in_group_type, in_group_id):
        try:
            response = {}.fromkeys(['no','errMsg','data'],'')
            data = {}.fromkeys(['orgs', 'persons'],'')
            
            in_search_string = "'" + in_search_string + "'" if in_search_string != "" else "NULL" 
            in_group_type = str(in_group_type) if in_group_type != "" else "NULL"
            in_group_id = str(in_group_id) if in_group_id != "" else "NULL" 
            
            import psycopg2
            conn_string = "host='192.168.30.173' dbname='yunti' user='ws_dblayer' password='progress*2013'"
            conn = psycopg2.connect(conn_string)
            cursor = conn.cursor()
            
            if in_group_type == "0":
                org_key_str = ""
            else:
                org_key_sql = "select warehouse.qry_org_keys("+in_group_type+","+in_group_id+")"
                cursor.execute(org_key_sql)
                org_key_str = cursor.fetchall()
                org_key_str = org_key_str[0][0]
                
            sql_str = "select warehouse.qry_autocomplete("+in_search_string+",'"+org_key_str+"')"
            cursor.execute(sql_str)
            sql_result = cursor.fetchall()
            conn.close()
            sql_result =  sql_result[0][0]
            sql_result = json.loads(sql_result)

            org_list = []
            if len(sql_result['org_results']) > 0:
                for item in sql_result['org_results']:
                    org = {}.fromkeys(['company_id','company_name'],'')
                    org['company_id'] = item['company_id']
                    org['company_name'] = item['company_name']
                    
                    org_list.append(org)
            
            person_list = []
            if len(sql_result['person_results']) > 0:
                for item in sql_result['person_results']:
                    person = {}.fromkeys(['emp_fact_id','person_name','company_name'],'')
                   
                    person['emp_fact_id'] = item['emp_fact_id']
                    person['person_name'] = item['person_name']
                    person['company_name'] = item['company_name']
                    
                    person_list.append(person)
            
            data['orgs'] = org_list
            data['persons'] = person_list
            
            response['no'] = 0
            response['data'] = data
            
            result = jsonpickle.encode(response, unpicklable=False)
            return result
        except:
            raise
        finally:
            #session.close()
            pass        
    
    
    @staticmethod
    def buildCompanyList(query_conditions):
        try:
            response = {}.fromkeys(['no','errMsg','data'],'')
            data = {}.fromkeys(['count', 'pageNum','companies'],'')
            
            #in_org_name = "'" + query_conditions['org_name'] + "'" if query_conditions['org_name'] != "" else "NULL" 
            #in_in_charge_person = "'" + query_conditions['in_charge_person'] + "'" if query_conditions['in_charge_person'] != "" else "NULL"  
            in_org_reg_type_str = "'" + query_conditions['org_reg_type_str'] + "'" if query_conditions['org_reg_type_str'] != "" else "NULL"  
            in_org_status_str = "'" + query_conditions['org_status_str'] + "'" if query_conditions['org_status_str'] != "" else "NULL" 
            in_org_size_max = str(query_conditions['org_size_max']) if query_conditions['org_size_max'] != "" else "NULL" 
            in_org_size_min = str(query_conditions['org_size_min']) if query_conditions['org_size_min'] != "" else "NULL" 
            in_industry_class_str = "'" + query_conditions['industry_class_str'] + "'" if query_conditions['industry_class_str'] != "" else "NULL" 
            in_registered_capital_min = str(query_conditions['registered_capital_min']) if query_conditions['registered_capital_min'] != "" else "NULL" 
            in_registered_capital_max = str(query_conditions['registered_capital_max']) if query_conditions['registered_capital_max'] != "" else "NULL" 
            #in_license_num = "'" + query_conditions['license_num'] + "'" if query_conditions['license_num'] != "" else "NULL" 
            #in_org_reg_address = "'" + query_conditions['org_reg_address'] + "'" if query_conditions['org_reg_address'] != "" else "NULL" 
            in_org_department_str = "'" + query_conditions['org_department_str'] + "'" if query_conditions['org_department_str'] != "" else "NULL" 
            in_job_position_type_str = "'" + query_conditions['job_position_type_str'] + "'" if query_conditions['job_position_type_str'] != "" else "NULL" 
            in_province = "'" + query_conditions['province'] + "'" if query_conditions['province'] != "" else "NULL" 
            in_city = "'" + query_conditions['city'] + "'" if query_conditions['city'] != "" else "NULL" 
            in_zipcode = "'" + query_conditions['zipcode'] + "'" if query_conditions['zipcode'] != "" else "NULL" 
            in_district = "'" + query_conditions['district'] + "'" if query_conditions['district'] != "" else "NULL" 
            #in_job_position = str(query_conditions['job_position']) if query_conditions['job_position'] != "" else "NULL"   
            #in_family_org = str(query_conditions['family_org_key']) if query_conditions['family_org_key'] != "" else "NULL" 
            #in_colleague = str(query_conditions['colleague_person_key']) if query_conditions['colleague_person_key'] != "" else "NULL" 
            in_certified_product = str(query_conditions['certified_product']) if query_conditions['certified_product'] != "" else "NULL" 
            #in_user_id = str(query_conditions['user_person_key']) if query_conditions['user_person_key'] != "" else "NULL" 
            in_org_page_num = str(query_conditions['org_page_num']) if query_conditions['org_page_num'] != "" else "NULL" 
            in_group_type = str(query_conditions['org_group_type']) if query_conditions['org_group_type'] != "" else "NULL"
            in_group_id = str(query_conditions['org_group_id']) if query_conditions['org_group_id'] != "" else "NULL" 
            
            import psycopg2
            conn_string = "host='192.168.30.173' dbname='yunti' user='ws_dblayer' password='progress*2013'"
            conn = psycopg2.connect(conn_string)
            cursor = conn.cursor()
            
            if in_group_type == "0":
                org_key_str = ""
            else:
                org_key_sql = "select warehouse.qry_org_keys("+in_group_type+","+in_group_id+")"
                cursor.execute(org_key_sql)
                org_key_str = cursor.fetchall()
                org_key_str = org_key_str[0][0]
            
            
            sql_str = "select haojm.qry_adv_search_org("+in_org_reg_type_str+","+\
                        in_org_status_str+","+in_org_size_max+","+in_org_size_min+","+in_industry_class_str+","+in_registered_capital_min+","+in_registered_capital_max+","+in_province+","+\
                        in_city+","+in_district+","+in_zipcode+","+in_org_department_str+","+in_job_position_type_str+","+\
                        in_certified_product+","+in_org_page_num+",'"+org_key_str+"')"
            cursor.execute(sql_str)
            sql_result = cursor.fetchall()
            
            sql_result =  sql_result[0][0]
            sql_result = json.loads(sql_result)

            org_list = []
            if sql_result.has_key('results'):
                if len(sql_result['results']) > 0:
                    for item in sql_result['results']:
                        org_item = {}.fromkeys(['companyName', 'companyId', 'licenseNum','revenue', 'industry','numberOfEmployees','orgStatus','regType','address'],'')
                        org_item['companyName'] = item['org_name']
                        org_item['companyId'] = item['org_key']
                        org_item['licenseNum'] = item['license_num']
                        org_item['revenue'] = item['revenue'] if item['revenue'] != "-1" else ""
                        org_item['numberOfEmployees'] = item['org_size'] if item['org_size'] != "-1" else ""
                        org_item['orgStatus'] = item['org_status']
                        org_item['industry'] = item['industry']
                        org_item['regType'] = item['org_reg_type']
                        org_item['address'] = item['mail_address']
                        
                        org_list.append(org_item)
                    
            if sql_result.has_key('count'):
                data['count'] = sql_result['count']
            
            data['pageNum'] = in_org_page_num
            data['companies'] = org_list
            
            response['no'] = 0
            response['data'] = data
            
            result = jsonpickle.encode(response, unpicklable=False)
            return result
        except:
            raise
        finally:
            conn.close()
    
    
    @staticmethod
    def bulidContactList(query_conditions):
        try:
            response = {}.fromkeys(['no','errMsg','data'],'')
            data = {}.fromkeys(['count', 'pageNum','employees'],'')
            
            org_data = json.loads(DLIVManager.buildCompanyList(query_conditions))
            org_key_list = []
            org_list = org_data['data']['companies']
            for org_item in org_list:
                org_key_list.append(org_item['companyId'])
             
            import psycopg2
            conn_string = "host='192.168.30.173' dbname='yunti' user='ws_dblayer' password='progress*2013'"
            conn = psycopg2.connect(conn_string)
            cursor = conn.cursor()
            
            in_person_page_num = str(query_conditions['person_page_num']) if query_conditions['person_page_num'] != "" else "NULL" 
            
            employee_list_all = []
            for key in org_key_list: 
                employee_sql = "select haojm.qry_employees("+key+")"
                                
                cursor.execute(employee_sql)
                employee_result = cursor.fetchall()
                
                employee_result =  employee_result[0][0]
                employee_result = json.loads(employee_result)
                
                employee_list_all.extend(employee_result['results'])
            
            if int(in_person_page_num) == 0:
                employee_list = employee_list_all
            else:    
                employee_list = employee_list_all[(int(in_person_page_num)-1)*10:int(in_person_page_num)*10]
            
            data['count'] = len(employee_list_all)
            data['employees'] = employee_list
            data['pageNum'] = in_person_page_num
            
            response['no'] = 0
            response['data'] = data
            
            result = jsonpickle.encode(response, unpicklable=False)
            return result
        except:
            raise
        finally:
            #session.close()
            pass
        
        
    @staticmethod
    def getCommMediaNum(id, searchType):
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            commMediaNumList = session.query(Org_comm_media_fact.comm_media_alias).join(Comm_media, Comm_media.comm_media_key == Org_comm_media_fact.comm_media_key).filter(Org_comm_media_fact.org_key == id, Comm_media.comm_media_name == searchType).all()
            if len(commMediaNumList) > 0:
                return commMediaNumList[0][0]
            else:
                return None
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
      
    @staticmethod
    def isFollowedCompany(watchlistId, companyId):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            companyList = session.query(Org_watchlist.org_key).filter(Org_watchlist.user_id == watchlistId).all()
            companyIdList = []
            for company in companyList:
                companyIdList.append(company[0])
            
            if companyId in companyIdList:
                return 1
            else:
                return 0 
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
        
    @staticmethod
    def followingCompany(watchlistId, companyId):
        """Add a company to user's wachlist, every user has one watchlist so far and
           maybe change someday.  
           param watchlistId: userId
           params companyId: org_key 
        """
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            companyItem = Org_watchlist(watchlistId, companyId, 'system', str(datetime.now()))
            session.add(companyItem)
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
        
        
    @staticmethod
    def unFollowingCompany(watchlistId, companyId):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            session.query(Org_watchlist).filter(Org_watchlist.user_id == watchlistId, Org_watchlist.org_key == companyId).delete()
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()
    
    
    @staticmethod
    def isFollowedPeople(watchlistId, contactId):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            contactList = session.query(Person_watchlist.person_key).filter(Person_watchlist.user_id == watchlistId).all()
            contactIdList = []
            for contact in contactList:
                contactIdList.append(contact[0])
            
            if contactId in contactIdList:
                return 1
            else:
                return 0 
        except:
            session.rollback()
            raise
        finally:
            session.close()
    
    @staticmethod
    def followingPeople(watchlistId, contactId):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            contactItem = Person_watchlist(watchlistId, contactId, 'system', str(datetime.now()))
            session.add(contactItem)
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close() 
            
    @staticmethod
    def unFollowingPeople(watchlistId, contactId):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            session.query(Person_watchlist).filter(Person_watchlist.user_id == watchlistId, Person_watchlist.person_key == contactId).delete()
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()   
        
        
    @staticmethod
    def getShareholders(id):
        response = {
               "error":"false",
               "errorType":None,
               "errorMessage":"",
               "data":{
                    "count": 4,
                    "regCapital": 100,
                    "currencyType": 'RMB',
                    "unit": 10000,    
                    "shareholders":[
                        {
                          "name": "袁亚南",
                          "amount": 68.6,
                          "percentage": 68.6,
                          "attribute": "自然人",
                          "category": "自然人"
                        },
                        {
                          "name": "杨灵",
                          "amount": 25.4,
                          "percentage": 25.4,
                          "attribute": "自然人",
                          "category": "自然人"
                        },
                        {
                          "name": "尹辉",
                          "amount": 3.00,
                          "percentage": 3.00,
                          "attribute": "自然人",
                          "category": "自然人"
                        },
                        {
                          "name": "梁辉旺",
                          "amount": 3.00,
                          "percentage": 3.00,
                          "attribute": "自然人",
                          "category": "自然人"
                        },
                    ]
                }
            }
        response = jsonpickle.encode(response, unpicklable="false")
        return response
        '''
        reponse = {}.fromkeys(['error', 'errorType', 'errorMessage', 'data'])
        data = {}.fromkeys(['count', 'regCapital', 'currencyType', 'unit', 'shareholders'])
        shareholderList = session.query(Org_shareholder_fact).filter(Org_shareholder_fact.org_key == id).all()
        shareholders = []
        for item in shareholderList:
            shareholder = {}.fromkeys(['name', 'amount', 'percentage', 'attribute', 'class'])
            shareholder['name'] = item
            shareholder['amount'] = item
            shareholder['percentage'] = item
            shareholder['attribute'] = item
            shareholder['class'] = item
            
            shareholders.append(shareholder)
            
        data['shareholders'] = shareholders
        data['count']
        data['regCapital']
        data['currencyType']
        data['unit']
        '''
        

    @staticmethod
    def getWatchlistInfo(uid):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            companyList = session.query(Org_watchlist.org_key).filter(Org_watchlist.user_id == uid).all()
            companyIdList = []
            if len(companyList) > 0:
                for company in companyList:
                    companyIdList.append(company[0])
            else:
                pass
            
            contactList = session.query(Person_watchlist.person_key).filter(Person_watchlist.user_id == uid).all()
            contactIdList = []
            if len(contactList) > 0:
                for contact in contactList:
                    contactIdList.append(contact[0])
            else:
                pass
            
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['id', 'creationDate', 'name', 'lastUpdated', 'type', 'following'],'')
            following = {}.fromkeys(['companies', 'people'])
            following['companies'] = companyIdList
            following['people'] = contactIdList
            
            data['following'] = following
            
            response['data'] = data
            response['no'] = 0
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
            
    @staticmethod
    def getWatchedCompanyList(watchListId):
        session_neican = Session()
        session_neican.execute("set search_path to 'neican'")
        session_warehouse = Session()
        session_warehouse.execute("set search_path to 'warehouse'")
        try:
            companyList = session_neican.query(Org_watchlist.org_key).filter(Org_watchlist.user_id == watchListId).all()
            companyIdList = []
            if len(companyList) > 0:
                for company in companyList:
                    companyIdList.append(company[0])
            else:
                pass
            
            
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['addedCount', 'deletedCount', 'companies'],'')
            companies = []
            if len(companyIdList) > 0:
                for orgKey in companyIdList:
                    org_list = session_warehouse.query(Organization).filter(Organization.org_key == orgKey).all()
                    if len(org_list) > 0:
                        companyItem = {}.fromkeys(['location', 'companyName', 'companyId', 'businessType', 'revenue', 'numberOfEmployees'],'')
                        companyItem['location'] = org_list[0].registeredAddress.country+","+org_list[0].registeredAddress.city
                        companyItem['companyName'] = org_list[0].org_name
                        companyItem['companyId'] = org_list[0].org_key
                        companyItem['businessType'] = "Public Company"
                        companyItem['revenue'] = org_list[0].revenue if org_list[0].revenue != None else ""
                        companyItem['numberOfEmployees'] = org_list[0].org_size
                        
                        companies.append(companyItem)
            
            data['companies'] = companies
            response['data'] = data
            response['no'] = 0
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            session_neican.rollback()
            session_warehouse.rollback()
            raise
        finally:
            session_neican.close()
            session_warehouse.close()
            
    @staticmethod
    def getWatchedPersonList(watchListId):
        session_neican = Session()
        session_neican.execute("set search_path to 'neican'")
        session_warehouse = Session()
        session_warehouse.execute("set search_path to 'warehouse'")
        try:
            personList = session_neican.query(Person_watchlist.person_key).filter(Person_watchlist.user_id == watchListId).all()
            personIdList = []
            if len(personList) > 0:
                for person in personList:
                    personIdList.append(person[0])
            else:
                pass
            
            
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['addedCount', 'deletedCount', 'executives'],'')
            executives = []
            if len(personIdList) > 0:
                for personKey in personIdList:
                    employment_list = session_warehouse.query(Person_employment_fact).filter(Person_employment_fact.person_employment_fact_key == personKey).all()
                    if len(employment_list) > 0:
                        employmentItem = {}.fromkeys(['title', 'companyName', 'companyId', 'employmentId', 'executiveId', 'execName', 'isPastEmployment'],'')
                        employmentItem['title'] = employment_list[0].jobPosition.job_position_name
                        employmentItem['companyName'] = employment_list[0].organization.org_name
                        employmentItem['companyId'] = employment_list[0].organization.org_key
                        employmentItem['employmentId'] = employment_list[0].person_employment_fact_key
                        employmentItem['executiveId'] = ""
                        employmentItem['execName'] = employment_list[0].person.name
                        employmentItem['isPastEmployment'] = "false"
                        
                        executives.append(employmentItem)
            
            data['executives'] = executives
            response['data'] = data
            response['no'] = 0
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            session_neican.rollback()
            session_warehouse.rollback()
            raise
        finally:
            session_neican.close()
            session_warehouse.close()
            
            
    @staticmethod
    def login(email, password):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            userList = session.query(User).filter(User.email == email, User.password == password).all()
            if len(userList) > 0:
                uid = userList[0].user_id
                
                companyList = session.query(Org_watchlist.company_id).filter(Org_watchlist.watchlist_id == uid).all()
                companyIdList = []
                if len(companyList) > 0:
                    for company in companyList:
                        companyIdList.append(company[0])
                else:
                    pass
                
                contactList = session.query(Person_watchlist.contact_id).filter(Person_watchlist.watchlist_id == uid).all()
                contactIdList = []
                if len(contactList) > 0:
                    for contact in contactList:
                        contactIdList.append(contact[0])
                else:
                    pass
                
                response = {}.fromkeys(['ec', 'authcode', 'user'])
                
                user = {}.fromkeys(['userId', 'fullName', 'firstName', 'lastName', 'watchlistInfo'])
                watchlistInfo = {}.fromkeys([str(uid)])
                
                watchlistItem = {}.fromkeys(['id', 'creationDate', 'name', 'lastUpdated', 'type', 'following'])
                
                following = {}.fromkeys(['companies', 'people'])
                following['companies'] = companyIdList
                following['people'] = contactIdList
               
                watchlistItem['following'] = following
                watchlistItem['id'] = uid
                
                watchlistInfo[str(uid)] = watchlistItem
                
                user['watchlistInfo'] = watchlistInfo
                user['fullName'] = userList[0].name
                user['userId'] = userList[0].user_id
                
                response['ec'] = 0
                response['authcode'] = 'XXXXX'
                response['user'] = user
                
                response = jsonpickle.encode(response, unpicklable="false")
                return response
            else:
                pass       
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
        
        
    """replace by new method
    """    
    """
    @staticmethod
    def searchByConditions(queryConditions):
        {
         "formLog":"false",
         "pageNum":"1",
         "compSB":"Popularity",
         "compSO":"Descending",
         "contSB":"Popularity",
         "contSO":"Descending",
         "pJF":["ALL"],
         "pJL":["ALL"],
         "pCJF":"true",
         "lRgn":"citystate",
         "lCt":"Vancouver",
         "lCountry":["United States"],
         "lZC":"false",
         "lAC":"false",
         "lStt":"false",
         "sEMin":"10",
         "sEMax":"100",
         "sRMin":"false",
         "sRMax":"false",
         "iSect":["515"],
         "iSub": ["517"],
         "iPOF":"true",
         "iPSICOF":"true",
         "iPNAICSOF":"true",
         "bSFC":"AllCompanies", 
         "bType": ["ALL"], 
         "bStat":["ALL"],
         "bRank":"ALL",
         "bFYE":"0",
         "nDays":"30",
         "cPFDF":"false",
         "cPSDF":"false", 
         "cPTF": "false",
         "cCWF":"false",
         "cPCWF":"false",
         "cPTCF":"false",
         "cRAF":"false",
         "cEF":"false", 
         "oITRC":"false"}
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            orgList = []
            if queryConditions.has_key('lRgn') and queryConditions['lRgn'] != "ALL":
                firstFilter = {}
                if queryConditions['lRgn'] == "citystate":
                    if queryConditions.has_key('lCt') and queryConditions.has_key('lStt'):
                        if queryConditions['lCt'] != "false":
                            firstFilter['city'] = queryConditions['lCt']
                        if queryConditions['lStt'] != "false":
                            firstFilter['province'] = queryConditions['lStt']
                    elif queryConditions.has_key('lCt'):
                        if queryConditions['lCt'] != "false":
                            firstFilter['city'] = queryConditions['lCt']
                    elif queryConditions.has_key('lStt'):
                        if queryConditions['lStt'] != "false":
                            firstFilter['province'] = queryConditions['lStt']
                    else:
                        pass
                elif queryConditions['lRgn'] == "zipcode":
                    if queryConditions['lZC'] != "false":
                        firstFilter['zipcode'] = queryConditions['lZC']
                elif queryConditions['lRgn'] == "country":
                    pass
                elif queryConditions['lRgn'] == "areacode":
                    if queryConditions['lAC'] != "false":
                        firstFilter['district'] = queryConditions['lAC']
                elif queryConditions['lRgn'] == "region":
                    pass
                
                firstFilterResult = []
                if len(firstFilter) > 0:
                    firstFilterResult = session.query(Address).filter_by(**firstFilter).all()
                else:
                    pass
                
                firstFilterOrgs = []
                if len(firstFilterResult) > 0:
                    for item in firstFilterResult:
                        if len(item.organization) > 0:#如果不加这句会报错
                            if (item.organization)[0] not in firstFilterOrgs:
                                firstFilterOrgs.append((item.organization)[0])
                else:
                    pass
                
                secondFilterOrgs = []
                if len(firstFilterOrgs) > 0:
                    if queryConditions.has_key('sEMin') and queryConditions.has_key('sEMax'):
                        if queryConditions['sEMin'] != "false" and queryConditions['sEMax'] != "false":
                            for item in firstFilterOrgs:
                                if item.org_size <= string.atoi(queryConditions['sEMax']) and item.org_size >= string.atoi(queryConditions['sEMin']):
                                    secondFilterOrgs.append(item)
                        elif queryConditions['sEMin'] != "false" and queryConditions['sEMax'] == "false":
                            for item in firstFilterOrgs:
                                if item.org_size >= string.atoi(queryConditions['sEMin']):
                                    secondFilterOrgs.append(item)
                        elif queryConditions['sEMin'] == "false" and queryConditions['sEMax'] != "false":
                            for item in firstFilterOrgs:
                                if item.org_size <= string.atoi(queryConditions['sEMax']):
                                    secondFilterOrgs.append(item)
                        else:
                            secondFilterOrgs = firstFilterOrgs
                    elif queryConditions.has_key('sEMin'):
                        if queryConditions['sEMin'] != "false":
                            for item in firstFilterOrgs:
                                if item.org_size >= string.atoi(queryConditions['sEMin']):
                                    secondFilterOrgs.append(item)
                        else:
                            secondFilterOrgs = firstFilterOrgs
                    elif queryConditions.has_key('sEMax'):
                        if queryConditions['sEMax'] != "false":
                            if item.org_size <= string.atoi(queryConditions['sEMax']):
                                secondFilterOrgs.append(item)
                        else:
                            secondFilterOrgs = firstFilterOrgs
                    else:
                        secondFilterOrgs = firstFilterOrgs
                else:#firstFilter has nothing
                    secondFilterOrgs = []        
                
                thirdFilterOrgs = []    
                if len(secondFilterOrgs) > 0:
                    if queryConditions.has_key('sRMin') and queryConditions.has_key('sRMax'):
                        if queryConditions['sRMin'] != "false" and queryConditions['sRMax'] != "false":
                            for item in secondFilterOrgs:
                                if item.revenue <= string.atoi(queryConditions['sRMax']) and item.revenue >= string.atoi(queryConditions['sRMin']):
                                    thirdFilterOrgs.append(item)
                        elif queryConditions['sRMin'] != "false" and queryConditions['sRMax'] == "false":
                            for item in secondFilterOrgs:
                                if item.revenue >= string.atoi(queryConditions['sRMin']):
                                    thirdFilterOrgs.append(item)
                        elif queryConditions['sRMin'] == "false" and queryConditions['sRMax'] != "false":
                            for item in secondFilterOrgs:
                                if item.revenue <= string.atoi(queryConditions['sRMax']):
                                    thirdFilterOrgs.append(item)
                        else:
                            thirdFilterOrgs = secondFilterOrgs
                    elif queryConditions.has_key('sRMin'):
                        if queryConditions['sRMin'] != "false":
                            for item in secondFilterOrgs:
                                if item.revenue >= string.atoi(queryConditions['sRMin']):
                                    thirdFilterOrgs.append(item)
                        else:
                            thirdFilterOrgs = secondFilterOrgs
                    elif queryConditions.has_key('sRMax'):
                        if queryConditions['sRMax'] != "false":
                            for item in secondFilterOrgs:
                                if item.revenue <= string.atoi(queryConditions['sRMax']):
                                    thirdFilterOrgs.append(item)
                        else:
                            thirdFilterOrgs = secondFilterOrgs
                    else:
                        thirdFilterOrgs = secondFilterOrgs
                else:
                    thirdFilterOrgs = []
                
                fourthFilterOrgs = []
                if len(thirdFilterOrgs) > 0:
                    if queryConditions.has_key('iSect') and queryConditions.has_key('iSub'):
                        if queryConditions['iSect'][0] != "所有" and queryConditions['iSub'][0] != "所有":
                            for item in thirdFilterOrgs:
                                if item.nationalIndustry.level1_code == queryConditions['iSect'][0] and item.nationalIndustry.level2_code == queryConditions['iSub'][0]:
                                    fourthFilterOrgs.append(item)
                        else:
                            fourthFilterOrgs = thirdFilterOrgs
                    elif queryConditions.has_key('iSect'):
                        if queryConditions['iSect'][0] != "所有":
                            for item in thirdFilterOrgs:
                                if item.nationalIndustry.level1_code == queryConditions['iSect'][0]:
                                    fourthFilterOrgs.append(item)
                        else:
                            fourthFilterOrgs = thirdFilterOrgs
                    elif queryConditions.has_key('iSub'):
                        if queryConditions['iSub'][0] != "所有":
                            for item in thirdFilterOrgs:
                                if item.nationalIndustry.level2_code == queryConditions['iSub'][0]:
                                    fourthFilterOrgs.append(item)
                        else:
                            fourthFilterOrgs = thirdFilterOrgs
                    else:
                        fourthFilterOrgs = thirdFilterOrgs
                else:
                    fourthFilterOrgs = []
                
                orgList = fourthFilterOrgs
            else:#not have lRgn 
                if queryConditions.has_key('sEMin') or queryConditions.has_key('sEMax') or queryConditions.has_key('sRMin') or queryConditions.has_key('sRMax'):#not have lrgn
                    firstFilterOrgs = []
                    if queryConditions.has_key('sEMin') and queryConditions.has_key('sEMax'):
                        if queryConditions['sEMin'] != "false" and queryConditions['sEMax'] != "false":
                            firstFilterResult = session.query(Organization).filter("org_size<=:max and org_size>=:min").\
                                                    params(max=string.atoi(queryConditions['sEMax']), min=string.atoi(queryConditions['sEMin'])).all()
                        elif queryConditions['sEMin'] == "false" and queryConditions['sEMax'] != "false":
                            firstFilterResult = session.query(Organization).filter("org_size<=:max").\
                                                        params(max=string.atoi(queryConditions['sEMax'])).all()
                        elif queryConditions['sEMin'] != "false" and queryConditions['sEMax'] == "false":
                            firstFilterResult = session.query(Organization).filter("org_size>=:min").\
                                                        params(min=string.atoi(queryConditions['sEMin'])).all()
                        else:
                            firstFilterOrgs = []
                    elif queryConditions.has_key('sEMin'):
                        if queryConditions['sEMin'] != "false":
                            firstFilterResult = session.query(Organization).filter("org_size>=:min").\
                                                        params(min=string.atoi(queryConditions['sEMin'])).all()
                    elif queryConditions.has_key('sEMax'):
                        if queryConditions['sEMax'] != "false":
                            firstFilterResult = session.query(Organization).filter("org_size<=:max").\
                                                        params(max=string.atoi(queryConditions['sEMax'])).all()
                    else:
                        pass
                    
                    if len(firstFilterResult) > 0:
                        for item in firstFilterResult:
                            firstFilterOrgs.append(item)
                    else:
                        firstFilterOrgs = []
                    
                    secondFilterOrgs = []
                    if len(firstFilterOrgs) > 0:
                        if queryConditions.has_key('sRMin') and queryConditions.has_key('sRMax'):
                            if queryConditions['sRMin'] != "false" and queryConditions['sRMax'] != "false":
                                for item in firstFilterOrgs:
                                    if item.revenue <= string.atoi(queryConditions['sRMax']) and item.revenue >= string.atoi(queryConditions['sRMin']):
                                        secondFilterOrgs.append(item)
                            elif queryConditions['sRMin'] != "false" and queryConditions['sRMax'] == "false":
                                for item in firstFilterOrgs:
                                    if item.revenue >= string.atoi(queryConditions['sRMin']):
                                        secondFilterOrgs.append(item)
                            elif queryConditions['sRMin'] == "false" and queryConditions['sRMax'] != "false":
                                for item in firstFilterOrgs:
                                    if item.revenue <= string.atoi(queryConditions['sRMax']):
                                        secondFilterOrgs.append(item)
                            else:
                                secondFilterOrgs = firstFilterOrgs
                        elif queryConditions.has_key('sRMin'):
                            if queryConditions['sRMin'] != "false":
                                for item in firstFilterOrgs:
                                    if item.revenue >= string.atoi(queryConditions['sRMin']):
                                        secondFilterOrgs.append(item)
                            else:
                                secondFilterOrgs = firstFilterOrgs
                        elif queryConditions.has_key('sRMax'):
                            if queryConditions['sRMax'] != "false":
                                for item in firstFilterOrgs:
                                    if item.revenue <= string.atoi(queryConditions['sRMax']):
                                        secondFilterOrgs.append(item)
                            else:
                                secondFilterOrgs = firstFilterOrgs
                        else:
                            secondFilterOrgs = firstFilterOrgs
                    else:
                        secondFilterOrgs = []
                    
                    thirdFilterOrgs = []
                    if len(secondFilterOrgs) > 0:
                        if queryConditions.has_key('iSect') and queryConditions.has_key('iSub'):
                            if queryConditions['iSect'][0] != "所有" and queryConditions['iSub'][0] != "所有":
                                for item in secondFilterOrgs:
                                    if item.nationalIndustry.level1_code == queryConditions['iSect'][0] and item.nationalIndustry.level2_code == queryConditions['iSub'][0]:
                                        thirdFilterOrgs.append(item)
                            elif queryConditions['iSect'][0] != "所有" and queryConditions['iSub'][0] == "所有":
                                for item in secondFilterOrgs:
                                    if item.nationalIndustry.level1_code == queryConditions['iSect'][0]:
                                        thirdFilterOrgs.append(item)
                            elif queryConditions['iSect'][0] == "所有" and queryConditions['iSub'][0] != "所有":
                                for item in secondFilterOrgs:
                                    if item.nationalIndustry.level2_code == queryConditions['iSub'][0]:
                                        thirdFilterOrgs.append(item)
                            else:
                                thirdFilterOrgs = secondFilterOrgs
                        elif queryConditions.has_key('iSect'):
                            if queryConditions['iSect'][0] != "所有":
                                for item in secondFilterOrgs:
                                    if item.nationalIndustry.level1_code == queryConditions['iSect'][0]:
                                        thirdFilterOrgs.append(item)
                            else:
                                thirdFilterOrgs = secondFilterOrgs
                        elif queryConditions.has_key('iSub'):
                            if queryConditions['iSub'][0] != "所有":
                                for item in secondFilterOrgs:
                                    if item.nationalIndustry.level2_code == queryConditions['iSub'][0]:
                                        thirdFilterOrgs.append(item)
                            else:
                                thirdFilterOrgs = secondFilterOrgs
                        else:
                            thirdFilterOrgs = secondFilterOrgs
                    else:
                        thirdFilterOrgs = []
                        
                    orgList = thirdFilterOrgs
                else:#not have sEMin sEMax
                    if queryConditions.has_key('iSect') or queryConditions.has_key('iSub'):
                        firstFilterOrgs = []
                        firstFilter = {}
                        if queryConditions.has_key('iSect') and queryConditions.has_key('iSub'):
                            if queryConditions['iSect'][0] != "所有" and queryConditions['iSub'][0] != "所有":
                                firstFilter['level1_code'] = queryConditions['iSect'][0]
                                firstFilter['level2_code'] = queryConditions['iSub'][0] 
                            elif queryConditions['iSect'][0] != "所有":
                                firstFilter['level1_code'] = queryConditions['iSect'][0]
                            elif queryConditions['iSub'][0] != "所有":
                                firstFilter['level2_code'] = queryConditions['iSub'][0]
                            else:
                                pass
                        elif queryConditions.has_key('iSect'):
                            if queryConditions['iSect'][0] != "所有":
                                firstFilter['level1_code'] = queryConditions['iSect'][0]
                            else:
                                pass
                        elif queryConditions.has_key('iSub'):
                            if queryConditions['iSub'][0] != "所有":
                                firstFilter['level2_code'] = queryConditions['iSub'][0]
                            else:
                                pass
                        else:
                            pass
                            
                        if len(firstFilter) > 0:    
                            nic_list = session.query(National_industry_class).filter_by(**firstFilter).all()
                                
                            for item in nic_list:
                                orgsItem = item.nicOrganiztions
                                for org in orgsItem:
                                    firstFilterOrgs.append(org)
                        else:
                            firstFilterOrgs = []
                            
                        orgList = firstFilterOrgs
                        
                    else:#not have iSect
                        pass
            
            response = {}.fromkeys(['error', 'errorMessage', 'data'])
            data = {}.fromkeys(['totalCount', 'resultStartIndex', 'resultEndIndex', 'companyCriteria', 'companyListResults'])
            companyCriteria = {}.fromkeys(['Company Type','Company Status','Industries','Sub Industries','Countries','Regions','Sort By','Sort Order','Customers','Employees']) 
            
            companyCriteria['Company Type'] = "ALL"
            companyCriteria['Company Status'] = "ALL"
            companyCriteria['Industries'] = "1"
            companyCriteria['Sub Industries'] = "ALL"
            companyCriteria['Countries'] = "China"
            companyCriteria['Regions'] = "country"
            companyCriteria['Sort By'] = "Popularity"
            companyCriteria['Sort Order'] = "Descending"
            companyCriteria['Customers'] = "No"
            companyCriteria['Employees'] = "1 - 50"
            
            data['companyCriteria'] = companyCriteria
            
            companyListResults = []
            for item in orgList:
                companyResultItem = {}.fromkeys(['location','type','connectionCount','companyName','companyId','ticker','employees','revenue','smartAgentInfo'])
            
                companyResultItem['location'] = item.registeredAddress.city +", "+ item.registeredAddress.country
                companyResultItem['type'] = "Private"
                companyResultItem['connectionCount'] = 0
                companyResultItem['companyName'] = item.org_name
                companyResultItem['companyId'] = item.org_key
                companyResultItem['ticker'] = ""
                companyResultItem['employees'] = item.org_size
                companyResultItem['revenue'] = item.revenue
                companyResultItem['smartAgentInfo'] = None
            
                companyListResults.append(companyResultItem)
                
            data['companyListResults'] = companyListResults
                
            data['totalCount'] = len(companyListResults)
        
        
            response['data'] = data
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
    """    
        
        
    @staticmethod
    def getNews(orgId):
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['error','errorType','errorMessage','data'])
            data = {}.fromkeys(['totalCount','resultStartIndex','resultEndIndex','results'])
            
            results = []
            orgNewsList = session.query(Org_news_fact).filter(Org_news_fact.org_key == orgId).all()
            
            if len(orgNewsList) > 0:
                for orgNews in orgNewsList:
                    resultItem = {}.fromkeys(['companyId','title','link','summary','source','time'])
        
                    resultItem['companyId'] = orgNews.org_key
                    resultItem['title'] = orgNews.news_title
                    resultItem['link'] = orgNews.news_link
                    resultItem['summary'] = orgNews.news_summary
                    resultItem['source'] = orgNews.newsSource.news_source_name
                    resultItem['time'] = orgNews.report_date_key
                    
                    results.append(resultItem)
            
            data['totalCount'] = len(orgNewsList)
            data['result'] = results
            
            
            response['data'] = data
            
            response = jsonpickle.encode(response, unpicklable="false")
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
    
    
    @staticmethod
    def getContactOverview(employmentId):
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['error','errorType','errorMessage','data'])
            data = {}.fromkeys(['personData'])
            personData = {}.fromkeys(['isUserContributedLinkedInProfile','employmentId', 'personKey','firstName','lastName','fullName','linkedInProfileUrl',
                                      'company','executiveId','phone','email','position','department','companyName','companyId','curEmployments','otherCurEmployments',
                                      'pastEmployments','smallerFrame','twitterLoggedIn','twitterHandle','facebookHandle','facebookLoggedIn','imageUrl','imageAvailable'])
            
            personEmploymentList = session.query(Person_employment_fact).filter(Person_employment_fact.person_employment_fact_key == employmentId).all()
            if len(personEmploymentList) > 0:
                personEmployment = personEmploymentList[0]
                
                personData['employmentId'] = employmentId
                personData['personKey'] = personEmployment.person_key
                personData['firstName'] = personEmployment.person.first_name
                personData['lastName'] = personEmployment.person.last_name
                personData['fullName'] = personEmployment.person.name
                personData['isUserContributedLinkedInProfile'] = ""
                personData['linkedInProfileUrl'] = ""
                
                company = {}.fromkeys(['id','name','shortName'])
                company['id'] = personEmployment.organization.org_key
                company['name'] = personEmployment.organization.org_name
                company['shortName'] = personEmployment.organization.org_short_name
                
                personData['company'] = company
                personData['executiveId'] = ""
                
                personData['phone'] = ""
                personData['email'] = ""
                personData['position'] = personEmployment.jobPosition.job_position_name
                personData['department'] = ""
                personData['companyName'] = ""
                personData['companyId'] = ""
                
                curEmployment = {}.fromkeys(['id','name'])
                curEmployment['id'] = personEmployment.organization.org_key
                curEmployment['name'] = personEmployment.organization.org_name
                personData['curEmployments'] = [].append(curEmployment)
                
                personData['otherCurEmployments'] = []
                personData['pastEmployments'] = []
                personData['smallerFrame'] = ""
                personData['twitterLoggedIn'] = ""
                personData['twitterHandle'] = ""
                personData['facebookHandle'] = ""
                personData['facebookLoggedIn'] = ""
                personData['imageUrl'] = ""
                personData['imageAvailable'] = ""
                
            data['personData'] = personData
            
            response['error'] = False    
            response['errorType'] = None
            response['errorMessage'] = ""
            response['data'] = data
            
            response = jsonpickle.encode(response, unpicklable="false")
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
        


    @staticmethod
    def globalSearchCompanies(searchString, pageNum):
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['error','errorType','errorMessage','data'])
            data = {}.fromkeys(['total','companies'])
            
            #totalOrgsCount = session.query(Organization).filter(Organization.org_name.ilike('%'+searchString+'%')).order_by(Organization.org_key).count()
            totalOrgsCount = session.query(Organization).filter(Organization.org_name.ilike('%'+searchString+'%')).count()
            data['total'] = totalOrgsCount
            if totalOrgsCount > 0:
                companies = []
                #orgList = session.query(Organization).filter(Organization.org_name.ilike('%'+searchString+'%')).order_by(Organization.org_key)[20*(pageNum-1):(20*pageNum)]
                orgList = session.query(Organization).filter(Organization.org_name.ilike('%'+searchString+'%'))[20*(pageNum-1):(20*pageNum)]
                for org in orgList:
                    companyItem = {}.fromkeys(['location','type','connectionCount','companyName','companyId','website','ticker','employees','revenue','smartAgentInfo'])
        
                    companyItem['location'] = org.registeredAddress.mail_address
                    companyItem['type'] = "Private"
                    companyItem['connectionCount'] = 0
                    companyItem['companyName'] = org.org_name
                    companyItem['companyId'] = org.org_key
                    companyItem['website'] = org.org_website
                    companyItem['ticker'] = ""
                    companyItem['employees'] = org.org_size
                    companyItem['revenue'] = org.revenue
                    companyItem['smartAgentInfo'] = None
                    
                    companies.append(companyItem)
                    
            data['companies'] = companies
            
            response['error'] = False    
            response['errorType'] = None
            response['errorMessage'] = ""
            response['data'] = data
            
            response = jsonpickle.encode(response, unpicklable="false")
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
                
    
    @staticmethod
    def globalSearchPeople(searchString, pageNum):
        jobPositionCopy = {1:"董事长",
                          2:"副董事长",
                          3:"总裁",
                          4:"执行副总裁",
                          5:"执行董事",
                          6:"非执行董事",
                          7:"独立非执行董事",
                          8:"独立董事",
                          9:"监事会主席",
                          10:"监事",
                          11:"职工监事",
                          12:"高级副总裁",
                          13:"财务总监",
                          14:"董秘",
                          15:"总经理",
                          16:"副总经理",
                          17:"首席执行官",
                          18:"常务副总经理",
                          19:"首席财务官",
                          20:"外部监事",
                          21:"董事",
                          22:"法人",
                          23:"负责人"}
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['error','errorType','errorMessage','data'])
            data = {}.fromkeys(['total','people'])
            #totalPeopleCount = session.query(Person_employment_fact).join(Person_employment_fact.person).filter(Person.name.ilike('%'+searchString+'%')).order_by(Person.person_key).count()
            totalPeopleCount = session.query(Person_employment_fact).join(Person_employment_fact.person).filter(Person.name.ilike('%'+searchString+'%')).count()
            data['total'] = totalPeopleCount
            
            people = []
            if totalPeopleCount > 0:    
                #peopleList = session.query(Person_employment_fact).join(Person_employment_fact.person).filter(Person.name.ilike('%'+searchString+'%')).order_by(Person.person_key)[20*(pageNum-1):(20*pageNum)]
                peopleList = session.query(Person_employment_fact).join(Person_employment_fact.person).filter(Person.name.ilike('%'+searchString+'%'))[20*(pageNum-1):(20*pageNum)]
                for item in peopleList:
                    peopleItem = {}.fromkeys(['current','connectionCount','fullName','companyName','displayTitle','companyId','employmentId','executiveId','smartAgentInfo'])
                     
                    peopleItem['current'] = True
                    peopleItem['connectionCount'] = 0
                    peopleItem['fullName'] = item.person.name
                    peopleItem['companyName'] = item.organization.org_name
                    peopleItem['displayTitle'] = jobPositionCopy[item.job_position_key]
                    peopleItem['companyId'] = item.organization.org_key
                    peopleItem['employmentId'] = item.person_employment_fact_key
                    peopleItem['executiveId'] = ""
                    peopleItem['smartAgentInfo'] = None
                    
                    people.append(peopleItem)
                    
            data['people'] = people
            
            response['error'] = False    
            response['errorType'] = None
            response['errorMessage'] = ""
            response['data'] = data
            
            response = jsonpickle.encode(response, unpicklable="false")
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
            
    @staticmethod
    def getGovAnnouncements(orgId, num = 10):
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count', 'announcements'],'')
            
            announcements = []
            announcement_list = session.query(Gov_announcement_fact).filter(Gov_announcement_fact.org_key == orgId).order_by(desc(Gov_announcement_fact.publish_date_key))[0:num]
            if len(announcement_list) > 0:
                for item in announcement_list:
                    announcementItem = {}.fromkeys(['title', 'url', 'ministry', 'date'],'')
                    
                    announcementItem['title'] = item.title
                    announcementItem['url'] = item.url
                    announcementItem['ministry'] = item.gov_ministry
                    announcementItem['date'] = item.publish_date_key
                    
                    announcements.append(announcementItem)
            
            data['announcements'] = announcements
            data['count'] = len(announcement_list)
            
            response['data'] = data
            response['no'] = 0
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
    
    @staticmethod
    def getCertifications(orgId):
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count', 'certifications'],'')
            
            certifications = []
            certification_list = session.query(Org_certification_fact).filter(Org_certification_fact.org_key == orgId).order_by(desc(Org_certification_fact.certification_date))[0:10]
            if len(certification_list) > 0:
                for item in certification_list:
                    certificationItem = {}.fromkeys(['certifiedProduct', 'governmentApprovals', 'certificationDate', 'expiryDate', 'comments'],'')
                    
                    certificationItem['certifiedProduct'] = item.certified_product
                    certificationItem['governmentApprovals'] = item.government_approvals
                    certificationItem['certificationDate'] = item.certification_date
                    certificationItem['expiryDate'] = item.expiry_date
                    certificationItem['comments'] = item.comments
                    
                    certifications.append(certificationItem)
            
            data['certifications'] = certifications
            data['count'] = len(certification_list)
            
            response['data'] = data
            response['no'] = 0
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
            
    @staticmethod
    def get_province_list():
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count', 'level','provinces'],'')
            province_list = session.query(Geo_division).filter(Geo_division.level == 1).all()
            provinces = []
            if len(province_list) > 0:
                for item in province_list:
                    province_item = {}.fromkeys(['province_id', 'province_name'],'')
                    province_item['province_id'] = item.geo_division_id
                    province_item['province_name'] = item.name
                    
                    provinces.append(province_item)
            
            data['count'] = len(province_list)
            data['level'] = 1
            data['provinces'] = provinces
            
            response['data'] = data
            response['no'] = 0
                    
            response = jsonpickle.encode(response, unpicklable=False)        
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
            
    @staticmethod
    def get_city_list(province_id):
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count', 'level','cities'],'')
            
            city_list = session.query(Geo_division).filter(Geo_division.parent_id == province_id, Geo_division.level == 2).all()
            cities = []
            if len(city_list) > 0:
                for item in city_list:
                    city_item = {}.fromkeys(['city_id', 'city_name'],'')
                    city_item['city_id'] = item.geo_division_id
                    city_item['city_name'] = item.name
                    
                    cities.append(city_item)
            
            data['count'] = len(city_list)
            data['level'] = 2
            data['cities'] = cities
            
            response['data'] = data
            response['no'] = 0
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
    
    @staticmethod
    def get_district_list(city_id):
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count', 'level','districts'],'')
            
            district_list = session.query(Geo_division).filter(Geo_division.parent_id == city_id, Geo_division.level == 3).all()
            districts = []
            if len(district_list) > 0:
                for item in district_list:
                    district_item = {}.fromkeys(['district_id', 'district_name'],'')
                    district_item['district_id'] = item.geo_division_id
                    district_item['district_name'] = item.name
                    
                    districts.append(district_item)
            
            data['count'] = len(district_list)
            data['level'] = 3
            data['districts'] = districts
            
            response['data'] = data
            response['no'] = 0
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
            
    @staticmethod
    def get_org_status_list(query_conditions):
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count','statuses'],'')
            
            in_page_num = str(query_conditions['page_num']) if query_conditions['page_num'] != "" else "NULL" 
            in_group_type = str(query_conditions['org_group_type']) if query_conditions['org_group_type'] != "" else "NULL"
            in_group_id = str(query_conditions['org_group_id']) if query_conditions['org_group_id'] != "" else "NULL" 
            
            import psycopg2
            conn_string = "host='192.168.30.173' dbname='yunti' user='ws_dblayer' password='progress*2013'"
            conn = psycopg2.connect(conn_string)
            cursor = conn.cursor()
            
            if in_group_type == "0":
                org_key_str = ""
            else:
                org_key_sql = "select warehouse.qry_org_keys("+in_group_type+","+in_group_id+")"
                cursor.execute(org_key_sql)
                org_key_str = cursor.fetchall()
                org_key_str = org_key_str[0][0]
            
            sql_str = "select warehouse.qry_org_status("+"'"+org_key_str+"')"
            
            cursor.execute(sql_str)
            sql_result = cursor.fetchall()
            conn.close()
            sql_result =  sql_result[0][0]
            sql_result = json.loads(sql_result)
            
            org_status_list = []
            if sql_result.has_key('results'):
                if len(sql_result['results']) > 0:
                    org_status_list_all = sql_result['results']
                    org_status_list = org_status_list_all[(int(in_page_num)-1)*10:int(in_page_num)*10]
                    
            if sql_result.has_key('count'):
                data['count'] = sql_result['count']
            
            data['pageNum'] = in_page_num
            data['statuses'] = org_status_list
            
            response['no'] = 0
            response['data'] = data
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            raise
        finally:
            pass
            
    @staticmethod
    def get_org_type_list(query_conditions):
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count', 'pageNum','orgtypes'],'')
            
            in_page_num = str(query_conditions['page_num']) if query_conditions['page_num'] != "" else "NULL" 
            in_group_type = str(query_conditions['org_group_type']) if query_conditions['org_group_type'] != "" else "NULL"
            in_group_id = str(query_conditions['org_group_id']) if query_conditions['org_group_id'] != "" else "NULL" 
            
            import psycopg2
            conn_string = "host='192.168.30.173' dbname='yunti' user='ws_dblayer' password='progress*2013'"
            conn = psycopg2.connect(conn_string)
            cursor = conn.cursor()
            
            if in_group_type == "0":
                org_key_str = ""
            else:
                org_key_sql = "select warehouse.qry_org_keys("+in_group_type+","+in_group_id+")"
                cursor.execute(org_key_sql)
                org_key_str = cursor.fetchall()
                org_key_str = org_key_str[0][0]
            
            sql_str = "select warehouse.qry_org_type_list("+"'"+org_key_str+"')"
            
            cursor.execute(sql_str)
            sql_result = cursor.fetchall()
            conn.close()
            sql_result =  sql_result[0][0]
            sql_result = json.loads(sql_result)
            
            org_type_list = []
            if sql_result.has_key('results'):
                if len(sql_result['results']) > 0:
                    org_type_list_all = sql_result['results']
                    org_type_list = org_type_list_all[(int(in_page_num)-1)*10:int(in_page_num)*10]
                    
            if sql_result.has_key('count'):
                data['count'] = sql_result['count']
            
            data['pageNum'] = in_page_num
            data['orgtypes'] = org_type_list
            
            response['no'] = 0
            response['data'] = data
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            raise
        finally:
            pass
            
            
    @staticmethod
    def get_industry_class_list(query_conditions):
        """used in advanced search(org)
        """
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count', 'pageNum','industries'],'')
            
            in_page_num = str(query_conditions['page_num']) if query_conditions['page_num'] != "" else "NULL" 
            in_group_type = str(query_conditions['org_group_type']) if query_conditions['org_group_type'] != "" else "NULL"
            in_group_id = str(query_conditions['org_group_id']) if query_conditions['org_group_id'] != "" else "NULL" 
            
            import psycopg2
            conn_string = "host='192.168.30.173' dbname='yunti' user='ws_dblayer' password='progress*2013'"
            conn = psycopg2.connect(conn_string)
            cursor = conn.cursor()
            
            if in_group_type == "0":
                org_key_str = ""
            else:
                org_key_sql = "select warehouse.qry_org_keys("+in_group_type+","+in_group_id+")"
                cursor.execute(org_key_sql)
                org_key_str = cursor.fetchall()
                org_key_str = org_key_str[0][0]
            
            sql_str = "select warehouse.qry_industry("+"'"+org_key_str+"')"
            
            cursor.execute(sql_str)
            sql_result = cursor.fetchall()
            conn.close()
            sql_result =  sql_result[0][0]
            sql_result = json.loads(sql_result)
            
            industry_list = []
            if sql_result.has_key('results'):
                if len(sql_result['results']) > 0:
                        industry_list_all = sql_result['results']
                        industry_list = industry_list_all[(int(in_page_num)-1)*10:int(in_page_num)*10]
                    
            if sql_result.has_key('count'):
                data['count'] = sql_result['count']
            
            data['pageNum'] = in_page_num
            data['industries'] = industry_list
            
            response['no'] = 0
            response['data'] = data
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            raise
        finally:
            pass
    
    @staticmethod
    def get_certification_list(query_conditions):
        """used in advanced search(org)
        """
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count', 'pageNum','certifications'],'')
            
            in_page_num = str(query_conditions['page_num']) if query_conditions['page_num'] != "" else "NULL" 
            in_group_type = str(query_conditions['org_group_type']) if query_conditions['org_group_type'] != "" else "NULL"
            in_group_id = str(query_conditions['org_group_id']) if query_conditions['org_group_id'] != "" else "NULL" 
            
            import psycopg2
            conn_string = "host='192.168.30.173' dbname='yunti' user='ws_dblayer' password='progress*2013'"
            conn = psycopg2.connect(conn_string)
            cursor = conn.cursor()
            
            if in_group_type == "0":
                org_key_str = ""
            else:
                org_key_sql = "select warehouse.qry_org_keys("+in_group_type+","+in_group_id+")"
                cursor.execute(org_key_sql)
                org_key_str = cursor.fetchall()
                org_key_str = org_key_str[0][0]
            
            sql_str = "select warehouse.qry_certification("+"'"+org_key_str+"')"
            
            cursor.execute(sql_str)
            sql_result = cursor.fetchall()
            conn.close()
            sql_result =  sql_result[0][0]
            sql_result = json.loads(sql_result)
            
            certification_list = []
            if sql_result.has_key('results'):
                if len(sql_result['results']) > 0:
                    certification_list_all = sql_result['results']
                    certification_list = certification_list_all[(int(in_page_num)-1)*10:int(in_page_num)*10]
              
            if sql_result.has_key('count'):
                data['count'] = sql_result['count']
            
            data['pageNum'] = in_page_num
            data['certifications'] = certification_list
            
            response['no'] = 0
            response['data'] = data
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            raise
        finally:
            pass
        
        
    @staticmethod
    def get_job_type_list(query_conditions):
        """used in advanced search(org)
        """
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count', 'pageNum','jobTypes'],'')
            
            in_page_num = str(query_conditions['page_num']) if query_conditions['page_num'] != "" else "NULL" 
            in_group_type = str(query_conditions['org_group_type']) if query_conditions['org_group_type'] != "" else "NULL"
            in_group_id = str(query_conditions['org_group_id']) if query_conditions['org_group_id'] != "" else "NULL" 
            
            import psycopg2
            conn_string = "host='192.168.30.173' dbname='yunti' user='ws_dblayer' password='progress*2013'"
            conn = psycopg2.connect(conn_string)
            cursor = conn.cursor()
            
            if in_group_type == "0":
                org_key_str = ""
            else:
                org_key_sql = "select warehouse.qry_org_keys("+in_group_type+","+in_group_id+")"
                cursor.execute(org_key_sql)
                org_key_str = cursor.fetchall()
                org_key_str = org_key_str[0][0]
            
            sql_str = "select haojm.qry_job_type_list("+"'"+org_key_str+"')"
            
            cursor.execute(sql_str)
            sql_result = cursor.fetchall()
            conn.close()
            sql_result =  sql_result[0][0]
            sql_result = json.loads(sql_result)
            
            job_type_list = []
            if sql_result.has_key('results'):
                if len(sql_result['results']) > 0:
                    job_type_list_all = sql_result['results']
                    job_type_list = job_type_list_all[(int(in_page_num)-1)*10:int(in_page_num)*10]
              
            if sql_result.has_key('count'):
                data['count'] = sql_result['count']
            
            data['pageNum'] = in_page_num
            data['jobTypes'] = job_type_list
            
            response['no'] = 0
            response['data'] = data
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            raise
        finally:
            pass
        
    @staticmethod
    def get_org_dept_list(query_conditions):
        """used in advanced search(org)
        """
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count', 'pageNum','depts'],'')
            
            in_page_num = str(query_conditions['page_num']) if query_conditions['page_num'] != "" else "NULL" 
            in_group_type = str(query_conditions['org_group_type']) if query_conditions['org_group_type'] != "" else "NULL"
            in_group_id = str(query_conditions['org_group_id']) if query_conditions['org_group_id'] != "" else "NULL" 
            
            import psycopg2
            conn_string = "host='192.168.30.173' dbname='yunti' user='ws_dblayer' password='progress*2013'"
            conn = psycopg2.connect(conn_string)
            cursor = conn.cursor()
            
            if in_group_type == "0":
                org_key_str = ""
            else:
                org_key_sql = "select warehouse.qry_org_keys("+in_group_type+","+in_group_id+")"
                cursor.execute(org_key_sql)
                org_key_str = cursor.fetchall()
                org_key_str = org_key_str[0][0]
            
            sql_str = "select haojm.qry_department_list("+"'"+org_key_str+"')"
            
            cursor.execute(sql_str)
            sql_result = cursor.fetchall()
            conn.close()
            sql_result =  sql_result[0][0]
            sql_result = json.loads(sql_result)
            
            dept_list = []
            if sql_result.has_key('results'):
                if len(sql_result['results']) > 0:
                    dept_list_all = sql_result['results']
                    dept_list = dept_list_all[(int(in_page_num)-1)*10:int(in_page_num)*10]
              
            if sql_result.has_key('count'):
                data['count'] = sql_result['count']
            
            data['pageNum'] = in_page_num
            data['depts'] = dept_list
            
            response['no'] = 0
            response['data'] = data
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            raise
        finally:
            pass

class DLUserManager(object): 
    @staticmethod
    def encrypt_md5(pwd):
        """md5加密"""
        import hashlib
        m = hashlib.md5()
        m.update(pwd)
        return m.hexdigest()
    
    @staticmethod
    def login(account, password):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'])
            if account.find('@') == -1:
                userList = session.query(User).join(User_phone, User.user_id == User_phone.user_id).filter(User.is_activated == True, User_phone.phone_number == account, User_phone.is_logon == True).all()
                session.commit()
                if len(userList) == 0:
                    response['no'] = 1
                    response['errMsg'] = "用户名或密码错误"
                else:
                    db_password = userList[0].password
                    if db_password == DLUserManager.encrypt_md5(password):
                        response['no'] = 0
                        data = {}.fromkeys(['isFirstTime','uid'],'')
                        data['isFirstTime'] = userList[0].is_first_time
                        data['uid'] = userList[0].user_id
                        response['data'] = data
                    else:
                        response['no'] = 1
                        response['errMsg'] = "用户名或密码错误"
            else:
                userList = session.query(User).join(User_email, User.user_id == User_email.user_id).filter(User.is_activated == True, User_email.email == account, User_email.is_logon == True).all()
                session.commit()
                if len(userList) == 0:
                    response['no'] = 1
                    response['errMsg'] = "用户名或密码错误"
                else:
                    db_password = userList[0].password
                    bl_password = DLUserManager.encrypt_md5(password)
                    if db_password == bl_password:
                        response['no'] = 0
                        data = {}.fromkeys(['isFirstTime','uid'],'')
                        data['isFirstTime'] = userList[0].is_first_time
                        data['uid'] = userList[0].user_id
                        data['name'] = userList[0].name
                        response['data'] = data
                    else:
                        response['no'] = 1
                        response['errMsg'] = "用户名或密码错误"
            
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
            
    @staticmethod            
    def add_user(account, password, activCode):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            if account.find('@') == -1:
                user = User(None, None, None, None, None, None, None, 1, None, 
                            None, False,activCode, None, 'system', str(datetime.now()), 
                            'system', str(datetime.now()), True)
                session.add(user)
                session.commit()
                
                user_phone = User_phone(user.user_id, 7, account, True, True, 'system', str(datetime.now()), 'system', str(datetime.now()))
                session.add(user_phone)
                session.commit()
            else:
                dl_password = DLUserManager.encrypt_md5(password)
                
                user = User(None, None, None, None, None, dl_password, None, 1, None, 
                            None, False,activCode, None, "system", str(datetime.now()), "system", str(datetime.now()), True, -1)

                session.add(user)
                session.commit()
                
                user_email = User_email(user.user_id, 5, account, True, True, 'system', str(datetime.now()), 'system', str(datetime.now()))
                session.add(user_email)
                session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
    
    @staticmethod
    def check_account(account):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            """验证该账号是否已经注册过"""
            if account.find('@') == -1:
                userList = session.query(User).join(User_phone, User.user_id == User_phone.user_id).filter(User.is_activated == True, User_phone.phone_number == account, User_phone.is_logon == True).all()
                if len(userList) > 0 :
                    return "该手机号已注册"
                else:
                    return "该手机号未注册"
            else:
                userList = session.query(User).join(User_email, User.user_id == User_email.user_id).filter(User.is_activated == True, User_email.email == account, User_email.is_logon == True).all()
                if len(userList) > 0 :
                    return "该邮箱已注册"
                else:
                    return "该邮箱未注册"
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
    
    
    @staticmethod
    def create_mailCode(codeNum):
        import random
        
        _letter_cases = "abcdefghjkmnpqrstuvwxy" # 小写字母，去除可能干扰的i，l，o，z
        _upper_cases = _letter_cases.upper() # 大写字母
        _numbers = ''.join(map(str, range(3, 10))) # 数字
        init_chars = ''.join((_letter_cases, _upper_cases, _numbers))
        activeCode = ''.join(random.sample(init_chars, codeNum))
        return activeCode
    
    @staticmethod
    def create_phoneCode():
        import random

        range = '0123456789'
        phoneActiveCode = ''
        i = 1
        while i <= 6:
            seq = random.sample(range, 1)
            i += 1
            phoneActiveCode = phoneActiveCode + seq[0]
            
        return phoneActiveCode
        
    
    @staticmethod
    def send_mailCode(to, sub, content):
        import smtplib  
        from email.mime.text import MIMEText  
    
        #mailto_list= ['526662774@qq.com']
        mail_host="smtp.qq.com"  #设置服务器
        mail_user="2426347376"    #用户名
        mail_pass="maitool.2013"   #口令 
        mail_postfix="qq.com"  #发件箱的后缀
        
        me="sureway"+"<"+mail_user+"@"+mail_postfix+">"  
        msg = MIMEText(content,_subtype='html',_charset='utf-8')  
        msg['Subject'] = sub  
        msg['From'] = me  
        msg['To'] = to  
        try:  
            server = smtplib.SMTP()  
            server.connect(mail_host)  
            server.login(mail_user,mail_pass)  
            server.sendmail(me, to, msg.as_string())  
            server.close()  
            return True  
        except Exception, e:  
            print str(e)  
            return False 
    
    @staticmethod
    def send_phoneCode(account, message):
        import psycopg2
        from django.utils.encoding import smart_unicode  
        import binascii
        
        conn_string = "host='surewaysolutions.com' dbname='smsd' user='smsd' password='mtsmsd123'"
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        message = binascii.hexlify(smart_unicode(message).encode('utf_16_be'))
        exec_string = 'insert into outbox("DestinationNumber","Text","CreatorID","Coding") values('+"'"+account+"'"+","+"'"+message+"'"+",'Program','Unicode_No_Compression');"
        cursor.execute(exec_string)
        conn.commit()
        conn.close()
        
    
    @staticmethod 
    def register(account, password):
        response = {}.fromkeys(['no', 'errMsg', 'data'])
        isregisted = DLUserManager.check_account(account)
        if isregisted == "该邮箱已注册" or isregisted =="该手机号已注册":
            if account.find('@') == -1:
                response['no'] = 1
                response['errMsg'] = "该手机号已注册"
            else:
                response['no'] = 1
                response['errMsg'] = "该邮箱已注册"
        else:
            if account.find('@') == -1:
                phoneActivateCode = DLUserManager.create_phoneCode()
                
                message = u'脉拓网验证码为: '+phoneActivateCode
                DLUserManager.send_phoneCode(account, message)
                
                DLUserManager.add_user(account, None, phoneActivateCode)
                
                response['no'] = 0
            else:
                """email activation will send code with 20 chars
                """
                mailActivateCode = DLUserManager.create_mailCode(20)
                
                content = u"感谢您注册脉拓网，您的账号已经创建成功"+"<br>"+u"您的登录名是: "+account+"<br><br><br>"+u"请点击下面的链接，立即激活您的帐号:\
                         "+"<br>"+"<a href='http://www.maitool.com/ekb/auth/activate/"+mailActivateCode+"'>"+"\
                         http://www.maitool.com/ws/auth/active?active_token="+mailActivateCode+"</a>"+"<br><br>\
                         "+u"Maitool – 脉入云端，拓展商机"
                                 
                DLUserManager.send_mailCode(account, '激活', content)
                
                DLUserManager.add_user(account, password, mailActivateCode)
                
                response['no'] = 0
        
        return response
    
    @staticmethod
    def emailActivate(activateCode):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'])
            user_list = session.query(User).join(User_email, User.user_id == User_email.user_id).filter(User.activation_code == activateCode, User.is_activated == False).all()
            session.commit()
            if len(user_list) > 0:
                data = {}.fromkeys(['uid'],'')
                user_list[0].is_activated = True
                session.commit()
                
                data['uid'] = user_list[0].user_id
                response['data'] = data
                response['no'] = 0
            else:
                response['no'] = 1
                response['errMsg'] = "激活失败"
            
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
        
    @staticmethod
    def mobileActivate(activateCode, password):
        session = Session()
        session.execute("set search_path to 'neican'")
        
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            user_list = session.query(User).filter(User.activation_code == activateCode, User.is_activated == False).all()
            session.commit()
            if len(user_list) > 0:
                data = {}.fromkeys(['uid'],'')
                user_list[0].is_activated = True
                session.commit()
                
                user = session.query(User).join(User_phone, User.user_id == User_phone.user_id).filter(User_phone.user_id == user_list[0].user_id, User.activation_code == activateCode).one()
                dl_password = DLUserManager.encrypt_md5(password) 
                user.password = dl_password
                session.commit()
                
                data['uid'] = user.user_id
                response['data'] = data
                response['no'] = 0
            else:
                response['no'] = 1
                response['errMsg'] = "激活失败"
        
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
    
    @staticmethod
    def search_weibo_user(weibo_uid):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            token_map_list = session.query(Token_map).filter(Token_map.uid == weibo_uid, Token_map.token_type == 1).all()
            if len(token_map_list) > 0:
                return 1
            else:
                return 0
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
    
    @staticmethod
    def register_via_weibo(mobile, weibo_id, weibo_token, screen_name):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'])
            isregisted = DLUserManager.check_account(mobile)
            if isregisted == "该邮箱已注册" or isregisted =="该手机号已注册":
                if mobile.find('@') == -1:
                    response['no'] = 1
                    response['errMsg'] = "该手机号已注册"
                else:
                    response['no'] = 1
                    response['errMsg'] = "该邮箱已注册"
            else:
                phoneActivateCode = DLUserManager.create_phoneCode()
                message = u'脉拓网验证码为: '+phoneActivateCode      
                DLUserManager.send_phoneCode(mobile, message)
                
                user = User(None, None, None, screen_name, None, None, None, 1, 
                            None, None, False,phoneActivateCode, None, 'system', str(datetime.now()), 'system', str(datetime.now()), True, -1)
                session.add(user)
                session.commit()
                
                user_phone = User_phone(user.user_id, 7, mobile, True, True, 'system', str(datetime.now()), 'system', str(datetime.now()))
                session.add(user_phone)
                session.commit()
                
                token = Token_map(1, weibo_token, weibo_id, str(user.user_id), 'system', str(datetime.now()), 'system', str(datetime.now()))
                session.add(token)
                session.commit()
                
                response['no'] = 0
            
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
            
    
    @staticmethod
    def login_via_weibo(weibo_uid, weibo_token):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'])
            weibo_account_list = session.query(Token_map).filter(Token_map.token_type == 1,Token_map.uid == weibo_uid).all()
            if len(weibo_account_list) > 0:
                weibo_account_list[0].token_value = weibo_token
                session.commit()
                
                user_list = session.query(User).filter(User.user_id == string.atoi(weibo_account_list[0].maitool_id)).all()
                data = {}.fromkeys(['isFirstTime', 'uid'])
                data['isFirstTime'] = user_list[0].is_first_time
                #this uid is user_id, not weibo's uid
                data['uid'] = user_list[0].user_id
                
                response['no'] = 0
                response['data'] = data
            else:
                response['no'] = 2
                response['errMsg'] = "登陆失败"
                
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
    
    
    @staticmethod
    def weiboActivate(activateCode):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            user_list = session.query(User).filter(User.activation_code == activateCode, User.is_activated == False).all()
            session.commit()
            if len(user_list) > 0:
                user_list[0].is_activated = True
                session.commit()
                response['no'] = 0
                data = {}.fromkeys(['uid'],'')
                data['uid'] = user_list[0].user_id
                response['data'] = data
            else:
                response['no'] = 1
                response['errMsg'] = "激活失败"
            
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()


    @staticmethod
    def search_qq_user(qq_openid):
        """token_type:
                {weibo:1,
                 qq:2
                }
        """
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            token_map_list = session.query(Token_map).filter(Token_map.uid == qq_openid, Token_map.token_type == 2).all()
            if len(token_map_list) > 0:
                return 1
            else:
                return 0
        except:
            session.rollback()
            raise
        finally:
            session.close()
            
    @staticmethod
    def register_via_qq(mobile, qq_openid, qq_token, nickname):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'])
            isregisted = DLUserManager.check_account(mobile)
            if isregisted == "该邮箱已注册" or isregisted =="该手机号已注册":
                if mobile.find('@') == -1:
                    response['no'] = 1
                    response['errMsg'] = "该手机号已注册"
                else:
                    response['no'] = 1
                    response['errMsg'] = "该邮箱已注册"
            else:
                phoneActivateCode = DLUserManager.create_phoneCode()
                message = u'脉拓网验证码为: '+phoneActivateCode         
                DLUserManager.send_phoneCode(mobile, message)
                
                user = User(None, None, None, nickname, None, None, None, 1, 
                            None, None, False,phoneActivateCode, None, 'system', str(datetime.now()), 'system', str(datetime.now()), True, -1)
                session.add(user)
                session.commit()
                
                user_phone = User_phone(user.user_id, 7, mobile, True, True, 'system', str(datetime.now()), 'system', str(datetime.now()))
                session.add(user_phone)
                session.commit()
                
                token = Token_map(2, qq_token, qq_openid, str(user.user_id), 'system', str(datetime.now()), 'system', str(datetime.now()))
                session.add(token)
                session.commit()
                
                response['no'] = 0
            
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()

    @staticmethod
    def login_via_qq(qq_openid, qq_token):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'])
            qq_account_list = session.query(Token_map).filter(Token_map.token_type == 2,Token_map.uid == qq_openid).all()
            if len(qq_account_list) > 0:
                qq_account_list[0].token_value = qq_token
                session.commit()
                
                user_list = session.query(User).filter(User.user_id == string.atoi(qq_account_list[0].maitool_id)).all()
                data = {}.fromkeys(['isFirstTime', 'uid'])
                data['isFirstTime'] = user_list[0].is_first_time
                #this uid is user_id, not weibo's uid
                data['uid'] = user_list[0].user_id
                
                response['no'] = 0
                response['data'] = data
            else:
                response['no'] = 2
                response['errMsg'] = "登陆失败"
                
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
            
    @staticmethod
    def qqActivate(activateCode):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'])
            user_list = session.query(User).filter(User.activation_code == activateCode, User.is_activated == False).all()
            session.commit()
            if len(user_list) > 0:
                user_list[0].is_activated = True
                session.commit()
                response['no'] = 0
                data = {}.fromkeys(['uid'],'')
                data['uid'] = user_list[0].user_id
                response['data'] = data
            else:
                response['no'] = 1
                response['errMsg'] = "激活失败"
            
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
                
    
    @staticmethod
    def getSimpleInfo(userId):
        session = Session()
        session.execute("set search_path to 'neican'")
        
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['name', 'workInfo', 'contactInfo'],'')
            user_list = session.query(User).filter(User.user_id == userId).all()
            if len(user_list) > 0:
                data['name'] = user_list[0].name
                
                workInfo = {}.fromkeys(['workHistoryId', 'orgName', 'jobPosition', 'department'],'')
                work_history_list = user_list[0].workHistory
                session.query(User_work_history).filter(User_work_history.user_id == userId, User_work_history.is_current == True).all()
                if len(work_history_list) > 0:
                    item = work_history_list[0]
                    workInfo['workHistoryId'] = item.user_work_history_id
                    workInfo['orgName'] = item.org_name
                    workInfo['jobPosition'] = item.job_position_id
                    workInfo['department'] = item.jobPosition.department.org_dept_id
                        
                
                contactInfo = {}.fromkeys(['mobilePhone', 'officePhone', 'personalEmail', 'officeEmail', 'address'],'')
                
                phone_list = session.query(User_phone).filter(User_phone.phone_type == 7, User_phone.user_id == userId).all()
                mobilePhone = {}.fromkeys(['phoneId','phoneNum', 'isLogon'],'')
                if len(phone_list) > 0:
                    item = phone_list[0]
                    mobilePhone['phoneId'] = item.user_phone_id
                    mobilePhone['phoneNum'] = item.phone_number
                    mobilePhone['isLogon'] = item.is_logon
                        
                    contactInfo['mobilePhone'] = mobilePhone
                
                email_list = session.query(User_email).filter(User_email.email_type == 5, User_email.user_id == userId).all()
                personalEmail = {}.fromkeys(['emailId','email', 'isLogon'],'')
                if len(email_list) > 0:
                    item = email_list[0]
                    personalEmail['emailId'] = item.user_email_id
                    personalEmail['email'] = item.email
                    personalEmail['isLogon'] = item.is_logon
                        
                    contactInfo['personalEmail'] = personalEmail
                
                address_list = user_list[0].addresses
                address = {}.fromkeys(['addressId','address'],'')
                if len(address_list) > 0:
                    item = address_list[0]
                    address['addressId'] = item.user_address_id
                    address['address'] = item.mail_address
                        
                    contactInfo['address'] = address
                        
                data['workInfo'] = workInfo
                data['contactInfo'] = contactInfo
            
            response['data'] = data
            response['no'] = 0
            
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
        
            
    @staticmethod
    def addSimpleInfo(userId, jsonInfo):
        session_neican = Session()
        session_neican.execute("set search_path to 'neican'")
        session_warehouse = Session()
        session_warehouse.execute("set search_path to 'warehouse'")
        
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            
            contactInfo = jsonInfo['data']['contactInfo']
            personalEmail = contactInfo['personalEmail']
            officeEmail = contactInfo['officeEmail']
            mobilePhone = contactInfo['mobilePhone']
            officePhone = contactInfo['officePhone']
            address = contactInfo['address']
            
            userName = jsonInfo['data']['name']
            
            workInfo = jsonInfo['data']['workInfo']
            
            user_list = session_neican.query(User).filter(User.user_id == userId).all()
            if len(user_list)>0:
                user_list[0].name = userName
                session_neican.commit()
                
                if workInfo['workHistoryId'] == "":
                    org_list = session_warehouse.query(Organization).filter(Organization.org_name == workInfo['orgName']).all()
                    
                    if len(org_list) > 0:
                        work_history = User_work_history(userId, None, None, org_list[0].org_key, workInfo['orgName'], workInfo['jobPosition'], True, 'system', str(datetime.now()), 'system', str(datetime.now()))
                        session_neican.add(work_history)
                        session_neican.commit()
                    else:
                        work_history = User_work_history(userId, None, None, -1, workInfo['orgName'], workInfo['jobPosition'], True, 'system', str(datetime.now()), 'system', str(datetime.now()))
                        session_neican.add(work_history)
                        session_neican.commit()
                
                if mobilePhone == "":
                    pass
                else:
                    if mobilePhone['phoneId'] == "":
                        user_phone = User_phone(userId, 7, mobilePhone['phoneNum'], False, mobilePhone['isLogon'], 'system', str(datetime.now()), 'system', str(datetime.now()))
                        session_neican.add(user_phone)
                        session_neican.commit()
                
                if personalEmail == "":
                    pass
                else:
                    if personalEmail['emailId'] == "":
                        user_email = User_email(userId, 5, personalEmail['email'], False, personalEmail['isLogon'], 'system', str(datetime.now()), 'system', str(datetime.now()))
                        session_neican.add(user_email)
                        session_neican.commit()
                
                if address == "":
                    pass
                else:    
                    if address['addressId'] == "":
                        user_address = User_address(userId, "China", None, None, None, None, address['address'], None, 'system', str(datetime.now()), 'system', str(datetime.now()))
                        session_neican.add(user_address)
                        session_neican.commit()
                        
                user_list[0].is_first_time = False
                session_neican.commit()
                response['no'] = 0
            else:
                response['no'] = 1
                
            return response
        except:
            session_neican.rollback()
            raise
        finally:
            session_neican.close()
            session_warehouse.close()

        
        
    @staticmethod
    def getDepartmentDic():
        session = Session()
        session.execute("set search_path to 'neican'")   
        
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['departments', 'count'])
            departments = []
            dept_list = session.query(Org_department_neican).all()
            for item in dept_list:
                deptItem = {}.fromkeys(['id','deptName'],'')
                deptItem['id'] = item.org_dept_id
                deptItem['deptName'] = item.dept_name
                
                departments.append(deptItem)
                
            data['departments'] = departments
            data['count'] = len(dept_list)
            
            response['data'] = data
            response['no'] = 0
            
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
        
        
        
    @staticmethod
    def getJobPositionDic(deptId):
        session = Session()
        session.execute("set search_path to 'neican'")
        
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['jobPositions', 'count', 'deptId'])
            jobPositions = []
            job_position_list = session.query(Job_position_neican).filter(Job_position_neican.org_dept_id == deptId).all()
            if len(job_position_list) > 0:
                for item in job_position_list:
                    jobPositionItem = {}.fromkeys(['id','jobPositionName'],'')
                    jobPositionItem['id'] = item.job_position_id
                    jobPositionItem['jobPositionName'] = item.job_position_name
                    
                    jobPositions.append(jobPositionItem)
            
            data['jobPositions'] = jobPositions
            data['count'] = len(job_position_list)
            data['deptId'] = deptId
            
            response['data'] = data
            response['no'] = 0
            
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close()
            
    
    @staticmethod
    def getDegreeDic():
        session = Session()
        session.execute("set search_path to 'neican'")
        
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['degrees', 'count'])
            degrees = []
            degree_list = session.query(Academic_degree).all()
            if len(degree_list) > 0:
                for item in degree_list:
                    degreeItem = {}.fromkeys(['id','degreeName'],'')
                    degreeItem['id'] = item.academic_degree_id
                    degreeItem['degreeName'] = item.academic_degree_name
                    
                    degrees.append(degreeItem)
            
            data['degrees'] = degrees
            data['count'] = len(degree_list)
            
            response['data'] = data
            response['no'] = 0
            
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
    
    @staticmethod
    def changePassword(userId,newPwd):  
        session = Session()
        session.execute("set search_path to 'neican'")
        
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            user_list = session.query(User).filter(User.user_id == userId).all()
            if len(user_list) > 0:
                user_list[0].password = newPwd
                session.commit()
            else:
                pass
            
            response['no'] = 0
            
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close()
        
        
        
        
    @staticmethod
    def getWorkHistory(userId):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['jobPositions', 'count'])
            jobPositions = []
            work_history_list = session.query(User_work_history).filter(User_work_history.user_id == userId).all()
            if len(work_history_list) > 0:
                for item in work_history_list:
                    jobPositionItem = {}.fromkeys(['workHistoryId', 'orgKey', 'orgName', 'startDate', 'endDate', 'deptId', 'deptName', 'jobPositionId', 'jobPositionName', 'isCurrent'],'')
                    jobPositionItem['workHistoryId'] = item.user_work_history_id
                    jobPositionItem['orgKey'] = item.org_key
                    jobPositionItem['orgName'] = item.org_name
                    jobPositionItem['startDate'] = item.start_date if item.start_date != None else ""
                    jobPositionItem['endDate'] = item.end_date if item.end_date != None else ""
                    jobPositionItem['deptId'] = item.jobPosition.department.org_dept_id
                    jobPositionItem['deptName'] = item.jobPosition.department.dept_name
                    jobPositionItem['jobPositionId'] = item.job_position_id
                    jobPositionItem['jobPositionName'] = item.jobPosition.job_position_name
                    jobPositionItem['isCurrent'] = item.is_current
                    
                    jobPositions.append(jobPositionItem)
            
            data['jobPositions'] = jobPositions
            data['count'] = len(work_history_list)
            
            response['data'] = data
            response['no'] = 0
            
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close()
            
    @staticmethod
    def addWorkHistory(userId, jsonInfo):
        session_neican = Session()
        session_neican.execute("set search_path to 'neican'")
        session_warehouse = Session()
        session_warehouse.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            
            workInfo = jsonInfo['data']['workInfo']
            
            start_date = workInfo['startDate']
            start_date = datetime.strptime(start_date, "%Y/%m/%d")
            end_date = workInfo['endDate']
            end_date = datetime.strptime(end_date, "%Y/%m/%d") 
            org_name = workInfo['orgName']
            job_position_id = workInfo['jobPositionId']
            dept_id = workInfo['deptId']
            is_current = workInfo['isCurrent']
             
            org_list = session_warehouse.query(Organization).filter(Organization.org_name == org_name).all()
            if len(org_list) > 0:
                org_key = org_list[0].org_key
            else:
                org_key = -1
                
                
            work_history = User_work_history(userId, start_date, end_date, org_key, org_name, job_position_id, is_current ,"system", str(datetime.now()), "system", str(datetime.now()))
            session_neican.add(work_history)
            session_neican.commit()
            
            response['no'] = 0
            
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session_neican.rollback()
            session_warehouse.rollback()
            raise
        finally:
            session_neican.close()
            session_warehouse.close()
            
    @staticmethod
    def deleteWorkHistory(work_history_id):
        session = Session()
        session.execute("set search_path to 'neican'")
        
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            
            session.query(User_work_history).filter(User_work_history.user_work_history_id == work_history_id).delete()
            session.commit()
            
            response['no'] = 0
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close()
            
    
    @staticmethod
    def getEducationExperience(userId):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count', 'educations'],'')
            
            educations = []
            edu_list = session.query(User_education).filter(User_education.user_id == userId).all()
            if len(edu_list) > 0:
                for item in edu_list:
                    eduItem = {}.fromkeys(['eduId', 'startDate', 'endDate', 'school', 'degree'])
                    
                    eduItem['eduId'] = item.user_education_id
                    eduItem['startDate'] = item.start_date
                    eduItem['endDate'] = item.end_date
                    eduItem['school'] = item.school.school_name
                    eduItem['degree'] = item.degree.academic_degree_name
            
                    educations.append(eduItem)
            
            data['educations'] = educations
            data['count'] = len(edu_list)
            
            response['data'] = data
            response['no'] = 0
            
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close()
            
    @staticmethod
    def addEducationExperience(userId, jsonInfo):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            educationInfo = jsonInfo['data']['educationInfo']
            
            start_date = educationInfo['startDate']
            start_date = datetime.strptime(start_date, "%Y/%m/%d")
            end_date = educationInfo['endDate']
            end_date = datetime.strptime(end_date, "%Y/%m/%d")
            school_id = educationInfo['schoolId']
            academic_degree_id = educationInfo['degreeId']
             
            eduItem = User_education(userId, start_date, end_date, school_id, academic_degree_id, "system", str(datetime.now()), "system", str(datetime.now()))
            session.add(eduItem)
            session.commit()
            
            response['no'] = 0
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close()
   
   
    @staticmethod
    def deleteEducationExperience(education_id):
        session = Session()
        session.execute("set search_path to 'neican'")
        
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            
            session.query(User_education).filter(User_education.user_education_id == education_id).delete()
            session.commit()
            
            response['no'] = 0
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close()         
    
    
    @staticmethod
    def schoolAutoComplete(searchString):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            school_list_db = session.query(School).filter(School.school_name.ilike('%'+searchString+'%')).order_by(School.school_id)[0:20]
            school_list = []
            i = 0
            while i < len(school_list_db):
                item = school_list_db[i]
                """
                  "id":"724570",
                  "state":"NJ",  #州？？？
                  "value":"Automatic Data Processing",
                  "type":"company",
                  "city":"Roseland",
                  "popularity":"141625" #人气指数？？？
                """
                schoolItem = {}.fromkeys(['schoolId', 'schoolName'],'')
                schoolItem['schoolId'] = item.school_id
                schoolItem['schoolName'] = item.school_name
                school_list.append(schoolItem)
                i = i + 1
                
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count', 'schools'])
            
            data['schools'] = school_list
            data['count'] = len(school_list)
            response['no'] = 0
            response['data'] = data
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
            
            
    
    @staticmethod
    def addAllFollowing():
        session_warehouse = Session()
        session_warehouse.execute("set search_path to 'warehouse'")
        
        org_key_list = []
        db_org_key_list = session_warehouse.query(Stock.org_key).all()
        for item in db_org_key_list:
            if item[0] not in org_key_list:
                org_key_list.append(item[0])
            else:
                pass
        
        for item in org_key_list:
            org_list = session_warehouse.query(Organization).filter(Organization.org_key == item).all()
            org = org_list[0]
            
            id = org.org_key
            name = org.org_name
            shortName = org.org_short_name if org.org_short_name != None else ""
            englishName = org.org_english_name if org.org_english_name != None else ""
            englishNameAbbr = org.org_english_name_abbr if org.org_english_name_abbr != None else ""
            
            import requests
            import json
            url = 'http://192.168.30.47:8080/ekb/watchList/company'
            payload = {'id': id, 'name': name, 'shortName': shortName,'englishName': englishName, 'englishNameAbbr': englishNameAbbr}
            headers = {'content-type': 'application/json'}
            r = requests.post(url, data=json.dumps(payload), headers=headers)
            print r.text    
        
        
    @staticmethod
    def getBaseInfo(userId):
        session = Session()
        session.execute("set search_path to 'neican'")
        
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['accountInfo', 'contactInfo'],'')
            user_list = session.query(User).filter(User.user_id == userId).all()
            if len(user_list) > 0:
                accountInfo = {}.fromkeys(['accountId', 'password'],'')
                
                email_account_list = session.query(User_email).filter(User_email.is_logon == True, User_email.is_primary == True, User_email.email_type == 5, User_email.user_id == userId).all()
                if len(email_account_list) > 0:
                    accountInfo['accountId'] = email_account_list[0].email
                else:
                    pass
                
                accountInfo['password'] = user_list[0].password
                
                contactInfo = {}.fromkeys(['name','gender','currentWorkInfo','birthday','mobilePhone', 'officePhone', 'personalEmail', 'officeEmail', 'fax','address'],'')
                
                contactInfo['name'] = user_list[0].name
                contactInfo['gender'] = user_list[0].gender if user_list[0].gender != None else ""
                contactInfo['birthday'] = user_list[0].date_of_birth if user_list[0].date_of_birth != None else ""
                
                current_work_list = session.query(User_work_history).filter(User_work_history.is_current == True, User_work_history.user_id == userId).all() 
                currentWorkInfo = {}.fromkeys(['workHistoryId','orgName', 'department', 'jobPosition'])
                if len(current_work_list) > 0:
                    item = current_work_list[0]
                    currentWorkInfo['workHistoryId'] = item.user_work_history_id
                    currentWorkInfo['orgName'] = item.org_name
                    currentWorkInfo['department'] = item.jobPosition.department.dept_name
                    currentWorkInfo['jobPosition'] = item.jobPosition.job_position_name
                    
                    contactInfo['currentWorkInfo'] = currentWorkInfo
                
                mobile_phone_list = session.query(User_phone).filter(User_phone.phone_type == 7, User_phone.user_id == userId).all()
                mobilePhone = {}.fromkeys(['phoneId','phoneNum', 'isLogon'],'')
                if len(mobile_phone_list) > 0:
                    item = mobile_phone_list[0]
                    mobilePhone['phoneId'] = item.user_phone_id
                    mobilePhone['phoneNum'] = item.phone_number
                    mobilePhone['isLogon'] = item.is_logon
                        
                    contactInfo['mobilePhone'] = mobilePhone
                
                office_phone_list = session.query(User_phone).filter(User_phone.phone_type == 9, User_phone.user_id == userId).all()
                officePhone = {}.fromkeys(['phoneId','phoneNum', 'isLogon'],'')
                if len(office_phone_list) > 0:
                    item = office_phone_list[0]
                    officePhone['phoneId'] = item.user_phone_id
                    officePhone['phoneNum'] = item.phone_number
                    officePhone['isLogon'] = item.is_logon
                        
                    contactInfo['officePhone'] = officePhone
                
                personal_email_list = session.query(User_email).filter(User_email.email_type == 5, User_email.user_id == userId).all()
                personalEmail = {}.fromkeys(['emailId','email', 'isLogon'],'')
                if len(personal_email_list) > 0:
                    item = personal_email_list[0]
                    personalEmail['emailId'] = item.user_email_id
                    personalEmail['email'] = item.email
                    personalEmail['isLogon'] = item.is_logon
                        
                    contactInfo['personalEmail'] = personalEmail
                
                
                office_email_list = session.query(User_email).filter(User_email.email_type == 6, User_email.user_id == userId).all()
                officeEmail = {}.fromkeys(['emailId','email', 'isLogon'],'')
                if len(office_email_list) > 0:
                    item = office_email_list[0]
                    officeEmail['emailId'] = item.user_email_id
                    officeEmail['email'] = item.email
                    officeEmail['isLogon'] = item.is_logon
                        
                    contactInfo['officeEmail'] = officeEmail
                
                
                fax_list = session.query(User_phone).filter(User_phone.phone_type == 10, User_phone.user_id == userId).all()
                fax = {}.fromkeys(['phoneId','phoneNum', 'isLogon'],'')
                if len(fax_list) > 0:
                    item = fax_list[0]
                    fax['phoneId'] = item.user_phone_id
                    fax['phoneNum'] = item.phone_number
                    fax['isLogon'] = item.is_logon
                        
                    contactInfo['fax'] = fax
                
                address_list = user_list[0].addresses
                address = {}.fromkeys(['addressId','address'],'')
                if len(address_list) > 0:
                    item = address_list[0]
                    address['addressId'] = item.user_address_id
                    address['address'] = item.mail_address
                        
                    contactInfo['address'] = address
                        
                data['contactInfo'] = contactInfo
                data['accountInfo'] = accountInfo
                
            response['data'] = data
            response['no'] = 0
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
            
            
    
    @staticmethod
    def addBaseInfo(userId, jsonInfo):
        session = Session()
        session.execute("set search_path to 'neican'")
        
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            
            contactInfo = jsonInfo['data']['contactInfo']
            accountInfo = jsonInfo['data']['accountInfo']
            
            name = contactInfo['name']
            gender = contactInfo['gender']
            birthday = contactInfo['birthday']
            mobilePhone = contactInfo['mobilePhone']
            officePhone = contactInfo['officePhone']
            fax = contactInfo['fax']
            address = contactInfo['address']
            personalEmail = contactInfo['personalEmail']
            officeEmail = contactInfo['officeEmail']
            
            accountId = accountInfo['accountId']
            password = accountInfo['password']
            
            user_list = session.query(User).filter(User.user_id == userId).all()
            user_list[0].name = name
            user_list[0].gender = gender
            if birthday != "":
                user_list[0].date_of_birth = datetime.strptime(birthday, "%Y-%m-%d")
            
            session.commit()
            
            if personalEmail == "":
                pass
            else:
                if personalEmail['emailId'] != "":
                    emailId = personalEmail['emailId']
                    email_list = session.query(User_email).filter(User_email.user_email_id == emailId).all()
                    if len(email_list) > 0:
                        email_list[0].email = personalEmail['email']
                        email_list[0].is_logon = personalEmail['isLogon']
                        session.commit()
                else:
                    user_email = User_email(userId, 5, personalEmail['email'], False, personalEmail['isLogon'], 'system', str(datetime.now()), 'system', str(datetime.now()))
                    session.add(user_email)
                    session.commit()
            
            if officeEmail == "":
                pass
            else:
                if officeEmail['emailId'] != "":
                    emailId = officeEmail['emailId']
                    email_list = session.query(User_email).filter(User_email.user_email_id == emailId).all()
                    if len(email_list) > 0:
                        email_list[0].email = officeEmail['email']
                        email_list[0].is_logon = officeEmail['isLogon']
                        session.commit()
                else:
                    user_email = User_email(userId, 6, personalEmail['email'], False, personalEmail['isLogon'], 'system', str(datetime.now()), 'system', str(datetime.now()))
                    session.add(user_email)
                    session.commit()
            
            if officePhone == "":
                pass
            else:
                if officePhone['phoneId'] != "":
                    userPhoneId = officePhone['phoneId']
                    phone_list = session.query(User_phone).filter(User_phone.user_phone_id == userPhoneId).all()
                    if len(phone_list) > 0:
                        phone_list[0].phone_number = officePhone['phoneNum']
                        phone_list[0].is_logon = officePhone['isLogon']
                        session.commit()
                else:
                    office_phone = User_phone(userId, 9, mobilePhone['phoneNum'], False, mobilePhone['isLogon'], 'system', str(datetime.now()), 'system', str(datetime.now()))
                    session.add(office_phone)
                    session.commit()
                
            if mobilePhone == "":
                pass
            else:
                if mobilePhone['phoneId'] != "":
                    userPhoneId = mobilePhone['phoneId']
                    phone_list = session.query(User_phone).filter(User_phone.user_phone_id == userPhoneId).all()
                    if len(phone_list) > 0:
                        phone_list[0].phone_number = mobilePhone['phoneNum']
                        phone_list[0].is_logon = mobilePhone['isLogon']
                        session.commit()
                else:
                    mobile_phone = User_phone(userId, 7, mobilePhone['phoneNum'], False, mobilePhone['isLogon'], 'system', str(datetime.now()), 'system', str(datetime.now()))
                    session.add(mobile_phone)
                    session.commit()
                
            if fax == "":
                pass
            else:
                if fax['phoneId'] != "":
                    userPhoneId = fax['phoneId']
                    phone_list = session.query(User_phone).filter(User_phone.user_phone_id == userPhoneId).all()
                    if len(phone_list) > 0:
                        phone_list[0].phone_number = fax['phoneNum']
                        phone_list[0].is_logon = fax['isLogon']
                        session.commit()
                else:
                    fax = User_phone(userId, 10, mobilePhone['phoneNum'], False, mobilePhone['isLogon'], 'system', str(datetime.now()), 'system', str(datetime.now()))
                    session.add(fax)
                    session.commit()
        
        
            if address == "":
                pass
            else:
                if address['addressId'] != "":
                    assressId = address['addressId']
                    address_list = session.query(User_address).filter(User_address.user_address_id == assressId).all()
                    if len(address_list) > 0:
                        address_list[0].mail_address = address['address']
                        session.commit()
                else:
                    user_address = User_address(userId, "China", None, None, None, None, address['address'], None, 'system', str(datetime.now()), 'system', str(datetime.now()))
                    session.add(user_address)
                    session.commit()
            
            response['no'] = 0
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
    
    
    @staticmethod
    def getRecentView(userId):
        session_neican = Session()
        session_neican.execute("set search_path to 'neican'")
        session_warehouse = Session()
        session_warehouse.execute("set search_path to 'warehouse'")
        
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['viewInfo'], '')
            viewInfo = []
            
            audit_list = session_neican.query(User_audit).filter(User_audit.user_id == userId).all()
            audit_list.sort(lambda x,y: cmp(x.log_create_time, y.log_create_time))
            if len(audit_list) > 11:
                l = len(audit_list)
                i = l - 1
                while i > l - 11:
                    audit_item = audit_list[i]

                    auditItem = {}.fromkeys(['key','type','name','logCreateTime'],'')
                    if audit_item.person_key != None:
                        employment_fact_list = session_warehouse.query(Person_employment_fact).filter(Person_employment_fact.person_employment_fact_key == audit_item.person_key).all()
                        person_key = employment_fact_list[0].person_key
                        person_list = session_warehouse.query(Person).filter(Person.person_key == person_key).all()
                        
                        auditItem['key'] = audit_item.person_key
                        auditItem['type'] = 'person'
                        auditItem['name'] = person_list[0].name
                        auditItem['logCreateTime'] = audit_item.log_create_time
                        
                        viewInfo.append(auditItem) 
                    elif audit_item.org_key != None:
                        org_list = session_warehouse.query(Organization).filter(Organization.org_key == audit_item.org_key).all()
                        
                        auditItem['key'] = audit_item.org_key
                        auditItem['type'] = 'company'
                        auditItem['name'] = org_list[0].org_name
                        auditItem['logCreateTime'] = audit_item.log_create_time
                        
                        viewInfo.append(auditItem) 
                    else:
                        pass
                    i = i - 1
            elif len(audit_list) > 0 and len(audit_list) < 11:
                l = len(audit_list)
                i = l - 1
                while i >= 0:
                    audit_item = audit_list[i]

                    auditItem = {}.fromkeys(['key','type','name','logCreateTime'],'')
                    if audit_item.person_key != None:
                        employment_fact_list = session_warehouse.query(Person_employment_fact).filter(Person_employment_fact.person_employment_fact_key == audit_item.person_key).all()
                        person_key = employment_fact_list[0].person_key
                        person_list = session_warehouse.query(Person).filter(Person.person_key == person_key).all()
                        
                        auditItem['key'] = audit_item.person_key
                        auditItem['type'] = 'person'
                        auditItem['name'] = person_list[0].name
                        auditItem['logCreateTime'] = audit_item.log_create_time
                        
                        viewInfo.append(auditItem) 
                    elif audit_item.org_key != None:
                        org_list = session_warehouse.query(Organization).filter(Organization.org_key == audit_item.org_key).all()
                        
                        auditItem['key'] = audit_item.org_key
                        auditItem['type'] = 'company'
                        auditItem['name'] = org_list[0].org_name
                        auditItem['logCreateTime'] = audit_item.log_create_time
                        
                        viewInfo.append(auditItem) 
                    else:
                        pass
                    i = i - 1
                
            
            data['viewInfo'] = viewInfo
            response['data'] = data
            response['no'] = 0 
            
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            session_neican.rollback()
            session_warehouse.rollback()
            raise
        finally:
            session_neican.close()
            session_warehouse.close()
    
    @staticmethod
    def send_mail_forgot_code(account):
        """email forgot will send code with 6 chars
        """
        response = {}.fromkeys(['no', 'errMsg', 'data'],'')
        mailActivateCode = DLUserManager.create_mailCode(6)
        
        content = u"亲爱的"+account+"<br><br><br>"+u"欢迎使用脉拓召找回密码功能。"+"\
                 <br><br><br>"+u"您此次找回密码的验证码是："+mailActivateCode+u"请在找回密码页填入此验证码。"+"\
                 <br><br><br>"+u"如果您并未发过此请求，则可能是因为其他用户在尝试重设密码时误输入了您的电子邮件地址而使您收到这封邮件，那么您可以放心的忽略此邮件，无需进一步采取任何操作。"
                         
        DLUserManager.send_mailCode(account, '密码找回', content)
        
        session = Session()
        session.execute("set search_path to 'neican'")
        user_list = session.query(User).join(User_email, User.user_id == User_email.user_id).filter(User_email.email == account, User.is_activated == True).all()
        if len(user_list)>0:
            user_id = user_list[0].user_id
            try:
                r = create_redis(db=REDIS_PWD_FORGOT_DB)
                pwdcode_key = "pwdcode:" + str(user_id)
                r.set(pwdcode_key, mailActivateCode)
            except:
                raise
            finally:
                pass
        
        response['no'] = 0
        response = jsonpickle.encode(response, unpicklable=False)
        return response
        
    @staticmethod
    def verify_mail_forgot_code(forgot_code, account):
        response = {}.fromkeys(['no', 'errMsg', 'data'],'')
        session = Session()
        session.execute("set search_path to 'neican'")
        user_list = session.query(User).join(User_email, User.user_id == User_email.user_id).filter(User_email.email == account, User.is_activated == True).all()
        if len(user_list)>0:
            user_id = user_list[0].user_id
            pwdcode_key = "pwdcode:" + str(user_id)
            r = create_redis(db=REDIS_PWD_FORGOT_DB)
            pwd_code = r.get(pwdcode_key)
            
            if forgot_code == pwd_code:
                response['no'] = 0
            else:
                response['no'] = 1
                
        response = jsonpickle.encode(response, unpicklable=False)        
        return response
    
    @staticmethod
    def reset_password(account, password):
        session = Session()
        session.execute("set search_path to 'neican'")
        
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            if account.find('@') == -1:
                user_list = session.query(User).join(User_phone, User.user_id == User_phone.user_id).filter(User.is_activated == True, User_phone.phone_number == account, User_phone.is_logon == True).all()
            else:
                user_list = session.query(User).join(User_email, User.user_id == User_email.user_id).filter(User_email.email == account, User.is_activated == True).all()
            
            if len(user_list)>0:
                dl_password = DLUserManager.encrypt_md5(password)
                user_list[0].password = dl_password
                session.commit()
            
            response['no'] = 0
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        except:
            session.rollback()
            raise
        finally:
            session.close()
    
    @staticmethod
    def send_phone_forgot_code(account):
        """phone forgot will send code with 6 chars
        """
        response = {}.fromkeys(['no', 'errMsg', 'data'],'')
        
        phoneActivateCode = DLUserManager.create_phoneCode()
                
        message = u'脉拓网验证码为: '+phoneActivateCode
        DLUserManager.send_phoneCode(account, message)
        
        session = Session()
        session.execute("set search_path to 'neican'")
        user_list = session.query(User).join(User_phone, User.user_id == User_phone.user_id).filter(User.is_activated == True, User_phone.phone_number == account, User_phone.is_logon == True).all()
        if len(user_list)>0:
            user_id = user_list[0].user_id
        
            r = create_redis(db=REDIS_PWD_FORGOT_DB)
            pwdcode_key = "pwdcode:" + str(user_id)
            r.set(pwdcode_key, phoneActivateCode)
            response['no'] = 0
            
        response = jsonpickle.encode(response, unpicklable=False) 
    
    @staticmethod
    def verify_phone_forgot_code(forgot_code, account):
        response = {}.fromkeys(['no', 'errMsg', 'data'],'')
        session = Session()
        session.execute("set search_path to 'neican'")
        user_list = session.query(User).join(User_phone, User.user_id == User_phone.user_id).filter(User.is_activated == True, User_phone.phone_number == account, User_phone.is_logon == True).all()
        if len(user_list)>0:
            user_id = user_list[0].user_id
            pwdcode_key = "pwdcode:" + str(user_id)
            r = create_redis(db=REDIS_PWD_FORGOT_DB)
            pwd_code = r.get(pwdcode_key)
            
            if forgot_code == pwd_code:
                response['no'] = 0
            else:
                response['no'] = 1
                
        response = jsonpickle.encode(response, unpicklable=False)        
        return response
    
    
class DLGroupManager(object):
    """All of the groups contains different types of organization,
       user can defined customed group and system will show default
       groups also.
    """
    @staticmethod
    def get_system_group_list():
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count','groups'],'')
            sys_group_list_db = session.query(Public_org_group).all()
            session.commit()
            
            sys_group_list = []
            if len(sys_group_list_db) > 0:
                for item in sys_group_list_db:
                    group_item = {}.fromkeys(['groupId','groupName','groupDesc'],'')
                    
                    group_item['groupId'] = item.public_org_group_key
                    group_item['groupName'] = item.public_org_group_name
                    group_item['groupDesc'] = item.public_org_group_desc if item.public_org_group_desc != None else ""
                    
                    sys_group_list.append(group_item)
            
            data['count'] = len(sys_group_list)
            data['groups'] = sys_group_list
            
            response['data'] = data
            response['no'] = 0
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close()
    
    @staticmethod
    def get_org_list_by_sysgroup(group_id, page_num):
        session = Session()
        session.execute("set search_path to 'warehouse'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count', 'pageNum','companies'],'')
            sysgroup_org_list_db = session.query(Public_org_group_dtl).filter(Public_org_group_dtl.public_org_group_key == group_id)[10*(page_num-1):(10*page_num)]
            session.commit()
            
            org_list = []
            if len(sysgroup_org_list_db) > 0:
                for item in sysgroup_org_list_db:
                    org_list_db = session.query(Organization).filter(Organization.org_key == item.org_key).all()
                    org_item_db = org_list_db[0]
                    
                    org_item = {}.fromkeys(['companyName', 'companyId', 'revenue', 'numberOfEmployees','province','city','orgStatus','licenseNum','regType','address','inChargePerson'],'')
                    
                    org_item['province'] = org_item_db.registeredAddress.province
                    org_item['city'] = org_item_db.registeredAddress.city
                    org_item['companyName'] = org_item_db.org_name
                    org_item['companyId'] = org_item_db.org_key
                    org_item['revenue'] = org_item_db.revenue if org_item_db.revenue != None else ""
                    org_item['numberOfEmployees'] = org_item_db.org_size
                    org_item['orgStatus'] = org_item_db.orgStatus.org_status
                    org_item['licenseNum'] = org_item_db.license_number
                    org_item['regType'] = org_item_db.orgRegType.org_reg_type
                    org_item['address'] = org_item_db.registeredAddress.mail_address
                    org_item['inChargePerson'] = org_item_db.inChargePerson.name
            
                    org_list.append(org_item)
            
            data['count'] = len(org_list)
            data['pageNum'] = page_num
            data['companies'] = org_list
            
            response['data'] = data
            response['no'] = 0
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close()
    
    @staticmethod
    def get_user_group_list(user_id):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            data = {}.fromkeys(['count','groups'],'')
            user_group_list_db = session.query(User_org_group).filter(User_org_group.user_id == user_id, User_org_group.user_org_grp_status == 11).all()
            session.commit()
            
            user_group_list = []
            if len(user_group_list_db) > 0:
                for item in user_group_list_db:
                    group_item = {}.fromkeys(['groupId','groupName','groupDesc'],'')
                    
                    group_item['groupId'] = item.org_group_id
                    group_item['groupName'] = item.group.org_group_name
                    group_item['groupDesc'] = item.group.org_group_desc
                    user_group_list.append(group_item)
            
            data['count'] = len(user_group_list)
            data['groups'] = user_group_list
            
            response['data'] = data
            response['no'] = 0
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close()
    
    @staticmethod
    def add_user_group(user_id, group_json):  
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            
            group_name = group_json['groupName']
            group_desc = group_json['groupDesc']
            created_by = str(user_id)
            create_date = datetime.now()
            
            user_group_list = session.query(User_org_group).join(Org_group, User_org_group.org_group_id == Org_group.org_group_id).filter(Org_group.org_group_name == group_name, User_org_group.user_id == user_id).all()
            if len(user_group_list) > 0:
                if user_group_list[0].user_org_grp_status == 12:
                    user_group_list[0].user_org_grp_status = 11
                    session.commit()
                    response['no'] = 0
                else:
                    response['no'] = 1
                    response['errMsg'] = 'already in system'
            else:
                org_group_db = Org_group(group_name, group_desc, created_by, create_date)
                session.add(org_group_db)
                session.commit()
            
                user_org_group_db = User_org_group(user_id, org_group_db.org_group_id, 11, created_by, create_date)
                session.add(user_org_group_db)
                session.commit()
                
                response['no'] = 0
            
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close()
    
    @staticmethod
    def remove_user_group(user_id, org_group_id):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            """update the status of this user_org_group to invalid
            """
            u_group_list = session.query(User_org_group).filter(User_org_group.org_group_id == org_group_id, User_org_group.user_id == user_id).all()
            if len(u_group_list) > 0:
                u_group_list[0].user_org_grp_status = 12
                session.commit()
            
            response['no'] = 0
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close()      
    
    @staticmethod
    def update_user_group(org_group_id, group_json):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            
            org_group_list = session.query(Org_group).filter(Org_group.org_group_id == org_group_id).all()
            if len(org_group_list) > 0:
                org_group_list[0].org_group_name = group_json['groupName']
                org_group_list[0].org_group_desc = group_json['groupDesc']
                session.commit() 
            
            
            response['no'] = 0
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close() 
    
    @staticmethod
    def get_org_list_by_group(in_group_id, in_page_num):
        try:
            response = {}.fromkeys(['no','errMsg','data'],'')
            data = {}.fromkeys(['count', 'pageNum','companies'],'')
            
            
            in_group_id = str(in_group_id) if str(in_group_id) != "" else "NULL" 
            in_page_num = str(in_page_num) if str(in_page_num) != "" else "NULL" 

            import psycopg2
            conn_string = "host='192.168.30.173' dbname='yunti' user='ws_dblayer' password='progress*2013'"
            conn = psycopg2.connect(conn_string)
            cursor = conn.cursor()
            sql_str = "select warehouse.qry_user_group_orgs("+in_group_id+","+in_page_num+")"
            cursor.execute(sql_str)
            sql_result = cursor.fetchall()
            conn.close()
            sql_result =  sql_result[0][0]
            sql_result = json.loads(sql_result)

            org_list = []
            if len(sql_result['results']) > 0:
                for item in sql_result['results']:
                    org_item = {}.fromkeys(['companyName', 'companyId', 'revenue', 'numberOfEmployees','province','city','orgStatus','licenseNum','regType','address','inChargePerson'],'')
                    org_item['province'] = item['province'] 
                    org_item['city'] = item['city']
                    org_item['companyName'] = item['org_name']
                    org_item['companyId'] = item['org_key']
                    org_item['revenue'] = item['revenue'] if item['revenue'] != "-1" else ""
                    org_item['numberOfEmployees'] = item['org_size'] if item['org_size'] != "-1" else ""
                    org_item['orgStatus'] = item['org_status']
                    org_item['licenseNum'] = item['license_number']
                    org_item['regType'] = item['org_reg_type']
                    org_item['address'] = item['mail_address']
                    org_item['inChargePerson'] = item['in_charge_person']
                    
                    org_list.append(org_item)
            
            if sql_result.has_key('count'):
                data['count'] = sql_result['count']
            
            data['pageNum'] = in_page_num
            data['companies'] = org_list
            
            response['no'] = 0
            response['data'] = data
            
            result = jsonpickle.encode(response, unpicklable=False)
            return result
        except:
            raise
        finally:
            pass 
    
    @staticmethod
    def add_user_group_org(org_group_id, org_key):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            
            org_group_detail_item = Org_group_detail(org_group_id, org_key, "system", datetime.now())
            session.add(org_group_detail_item)
            session.commit()
            
            response['no'] = 0
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close() 
    
    @staticmethod
    def del_user_group_org(org_group_id, org_key):
        session = Session()
        session.execute("set search_path to 'neican'")
        try:
            response = {}.fromkeys(['no', 'errMsg', 'data'],'')
            
            session.query(Org_group_detail).filter(Org_group_detail.org_group_id == org_group_id, Org_group_detail.org_key == org_key).delete()
            session.commit()
            
            response['no'] = 0
            return jsonpickle.encode(response, unpicklable=False)
        except:
            session.rollback()
            raise
        finally:
            session.close() 
    
    
    
    
    
        
        
        
            
    
    
    
    
    
    
    
        
    
        
            
