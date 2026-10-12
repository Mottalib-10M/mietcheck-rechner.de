import { mietpreisbremse } from '../engine/miete';
import { P } from '../engine/params';
import { T, eur2, m2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Mietpreisbremse: Ihre Grenze', 'Rent brake: your ceiling'), cta: T(l, 'Mit Vormiete und Rückforderung rechnen', 'Include previous rent and refund'),
  inputs: [
    { id: 'ovm', label: T(l, 'Vergleichsmiete laut Mietspiegel', 'Reference rent from the index'), def: 10, unit: '€/m²', max: 60, decimals: 2 },
    { id: 'fl', label: T(l, 'Wohnfläche', 'Floor area'), def: 60, unit: 'm²', max: 400 },
    { id: 'miete', label: T(l, 'Vereinbarte Nettokaltmiete', 'Agreed net cold rent'), def: 780, unit: '€', max: 20000 },
  ],
  run: ({ ovm, fl, miete }: Record<string, number>) => { const r = mietpreisbremse({ ovm, flaeche: fl, miete, gebiet: true });
    return { head: [T(l, 'Höchstens zulässig pro Monat', 'Maximum per month'), eur2(r.zulaessig, l)] as [string, string],
      rows: [[T(l, 'Zu viel pro Monat', 'Too much per month'), eur2(r.ueberMonat, l)], [T(l, 'Zu viel im Jahr', 'Too much per year'), eur2(r.ueberMonat * 12, l)], [T(l, 'Grenze je m²', 'Ceiling per m²'), m2(ovm * (1 + P.mpb.aufschlag), l)]] as [string, string][] }; },
});
