
import os
import sys
import logging

logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s')

logger = logging.getLogger()
logger.setLevel(logging.INFO)

ENVIRONMENT = os.getenv('PYTHON_ENV', 'test')
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017/')
MONGO_DB = os.getenv('MONGO_DB', 'api_' + ENVIRONMENT)

APP_NAME = 'rolodex.ai'
APP_HOST = 'admin.rolodex.ai'
if ENVIRONMENT == 'development':
    APP_HOST = 'admin.rolodex.localhost:9922'
JWT_SECRET = 'Jc3$hm_r9t'
