#!/usr/bin/env python

import json
import os

keys = ['code', 'nom', 'departement', 'population']

communes = []
with open('communes.json') as file_:
    data_s = file_.read()
    data = json.loads(data_s)
    for item in data:
        commune = {}
        for key in keys:
            commune[key] = item.get(key, 0)
        communes.append(commune)
print("export const communes = ", json.dumps(communes))
