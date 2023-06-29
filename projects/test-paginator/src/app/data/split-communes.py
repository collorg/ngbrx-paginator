#!/usr/bin/env python

import json
import os

with open('communes.json') as communes:
    data_s = communes.read()
    data = json.loads(data_s)
    dept = ''
    output = None
    liste_communes_dept = []
    for commune in data:
        if commune['departement'] != dept:
            if liste_communes_dept:
                if dept == '49':
                    print(liste_communes_dept)
                output.write(json.dumps(liste_communes_dept))
                output.close()
            dept = commune['departement']
            file_name = f'communes-{dept}.json'
            mode = 'w'
            if os.path.exists(file_name):
                mode = 'w+'
            output = open(file_name, mode, encoding='UTF-8')
            liste_communes_dept = []
        liste_communes_dept.append(commune)
    output.write(json.dumps(liste_communes_dept))
