import { rueckforderung } from '../engine/miete';
import { addMonths } from '../engine/dates';
import { T, eur2, type L } from './_kit';
const BEGINN = '2024-01-01';
export default (l: L) => ({
  title: T(l, 'Was bringt Ihre Rüge?', 'What does your complaint recover?'), cta: T(l, 'Mit Mietspiegel und Vormiete rechnen', 'Include rent index and previous rent'),
  inputs: [
    { id: 'ueber', label: T(l, 'Zu viel pro Monat', 'Overpaid per month'), def: 120, unit: '€', max: 5000 },
    { id: 'mon', label: T(l, 'Rüge nach Monaten Mietdauer', 'Complaint after months of tenancy'), def: 18, max: 120 },
    { id: 'bis', label: T(l, 'Monate bis heute nach der Rüge', 'Months since the complaint'), def: 2, max: 120 },
  ],
  run: ({ ueber, mon, bis }: Record<string, number>) => { const ruege = addMonths(BEGINN, Math.max(0, mon)); const heute = addMonths(ruege, Math.max(0, bis));
    const r = rueckforderung({ ueberMonat: ueber, beginn: BEGINN, ruege, heute });
    return { head: [T(l, 'Zurückzufordern', 'Recoverable'), eur2(r.betrag, l)] as [string, string],
      rows: [[T(l, 'Monate', 'Months'), String(r.monate)], [T(l, 'Ab Mietbeginn?', 'From the start?'), r.voll ? T(l, 'ja', 'yes') : T(l, 'nein, erst ab der Rüge', 'no, only from the complaint')]] as [string, string][] }; },
});
