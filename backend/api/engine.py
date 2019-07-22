import json

def dump_bson_list(items):
    for item in items:
        del item['_id']
    print(json.dumps(items))
