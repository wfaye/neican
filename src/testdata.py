# coding=utf8
'''
Created on May 22, 2013

@author: lyb
'''


from bottle import post, redirect, get, response, request, delete
from contacts.user_contact import ShortContact, DetailedContact, \
  ShortOrganization, DetailedOrganization, ExtraPhones
import jsonpickle

@get('/ekb/company/<id:int>/overview')
def getCompanyOverview(id):
    companyInfo = {}.fromkeys(['id', 'name', 'isPublic', 'publicCode', 'stockLink', 'industry', 'industryId', 'revenue', 'employees', 'registered_capital', 'in_charge_person_key', 'in_charge_person_name', 'core_business', 'org_status', 'license_number', 'operation_start_date', 'operation_end_date', 'license_issue_date', 'canceled_date_key', 'license_revoke_date', 'description'])
    companyInfo['id'] = 2867257
    companyInfo['name'] = "HootSuite Media, Inc."
    companyInfo['isPublic'] = False
    companyInfo['publicCode'] = ""
    companyInfo['stockLink'] = ""
    companyInfo['industry'] = "Internet Software and Services"
    companyInfo['industryId'] = "104"
    companyInfo['revenue'] = "$60.0M"
    companyInfo['employees'] = "320"
    companyInfo['registered_capital'] = "$1000万"
    companyInfo['in_charge_person_key'] = 1
    companyInfo['in_charge_person_name'] = "黄总"
    companyInfo['core_business'] = "软件开发，技术支持，技术贸易"
    companyInfo['org_status'] = "开业"
    companyInfo['license_number'] = "123445666"
    companyInfo['operation_start_date'] = "2001-03-01"
    companyInfo['operation_end_date'] = "2022-03-01"
    companyInfo['license_issue_date'] = "2010-10-28"
    companyInfo['canceled_date_key'] = ""
    companyInfo['license_revoke_date'] = ""
    companyInfo['description'] = "HootSuite Media, Inc. provides Web-based social media management solutions for businesses and organizations to collaboratively execute campaigns across various social networks. Its HootSuite unique social media dashboard enables users to launch marketing campaigns, identify and grow audiences, distribute targeted messages, manage various social profiles, schedule messages and tweets, track brand mentions, and analyze social media traffic. The HootSuite&#039;s features include social network management, team/business collaboration, custom/social analytics, message management, and security for social assets. HootSuite Media, Inc. was founded in 2008 and is based in Vancouver, Canada."

    contactDetails = {}.fromkeys(['address', 'country', 'website', 'phone'])
    contactDetails['address'] = "BC Vancouver 5 East 8th Avenue V5T 1R6"
    contactDetails['country'] = "Canada"
    contactDetails['website'] = "www.hootsuite.com"
    contactDetails['phone'] = "+1 604 681 4668"
    
    sourceData = {}.fromkeys(['id', 'title', 'image'])
    sourceData['id'] = "capitaliq"
    sourceData['title'] = "BusinessWeek Record"
    sourceData['image'] = "https://d1tzls7byl3ryp.cloudfront.net/iv/common/static/styles/images/icn_businessweek12_1895d70f91489faf115942351f03b64a.gif"
    
    companyOverviewDict = dict(companyInfo = companyInfo, contactDetails = contactDetails, sourceData = sourceData)
    companyOverviewJson = jsonpickle.encode(companyOverviewDict, unpicklable=False)
    return companyOverviewJson

@get('/ekb/company/<id:int>/smartAgentList')
def getSmartAgentList(id, searchDays=30):
    response = {}.fromkeys(['error', 'data', 'errorMessage'])
    
    data = {}.fromkeys(['searchDays', 'totalAgents', 'showChatter', 'showSaveAs', 'showDynamicsActivityFeed', 'agentResultSets', 'peopleUpdates', 'totalAgentHits'])
    
    data['searchDays'] = searchDays
    data['totalAgents'] = 9
    data['showChatter'] = False
    data['showSaveAs'] = False
    data['showDynamicsActivityFeed'] = False
    data['agentResultSets'] = []
    data['peopleUpdates'] = []
    data['totalAgentHits'] = 17
    
    agentResultItem1 = {}.fromkeys(['category', 'resultCount', 'results', 'agentId', 'agentName', 'mode'])
    agentResultItem1['category'] = 'leadership'
    agentResultItem1['resultCount'] = 1
    agentResultItem1['results'] = []
    agentResultItem1['agentId'] = 708758
    agentResultItem1['agentName'] = "Leadership Changes"
    agentResultItem1['mode'] = "SellingTrigger"
    
    resultItem = {}.fromkeys(['id', 'articleId', 'sourceCount', 'groupId', 'newsText', 'source', 'dateText', 'sourceAccessStatus', 'docType', 'commonArticles'])
    resultItem['id'] = None
    resultItem['articleId'] = "_9886905889"
    resultItem['sourceCount'] = 0
    resultItem['groupId'] = 0
    resultItem['newsText'] = "Jeanette Gibson, Former Cisco Executive, Joins HootSuite as Vice President of Community"
    resultItem['source'] = "Individual.com"
    resultItem['dateText'] = "Sep 24, 06:20 PDT"
    resultItem['sourceAccessStatus'] = 0
    resultItem['docType'] = None
    resultItem['commonArticles'] = []
    agentResultItem1['results'].append(resultItem)
    
    agentResultItem2 = {}.fromkeys(['category', 'resultCount', 'results', 'agentId', 'agentName', 'mode'])
    agentResultItem2['category'] = 'default'
    agentResultItem2['resultCount'] = 3
    agentResultItem2['results'] = []
    agentResultItem2['agentId'] = 2
    agentResultItem2['agentName'] = "New Offerings"
    agentResultItem2['mode'] = "SellingTrigger"
    
    agentResultItem3 = {}.fromkeys(['category', 'resultCount', 'results', 'agentId', 'agentName', 'mode'])
    agentResultItem3['category'] = 'default'
    agentResultItem3['resultCount'] = 3
    agentResultItem3['results'] = []
    agentResultItem3['agentId'] = 29
    agentResultItem3['agentName'] = "Partnerships"
    agentResultItem3['mode'] = "SellingTrigger"
    
    agentResultItem4 = {}.fromkeys(['category', 'resultCount', 'results', 'agentId', 'agentName', 'mode'])
    agentResultItem4['category'] = 'default'
    agentResultItem4['resultCount'] = 1
    agentResultItem4['results'] = []
    agentResultItem4['agentId'] = 31
    agentResultItem4['agentName'] = "Company Presentation"
    agentResultItem4['mode'] = "SellingTrigger"
    
    agentResultItem5 = {}.fromkeys(['category', 'resultCount', 'results', 'agentId', 'agentName', 'mode'])
    agentResultItem5['category'] = 'default'
    agentResultItem5['resultCount'] = 3
    agentResultItem5['results'] = []
    agentResultItem5['agentId'] = 465
    agentResultItem5['agentName'] = "Compliance"
    agentResultItem5['mode'] = "SellingTrigger"
    
    agentResultItem6 = {}.fromkeys(['category', 'resultCount', 'results', 'agentId', 'agentName', 'mode'])
    agentResultItem6['category'] = 'default'
    agentResultItem6['resultCount'] = 2
    agentResultItem6['results'] = []
    agentResultItem6['agentId'] = 467
    agentResultItem6['agentName'] = "Data Security"
    agentResultItem6['mode'] = "SellingTrigger"
    
    agentResultItem7 = {}.fromkeys(['category', 'resultCount', 'results', 'agentId', 'agentName', 'mode'])
    agentResultItem7['category'] = 'default'
    agentResultItem7['resultCount'] = 2
    agentResultItem7['results'] = []
    agentResultItem7['agentId'] = 2975
    agentResultItem7['agentName'] = "Funding Developments"
    agentResultItem7['mode'] = "SellingTrigger"
    
    agentResultItem8 = {}.fromkeys(['category', 'resultCount', 'results', 'agentId', 'agentName', 'mode'])
    agentResultItem8['category'] = 'default'
    agentResultItem8['resultCount'] = 1
    agentResultItem8['results'] = []
    agentResultItem8['agentId'] = 3620
    agentResultItem8['agentName'] = "Corporate Challenges"
    agentResultItem8['mode'] = "SellingTrigger"
    

    
    data['agentResultSets'].extend([agentResultItem1, agentResultItem2, agentResultItem3, agentResultItem4, agentResultItem5, agentResultItem6, agentResultItem7, agentResultItem8])
    
    response['error'] = False
    response['data'] = data
    response['errorMessage'] = None
    
    reponse = jsonpickle.encode(response, unpicklable=False)
    return reponse


@get('/ekb/company/<id:int>/smartAgentArticles/<sa_id:int>')
def getSmartAgentArticles(id, sa_id, searchDays=30):
    response = {}.fromkeys(['error', 'data', 'errorMessage'])
    
    data = {}.fromkeys(['category', 'resultCount', 'results', 'agentId', 'agentName', 'mode'])
    data['category'] = 'default'
    data['resultCount'] = 3
    data['results'] = []
    data['agentId'] = 29
    data['agentName'] = "Partnerships"
    data['mode'] = "SellingTrigger"

    resultItem1 = {}.fromkeys(['id', 'articleId', 'sourceCount', 'groupId', 'newsText', 'source', 'dateText', 'sourceAccessStatus', 'docType', 'commonArticles'])
    resultItem1['id'] = "1"
    resultItem1['articleId'] = "_9886905889"
    resultItem1['sourceCount'] = 0
    resultItem1['groupId'] = 1
    resultItem1['newsText'] = "Solution Partner Onboarding and Support Specialist"
    resultItem1['source'] = "Tech Vibes"
    resultItem1['dateText'] = "Sep 10, 20:00 PDT"
    resultItem1['sourceAccessStatus'] = 0
    resultItem1['docType'] = ""
    resultItem1['commonArticles'] = []
    
    resultItem2 = {}.fromkeys(['id', 'articleId', 'sourceCount', 'groupId', 'newsText', 'source', 'dateText', 'sourceAccessStatus', 'docType', 'commonArticles'])
    resultItem2['id'] = "2"
    resultItem2['articleId'] = "_9732124200"
    resultItem2['sourceCount'] = 0
    resultItem2['groupId'] = 0
    resultItem2['newsText'] = "HootSuite Partners with Nexgate to Improve Social Security"
    resultItem2['source'] = "Big News Network"
    resultItem2['dateText'] = "Sep 05, 12:07 PDT"
    resultItem2['sourceAccessStatus'] = 0
    resultItem2['docType'] = ""
    resultItem2['commonArticles'] = []
    
    resultItem3 = {}.fromkeys(['id', 'articleId', 'sourceCount', 'groupId', 'newsText', 'source', 'dateText', 'sourceAccessStatus', 'docType', 'commonArticles'])
    resultItem3['id'] = "3"
    resultItem3['articleId'] = "_9685221995"
    resultItem3['sourceCount'] = 0
    resultItem3['groupId'] = 2
    resultItem3['newsText'] = "SugarCRM Teams up with HootSuite"
    resultItem3['source'] = "Destination CRM"
    resultItem3['dateText'] = "Aug 30, 14:04 PDT"
    resultItem3['sourceAccessStatus'] = 0
    resultItem3['docType'] = ""
    resultItem3['commonArticles'] = []
    
    data['results'].extend([resultItem1, resultItem2, resultItem3])
    
    
    response['error'] = False
    response['data'] = data
    response['errorMessage'] = ""
    
    reponse = jsonpickle.encode(response, unpicklable=False)
    return reponse


@get('/ekb/company/<id:int>/people')
def getPeople(id):
    response = [{'category':1,
         'title':"Current Company", 
         'people':{"count":2,#和totalCount有什么区别
                 "totalCount":27,
                 "coWorkers":0,
                 "refAccounts":0,#？？？
                 "prevWorkers":0,
                 "previousTeamCoWorker":0,
                 "personalFirstDegree":0,
                 "personalSecondDegree":0,
                 "personalTeam":0,
                 "education":0,
                 "ceo":0,
                 "vp":8,
                 "director":12,
                 "board":5,
                 "manager":2,
                 "other":0,
                 "clevel":4,
                 "sales":4,
                 "hr":1,
                 "marketing":3,
                 "operations":2,
                 "research":0,
                 "it":2,
                 "finance":4,
                 "otherFunction":13,
                 "sort":2,
                 "keyword":"",
                 "executiveInfos":[{"name":"Darren Suomi", 
                                    "title":"Global Vice President of Sales",
                                    "companyId":2867257,
                                    "employmentId":10993552,   #？？？
                                    "executiveId":10152454,    #？？？？
                                    "imageUrl":"https://d1tzls7byl3ryp.cloudfront.net/iv/profileImages/executiveImage/321446",
                                    "count":0,                  #？？？？
                                    "executiveConnectionImageUrls":[],
                                    "trackedByWatchlists":[],
                                    "employmentType":0},       #？？？？
                                   {"name":"Gregory  Gunn",
                                    "title":"Vice President of Business Development",
                                    "companyId":2867257,
                                    "employmentId":9240823,
                                    "executiveId":9049103,
                                    "imageUrl":"https://d1tzls7byl3ryp.cloudfront.net/iv/profileImages/executiveImage/292479",
                                    "count":0,
                                    "executiveConnectionImageUrls":[],
                                    "trackedByWatchlists":[],
                                    "employmentType":0}]}
                 },
            {'category': 2, #以前公司人脉
             'title':"Former Company",
             'people':{"count":0,
                     "totalCount":0,
                     "coWorkers":0,
                     "refAccounts":0,
                     "prevWorkers":0,
                     "previousTeamCoWorker":0,
                     "personalFirstDegree":0,
                     "personalSecondDegree":0,
                     "personalTeam":0,
                     "education":0,
                     "ceo":0,
                     "vp":0,
                     "director":0,
                     "board":0,
                     "manager":0,
                     "other":0,
                     "clevel":0,
                     "sales":0,
                     "hr":0,
                     "marketing":0,
                     "operations":0,
                     "research":0,
                     "it":0,
                     "finance":0,
                     "otherFunction":0,
                     "sort":2,
                     "keyword":"",
                     "executiveInfos":[]}
            },
            {'category': 4,#关联公司人脉
             'title':"Family Tree Company",
             'people':{"count":0,
                     "totalCount":7,
                     "coWorkers":0,
                     "refAccounts":0,
                     "prevWorkers":0,
                     "previousTeamCoWorker":0,
                     "personalFirstDegree":0,
                     "personalSecondDegree":0,
                     "personalTeam":0,
                     "education":0,
                     "ceo":0,
                     "vp":0,
                     "director":2,
                     "board":0,
                     "manager":1,
                     "other":2,
                     "clevel":2,
                     "sales":0,
                     "hr":0,
                     "marketing":2,
                     "operations":0,
                     "research":0,
                     "it":0,
                     "finance":0,
                     "otherFunction":5,
                     "sort":2,
                     "keyword":"",
                     "executiveInfos":[]}
             }
            ]
    response = jsonpickle.encode(response, unpicklable=False)
    return response
    

@get('/ekb/company/<id:int>/socialProfile')
def getSocialMediasProfile(id, sm = None):
    response = {
        "error":False,
        "errorMessage":"",
        "data":{
            #twitter和facebook中的字段不太一样
            "twitter":{
                  "screen_name":"hootsuite",#??? nick
                  "fullName":"HootSuite",  #???  name
                  "loggerImageUrl":"https://abs.twimg.com/sticky/default_profile_images/default_profile_0_normal.png",#??
                  "imageUrl":"https://si0.twimg.com/profile_images/3609491522/388703f14207ddbb9d4f7e56f6644835_normal.png",
                  "flag":"tweets", #???
                  "tweetCount":"6368", #发tweet的数量  tweetnum
                  "followingCount":"1380477", #收听    idolnnum
                  "followersCount":"5413950", #听众    fansnum
                  "listsCount":"35011",#???
                  "isFollowing":True,
                  "isTweetsProtected":False,#"??
                  "description":"Updates about the social media management tool which helps teams to securely engage audiences \u0026 measure results. See also: @HootSuite_Help @HootWatch \u0026 more.",
                  "url":"http://t.co/jaMIQleseQ",
                  "location":"Vancouver, Canada",#location
                  "tweets":[],#???
                  "followers":[
                            {
                               "id":1868378550,
                               "screen_name":"EllaSelbyxxx",
                               "profile_image_url_https":"https://si0.twimg.com/profile_images/378800000623310207/88ee3a94f8d34e816130bc87b483155c_normal.jpeg"
                            },
                            {
                               "id":1450287709,
                               "screen_name":"Bernardoce6",
                               "profile_image_url_https":"https://abs.twimg.com/sticky/default_profile_images/default_profile_3_normal.png"
                            },
                            {
                               "id":1952724062,
                               "screen_name":"milanbloody",
                               "profile_image_url_https":"https://si0.twimg.com/profile_images/378800000577505697/6566b30bd52bbbcdd173afe4b7d61b04_normal.png"
                            }
                        ],
                  "followingUsers":[
                     {
                        "id":21539092,
                        "screen_name":"rdlovins",
                        "profile_image_url_https":"https://si0.twimg.com/profile_images/81354928/Rodger_Lovins_normal.jpg"
                     },
                     {
                        "id":14432022,
                        "screen_name":"kitbag",
                        "profile_image_url_https":"https://si0.twimg.com/profile_images/52971935/h2oSMDuffel_med_normal.jpg"
                     },
                     {
                        "id":11676262,
                        "screen_name":"randyr",
                        "profile_image_url_https":"https://si0.twimg.com/profile_images/378800000564714746/3cb9fb672a0f3810107182a0863b6ea7_normal.jpeg"
                     }
                  ],
                  "isDefaultProfileImage":False,
                  "isVerified":True
               },
            "facebook":{
                  "name":"HootSuite",
                  "company_overview":"HootSuite helps organizations use the social web to launch marketing campaigns, identify and grow audience, and distribute targeted messages across multiple channels. \n\n",
                  "id":"177463958820",
                  "likes":369014,
                  "talking_about_count":4067,
                  "picture":{#为什么twitter没有
                     "data":{
                        "url":"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/276709_177463958820_2016472818_q.jpg"
                     }
                  },
                  "location":{
                     "street":"East 8th Avenue",
                     "city":"Vancouver",
                     "state":"BC",
                     "country":"Canada",
                     "zip":"V5T1R6"
                  },
                  "about":"HootSuite is a social media management system for managing Twitter, Facebook, Linkedin, Google+ and more.  Share tips and tactics and meet Hootfans here.  Help: http://help.hootsuite.com  Features: http://feedback.hootsuite.com  Sign-up: HootSuite.com",
                  "website":"http://hootsuite.com",
                  "username":"hootsuite",
                  "link":"https://www.facebook.com/hootsuite"
               }
        }
    }
    response = jsonpickle.encode(response, unpicklable=False)
    return response

@get('/ekb/company/<id:int>/posts')
def getSocialMediasPosts(id):
    response = {
            "error":False,
            "data":{
                "lastUpdate":{#????
                "lastUpdatedTime":"Oct 20 2013, 18:02:19 PDT",
                "lastTwitterPostId":"392063154500673536",
                "lastBlogsPostTime":None,
                "lastBlogsPostTitleValue":None,
                "lastUpdateIncrement":None
                },
                "updates":[#?????
                {
                   "userName":"hootsuite",
                   "fullName":"HootSuite",
                   "imageURL":"https://si0.twimg.com/profile_images/3609491522/388703f14207ddbb9d4f7e56f6644835_normal.png",
                   "postTitle":None,
                   "postURL":None,
                   "postText":"Learn more about your Twitter Relationships, with this new feature: &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://t.co/GMxJ1x27CP\">http://t.co/GMxJ1x27CP</a>&nbsp;",
                   "postTime":"Oct 21 2013, 01:31:35 PDT",
                   "postId":"392206520324485120",
                   "postType":"Twitter",
                   "retweeted":False
                },
                {
                   "userName":"hootsuite",
                   "fullName":"HootSuite",
                   "imageURL":"https://si0.twimg.com/profile_images/3609491522/388703f14207ddbb9d4f7e56f6644835_normal.png",
                   "postTitle":None,
                   "postURL":None,
                   "postText":"Learn how some our biggest clients make the most of HootSuite: &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://t.co/nlRpW7i1Rn\">http://t.co/nlRpW7i1Rn</a>&nbsp; &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/search?q=%23video\">#video</a>&nbsp;",
                   "postTime":"Oct 20 2013, 23:31:30 PDT",
                   "postId":"392176300435464192",
                   "postType":"Twitter",
                   "retweeted":False
                },
                {
                   "userName":"hootsuite",
                   "fullName":"HootSuite",
                   "imageURL":"https://si0.twimg.com/profile_images/3609491522/388703f14207ddbb9d4f7e56f6644835_normal.png",
                   "postTitle":None,
                   "postURL":None,
                   "postText":"They’re not only good at &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/search?q=%23basketball\">#basketball</a>&nbsp; and &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/search?q=%23football\">#football</a>&nbsp;. Athletes dominate social media, too: &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://t.co/WCzCni2VI3\">http://t.co/WCzCni2VI3</a>&nbsp;",
                   "postTime":"Oct 20 2013, 22:30:58 PDT",
                   "postId":"392161063669870592",
                   "postType":"Twitter",
                   "retweeted":False
                },
                {
                   "userName":"hootsuite",
                   "fullName":"HootSuite",
                   "imageURL":"https://si0.twimg.com/profile_images/3609491522/388703f14207ddbb9d4f7e56f6644835_normal.png",
                   "postTitle":None,
                   "postURL":None,
                   "postText":"5 key considerations for social media in government: &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://t.co/SV0zaHkPmd\">http://t.co/SV0zaHkPmd</a>&nbsp;",
                   "postTime":"Oct 20 2013, 21:01:36 PDT",
                   "postId":"392138575804108800",
                   "postType":"Twitter",
                   "retweeted":False
                },
                {
                   "userName":"hootsuite",
                   "fullName":"HootSuite",
                   "imageURL":"https://si0.twimg.com/profile_images/3609491522/388703f14207ddbb9d4f7e56f6644835_normal.png",
                   "postTitle":None,
                   "postURL":None,
                   "postText":"What you need to know about measuring social media success on Twitter: &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://t.co/MKJr9MCeY7\">http://t.co/MKJr9MCeY7</a>&nbsp; &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/search?q=%23webinar\">#webinar</a>&nbsp;",
                   "postTime":"Oct 20 2013, 20:01:43 PDT",
                   "postId":"392123506223480832",
                   "postType":"Twitter",
                   "retweeted":False
                },
                {
                   "userName":"hootsuite",
                   "fullName":"HootSuite",
                   "imageURL":"https://si0.twimg.com/profile_images/3609491522/388703f14207ddbb9d4f7e56f6644835_normal.png",
                   "postTitle":None,
                   "postURL":None,
                   "postText":"Last week you tweeted 40k times in the first minute of &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/search?q=%23thewalkingdead\">#thewalkingdead</a>&nbsp;. Can you beat that tonight? &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://t.co/9sMqC8nB6v\">http://t.co/9sMqC8nB6v</a>&nbsp;",
                   "postTime":"Oct 20 2013, 19:01:51 PDT",
                   "postId":"392108438836502529",
                   "postType":"Twitter",
                   "retweeted":False
                },
                {
                   "liked":False,#前面为什么没有liked
                   "userName":"HootSuite",
                   "fullName":None,
                   "imageURL":"https://graph.facebook.com/177463958820/picture?type=square",
                   "postTitle":None,
                   "postURL":None,
                   "postText":"Infected by the hype around #TheWalkingDead? \n\nOur writers are infected by much worse than that: <a href='http://owl.li/pKfYp' target='_blank'>http://owl.li/pKfYp</a> #28tweetslater",
                   "postTime":"Oct 20 2013, 18:02:19 PDT",
                   "postId":"177463958820_10151810769183821",
                   "postType":"Facebook",
                   "retweeted":False
                },
                {
                   "userName":"hootsuite",
                   "fullName":"HootSuite",
                   "imageURL":"https://si0.twimg.com/profile_images/3609491522/388703f14207ddbb9d4f7e56f6644835_normal.png",
                   "postTitle":None,
                   "postURL":None,
                   "postText":"Infected by the hype around &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/search?q=%23TheWalkingDead\">#TheWalkingDead</a>&nbsp;? Our writers are infected by much worse than that: &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://t.co/W8Ml4dCafy\">http://t.co/W8Ml4dCafy</a>&nbsp; &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/search?q=%2328tweetslater\">#28tweetslater</a>&nbsp;",
                   "postTime":"Oct 20 2013, 18:02:06 PDT",
                   "postId":"392093400394399744",
                   "postType":"Twitter",
                   "retweeted":False
                },
                {
                   "userName":"hootsuite",
                   "fullName":"HootSuite",
                   "imageURL":"https://si0.twimg.com/profile_images/3609491522/388703f14207ddbb9d4f7e56f6644835_normal.png",
                   "postTitle":None,
                   "postURL":None,
                   "postText":"Tips and tricks for Twitter chats: &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://t.co/7zAzNbO5cB\">http://t.co/7zAzNbO5cB</a>&nbsp;&nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/Mike_Allton\"> @Mike_Allton</a>&nbsp; gives you the scoop",
                   "postTime":"Oct 20 2013, 17:01:51 PDT",
                   "postId":"392078237981212673",
                   "postType":"Twitter",
                   "retweeted":False
                },
                {
                   "userName":"hootsuite",
                   "fullName":"HootSuite",
                   "imageURL":"https://si0.twimg.com/profile_images/3609491522/388703f14207ddbb9d4f7e56f6644835_normal.png",
                   "postTitle":None,
                   "postURL":None,
                   "postText":"Did you celebrate World Food Day? This lesser-known event was a hit on Twitter: &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://t.co/96qz6SB8gJ\">http://t.co/96qz6SB8gJ</a>&nbsp;",
                   "postTime":"Oct 20 2013, 16:01:54 PDT",
                   "postId":"392063154500673536",
                   "postType":"Twitter",
                   "retweeted":False
                }
            ],
            "twitterLoggedIn":True,
            "lastUpdateJsonString":"{\"lastUpdatedTime\":\"Oct 20 2013, 18:02:19 PDT\",\"lastTwitterPostId\":\"392063154500673536\"}",
            "hasMoreResults":True
            },
            "errorType":None,
            "errorMessage":""
            }
    response = jsonpickle.encode(response, unpicklable=False)
    return response

@get('/ekb/company/<id:int>/mentioned')
def getSocialMediasMentioned(id):
    response = {
       "error":False,
       "errorType":None,
       "errorMessage":"",
       "data":{
          "lastUpdate":{
             "lastUpdatedTime":None,
             "lastTwitterPostId":"391920667664605184",
             "lastBlogsPostTime":None,
             "lastBlogsPostTitleValue":None,
             "lastUpdateIncrement":"-99"
          },
          "updates":[
             {
                "userName":"Technicalsupply",
                "fullName":"Soluciones IT",
                "imageURL":None,
                "postTitle":None,
                "postURL":None,
                "postText":"&nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/hootsuite\">@hootsuite</a>&nbsp; &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/search?q=%23HootSuite\">#HootSuite</a>&nbsp; ahora por ejemplo me dice que yo publico a las 4.57AM y en realidad son las 11:00AM",
                "postTime":"Oct 20 2013, 07:02:04 PDT",
                "postId":"391927299073114112",
                "postType":"Twitter",
                "retweeted":False
             },
             {
                "userName":"jhonatan_matias",
                "fullName":"jhonatan matias",
                "imageURL":None,
                "postTitle":None,
                "postURL":None,
                "postText":"&nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/hootsuite\">@hootsuite</a>&nbsp; &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/search?q=%23HootSuite\">#HootSuite</a>&nbsp; ahora por ejemplo me dice que yo publico a las 4.57AM y en realidad son las 11:00AM",
                "postTime":"Oct 20 2013, 07:02:04 PDT",
                "postId":"391927298347524096",
                "postType":"Twitter",
                "retweeted":False
             },
             {
                "userName":"Technicalsupply",
                "fullName":"Soluciones IT",
                "imageURL":None,
                "postTitle":None,
                "postURL":None,
                "postText":"&nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/HootSuite\">@HootSuite</a>&nbsp; &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/search?q=%23HootSuite\">#HootSuite</a>&nbsp;   Anda mal la hora me trae los pos de 5 horas atras... Aguien puede ayudarme?",
                "postTime":"Oct 20 2013, 06:57:37 PDT",
                "postId":"391926178757771264",
                "postType":"Twitter",
                "retweeted":False
             },
             {
                "userName":"jhonatan_matias",
                "fullName":"jhonatan matias",
                "imageURL":None,
                "postTitle":None,
                "postURL":None,
                "postText":"&nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/HootSuite\">@HootSuite</a>&nbsp; &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/search?q=%23HootSuite\">#HootSuite</a>&nbsp;   Anda mal la hora me trae los pos de 5 horas atras... Aguien puede ayudarme?",
                "postTime":"Oct 20 2013, 06:57:37 PDT",
                "postId":"391926178053120001",
                "postType":"Twitter",
                "retweeted":False
             },
             {
                "userName":"DelanoMarie",
                "fullName":"Franklin Rivera",
                "imageURL":None,
                "postTitle":None,
                "postURL":None,
                "postText":"Android has had these apps forever.. RT&nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/hootsuite\"> @hootsuite</a>&nbsp;: Now that you’ve updated to iOS7 (nice work) check out these 5 st… &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://t.co/aCDbTm9StO\">http://t.co/aCDbTm9StO</a>&nbsp;",
                "postTime":"Oct 20 2013, 06:46:06 PDT",
                "postId":"391923281793925120",
                "postType":"Twitter",
                "retweeted":False
             },
             {
                "userName":"Qooway",
                "fullName":"Qooway Rewards",
                "imageURL":None,
                "postTitle":None,
                "postURL":None,
                "postText":"RT&nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/hootsuite\"> @hootsuite</a>&nbsp;: Tips for staying healthy at work: &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://t.co/vaKZkGxAFg\">http://t.co/vaKZkGxAFg</a>&nbsp;",
                "postTime":"Oct 20 2013, 06:45:56 PDT",
                "postId":"391923240635211777",
                "postType":"Twitter",
                "retweeted":False
             },
             {
                "userName":"ChristinMcClave",
                "fullName":"Christin McClave",
                "imageURL":None,
                "postTitle":None,
                "postURL":None,
                "postText":"&nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/ct_williford\">@ct_williford</a>&nbsp; Thank you so much. I use&nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/hootsuite\"> @hootsuite</a>&nbsp;&nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/buffer\"> @buffer</a>&nbsp;&nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/feedly\"> @feedly</a>&nbsp; DM me for some of the biz groups I follow and belong to.",
                "postTime":"Oct 20 2013, 06:44:45 PDT",
                "postId":"391922939630583808",
                "postType":"Twitter",
                "retweeted":False
             },
             {
                "userName":"prettyRickeyq",
                "fullName":"pretty rickey pr",
                "imageURL":None,
                "postTitle":None,
                "postURL":None,
                "postText":"S/O to&nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/hootsuite\"> @hootsuite</a>&nbsp; now following follow bk",
                "postTime":"Oct 20 2013, 06:44:09 PDT",
                "postId":"391922789537808384",
                "postType":"Twitter",
                "retweeted":False
             },
             {
                "userName":"brianofshope",
                "fullName":"Brian Shope",
                "imageURL":None,
                "postTitle":None,
                "postURL":None,
                "postText":"RT&nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/hootsuite\"> @hootsuite</a>&nbsp;: A famous street artist takes to &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/search?q=%23NYC\">#NYC</a>&nbsp; and his works disappear within hours: &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://t.co/3rGyjWB2NB\">http://t.co/3rGyjWB2NB</a>&nbsp; Can Twitter solve the myst…",
                "postTime":"Oct 20 2013, 06:40:29 PDT",
                "postId":"391921866186956800",
                "postType":"Twitter",
                "retweeted":False
             },
             {
                "userName":"mvwinall",
                "fullName":"Marion V Winall",
                "imageURL":None,
                "postTitle":None,
                "postURL":None,
                "postText":"RT&nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/hootsuite\"> @hootsuite</a>&nbsp;: Playing in the big leagues, of sport and &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://twitter.com/search?q=%23socialmedia\">#socialmedia</a>&nbsp;: &nbsp;<a target=\"_blank\" style=\"font-size:12px; font-family:'Arial','sans-serif'; color:#069; text-decoration:none\" href=\"http://t.co/O6SGTriEsn\">http://t.co/O6SGTriEsn</a>&nbsp;",
                "postTime":"Oct 20 2013, 06:35:43 PDT",
                "postId":"391920667664605184",
                "postType":"Twitter",
                "retweeted":False
             }
          ],
          "twitterLoggedIn":True,
          "lastUpdateJsonString":"{\"lastTwitterPostId\":\"391920667664605184\",\"lastUpdateIncrement\":\"-99\"}",
          "hasMoreResults":True
       }
    }
    response = jsonpickle.encode(response, unpicklable=False)
    return response


@get('/ekb/company/<id:int>/familytree')
def getFamilyTree(id):
    response = {
       "error":False,
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
                    "isCurrent": False,
                    "location": "Vancouver, Canada"
                    },
                    {
                    "companyName": "OB-Tech LLC",
                    "companyId": "3735082",
                    "isCurrent": False,
                    "location": "Cumming, United States"
                    },
                    {
                    "companyName": "Seesmic, Inc.",
                    "companyId": "2670052",
                    "isCurrent": False,
                    "location": "San Francisco, United States",
                    "children": [{
                        "companyName": "Ping.fm, Inc.",
                        "companyId": "2677126",
                        "isCurrent": False,
                        "location": "Tulsa, United States"
                        }
                                 ]
                    }
                           ]
                    }]
                }
                }
    response = jsonpickle.encode(response, unpicklable=False)
    return response

@staticmethod
@get('/ekb/company/<id:int>/competitors')
def getCompetitors(id):
    response = {
           "error":False,
           "errorType":None,
           "errorMessage":"",
           "data":{
                "count": 5,
                "results": [{
                    "companyName": "atebits LLC.",
                    "companyId": "3242594",
                    "isPublic": False,
                    "industry": "Computer Software",
                    "description": "atebits LLC designs and develops Tweetie iPhone app and Mac desktop application."
                    },
                    {
                    "companyName": "Chirp Interactive",
                    "companyId": "2684417",
                    "isPublic": False,
                    "industry": "Internet Information Services",
                    "description": "Chirp Interactive, Inc., is a leading provider of social applications that leverage the"
                    },
                    {
                    "companyName": "Seesmic, Inc.",
                    "companyId": "2670052",
                    "isPublic": False,
                    "industry": "Internet & Online Services Providers",
                    "revenue": "$0.5M",
                    "employees": 15,
                    "description": "Seesmic, Inc. provides mobile, desktop, and Web applications for connecting"
                    },
                    {
                    "companyName": "Thing Labs, Inc.",
                    "companyId": "2680846",
                    "isPublic": False,
                    "industry": "Internet & Online Services Providers",
                    "description": "Thing Labs, Inc. develops Web-based software solutions."
                    },
                    {
                    "companyName": "TweetDeck",
                    "companyId": "2672156",
                    "isPublic": False,
                    "industry": "Computer Software",
                    "employees": 15,
                    "description": "TweetDeck is an Adobe Air desktop application that is currently in beta."
                    }]
                   }
                }
    response = jsonpickle.encode(response, unpicklable=False)
    return response


@staticmethod
@get('/ekb/company/<id:int>/jobs')
def getJobs(id):
    response = {
           "error":False,
           "errorType":None,
           "errorMessage":"",
           "data":{
                "count": 5,
                "results": [{
                    "position": "Manager - Agency Partnerships, Northeast Region",
                    "link": "http://insideview.simplyhired.com/a/job-details/view/jobkey-10775.2013-09-22_job_20130807002937_12N/jp-0/hits-3", 
                    "employer": "Hootsuite Media – New York, NY",
                    "description": "will be responsible for evangelizing HootSuite’s vision to the digital marketing ... Educate and activate Partners to sell HootSuite’s Enterprise offering. Work with...",
                    "posttime": "2013/11/5 18:00",
                    "location": "New York"
                    },
                    {
                    "position": "Solutions Consultant Manager",
                    "link": "http://insideview.simplyhired.com/a/job-details/view/jobkey-10775.2013-09-22_job_20130809091830_NNK/jp-1/hits-3", 
                    "employer": "Hootsuite Media – Chicago, IL",
                    "description": "As a HootSuite Social Media Solutions Consultant Manager on our Enterprise team, you will ... focusing on the HootSuite platform, Social Media Management and Online Marketing...",
                    "posttime": "2013/11/5 18:00",
                    "location": "Chicago"
                    },
                    {
                    "position": "Strategic Sales Pre-Sales Consultant - SF, LA, DEN, SEA, PHX, DAL",
                    "link": "http://insideview.simplyhired.com/a/job-details/view/jobkey-10775.2013-09-22_job_20130826235914_HII/jp-2/hits-3", 
                    "employer": "Hootsuite Media – San Francisco, CA",
                    "description": "focusing on the HootSuite platform, Social Media Management and Online Marketing ... group who’s passion for sales and social media is unparalleled. Responsibilities:...",
                    "posttime": "2013/11/5 18:00",
                    "location": "San Francisco"
                    }]
            }
        }
    response = jsonpickle.encode(response, unpicklable=False)
    return response



@staticmethod
@get('/ekb/autocomplete')
def autocomplete():
    response = [
           {
              "id":"724570",
              "state":"NJ",  
              "value":"Automatic Data Processing",
              "type":"company",
              "city":"Roseland",
              "popularity":"141625" 
           },
           {
              "id":"724542",
              "state":"CA",
              "value":"Autodesk, Inc.",
              "type":"company",
              "city":"San Rafael",
              "popularity":"106204"
           },
           {
              "id":"37499",
              "state":"IL",
              "value":"State Farm Mutual Automobile Insurance Company",
              "type":"company",
              "city":"Bloomington",
              "popularity":"68898"
           },
           {
              "id":"33512",
              "state":"TX",
              "value":"United Services Automobile Association",
              "type":"company",
              "city":"San Antonio",
              "popularity":"64214"
           },
           {
              "id":"734887",
              "state":"VA",
              "value":"Advance Auto Parts, Inc.",
              "type":"company",
              "city":"Roanoke",
              "popularity":"47986"
           },
           {
              "id":"13672683",
              "title":"Senior Vice President, Global Sales Operations", 
              "value":"Alex Saleh, Auction.com, LLC",
              "isCurrent":"true",  #现公司？？？
              "companyName":"Auction.com, LLC",
              "type":"executive",   #？？？
              "popularity":"1168"
           },
           {
              "id":"1925513",
              "title":"Independent Chairman of the Board",
              "value":"Robert Majteles, U.S. Auto Parts Network, Inc.",
              "isCurrent":"true",
              "companyName":"U.S. Auto Parts Network, Inc.",
              "type":"executive",
              "popularity":"413"
           },
           {
              "id":"440427",
              "title":"Board Observer",
              "value":"Larry Augustin, Zend Technologies Inc.",
              "isCurrent":"true",
              "companyName":"Zend Technologies Inc.",
              "type":"executive",
              "popularity":"409"
           },
           {
              "id":"3096759",
              "title":"Member of Advisor Board",
              "value":"Larry Augustin, WSO2, Inc.",
              "isCurrent":"true",
              "companyName":"WSO2, Inc.",
              "type":"executive",
              "popularity":"409"
           },
           {
              "id":"5608798",
              "title":"CEO",
              "value":"Larry Augustin, SugarCRM, Inc.",
              "isCurrent":"true",
              "companyName":"SugarCRM, Inc.",
              "type":"executive",
              "popularity":"409"
           }
        ]
    response = jsonpickle.encode(response, unpicklable=False)
    return response



@staticmethod
@get('/ekb/buildList')
def buildCompanyList():
    vs = request.query.get('vs', '')
    if vs == "CR":
        response = {
               "error":False,
               "errorMessage":"",
               "data":{
                  "totalCount":6,
                  "resultStartIndex":1,
                  "resultEndIndex":6,
                  "companyCriteria":{
                     "Company Type":"ALL",
                     "Company Status":"ALL",
                     "Employees":"1 - 50",
                     "Industries":"1",
                     "Sub Industries":"ALL",
                     "Countries":"China",
                     "Regions":"country",
                     "Sort By":"Popularity",
                     "Sort Order":"Descending",
                     "Customers":"No"
                  },
                  "companyListResults":[
                     {
                        "location":"Beijing, China",
                        "type":"Private",
                        "connectionCount":0,
                        "companyName":"m-Ikon Ltd.",
                        "companyId":1445535,
                        "ticker":"",
                        "employees":"11",
                        "revenue":"0.0",
                        "smartAgentInfo":None
                     },
                     {
                        "location":"Chengdu, China",
                        "type":"Private",
                        "connectionCount":0,
                        "companyName":"EASEUS",
                        "companyId":2676197,
                        "ticker":"",
                        "employees":"35",
                        "revenue":"0.0",
                        "smartAgentInfo":None
                     },
                     {
                        "location":"Beijing, China",
                        "type":"Private",
                        "connectionCount":0,
                        "companyName":"Linkool Labs",
                        "companyId":1885302,
                        "ticker":"",
                        "employees":"15",
                        "revenue":"0.0",
                        "smartAgentInfo":None
                     },
                     {
                        "location":"Beijing, China",
                        "type":"Subsidiary",
                        "connectionCount":0,
                        "companyName":"ShapeWriter, Inc.",
                        "companyId":3173404,
                        "ticker":"",
                        "employees":"15",
                        "revenue":"0.5",
                        "smartAgentInfo":None
                     },
                     {
                        "location":"Changsha, HUN, China",
                        "type":"Public",
                        "connectionCount":0,
                        "companyName":"Powerise Information Technology Co., Ltd",
                        "companyId":823415,
                        "ticker":"SHE:000787",
                        "employees":"5",
                        "revenue":"0.0",
                        "smartAgentInfo":None
                     },
                     {
                        "location":"Qingdao, China",
                        "type":"Private",
                        "connectionCount":0,
                        "companyName":"COMSHARP",
                        "companyId":2683888,
                        "ticker":"",
                        "employees":"15",
                        "revenue":"0.0",
                        "smartAgentInfo":None
                     }
                  ]
                }
            }
        response = jsonpickle.encode(response, unpicklable=False)
        return response
    elif vs == "PR":
        response = {
           "error":False,
           "errorMessage":"",
           "data":{
              "totalCount":2,
              "resultStartIndex":1,
              "resultEndIndex":2,
              "contactCriteria":{
                 "Company Type":"All",
                 "Company Status":"ALL",
                 "Company":"All",
                 "Employees":"1 - 50",
                 "Industries":"1",
                 "Positions":"Current",
                 "Countries":"China,",
                 "People Sort By":"Popularity",
                 "People Sort Order":"Descending",
                 "Company Sort By":"Popularity",
                 "Company Sort Order":"Descending",
                 "Companies Removed":"0",
                 "People Removed":"0",
                 "Customers":"No"
              },
              "contactListResults":[
                 {
                    "current":True,
                    "connectionCount":0,
                    "fullName":"Liang Ding",
                    "companyName":"Powerise Information Technology Co., Ltd",
                    "displayTitle":"General Manager",
                    "companyId":823415,
                    "employmentId":6041063,
                    "executiveId":6187965,
                    "smartAgentInfo":None
                 },
                 {
                    "current":True,
                    "connectionCount":0,
                    "fullName":"Xiaofeng Jin",
                    "companyName":"Linkool Labs",
                    "displayTitle":"Founder",
                    "companyId":1885302,
                    "employmentId":7465646,
                    "executiveId":7530508,
                    "smartAgentInfo":None
                 }
              ]
            }
        }
    response = jsonpickle.encode(response, unpicklable=False)
    return response
        


@staticmethod
@get('/ekb/watchList/<watchListId>/companies')
def getWatchListCompany(watchListId):
    response = {
       "error":False,
       "errorType":None,
       "errorMessage":"",
       "data":{
          "addedCount":0,
          "deletedCount":0,
          "companies":[
             {
                "location":"Shanghai, China",
                "companyName":"SINA Corp",
                "companyId":732947,
                "businessType":"Public Company",
                "revenue":"$575.0M",
                "numberOfEmployees":6400
             },
             {
                "location":"Beijing, China",
                "companyName":"UTStarcom Holdings Corp",
                "companyId":732805,
                "businessType":"Public Company",
                "revenue":"$168.5M",
                "numberOfEmployees":822
             },
             {
                "location":"Vancouver, Canada",
                "companyName":"HootSuite Media, Inc.",
                "companyId":2867257,
                "businessType":"Private Company",
                "revenue":"$60.0M",
                "numberOfEmployees":320
             }
          ]
       }
    }
    response = jsonpickle.encode(response, unpicklable=False)
    return response
    
@staticmethod
@get('/ekb/watchList/<watchListId>/people')
def getWatchListPeople(watchListId):
    response = {
       "error":False,
       "errorType":None,
       "errorMessage":"",
       "data":{
          "addedCount":0,
          "deletedCount":0,
          "executives":[
             {
                "title":"Director of Solution Partner",
                "companyName":"HootSuite Media, Inc.",
                "companyId":2867257,
                "employmentId":12091985,
                "executiveId":11062563,
                "execName":"Aki Kaltenbach",
                "isPastEmployment":False
             },
             {
                "title":"Vice President of Marketing",
                "companyName":"HootSuite Media, Inc.",
                "companyId":2867257,
                "employmentId":13389718,
                "executiveId":9633745,
                "execName":"Dee McPherson",
                "isPastEmployment":False
             }
          ]
       }
    }
    response = jsonpickle.encode(response, unpicklable=False)
    return response




@staticmethod
@post('/ekb/watchList/<watchListId>/company/<companyId>')
def followingCompany(watchListId, companyId):
    record = False
    
    if record == True:
        pass
    else:
        record = True
    
        response = {
               "error":False,
               "data":True,
               "errorType":None,
               "errorMessage":""
               }

    
    
@staticmethod
@delete('/ekb/watchList/<watchListId>/company/<companyId>')
def unFollowingCompany():
    record = True
    
    if record == True:
        response = {
           "error":False,
           "data":True,
           "errorType":None,
           "errorMessage":""
           }
    else:
        pass
    
    
@staticmethod
@get('/ekb/company/<id>/shareholders')
def getShareholders(id):
    response = {
       "error":False,
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
    response = jsonpickle.encode(response, unpicklable=False)
    return response
        
        
@staticmethod
@get('/ekb/watchList')
def getWatchlistInfo():
    response = {
       "error":False,
       "errorType":None,
       "errorMessage":"",
       "data":{
        "id":1650576,
        "creationDate":"Aug 14, 2013 7:51:40 AM",
        "name":"Watchlist",
        "lastUpdated":"Aug 14, 2013 7:51:40 AM",
        "type":0,
        "following":{
            "companies": [
                "732947",
                "10298329",
                "732805",
                "2867257"
                 ],
            "people": ["11062563","9633745"]
               }
            }
        }
    response = jsonpickle.encode(response, unpicklable=False)
    return response


@staticmethod
@post('/ekb/auto/login')
def login():
    response = {"ec":0, 
                "authcode":"XXXXXX",
                "user":{
                    "userId" : '2c90e7e54058129401407d4f8c1f3078',
                    "fullName" :  'Yibin Lai' ,
                    "firstName" :  'Yibin',
                    "lastName" : 'Lai' ,
                    "watchlistInfo":{
                        "1650576":{
                        "id":1650576,
                        "creationDate":"Aug 14, 2013 7:51:40 AM",
                        "name":"Watchlist",
                        "lastUpdated":"Aug 14, 2013 7:51:40 AM",
                        "type":0,
                        "following":{
                            "companies": [
                                "732947",
                                "10298329",
                                "732805",
                                "2867257"
                            ],
                            "people": ["11062563","9633745"]
                            }
                        }   
                  }
            }
        }
    
    
@staticmethod
@get('/ekb/company/<id>/news') 
def getNews(id):
    response = {
           "error":False,
           "errorType":None,
           "errorMessage":"",
           "data":{
              "totalCount":3,
              "resultStartIndex":1,
              "resultEndIndex":3,
              "results":[{
                    "companyId":"1",
                    "title":" 中国平安房地产市场跑马圈地 偏爱成熟物业",
                    "link":" http://house.focus.cn/news/2013-08-30/3900050.html",
                    "summary":" 中国平安（601318.SH）近年热衷于在房地产市场跑马圈地，且偏爱成熟物业。作为中国平安不动产投资的主要平台，近日平安信托对内发布了《零售地产深度分析及投资策略》报告（下称《报告》），一方面作为集团内部零售地产投资的路线指引，另外也映照了平安在商业地产投资方面的策略…",
                    "source":" 第一财经日报",
                    "time":" 2013-08-30 09:31"
                    },
                    {
                    "companyId":"1",
                    "title":"基汇资本证实中国平安2.6亿英镑买劳合社大楼",
                    "link":" http://house.focus.cn/news/2013-07-10/3592683.html",
                    "summary":" 已成功代表中国平安保险集团股份有限公司，以2.6亿英镑向德国Commerzbank银行收购劳合社大楼(Lloyd’s Building)。7月8日媒体消息，中国平安保险集团股份有限公司已从德国卖家手中购得伦敦金融城的标志性建筑劳合社大楼(Llyords Building)，成交价为2.6亿英镑。而中国平安买下的这…",
                    "source":" 观点地产网",
                    "time":" 2013-07-10 09:41"
                    },
                    {
                    "companyId":"1",
                    "title":" 上海家化高管与大股东中国平安矛盾再升级",
                    "link":" http://house.focus.cn/news/2013-05-14/3281069.html",
                    "summary":" 其高管与大股东中国平安的矛盾再度升级。昨晚，北京商报记者从上海家化和中国平安保险（集团）股份有限公司（以下简称'中国平安'）方面均获得证实，葛文耀已经被撤销上海家化集团董事长一职，但仍保留上市公司董事长的职务。 虽然从去年以来，上海家化与其控制人中国平安的矛盾…",
                    "source":" 北京商报",
                    "time":" 2013-05-14 09:26"
                      }]
                         }
        }
    response = jsonpickle.encode(response, unpicklable=False)
    return response
 
    
@staticmethod
@get('/ekb/contact/<id>/overview') 
def getContactOverview(id):
    response = {
           "error":False,
           "errorType":None,
           "errorMessage":"",
           "data":{
                "personData": {
                    "isUserContributedLinkedInProfile" : "",
                    "employmentId" : "10175557",#person_employment_fact
                    "firstName": "Simon",#person
                    "lastName": "Stanlake",#person
                    "fullName": "Simon Stanlake",#person
                    "linkedInProfileUrl" : "",
                    "company": { "id" : "2867257", "name" : "HootSuite Media, Inc."},#person_employment_fact
                    "executiveId" : "9440492",
                    "phone": "+1.415.827.6170",#comm_media person_comm_media_fact
                    "email": "brian.bailard@hootsuite.com",#comm_media person_comm_media_fact
                    "position": "CTO",#person_employment_fact
                    "department": "R&D",
                    "companyName" : "HootSuite Media",#person_employment_fact
                    "companyId" : "2867257",#person_employment_fact
                    "curEmployments" : [{'id':'10175557','name':'HootSuite Media, Inc.'}],
                    "otherCurEmployments" : [{'id':'732083','name':'Juniper Networks, Inc.'}],
                    "pastEmployments":[{'id':'30335','name':'Socialtext Incorporated '},{'id':'726499','name':'Lyris, Inc.'},{'id':'918909','name':'PS&#039;SOFT, Inc.'},{'id':'2545378','name':'Financial Crossing, Inc.'},{'id':'27622','name':'Quovera, Inc.'},{'id':'56741','name':'BDNA Corporation'}],
                    "smallerFrame" : False,
                    "twitterLoggedIn" : True,
                    "twitterHandle": "sedsimon",
                    "facebookHandle" : "100000601339594",
                    "facebookLoggedIn" :True,
                    "imageUrl": "https://d1tzls7byl3ryp.cloudfront.net/iv/profileImages/executiveImage/361219",
                    "imageAvailable" : True,
                    }
                }
        }
    response = jsonpickle.encode(response, unpicklable=False)
    return response

    
@staticmethod
@get('/ekb/contact/<id>/news') 
def getContactNews(id):
    response = {
           "error":False,
           "errorType":None,
           "errorMessage":"",
           "data":[
              {
                 "id":"_10602355857",
                 "companyName":"",
                 "companyId":"",
                 "employmentId":0,
                 "stockSymbol":"",
                 "documentTitle":"Whoops: HootSuite sends recruiting email to competitor’s CEO",
                 "documentType":"News",
                 "filingType":"",
                 "date":"Dec 12, 2013 2:35:00 PM",
                 "webUrl":"http://c.moreover.com/click/here.pl?z10602355857\u0026z\u003d1600249505",
                 "sortDate":"20131212",
                 "source":"PandoDaily",
                 "documentSummary":"",
                 "documentContent":"",
                 "xmlFragment":"",
                 "textNodeValue":"",
                 "sourceAccessStatus":0
              }
           ]
        }
    response = jsonpickle.encode(response, unpicklable=False)
    return response


@staticmethod
@get('/ekb/contact/<id>/education') 
def getContactEducation(id):
    response = {
           "error":False,
           "errorType":None,
           "errorMessage":"",
           "data":{
                "education":[
                    {
                     "schoolId": 1219688,
                    "schoolName": "Ohio University",
                    "diploma": "Bachelor of Arts"
                    },
                    {
                     "schoolId": 14560,
                    "schoolName": "Drexel University",
                    "diploma": "Master of Business Administration"
                     }]
            }
        }
    response = jsonpickle.encode(response, unpicklable=False)
    return response


@staticmethod
@get('/ekb/globalsearch/companies')
def globalSearchCompanies():
 
    response = {
           "error":False,
           "errorType":None,
           "errorMessage":"",
           "data":{    
                "total": 4611,
                "companies":[
                    {
                    "location":"Los Angeles, CA, United States ",
                    "type":"Private",
                    "connectionCount":0,
                    "companyName":"    The Automobile Club of Southern California",
                    "companyId":35252,
                    "website": "http://www.aaa-calif.com",
                    "ticker":"",
                    "employees":"8,051",
                    "revenue":"500.0M",
                    "smartAgentInfo":None
                    },
                    {
                    "location":"Walnut Creek, CA, United States ",
                    "type":"Private",
                    "connectionCount":0,
                    "companyName":"AAA Northern California, Nevada and Utah Insurance Exchange",
                    "companyId":36859,
                    "website": "www.csaa.com",
                    "ticker":"",
                    "employees":"6,500",
                    "revenue":"438.4M",
                    "smartAgentInfo":None
                    },
                    {
                    "location":"Tampa, FL, United States",
                    "type":"Aquired",
                    "connectionCount":0,
                    "companyName":"AAA Auto Club South, Inc.",
                    "companyId":640325,
                    "website": "www.aasouth.com",
                    "ticker":"",
                    "employees":"3,300",
                    "revenue":"198.0M",
                    "smartAgentInfo":None
                    }]
                }
        }
    response = jsonpickle.encode(response, unpicklable=False)
    return response


@staticmethod
@get('/ekb/globalsearch/people')
def globalSearchPeople():
    response = {
           "error":False,
           "errorType":None,
           "errorMessage":"",
           "data":{    
                "total": 629,
                "people":[
                    {
                    "current":True,
                    "connectionCount":0,
                    "fullName":"Chris Simpson",
                    "companyName":"The Automobile Club of Southern California",
                    "displayTitle":"Managing Director of Enterprise Applications",
                    "companyId":35252,
                    "employmentId":8021384,
                    "executiveId":8026433,
                    "smartAgentInfo":None
                    },
                    {
                    "current":True,
                    "connectionCount":0,
                    "fullName":"Chris Simpson",
                    "companyName":"The Automobile Club of Southern California",
                    "displayTitle":"Chief Financial Officer",
                    "companyId":35252,
                    "employmentId":8003870,
                    "executiveId":8008919,
                    "smartAgentInfo":None
                    },
                    {
                    "current":True,
                    "connectionCount":0,
                    "fullName":"Steve Roy",
                    "companyName":"AAA Cooper Transportation, Inc.",
                    "displayTitle":"Vice President Administration, Chief Financial Officer, Treasurer, and Corporate Secretary",
                    "companyId":18827,
                    "employmentId":7798238,
                    "executiveId":7802287,
                    "smartAgentInfo":None
                    }
                ]
            }
        }
    response = jsonpickle.encode(response, unpicklable=False)
    return response

    
