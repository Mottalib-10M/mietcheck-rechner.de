#!/usr/bin/env python3
"""Mietspiegel Dortmund 2025/2026 (Amtsblatt Nr. 53 du 20.12.2024, données ouvertes DL-DE-Zero-2.0) :
relevé data-src/mietspiegel/dortmund-quelle.json -> src/data/mietspiegel/dortmund.json."""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
q = json.load(open(os.path.join(ROOT, 'data-src/mietspiegel/dortmund-quelle.json'), encoding='utf-8'))
d = q['data']; z = d['zuschlaege_eur_m2']
def bj(s):
    m = re.fullmatch(r'bis (\d{4})', s)
    if m: return [0, int(m.group(1))]
    a, b = re.findall(r'\d{4}', s); return [int(a), int(b)]
basis = [{'von': bj(r['baujahr'])[0], 'bis': bj(r['baujahr'])[1], 'unten': r['untergrenze'], 'mittel': r['mittelwert'], 'oben': r['obergrenze']} for r in d['basistabelle']]
def fl(s):
    a = [float(x.replace(',', '.')) for x in re.findall(r'\d+(?:,\d+)?', s)]
    return [a[0], a[1]]
groesse = [{'von': fl(k)[0], 'bis': fl(k)[1], 'wert': v} for k, v in z['5.1 Wohnungsgröße'].items()]
def items(key, gruppe): return [{'gruppe': gruppe, 'text': k, 'wert': v} for k, v in z[key].items()]
merkmale = (items('5.1 Wohnungstyp', 'typ') + items('5.2 Bad-Ausstattung (Standard: Bad mit WC und Badewanne)', 'bad') + items('5.3 Bodenbeläge (Standard: Laminat/Teppich/einfaches PVC)', 'boden')
  + items('5.4 Beheizungsart (Standard: Zentralheizung)', 'heizung') + items('5.5 Verglasung (Standard: Isolierverglasung)', 'fenster') + items('5.5 Außenflächen (Standard: Balkon/Loggia/Terrasse)', 'aussen')
  + items('5.5 Aufzug und Barrierefreiheit', 'zugang') + items('5.5 Weitere sonstige Merkmale', 'sonst') + items('5.6 Modernisierung (nur Gebäude vor 1980 errichtet, vom Vermieter durchgeführt)', 'modern'))
for i, m in enumerate(merkmale): m['id'] = f'm{i}'
gebiete = [{'nr': int(re.search(r'\((\d)\)', k).group(1)), 'name': re.sub(r'\s*\(\d\)', '', k), 'wert': v} for k, v in z['5.7 Gebietseinteilung/Wohnumfeld'].items()]
out = {'stadt': 'Dortmund', 'ausgabe': q['edition'], 'gueltig_ab': q['gueltig_ab'], 'gueltig_bis': q['gueltig_bis'], 'lizenz': 'Datenlizenz Deutschland – Zero (dl-de/zero-2-0); Amtsblatt der Stadt Dortmund Nr. 53 vom 20.12.2024',
       'url_seite': q['url_seite'], 'url_pdf': q['url_pdf'], 'gebietskarte': q['url_gebietskarte'], 'basis': basis, 'groesse': groesse, 'merkmale': merkmale, 'gebiete': gebiete,
       'exklusiv': ['typ', 'boden', 'heizung', 'fenster', 'aussen'], 'modern_vor': 1980, 'flaeche_min': 20, 'flaeche_max': 145, 'baujahr_max': 2019}
assert len(basis) == 9 and len(gebiete) == 7
json.dump(out, open(os.path.join(ROOT, 'src/data/mietspiegel/dortmund.json'), 'w'), ensure_ascii=False, indent=1)
print('dortmund.json :', len(basis), 'Baujahresklassen,', len(merkmale), 'Merkmale,', len(gebiete), 'Gebiete')
