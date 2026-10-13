import { mieterhoehung } from '../engine/miete';
import { T, eur2, pct, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Mieterhöhung: was zulässig ist', 'Rent increase: what is lawful'), cta: T(l, 'Mit Fristen und Gemeinde prüfen', 'Check with deadlines and municipality'),
  inputs: [
    { id: 'miete', label: T(l, 'Bisherige Nettokaltmiete', 'Current net cold rent'), def: 650, unit: '€', max: 20000 },
    { id: 'ovm', label: T(l, 'Vergleichsmiete', 'Reference rent'), def: 11.5, unit: '€/m²', max: 60, decimals: 2 },
    { id: 'fl', label: T(l, 'Wohnfläche', 'Floor area'), def: 65, unit: 'm²', max: 400 },
    { id: 'k', label: T(l, 'Kappungsgrenze der Gemeinde', 'Municipality cap'), def: 15, options: [{ value: '15', label: '15 %' }, { value: '20', label: '20 %' }] },
  ],
  run: ({ miete, ovm, fl, k }: Record<string, number>) => { const r = mieterhoehung({ miete, flaeche: fl, ovm, kappung: k / 100, verlangt: ovm * fl, zugang: '2026-10-14', letzteAenderung: '2024-01-01' });
    return { head: [T(l, 'Höchstens neue Miete', 'Maximum new rent'), eur2(r.zulaessig, l)] as [string, string],
      rows: [[T(l, 'Grenze Vergleichsmiete', 'Reference-rent limit'), eur2(r.grenzeOvm, l)], [T(l, 'Grenze Kappung', 'Cap limit'), eur2(r.grenzeKappung, l)], [T(l, 'Erhöhung', 'Increase'), `${eur2(r.plusMonat, l)} (${pct(r.plusProzent, l)})`]] as [string, string][] }; },
});
