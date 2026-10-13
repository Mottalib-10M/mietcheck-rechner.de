import { P } from '../engine/params';
import { T, eur2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Staffel unter der Mietpreisbremse', 'A rent step under the rent brake'), cta: T(l, 'Mietpreisbremse genau prüfen', 'Check the rent brake in detail'),
  inputs: [
    { id: 'ovm', label: T(l, 'Vergleichsmiete bei Fälligkeit der Stufe', 'Reference rent when the step falls due'), def: 10, unit: '€/m²', max: 60, decimals: 2 },
    { id: 'fl', label: T(l, 'Wohnfläche', 'Floor area'), def: 60, unit: 'm²', max: 400 },
    { id: 'stufe', label: T(l, 'Miete der Stufe', 'Rent of the step'), def: 690, unit: '€', max: 20000 },
  ],
  run: ({ ovm, fl, stufe }: Record<string, number>) => { const g = ovm * fl * (1 + P.mpb.aufschlag); const u = Math.max(0, stufe - g);
    return { head: [T(l, 'Zulässig für diese Stufe', 'Lawful for this step'), eur2(g, l)] as [string, string],
      rows: [[T(l, 'Zu viel pro Monat', 'Too much per month'), eur2(u, l)], [T(l, 'Zu viel in einem Jahr der Stufe', 'Too much over a year of the step'), eur2(u * 12, l)]] as [string, string][], note: T(l, 'Gilt nur, wenn die Gemeinde bei Fälligkeit der Stufe unter die Mietpreisbremse fällt.', 'Applies only if the municipality is under the rent brake when the step falls due.') }; },
});
