import { kaution } from '../engine/miete';
import { T, eur2, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ihre Kaution: Höchstbetrag und Raten', 'Your deposit: maximum and instalments'), cta: T(l, 'Raten mit Datum und Zinsen', 'Instalments with dates and interest'),
  inputs: [
    { id: 'kalt', label: T(l, 'Nettokaltmiete', 'Net cold rent'), def: 780, unit: '€', max: 20000 },
    { id: 'verlangt', label: T(l, 'Verlangte Kaution', 'Deposit asked for'), def: 2500, unit: '€', max: 100000 },
  ],
  run: ({ kalt, verlangt }: Record<string, number>) => { const r = kaution({ kaltmiete: kalt, verlangt });
    return { head: [T(l, 'Höchstens zulässig', 'Maximum lawful'), eur2(r.hoechst, l)] as [string, string],
      rows: [[T(l, 'Zu viel verlangt', 'Asked above the limit'), eur2(r.zuviel, l)], [T(l, 'Drei Raten zu', 'Three instalments of'), eur2(r.rate, l)]] as [string, string][] }; },
});
