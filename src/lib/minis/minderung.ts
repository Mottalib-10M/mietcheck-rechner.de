import { minderung } from '../engine/miete';
import { T, eur2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Minderung auf die Bruttomiete', 'Reduction on the gross rent'), cta: T(l, 'Taggenau für Ihren Zeitraum', 'Day by day for your period'),
  inputs: [
    { id: 'kalt', label: T(l, 'Nettokaltmiete', 'Net cold rent'), def: 700, unit: '€', max: 20000 },
    { id: 'nk', label: T(l, 'Nebenkosten-Vorauszahlung', 'Service-charge advance'), def: 200, unit: '€', max: 5000 },
    { id: 'q', label: T(l, 'Gewählte Quote', 'Chosen rate'), def: 10, unit: '%', max: 100, decimals: 1 },
  ],
  run: ({ kalt, nk, q }: Record<string, number>) => { const r = minderung({ kalt, nebenkosten: nk, quote: q / 100, von: '2026-03-01', bis: '2026-03-31' });
    return { head: [T(l, 'Minderung pro Monat', 'Reduction per month'), eur2(r.monat, l)] as [string, string],
      rows: [[T(l, 'Bruttomiete', 'Gross rent'), eur2(r.brutto, l)], [T(l, 'Zu zahlen', 'Payable'), eur2(r.neueMiete, l)]] as [string, string][] }; },
});
