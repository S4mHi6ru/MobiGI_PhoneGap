# ----------------------------------------------------------
# Geomatik Seminar G5 - 2013
# Created on 15.10.2015 by Samuel Hirsbrunner, Martin Jung
# Version 2.5
# Latest Change 30.10.15
# ----------------------------------------------------------


# import pykml
# from pykml.factory import ATOM_ElementMaker as ATOM
# from pykml.factory import GX_ElementMaker as GX
# from pykml.factory import write_python_script_for_kml_document
# from pykml import parser
from pykml.factory import KML_ElementMaker as KML
from lxml import etree
import random
import xml.etree.ElementTree as ET
import csv


# ===================================================================================================================
# Definition Klassen & Funktion
# -------------------------------------------------------------------------------------------------------------------

class KMLfile:
    def __init__(self):

        super().__init__()
        # Variablen definieren
        # self.coordlist = self.getCoordList()
        # self.pmName = 'Hunde'
        self.uef = 50000  # Ueberhoehungsfaktor

    def getKreisPolygon(self):
        # Return a list of all Polygon for each Kreis
        coord = {}
        kNrList = []
        with open('stadtkreise.kml', 'r') as f:
            tree = ET.parse(f)
            root = tree.getroot()
            for i in range(1, 13, 1):
                kPath = root[0][4][i][4][0][0]
                kNr = kPath.text
                kNrList.append(kNr)
                # print('kml', kNr)
                for n in root[0][4][i][5][0][0]:  # [] > navigation durch Ebenen
                    coordinates = n.text
                    coord['geomK' + str(kNr)] = coordinates
                    # print('tag', n.tag,'text ', n.text)
        # print(kNrList, 'knrlist')
        # print('key normal', (coord.keys()))
        # print('key sorted ', sorted(coord.keys(), key=int))  # to sort this way it works only with int as key
        # coordsort = {}
        return coord

    def getManipulateCoords(self, geom):
        # polygon geometry manipulieren -> Hoehe mit Statistikwert verseehn
        geomO = geom  # import oiginal geom
        geomM = {}  # dict mit manipulierten geom
        faktor = self.uef  # Ueberhoehungsfaktor
        stZ = []  # Zaehler fuer Kreise
        stWert = {}  # Anz. Hunde nach Kreis
        stSum = 0  # Summe aller Hunde
        stP = {}  # Hochwert fuer Polygon

        with open('Hunderegister.csv', 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter=',')
            for datensatz in reader:
                Stadtkreise = datensatz[3]
                # noinspection PyBroadException
                try:
                    stZ += [int(Stadtkreise)]
                except:
                    pass

        for i in range(1, 13, 1):
            name = 'Kreis' + str(i)  # HK -> Hunde pro Kreis
            val = stZ.count(i)
            stSum += val
            stWert[str(name)] = val
        # print(stWert)

        for i in range(1, 13, 1):
            name = 'P' + str(i)
            val = stWert['Kreis' + str(i)] / stSum * faktor
            stP[str(name)] = val

        # print('new HK11', stWert['HK11'])
        # print('new p3', stP['P3'])
        # print('new K3 ori', geomO['geomK3'][:100])

        for i in range(1, 13, 1):
            nameGeom = 'geomK' + str(i)
            nameP = 'P' + str(i)
            nameK = 'Kreis' + str(i)
            valNew = ',' + str(stP[nameP])
            txt = str(geomO[nameGeom]).replace(',0', valNew)
            geomM[nameK] = txt
            # print('new Zwert', valNew, type(valNew)
        # print('new Kreis3', geomM)
        return geomM, stWert

    def getKMLColor(self):
        r = lambda: random.randint(30, 235)
        g = lambda: random.randint(30, 235)
        b = lambda: random.randint(30, 235)
        o = lambda: 0.8 * 255  # transparenz: prozent * 255 Farbwerte
        # custom values
        # print('7d%02X%02X%02X' % (r(),r(),r()))
        # opacity = '7d', blue = 'ff' green = '00' red = '00'
        colorpoly = ('%02X%02X%02X%02X' % (o(), b(), g(), r()))  # OOBBGGRR
        colortxt = (colorpoly[6:8] + colorpoly[4:6] + colorpoly[2:4])  # RRGGBB
        # print('color', colorpoly, colortxt)
        return colorpoly, colortxt

    def createPlacemarker(self, kmlname, kmlcolor, kmlcount, coords):
        pmcoords = coords  # str(coords).rstrip('\n')
        kmldescr = kmlcount
        colorpoly, colortxt = kmlcolor
        # kmlnamep = kmlname
        kmlnamef = '<h2 align="center" style="color:#' + colortxt + '">' + kmlname[:5] + ' ' + kmlname[5:] + '</h2>'
        descript = ('<table> '
                    '<tr>'
                    '<td><b>Anzahl Hunde: </b></td>'
                    '<td align="right"><b>' + str(kmldescr) + '</b></td>'
                                                              '</tr>'
                                                              '<tr>'
                                                              '<td>&Uuml;berh&ouml;hungsfaktor: </td>'
                                                              '<td align="right">' + str(self.uef) + '</td>'
                                                                                                     '</tr>'
                                                                                                     '</tr>'
                                                                                                     '<tr>'
                                                                                                     '<td>Datenquelle: </td>'
                                                                                                     '<td align="right"><a href="https://data.stadt-zuerich.ch/">OpenData Z&uuml;rich</a></td>'
                                                                                                     '</tr>'
                                                                                                     '</table>')

        pm1 = KML.Placemark(
            KML.name(kmlnamef),
            KML.description(descript),
            KML.Style(
                KML.PolyStyle(
                    KML.color(colorpoly),
                ),
                KML.LineStyle(
                    KML.width('0'),
                    KML.color(colorpoly),
                ),
                KML.BalloonStyle(
                    KML.displayMode('default')
                ),
            ),
            KML.Polygon(
                KML.extrude(1),
                KML.tessellate(0),
                KML.altitudeMode('relativeToGround'),
                KML.outerBoundaryIs(
                    KML.LinearRing(
                        KML.coordinates(pmcoords)
                    )
                ),
            ),
        )

        return pm1

    def createFolder(self, datenliste):
        coords, counter = datenliste  # trennen der datenliste, coords und Anz. Hunde
        # print('hunde', stWert)
        fld = KML.Folder(KML.name('KMLstatVis'))
        # print(datenliste['Kreis5'])
        # print(liste['Kreis' + str(i)])
        for i in range(1, 13, 1):
            name = 'Kreis' + str(i)
            color = self.getKMLColor()
            print(name, 'is saved to file')
            fld.append(self.createPlacemarker(name, color, counter[name], coords[name]))
            # print(datenliste['Kreis' + str(i)])
            # print(self.datenliste(i))
            # print(datenliste[name])
            # print(self.createPlacemarker(name, datenliste['Kreis' + str(i)]))
            # self.fld.append(self.createPlacemarker(name, datenliste['Kreis' + str(i)]))
        # print(etree.tostring(self.fld, pretty_print=True))
        return fld

    def createEmptyKML(self):
        kml_str = '<?xml version="1.0" encoding="UTF-8"?>' \
                  '<!-- Generated by Feature Manipulation Engine 2012 SP2 (Build 12238) -->' \
                  '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:gx="http://www.google.com/kml/ext/2.2">' \
                  '<Document>' \
                  '<name>doc</name>' \
                  '<visibility>0</visibility>' 

        return kml_str

    def matchOutput(self):
        # tostring(element_or_tree, encoding=None, method="xml", xml_declaration=None,
        # pretty_print=False, with_tail=True, standalone=None, doctype=None, exclusive=False,
        # with_comments=True, inclusive_ns_prefixes=None)

        kmlstart = self.createEmptyKML()
        kmlfolder = str(
            etree.tostring(self.createFolder(self.getManipulateCoords(self.getKreisPolygon())), doctype=kmlstart))
        kmlfolder2 = kmlfolder.replace("b'<?xml", '<?xml').replace("</Folder>'", "</Folder>")
        kmlend = '</Document>' \
                 '</kml>'

        print('file creation finished. open in google earth')

        return "{0}{1}".format(kmlfolder2, kmlend)


# ===================================================================================================================
# Funktionsaufruf und Ausgabe in Datei
# -------------------------------------------------------------------------------------------------------------------


A = KMLfile()
filetxt = A.matchOutput()

file = open('file_v2.5.kml', mode='w')
file.write(filetxt)
file.close()
