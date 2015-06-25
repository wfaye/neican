'''
Created on Feb 25, 2013

@author: lyb
'''

from contacts.contact import Contact
from sqlalchemy import MetaData
from sqlalchemy.engine import create_engine
from sqlalchemy.orm import mapper
from sqlalchemy.orm.session import sessionmaker
from sqlalchemy.schema import Table, Column, Sequence
from sqlalchemy.types import Integer, String

metadata = MetaData()
engine = create_engine('postgresql+psycopg2://openpg:@localhost/testdb', echo=True)
Session = sessionmaker(bind=engine)

        
contact = Table('contacts', metadata,
                Column('id', Sequence, primary_key=True),
                Column('name', String(50)),
                Column('email', String(100)),
                Column('tel', String(20)))

mapper(Contact, contact)

session = Session()

class proxy_db():
    def _init__(self):
        self.session = Session()
        
    def getContactList(self):
        contactlist = session.query(Contact.name).all();
        return contactlist
    
class Address(object):
    def __init__(self, address_key, data_loaded_date, data_loader, country, province, city,
                 county, district, mail_address, zipcode, post_office_box, latitude, longitude):
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
        
address = Table('address', metadata,
                Column('address_key', Integer, nullable = False, primary_key = True),
                Column('data_loaded_date', DateTime, nullable = False),
                Column('data_loader', String(50), nullable = False),
                Column('country', String(25), nullable = False),
                Column('province', String(25)),
                Column('city', String(50)),
                Column('county', String(50)),
                Column('district', String(50)),
                Column('mail_address', String(100)),
                Column('zipcode', String(10)),
                Column('post_office_box', String(10)),
                Column('latitude', String(30)),
                Column('longitude', String(30)))

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
        
        
calendar_date = Table('calendar_date', metadata,
                Column('calendar_date_key', Numeric(8), nullable = False, primary_key = True),
                Column('year_date', Date, nullable = False),
                Column('year', Numeric(4), nullable = False),
                Column('quarter_date', Date, nullable = False),
                Column('quarter', Numeric(1),nullable = False),
                Column('month_date', Date,nullable = False),
                Column('month', Numeric(2),nullable = False),
                Column('month_name', String(10),nullable = False),
                Column('sunday_week_date', Date,nullable = False),
                Column('sunday_week', Numeric(2),nullable = False),
                Column('monday_week_date', Date,nullable = False),
                Column('monday_week', Numeric(2),nullable = False),
                Column('week_in_month', Numeric(1),nullable = False),
                Column('julian_week_numeric', Numeric(2),nullable = False),
                Column('julian_day', Numeric(3),nullable = False),
                Column('day_date', Date,nullable = False),
                Column('day_name', String(10),nullable = False),
                Column('holiday_flag', String(1)),
                Column('holiday_name', String(25)))

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

        
currency = Table('currency', metadata,
                Column('currency_key', Integer, nullable = False, primary_key = True),
                Column('data_loaded_date', DateTime, nullable = False),
                Column('data_loader', String(20), nullable = False),
                Column('currency_name', String(25), nullable = False),
                Column('discription', String(256)),
                Column('currency_sign', String(3), nullable = False),
                Column('exchange_rate', Numeric(5,2)))

mapper(Currency, currency)



class Data_source(object):
    def __init__(self, data_source_key, data_source_name, data_loaded_date, data_loader, data_source_desc):
        self.data_source_key = data_source_key 
        self.data_source_name = data_source_name
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.data_source_desc = data_source_desc

        
data_source = Table('data_source', metadata,
                Column('data_source_key', Integer, nullable = False, primary_key = True),
                Column('data_loaded_date', DateTime, nullable = False),
                Column('data_source_name', String(25)), nullable = False),
                Column('data_loader', String(20), nullable = False),
                Column('data_source_desc', String(256)))

mapper(Data_source, data_source)



class Industry_class(object):
    def __init__(self, industry_class_key, data_loaded_date, data_loader, industry_class_name, intusrty_class_desc):
        self.industry_class_key = industry_class_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.industry_class_name = industry_class_name
        self.intusrty_class_desc = intusrty_class_desc

        
industry_class = Table('industry_class', metadata,
                Column('industry_class_key', Integer, nullable = False, primary_key = True),
                Column('data_loaded_date', DateTime, nullable = False),
                Column('data_loader', String(50), nullable = False),
                Column('industry_class_name', String(50), nullable = False),
                Column('intusrty_class_desc', String(256), nullable = False))

mapper(Industry_class, industry_class)


class Org_registration_type(object):
    def __init__(self, org_reg_type_key, data_loaded_date, data_loader, org_reg_type, discription):
        self.org_reg_type_key = org_reg_type_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.org_reg_type = org_reg_type
        self.discription = discription

        
org_registration_type = Table('org_registration_type', metadata,
                Column('org_reg_type_key', Integer, nullable = False, primary_key = True),
                Column('data_loaded_date', DateTime, nullable = False),
                Column('data_loader', String(20)),
                Column('org_reg_type', String(25), nullable = False),
                Column('discription', String(256)))

mapper(Org_registration_type, org_registration_type)


class Org_status(object):
    def __init__(self, org_status_key, data_loaded_date, data_loader, org_status, discription):
        self.org_reg_type_key = org_reg_type_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.org_status = org_status
        self.discription = discription

        
org_status = Table('org_status', metadata,
                Column('org_status_key', Integer, nullable = False, primary_key = True),
                Column('data_loaded_date', DateTime, nullable = False),
                Column('data_loader', String(20), nullable = False),
                Column('org_status', String(25), nullable = False),
                Column('discription', String(256)))

mapper(Org_status, org_status)



class Person(object):
    def __init__(self, person_key, data_loaded_date, data_loader, effective_start_date, name, first_name, last_name,
                 nick_name, gender, email1, email2, office_phone, mobile_phone, fax, birth_date_key, image):
        self.person_key = person_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.effective_start_date = effective_start_date
        self.name = name
        self.first_name = first_name
        self.last_name = last_name 
        self.nick_name = nick_name
        self.gender = gender
        self.email1 = email1
        self.email2 = email2
        self.office_phone = office_phone 
        self.mobile_phone = mobile_phone
        self.fax = fax
        self.birth_date_key = birth_date_key
        self.image = image

        
person = Table('person', metadata,
                Column('person_key', Integer, nullable = False, primary_key = True),
                Column('data_loaded_date', DateTime, nullable = False),
                Column('data_loader', String(50)), nullable = False),
                Column('effective_start_date', Date, nullable = False),
                Column('name', String(25), nullable = False),
                Column('first_name', String(25), nullable = False),
                Column('last_name', String(25), nullable = False),
                Column('nick_name', String(50), nullable = False),
                Column('gender', String(2), nullable = False),
                Column('email1', String(50), nullable = False),
                Column('email2', String(50), nullable = False),
                Column('office_phone', String(20), nullable = False),
                Column('mobile_phone', String(20), nullable = False),
                Column('fax', String(20), nullable = False),
                Column('birth_date_key', Integer, nullable = False),
                Column('image', nullable = False))

mapper(Person, person)





class Organization(object):
    def __init__(self, org_key, data_loaded_date, data_loader, effective_start_date, org_name, org_short_name,
                 org_start_date, org_english_name, org_english_name_abbr, 
                 org_website, industry_key_words, in_charge_person_key, contact_person_key, main_phone_num, 
                 registered_capital, capital_currency_key, registered_address_key, core_business, org_status_key, 
                 license_number, org_code, data_source_key):
        self.org_key = org_key 
        self.data_loaded_date = data_loaded_date
        self.data_loader = data_loader
        self.effective_start_date = effective_start_date
        self.org_name = org_name
        self.org_short_name = org_short_name
        self.org_english_name = org_english_name
        self.org_english_name_abbr = org_english_name_abbr        
        self.org_start_date = org_start_date
        self.org_website = org_website 
        self.data_loaded_date = data_loaded_date
        self.industry_key_words = industry_key_words
        self.in_charge_person_key = in_charge_person_key
        self.contact_person_key = contact_person_key
        self.main_phone_num = main_phone_num
        self.capital_currency_key = capital_currency_key 
        self.registered_address_key = registered_address_key
        self.core_business = core_business
        self.org_status_key = org_status_key
        self.license_number = license_number
        self.org_code = org_code 
        self.data_source_key = data_source_key
        


        
organization = Table('organization', metadata,
                Column('org_key', Integer, nullable = False, primary_key = True),
                Column('data_loaded_date', DateTime, nullable = False),
                Column('data_loader', String(20), nullable = False),
                Column('effective_start_date', DateTime, nullable = False),
                Column('org_name', String(250), nullable = False),
                Column('org_short_name', String(50), nullable = False),
                Column('org_english_name', String(250), nullable = False),
                Column('org_english_name_abbr', String(50), nullable = False),
                Column('org_start_date', Date, nullable = False),
                Column('industry_class_key', Integer, nullable = False, Foreign_key('industry_class.industry_class_key')),
                Column('org_website', String(250), nullable = False),
                Column('industry_key_words', Text, nullable = False),
                Column('in_charge_person_key', Integer, nullable = False, Foreign_key('person.person_key')),
                Column('contact_person_key', Integer, nullable = False, Foreign_key('person.person_key')),
                Column('main_phone_num', String(20), nullable = False),
                Column('registered_capital', Numeric(12,2), nullable = False),
                Column('capital_currency_key', Integer, nullable = False, Foreign_key('currency.currency_key')),
                Column('registered_address_key', Integer, nullable = False, Foreign_key('address.address_key')),
                Column('core_business', Text, nullable = False),
                Column('org_status_key', Integer, nullable = False),
                Column('license_number', String(30), nullable = False),
                Column('org_code', String(30), nullable = False),
                Column('data_source_key', Integer, nullable = False, Foreign_key('data_source.data_source_key')))

mapper(Organization, organization)





class Org_gong_shang_fact(object):
    def __init__(self, org_gong_shang_fact_key, data_loaded_date, data_loader, effective_start_date, org_key, org_name,
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
        self.org_name = org_name
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
        

        
org_gong_shang_fact = Table('org_gong_shang_fact', metadata,
                Column('org_gong_shang_fact_key', Integer, nullable = False, primary_key = True),
                Column('data_loaded_date', DateTime, nullable = False),
                Column('data_loader', String(50), nullable = False),
                Column('effective_start_date', Date, nullable = False),
                Column('org_key', Integer, nullable = False, Foreign_key('organization.org_key')),
                Column('org_name', String(250), nullable = False),
                Column('org_start_date_key', Integer, nullable = False, Foreign_key('calendar_date.calendar_date_key')),
                Column('in_charge_person_key', Integer, nullable = False, Foreign_key('person.person_key')),
                Column('main_phone_num', String(20), nullable = False),
                Column('registered_capital', Numeric(12,2), nullable = False),
                Column('capital_currency_key', Integer, nullable = False, Foreign_key('currency.currency_key')),
                Column('registered_address_key', Integer, nullable = False, Foreign_key('address.address_key')),
                Column('core_business', Text, nullable = False),
                Column('org_status_key', Integer, nullable = False, Foreign_key('org_status.org_status_key')),
                Column('license_number', String(30), nullable = False),
                Column('org_code', String(30), nullable = False),
                Column('org_reg_type_key', Integer, nullable = False, Foreign_key('org_registration.org_reg_type_key')),
                Column('admin_district', String(250)), nullable = False),
                Column('reg_bureau', String(150), nullable = False),
                Column('annual_inspection_year', String(10), nullable = False),
                Column('annual_inspection_result', String(25), nullable = False),
                Column('license_inspection_year', String(10)), nullable = False),
                Column('license_inspection_result', String(25), nullable = False),
                Column('operator_key', Integer, nullable = False, Foreign_key('person.person_key')),
                Column('place_of_business', String(150), nullable = False),
                Column('operation_start_date_key', Integer, nullable = False, Foreign_key('calendar_date.calendar_date_key')),
                Column('operation_end_date_key', Integer, nullable = False, Foreign_key('calendar_date.calendar_date_key')),
                Column('canceled_date_key', Integer, nullable = False, Foreign_key('calendar_date.calendar_date_key')),
                Column('license_issue_date_key', Integer, nullable = False, Foreign_key('calendar_date.calendar_date_key')),
                Column('license_revoke_date_key', Integer, nullable = False, Foreign_key('calendar_date.calendar_date_key')),
                Column('biz_structure_desc', String(500)), nullable = False),
                Column('data_source_key', Integer, nullable = False), Foreign_key('data_source.data_source_key'))

mapper(Org_gong_shang_fact, org_gong_shang_fact)



    


