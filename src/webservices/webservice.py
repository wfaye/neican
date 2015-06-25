# -*- coding: utf-8 -*-
'''
Created on Feb 14, 2013

@author: lyb
'''
from bottle import get, request, post, put, delete, redirect, response
import jsonpickle
from urllib import urlopen
import json
import string
import requests
import time

from yunti import um, im, gm, login_required
from settings.settings import EC_SUCCESS
from sqlalchemy.orm.sync import update
    

def respond_success(result=None):
    if result == None:                      
        return {'ec':EC_SUCCESS}          
    else:
        return {'ec':EC_SUCCESS, 'resp':result}

def respond_failure(ec):
    return {'ec':ec}


class WebService:    
    """
    ekb
    """
    @staticmethod
    @get('/ekb/company/<id:int>/overview')
    @login_required
    def getCompanyOverview(id):
        return im.getCompanyOverview(id)  
    
    @staticmethod
    @get('/ekb/company/<id:int>/smartAgentList')
    @login_required
    def getSmartAgentList(id):
        searchDays = request.query.get('searchDays', '')
        if searchDays == '':
            searchDays = 30
        else:
            searchDays = string.atoi(searchDays)
            
        
        return im.getSmartAgentList(id, searchDays)
    
    @staticmethod
    @get('/ekb/company/<id:int>/smartAgentArticles/<sa_id:int>')
    @login_required
    def getSmartAgentArticles(id, sa_id):
        searchDays = request.query.get('searchDays', '')
        if searchDays == '':
            searchDays = 30
        else:
            searchDays = string.atoi(searchDays)
            
        return im.getSmartAgentArticles(id, searchDays, sa_id)
        
    @staticmethod
    @get('/ekb/company/<id:int>/jobtypes')
    def getJobTypes(id):
        return im.get_employee_job_types(id) 
    
    @staticmethod
    @get('/ekb/company/<id:int>/people')
    #@login_required
    def getPeople(id):       
        seqs = request.query.get('q', '') 
        if seqs != '':
            seq_list = seqs.split(',')
        else:
            seq_list = []
        return im.getPeople(id, seq_list)
            
    @staticmethod
    @get('/ekb/company/<id:int>/socialProfile')
    @login_required
    def getSocialMediasProfile(id):
        response = {}.fromkeys(['error','errorMessage','data'])
        allSearchTypeList = ['twitter','facebook','linkedin','weibo','qweibo']
        searchTypeList = []
        
        include = request.query.get('include', '')
        exclude = request.query.get('exclude', '')
        if include != '':
            searchTypeList = include.split('+')
        elif exclude != '':
            excludeList = exclude.split('+')
            for item in excludeList:
                allSearchTypeList.remove(item)
                searchTypeList = allSearchTypeList
        else:
            searchTypeList = allSearchTypeList
        
        data ={}
        for searchType in searchTypeList:
            data.setdefault(searchType, None)
        
        if 'facebook' in searchTypeList:
            pass
        
        if 'twitter' in searchTypeList:
            pass
        
        if 'linkedin' in searchTypeList:
            pass
        
        if 'weibo' in searchTypeList:
            commMediaNumList = im.getCommMediaNum(id, "新浪微博")
            
            if commMediaNumList == None:
                pass
            else:
                commMediaNumList = json.loads(commMediaNumList)
                if commMediaNumList.has_key("screen_name"):
                    searchNum = commMediaNumList["screen_name"]
                    searchNum = searchNum.encode('utf-8')
                    data['weibo'] = {}.fromkeys(['otherInfo', 'followers', 'followingUsers'])
                    #根据screen_name来查询用户信息，还可以用domain和uid
                    pageUserInfos = urlopen('https://api.weibo.com/2/users/show.json?screen_name='+searchNum+'&access_token=2.003xSkoB3PENBDac1ab0c683mthPRB')
                    otherInfo = json.loads(pageUserInfos.read())
                    
                    data['weibo']['otherInfo'] = otherInfo
                    
                    pageFansList = urlopen('https://api.weibo.com/2/friendships/followers.json?screen_name='+searchNum+'&access_token=2.003xSkoB3PENBDac1ab0c683mthPRB')
                    fansList = json.loads(pageFansList.read())
                    
                    data['weibo']['followers'] = fansList
                    
                    pageIdolList = urlopen('https://api.weibo.com/2/friendships/friends.json?screen_name='+searchNum+'&access_token=2.003xSkoB3PENBDac1ab0c683mthPRB')
                    idolList = json.loads(pageIdolList.read())
                    
                    data['weibo']['followingUsers'] = idolList
            
        if 'qweibo' in searchTypeList:
            commMediaNumList = im.getCommMediaNum(id, "腾讯微博")
            
            if commMediaNumList == None:
                pass
            else:
                commMediaNumList = json.loads(commMediaNumList)
                if commMediaNumList.has_key("name"):
                    searchNum = commMediaNumList["name"]#可能这里以后会根据情况进行修改
                    searchNum = searchNum.encode('utf-8')
                    data['qweibo'] = {}.fromkeys(['otherInfo', 'followers', 'followingUsers'])
                    
                    pageUserInfos = urlopen('https://open.t.qq.com/api/user/other_info?format=json&name='+searchNum+'&fopenid=&oauth_consumer_key=801436900&access_token=653bb23a22b33b77ddbcac7749760eb2&openid=85091C0FFF64E7780FCB3881CDC639FE&oauth_version=2.a')
                    otherInfo = json.loads(pageUserInfos.read())
                    
                    data['qweibo']['otherInfo'] = otherInfo
                    
                    pageFansList = urlopen('https://open.t.qq.com/api/friends/user_fanslist?format=json&reqnum=20&startindex=0&name='+searchNum+'&fopenid=&install=0&mode=0&oauth_consumer_key=801436900&access_token=653bb23a22b33b77ddbcac7749760eb2&openid=85091C0FFF64E7780FCB3881CDC639FE&oauth_version=2.a')
                    fansList = json.loads(pageFansList.read())
                    
                    data['qweibo']['followers'] = fansList
                    
                    pageIdolList = urlopen('https://open.t.qq.com/api/friends/user_idollist?format=json&reqnum=20&startindex=0&name='+searchNum+'&fopenid=&install=0&mode=0&oauth_consumer_key=801436900&access_token=653bb23a22b33b77ddbcac7749760eb2&openid=85091C0FFF64E7780FCB3881CDC639FE&oauth_version=2.a')
                    idolList = json.loads(pageIdolList.read())
                    
                    data['qweibo']['followingUsers'] = idolList
                    
                    """
                    qweiboInfo = {}.fromkeys(['screen_name','fullName','flag','tweetCount','followingCount','followersCount',
                                              'listsCount','isFollowing','isTweetsProtected','description','url','location',
                                              'tweets','followers','isDefaultProfileImage','isVerified'])
                    pageUserInfos = urlopen('https://open.t.qq.com/api/user/other_info?format=json&name='+searchNum+'&fopenid=&oauth_consumer_key=801436900&access_token=c0edf3443923884fbb0060dc02051d9e&openid=898E8381187F2B8123B5FED7F4E819F6&&oauth_version=2.a')
                    
                    userInfos = json.loads(pageUserInfos.read())
                    fansnum = userInfos['data']['fansnum']#听众数
                    idolnum = userInfos['data']['idolnum']#收听人数
                    head = userInfos['data']['head']#头像url
                    name = userInfos['data']['name']#用户账户名
                    introduction = userInfos['data']['introduction']#个人介绍
                    isent = userInfos['data']['isent']#是否企业机构
                    location = userInfos['data']['location']#所在地
                    nick = userInfos['data']['nick']#用户昵称   
                    tweetnum = userInfos['data']['tweetnum']#发表的微博数
                    isvip = userInfos['data']['isvip']# 是否认证用户
                    
                    pageFansList = urlopen('https://open.t.qq.com/api/friends/user_fanslist?format=json&reqnum=20&startindex=0&name='+searchNum+'&fopenid=&install=0&mode=0&oauth_consumer_key=801436900&access_token=c0edf3443923884fbb0060dc02051d9e&openid=898E8381187F2B8123B5FED7F4E819F6&oauth_version=2.a')
                    fansList = json.loads(pageFansList.read())
                    if len(fansList['data']['info']) > 0:
                        followers = []
                        for fans in fansList['data']['info']:
                            name = fans['name']#帐户名
                            openid = fans['openid']#用户唯一id，与name相对应
                            nick = fans['nick']#昵称
                            head = fans['head']#头像url
                            
                            followerItem = {}.fromkeys(['id', 'screen_name', 'profile_image_url_https'])
                            followerItem['id'] = openid
                            followerItem['screen_name'] = nick
                            followerItem['profile_image_url_https'] = head
                            
                            followers.append(followerItem)
                    
                    qweiboInfo['screen_name'] = nick 
                    qweiboInfo['fullName'] = name 
                    qweiboInfo['flag'] = None 
                    qweiboInfo['tweetCount'] = tweetnum 
                    qweiboInfo['followingCount'] = idolnum 
                    qweiboInfo['followersCount'] = fansnum 
                    qweiboInfo['listsCount'] = None 
                    qweiboInfo['isFollowing'] = None 
                    qweiboInfo['isTweetsProtected'] = None 
                    qweiboInfo['description'] = introduction 
                    qweiboInfo['url'] = None 
                    qweiboInfo['location'] = location 
                    qweiboInfo['tweets'] = [] 
                    qweiboInfo['followers'] = followers 
                    qweiboInfo['isDefaultProfileImage'] = None      
                    qweiboInfo['isVerified'] = isvip 
                    """  
        
        response['data'] = data
        
        reponse = jsonpickle.encode(response, unpicklable=False)
        return reponse

        
    @staticmethod
    @get('/ekb/company/<id:int>/posts')
    @login_required
    def getSocialMediasPosts(id):
        response = {}.fromkeys(['error','errorMessage','errorType','data'])
        allSearchTypeList = ['twitter','facebook','linkedin','weibo','qweibo']
        searchTypeList = []
        
        include = request.query.get('include', '')
        exclude = request.query.get('exclude', '')
        if include != '':
            searchTypeList = include.split('+')
        elif exclude != '':
            excludeList = exclude.split('+')
            for item in excludeList:
                allSearchTypeList.remove(item)
                searchTypeList = allSearchTypeList
        else:
            searchTypeList = allSearchTypeList
        
        data ={}.fromkeys(['lastUpdate','updates','twitterLoggedIn','lastUpdateJsonString','hasMoreResults'])
        lastUpdate = {}.fromkeys(['lastUpdatedTime','lastTwitterPostId','lastBlogsPostTime','lastBlogsPostTitleValue','lastUpdateIncrement'])
        updates = []
        for searchType in searchTypeList:
            data.setdefault(searchType, None)
        
        if 'facebook' in searchTypeList:
            pass
        
        if 'twitter' in searchTypeList:
            pass
        
        if 'linkedin' in searchTypeList:
            pass
        
        if 'weibo' in searchTypeList:
            pass
        
        if 'qweibo' in searchTypeList:
            commMediaNumList = im.getCommMediaNum(id, "腾讯微博")
            if commMediaNumList == None:
                pass
            else:
                commMediaNumList = json.loads(commMediaNumList)
                if commMediaNumList.has_key("name"):
                    searchNum = commMediaNumList["name"]#可能这里以后会根据情况进行修改
                    searchNum = searchNum.encode('utf-8')
                    pageTimeline = urlopen('https://open.t.qq.com/api/statuses/user_timeline?format=json&pageflag=0&pagetime=0&reqnum=20&lastid=0&name='+searchNum+'&fopenid=&type=0&contenttype=0&oauth_consumer_key=801436900&access_token=653bb23a22b33b77ddbcac7749760eb2&openid=85091C0FFF64E7780FCB3881CDC639FE&oauth_version=2.a')
                    l = pageTimeline.read()
                    timeline = json.loads(l)
                    
                    for timelineIntem in timeline['data']['info']:
                        updatesItem = {}.fromkeys(['userName','fullName','postTitle','postURL','postText','postTime','postId','postType','retweeted'])
                        name = timelineIntem['name']#用户账户名
                        nick = timelineIntem['nick']#昵称
                        id = timelineIntem['id']#微博id
                        timestamp = timelineIntem['timestamp']#发表时间
                        text = timelineIntem['text']#微博内容
                        
                        updatesItem['userName'] = nick
                        updatesItem['fullName'] = name
                        updatesItem['postTitle'] = None
                        updatesItem['postURL'] = None
                        updatesItem['postText'] = text
                        updatesItem['postTime'] = timestamp
                        updatesItem['postId'] = id
                        updatesItem['postType'] = "qweibo"
                        updatesItem['retweeted'] = False
                        
                        updates.append(updatesItem)
                    
        data['lastUpdate'] = lastUpdate
        
        if len(updates) == 0:
            updates = None
            
        data['updates'] = updates
        
        response['data'] = data
        
        reponse = jsonpickle.encode(response, unpicklable=False)
        return reponse
        
      
    
    @staticmethod
    @get('/ekb/company/<id:int>/mentioned')
    @login_required
    def getSocialMediasMentioned(id):
        response = {}.fromkeys(['no','errMsg','data'],'')
        allSearchTypeList = ['twitter','facebook','linkedin','weibo','qweibo']
        searchTypeList = []
        
        include = request.query.get('include', '')
        exclude = request.query.get('exclude', '')
        if include != '':
            searchTypeList = include.split('+')
        elif exclude != '':
            excludeList = exclude.split('+')
            for item in excludeList:
                allSearchTypeList.remove(item)
                searchTypeList = allSearchTypeList
        else:
            searchTypeList = allSearchTypeList
        
        data ={}.fromkeys(['lastUpdate','updates','twitterLoggedIn','lastUpdateJsonString','hasMoreResults'],'')
        lastUpdate = {}.fromkeys(['lastUpdatedTime','lastTwitterPostId','lastBlogsPostTime','lastBlogsPostTitleValue','lastUpdateIncrement'],'')
        
        updates = []
        social_media_updates = []
        '''
        for searchType in searchTypeList:
            data.setdefault(searchType, None)
        '''
        if 'facebook' in searchTypeList:
            pass
        
        if 'twitter' in searchTypeList:
            pass
        
        if 'linkedin' in searchTypeList:
            pass
        
        if 'weibo' in searchTypeList:
            pass
        
        if 'qweibo' in searchTypeList:
            commMediaNumList = im.getCommMediaNum(id, "腾讯微博")
            if commMediaNumList == None:
                pass
            else:
                commMediaNumList = json.loads(commMediaNumList)
                if commMediaNumList.has_key("name"):
                    searchNum = commMediaNumList["name"]#可能这里以后会根据情况进行修改
                    searchNum = searchNum.encode('utf-8')
                    #reqnum=5
                    pageTimeline = urlopen('https://open.t.qq.com/api/statuses/user_timeline?format=json&pageflag=0&pagetime=0&reqnum=5&lastid=0&name='+searchNum+'&fopenid=&type=0&contenttype=0&oauth_consumer_key=801436900&access_token=653bb23a22b33b77ddbcac7749760eb2&openid=85091C0FFF64E7780FCB3881CDC639FE&oauth_version=2.a')
                    l = pageTimeline.read()
                    timeline = json.loads(l)
                    
                    for timelineIntem in timeline['data']['info']:
                        smItem = {}.fromkeys(['userName','fullName','postTitle','postURL','postText','postTime','postId','postType','retweeted'],'')
                        name = timelineIntem['name']#用户账户名
                        nick = timelineIntem['nick']#昵称
                        pid = timelineIntem['id']#微博id
                        timestamp = timelineIntem['timestamp']#发表时间
                        text = timelineIntem['text']#微博内容
                        
                        smItem['userName'] = nick
                        smItem['fullName'] = name
                        smItem['postTitle'] = None
                        smItem['postURL'] = None
                        smItem['postText'] = text
                        smItem['postTime'] = timestamp
                        smItem['postId'] = pid
                        smItem['postType'] = "腾讯微博"
                        smItem['retweeted'] = False
                        
                        social_media_updates.append(smItem)
        
        if len(social_media_updates) > 0:
            for item in social_media_updates:
                updatesItem = {}.fromkeys(['type','content','publishTime'],'')
                
                updatesItem['type'] = item['postType']
                updatesItem['content'] = item['postText']
                updatesItem['publishTime'] = item['postTime']
                
                updates.append(updatesItem)
                
        
        jobs = im.getJobs(id, 5)
        jobs = json.loads(jobs) 
        job_updates = jobs['data']['results']
        
        if len(job_updates) > 0:
            for item in job_updates:
                updatesItem = {}.fromkeys(['type','content','publishTime'],'')
                
                updatesItem['type'] = "招聘信息"
                updatesItem['content'] = item['position']
                publishDate = time.strptime(str(item['publishDate']), "%Y%m%d")
                publishDate = int(time.mktime(publishDate))
                updatesItem['publishTime'] = publishDate
                
                updates.append(updatesItem)
        
        
        gov_announcements = im.getGovAnnouncements(id, 5) 
        gov_announcements = json.loads(gov_announcements)
        gov_announce_updates = gov_announcements['data']['announcements']
        
        if len(gov_announce_updates) > 0:
            for item in gov_announce_updates:
                updatesItem = {}.fromkeys(['type','content','publishTime'],'')
                
                updatesItem['type'] = "政府公告"
                updatesItem['content'] = item['title']
                publishDate = time.strptime(str(item['date']), "%Y%m%d")
                publishDate = int(time.mktime(publishDate))
                updatesItem['publishTime'] = publishDate
                
                updates.append(updatesItem)
         
        data['lastUpdate'] = lastUpdate
            
        data['updates'] = updates
        
        response['data'] = data
        response['no'] = 0
        
        reponse = jsonpickle.encode(response, unpicklable=False)
        return reponse 
        
        
    @staticmethod
    @get('/ekb/company/<id:int>/familytree')
    @login_required
    def getFamilyTree(id):
        return im.getFamilyTree(id)
    
    @staticmethod
    @get('/ekb/company/<id:int>/competitors')
    @login_required
    def getCompetitors(id):
        pass
    
    @staticmethod
    @get('/ekb/company/<id:int>/jobs')
    @login_required
    def getJobs(id):
        return im.getJobs(id, 10)
    
    @staticmethod
    @get('/ekb/company/<id:int>/govannouncements')
    @login_required
    def getGovAnnouncements(id):
        return im.getGovAnnouncements(id, 10)
    
    @staticmethod
    @get('/ekb/company/<id:int>/certifications')
    @login_required
    def getCertifications(id):
        return im.getCertifications(id)
    
    '''
    @staticmethod
    @get('/ekb/autocomplete')
    @login_required
    def autocomplete():
        searchString = request.query.get('searchString', '')
        if searchString != '':
            return im.autocomplete(searchString)
        else:
            pass
    '''    
    @staticmethod
    @get('/ekb/autocomplete')
    @login_required
    def autocomplete():
        searchString = request.query.get('searchString', '')
        groupType = request.query.get('grouptype', '')
        groupId = request.query.get('groupid', '')
        if searchString != '':
            return im.autocomplete(searchString, groupType, groupId)
        else:
            pass
    
    
    """
    OAuth
    """
    '''
    @staticmethod
    @get('/')
    def getCode():
        APP_KEY = "801436900"
        APP_SECRET = "4c729ea56d0f67c12a4179f35ca897bd"
        code = request.query.get('code', '')
        openid = request.query.get('openid', '')
        openkey = request.query.get('openkey', '')
        
        
        CODE = code
        if code != '':
            redirect('https://open.t.qq.com/cgi-bin/oauth2/access_token?client_id='+APP_KEY+'&client_secret.\
            ='+APP_SECRET+'&redirect_uri=http://www.myurl.com/example&grant_type=authorization_code&code='+CODE)
    '''        
            
    @staticmethod
    @get('/ekb/watchList/<watchListId>/companies')
    @login_required
    def getWatchListCompany(watchListId):
        return im.getWatchedCompanyList(watchListId)
    
    
    
    @staticmethod
    @get('/ekb/watchList/<watchListId>/people')
    @login_required
    def getWatchListPeople(watchListId):
        return im.getWatchedPersonList(watchListId)
    
    
    
    @staticmethod
    @post('/ekb/watchList/<watchListId>/company/<companyId>')
    @login_required
    def followingCompany(watchListId, companyId):
        watchListId = string.atoi(watchListId)
        companyId = string.atoi(companyId)
        response = im.followingCompany(watchListId, companyId)

        response = jsonpickle.encode(response, unpicklable=False)
        return response
       
    
    @staticmethod
    @delete('/ekb/watchList/<watchListId>/company/<companyId>')
    @login_required
    def unFollowingCompany(watchListId, companyId):
        watchListId = string.atoi(watchListId)
        companyId = string.atoi(companyId)
        response = im.unFollowingCompany(watchListId, companyId)
        
        response = jsonpickle.encode(response, unpicklable=False)
        return response
    
    @staticmethod
    @post('/ekb/watchList/<watchListId>/people/<contactId>')
    @login_required
    def followingPeople(watchListId, contactId):
        watchListId = string.atoi(watchListId)
        contactId = string.atoi(contactId)
        response = im.followingPeople(watchListId, contactId)
        
        response = jsonpickle.encode(response, unpicklable=False)
        return response
    
    @staticmethod
    @delete('/ekb/watchList/<watchListId>/people/<contactId>')
    @login_required
    def unFollowingPeople(watchListId, contactId):
        watchListId = string.atoi(watchListId)
        contactId = string.atoi(contactId)
        response = im.unFollowingPeople(watchListId, contactId)
        
        response = jsonpickle.encode(response, unpicklable=False)
        return response
       
            
        
    @staticmethod
    @get('/ekb/company/<id>/shareholders')
    @login_required
    def getShareholders(id):
        return im.getShareholders(id)
    
    
    @staticmethod
    @get('/ekb/watchList/<uid>')
    @login_required
    def getWatchlistInfo(uid):
        return im.getWatchlistInfo(uid)
    
    @staticmethod
    @get('/ekb/buildList')
    #@login_required
    def advanced_search():
        vs = request.query.get('vs', '')
        queryConditions = request.query.get('q', '')
        queryConditions = json.loads(queryConditions)
        
        if vs != '':
            if vs == "CR":
                return im.buildCompanyList(queryConditions)
            elif vs == "PR":
                return im.bulidContactList(queryConditions)
        else:
            pass
        
        return im.buildCompanyList(queryConditions)
    
    @staticmethod
    @get('/ekb/company/<id>/news') 
    def getNews(id):
        orgId = string.atoi(id)
        return im.getNews(orgId)
    
    @staticmethod
    @get('/ekb/contact/<id>/overview')
    @login_required 
    def getContactOverview(id):
        employmentId = string.atoi(id)
        return im.getContactOverview(employmentId)
    
    
    @staticmethod
    @get('/ekb/globalsearch/companies')
    @login_required
    def globalSearchCompanies():
        searchString = request.query.get('searchString', '')
        pageNum = request.query.get('pageNum', '')
        if searchString != '' and pageNum != '':
            pageNum = string.atoi(pageNum)
            return im.globalSearchCompanies(searchString, pageNum)
        else:
            pass
        
 
    @staticmethod
    @get('/ekb/globalsearch/people')
    @login_required
    def globalSearchpeople():
        searchString = request.query.get('searchString', '')
        pageNum = request.query.get('pageNum', '')
        if searchString != '' and pageNum != '':
            pageNum = string.atoi(pageNum)
            return im.globalSearchPeople(searchString, pageNum)
        else:
            pass


    @staticmethod
    @get('/ekb/provinces')
    @login_required
    def getProvinces():
        return im.get_province_list()
    
    @staticmethod
    @get('/ekb/<id>/cities')
    @login_required
    def getCities(id):
        return im.get_city_list(id)
    
    @staticmethod
    @get('/ekb/<id>/districts')
    #@login_required
    def getDistricts(id):
        return im.get_district_list(id)
    
    @staticmethod
    @get('/ekb/orgstatuses')
    @login_required
    def getOrgStatuses():
        queryConditions = request.query.get('q', '')
        queryConditions = json.loads(queryConditions)
        
        return im.get_org_status_list(queryConditions)
    
    @staticmethod
    @get('/ekb/orgtypes')
    #@login_required
    def getOrgTypeList():
        queryConditions = request.query.get('q', '')
        queryConditions = json.loads(queryConditions)
        
        return im.get_org_type_list(queryConditions)
    
    @staticmethod
    @get('/ekb/industries')
    def getIndustries():
        queryConditions = request.query.get('q', '')
        queryConditions = json.loads(queryConditions)
        
        return im.get_industry_class_list(queryConditions)
    
    @staticmethod
    @get('/ekb/certifiedproduct')
    def getCertifiedProduts():
        queryConditions = request.query.get('q', '')
        queryConditions = json.loads(queryConditions)
        
        return im.get_certification_list(queryConditions)
    
    @staticmethod
    @get('/ekb/jobtypes')
    def getJobPositionTypes():
        queryConditions = request.query.get('q', '')
        queryConditions = json.loads(queryConditions)
        
        return im.get_job_type_list(queryConditions)
    
    @staticmethod
    @get('/ekb/departments')
    def getDepartments():
        queryConditions = request.query.get('q', '')
        queryConditions = json.loads(queryConditions)
        
        return im.get_org_dept_list(queryConditions)
        
    @staticmethod
    @get('/ekb/sys/groups')
    def getSysGroups():
        return gm.get_system_group_list()
    
    @staticmethod
    @get('/ekb/sysgroup/<gid>/companies')
    def getSysGroupOrgs(gid):
        in_page_num = request.query.get('pageNum', '')
        gid = string.atoi(gid)
        in_page_num = string.atoi(in_page_num)
        return gm.get_org_list_by_sysgroup(gid, in_page_num)
    
    @staticmethod
    @get('/ekb/user/<uid>/groups')
    def getUserGroups(uid):
        return gm.get_user_group_list(uid)
    
    @staticmethod
    @post('/ekb/user/<uid>/groups')
    def addUserGroup(uid):
        group_json = request.json
        return gm.add_user_group(uid, group_json)
    
    @staticmethod
    @delete('/ekb/user/<uid>/groups/<gid>')
    def delUserGroup(uid, gid):
        return gm.remove_user_group(uid, gid)
    
    @staticmethod
    @put('/ekb/user/groups/<gid>')
    def updateUserGroup(gid):
        group_json = request.json
        gid = string.atoi(gid)
        return gm.update_user_group(gid, group_json)
    
    @staticmethod
    @get('/ekb/group/<gid>/companies')
    def getUserGroupOrgs(gid):
        in_page_num = request.query.get('pageNum', '')
        return gm.get_org_list_by_group(gid, in_page_num)
    
    @staticmethod
    @post('/ekb/group/<gid>/companies/<oid>')
    def addUserGroupOrg(gid, oid):
        return gm.add_user_group_org(gid, oid)
    
    @staticmethod
    @delete('/ekb/group/<gid>/companies/<oid>')
    def delUserGroupOrg(gid, oid):
        return gm.del_user_group_org(gid, oid)
    
        
    
    '''
    User Management Section
    '''    
    @staticmethod
    @post('/ekb/auth/register')
    def register():
        user_json = request.json
        if user_json.has_key('email'):
            email = user_json['email']
            password = user_json['password']
            response = um.register(email, password)
            return jsonpickle.encode(response, unpicklable=False)
        elif user_json.has_key('mobile'):
            mobile = user_json['mobile']
            response = um.register(mobile, None)
            return jsonpickle.encode(response, unpicklable=False)
        
    @staticmethod
    @get('/ekb/auth/activate/<activate_token>')
    def emailActivate(activate_token):
        activateCode = activate_token
        response = um.emailActivate(activateCode)
        if response['no'] == 0:
            redirect('/profile.html?uid='+str(response['data']['uid']))
        else:
            pass
    
    @staticmethod
    @post('/ekb/auth/activate')
    def mobileActivate():
        activate_json = request.json
        if activate_json.has_key('activateCode'):
            activateCode = activate_json['activateCode']
            password = activate_json['password']
            response = um.mobileActivate(activateCode, password)
            return jsonpickle.encode(response, unpicklable=False)
        else:
            pass
    
    @staticmethod
    @get('/')
    def home():
        session = request.environ['beaker.session']
        if 'isAuthed' in session:
            user_id = session['uid']
            redirect('/mainpage.html?uid='+str(user_id))
        else:
            return redirect('/login.html')   
        
    @staticmethod
    @post('/ekb/auth/login')
    def login():
        session = request.environ['beaker.session']
        
        user_json = request.json
        if user_json.has_key('email'):
            email = user_json['email']
            password = user_json['password']
            res = um.login(email, password)
        else:
            mobile = user_json['mobile']
            password = user_json['password']
            res = um.login(mobile, password)
        
        if res['no'] == 0:
            user_id = res['data']['uid']
            session['isAuthed'] = 1
            session['uid'] = user_id
            session.save()
            
            name = res['data']['name']
            response.set_cookie('yunti_user_name', name)
            
        return jsonpickle.encode(res, unpicklable=False)
    
    @staticmethod
    @get('/ekb/auth/logout')
    def logout():
        session = request.environ['beaker.session']
        session.pop('isAuthed')
        session.save()
        redirect('/login.html')        
    
    
    @staticmethod
    @get('/ekb/auth/weibo/gettoken')
    def get_weibo_token():
        weibo_code = request.query.get('code', '')
        if weibo_code != "":
            request_token = requests.post("https://api.weibo.com/oauth2/access_token?client_id=2766289424&client_secret=b43062bfa64328f5ad6f5b61aa8ac01e&grant_type=authorization_code&redirect_uri=http://www.maitool.com/ekb/auth/weibo/gettoken&code="+weibo_code)
            token_info = request_token.json()
            weibo_token = token_info['access_token']
            weibo_uid = token_info['uid']
            
            """
            search weibo user ,if exist login, else register
            """
            flag = um.search_weibo_user(weibo_uid)
            if flag == 1:
                response = um.login_via_weibo(weibo_uid, weibo_token)
                if response['no'] == 0:
                    if response['data']['isFirstTime'] == True:
                        redirect("/profile.html?uid="+str(response['data']['uid']))
                    else:
                        redirect("/mainpage.html")
            else:
                request_account = requests.get("https://api.weibo.com/2/users/show.json?uid="+weibo_uid+"&access_token="+weibo_token)
                account_info = request_account.json()
                screen_name = account_info['screen_name']
                
                response = {}.fromkeys(['no','errMsg','data'])
                data = {}.fromkeys(['uid','access_token','screen_name'])
                data['uid'] = weibo_uid
                data['access_token'] = weibo_token
                data['screen_name'] = screen_name 
                
                if data['screen_name'] != "":
                    response['no'] = 1
                else:
                    response['no'] = 2
                    
                response['data'] = data
                if response['no'] == 1:
                    redirect("/weiboRegister.html?screen_name="+data['screen_name']+"&uid="+data['uid']+"&access_token="+data['access_token'])
        else:
            pass
        
        response = jsonpickle.encode(response, unpicklable=False)
        return response
        
    @staticmethod
    @post('/ekb/auth/weibo/register')
    def register_via_weibo():
        """
                     微博登陆中，点击获取验证码后执行注册操作
        """
        user_json = request.json
        if user_json.has_key('mobile'):
            mobile = user_json['mobile']
            weibo_id = user_json['uid']
            weibo_token = user_json['access_token']
            screen_name = user_json['screen_name']
            response = um.register_via_weibo(mobile, weibo_id, weibo_token, screen_name)
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        else:
            pass
       
    @staticmethod
    @post('/ekb/auth/weibo/activate')
    def weiboActivate():
        """
                    微博登陆中，点击注册后执行激活操作，激活操作中更新isActived字段为true
        """ 
        activate_json = request.json
        if activate_json.has_key('activateCode'):
            activateCode = activate_json['activateCode']
            response = um.weiboActivate(activateCode)
            response = jsonpickle.encode(response, unpicklable=False)
            return response
            #redirect('/mainpage.html')
        else:
            pass
        
    @staticmethod
    @get('/ekb/auth/qq/gettoken')
    def get_qq_token():
        import re
        qq_code = request.query.get('code', '')
        if qq_code != "":
            request_token = requests.get("https://graph.qq.com/oauth2.0/token?client_id=101168618&client_secret=c819e9fabc5ea4fde4ad2f79d607d803&grant_type=authorization_code&redirect_uri=http://www.maitool.com/ekb/auth/qq/gettoken&code="+qq_code).content
            qq_token = re.findall(r'(?!=access_token=)[a-zA-Z0-9]*?(?=&)', request_token, 0)[0]
            openid_info = requests.get("https://graph.qq.com/oauth2.0/me?access_token="+qq_token).content
            openid_info = json.loads(re.findall(r'\{[\s\S]*?\}', openid_info, 0)[0])
            qq_openid =  openid_info['openid']
            
            flag = um.search_qq_user(qq_openid)
            if flag == 1:
                response = um.login_via_qq(qq_openid, qq_token)
                if response['no'] == 0:
                    if response['data']['isFirstTime'] == True:
                        redirect("/profile.html?uid="+str(response['data']['uid']))
                    else:
                        redirect("/mainpage.html")
            else:
                request_account = requests.get("https://graph.qq.com/user/get_user_info?openid="+qq_openid+"&access_token="+qq_token+"&oauth_consumer_key=101168618").content
                account_info = json.loads(request_account)
                nickname = account_info['nickname']
                
                response = {}.fromkeys(['no','errMsg','data'])
                data = {}.fromkeys(['uid','access_token','nickname'])
                data['openid'] = qq_openid
                data['access_token'] = qq_token
                data['nickname'] = nickname 
                
                if data['nickname'] != "":
                    response['no'] = 1
                else:
                    response['no'] = 2
                    
                response['data'] = data
                if response['no'] == 1:
                    redirect("/qqRegister.html?nickname="+data['nickname']+"&openid="+data['openid']+"&access_token="+data['access_token'])
        else:
            pass
        
        response = jsonpickle.encode(response, unpicklable=False)
        return response
    
    @staticmethod
    @post('/ekb/auth/qq/register')
    def register_via_qq():
        """
        QQ登陆中，点击获取验证码后执行注册操作
        """
        user_json = request.json
        if user_json.has_key('mobile'):
            mobile = user_json['mobile']
            qq_openid = user_json['openid']
            qq_token = user_json['access_token']
            nickname = user_json['nickname']
            response = um.register_via_qq(mobile, qq_openid, qq_token, nickname)
            response = jsonpickle.encode(response, unpicklable=False)
            return response
        else:
            pass
       
    @staticmethod
    @post('/ekb/auth/qq/activate')
    def qqActivate():
        """
        QQ登陆中，点击注册后执行激活操作，激活操作中更新isActived字段为true
        """ 
        activate_json = request.json
        if activate_json.has_key('activateCode'):
            activateCode = activate_json['activateCode']
            response = um.qqActivate(activateCode)
            response = jsonpickle.encode(response, unpicklable=False)
            return response
            #redirect('/mainpage.html')
        else:
            pass
        
    @staticmethod
    @post('/ekb/auth/simpleInfo/<id>')
    def addSimpleInfo(id):
        simpleInfo = request.json
        response = um.addSimpleInfo(id, simpleInfo)
        return jsonpickle.encode(response, unpicklable=False)
    
    @staticmethod
    @get('/ekb/auth/simpleInfo/<id>')
    def getSimpleInfo(id):
        response = um.getSimpleInfo(id)
        response = jsonpickle.encode(response, unpicklable=False)
        return response
    
    @staticmethod
    @get('/ekb/jobPositionList/<id>')
    @login_required
    def getJobPositionDic(id):
        return um.getJobPositionDic(id)
    
    @staticmethod
    @get('/ekb/departmentList')
    @login_required
    def getDepartmentDic():
        return um.getDepartmentDic()
    
    @staticmethod
    @get('/ekb/auth/workhistory/<id>')
    @login_required
    def getWorkHistory(id):
        return um.getWorkHistory(id)
    
    @staticmethod
    @post('/ekb/auth/workhistory/<id>')
    def addWorkHistory(id):
        workInfo = request.json
        return um.addWorkHistory(id, workInfo)
    
    @staticmethod
    @delete('/ekb/auth/workhistory/<id>')
    def deleteWorkHistory(id):
        return um.deleteWorkHistory(id)
    
    
    @staticmethod
    @get('/ekb/auth/edu/<id>')
    @login_required
    def getEducationExperience(id):
        return um.getEducationExperience(id)
    
    @staticmethod
    @post('/ekb/auth/edu/<id>')
    @login_required
    def addEducationExperience(id):
        eduInfo = request.json
        return um.addEducationExperience(id, eduInfo)
    
    
    @staticmethod
    @delete('/ekb/auth/edu/<id>')
    @login_required
    def deleteEducationExperience(id):
        return um.deleteEducationExperience(id)
    
    @staticmethod
    @get('/ekb/school/autocomplete')
    @login_required
    def schoolAutoComplete():
        searchString = request.query.get('searchString', '')
        if searchString != '':
            return um.schoolAutoComplete(searchString)
        else:
            pass
    
    
    @staticmethod
    @post('/ekb/auth/baseInfo/<id>')
    @login_required
    def addBaseInfo(id):
        baseInfo = request.json
        return um.addBaseInfo(id, baseInfo)
    
    
    @staticmethod
    @get('/ekb/auth/baseInfo/<id>')
    @login_required
    def getBaseInfo(id):
        return um.getBaseInfo(id)
    
    @staticmethod
    @get('/ekb/auth/recentView/<id>')
    @login_required
    def getRecentView(id):
        return um.getRecentView(id)
    
    @staticmethod
    @post('/ekb/auth/recentView/<id>')
    @login_required
    def addRecentView(id):
        viewInfo = request.json
        return um.addRecentView(id, viewInfo)
    
    @staticmethod
    @get('/ekb/degreeList')
    @login_required
    def getDegreeDic():
        return um.getDegreeDic()
    
    @staticmethod
    @get('/ekb/forgot/sendCode')
    def send_forgot_code():
        user_json = request.json
        if user_json.has_key('email'):
            email = user_json['email']
            response = um.send_mail_forgot_code(email)
        elif user_json.has_key('mobile'):
            mobile = user_json['mobile']
            response = um.send_phone_forgot_code(mobile)
        
        return jsonpickle.encode(response, unpicklable=False)
    
    @staticmethod
    @get('/ekb/forgot/verifyCode')
    def verify_mail_forgot_code():
        user_json = request.json
        if user_json.has_key('email'):
            email = user_json['email']
            forgot_code = user_json['forgotcode']
            response = um.verify_mail_forgot_code(forgot_code, email)
        elif user_json.has_key('mobile'):
            mobile = user_json['mobile']
            forgot_code = user_json['forgotcode']
            response = um.verify_phone_forgot_code(forgot_code, mobile)
        
        return response
    
    @staticmethod
    @get('/ekb/fotgot/resetPassword')
    def reset_password():
        forgot_json = request.json
        account = forgot_json['account']
        new_password = forgot_json['newPassword']
        return um.reset_password(account, new_password)
    
    @staticmethod
    @get('/ekb/company/autocomplete')
    def get_names():
        result = {}.fromkeys(['returnType', 'errMsg','orgList','captcha'],'')
        result['returnType'] = "4"
        return jsonpickle.encode(result, unpicklable=False)
    
    @staticmethod
    @get('/ekb/company')
    def get_organizations():
        result = {}.fromkeys(['returnType', 'errMsg','orgList','captcha'],'')
        fullname = request.query.get('fullname', '')
        captcha = request.query.get('captcha','')
        if captcha == "":
            result['returnType'] = "CAPTCHA_IMG"
            result['captcha'] = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a\
    HBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIy\
    MjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyAMgDASIA\
    AhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA\
    AAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3\
    ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm\
    p6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA\
    AwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx\
    BhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK\
    U1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3\
    uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0Ciq8\
    12ls4E42IxAV88fj6c/4+uLFABRVWZrhJwFljWJ8AF492G9OCMZ7dec+wqRGuS4EkUSr3Kykn8to\
    oAmooproJEKsWAP91ip/MUAOqveQvLbv5TyLKEbZsfHOPy/w9qr/AGm7tf8Aj4haSMdXUjj8eM/U\
    hQMd6uQTx3MKyxNuRuhxj2oAZb+Yyq/niWFlBUlMMc85J6foKnqrHLFaRR27mT92gUv5TbeB1zjA\
    /OpY7mCZtsU8cjAZwrgnFAEtFRiXM7RMMEAMpz94d/yP8x61JQAVBLcmEtugmZQOGRd24+gAOfzA\
    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\
    "
        else:
            result['returnType'] = "CAPTCHA_ERROR"
            result['captcha'] = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0a\
    HBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIy\
    MjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAyAMgDASIA\
    AhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA\
    AAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3\
    ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm\
    p6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA\
    AwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx\
    BhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK\
    U1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3\
    uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD0Ciq8\
    12ls4E42IxAV88fj6c/4+uLFABRVWZrhJwFljWJ8AF492G9OCMZ7dec+wqRGuS4EkUSr3Kykn8to\
    oAmooproJEKsWAP91ip/MUAOqveQvLbv5TyLKEbZsfHOPy/w9qr/AGm7tf8Aj4haSMdXUjj8eM/U\
    hQMd6uQTx3MKyxNuRuhxj2oAZb+Yyq/niWFlBUlMMc85J6foKnqrHLFaRR27mT92gUv5TbeB1zjA\
    /OpY7mCZtsU8cjAZwrgnFAEtFRiXM7RMMEAMpz94d/yP8x61JQAVBLcmEtugmZQOGRd24+gAOfzA\
    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\
    "
        return jsonpickle.encode(result, unpicklable=False)
    

    
    
        
        
    
        
    
    
    
    
    
        
        
            
        