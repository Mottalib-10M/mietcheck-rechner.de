#!/usr/bin/env python3
"""Berliner Mietspiegel 2026 : lit le texte de la Mietspiegeltabelle (PDF officiel,
mietspiegel.berlin.de, extrait avec pypdf dans data-src/mietspiegel/berlin-2026-tabelle.txt)
et écrit src/data/mietspiegel/berlin.json. Rejouable : python3 scripts/mietspiegel/build-berlin.py
Le script s'arrête si une ligne manque (189 lignes attendues) ou si une valeur est incohérente."""
import json, re, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
txt = open(os.path.join(ROOT, 'data-src/mietspiegel/berlin-2026-tabelle.txt'), encoding='utf-8').read()
BA = [('bis 1918', 'b1918'), ('1919 bis 1949', 'b1949'), ('1950 bis 1964', 'b1964'), ('1965 bis 1972', 'b1972'),
      ('1973 bis 1985 West', 'w1985'), ('1986 bis 1990 West', 'w1990'), ('1973 bis 1990 Ost', 'o1990'),
      ('1991 bis 2001', 'b2001'), ('2002 bis 2009', 'b2009'), ('2010 bis 2015', 'b2015'), ('2016 bis 2019', 'b2019'), ('2020 bis 2024', 'b2024')]
row = re.compile(r'^(\d{1,3}) (.*?)\s+(\d+,\d\d) €\s+(\d+,\d\d) €\s+(\d+,\d\d) €\s*$')
def flaeche(s):
    s = s.strip()
    if s == 'alle Wohnflächen': return [0, None]
    m = re.fullmatch(r'bis unter (\d+) m²', s)
    if m: return [0, int(m.group(1))]
    m = re.fullmatch(r'(\d+) m² bis unter (\d+) m²', s)
    if m: return [int(m.group(1)), int(m.group(2))]
    m = re.fullmatch(r'ab (\d+) m²', s)
    if m: return [int(m.group(1)), None]
    raise SystemExit(f'Fläche illisible : {s!r}')
rows, cur = [], None
for line in txt.splitlines():
    line = re.sub(r' +', ' ', line.replace(' ', ' ')).strip()
    m = row.match(line)
    if not m: continue
    nr, rest = int(m.group(1)), m.group(2)
    lo, mid, hi = (float(m.group(i).replace(',', '.')) for i in (3, 4, 5))
    for label, key in BA:
        if rest.lower().startswith(label.lower()):
            cur = key; rest = rest[len(label):].lstrip('*').strip(); break
    lage = 'einfach' if nr <= 67 else 'mittel' if nr <= 129 else 'gut'
    if not (lo <= mid <= hi): raise SystemExit(f'Zeile {nr} : Spanne incohérente')
    rows.append({'zeile': nr, 'lage': lage, 'baualter': cur, 'flaeche': flaeche(rest), 'unten': lo, 'mittel': mid, 'oben': hi})
nrs = [r['zeile'] for r in rows]
if nrs != list(range(1, 190)): raise SystemExit(f'Lignes manquantes : {sorted(set(range(1,190)) - set(nrs))}')
out = {
  'stadt': 'Berlin', 'ausgabe': 'Berliner Mietspiegel 2026', 'stichtag': '2025-09-01', 'gueltig_ab': '2026-05-28',
  'qualifiziert': True, 'herausgeber': 'Senatsverwaltung für Stadtentwicklung, Bauen und Wohnen',
  'veroeffentlicht': 'Amtsblatt für Berlin vom 28.05.2026 (Straßenverzeichnis) und mietspiegel.berlin.de',
  'url_seite': 'https://mietspiegel.berlin.de/', 'url_pdf': 'https://mietspiegel.berlin.de/wp-content/uploads/2026/05/mietspiegeltabelle2026.pdf',
  'minderausstattung_abschlag': 0.33, 'orientierungshilfe_anteil': 0.2, 'gruppen': ['bad', 'kueche', 'wohnung', 'gebaeude', 'umfeld'],
  'baualter': [k for _, k in BA], 'zeilen': rows,
}
os.makedirs(os.path.join(ROOT, 'src/data/mietspiegel'), exist_ok=True)
json.dump(out, open(os.path.join(ROOT, 'src/data/mietspiegel/berlin.json'), 'w'), ensure_ascii=False, indent=1)
print(f'berlin.json : {len(rows)} lignes')
