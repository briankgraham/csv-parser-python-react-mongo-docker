
from flask import Blueprint, request, jsonify, redirect, g
import logging
import time

import api.constants as constants
from ..data_sets import *
from ..utils import sanitize_result

app = Blueprint('data_sets', __name__)

@app.route("", methods=['POST'])
def route_create_data_set():
    params = request.get_json()
    data_set = create_data_set(g.db, params['title'])
    return jsonify({'result': sanitize_result(data_set)})

@app.route("", methods=['GET'])
def route_list_data_sets():
    data_sets = list(list_data_sets(g.db))
    return jsonify({
        'result': sanitize_result(data_sets)
    })

@app.route("/<data_set_id>", methods=['GET'])
def route_get_data_set(data_set_id):
    data_set = get_data_set(g.db, data_set_id)
    return jsonify({
        'result': sanitize_result(data_set)
    })

@app.route("/<data_set_id>", methods=['POST'])
def route_update_data_set(data_set_id):
    data_set = get_data_set(g.db, data_set_id)
    params = request.get_json()
    valid_fields = [
        'email',
        'first_name',
        'last_name',
        'title'
    ]
    for key in params:
        if key not in valid_fields:
            raise Exception('Not a valid updateable field: {}'.format(key))
        if key == 'title' and len(params['title']) == 0:
            raise Exception('Field title cannot be blank')
        data_set[key] = params[key]
    save_data_set(g.db, data_set)
    return jsonify({'result': sanitize_result(data_set)})

@app.route("/<data_set_id>", methods=['DELETE'])
def route_remove_data_set(data_set_id):
    data_set = get_data_set(g.db, data_set_id)
    if not data_set:
        raise Exception('Data set not found')
    remove_data_set_people(g.db, str(data_set['_id']))
    remove_data_set(g.db, str(data_set['_id']))
    return jsonify({'result': {'success': True}})
