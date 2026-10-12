/** Petits outils communs aux mini-simulateurs (fichier ignoré par le registre : préfixe « _ »). */
import { formatMoney, formatPercent, formatNumber } from '../format';
export type L = 'de' | 'en';
export const T = <A>(l: L, de: A, en: A) => (l === 'en' ? en : de);
export const eur = (x: number, l: L, d = 0) => formatMoney(x, d, l);
export const pct = (x: number, l: L, d = 1) => formatPercent(x, d, l);
export const num = (x: number, l: L, d = 0) => formatNumber(x, d, l);
const MOIS = { de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'], en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
/** « März 2027 » / « March 2027 » à partir d'une date ISO. */
export const moisAnnee = (iso: string, l: L) => { const [y, m] = iso.split('-').map(Number); return `${MOIS[l][m - 1]} ${y}`; };
export const moisOptions = (l: L) => MOIS[l].map((m, i) => ({ value: String(i + 1), label: m }));
/** Options Oui/Non. */
export const yn = (l: L) => [{ value: '0', label: T(l, 'Nein', 'No') }, { value: '1', label: T(l, 'Ja', 'Yes') }];
export const eur2 = (x: number, l: L) => formatMoney(x, Math.abs(x % 1) > 0.004 ? 2 : 0, l);
export const m2 = (x: number, l: L) => `${formatMoney(x, 2, l)}/m²`;
