#!/usr/bin/env python3
"""Verordnungen der Länder (Mietpreisbremse § 556d Abs. 2 BGB, Kappungsgrenze § 558 Abs. 3 BGB) :
relevé dans data-src/laender/laender-quelle.json (une entrée par Land, listes de communes lues dans
les Gesetzblätter), écrit src/data/laender.json au format du moteur (src/lib/engine/gebiet.ts)."""
import json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CODE = {'Baden-Württemberg': 'BW', 'Bayern': 'BY', 'Berlin': 'BE', 'Brandenburg': 'BB', 'Bremen': 'HB', 'Hamburg': 'HH', 'Hessen': 'HE', 'Mecklenburg-Vorpommern': 'MV', 'Niedersachsen': 'NI', 'Nordrhein-Westfalen': 'NW', 'Rheinland-Pfalz': 'RP', 'Saarland': 'SL', 'Sachsen': 'SN', 'Sachsen-Anhalt': 'ST', 'Schleswig-Holstein': 'SH', 'Thüringen': 'TH'}
# Dates d'entrée en vigueur lues dans le texte mais absentes du relevé structuré.
FIX_IN = {'Rostock (Hanse- und Universitätsstadt)': '2023-10-01', 'Binz': '2026-03-18'}
src = json.load(open(os.path.join(ROOT, 'data-src/laender/laender-quelle.json'), encoding='utf-8'))
ISO = re.compile(r'^\d{4}-\d{2}-\d{2}$')
def d(x): return x if isinstance(x, str) and ISO.match(x) else None
def vo(v):
    if not v or not v.get('exists'): return None
    g = v.get('gemeinden') or []
    n = v.get('anzahl')
    if n is not None and n != len(g): raise SystemExit(f"{v.get('titel')} : {len(g)} communes pour {n} annoncées")
    # Plusieurs Verordnungen dans un Land (« teile ») : chaque groupe de communes a ses dates.
    teile = []
    for t in v.get('teile') or [{'gemeinden': g}]:
        ik = d(t.get('in_kraft')) or d(v.get('in_kraft')) or FIX_IN.get(t['gemeinden'][0])
        bis = d(t.get('ausser_kraft')) or d(v.get('ausser_kraft'))
        if not ik or not bis: raise SystemExit(f"dates illisibles : {v.get('titel')} / {t['gemeinden'][:2]}")
        teile.append({'gemeinden': t['gemeinden'], 'inKraft': ik, 'bis': bis, 'url': t.get('source_url') or v.get('source_url')})
    if sum(len(t['gemeinden']) for t in teile) != len(g): raise SystemExit(f"teile incomplets : {v.get('titel')}")
    return {'titel': v.get('titel'), 'datum': v.get('datum'), 'fundstelle': v.get('fundstelle'), 'url': v.get('source_url'), 'teile': teile, 'gemeinden': g,
            'inKraft': min(t['inKraft'] for t in teile), 'bis': max(t['bis'] for t in teile)}
out = []
for e in src:
    out.append({'code': CODE[e['land']], 'name': e['land'], 'mpb': vo(e.get('mpb')), 'kappung': vo(e.get('kappung')), 'hinweis': e.get('notes') or ''})
out.sort(key=lambda x: x['name'])
assert len(out) == 16, len(out)
json.dump(out, open(os.path.join(ROOT, 'src/data/laender.json'), 'w'), ensure_ascii=False, indent=1)
print('laender.json :', ', '.join(f"{x['code']} {len((x['mpb'] or {}).get('gemeinden', []))}/{len((x['kappung'] or {}).get('gemeinden', []))}" for x in out))
