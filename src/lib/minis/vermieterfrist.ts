import { kuendigung } from '../engine/miete';
import { T, moisOptions, type L } from './_kit';
import { displayDate } from '../format';
export default (l: L) => ({
  title: T(l, 'Ihre Frist bei einer Vermieterkündigung', 'Your period on a landlord notice'), cta: T(l, 'Mit Bundesland und Datum rechnen', 'Calculate with state and date'),
  inputs: [
    { id: 'j', label: T(l, 'Jahre seit dem Einzug', 'Years since moving in'), def: 6, max: 80 },
    { id: 'm', label: T(l, 'Kündigung kommt an im Monat (am 2. Werktag)', 'Notice arrives in month (2nd working day)'), def: 11, options: moisOptions(l) },
  ],
  run: ({ j, m }: Record<string, number>) => { const zugang = `2026-${String(m).padStart(2, '0')}-02`; const seit = `${2026 - Math.round(j)}-${String(m).padStart(2, '0')}-01`;
    const r = kuendigung({ zugang, partei: 'vermieter', ueberlassen: seit });
    return { head: [T(l, 'Mietverhältnis endet frühestens', 'Tenancy ends at the earliest'), displayDate(r.ende, l === 'de' ? 'de-DE' : 'en-GB')] as [string, string],
      rows: [[T(l, 'Kündigungsfrist', 'Notice period'), `${r.monate} ${T(l, 'Monate', 'months')}`], [T(l, 'Widerspruch spätestens', 'Objection at the latest'), T(l, 'zwei Monate vor dem Ende', 'two months before the end')]] as [string, string][] }; },
});
