import { mieterhoehung } from '../engine/miete';
import { T, eur2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Kappungsgrenze: Ihre Obergrenze', 'Increase cap: your upper limit'), cta: T(l, 'Gemeinde und Fristen prüfen', 'Check municipality and deadlines'),
  inputs: [
    { id: 'alt', label: T(l, 'Miete vor drei Jahren', 'Rent three years ago'), def: 600, unit: '€', max: 20000 },
    { id: 'k', label: T(l, 'Kappungsgrenze', 'Cap'), def: 15, options: [{ value: '15', label: '15 %' }, { value: '20', label: '20 %' }] },
  ],
  run: ({ alt, k }: Record<string, number>) => { const r = mieterhoehung({ miete: alt, flaeche: 1, ovm: 1e6, kappung: k / 100, verlangt: alt * 2, zugang: '2026-10-14', letzteAenderung: '2023-01-01' });
    return { head: [T(l, 'Höchstens nach drei Jahren', 'Maximum after three years'), eur2(r.grenzeKappung, l)] as [string, string],
      rows: [[T(l, 'Mehr pro Monat höchstens', 'At most more per month'), eur2(r.grenzeKappung - alt, l)], [T(l, 'Mehr pro Jahr höchstens', 'At most more per year'), eur2((r.grenzeKappung - alt) * 12, l)]] as [string, string][], note: T(l, 'Die Vergleichsmiete kann eine niedrigere Grenze setzen.', 'The reference rent may set a lower limit.') }; },
});
