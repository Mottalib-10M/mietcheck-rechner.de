#!/usr/bin/env python3
"""Hamburger Mietenspiegel 2025 : données ouvertes (Datenlizenz Deutschland – Namensnennung 2.0,
Transparenzportal Hamburg), recoupées avec la Mietenspiegel-Tabelle PDF. Source relevée dans
data-src/mietspiegel/hamburg-quelle.json ; écrit src/data/mietspiegel/hamburg.json."""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
q = json.load(open(os.path.join(ROOT, 'data-src/mietspiegel/hamburg-quelle.json'), encoding='utf-8'))
def fl(s):
    m = re.fullmatch(r'bis unter (\d+)', s)
    if m: return [0, int(m.group(1))]
    m = re.fullmatch(r'(\d+) bis unter (\d+)', s)
    if m: return [int(m.group(1)), int(m.group(2))]
    m = re.fullmatch(r'ab (\d+)', s)
    if m: return [int(m.group(1)), None]
    raise SystemExit(s)
felder = [{'feld': f['feld'], 'lage': f['wohnlage'], 'baualter': f['spalte'], 'flaeche': fl(f['wohnflaeche_m2']),
           'unten': f['spanne_min'], 'mittel': f['mittelwert'], 'oben': f['spanne_max']} for f in q['data']['felder'] if not f.get('leer')]
assert len(felder) == 88, len(felder)
for f in felder: assert f['unten'] <= f['mittel'] <= f['oben'], f
out = {'stadt': 'Hamburg', 'ausgabe': q['edition'], 'stichtag': q['stichtag'], 'gueltig_ab': q['gueltig_ab'], 'qualifiziert': True,
       'herausgeber': q['herausgeber'], 'lizenz': 'Datenlizenz Deutschland – Namensnennung – Version 2.0', 'url_seite': q['url_seite'], 'url_pdf': q['url_pdf'],
       'url_open_data': q['url_open_data'], 'wohnlagen_url': q['data']['wohnlage']['verzeichnis_pdf'], 'baualter': q['data']['spalten_baualter'], 'felder': felder}
json.dump(out, open(os.path.join(ROOT, 'src/data/mietspiegel/hamburg.json'), 'w'), ensure_ascii=False, indent=1)
print('hamburg.json :', len(felder), 'Felder')
