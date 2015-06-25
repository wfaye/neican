'''
Created on Mar 6, 2013

@author: lyb
'''
from orm import dblayer 

dlusermanager = dblayer.DLUserManager()

class BLUserManager(object):
    def register(self, username, password):
        return dlusermanager.register(username, password)
    
    def emailActivate(self, activateCode):
        return dlusermanager.emailActivate(activateCode)
    
    def mobileActivate(self, activateCode, password):
        return dlusermanager.mobileActivate(activateCode, password)
    
    def login(self, account, password):
        return dlusermanager.login(account, password)  
    
    def getUser(self, user_id):
        return dlusermanager.get_user(user_id)
    
    def addUser(self, user):
        dlusermanager.add_user(user)
    
    def modifyUser(self, user_id, user):
        dlusermanager.modify_user(user_id, user)
        
    def removeUser(self, user_id):
        dlusermanager.remove_user(user_id)
        
    def checkUser(self, uid, pwd):
        pass
    
    def search_weibo_user(self, weibo_uid):
        return dlusermanager.search_weibo_user(weibo_uid)
    
    def register_via_weibo(self, mobile, weibo_id, weibo_token, screen_name):
        return dlusermanager.register_via_weibo(mobile, weibo_id, weibo_token, screen_name)
        
    def login_via_weibo(self, weibo_uid, weibo_token):
        return dlusermanager.login_via_weibo(weibo_uid, weibo_token)
    
    def weiboActivate(self, activateCode):
        return dlusermanager.weiboActivate(activateCode)
    
    def search_qq_user(self, qq_openid):
        return dlusermanager.search_qq_user(qq_openid)
    
    def register_via_qq(self, mobile, qq_openid, qq_token, nickname):
        return dlusermanager.register_via_qq(mobile, qq_openid, qq_token, nickname)
    
    def login_via_qq(self, qq_openid, qq_token):
        return dlusermanager.login_via_qq(qq_openid, qq_token)
    
    def qqActivate(self, activateCode):
        return dlusermanager.qqActivate(activateCode)
    
    def addSimpleInfo(self, userId, jsonInfo):
        return dlusermanager.addSimpleInfo(userId, jsonInfo)
        
    def getJobPositionDic(self, deptId):
        return dlusermanager.getJobPositionDic(deptId)
    
    def getSimpleInfo(self, userId):
        return dlusermanager.getSimpleInfo(userId)
    
    def getDepartmentDic(self):
        return dlusermanager.getDepartmentDic()
    
    def getWorkHistory(self, userId):
        return dlusermanager.getWorkHistory(userId)
    
    def addWorkHistory(self, userId, jsonInfo):
        return dlusermanager.addWorkHistory(userId, jsonInfo)
    
    def deleteWorkHistory(self, workHistoryId):
        return dlusermanager.deleteWorkHistory(workHistoryId)
    
    def getEducationExperience(self, userId):
        return dlusermanager.getEducationExperience(userId)
    
    def addEducationExperience(self, userId, jsonInfo):
        return dlusermanager.addEducationExperience(userId, jsonInfo)
    
    def deleteEducationExperience(self, educationId):
        return dlusermanager.deleteEducationExperience(educationId)
    
    def schoolAutoComplete(self, searchString):
        return dlusermanager.schoolAutoComplete(searchString)
    
    def getBaseInfo(self, userId):
        return dlusermanager.getBaseInfo(userId)
    
    def addBaseInfo(self, userId, jsonInfo):
        return dlusermanager.addBaseInfo(userId, jsonInfo)
    
    def getRecentView(self, userId):
        return dlusermanager.getRecentView(userId)
    
    def addRecentView(self, userId,jsonInfo):
        return dlusermanager.addRecentView(userId, jsonInfo)
    
    def getDegreeDic(self):
        return dlusermanager.getDegreeDic()
    
    def send_mail_forgot_code(self, account):
        return dlusermanager.send_mail_forgot_code(account)
    
    def verify_mail_forgot_code(self, forgot_code, account):
        return dlusermanager.verify_mail_forgot_code(forgot_code, account)
    
    def reset_password(self, account, new_password):
        return dlusermanager.reset_password(account, new_password)
    
    def send_phone_forgot_code(self, account):
        return dlusermanager.send_phone_forgot_code(account)
    
    def verify_phone_forgot_code(self, forgot_code, account):
        return dlusermanager.verify_phone_forgot_code(forgot_code, account)
    
    
    
    
    
    
    
    
    
    
    
    
