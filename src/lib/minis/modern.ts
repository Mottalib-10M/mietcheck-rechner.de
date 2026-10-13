import { modernisierung } from '../engine/miete';
import { T, eur2, m2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Angekündigte Erhöhung nachrechnen', 'Check the announced increase'), cta: T(l, 'Modernisierungsumlage im Detail', 'Modernisation increase in detail'),
  inputs: [
    { id: 'kosten', label: T(l, 'Kosten für Ihre Wohnung', 'Costs for your flat'), def: 15000, unit: '€', max: 500000 },
    { id: 'erh', label: T(l, 'Davon Erhaltung', 'Of which repairs'), def: 2500, unit: '€', max: 500000 },
    { id: 'fl', label: T(l, 'Wohnfläche', 'Floor area'), def: 65, unit: 'm²', max: 400 },
    { id: 'miete', label: T(l, 'Nettokaltmiete', 'Net cold rent'), def: 620, unit: '€', max: 20000 },
  ],
  run: ({ kosten, erh, fl, miete }: Record<string, number>) => { const r = modernisierung({ kosten, erhaltung: erh, flaeche: fl, miete });
    return { head: [T(l, 'Erhöhung pro Monat', 'Increase per month'), eur2(r.monat, l)] as [string, string],
      rows: [[T(l, 'Ohne Kappung', 'Before the cap'), eur2(r.monatRoh, l)], [T(l, 'Kappung in sechs Jahren', 'Six-year cap'), m2(r.kapM2, l)], [T(l, 'Neue Miete', 'New rent'), eur2(r.neueMiete, l)]] as [string, string][] }; },
});
