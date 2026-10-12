/**
 * Berliner Mietspiegel 2026 (qualifiziert, Stichtag 1.9.2025) : Tabellenfeld nach Wohnlage,
 * Bezugsfertigkeit und Wohnfläche, puis Orientierungshilfe (cinq groupes de critères, ±20 % de
 * l'écart entre Mittelwert et bord de la Spanne, groupes compensés entre eux, Nr. 10.3 et 10.4)
 * et Abschlag Minderausstattung (−0,33 €/m², Nr. 9.4). Données : src/data/mietspiegel/berlin.json,
 * générées par scripts/mietspiegel/build-berlin.py depuis le PDF officiel.
 */
import B from '../../data/mietspiegel/berlin.json';

export type Lage = 'einfach' | 'mittel' | 'gut';
export type Baualter = 'b1918' | 'b1949' | 'b1964' | 'b1972' | 'w1985' | 'w1990' | 'o1990' | 'b2001' | 'b2009' | 'b2015' | 'b2019' | 'b2024';
export interface Zeile { zeile: number; lage: string; baualter: string; flaeche: (number | null)[]; unten: number; mittel: number; oben: number }
export const BERLIN = B as typeof B & { zeilen: Zeile[] };

/** Classe d'âge depuis l'année de « Bezugsfertigkeit » ; 1973–1990 dépend de l'Est ou de l'Ouest. */
export function baualterAus(jahr: number, ost: boolean): Baualter | null {
  if (jahr <= 1918) return 'b1918';
  if (jahr <= 1949) return 'b1949';
  if (jahr <= 1964) return 'b1964';
  if (jahr <= 1972) return 'b1972';
  if (jahr <= 1990) return ost ? 'o1990' : jahr <= 1985 ? 'w1985' : 'w1990';
  if (jahr <= 2001) return 'b2001';
  if (jahr <= 2009) return 'b2009';
  if (jahr <= 2015) return 'b2015';
  if (jahr <= 2019) return 'b2019';
  if (jahr <= 2024) return 'b2024';
  return null; // ab 2025 bezugsfertig : hors Mietspiegel
}

export function feld(lage: Lage, ba: Baualter, flaeche: number): Zeile | undefined {
  return BERLIN.zeilen.find((z) => z.lage === lage && z.baualter === ba && flaeche >= (z.flaeche[0] ?? 0) && (z.flaeche[1] === null || flaeche < (z.flaeche[1] as number)));
}

export interface BerlinIn {
  lage: Lage; baujahr: number; ost?: boolean; flaeche: number;
  /** Cinq groupes (Bad, Küche, Wohnung, Gebäude, Wohnumfeld) : +1 = plutôt positifs, −1 = plutôt négatifs, 0 = équilibré. */
  gruppen?: number[];
  /** Sans chauffage central et/ou sans salle de bains, WC intérieur, construit jusqu'en 1949. */
  minderausstattung?: boolean;
}
export interface BerlinOut { ok: boolean; grund?: 'neubau' | 'feld'; zeile?: Zeile; saldo: number; ovm: number; spanne: [number, number]; abschlag: number; monat: number }

export function berlinOvm(i: BerlinIn): BerlinOut {
  const ba = baualterAus(i.baujahr, !!i.ost);
  const leer = { saldo: 0, ovm: 0, spanne: [0, 0] as [number, number], abschlag: 0, monat: 0 };
  if (!ba) return { ok: false, grund: 'neubau', ...leer };
  const z = feld(i.lage, ba, i.flaeche);
  if (!z) return { ok: false, grund: 'feld', ...leer };
  const saldo = Math.max(-5, Math.min(5, (i.gruppen ?? []).reduce((a, b) => a + Math.sign(b), 0)));
  const q = BERLIN.orientierungshilfe_anteil;
  let ovm = saldo >= 0 ? z.mittel + saldo * q * (z.oben - z.mittel) : z.mittel + saldo * q * (z.mittel - z.unten);
  const abschlag = i.minderausstattung && i.baujahr <= 1949 ? BERLIN.minderausstattung_abschlag : 0;
  ovm = Math.round((ovm - abschlag) * 100) / 100;
  return { ok: true, zeile: z, saldo, ovm, spanne: [Math.round((z.unten - abschlag) * 100) / 100, Math.round((z.oben - abschlag) * 100) / 100], abschlag, monat: Math.round(ovm * i.flaeche * 100) / 100 };
}
