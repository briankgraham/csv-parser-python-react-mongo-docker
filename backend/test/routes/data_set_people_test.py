import os
import sys
import unittest
import json
sys.path.append(os.path.dirname(os.path.realpath(__file__)) + '/../../')
sys.path.append(os.path.dirname(os.path.realpath(__file__)) + '/../')

from utils import *
db = setup_mock_db()
app = create_flask_app(mock=True, db=db)

from api.routes.data_set_people import app as data_set_people_app
app.register_blueprint(data_set_people_app, url_prefix='/1')

from api.data_sets import *

class RoutesDataSetPeopleTest(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()

    def test_crud(self):
        data_set = create_data_set(db, 'Data Set 1')
        data_set_id = str(data_set['_id'])

        # Create data_set person
        params = {
            'fields': {
                'email': 'me@fakeme.ai',
                'first_name': 'Sam',
                'last_name': 'Barry'
            }
        }
        error, result = api_post(self.app, '/1/data_sets/{}/people'.format(data_set_id), params)
        self.assertEquals(error, None)
        self.assertEquals(result['email'], 'me@fakeme.ai')
        self.assertEquals(result['first_name'], 'Sam')
        data_set_person = result

        # Get data_set person
        error, result = api_get(self.app, '/1/data_sets/{}/people/{}'.format(data_set_id, data_set_person['_id']))
        self.assertEquals(error, None)
        self.assertEquals(result['_id'], str(data_set_person['_id']))

        # List data_set people
        error, result = api_get(self.app, '/1/data_sets/{}/people'.format(data_set_id, data_set_person['_id']))
        self.assertEquals(error, None)
        self.assertEquals(len(result), 1)

        # List data_set people (offset)
        error, result = api_get(self.app, '/1/data_sets/{}/people?offset=10'.format(data_set_id, data_set_person['_id']))
        self.assertEquals(error, None)
        self.assertEquals(len(result), 0)

        params = {
            'fields': {
                'first_name': 'Kerri'
            }
        }

        # Update data_set person
        error, result = api_post(self.app, '/1/data_sets/{}/people/{}'.format(data_set_id, data_set_person['_id']), params)
        self.assertEquals(error, None)
        error, result = api_get(self.app, '/1/data_sets/{}/people/{}'.format(data_set_id, data_set_person['_id']))
        self.assertEquals(error, None)
        self.assertEquals(result['first_name'], 'Kerri')

        # Delete data_set person
        error, result = api_post(self.app, '/1/data_sets/{}/people/{}'.format(data_set_id, data_set_person['_id']), params={'confirm': True}, delete=True)
        self.assertEquals(error, None)


if __name__ == "__main__":
    unittest.main()
