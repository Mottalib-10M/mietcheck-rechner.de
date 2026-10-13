import { wohnflaeche } from '../engine/miete';
import { T, num, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Wohnfläche nach der Wohnflächenverordnung', 'Floor area under the Living Space Ordinance'), cta: T(l, 'Mit dieser Fläche die Miete prüfen', 'Check the rent with this area'),
  inputs: [
    { id: 'voll', label: T(l, 'Fläche mit mindestens 2 m Höhe', 'Area at least 2 m high'), def: 58, unit: 'm²', max: 500, decimals: 2 },
    { id: 'halb', label: T(l, 'Fläche zwischen 1 und 2 m Höhe', 'Area between 1 and 2 m high'), def: 6, unit: 'm²', max: 200, decimals: 2 },
    { id: 'balkon', label: T(l, 'Balkon oder Terrasse', 'Balcony or terrace'), def: 8, unit: 'm²', max: 200, decimals: 2 },
  ],
  run: ({ voll, halb, balkon }: Record<string, number>) => { const r = wohnflaeche({ voll, halb, balkon });
    return { head: [T(l, 'Wohnfläche', 'Floor area'), `${num(r.flaeche, l, 2)} m²`] as [string, string],
      rows: [[T(l, 'Davon Dachschräge zur Hälfte', 'Of which sloped area at half'), `${num(r.halbAnteil, l, 2)} m²`], [T(l, 'Davon Balkon zu einem Viertel', 'Of which balcony at a quarter'), `${num(r.balkonAnteil, l, 2)} m²`]] as [string, string][] }; },
});
