import { heizkostenKuerzung } from '../engine/miete';
import { T, eur2, pct, yn, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ihr Kürzungsrecht bei den Heizkosten', 'Your right to cut heating costs'), cta: T(l, 'CO2-Kosten aufteilen', 'Split the CO2 costs'),
  inputs: [
    { id: 'anteil', label: T(l, 'Ihr Heizkostenanteil', 'Your heating-cost share'), def: 900, unit: '€', max: 50000 },
    { id: 'pausch', label: T(l, 'Nicht nach Verbrauch abgerechnet?', 'Not billed by consumption?'), def: 0, options: yn(l) },
    { id: 'info', label: T(l, 'Monatliche Verbrauchsinfo fehlt?', 'Monthly consumption info missing?'), def: 1, options: yn(l) },
    { id: 'co2', label: T(l, 'CO2-Aufteilung fehlt?', 'CO2 split missing?'), def: 0, options: yn(l) },
  ],
  run: ({ anteil, pausch, info, co2 }: Record<string, number>) => { const r = heizkostenKuerzung({ anteil, nichtVerbrauchsabhaengig: pausch === 1, ohneInfo: info === 1, ohneCo2Aufteilung: co2 === 1 });
    return { head: [T(l, 'Sie dürfen kürzen um', 'You may cut by'), eur2(r.betrag, l)] as [string, string],
      rows: [[T(l, 'Kürzung insgesamt', 'Total cut'), pct(r.quote, l, 0)], [T(l, 'Zu zahlen', 'Payable'), eur2(r.rest, l)]] as [string, string][] }; },
});
