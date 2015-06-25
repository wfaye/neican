from orm import dblayer

class BLGroupManager(object):
    @staticmethod
    def get_system_group_list():
        return dblayer.DLGroupManager.get_system_group_list()
    
    @staticmethod
    def get_org_list_by_sysgroup(group_id, page_num):
        return dblayer.DLGroupManager.get_org_list_by_sysgroup(group_id, page_num)
    
    @staticmethod
    def get_user_group_list(user_id):
        return dblayer.DLGroupManager.get_user_group_list(user_id)
    
    @staticmethod
    def add_user_group(user_id, group_json):
        return dblayer.DLGroupManager.add_user_group(user_id, group_json)
    
    @staticmethod
    def remove_user_group(user_id, org_group_id):
        return dblayer.DLGroupManager.remove_user_group(user_id, org_group_id)
        
    @staticmethod
    def update_user_group(org_group_id, group_json):
        return dblayer.DLGroupManager.update_user_group(org_group_id, group_json)
    
    
    @staticmethod
    def get_org_list_by_group(in_group_id, in_page_num):
        return dblayer.DLGroupManager.get_org_list_by_group(in_group_id, in_page_num)
    
    @staticmethod
    def add_user_group_org(org_group_id, org_key):
        return dblayer.DLGroupManager.add_user_group_org(org_group_id, org_key)
    
    @staticmethod
    def del_user_group_org(org_group_id, org_key):
        return dblayer.DLGroupManager.del_user_group_org(org_group_id, org_key)