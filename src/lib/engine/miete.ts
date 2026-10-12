/**
 * Moteur du droit du bail allemand (BGB, BetrKV, HeizkostenV, CO2KostAufG, WoFlV).
 * Fonctions pures, toutes les valeurs légales lues dans params-2026.json. Montants en euros,
 * loyers mensuels, surfaces en m², dates ISO. Tests : tests/engine.test.ts.
 */
import { P } from './params';
import { addMonths, cmp, daysBetween, daysInMonth, endOfMonth, firstOfMonthAfter, parse, iso, addDays } from './dates';

const r2 = (x: number) => Math.round(x * 100) / 100;

/* ---------- Mietpreisbremse (§§ 556d–556g BGB) ---------- */
export interface MpbIn {
  /** Ortsübliche Vergleichsmiete, €/m² netto kalt. */ ovm: number;
  flaeche: number;
  /** Vereinbarte Nettokaltmiete, €/Monat. */ miete: number;
  /** Liegt die Gemeinde bei Vertragsschluss in einem Gebiet der Landesverordnung? */ gebiet: boolean;
  /** Erstmals genutzt und vermietet nach dem 1.10.2014 (§ 556f Satz 1). */ neubau?: boolean;
  /** Erste Vermietung nach umfassender Modernisierung (§ 556f Satz 2). */ umfassendModernisiert?: boolean;
  /** Vormiete, €/Monat (§ 556e Abs. 1), ohne Erhöhungen im letzten Jahr. */ vormiete?: number;
  /** Zuschlag aus Modernisierung der letzten drei Jahre, €/Monat (§ 556e Abs. 2). */ modZuschlag?: number;
}
export interface MpbOut { anwendbar: boolean; grund?: 'gebiet' | 'neubau' | 'modernisierung'; grenzeOvm: number; zulaessig: number; basis: 'ovm' | 'vormiete'; ueberMonat: number; ueberProzent: number }
export function mietpreisbremse(i: MpbIn): MpbOut {
  const grenzeOvm = r2(i.ovm * i.flaeche * (1 + P.mpb.aufschlag));
  const grund = !i.gebiet ? 'gebiet' : i.neubau ? 'neubau' : i.umfassendModernisiert ? 'modernisierung' : undefined;
  if (grund) return { anwendbar: false, grund, grenzeOvm, zulaessig: i.miete, basis: 'ovm', ueberMonat: 0, ueberProzent: 0 };
  const vm = i.vormiete ?? 0;
  const basis = vm > grenzeOvm ? 'vormiete' : 'ovm';
  const zulaessig = r2(Math.max(grenzeOvm, vm) + (i.modZuschlag ?? 0));
  const ueberMonat = r2(Math.max(0, i.miete - zulaessig));
  return { anwendbar: true, grenzeOvm, zulaessig, basis, ueberMonat, ueberProzent: zulaessig > 0 ? ueberMonat / zulaessig : 0 };
}

/** Monate, für die eine Miete fällig wurde: jeder Monatserste von `von` bis `bis` (beide eingeschlossen, Monat von `von` zählt). */
export function faelligeMonate(von: string, bis: string): number {
  if (cmp(bis, von) < 0) return 0;
  const a = parse(von), b = parse(bis);
  return (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + b.getUTCMonth() - a.getUTCMonth() + 1;
}

/** Rückforderung nach § 556g Abs. 2: volle Rückzahlung bei Rüge binnen 30 Monaten und laufendem Vertrag, sonst ab dem auf die Rüge folgenden Monat. */
export function rueckforderung(i: { ueberMonat: number; beginn: string; ruege: string; heute: string; beendet?: boolean }) {
  const frist = addMonths(i.beginn, P.mpb.ruege_monate);
  const voll = cmp(i.ruege, frist) <= 0 && !i.beendet;
  const ab = voll ? i.beginn : firstOfMonthAfter(i.ruege, 1);
  const monate = faelligeMonate(ab, i.heute);
  return { voll, frist, ab, monate, betrag: r2(monate * i.ueberMonat) };
}

/* ---------- Mieterhöhung bis zur Vergleichsmiete (§§ 558–558b BGB) ---------- */
export interface ErhIn {
  /** Aktuelle Nettokaltmiete, €/Monat. */ miete: number;
  /** Nettokaltmiete vor drei Jahren (ohne §§ 559–560), €/Monat; leer = aktuelle Miete. */ mieteVor3?: number;
  flaeche: number;
  /** Ortsübliche Vergleichsmiete, €/m². */ ovm: number;
  /** Kappungsgrenze 0,15 oder 0,20. */ kappung: number;
  /** Verlangte neue Miete, €/Monat. */ verlangt: number;
  /** Zugang des Erhöhungsverlangens. */ zugang: string;
  /** Datum, ab dem die Miete zuletzt geändert wurde (ohne §§ 559–560). */ letzteAenderung: string;
}
export function mieterhoehung(i: ErhIn) {
  const basis3 = i.mieteVor3 && i.mieteVor3 > 0 ? i.mieteVor3 : i.miete;
  const grenzeOvm = r2(i.ovm * i.flaeche);
  const grenzeKappung = r2(basis3 * (1 + i.kappung));
  const hoechst = Math.max(i.miete, Math.min(grenzeOvm, grenzeKappung));
  const zulaessig = r2(Math.min(Math.max(i.verlangt, i.miete), hoechst));
  const bindend: 'ovm' | 'kappung' = grenzeOvm <= grenzeKappung ? 'ovm' : 'kappung';
  const wirksam = firstOfMonthAfter(i.zugang, P.erhoehung.wirkung_kalendermonat);
  const zustimmungBis = endOfMonth(i.zugang, P.erhoehung.zustimmung_kalendermonate);
  const klageBis = endOfMonth(i.zugang, P.erhoehung.zustimmung_kalendermonate + P.erhoehung.klagefrist_monate);
  const sperrEnde = addMonths(i.letzteAenderung, P.erhoehung.sperrfrist_monate);
  const warteEnde = addMonths(i.letzteAenderung, P.erhoehung.wartefrist_monate);
  const sperrOk = cmp(wirksam, sperrEnde) >= 0;
  const warteOk = cmp(i.zugang, warteEnde) >= 0;
  // Frühester Wirkungszeitpunkt: 15 Monate unverändert und Verlangen frühestens nach 12 Monaten.
  const fruehWirksam = [sperrEnde, firstOfMonthAfter(warteEnde, P.erhoehung.wirkung_kalendermonat)].sort()[1];
  return {
    grenzeOvm, grenzeKappung, hoechst: r2(hoechst), zulaessig, bindend,
    ueberMonat: r2(Math.max(0, i.verlangt - zulaessig)), plusMonat: r2(zulaessig - i.miete),
    plusProzent: i.miete > 0 ? (zulaessig - i.miete) / i.miete : 0,
    wirksam, zustimmungBis, klageBis, sperrOk, warteOk, sperrEnde, warteEnde, fruehWirksam,
  };
}

/* ---------- Modernisierung (§§ 559, 559c, 559e BGB) ---------- */
export interface ModIn {
  /** Für die Wohnung aufgewendete Kosten, €. */ kosten: number;
  /** Ersparte Erhaltungskosten, € (ignoriert im vereinfachten Verfahren). */ erhaltung?: number;
  /** Drittmittel (Zuschüsse), €. */ drittmittel?: number;
  flaeche: number;
  /** Nettokaltmiete vor der Erhöhung, €/Monat. */ miete: number;
  /** In den letzten sechs Jahren schon erfolgte Modernisierungserhöhungen, €/m² monatlich. */ bisherM2?: number;
  vereinfacht?: boolean;
  /** Neue Heizungsanlage nach § 559e mit Förderung (10 %). */ heizung559e?: boolean;
}
export function modernisierung(i: ModIn) {
  const M = P.modernisierung;
  const vereinfachtMoeglich = i.kosten <= M.vereinfacht_bis;
  const vereinfacht = !!i.vereinfacht && vereinfachtMoeglich && !i.heizung559e;
  const erhaltung = i.heizung559e ? i.kosten * M.erhaltung_pauschal_559e : vereinfacht ? i.kosten * M.vereinfacht_pauschale : Math.min(i.erhaltung ?? 0, i.kosten);
  const umlage = i.heizung559e ? M.umlage_559e : M.umlage;
  const basis = Math.max(0, i.kosten - erhaltung - (i.drittmittel ?? 0));
  const jahr = basis * umlage;
  const monatRoh = jahr / 12;
  const m2Alt = i.flaeche > 0 ? i.miete / i.flaeche : 0;
  const kapM2 = i.heizung559e ? M.heizung_kappung_m2 : m2Alt < M.niedrig_unter_m2 ? M.kappung_m2_niedrig : M.kappung_m2;
  const rest = Math.max(0, kapM2 - (i.bisherM2 ?? 0));
  const monat = Math.min(monatRoh, rest * i.flaeche);
  return { vereinfacht, vereinfachtMoeglich, erhaltung: r2(erhaltung), basis: r2(basis), umlage, jahr: r2(jahr), monatRoh: r2(monatRoh), kapM2, kappungGreift: monat < monatRoh - 0.005, monat: r2(monat), neueMiete: r2(i.miete + monat), m2Alt };
}

/* ---------- Kaution (§ 551 BGB) ---------- */
export function kaution(i: { kaltmiete: number; verlangt?: number; beginn?: string; zins?: number; jahre?: number }) {
  const hoechst = r2(i.kaltmiete * P.kaution.faktor);
  const verlangt = i.verlangt ?? hoechst;
  const rate = r2(Math.min(verlangt, hoechst) / P.kaution.raten);
  const raten = i.beginn ? Array.from({ length: P.kaution.raten }, (_, k) => (k === 0 ? i.beginn! : firstOfMonthAfter(i.beginn!, k))) : [];
  const zinsen = i.zins && i.jahre ? r2(Math.min(verlangt, hoechst) * (Math.pow(1 + i.zins, i.jahre) - 1)) : 0;
  return { hoechst, zuviel: r2(Math.max(0, verlangt - hoechst)), rate, raten, zinsen, verzugsgrenze: r2(i.kaltmiete * P.kaution.verzug_kuendigung_monatsmieten) };
}

/* ---------- Indexmiete (§ 557b BGB) ---------- */
export const VPI = P.vpi.werte as Record<string, number>;
export const vpiMonate = Object.keys(VPI).sort();
export function indexmiete(i: { miete: number; von: string; bis: string; zugang?: string }) {
  const a = VPI[i.von], b = VPI[i.bis];
  if (a === undefined || b === undefined) throw new Error(`VPI absent : ${i.von} / ${i.bis}`);
  const faktor = b / a;
  const neu = r2(i.miete * faktor);
  return { vpiVon: a, vpiBis: b, aenderung: faktor - 1, neu, plus: r2(neu - i.miete), wirksam: i.zugang ? firstOfMonthAfter(i.zugang, 2) : undefined };
}

/* ---------- Staffelmiete (§ 557a BGB) ---------- */
export function staffel(stufen: Array<{ ab: string; miete: number }>, opt: { ovm?: number; flaeche?: number; gebiet?: boolean } = {}) {
  const s = [...stufen].sort((x, y) => cmp(x.ab, y.ab));
  return s.map((st, k) => {
    const prev = s[k - 1];
    const abstandOk = !prev || cmp(st.ab, addMonths(prev.ab, P.staffel.min_monate)) >= 0;
    const grenze = opt.gebiet && opt.ovm && opt.flaeche ? r2(opt.ovm * opt.flaeche * (1 + P.mpb.aufschlag)) : undefined;
    return { ...st, abstandOk, plus: prev ? r2(st.miete - prev.miete) : 0, grenze, ueber: grenze !== undefined ? r2(Math.max(0, st.miete - grenze)) : 0 };
  });
}

/* ---------- Mietminderung (§ 536 BGB) : base = loyer brut (BGH XII ZR 225/03) ---------- */
export function minderung(i: { kalt: number; nebenkosten: number; quote: number; von: string; bis: string }) {
  const brutto = i.kalt + i.nebenkosten;
  const monat = r2(brutto * i.quote);
  // Jour par jour : chaque jour vaut (loyer brut × quote) / jours du mois.
  let summe = 0, d = i.von, tage = 0;
  while (cmp(d, i.bis) <= 0) { summe += (brutto * i.quote) / daysInMonth(d); tage++; d = addDays(d, 1); if (tage > 3700) break; }
  return { brutto: r2(brutto), monat, tage, summe: r2(summe), neueMiete: r2(brutto - monat) };
}

/* ---------- Betriebskosten : délais (§ 556 Abs. 3 BGB) ---------- */
export function bkFristen(i: { periodeEnde: string; zugang?: string; heute?: string }) {
  const abrechnungBis = endOfMonth(i.periodeEnde, P.betriebskosten.abrechnung_monate);
  const zuSpaet = i.zugang ? cmp(i.zugang, abrechnungBis) > 0 : undefined;
  const einwendungBis = i.zugang ? endOfMonth(i.zugang, P.betriebskosten.einwendung_monate) : undefined;
  return { abrechnungBis, zuSpaet, einwendungBis, offen: einwendungBis && i.heute ? cmp(i.heute, einwendungBis) <= 0 : undefined };
}
/** Coût annuel d'un poste ramené au m² et au mois (méthode de la Berliner Betriebskostenübersicht). */
export const proM2Monat = (jahresbetrag: number, flaeche: number, monate = 12) => (flaeche > 0 && monate > 0 ? jahresbetrag / flaeche / monate : 0);
export function bkVergleich(i: { kalt: number; warm: number; flaeche: number; monate?: number }) {
  const kalt = proM2Monat(i.kalt, i.flaeche, i.monate), warm = proM2Monat(i.warm, i.flaeche, i.monate);
  return { kalt: r2(kalt), warm: r2(warm), refKalt: P.berlin_bk.kalt_m2, refWarm: P.berlin_bk.warm_m2, abwKalt: P.berlin_bk.kalt_m2 ? kalt / P.berlin_bk.kalt_m2 - 1 : 0, abwWarm: P.berlin_bk.warm_m2 ? warm / P.berlin_bk.warm_m2 - 1 : 0 };
}
/** Neue Vorauszahlung nach § 560 Abs. 4 : Ergebnis der Abrechnung ÷ 12 auf die bisherige Vorauszahlung. */
export function vorauszahlung(i: { bisher: number; ergebnis: number; monate?: number }) {
  const m = i.monate ?? 12;
  const neu = Math.max(0, i.bisher + i.ergebnis / m);
  return { neu: r2(neu), diff: r2(neu - i.bisher) };
}

/* ---------- Heizkosten (HeizkostenV §§ 7, 12) ---------- */
export function heizkostenKuerzung(i: { anteil: number; nichtVerbrauchsabhaengig?: boolean; ohneInfo?: boolean; ohneCo2Aufteilung?: boolean }) {
  const q = (i.nichtVerbrauchsabhaengig ? P.heizkosten.kuerzung_pauschal : 0) + (i.ohneInfo ? P.heizkosten.kuerzung_info : 0) + (i.ohneCo2Aufteilung ? P.co2.kuerzung : 0);
  return { quote: q, betrag: r2(i.anteil * q), rest: r2(i.anteil * (1 - q)) };
}

/* ---------- CO2-Kosten (CO2KostAufG § 5 + Anlage) ---------- */
export function co2Aufteilung(i: { kg: number; flaeche: number; kosten: number; einschraenkung?: 'keine' | 'eine' | 'beide' }) {
  const kgM2 = i.flaeche > 0 ? Math.round((i.kg / i.flaeche) * 10) / 10 : 0;
  const idx = P.co2.stufen.findIndex((s) => s.bis === null || kgM2 < (s.bis as number));
  const st = P.co2.stufen[idx];
  let vermieter = 1 - st.mieter;
  if (i.einschraenkung === 'eine') vermieter *= P.co2.denkmal_halbierung;
  if (i.einschraenkung === 'beide') vermieter = 0;
  vermieter = Math.round(vermieter * 10000) / 10000;
  return { kgM2, stufe: idx + 1, mieterAnteil: Math.round((1 - vermieter) * 10000) / 10000, vermieterAnteil: vermieter, mieter: r2(i.kosten * (1 - vermieter)), vermieter: r2(i.kosten * vermieter) };
}

/* ---------- Kündigungsfrist (§ 573c BGB) ---------- */
/** Jours fériés fédéraux et des Länder pouvant tomber dans les trois premiers jours ouvrables d'un mois. */
function ostern(y: number) { const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1; return iso(new Date(Date.UTC(y, mo - 1, da))); }
export const LAENDER = ['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'MV', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'] as const;
export type Land = (typeof LAENDER)[number];
export function feiertage(y: number, land?: Land): Set<string> {
  const o = ostern(y);
  const f = [`${y}-01-01`, addDays(o, -2), addDays(o, 1), `${y}-05-01`, addDays(o, 39), addDays(o, 50), `${y}-10-03`, `${y}-12-25`, `${y}-12-26`];
  if (land && ['BW', 'BY', 'ST'].includes(land)) f.push(`${y}-01-06`);
  if (land && ['BW', 'BY', 'NW', 'RP', 'SL'].includes(land)) f.push(`${y}-11-01`);
  if (land && ['BW', 'BY', 'HE', 'NW', 'RP', 'SL'].includes(land)) f.push(addDays(o, 60));
  if (land && ['BB', 'HB', 'HH', 'MV', 'NI', 'SN', 'ST', 'SH', 'TH'].includes(land)) f.push(`${y}-10-31`);
  if (land === 'BE' || land === 'MV') f.push(`${y}-03-08`);
  if (land === 'TH') f.push(`${y}-09-20`);
  return new Set(f);
}
/** n-ième jour ouvrable du mois (le samedi compte, BGH VIII ZR 206/04 ; dimanches et jours fériés exclus). */
export function werktag(monatIso: string, n: number, land?: Land) {
  const d0 = parse(monatIso); const y = d0.getUTCFullYear();
  const ft = feiertage(y, land);
  let d = iso(new Date(Date.UTC(y, d0.getUTCMonth(), 1))), k = 0;
  for (;;) { const wd = parse(d).getUTCDay(); if (wd !== 0 && !ft.has(d)) { k++; if (k === n) return d; } d = addDays(d, 1); }
}
export function kuendigung(i: { zugang: string; partei: 'mieter' | 'vermieter'; ueberlassen?: string; land?: Land }) {
  const K = P.kuendigung;
  let monate = K.mieter_monate;
  if (i.partei === 'vermieter' && i.ueberlassen) {
    const jahre = daysBetween(i.ueberlassen, i.zugang) / 365.2425;
    for (const s of K.vermieter_stufen) if (jahre >= s.ab_jahren) monate = s.monate;
  }
  const stichtag = werktag(i.zugang, K.karenz_werktage, i.land);
  const imMonat = cmp(i.zugang, stichtag) <= 0;
  // Fristbeginn : mois de réception si dans les 3 jours ouvrables, sinon mois suivant ; fin au dernier jour du (monate − 1)-ième mois suivant.
  const basis = imMonat ? i.zugang : firstOfMonthAfter(i.zugang, 1);
  const ende = endOfMonth(basis, monate - 1);
  const samstag = parse(stichtag).getUTCDay() === 6;
  return { monate, stichtag, imMonat, ende, samstag };
}

/* ---------- Wohnfläche (WoFlV § 4) ---------- */
export function wohnflaeche(i: { voll: number; halb: number; balkon: number; balkonQuote?: number; wintergarten?: number }) {
  const q = Math.min(i.balkonQuote ?? P.woflv.balkon_regel, P.woflv.balkon_max);
  const f = i.voll + i.halb * 0.5 + i.balkon * q + (i.wintergarten ?? 0) * P.woflv.wintergarten_unbeheizt;
  return { flaeche: r2(f), balkonAnteil: r2(i.balkon * q), halbAnteil: r2(i.halb * 0.5) };
}
