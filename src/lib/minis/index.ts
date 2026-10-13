import { indexmiete, vpiMonate, VPI } from '../engine/miete';
import { T, eur2, pct, num, type L } from './_kit';
export default (l: L) => {
  const last = vpiMonate[vpiMonate.length - 1];
  const opts = vpiMonate.slice(-36).reverse().map((m, i) => ({ value: String(i), label: `${m} · ${num(VPI[m], l, 1)}` }));
  const back = vpiMonate.slice(-36).reverse();
  return {
    title: T(l, 'Indexmiete: neue Miete seit der letzten Anpassung', 'Index rent: new rent since the last adjustment'), cta: T(l, 'Mit Fälligkeitsdatum rechnen', 'Calculate with the due date'),
    inputs: [
      { id: 'miete', label: T(l, 'Aktuelle Nettokaltmiete', 'Current net cold rent'), def: 850, unit: '€', max: 20000 },
      { id: 'von', label: T(l, 'Index der letzten Anpassung', 'Index at the last adjustment'), def: 12, options: opts },
    ],
    run: ({ miete, von }: Record<string, number>) => { const r = indexmiete({ miete, von: back[von] ?? back[12], bis: last });
      return { head: [T(l, `Neue Miete nach Index ${last}`, `New rent on the ${last} index`), eur2(r.neu, l)] as [string, string],
        rows: [[T(l, 'Veränderung', 'Change'), pct(r.aenderung, l, 2)], [T(l, 'Mehr pro Monat', 'More per month'), eur2(r.plus, l)]] as [string, string][] }; },
  };
};
