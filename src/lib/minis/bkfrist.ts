import { bkFristen } from '../engine/miete';
import { T, moisOptions, type L } from './_kit';
import { displayDate } from '../format';
const Y = Array.from({ length: 6 }, (_, i) => 2022 + i).map((y) => ({ value: String(y), label: String(y) }));
export default (l: L) => ({
  title: T(l, 'Bis wann muss Ihre Abrechnung kommen?', 'By when must your statement arrive?'), cta: T(l, 'Abrechnung vollständig prüfen', 'Check the whole statement'),
  inputs: [
    { id: 'm', label: T(l, 'Abrechnungszeitraum endet im Monat', 'Billing period ends in month'), def: 12, options: moisOptions(l) },
    { id: 'y', label: T(l, 'Jahr', 'Year'), def: 2025, options: Y },
  ],
  run: ({ m, y }: Record<string, number>) => { const ende = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10); const r = bkFristen({ periodeEnde: ende }); const d = (x: string) => displayDate(x, l === 'de' ? 'de-DE' : 'en-GB');
    return { head: [T(l, 'Abrechnung spätestens am', 'Statement at the latest on'), d(r.abrechnungBis)] as [string, string],
      rows: [[T(l, 'Ende des Zeitraums', 'End of period'), d(ende)], [T(l, 'Danach', 'After that'), T(l, 'keine Nachforderung mehr', 'no more top-up')]] as [string, string][] }; },
});
