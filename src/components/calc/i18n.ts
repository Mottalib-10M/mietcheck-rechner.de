/** Formats communs des outils. */
import { formatMoney, formatNumber, formatPercent, displayDate } from '../../lib/format';
export type L = 'de' | 'en';
export const fmt = (lang: L) => ({
  eur: (x: number, d = 0) => formatMoney(x, d, lang),
  eur2: (x: number) => formatMoney(x, Math.abs(x % 1) > 0.004 ? 2 : 0, lang),
  num: (x: number, d = 0) => formatNumber(x, d, lang),
  pct: (x: number, d = 1) => formatPercent(x, d, lang),
  date: (iso: string) => displayDate(iso, lang === 'de' ? 'de-DE' : 'en-GB'),
  m2: (x: number) => `${formatMoney(x, 2, lang)}/m²`,
});
export const T = <A,>(l: L, de: A, en: A) => (l === 'en' ? en : de);
