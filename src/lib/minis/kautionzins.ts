import { kaution } from '../engine/miete';
import { T, eur2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Was zurückkommt: Kaution plus Zinsen', 'What comes back: deposit plus interest'), cta: T(l, 'Kaution vollständig berechnen', 'Calculate the deposit in full'),
  inputs: [
    { id: 'k', label: T(l, 'Gezahlte Kaution', 'Deposit paid'), def: 2100, unit: '€', max: 100000 },
    { id: 'z', label: T(l, 'Zinssatz des Kontos', 'Account interest rate'), def: 0.5, unit: '%', max: 10, decimals: 2 },
    { id: 'j', label: T(l, 'Jahre', 'Years'), def: 6, max: 60 },
  ],
  run: ({ k, z, j }: Record<string, number>) => { const r = kaution({ kaltmiete: k / 3, verlangt: k, zins: z / 100, jahre: j });
    return { head: [T(l, 'Kaution mit Zinsen', 'Deposit with interest'), eur2(k + r.zinsen, l)] as [string, string],
      rows: [[T(l, 'Davon Zinsen', 'Of which interest'), eur2(r.zinsen, l)]] as [string, string][] }; },
});
