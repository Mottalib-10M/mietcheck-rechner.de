#!/usr/bin/env python3
"""Registre des villes (src/data/staedte.json) depuis les relevés data-src/mietspiegel/<id>-quelle.json.
Chaque relevé cite l'édition, la validité, l'éditeur et la clause de droits lue dans le PDF ou l'Impressum.
Schéma : 'berlin', 'hamburg' et 'dortmund' calculés (reprise permise), sinon 'eingabe' (valeur saisie par l'utilisateur)."""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# id : (Land, nom de la commune dans la Verordnung, schéma)
VILLES = {
  'berlin': ('BE', 'Berlin', 'berlin'), 'hamburg': ('HH', 'Hamburg', 'hamburg'), 'dortmund': ('NW', 'Dortmund', 'dortmund'), 'muenchen': ('BY', 'München', 'eingabe'),
  'koeln': ('NW', 'Köln', 'eingabe'), 'frankfurt': ('HE', 'Frankfurt am Main', 'eingabe'), 'stuttgart': ('BW', 'Stuttgart', 'eingabe'),
  'duesseldorf': ('NW', 'Düsseldorf', 'eingabe'), 'leipzig': ('SN', 'Leipzig', 'eingabe'), 'dresden': ('SN', 'Dresden', 'eingabe'),
  'hannover': ('NI', 'Hannover', 'eingabe'), 'nuernberg': ('BY', 'Nürnberg', 'eingabe'), 'bremen': ('HB', 'Bremen', 'eingabe'),
  'essen': ('NW', 'Essen', 'eingabe'),
}
ISO = re.compile(r'\d{4}-\d{2}-\d{2}')
def iso(x):
    m = ISO.search(x or '') if isinstance(x, str) else None
    return m.group(0) if m else None
out = []
for vid, (land, gem, schema) in VILLES.items():
    p = os.path.join(ROOT, f'data-src/mietspiegel/{vid}-quelle.json')
    if not os.path.exists(p): continue
    q = json.load(open(p, encoding='utf-8'))
    if schema == 'eingabe' and q.get('rights_class') == 'A': raise SystemExit(f'{vid} : reprise permise, prévoir un schéma de calcul')
    out.append({'id': vid, 'name': q['city'], 'land': land, 'gemeinde': gem, 'schema': schema, 'ausgabe': q['edition'],
                'gueltigAb': iso(q.get('gueltig_ab')), 'gueltigBis': iso(q.get('gueltig_bis')), 'qualifiziert': bool(q.get('qualifiziert')),
                'herausgeber': q.get('herausgeber', ''), 'url': q['url_seite'], 'pdf': q.get('url_pdf'), 'rechner': q.get('url_online_rechner'),
                'rechte': q['rights_class'], 'rechteZitat': q['rights_quote'], 'rechteUrl': q.get('rights_url', ''),
                'kennzahl': q.get('kennzahl_wert'), 'kennzahlText': q.get('kennzahl_text'), 'kennzahlQuelle': q.get('kennzahl_quelle')})
json.dump(out, open(os.path.join(ROOT, 'src/data/staedte.json'), 'w'), ensure_ascii=False, indent=1)
print('staedte.json :', ', '.join(f"{s['id']}({s['rechte']},{s['schema']})" for s in out))
