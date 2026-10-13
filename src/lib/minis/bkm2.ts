import { P } from '../engine/params';
import { proM2Monat } from '../engine/miete';
import { T, m2, pct, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ihre kalten Betriebskosten je m²', 'Your cold service charges per m²'), cta: T(l, 'Ganze Abrechnung prüfen', 'Check the whole statement'),
  inputs: [
    { id: 'jahr', label: T(l, 'Kalte Betriebskosten im Jahr', 'Cold service charges for the year'), def: 1400, unit: '€', max: 50000 },
    { id: 'fl', label: T(l, 'Wohnfläche', 'Floor area'), def: 62, unit: 'm²', max: 400 },
  ],
  run: ({ jahr, fl }: Record<string, number>) => { const v = proM2Monat(jahr, fl); const ref = P.berlin_bk.kalt_m2;
    return { head: [T(l, 'Je m² und Monat', 'Per m² and month'), m2(v, l)] as [string, string],
      rows: [[T(l, 'Berliner Mittel 2024', 'Berlin average 2024'), m2(ref, l)], [T(l, 'Abweichung', 'Difference'), pct(v / ref - 1, l)]] as [string, string][] }; },
});
