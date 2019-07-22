from flask import request, jsonify, redirect, g, Response
import json

class NotFoundError(Exception):

    def __init__(self, object_type, object_id):
        message = 'Could not find {} with ID {}'.format(object_type, object_id)
        super(Exception, self).__init__(message)

def sanitize_result(result):
    if type(result) == type([]):
        for item in result:
            if item.has_key('_id'):
                item['_id'] = str(item['_id'])
    else:
        if result and result.has_key('_id'):
            result['_id'] = str(result['_id'])
    return result
