import redis


SIMPLE_WEBSERVER = False
REDIS_DB = 0
REDIS_PWD_FORGOT_DB = 1
REDIS_PORT = 6379
REDIS_HOST = '192.168.30.173'

rdb = None
app = None

EC_SUCCESS = 0
EC_USER_NOT_FOUND = 1
EC_NOT_IMPLEMENTED = 2

session_opts = {
    'session.type': 'redis',
    'session.cookie_expires': 7200,
    'session.url': REDIS_HOST+':'+str(REDIS_PORT),
    'session.key': 'yunti',
    'session.auto': False
}


def create_redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB):
    rdb = redis.Redis(host, port, db)
    return rdb

