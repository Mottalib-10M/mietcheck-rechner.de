/** Outils partagés des pages ville à saisie (schéma 'eingabe') : tableau de faits et exemple chiffré. */
import { P } from './engine/params';
import { stadt, stadtStatus, type Stadt } from './engine/staedte';
import { mietpreisbremse, mieterhoehung } from './engine/miete';
import type { Helpers, Lang } from './guide-types';

export function stadtDaten(id: string, ovm: number, flaeche: number, miete: number) {
  const S = stadt(id)!;
  const st = stadtStatus(S, P.retrieved_at);
  const mpb = mietpreisbremse({ ovm, flaeche, miete, gebiet: st.mpb });
  const erh = mieterhoehung({ miete: Math.round(ovm * flaeche * 0.85), flaeche, ovm, kappung: st.kappung, verlangt: Math.round(ovm * flaeche), zugang: '2026-10-14', letzteAenderung: '2024-01-01' });
  return { S, st, mpb, erh, ovm, flaeche, miete, mieteAlt: Math.round(ovm * flaeche * 0.85), verlangt: Math.round(ovm * flaeche) };
}

/** Tableau de faits sur le Mietspiegel de la ville (tableaux exclus de la mesure de similarité). */
export function faktenTabelle(S: Stadt, st: ReturnType<typeof stadtStatus>, h: Helpers): string {
  const de = h.lang === 'de';
  const rows: Array<[string, string]> = [
    [de ? 'Ausgabe' : 'Edition', S.ausgabe],
    [de ? 'Art' : 'Type', S.qualifiziert ? (de ? 'qualifiziert, § 558d BGB' : 'qualified, Section 558d BGB') : (de ? 'einfach, § 558c BGB' : 'simple, Section 558c BGB')],
    [de ? 'Gültig ab' : 'Valid from', S.gueltigAb ? h.date(S.gueltigAb) : (de ? 'siehe Herausgeber' : 'see publisher')],
    [de ? 'Gültig bis' : 'Valid until', S.gueltigBis ? h.date(S.gueltigBis) : (de ? 'nicht angegeben' : 'not stated')],
    [de ? 'Herausgeber' : 'Publisher', S.herausgeber.split(';')[0].split(' (')[0]],
    [de ? 'Werte auf dieser Website' : 'Figures on this site', de ? 'keine: Die Rechte sind vorbehalten' : 'none: rights are reserved'],
    [de ? 'Mietpreisbremse' : 'Rent brake', st.mpb ? (de ? `ja, bis ${h.date(st.mpbBis!)}` : `yes, until ${h.date(st.mpbBis!)}`) : (de ? 'nein' : 'no')],
    [de ? 'Kappungsgrenze' : 'Increase cap', `${h.pct(st.kappung, 0)}${st.kappungBis ? (de ? ` bis ${h.date(st.kappungBis)}` : ` until ${h.date(st.kappungBis)}`) : ''}`],
  ];
  return h.table([de ? 'Merkmal' : 'Item', de ? 'Angabe' : 'Detail'], rows, de ? `Mietspiegel ${S.name}: Eckdaten, Stand ${h.date(P.retrieved_at)}` : `${S.name} rent index: key facts as of ${h.date(P.retrieved_at)}`, ['l', 'l']);
}
export const offiziell = (S: Stadt, h: Helpers, text: string) => h.ext(S.rechner ?? S.url, text);
export type { Lang };
