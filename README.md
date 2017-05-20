# MobiGI: PhoneGap
FHNW MSE Kurzprojekt

### LBS / Sensordaten: PhoneGap LBS App zur Sammlung und Annotation von Sensordaten 
Mit der in der LBS Vorlesung vorgestellten Entwicklungsumgebung PhoneGap soll eine App erstellt werden,
        die Sensordaten des mobilen Gerätes (wie GPS, Schrittzähler, Accelerometer) als Service im Hintergrund 
        (mit Focus auf Android) sammelt und dem Benutzer ermöglicht die Aktivitäten wie zum Beispiel Gehen, Arbeiten,
        Fahrradfahren, Einsteigen in der App zu annotieren.
        Als zusätzliche Funktion sollte die erstellte App ermöglichen den Datensatz mit den Sensordaten und
        den Aktivitäten als .csv zu exportieren. Zusätzlich, bei genügender Zeit könnte ein Demodatensatz erstellt und
        in R visualisiert werden.
        
#### Umsetzung
- [ ] Sensordaten aufzeichnen  
  - [x] Positionsdaten (GPS / GNSS)
  - [ ] ~~Schrittzähler (Pedometer)~~
  - [ ] ~~Accelerometer~~
- [x] Aktivitäten wählbar
- [x] Daten exportieren
  - [ ] ~~Daten können als .csv exportiert werden~~
  - [x] Daten können angezeigt und kopiert werden
- [x] Visualisierung auf Karte / Google Maps (zusätzlich)
- [ ] ~~Visualisierung in R (optional)~~

## Supported Platforms
* Android

## Installation
APK-Datei für direkte Installation auf Smartphone:
    
    https://build.phonegap.com/apps/2621572/share

### Autoren
S. Hirsbrunner und C. Zbinden

### Restrictions
Support for Android Phones only.

### Code Reference:
    https://code.tutsplus.com/tutorials/build-an-exercise-tracking-app-geolocation-tracking--mobile-11070
    https://code.tutsplus.com/tutorials/build-an-exercise-tracking-app-persistence-graphing--mobile-11074
    http://www.movable-type.co.uk/scripts/latlong.html