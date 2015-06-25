'''
Created on May 19, 2013

@author: lyb
'''
import domain
from yunti import rdb, EC_NOT_IMPLEMENTED
from messages.domain import STATUS_SENT_FAILURE, STATUS_SENT_SUCCESS
import string

r = rdb

class Dispatcher(object):
    @staticmethod
    def send_yun_message(recepient, compund_message):
        method = r.get("outmessage:id:"+str(compund_message)+":method")
        subject = r.get("outmessage:id:"+str(compund_message)+":subject")
        content = r.get("outmessage:id:"+str(compund_message)+":content")
        
        user = domain.User.find_by_username(recepient)
        inmessage_id = domain.InMessage.create(user, string.atoi(method), subject, content)
        if inmessage_id:
            return STATUS_SENT_SUCCESS
        else:
            return STATUS_SENT_FAILURE
        
    
    @staticmethod
    def send_sms(recepients, message):
        pass
    
    @staticmethod
    def send_email(recepients, subject, compound_message):
        pass
    
    
    def dispatch(self, recepients, outmessage):
        method = r.get("outmessage:id:"+str(outmessage)+":method")
        for recepient in recepients:
            if string.atoi(method) == 1:
                rc = Dispatcher.send_yun_message(recepient, outmessage)
                return rc
            elif string.atoi(method) == 2:
                pass
            elif string.atoi(method) == 3:
                pass
        return EC_NOT_IMPLEMENTED
        
        
        
dispatcher = Dispatcher()