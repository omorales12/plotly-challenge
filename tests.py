from pprint import pprint
import json

with open('samples.json') as f:
    data = json.load(f)

pprint(data["samples"][0]["sample_values"])