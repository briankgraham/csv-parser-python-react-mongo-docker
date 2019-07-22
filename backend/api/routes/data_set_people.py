
from flask import Blueprint, request, jsonify, redirect, g
import logging
import time

import api.constants as constants
from ..data_sets import *
from ..utils import sanitize_result

app = Blueprint('data_set_people', __name__)

def ensure_data_set(data_set_id):
    data_set = get_data_set(g.db, data_set_id)
    if not data_set:
        raise Exception('Model with ID {} does not exist'.format(data_set_id))
    return data_set

@app.route("/data_sets/<data_set_id>/people", methods=['POST'])
def route_create_data_set_people(data_set_id):
    params = request.get_json()
    data_set = ensure_data_set(data_set_id)
    data_set_people = create_data_set_people(g.db, data_set_id, **params['fields'])
    return jsonify({'result': sanitize_result(data_set_people)})

@app.route("/data_sets/<data_set_id>/people", methods=['GET'])
def route_list_data_set_people(data_set_id):
    data_set = ensure_data_set(data_set_id)
    offset = 0
    limit = 1000
    sortBy = 'created_ts'
    sortDirection = 'desc'
    if request.args.get('offset', None):
        offset = int(request.args.get('offset', '0'))
    if request.args.get('limit', None):
        limit = int(request.args.get('limit', '0'))
    if request.args.get('sortBy', None):
        sortBy = request.args.get('sortBy')
    if request.args.get('sortDirection', None):
        sortDirection = request.args.get('sortDirection')
    query = {'data_set_id': data_set_id}
    sortDirectionInt = -1
    if sortDirection == 'asc':
        sortDirectionInt = 1
    sort = [[sortBy, sortDirectionInt]]
    data_set_people = list_data_set_people(g.db, query, offset, limit, sort)
    return jsonify({
        'result': sanitize_result(list(data_set_people)),
        'total': g.db.data_set_people.count(query)
    })

@app.route("/data_sets/<data_set_id>/people/<data_set_people_id>", methods=['GET'])
def route_get_data_set_people(data_set_id, data_set_people_id):
    data_set = ensure_data_set(data_set_id)
    data_set_people = get_data_set_people(g.db, data_set_people_id)
    return jsonify({
        'result': sanitize_result(data_set_people)
    })

@app.route("/data_sets/<data_set_id>/people/<data_set_people_id>", methods=['POST'])
def route_update_data_set_people(data_set_id, data_set_people_id):
    data_set = ensure_data_set(data_set_id)
    data_set_people = get_data_set_people(g.db, data_set_people_id)
    params = request.get_json()
    fields = params['fields']
    for key in fields:
        if key in ['_id', 'data_set_id']:
            continue
        data_set_people[key] = fields[key]
    save_data_set_people(g.db, data_set_people)
    return jsonify({'result': sanitize_result(data_set_people)})

@app.route("/data_sets/<data_set_id>/people/<data_set_people_id>", methods=['DELETE'])
def route_remove_data_set_people(data_set_id, data_set_people_id):
    data_set = get_data_set(g.db, data_set_id)
    data_set_people = get_data_set_people(g.db, data_set_people_id)
    remove_data_set_people(g.db, data_set_people['_id'])
    return jsonify({'result': {'success': True}})
