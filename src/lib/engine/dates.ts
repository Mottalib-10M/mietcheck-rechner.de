/** Dates ISO (AAAA-MM-JJ) sans fuseau : tout se calcule en jours civils UTC. */
export const parse = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const addMonths = (s: string, n: number) => { const d = parse(s); const day = d.getUTCDate(); const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1)); const last = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 0)).getUTCDate(); t.setUTCDate(Math.min(day, last)); return iso(t); };
export const addDays = (s: string, n: number) => { const d = parse(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
/** Premier jour du n-ième mois civil après celui de la date (n = 1 : mois suivant). */
export const firstOfMonthAfter = (s: string, n: number) => { const d = parse(s); return iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1))); };
/** Dernier jour du mois civil situé n mois après celui de la date (n = 0 : ce mois-ci). */
export const endOfMonth = (s: string, n = 0) => { const d = parse(s); return iso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n + 1, 0))); };
/** Mois pleins entre deux dates (a ≤ b), au sens « même quantième ». */
export const monthsBetween = (a: string, b: string) => { const x = parse(a), y = parse(b); let m = (y.getUTCFullYear() - x.getUTCFullYear()) * 12 + y.getUTCMonth() - x.getUTCMonth(); if (y.getUTCDate() < x.getUTCDate()) m -= 1; return m; };
export const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
export const daysInMonth = (s: string) => { const d = parse(s); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate(); };
export const daysBetween = (a: string, b: string) => Math.round((parse(b).getTime() - parse(a).getTime()) / 86400000);
