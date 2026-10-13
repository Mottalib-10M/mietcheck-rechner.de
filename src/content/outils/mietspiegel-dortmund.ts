import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { dortmundOvm, DORTMUND } from '../../lib/engine/dortmund';
import { stadt, stadtStatus } from '../../lib/engine/staedte';
import { mietpreisbremse } from '../../lib/engine/miete';
import { formatMoney, displayDate } from '../../lib/format';

const S = stadt('dortmund')!;
const st = stadtStatus(S, P.retrieved_at);
const id = (t: string) => DORTMUND.merkmale.find((m) => m.text.startsWith(t))!.id;
const ok = <T extends { ok: boolean }>(x: T) => x as Extract<T, { ok: true }>;
// L'exemple de la ville (brochure, point 5) : 1950, 63 m², Innenstadt-Nord.
const bsp = ok(dortmundOvm({ baujahr: 1950, flaeche: 63, gebiet: 2, merkmale: [id('Badezimmer mit Dusche'), id('Hochwertiger PVC'), id('Wärmeschutzverglasung (U-Wert 1,1'), id('Wohnung über einen Aufzug'), id('Einen oder mehrere gefangene'), id('Baderneuerung/-modernisierung 2015')] }));
const klein = ok(dortmundOvm({ baujahr: 1965, flaeche: 38, gebiet: 1 }));
const hoerde = ok(dortmundOvm({ baujahr: 2016, flaeche: 85, gebiet: 7, merkmale: [id('Fußbodenheizung'), id('Barrierearme')] }));
const mp = mietpreisbremse({ ovm: bsp.ovm, flaeche: 63, miete: 560, gebiet: st.mpb });
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');
const gebieteDe = DORTMUND.gebiete.map((g) => `${g.nr} ${g.name}`).join(', ');

export default defineGuide({
  id: 'mietspiegel-dortmund',
  group: 'staedte',
  order: 25,
  tool: 'stadt',
  ort: 'dortmund',
  related: ['mietspiegel-essen', 'mpb-nw', 'mietpreisbremse-rechner', 'vergleichsmiete', 'mieterhoehung-rechner'],
  sources: ['dortmundMs', 'bgb558d', 'bgb556d'],
  de: {
    slug: 'mietspiegel-dortmund',
    nav: 'Mietspiegel Dortmund',
    card: 'Basismiete nach Baujahr plus Zu- und Abschläge, Gebiete 1 bis 7.',
    title: 'Mietspiegel Dortmund 2026: Vergleichsmiete mit Zuschlägen',
    description: 'Mietspiegel Dortmund 2025/2026 als Rechner: Basismiete nach Baujahr, Zu- und Abschläge für Größe, Ausstattung und Gebiet, gültig bis Ende 2026, Mietpreisbremse.',
    h1: 'Mietspiegel Dortmund: Basismiete plus Zu- und Abschläge',
    intro: 'Baujahr und Fläche geben die Basis, das Gebiet und die Ausstattung die Zu- und Abschläge in Euro je Quadratmeter.',
    resume: `Der Mietspiegel Dortmund 2025/2026 ist ein qualifizierter Mietspiegel des Amtes für Wohnen, gültig vom ${dD(S.gueltigAb!)} bis zum ${dD(S.gueltigBis!)} und veröffentlicht im Amtsblatt der Stadt vom 20. Dezember 2024. Er arbeitet anders als die Tabellen von Berlin und Hamburg: Eine Basistabelle nennt für neun Baujahresklassen von vor 1910 bis 2019 Mittelwert und Spanne für Wohnungen von 60 bis 80 m². Auf diese Basis werden Zu- und Abschläge in Euro je Quadratmeter addiert, und zwar auf Mittelwert und Spannengrenzen gleichermaßen: für die Wohnungsgröße, den Wohnungstyp, Bad, Boden, Heizung, Fenster, Balkon, Aufzug, Modernisierungen und das Gebiet. Das Rechenbeispiel der Stadt, eine Wohnung von 1950 mit 63 m² in der Innenstadt-Nord, kommt so von ${eD(bsp.basis.mittel)} Basis und ${eD(bsp.zuschlag)} Zuschlägen auf ${eD(bsp.ovm)} je Quadratmeter, mit einer Spanne von ${eD(bsp.spanne[0])} bis ${eD(bsp.spanne[1])}. Dortmund steht in der Mieterschutzverordnung von Nordrhein-Westfalen: Mietpreisbremse bis zum ${dD(st.mpbBis!)}, Kappungsgrenze 15 Prozent.`,
    faqs: [
      { q: 'In welchem der sieben Dortmunder Gebiete liegt meine Wohnung?', a: `Das zeigt die Gebietskarte zum Mietspiegel, die die Stadt online bereitstellt. Die Gebiete heißen ${gebieteDe}. Der Zuschlag reicht von null Euro im Gebiet Dortmund-West bis ${eD(Math.max(...DORTMUND.gebiete.map((g) => g.wert)))} je Quadratmeter in der Innenstadt-Mitte. Eine Einstufung nach Straßen wie in Berlin oder Hamburg gibt es in Dortmund nicht.` },
      { q: 'Warum ist eine kleine Wohnung in Dortmund pro Quadratmeter teurer?', a: `Weil der Mietspiegel für Wohnungen unter 60 m² einen Größenzuschlag vorsieht, der bei den kleinsten Wohnungen am höchsten ist. Eine Wohnung von 1965 mit 38 m² in der Innenstadt-Mitte kommt ohne weitere Merkmale auf ${eD(klein.ovm)} je Quadratmeter, davon ${eD(klein.groesse)} Größenzuschlag. Wohnungen über 80 m² bekommen dagegen einen kleinen Abschlag.` },
      { q: 'Zählen Modernisierungen in einem Dortmunder Neubau?', a: 'Nein. Die Zuschläge für Heizungserneuerung, Baderneuerung, neue Fenster, Elektrik, Böden und Dämmung gelten nur für Gebäude, die vor 1980 errichtet wurden, und nur, wenn der Vermieter die Arbeiten ausgeführt hat. Bei jüngeren Gebäuden ignoriert der Rechner diese Häkchen. Ausstattung, die Sie selbst eingebaut haben, zählt nie.' },
    ],
    body: (h) => `
<h2>So rechnet der Dortmunder Mietspiegel</h2>
<p>Zuerst die Basismiete aus der Baujahresklasse. Dann die Größe: Für Wohnungen außerhalb der Referenzgröße von 60 bis 80 m² gibt es einen Zu- oder Abschlag. Danach die Merkmale, die vom Standard abweichen: Standard sind ein Bad mit WC und Badewanne, Laminat oder einfaches PVC, Zentralheizung, Isolierverglasung und ein Balkon. Wer eine Dusche, Parkett oder einen Aufzug hat, bekommt einen Zuschlag; wer Einzelöfen oder keinen Balkon hat, einen Abschlag. Zuletzt das Gebiet. Alle Beträge sind Euro je Quadratmeter und werden addiert, auch auf die Spannengrenzen. Die Werte stammen aus dem ${h.src('dortmundMs', 'Mietspiegel der Stadt Dortmund')}, veröffentlicht als amtliche Bekanntmachung und als offene Daten unter der Datenlizenz Deutschland Zero.</p>
${h.table(['Wohnung', 'Basis', 'Zu- und Abschläge', 'Vergleichsmiete'], [
  ['1950, 63 m², Innenstadt-Nord, Beispiel der Stadt', h.eur(bsp.basis.mittel, 2), h.eur(bsp.zuschlag, 2), h.eur(bsp.ovm, 2)],
  ['1965, 38 m², Innenstadt-Mitte', h.eur(klein.basis.mittel, 2), h.eur(klein.zuschlag, 2), h.eur(klein.ovm, 2)],
  ['2016, 85 m², Hörde, Fußbodenheizung, barrierearm', h.eur(hoerde.basis.mittel, 2), h.eur(hoerde.zuschlag, 2), h.eur(hoerde.ovm, 2)],
], 'Mietspiegel Dortmund 2025/2026, Euro je m² netto kalt', ['l', 'r', 'r', 'r'])}
<h2>Was das für Ihre Miete heißt</h2>
<p>Bei einer Neuvermietung darf die Miete in Dortmund höchstens zehn Prozent über der Vergleichsmiete liegen. Für die Beispielwohnung der Stadt sind das ${h.eur(mp.zulaessig, 2)} im Monat; wer ${h.eur(560, 0)} vereinbart hat, zahlt ${h.eur(mp.ueberMonat, 2)} zu viel. Bei Mieterhöhungen gilt die abgesenkte Kappungsgrenze von 15 Prozent, wie in den übrigen Städten der ${h.a('mpb-nw', 'Verordnung für Nordrhein-Westfalen')}. Die Nachbarstadt Essen steht dagegen nicht in der Verordnung; ihre Seite ${h.a('mietspiegel-essen', 'Mietspiegel Essen')} erklärt, was das bedeutet. Der Mietspiegel läuft Ende 2026 aus; eine neue Ausgabe ist ab 2027 zu erwarten, und der Rechner wird umgestellt, sobald sie veröffentlicht ist.</p>
`,
  },
  en: {
    slug: 'dortmund-rent-index',
    nav: 'Dortmund rent index',
    card: 'Base rent by year built plus adjustments, areas 1 to 7.',
    title: 'Dortmund Rent Index 2026: Reference Rent with Adjustments',
    description: 'Dortmund rent index 2025/2026 as a calculator: base rent by year built, adjustments for size, fittings and area, valid to the end of 2026, plus the rent brake.',
    h1: 'Dortmund rent index: base rent plus adjustments',
    intro: 'Year built and floor area give the base; the area and the fittings add or subtract euros per square metre.',
    resume: `Dortmund's 2025/2026 rent index (Mietspiegel) is a qualified index from the city's housing office, valid from ${dE(S.gueltigAb!)} to ${dE(S.gueltigBis!)} and published in the city's official gazette of 20 December 2024. It works differently from the Berlin and Hamburg tables: a base table gives the mean and range for nine construction periods from before 1910 to 2019, for flats of 60 to 80 m². To this base, adjustments in euros per square metre are added, to the mean and to both ends of the range alike: for flat size, type of flat, bathroom, flooring, heating, windows, balcony, lift, modernisations and area. The city's own worked example, a 1950 flat of 63 m² in Innenstadt-Nord, goes from a base of ${eE(bsp.basis.mittel)} plus ${eE(bsp.zuschlag)} of adjustments to ${eE(bsp.ovm)} per square metre, with a range of ${eE(bsp.spanne[0])} to ${eE(bsp.spanne[1])}. Dortmund is listed in North Rhine-Westphalia's tenant-protection ordinance: rent brake until ${dE(st.mpbBis!)} and a 15 per cent cap.`,
    faqs: [
      { q: 'Which of Dortmund’s seven areas is my flat in?', a: `The city's online map for the rent index shows it. The areas are ${gebieteDe}. The adjustment ranges from zero in Dortmund-West to ${eE(Math.max(...DORTMUND.gebiete.map((g) => g.wert)))} per square metre in Innenstadt-Mitte. Dortmund has no street-by-street rating like Berlin or Hamburg.` },
      { q: 'Why does a small flat in Dortmund cost more per square metre?', a: `Because the index adds a size premium for flats under 60 m², highest for the smallest. A 1965 flat of 38 m² in Innenstadt-Mitte comes to ${eE(klein.ovm)} per square metre without other features, of which ${eE(klein.groesse)} is the size premium. Flats over 80 m² get a small deduction instead.` },
      { q: 'Do modernisations count in a newer Dortmund building?', a: 'No. The premiums for new heating, bathroom renovation, new windows, wiring, floors and insulation only apply to buildings erected before 1980, and only where the landlord did the work. For newer buildings the calculator ignores these boxes. Fittings you installed yourself never count.' },
    ],
    body: (h) => `
<h2>How the Dortmund index calculates</h2>
<p>First the base rent from the construction period. Then size: flats outside the reference size of 60 to 80 m² get a premium or deduction. Next the features that differ from the standard: the standard is a bathroom with toilet and bath, laminate or plain vinyl, central heating, double glazing and a balcony. A shower, parquet or a lift earns a premium; stoves or no balcony a deduction. Finally the area. All amounts are euros per square metre and are added, to the range limits too. The values come from the ${h.src('dortmundMs', 'City of Dortmund rent index')}, published as an official notice and as open data under the German open-data licence Zero.</p>
${h.table(['Flat', 'Base', 'Adjustments', 'Reference rent'], [
  ['1950, 63 m², Innenstadt-Nord, city example', h.eur(bsp.basis.mittel, 2), h.eur(bsp.zuschlag, 2), h.eur(bsp.ovm, 2)],
  ['1965, 38 m², Innenstadt-Mitte', h.eur(klein.basis.mittel, 2), h.eur(klein.zuschlag, 2), h.eur(klein.ovm, 2)],
  ['2016, 85 m², Hörde, underfloor heating, low-barrier', h.eur(hoerde.basis.mittel, 2), h.eur(hoerde.zuschlag, 2), h.eur(hoerde.ovm, 2)],
], 'Dortmund rent index 2025/2026, euros per m² net cold', ['l', 'r', 'r', 'r'])}
<h2>What it means for your rent</h2>
<p>On a new lease in Dortmund the rent may be at most ten per cent above the reference rent. For the city's example flat that is ${h.eur(mp.zulaessig, 2)} a month; at an agreed ${h.eur(560, 0)} you overpay ${h.eur(mp.ueberMonat, 2)}. For increases the lowered 15 per cent cap applies, as in the other towns of the ${h.a('mpb-nw', 'North Rhine-Westphalia ordinance')}. Neighbouring Essen is not in the ordinance; the ${h.a('mietspiegel-essen', 'Essen rent index')} page explains what that means. The index expires at the end of 2026; a new edition is expected from 2027, and the calculator will switch once it is published.</p>
`,
  },
});
