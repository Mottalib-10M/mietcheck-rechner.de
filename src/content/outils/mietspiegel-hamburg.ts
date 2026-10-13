import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { hamburgOvm, HAMBURG } from '../../lib/engine/hamburg';
import { stadt, stadtStatus } from '../../lib/engine/staedte';
import { mieterhoehung } from '../../lib/engine/miete';
import { formatMoney, formatNumber, displayDate } from '../../lib/format';

const S = stadt('hamburg')!;
const st = stadtStatus(S, P.retrieved_at);
const ok = <T extends { ok: boolean }>(x: T) => x as Extract<T, { ok: true }>;
const altbau = ok(hamburgOvm({ lage: 'normal', baujahr: 1910, flaeche: 55 }));
const siebz = ok(hamburgOvm({ lage: 'normal', baujahr: 1975, flaeche: 70 }));
const neu = ok(hamburgOvm({ lage: 'gut', baujahr: 2018, flaeche: 85 }));
const siebzGut = ok(hamburgOvm({ lage: 'normal', baujahr: 1975, flaeche: 70, position: 75 }));
const erh = mieterhoehung({ miete: 620, flaeche: 70, ovm: siebz.ovm, kappung: st.kappung, verlangt: 700, zugang: '2026-10-14', letzteAenderung: '2024-01-01' });
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const nD = (x: number) => formatNumber(x, 2, 'de'), nE = (x: number) => formatNumber(x, 2, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietspiegel-hamburg',
  group: 'staedte',
  order: 20,
  tool: 'stadt',
  ort: 'hamburg',
  related: ['mieterhoehung-rechner', 'mietpreisbremse-rechner', 'qualifizierter-mietspiegel', 'mietspiegel-berlin', 'kappungsgrenze'],
  sources: ['hamburgMs', 'bgb558d', 'bgb556d', 'bgb558'],
  de: {
    slug: 'mietspiegel-hamburg',
    nav: 'Mietenspiegel Hamburg',
    card: 'Feld des Mietenspiegels 2025 nach Lage, Baualter und Fläche.',
    title: 'Mietspiegel Hamburg 2026: Vergleichsmiete nach Mietenspiegel',
    description: 'Mietspiegel Hamburg 2026 als Rechner: Mittelwert und Spanne des Mietenspiegels 2025 nach Lage, Baualter und Fläche, Mietpreisbremse und Kappung 15 Prozent.',
    h1: 'Mietenspiegel Hamburg: Ihre Vergleichsmiete mit Spanne',
    intro: 'Normale oder gute Wohnlage, Baujahr und Fläche bestimmen das Feld; die Ausstattung entscheidet, wo Sie in der Spanne liegen.',
    resume: `Der Hamburger Mietenspiegel 2025 ist ein qualifizierter Mietspiegel der Behörde für Stadtentwicklung und Wohnen mit dem Erhebungsstichtag 1. April 2025, anwendbar seit dem ${dD(S.gueltigAb!)}. Er unterscheidet nur zwei Wohnlagen, normal und gut, zehn Baualtersklassen von vor 1919 bis 2024 und fünf beziehungsweise sechs Größenklassen. Jedes Feld nennt einen Mittelwert, erstmals als Median, und eine Spanne, die zwei Drittel der erhobenen Mieten umfasst. Die Stadt stellt die Werte als offene Daten unter der Datenlizenz Deutschland bereit; der Rechner verwendet sie unverändert. Eine Altbauwohnung von 1910 mit 55 m² in normaler Lage liegt im Feld ${altbau.feld.feld} bei ${eD(altbau.ovm)}, eine Wohnung von 1975 mit 70 m² im Feld ${siebz.feld.feld} bei ${eD(siebz.ovm)}, ein Neubau von 2018 mit 85 m² in guter Lage bei ${eD(neu.ovm)} je Quadratmeter. In ganz Hamburg gilt die Mietpreisbremse bis zum ${dD(st.mpbBis!)} und die Kappungsgrenze von 15 Prozent bis zum ${dD(st.kappungBis!)}.`,
    faqs: [
      { q: 'Wie finde ich heraus, ob meine Hamburger Straße normale oder gute Wohnlage ist?', a: 'Im Wohnlagenverzeichnis zum Mietenspiegel 2025, das die Behörde als PDF veröffentlicht, oder über die Online-Abfrage auf hamburg.de, die zu jeder Adresse Lage und Spanne nennt. Die Einstufung erfolgt je Straßenabschnitt nach Bodenrichtwert, Sozialstruktur, Einwohnerdichte, Lärm und Grünflächen. Eine dritte, einfache Lage kennt der Hamburger Mietenspiegel nicht.' },
      { q: 'Wo in der Spanne liegt meine Hamburger Wohnung?', a: `Bei üblicher Ausstattung für das Baualter am Mittelwert, bei besserer Ausstattung im oberen, bei schlechterer im unteren Bereich. Der Mietenspiegel nennt dafür Merkmale wie Einbauküche, Gäste-WC oder Bad mit Fenster, aber keine Euro-Beträge. Der Rechner setzt deshalb Ihre Wahl um: Für die Wohnung von 1975 ergibt der obere Bereich ${eD(siebzGut.ovm)} statt ${eD(siebz.ovm)}.` },
      { q: 'Warum zeigt der Rechner für manche Hamburger Neubauten keinen Wert?', a: `Weil der Mietenspiegel dort ein Leerfeld hat: Für kleine Wohnungen unter 41 m² aus den Jahren 2021 bis 2024 in guter Lage und für große Wohnungen ab 131 m² aus den Jahren 1961 bis 1967 in guter Lage gab es zu wenige Daten. Von den 90 Feldern sind ${HAMBURG.felder.length} belegt. Für Leerfelder muss die Vergleichsmiete anders begründet werden, etwa mit Vergleichswohnungen.` },
    ],
    body: (h) => `
<h2>Wie der Hamburger Mietenspiegel aufgebaut ist</h2>
<p>Anders als in Berlin gibt es in Hamburg eine einzige Tabelle. Ihre Spalten sind die Baualtersklassen, ihre Zeilen die Kombinationen aus Wohnlage und Wohnfläche: vier Größenklassen für die normale Lage, fünf für die gute, bei der die größte Klasse ab 131 m² beginnt. Alle Werte gelten für Wohnungen mit Bad und Sammelheizung. Der Rechner nimmt das Feld, in das Ihre Wohnung fällt, und zeigt Mittelwert und Spanne. Die Werte stammen aus dem offenen Datensatz der ${h.src('hamburgMs', 'Behörde für Stadtentwicklung und Wohnen')} und sind mit der Tabelle im PDF abgeglichen.</p>
${h.table(['Wohnung', 'Feld', 'Spanne je m²', 'Mittelwert je m²'], [
  ['1910, 55 m², normale Lage', altbau.feld.feld, `${h.num(altbau.feld.unten, 2)} bis ${h.num(altbau.feld.oben, 2)} €`, h.eur(altbau.ovm, 2)],
  ['1975, 70 m², normale Lage', siebz.feld.feld, `${h.num(siebz.feld.unten, 2)} bis ${h.num(siebz.feld.oben, 2)} €`, h.eur(siebz.ovm, 2)],
  ['2018, 85 m², gute Lage', neu.feld.feld, `${h.num(neu.feld.unten, 2)} bis ${h.num(neu.feld.oben, 2)} €`, h.eur(neu.ovm, 2)],
], 'Hamburger Mietenspiegel 2025, Datenlizenz Deutschland – Namensnennung – Version 2.0', ['l', 'r', 'r', 'r'])}
<h2>Mieterhöhung in Hamburg</h2>
<p>Hamburg hat die Kappungsgrenze für das ganze Stadtgebiet auf 15 Prozent abgesenkt. Für die Wohnung von 1975 mit ${h.eur(620, 0)} Miete heißt das: Die Vergleichsmiete erlaubt ${h.eur(erh.grenzeOvm, 2)}, die Kappungsgrenze ${h.eur(erh.grenzeKappung, 2)}; verlangt der Vermieter ${h.eur(700, 0)}, müssen Sie nur ${h.eur(erh.zulaessig, 2)} zustimmen, und zwar bis zum ${h.date(erh.zustimmungBis)}. Der ${h.a('mieterhoehung-rechner', 'Mieterhöhungsrechner')} geht alle Fristen durch.</p>
<p>Bei einer Neuvermietung greift die ${h.a('mietpreisbremse', 'Mietpreisbremse')}: höchstens der Wert des Feldes plus zehn Prozent, sofern keine Ausnahme vorliegt. Weil der Mittelwert seit 2025 ein Median ist, ist er mit den arithmetischen Mittelwerten früherer Hamburger Mietenspiegel nicht vergleichbar; wer ein älteres Erhöhungsschreiben mit dem neuen Mietenspiegel vergleicht, sollte das bedenken.</p>
`,
  },
  en: {
    slug: 'hamburg-rent-index',
    nav: 'Hamburg rent index',
    card: 'Field of the 2025 index by location, age and floor area.',
    title: 'Hamburg Rent Index 2026: Reference Rent from the 2025 Index',
    description: 'Hamburg rent index 2026 as a calculator: median and range of the 2025 index by location, age band and floor area, plus the rent brake and the 15 per cent cap.',
    h1: 'Hamburg rent index: your reference rent with its range',
    intro: 'Normal or good location, year built and floor area set the field; your fittings decide where you sit in the range.',
    resume: `Hamburg's 2025 rent index (Hamburger Mietenspiegel) is a qualified index from the Department for Urban Development and Housing, with a survey date of 1 April 2025, applicable since ${dE(S.gueltigAb!)}. It distinguishes only two residential locations, normal and good, ten age bands from before 1919 to 2024, and five or six floor-area bands. Each field gives a mean value, for the first time a median, and a range covering two thirds of the rents surveyed. The city publishes the values as open data under the German open-data licence, and the calculator uses them unchanged. A 1910 flat of 55 m² in a normal location sits in field ${altbau.feld.feld} at ${eE(altbau.ovm)}, a 1975 flat of 70 m² in field ${siebz.feld.feld} at ${eE(siebz.ovm)}, and a 2018 new build of 85 m² in a good location at ${eE(neu.ovm)} per square metre. Across Hamburg, the rent brake applies until ${dE(st.mpbBis!)} and the 15 per cent cap until ${dE(st.kappungBis!)}.`,
    faqs: [
      { q: 'How do I find out whether my Hamburg street is a normal or good location?', a: 'From the residential location directory for the 2025 index, published as a PDF, or through the online lookup on hamburg.de, which gives the location and range for each address. Locations are set street section by street section using land values, social structure, population density, noise and green space. Hamburg’s index has no third, basic category.' },
      { q: 'Where in the range does my Hamburg flat sit?', a: `With the usual fittings for its age, at the median; with better fittings in the upper part, with worse in the lower part. The index lists features such as a fitted kitchen, guest toilet or a bathroom with a window, but gives no euro amounts. So the calculator applies your choice: for the 1975 flat, the upper part gives ${eE(siebzGut.ovm)} instead of ${eE(siebz.ovm)}.` },
      { q: 'Why does the calculator show no value for some Hamburg new builds?', a: `Because the index has an empty field there: there were too few data for small flats under 41 m² from 2021 to 2024 in good locations and for large flats from 131 m² built 1961 to 1967 in good locations. Of 90 fields, ${HAMBURG.felder.length} are filled. For empty fields the reference rent must be justified another way, for instance with comparable flats.` },
    ],
    body: (h) => `
<h2>How the Hamburg index is built</h2>
<p>Unlike Berlin, Hamburg has a single table. Its columns are the age bands, its rows combine location and floor area: four size bands for normal locations and five for good ones, where the largest band starts at 131 m². All values apply to flats with a bathroom and central heating. The calculator takes the field your flat falls into and shows the median and the range. The values come from the open dataset of the ${h.src('hamburgMs', 'Department for Urban Development and Housing')} and were checked against the PDF table.</p>
${h.table(['Flat', 'Field', 'Range per m²', 'Median per m²'], [
  ['1910, 55 m², normal location', altbau.feld.feld, `${h.num(altbau.feld.unten, 2)} to ${h.num(altbau.feld.oben, 2)} €`, h.eur(altbau.ovm, 2)],
  ['1975, 70 m², normal location', siebz.feld.feld, `${h.num(siebz.feld.unten, 2)} to ${h.num(siebz.feld.oben, 2)} €`, h.eur(siebz.ovm, 2)],
  ['2018, 85 m², good location', neu.feld.feld, `${h.num(neu.feld.unten, 2)} to ${h.num(neu.feld.oben, 2)} €`, h.eur(neu.ovm, 2)],
], 'Hamburg rent index 2025, German open-data licence, attribution 2.0', ['l', 'r', 'r', 'r'])}
<h2>Rent increases in Hamburg</h2>
<p>Hamburg has lowered the increase cap to 15 per cent for the whole city. For the 1975 flat at ${h.eur(620, 0)} rent, that means: the reference rent allows ${h.eur(erh.grenzeOvm, 2)}, the cap ${h.eur(erh.grenzeKappung, 2)}; if the landlord asks ${h.eur(700, 0)}, you only need to agree to ${h.eur(erh.zulaessig, 2)}, by ${h.date(erh.zustimmungBis)}. The ${h.a('mieterhoehung-rechner', 'rent increase calculator')} goes through every deadline.</p>
<p>For a new lease the ${h.a('mietpreisbremse', 'rent brake')} applies: at most the field value plus ten per cent, unless an exemption applies. Because the mean has been a median since 2025, it cannot be compared with the arithmetic means of earlier Hamburg indexes; keep that in mind when comparing an older increase letter with the new index.</p>
`,
  },
});
