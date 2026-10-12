/**
 * Mietspiegel Dortmund 2025/2026 (qualifiziert) : Basismiete nach Baujahresklasse (Referenz 60–80 m²),
 * puis Zu- und Abschläge additifs en €/m² appliqués au Mittelwert ET aux bornes de la Spanne
 * (Punkt 5 : taille, type, Bad, sol, chauffage, fenêtres, extérieur, accès, divers, modernisation
 * pour les immeubles d'avant 1980, Gebiet 1 à 7). Données : src/data/mietspiegel/dortmund.json.
 */
import D from '../../data/mietspiegel/dortmund.json';
export const DORTMUND = D;
const PAARE = [['Baderneuerung/-modernisierung 2009', 'Baderneuerung/-modernisierung 2015'], ['Kellerdecke 1995 bis 2014', 'Kellerdecke 2015 und danach']];
export function dortmundOvm(i: { baujahr: number; flaeche: number; gebiet: number; merkmale?: string[] }) {
  if (i.baujahr > D.baujahr_max) return { ok: false as const, grund: 'neubau' as const };
  if (i.flaeche < D.flaeche_min || i.flaeche > D.flaeche_max) return { ok: false as const, grund: 'flaeche' as const };
  const b = D.basis.find((x) => i.baujahr >= x.von && i.baujahr <= x.bis)!;
  const g = D.groesse.find((x) => i.flaeche >= x.von && i.flaeche <= x.bis) ?? D.groesse.find((x) => i.flaeche > x.von - 0.01 && i.flaeche <= x.bis)!;
  const geb = D.gebiete.find((x) => x.nr === i.gebiet) ?? D.gebiete[2];
  let gewaehlt = D.merkmale.filter((m) => (i.merkmale ?? []).includes(m.id));
  if (i.baujahr >= D.modern_vor) gewaehlt = gewaehlt.filter((m) => m.gruppe !== 'modern');
  // Une seule valeur par groupe exclusif (la dernière cochée) et par paire de dates exclusive (la plus élevée).
  for (const gr of D.exklusiv) { const xs = gewaehlt.filter((m) => m.gruppe === gr); if (xs.length > 1) gewaehlt = gewaehlt.filter((m) => m.gruppe !== gr || m === xs[xs.length - 1]); }
  for (const [a, c] of PAARE) { const x = gewaehlt.find((m) => m.text.includes(a)), y = gewaehlt.find((m) => m.text.includes(c)); if (x && y) gewaehlt = gewaehlt.filter((m) => m !== (x.wert < y.wert ? x : y)); }
  const zu = Math.round((g.wert + geb.wert + gewaehlt.reduce((s, m) => s + m.wert, 0)) * 100) / 100;
  const r = (x: number) => Math.round(x * 100) / 100;
  const ovm = r(b.mittel + zu);
  return { ok: true as const, basis: b, groesse: g.wert, gebiet: geb, merkmale: gewaehlt, zuschlag: zu, ovm, spanne: [r(b.unten + zu), r(b.oben + zu)] as [number, number], monat: r(ovm * i.flaeche) };
}
