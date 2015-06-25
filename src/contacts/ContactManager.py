'''
Created on April 06, 2013

@author: wpz

'''
from contacts import user_contact
from orm import dblayer

class BLIVManager(object):
    @staticmethod
    def getCompanyOverview(orgId):
        return dblayer.DLIVManager.getCompanyOverview(orgId)
    
    @staticmethod
    def getSmartAgentList(orgId, searchDays):
        return dblayer.DLIVManager.getSmartAgentList(orgId, searchDays)
    
    @staticmethod
    def getSmartAgentArticles(orgId, searchDays, smartAgentId):
        return dblayer.DLIVManager.getSmartAgentArticles(orgId, searchDays, smartAgentId)
    
    @staticmethod
    def get_employee_job_types(orgId):
        return dblayer.DLIVManager.get_employee_job_types(orgId)
        
    @staticmethod
    def getPeople(orgId, seqs):
        return dblayer.DLIVManager.getPepole(orgId, seqs)
            
    @staticmethod
    def getSocialMediasProfile(id, sm = None):
        return dblayer.DLIVManager.getSocialMediasProfile(id, sm)
    
    
    @staticmethod
    def getSocialMediasPosts(id):
        return dblayer.DLIVManager.getSocialMediasPosts(id)
    
    
    @staticmethod
    def getSocialMediasMentioned(id):
        return dblayer.DLIVManager.getSocialMediasMentioned(id)
    
    @staticmethod
    def getFamilyTree(id):
        return dblayer.DLIVManager.getFamilyTree(id)
    """
    @staticmethod
    def autocomplete(searchString):
        return dblayer.DLIVManager.autocomplete(searchString)
    """
    @staticmethod
    def autocomplete(searchString, groupType, groupId):
        return dblayer.DLIVManager.autocomplete(searchString, groupType, groupId)
    
    @staticmethod
    def getCommMediaNum(id, searchType):
        return dblayer.DLIVManager.getCommMediaNum(id, searchType)
    
    
    @staticmethod
    def isFollowedCompany(watchlistId, companyId):
        return dblayer.DLIVManager.isFollowedCompany(watchlistId, companyId)
    
    @staticmethod
    def followingCompany(watchlistId, companyId):
        """charge wether the company is followed by the user first, 0 means
           unfollowed, 1 means followed.
           Return 1 means success and 0 means fail
        """
        response = {}.fromkeys(['no', 'errMsg', 'data'],'')
        isFollowed = BLIVManager.isFollowedCompany(watchlistId, companyId)
        if isFollowed == 0:
            dblayer.DLIVManager.followingCompany(watchlistId, companyId)
            response['no'] = 0
        else:
            response['no'] = 1
            response['errMsg'] = "already in watchlist"
        
        return response
    
    
    @staticmethod
    def unFollowingCompany(watchlistId, companyId):
        """If flag is 0, this means unfollowed, and if flag is 1, it means
           this company was followed and then cancel the following relatio-
           nship.
        """
        response = {}.fromkeys(['no', 'errMsg', 'data'],'')
        isFollowed = BLIVManager.isFollowedCompany(watchlistId, companyId)
        if isFollowed == 0:
            response['no'] = 1
            response['errMsg'] = "not in watchlsit" 
        else:
            dblayer.DLIVManager.unFollowingCompany(watchlistId, companyId)
            response['no'] = 0
        
        return response
        
    @staticmethod
    def isFollowedPeople(watchlistId, contactId):
        return dblayer.DLIVManager.isFollowedPeople(watchlistId, contactId)
    
    @staticmethod
    def followingPeople(watchlistId, contactId):
        isFollowed = BLIVManager.isFollowedPeople(watchlistId, contactId)
        response = {}.fromkeys(['no', 'errMsg', 'data'],'')
        if isFollowed == 0:
            dblayer.DLIVManager.followingPeople(watchlistId, contactId)
            response['no'] = 0
        else:
            response['no'] = 1
            response['errMsg'] = "already in watchlist"
        
        return response
    
    
    @staticmethod
    def unFollowingPeople(watchlistId, contactId):
        isFollowed = BLIVManager.isFollowedPeople(watchlistId, contactId)
        response = {}.fromkeys(['no', 'errMsg', 'data'],'')
        if isFollowed == 0:
            response['no'] = 1
            response['errMsg'] = "not in watchlsit"
        else:
            dblayer.DLIVManager.unFollowingPeople(watchlistId, contactId)
            response['no'] = 0
            
        return response
        
    @staticmethod
    def getShareholders(id):
        return dblayer.DLIVManager.getShareholders(id)
    
    @staticmethod
    def getWatchlistInfo(uid):
        return dblayer.DLIVManager.getWatchlistInfo(uid)
    
    @staticmethod
    def getWatchedCompanyList(watchListId):
        return dblayer.DLIVManager.getWatchedCompanyList(watchListId)
    
    
    @staticmethod
    def getWatchedPersonList(watchListId):
        return dblayer.DLIVManager.getWatchedPersonList(watchListId)
    
    @staticmethod
    def login(email, password):
        return dblayer.DLIVManager.login(email, password)
    
    @staticmethod
    def getNews(orgId):
        return dblayer.DLIVManager.getNews(orgId)
    
    @staticmethod
    def getContactOverview(employmentId):
        return dblayer.DLIVManager.getContactOverview(employmentId)
    
    @staticmethod
    def globalSearchCompanies(searchString, pageNum):
        return dblayer.DLIVManager.globalSearchCompanies(searchString, pageNum)
    
    
    @staticmethod
    def globalSearchPeople(searchString, pageNum):
        return dblayer.DLIVManager.globalSearchPeople(searchString, pageNum)
    
    @staticmethod
    def getJobs(orgId, num):
        return dblayer.DLIVManager.getJobs(orgId, num)
    
    @staticmethod
    def getGovAnnouncements(orgId, num):
        return dblayer.DLIVManager.getGovAnnouncements(orgId, num)
    
    @staticmethod
    def getCertifications(orgId):
        return dblayer.DLIVManager.getCertifications(orgId)
    
    @staticmethod
    def get_province_list():
        return dblayer.DLIVManager.get_province_list()
    
    @staticmethod
    def get_city_list(province_id):
        return dblayer.DLIVManager.get_city_list(province_id)
    
    @staticmethod
    def get_district_list(city_id):
        return dblayer.DLIVManager.get_district_list(city_id)
        
    @staticmethod
    def get_org_status_list(query_conditions):
        return dblayer.DLIVManager.get_org_status_list(query_conditions)
    
    @staticmethod
    def get_org_type_list(query_conditions):
        return dblayer.DLIVManager.get_org_type_list(query_conditions)
    
    @staticmethod
    def buildCompanyList(query_conditions):
        return dblayer.DLIVManager.buildCompanyList(query_conditions)
    
    @staticmethod
    def bulidContactList(query_conditions):
        return dblayer.DLIVManager.bulidContactList(query_conditions)
     
    @staticmethod
    def get_industry_class_list(query_conditions):
        return dblayer.DLIVManager.get_industry_class_list(query_conditions)
    
    @staticmethod
    def get_certification_list(query_conditions):
        return dblayer.DLIVManager.get_certification_list(query_conditions)
    
    @staticmethod
    def get_job_type_list(query_conditions):
        return dblayer.DLIVManager.get_job_type_list(query_conditions)
        
    @staticmethod
    def get_org_dept_list(query_conditions):
        return dblayer.DLIVManager.get_org_dept_list(query_conditions)