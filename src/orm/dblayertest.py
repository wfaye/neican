# -*- coding: utf-8 -*-
'''
Created on April 06, 2013

@author: wpz
'''

from orm import dblayer


def test_getOrgOverview():
    result = dblayer.DLIVManager.getCompanyOverview(1)    
    print result
    
    
def test_getwatchlistinfo():
    result = dblayer.DLIVManager.getWatchlistInfo(26)
    print result
    
def test_send_mail_forgot_code():
    result = dblayer.DLUserManager.send_mail_forgot_code("526662774@qq.com")
    print result

    
def test_send_phoneCode():
    dblayer.DLUserManager.send_phoneCode('13934244685', '123456') 

    
def test_autocomplete():
    result = dblayer.DLIVManager.autocomplete('平安', 3)
    print result
    
def test_get_system_group_list():
    result = dblayer.DLGroupManager.get_system_group_list()
    print result
    
def test_get_org_list_by_group():
    result = dblayer.DLGroupManager.get_org_list_by_group(3, 1)
    print result
    
def test_get_employee_job_types():
    result = dblayer.DLIVManager.get_employee_job_types(1)
    print result
    
def test_getPepole():
    result = dblayer.DLIVManager.getPepole(1, [4])
    print result
    
if __name__ == "__main__":

    test_getPepole()
    
    