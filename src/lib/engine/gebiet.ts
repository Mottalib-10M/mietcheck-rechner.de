/**
 * Où s'appliquent la Mietpreisbremse et la Kappungsgrenze de 15 % : Verordnungen des 16 Länder
 * (src/data/laender.json, généré par scripts/build-laender.py). Recherche par nom de commune,
 * sans tenir compte des précisions entre parenthèses (« Potsdam (kreisfreie Stadt) »).
 */
import RAW from '../../data/laender.json';
import { P } from './params';
import { cmp } from './dates';
export interface Teil { gemeinden: string[]; inKraft: string; bis: string; url: string }
export interface Vo { titel: string; datum: string; fundstelle: string; inKraft: string; bis: string; url: string; gemeinden: string[]; teile: Teil[] }
export interface LandVo { code: string; name: string; mpb: Vo | null; kappung: Vo | null; hinweis: string }
export const LAENDER_VO = RAW as unknown as LandVo[];
export const landVo = (code: string) => LAENDER_VO.find((l) => l.code === code);
export const basis = (g: string) => g.replace(/\s*\(.*?\)\s*/g, ' ').replace(/,\s*Stadt\b/, '').replace(/\s+/g, ' ').trim();
const norm = (s: string) => basis(s).toLowerCase().replace(/ß/g, 'ss').replace(/[.,]/g, '').replace(/\s*-\s*/g, '-');
/** Toutes les communes citées par un Land (MPB ou Kappung), pour la liste de suggestions. */
export function gemeindenVon(code: string): string[] {
  const l = landVo(code); if (!l) return [];
  return [...new Set([...(l.mpb?.gemeinden ?? []), ...(l.kappung?.gemeinden ?? [])].map(basis))].sort((a, b) => a.localeCompare(b, 'de'));
}
const trifft = (vo: Vo | null, gemeinde: string, datum: string) => {
  if (!vo || !gemeinde.trim()) return null;
  const n = norm(gemeinde);
  for (const t of vo.teile) {
    const hit = t.gemeinden.find((g) => norm(g) === n);
    if (!hit) continue;
    // Avant l'entrée en vigueur de la Verordnung actuelle : une Verordnung antérieure a pu couvrir la commune ;
    // on applique la règle (prudence pour le locataire) en le signalant (`vorher`).
    const vorher = cmp(datum, t.inKraft) < 0;
    const aktiv = vorher || cmp(datum, t.bis) <= 0;
    return { eintrag: hit, aktiv, vorher, bis: t.bis, inKraft: t.inKraft, teilweise: /\(.*(teil|ortsteil|stadtteil|gemarkung|ohne)/i.test(hit) };
  }
  return null;
};
export interface Status { land?: LandVo; mpb: boolean; mpbBis?: string; mpbTeil?: boolean; mpbVorher?: string; kappungVorher?: string; kappung: number; kappungBis?: string; kappungTeil?: boolean; gefunden: boolean }
/** Statut d'une commune à une date : Mietpreisbremse oui/non, Kappungsgrenze 15 ou 20 %. */
export function status(code: string, gemeinde: string, datum: string): Status {
  const land = landVo(code);
  const m = trifft(land?.mpb ?? null, gemeinde, datum);
  const k = trifft(land?.kappung ?? null, gemeinde, datum);
  return {
    land, gefunden: !!(m || k),
    mpb: !!m?.aktiv, mpbBis: m?.aktiv ? m.bis : undefined, mpbTeil: m?.teilweise, mpbVorher: m?.vorher ? m.inKraft : undefined, kappungVorher: k?.vorher ? k.inKraft : undefined,
    kappung: k?.aktiv ? P.erhoehung.kappung_angespannt : P.erhoehung.kappung, kappungBis: k?.aktiv ? k.bis : undefined, kappungTeil: k?.teilweise,
  };
}
