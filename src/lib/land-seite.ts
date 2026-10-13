/** Outils partagés des pages Land : liste des communes d'une Verordnung, groupée, et exemple chiffré. */
import { P } from './engine/params';
import { landVo, basis, status, type Vo } from './engine/gebiet';
import { mietpreisbremse, mieterhoehung } from './engine/miete';
import type { Helpers } from './guide-types';

/** Kreis indiqué entre parenthèses (« Lkr. Barnim », « Kreis Mettmann, RB Düsseldorf », « kreisfreie Stadt »). */
function kreis(g: string): string | null {
  const m = g.match(/\((.*?)\)\s*$/);
  if (!m) return null;
  const k = m[1].split(',')[0].trim();
  if (/kreisfrei|Landeshauptstadt|^Stadt$|Hansestadt|Universitäts/i.test(k)) return 'kreisfrei';
  return k.replace(/^Lkr\.\s*/, 'Landkreis ').replace(/^Landkreis Rhein-Pfalz-Kreis$/, 'Rhein-Pfalz-Kreis');
}

/** Tableau des communes : par Kreis quand la Verordnung le donne, sinon par initiale. */
export function gemeindeTabelle(vo: Vo, h: Helpers, caption: string, nachKreis = true): string {
  const de = h.lang === 'de';
  const groups = new Map<string, string[]>();
  const mitKreis = nachKreis && vo.gemeinden.filter((g) => kreis(g) && kreis(g) !== 'kreisfrei').length > vo.gemeinden.length / 3;
  for (const g of vo.gemeinden) {
    let k = mitKreis ? kreis(g) ?? '' : basis(g).charAt(0).toUpperCase();
    if (k === 'kreisfrei') k = de ? 'kreisfreie Städte' : 'independent cities';
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k)!.push(basis(g));
  }
  const entries = [...groups.entries()];
  if (!mitKreis) entries.sort((a, b) => a[0].localeCompare(b[0], 'de'));
  const rows = entries.map(([k, v]) => [k, `${v.length}`, [...v].sort((a, b) => a.localeCompare(b, 'de')).join(', ')]);
  return h.table([mitKreis ? (de ? 'Kreis' : 'District') : (de ? 'Buchstabe' : 'Letter'), de ? 'Anzahl' : 'Count', de ? 'Gemeinden' : 'Municipalities'], rows, caption, ['l', 'r', 'l']);
}

export function landDaten(code: string, gemeinde: string, ovm: number, flaeche: number, miete: number) {
  const L = landVo(code)!;
  const st = status(code, gemeinde, P.retrieved_at);
  const mpb = mietpreisbremse({ ovm, flaeche, miete, gebiet: st.mpb });
  const alt = Math.round(ovm * flaeche * 0.85);
  const erh = mieterhoehung({ miete: alt, flaeche, ovm, kappung: st.kappung, verlangt: Math.round(ovm * flaeche), zugang: '2026-10-14', letzteAenderung: '2024-01-01' });
  return { L, st, mpb, erh, alt, verlangt: Math.round(ovm * flaeche), nMpb: L.mpb?.gemeinden.length ?? 0, nKap: L.kappung?.gemeinden.length ?? 0 };
}
