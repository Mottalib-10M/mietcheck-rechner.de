import { vorauszahlung } from '../engine/miete';
import { T, eur2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Nachzahlung und neue Vorauszahlung', 'Top-up and new advance payment'), cta: T(l, 'Abrechnung und Fristen prüfen', 'Check statement and deadlines'),
  inputs: [
    { id: 'bisher', label: T(l, 'Bisherige Vorauszahlung', 'Current advance payment'), def: 200, unit: '€', max: 5000 },
    { id: 'nach', label: T(l, 'Nachzahlung laut Abrechnung', 'Top-up under the statement'), def: 360, unit: '€', max: 50000 },
  ],
  run: ({ bisher, nach }: Record<string, number>) => { const r = vorauszahlung({ bisher, ergebnis: nach });
    return { head: [T(l, 'Angemessene neue Vorauszahlung', 'Reasonable new advance'), eur2(r.neu, l)] as [string, string],
      rows: [[T(l, 'Mehr pro Monat', 'More per month'), eur2(r.diff, l)], [T(l, 'Vorauszahlungen im Jahr', 'Advances per year'), eur2(r.neu * 12, l)]] as [string, string][] }; },
});
