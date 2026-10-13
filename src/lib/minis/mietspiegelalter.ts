import { addMonths } from '../engine/dates';
import { T, moisOptions, type L } from './_kit';
import { displayDate } from '../format';
const Y = Array.from({ length: 9 }, (_, i) => 2019 + i).map((y) => ({ value: String(y), label: String(y) }));
export default (l: L) => ({
  title: T(l, 'Wann muss Ihr Mietspiegel erneuert werden?', 'When must your rent index be renewed?'), cta: T(l, 'Mietspiegel-Rechner öffnen', 'Open the rent check'),
  inputs: [
    { id: 'm', label: T(l, 'Stichtag der Daten: Monat', 'Data reference date: month'), def: 9, options: moisOptions(l) },
    { id: 'y', label: T(l, 'Stichtag der Daten: Jahr', 'Data reference date: year'), def: 2025, options: Y },
  ],
  run: ({ m, y }: Record<string, number>) => { const s = `${y}-${String(m).padStart(2, '0')}-01`; const d = (x: string) => displayDate(x, l === 'de' ? 'de-DE' : 'en-GB');
    return { head: [T(l, 'Anpassung fällig bis', 'Update due by'), d(addMonths(s, 24))] as [string, string],
      rows: [[T(l, 'Neuerstellung fällig bis', 'New edition due by'), d(addMonths(s, 48))], [T(l, 'Grundlage', 'Basis'), '§ 558d Abs. 2 BGB']] as [string, string][], note: T(l, 'Maßgeblich ist der Stichtag der Datenerhebung, nicht das Datum der Veröffentlichung.', 'What counts is the data reference date, not the publication date.') }; },
});
