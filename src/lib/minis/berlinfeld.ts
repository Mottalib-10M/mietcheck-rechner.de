import { berlinOvm } from '../engine/berlin';
import { T, eur2, m2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Berliner Mietspiegel 2026: Ihr Feld', 'Berlin rent index 2026: your field'), cta: T(l, 'Mit Ausstattung und Grenzen rechnen', 'Add fittings and limits'),
  inputs: [
    { id: 'lage', label: T(l, 'Wohnlage', 'Location'), def: 1, options: [{ value: '0', label: T(l, 'einfach', 'basic') }, { value: '1', label: T(l, 'mittel', 'average') }, { value: '2', label: T(l, 'gut', 'good') }] },
    { id: 'bj', label: T(l, 'Baujahr', 'Year built'), def: 1960, max: 2024 },
    { id: 'fl', label: T(l, 'Wohnfläche', 'Floor area'), def: 60, unit: 'm²', max: 400 },
  ],
  run: ({ lage, bj, fl }: Record<string, number>) => { const r = berlinOvm({ lage: (['einfach', 'mittel', 'gut'] as const)[lage] ?? 'mittel', baujahr: bj, flaeche: fl });
    if (!r.ok) return { head: [T(l, 'Vergleichsmiete', 'Reference rent'), '–'] as [string, string], rows: [[T(l, 'Hinweis', 'Note'), T(l, 'kein Feld im Mietspiegel', 'no field in the index')]] as [string, string][] };
    return { head: [T(l, 'Mittelwert des Feldes', 'Field mean'), m2(r.ovm, l)] as [string, string],
      rows: [[T(l, 'Zeile', 'Line'), String(r.zeile!.zeile)], [T(l, 'Spanne', 'Range'), `${m2(r.spanne[0], l)} – ${m2(r.spanne[1], l)}`], [T(l, 'Für Ihre Fläche', 'For your floor area'), eur2(r.monat, l)]] as [string, string][] }; },
});
