# ----------------------------------------------------------
# transform kml path for testdata
# ----------------------------------------------------------


from pykml.factory import KML_ElementMaker as KML
from lxml import etree
import random
import xml.etree.ElementTree as ET
import csv
import time
import json
from pprint import pprint


# Return a list of all Polygon for each Kreis
coord = {}
kNrList = []
with open('Pfad.kml', 'r') as f:
    tree = ET.parse(f)
    root = tree.getroot()
    coords = root[0][4][2][1].text
    coordslist = coords.split()
    #print(root[0][4][2][1].text)
    #print(coordslist[0])
    #print(len(coordslist), 'hi')
    dataset = []
    timeshift_ms = 10000  # added time between each point
    for n in range(len(coordslist)):
        c = coordslist[n].split(",")
        timestamp = int(round(time.time() + n * timeshift_ms))
        #print(timestamp)
        #print(c)
        data = {


                    'heading': None,



                }
        #json_str = json.dumps(data)
        #print(json_str)
        d = json.dumps({'timestamp': timestamp,
                        'coords': {'accuracy': 0,
                                   'altitude': None,
                                   'altitudeAccuracy': None,
                                   'heading': None,
                                   'latitude': float(c[1]),
                                   'longitude': float(c[0]),
                                   'speed': None}
                        }, sort_keys=False)
        dataset.append(d)
        #print(data)

set = str(dataset).replace("', '", ",").replace("['{", "[{").replace("}']", "}]").replace("[{", "'[{").replace("}]", "}]'")

print(set)

# write file
with open('data.js', 'w') as outfile:
    outfile.write(set)

# now copy the text from this file in your '...' from the sample datastring
