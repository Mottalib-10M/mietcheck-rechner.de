/**
 * Hamburger Mietenspiegel 2025 (qualifiziert, Stichtag 1.4.2025) : Feld nach Wohnlage (normal, gut),
 * Baualter (Spalten C bis P) et Wohnfläche ; Mittelwert = médiane, Spanne = deux tiers des loyers.
 * L'Einordnung dans la Spanne est qualitative (Ziffer 6.3) : la position est un choix explicite de
 * l'utilisateur (0 = bas, 50 = Mittelwert, 100 = haut). Données ouvertes DL-DE-BY-2.0.
 */
import H from '../../data/mietspiegel/hamburg.json';
export type HhLage = 'normal' | 'gut';
export type HhSpalte = 'C' | 'F' | 'H' | 'I' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P';
export const HAMBURG = H;
export function hhSpalte(jahr: number, monat = 12): HhSpalte | null {
  if (jahr <= 1918) return 'C';
  if (jahr < 1948 || (jahr === 1948 && monat <= 6)) return 'F';
  if (jahr <= 1960) return 'H';
  if (jahr <= 1967) return 'I';
  if (jahr <= 1977) return 'K';
  if (jahr <= 1993) return 'L';
  if (jahr <= 2010) return 'M';
  if (jahr <= 2015) return 'N';
  if (jahr <= 2020) return 'O';
  if (jahr <= 2024) return 'P';
  return null;
}
export function hhFeld(lage: HhLage, sp: HhSpalte, flaeche: number) {
  return H.felder.find((f) => f.lage === lage && f.baualter === sp && flaeche >= (f.flaeche[0] ?? 0) && (f.flaeche[1] === null || flaeche < (f.flaeche[1] as number)));
}
export function hamburgOvm(i: { lage: HhLage; baujahr: number; flaeche: number; position?: number }) {
  const sp = hhSpalte(i.baujahr);
  if (!sp) return { ok: false as const, grund: 'neubau' as const };
  const f = hhFeld(i.lage, sp, i.flaeche);
  if (!f) return { ok: false as const, grund: 'leer' as const, spalte: sp };
  const p = Math.max(0, Math.min(100, i.position ?? 50));
  const ovm = p <= 50 ? f.unten + (f.mittel - f.unten) * (p / 50) : f.mittel + (f.oben - f.mittel) * ((p - 50) / 50);
  const r = Math.round(ovm * 100) / 100;
  return { ok: true as const, feld: f, spalte: sp, ovm: r, monat: Math.round(r * i.flaeche * 100) / 100 };
}
