import { mietpreisbremse } from '../engine/miete';
import { T, eur2, m2, pct, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ihre Miete neben der Vergleichsmiete', 'Your rent next to the reference rent'), cta: T(l, 'Vergleichsmiete für Ihre Stadt ermitteln', 'Find the reference rent for your city'),
  inputs: [
    { id: 'ovm', label: T(l, 'Vergleichsmiete', 'Reference rent'), def: 9.5, unit: '€/m²', max: 60, decimals: 2 },
    { id: 'fl', label: T(l, 'Wohnfläche', 'Floor area'), def: 65, unit: 'm²', max: 400 },
    { id: 'miete', label: T(l, 'Ihre Nettokaltmiete', 'Your net cold rent'), def: 720, unit: '€', max: 20000 },
  ],
  run: ({ ovm, fl, miete }: Record<string, number>) => { const v = ovm * fl; const r = mietpreisbremse({ ovm, flaeche: fl, miete, gebiet: true });
    return { head: [T(l, 'Vergleichsmiete für Ihre Fläche', 'Reference rent for your area'), eur2(v, l)] as [string, string],
      rows: [[T(l, 'Ihre Miete je m²', 'Your rent per m²'), m2(fl ? miete / fl : 0, l)], [T(l, 'Abstand zur Vergleichsmiete', 'Gap to the reference rent'), v ? pct(miete / v - 1, l) : '–'], [T(l, 'Grenze bei Neuvermietung (+10 %)', 'Ceiling on a new lease (+10%)'), eur2(r.grenzeOvm, l)]] as [string, string][] }; },
});
