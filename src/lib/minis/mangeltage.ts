import { minderung } from '../engine/miete';
import { addDays } from '../engine/dates';
import { T, eur2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Was jede Woche ohne Abhilfe kostet', 'What each week without a fix costs'), cta: T(l, 'Minderung für Ihren Zeitraum', 'Reduction for your period'),
  inputs: [
    { id: 'brutto', label: T(l, 'Bruttomiete', 'Gross rent'), def: 950, unit: '€', max: 20000 },
    { id: 'q', label: T(l, 'Gewählte Quote', 'Chosen rate'), def: 15, unit: '%', max: 100, decimals: 1 },
    { id: 'tage', label: T(l, 'Tage seit der Anzeige', 'Days since reporting'), def: 21, max: 730 },
  ],
  run: ({ brutto, q, tage }: Record<string, number>) => { const n = Math.max(1, Math.round(tage)); const r = minderung({ kalt: brutto, nebenkosten: 0, quote: q / 100, von: '2026-01-01', bis: addDays('2026-01-01', n - 1) });
    return { head: [T(l, `Minderung für ${n} Tage`, `Reduction for ${n} days`), eur2(r.summe, l)] as [string, string],
      rows: [[T(l, 'Pro Monat', 'Per month'), eur2(r.monat, l)]] as [string, string][], note: T(l, 'Ab dem Tag, an dem der Mangel besteht; ohne Anzeige kann das Recht entfallen.', 'From the day the defect exists; without a report the right may be lost.') }; },
});
