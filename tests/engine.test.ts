/** Tests du moteur : cas lus dans les textes (BGB, CO2KostAufG, Berliner Mietspiegel 2026). */
import { describe, expect, it } from 'vitest';
import { berlinOvm, feld, BERLIN } from '../src/lib/engine/berlin';
import { mietpreisbremse, rueckforderung, mieterhoehung, modernisierung, kaution, indexmiete, minderung, bkFristen, co2Aufteilung, kuendigung, werktag, wohnflaeche, staffel, heizkostenKuerzung, faelligeMonate } from '../src/lib/engine/miete';

describe('Berliner Mietspiegel 2026', () => {
  it('189 Zeilen, Spannen geordnet', () => {
    expect(BERLIN.zeilen).toHaveLength(189);
    for (const z of BERLIN.zeilen) expect(z.unten <= z.mittel && z.mittel <= z.oben).toBe(true);
  });
  it('Beispiel Nr. 10.4 : mittlere Lage, 1919–1949, 60 m², Saldo +1 → 7,75 €/m²', () => {
    const r = berlinOvm({ lage: 'mittel', baujahr: 1930, flaeche: 60, gruppen: [1, 1, 1, -1, -1] });
    expect(r.zeile?.zeile).toBe(81);
    expect(r.ovm).toBe(7.75);
  });
  it('alle Gruppen positiv → oberer Spannenwert, alle negativ → unterer', () => {
    expect(berlinOvm({ lage: 'mittel', baujahr: 1930, flaeche: 60, gruppen: [1, 1, 1, 1, 1] }).ovm).toBe(9.55);
    expect(berlinOvm({ lage: 'mittel', baujahr: 1930, flaeche: 60, gruppen: [-1, -1, -1, -1, -1] }).ovm).toBe(5.9);
  });
  it('Feldzuordnung an den Grenzen der Wohnfläche', () => {
    expect(feld('einfach', 'b1918', 34.9)?.zeile).toBe(1);
    expect(feld('einfach', 'b1918', 35)?.zeile).toBe(2);
    expect(feld('gut', 'b2024', 85)?.zeile).toBe(189);
    expect(feld('einfach', 'b2015', 200)?.zeile).toBe(63);
  });
  it('Ost/West 1973–1990 und Neubau ab 2025', () => {
    expect(berlinOvm({ lage: 'gut', baujahr: 1980, ost: true, flaeche: 30 }).zeile?.zeile).toBe(165);
    expect(berlinOvm({ lage: 'gut', baujahr: 1980, ost: false, flaeche: 30 }).zeile?.zeile).toBe(155);
    expect(berlinOvm({ lage: 'gut', baujahr: 2025, flaeche: 60 }).ok).toBe(false);
  });
  it('Minderausstattung bis 1949 : −0,33 €/m²', () => {
    expect(berlinOvm({ lage: 'mittel', baujahr: 1930, flaeche: 60, minderausstattung: true }).ovm).toBe(6.97);
    expect(berlinOvm({ lage: 'mittel', baujahr: 1960, flaeche: 60, minderausstattung: true }).abschlag).toBe(0);
  });
});

describe('Mietpreisbremse', () => {
  it('10 % über der Vergleichsmiete', () => {
    const r = mietpreisbremse({ ovm: 10, flaeche: 60, miete: 800, gebiet: true });
    expect(r.zulaessig).toBe(660);
    expect(r.ueberMonat).toBe(140);
  });
  it('Vormiete höher als die Grenze bleibt zulässig (§ 556e)', () => {
    expect(mietpreisbremse({ ovm: 10, flaeche: 60, miete: 800, gebiet: true, vormiete: 720 }).zulaessig).toBe(720);
  });
  it('Neubau nach dem 1.10.2014 und Gebiet ohne Verordnung : nicht anwendbar', () => {
    expect(mietpreisbremse({ ovm: 10, flaeche: 60, miete: 800, gebiet: true, neubau: true }).anwendbar).toBe(false);
    expect(mietpreisbremse({ ovm: 10, flaeche: 60, miete: 800, gebiet: false }).grund).toBe('gebiet');
  });
  it('Rückforderung : Rüge binnen 30 Monaten → ab Mietbeginn', () => {
    const r = rueckforderung({ ueberMonat: 100, beginn: '2025-01-01', ruege: '2026-06-15', heute: '2026-10-12' });
    expect(r.voll).toBe(true);
    expect(r.monate).toBe(22);
    expect(r.betrag).toBe(2200);
  });
  it('Rückforderung : Rüge nach 30 Monaten → erst ab dem Folgemonat', () => {
    const r = rueckforderung({ ueberMonat: 100, beginn: '2023-01-01', ruege: '2026-08-20', heute: '2026-10-12' });
    expect(r.voll).toBe(false);
    expect(r.ab).toBe('2026-09-01');
    expect(r.monate).toBe(2);
  });
  it('fällige Monate', () => { expect(faelligeMonate('2026-01-01', '2026-12-31')).toBe(12); });
});

describe('Mieterhöhung § 558', () => {
  it('Kappungsgrenze 15 % bindet vor der Vergleichsmiete', () => {
    const r = mieterhoehung({ miete: 600, flaeche: 60, ovm: 12, kappung: 0.15, verlangt: 720, zugang: '2026-10-05', letzteAenderung: '2024-01-01' });
    expect(r.grenzeKappung).toBe(690);
    expect(r.zulaessig).toBe(690);
    expect(r.bindend).toBe('kappung');
    expect(r.wirksam).toBe('2027-01-01');
    expect(r.zustimmungBis).toBe('2026-12-31');
  });
  it('Vergleichsmiete bindet, Sperrfrist 15 Monate', () => {
    const r = mieterhoehung({ miete: 600, flaeche: 60, ovm: 10.5, kappung: 0.2, verlangt: 700, zugang: '2026-03-10', letzteAenderung: '2025-04-01' });
    expect(r.zulaessig).toBe(630);
    expect(r.wirksam).toBe('2026-06-01');
    expect(r.sperrOk).toBe(false);
    expect(r.warteOk).toBe(false);
    expect(r.fruehWirksam).toBe('2026-07-01');
    expect(mieterhoehung({ miete: 600, flaeche: 60, ovm: 10.5, kappung: 0.2, verlangt: 700, zugang: '2026-03-10', letzteAenderung: '2025-03-01' }).sperrOk).toBe(true);
  });
});

describe('Modernisierung § 559', () => {
  it('8 % jährlich, Kappung 3 €/m²', () => {
    const r = modernisierung({ kosten: 30000, erhaltung: 6000, flaeche: 60, miete: 600 });
    expect(r.jahr).toBe(1920);
    expect(r.monat).toBe(160);
    const k = modernisierung({ kosten: 60000, flaeche: 60, miete: 600 });
    expect(k.kappungGreift).toBe(true);
    expect(k.monat).toBe(180);
  });
  it('unter 7 €/m² : 2 €/m² ; vereinfachtes Verfahren 30 %', () => {
    expect(modernisierung({ kosten: 60000, flaeche: 60, miete: 360 }).monat).toBe(120);
    const v = modernisierung({ kosten: 10000, flaeche: 60, miete: 600, vereinfacht: true });
    expect(v.erhaltung).toBe(3000);
    expect(v.monat).toBe(46.67);
  });
  it('§ 559e : 10 %, 15 % Pauschale, höchstens 0,50 €/m²', () => {
    const r = modernisierung({ kosten: 20000, drittmittel: 6000, flaeche: 70, miete: 700, heizung559e: true });
    expect(r.basis).toBe(11000);
    expect(r.monatRoh).toBe(91.67);
    expect(r.monat).toBe(35);
  });
});

describe('Kaution, Index, Staffel, Minderung', () => {
  it('Kaution höchstens drei Nettokaltmieten in drei Raten', () => {
    const r = kaution({ kaltmiete: 750, verlangt: 2500, beginn: '2026-11-01' });
    expect(r.hoechst).toBe(2250);
    expect(r.zuviel).toBe(250);
    expect(r.rate).toBe(750);
    expect(r.raten).toEqual(['2026-11-01', '2026-12-01', '2027-01-01']);
  });
  it('Indexmiete mit dem VPI des Statistischen Bundesamts', () => {
    const r = indexmiete({ miete: 800, von: '2025-08', bis: '2026-08', zugang: '2026-10-12' });
    expect(r.vpiVon).toBe(122.3);
    expect(r.vpiBis).toBe(125.8);
    expect(r.neu).toBe(822.89);
    expect(r.wirksam).toBe('2026-12-01');
  });
  it('Staffel : mindestens zwölf Monate zwischen zwei Stufen', () => {
    const s = staffel([{ ab: '2026-01-01', miete: 800 }, { ab: '2026-11-01', miete: 830 }]);
    expect(s[1].abstandOk).toBe(false);
  });
  it('Minderung auf die Bruttomiete, tageweise', () => {
    const r = minderung({ kalt: 700, nebenkosten: 200, quote: 0.1, von: '2026-01-01', bis: '2026-01-31' });
    expect(r.monat).toBe(90);
    expect(r.summe).toBe(90);
  });
});

describe('Betriebskosten, Heizung, CO2', () => {
  it('Abrechnungsfrist 12 Monate nach Periodenende, Einwendung 12 Monate nach Zugang', () => {
    const r = bkFristen({ periodeEnde: '2025-12-31', zugang: '2027-01-04' });
    expect(r.abrechnungBis).toBe('2026-12-31');
    expect(r.zuSpaet).toBe(true);
    expect(r.einwendungBis).toBe('2028-01-31');
  });
  it('CO2-Stufenmodell : 25,3 kg/m² → Stufe 4, Mieter 70 %', () => {
    const r = co2Aufteilung({ kg: 1897.5, flaeche: 75, kosten: 300 });
    expect(r.kgM2).toBe(25.3);
    expect(r.stufe).toBe(4);
    expect(r.mieter).toBe(210);
    expect(co2Aufteilung({ kg: 5200, flaeche: 100, kosten: 100 }).mieterAnteil).toBe(0.05);
    expect(co2Aufteilung({ kg: 1100, flaeche: 100, kosten: 100 }).mieterAnteil).toBe(1);
  });
  it('Kürzungsrechte HeizkostenV und CO2KostAufG', () => {
    expect(heizkostenKuerzung({ anteil: 1000, nichtVerbrauchsabhaengig: true }).betrag).toBe(150);
    expect(heizkostenKuerzung({ anteil: 1000, ohneCo2Aufteilung: true }).betrag).toBe(30);
  });
});

describe('Kündigung § 573c, Wohnfläche', () => {
  it('Samstag zählt als Werktag', () => {
    expect(werktag('2026-08-01', 3)).toBe('2026-08-04');
    expect(werktag('2026-01-01', 3)).toBe('2026-01-05');
    expect(werktag('2027-11-01', 3)).toBe('2027-11-03');
    expect(werktag('2027-11-01', 3, 'NW')).toBe('2027-11-04');
  });
  it('Mieter : drei Monate, Zugang bis zum 3. Werktag', () => {
    expect(kuendigung({ zugang: '2026-10-03', partei: 'mieter' }).ende).toBe('2026-12-31');
    expect(kuendigung({ zugang: '2026-10-07', partei: 'mieter' }).ende).toBe('2027-01-31');
  });
  it('Vermieter : sechs Monate nach fünf Jahren, neun nach acht', () => {
    expect(kuendigung({ zugang: '2026-10-02', partei: 'vermieter', ueberlassen: '2020-01-01' }).ende).toBe('2027-03-31');
    expect(kuendigung({ zugang: '2026-10-02', partei: 'vermieter', ueberlassen: '2015-01-01' }).ende).toBe('2027-06-30');
  });
  it('WoFlV : Dachschräge zur Hälfte, Balkon ein Viertel', () => {
    expect(wohnflaeche({ voll: 60, halb: 8, balkon: 6 }).flaeche).toBe(65.5);
  });
});

import { hamburgOvm, hhSpalte, HAMBURG } from '../src/lib/engine/hamburg';
describe('Hamburger Mietenspiegel 2025', () => {
  it('88 belegte Felder', () => { expect(HAMBURG.felder).toHaveLength(88); });
  it('Feld C1 : normale Lage, bis 1918, unter 41 m² → Mittelwert 13,77', () => {
    const r = hamburgOvm({ lage: 'normal', baujahr: 1905, flaeche: 35 });
    expect(r.ok && r.feld.feld).toBe('C1');
    expect(r.ok && r.ovm).toBe(13.77);
    expect(hamburgOvm({ lage: 'normal', baujahr: 1905, flaeche: 35, position: 0 }).ok && hamburgOvm({ lage: 'normal', baujahr: 1905, flaeche: 35, position: 0 })).toMatchObject({ ovm: 10.81 });
  });
  it('Baualter-Grenze 20.6.1948 und Leerfeld P5', () => {
    expect(hhSpalte(1948, 6)).toBe('F');
    expect(hhSpalte(1948, 7)).toBe('H');
    expect(hamburgOvm({ lage: 'gut', baujahr: 2022, flaeche: 35 }).ok).toBe(false);
  });
});

import { dortmundOvm, DORTMUND } from '../src/lib/engine/dortmund';
describe('Mietspiegel Dortmund 2025/2026', () => {
  const id = (t: string) => DORTMUND.merkmale.find((m) => m.text.startsWith(t))!.id;
  it('Beispiel der Stadt : 1950, 63 m², Innenstadt-Nord → 7,10 €/m², Spanne 6,04 bis 8,22', () => {
    const r = dortmundOvm({ baujahr: 1950, flaeche: 63, gebiet: 2, merkmale: [id('Badezimmer mit Dusche'), id('Hochwertiger PVC'), id('Wärmeschutzverglasung (U-Wert 1,1'), id('Wohnung über einen Aufzug'), id('Einen oder mehrere gefangene'), id('Baderneuerung/-modernisierung 2015')] });
    expect(r.ok && r.zuschlag).toBe(0.81);
    expect(r.ok && r.ovm).toBe(7.1);
    expect(r.ok && r.spanne).toEqual([6.04, 8.22]);
  });
  it('Kleinwohnung 22 m² : +1,74 ; Modernisierung nur vor 1980', () => {
    const a = dortmundOvm({ baujahr: 1965, flaeche: 22, gebiet: 3 });
    expect(a.ok && a.ovm).toBe(8.04);
    const b = dortmundOvm({ baujahr: 1990, flaeche: 70, gebiet: 3, merkmale: [id('Erneuerung/Austausch der gesamten')] });
    expect(b.ok && b.zuschlag).toBe(0);
    expect(dortmundOvm({ baujahr: 2021, flaeche: 70, gebiet: 3 }).ok).toBe(false);
  });
});
