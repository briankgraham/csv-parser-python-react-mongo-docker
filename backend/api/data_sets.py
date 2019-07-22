
from bson.objectid import ObjectId
import md5
import time
import constants
import datetime
from copy import deepcopy
from utils import sanitize_result

def _set_data_set_defaults(doc):
    doc['created_ts'] = time.time()

def create_data_set(db, title, **kwargs):
    doc = {}
    _set_data_set_defaults(doc)
    for key in kwargs:
        doc[key] = kwargs[key]
    doc['title'] = title
    job = db.data_sets
    inserted_id = job.insert_one(doc).inserted_id
    return get_data_set(db, inserted_id)

def remove_data_set(db, id):
    job = db.data_sets
    return job.remove({'_id': ObjectId(id)})

def get_data_set(db, id):
    job = db.data_sets
    return job.find_one({'_id': ObjectId(id)})

def save_data_set(db, data_set):
    job = db.data_sets
    return job.save(data_set)

def list_data_sets(db, **kwargs):
    collection = db.data_sets
    return list(collection.find(kwargs))

def _set_data_set_people_defaults(doc):
    doc['created_ts'] = time.time()

def create_data_set_people(db, data_set_id, **kwargs):
    doc = {}
    _set_data_set_people_defaults(doc)
    for key in kwargs:
        doc[key] = kwargs[key]
    doc['data_set_id'] = str(data_set_id)
    job = db.data_set_people
    inserted_id = job.insert_one(doc).inserted_id
    return get_data_set_people(db, inserted_id)

def remove_data_set_people(db, id):
    job = db.data_set_people
    return job.remove({'_id': ObjectId(id)})

def remove_data_set_people(db, id):
    job = db.data_set_people
    return job.delete_many({'data_set_id': id})

def get_data_set_people(db, id):
    job = db.data_set_people
    return job.find_one({'_id': ObjectId(id)})

def save_data_set_people(db, data_set_people):
    job = db.data_set_people
    return job.save(data_set_people)

def list_data_set_people(db, query, offset=0, limit=100, sort=[['createdTs', -1]]):
    collection = db.data_set_people
    return collection.find(query).skip(offset).limit(limit).sort(sort)
