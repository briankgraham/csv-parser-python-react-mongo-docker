import os
import sys
import unittest
import json
my_dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(my_dir + '/../../')
sys.path.append(my_dir + '/../')

from utils import *
db = setup_mock_db()
app = create_flask_app(mock=True, db=db)

from api.routes.data_sets import app as data_sets_app
app.register_blueprint(data_sets_app, url_prefix='/1/data_sets')

from api.data_sets import *

class RoutesDataSetsTest(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def test_crud(self):

        params = {
            'title': 'DataSet 1'
        }

        # Create data_set
        error, result = api_post(self.app, '/1/data_sets', params)
        self.assertEquals(error, None)
        self.assertEquals(result['title'], params['title'])
        data_set = result

        params = {
            'title': 'Funky'
        }

        # Get data_set
        error, result = api_get(self.app, '/1/data_sets/{}'.format(data_set['_id']))
        self.assertEquals(error, None)
        self.assertEquals(result['_id'], str(data_set['_id']))

        # List data_sets
        error, result = api_get(self.app, '/1/data_sets')
        self.assertEquals(error, None)
        self.assertEquals(result[0]['_id'], str(data_set['_id']))

        # Update data_set
        error, result = api_post(self.app, '/1/data_sets/{}'.format(data_set['_id']), params)
        self.assertEquals(error, None)
        error, result = api_get(self.app, '/1/data_sets/{}'.format(data_set['_id']))
        self.assertEquals(error, None)
        self.assertEquals(result['title'], 'Funky')

        # Delete data_set
        error, result = api_post(self.app, '/1/data_sets/{}'.format(data_set['_id']), params={'confirm': True}, delete=True)
        self.assertEquals(error, None)

if __name__ == "__main__":
    unittest.main()
