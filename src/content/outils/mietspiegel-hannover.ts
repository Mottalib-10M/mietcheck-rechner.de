import { defineGuide } from '../../lib/guide-types';
import { stadtDaten, faktenTabelle, offiziell } from '../../lib/stadt-seite';
import { landVo } from '../../lib/engine/gebiet';
import { formatMoney, displayDate } from '../../lib/format';

// Valeur supposée lue dans le Mietspiegel 2025 : 9,20 €/m² pour 66 m², loyer convenu 720 €.
const D = stadtDaten('hannover', 9.2, 66, 720);
const { S, st, mpb, erh } = D;
const ni = landVo('NI')!;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietspiegel-hannover',
  group: 'staedte',
  order: 100,
  tool: 'stadt',
  ort: 'hannover',
  related: ['mpb-ni', 'mieterhoehung-rechner', 'vergleichsmiete', 'mietpreisbremse-rechner', 'mietspiegel-bremen'],
  sources: ['bgb558d', 'bgb558a', 'bgb556d'],
  de: {
    slug: 'mietspiegel-hannover',
    nav: 'Mietspiegel Hannover',
    card: 'Qualifizierter Mietspiegel 2025 der Region, seit Dezember 2025.',
    title: 'Mietspiegel Hannover 2026: Ausstattungspunkte und Grenzen',
    description: 'Mietspiegel Hannover 2026: der qualifizierte Mietspiegel 2025 mit Ausstattungspunkten, gültig seit Dezember 2025, und die Mieterschutzregeln Niedersachsens.',
    h1: 'Mietspiegel Hannover: Punkte zählen, Grenzen anwenden',
    intro: 'In Hannover entscheiden Ausstattungspunkte über die Lage in der Spanne; die Grenzen kommen aus der niedersächsischen Verordnung.',
    resume: `Der Mietspiegel 2025 für die Landeshauptstadt Hannover ist ein qualifizierter Mietspiegel, den die Region Hannover gemeinsam mit der Stadt und einer Mietspiegelkommission aus Mieter- und Vermieterverbänden erstellt hat; erhoben und ausgewertet hat ein Hamburger Institut, Stichtag ist der 1. April 2025. Er gilt seit seiner Anerkennung durch den Rat am ${dD(S.gueltigAb!)} und hat den Mietspiegel 2023 abgelöst. Aufgebaut ist er als Tabelle nach Baualtersklasse, vier Größenklassen und zwei Wohnlagen, normal und gut, mit Mittelwert und Spanne. Wo eine Wohnung in der Spanne liegt, ergibt sich aus Ausstattungspunkten, die Sie für Merkmale wie Bad, Küche, Fenster oder Balkon vergeben. Weil das Internetportal der Stadt die Reproduktion seiner Informationen nur nach Absprache erlaubt, übernimmt dieser Rechner keine Hannoveraner Werte. Hannover steht in der niedersächsischen Mieterschutzverordnung: Mietpreisbremse bis zum ${dD(st.mpbBis!)} und Kappungsgrenze von 15 Prozent.`,
    faqs: [
      { q: 'Wie funktionieren die Ausstattungspunkte im Hannoveraner Mietspiegel?', a: 'Für jedes Merkmal, das der Mietspiegel aufführt, erhält die Wohnung Punkte, bis zu einer Höchstzahl. Je mehr Punkte, desto weiter oben in der Spanne liegt die Vergleichsmiete; wenige Punkte führen in die untere Hälfte. Die Punktetabelle und die Umrechnung stehen in der Broschüre. Das Ergebnis tragen Sie in Euro je Quadratmeter in den Mietcheck ein.' },
      { q: 'Gilt der Mietspiegel der Stadt Hannover auch für die Umlandgemeinden?', a: 'Nein. Er gilt für die Landeshauptstadt. Die Region Hannover hat für mehrere Umlandkommunen eigene Mietspiegel aufgestellt. Ob die Mietpreisbremse in Ihrer Gemeinde gilt, hängt nicht vom Mietspiegel ab, sondern davon, ob Niedersachsen die Gemeinde in seine Verordnung aufgenommen hat; der Mietcheck prüft das, wenn Sie Ihre Gemeinde eintragen.' },
      { q: 'Wie hoch darf eine neue Miete in Hannover sein?', a: `Höchstens zehn Prozent über der Vergleichsmiete. Ergibt die Rechnung mit dem Mietspiegel für 66 m² etwa ${eD(9.2)} je Quadratmeter, liegt die Grenze bei ${eD(mpb.zulaessig)}; bei ${eD(720, 0)} wären ${eD(mpb.ueberMonat)} monatlich zu viel. Höher darf es nur sein, wenn der Vormieter mehr zahlte oder eine der gesetzlichen Ausnahmen greift.` },
    ],
    body: (h) => `
<h2>Tabelle plus Punkte</h2>
<p>Der Hannoveraner Mietspiegel verbindet zwei Schritte. Zuerst suchen Sie das Feld: Baualtersklasse, Größenklasse und Wohnlage ergeben einen Mittelwert und eine Spanne. Dann zählen Sie Ausstattungspunkte für die Merkmale Ihrer Wohnung, und die Punktzahl bestimmt, wo in der Spanne Ihre Vergleichsmiete liegt. So lassen sich auch Wohnungen gleichen Alters und gleicher Größe unterscheiden, deren Ausstattung weit auseinanderliegt. Ein festes Ablaufdatum nennt der Mietspiegel nicht; als qualifizierter Mietspiegel ist er nach zwei Jahren anzupassen.</p>
${faktenTabelle(S, st, h)}
<h2>Mit dem Hannoveraner Wert rechnen</h2>
<p>Die Broschüre finden Sie auf der ${offiziell(S, h, 'Mietspiegel-Seite der Landeshauptstadt Hannover')}. Tragen Sie die so ermittelte Vergleichsmiete oben ein. Für eine Mieterhöhung wendet der Mietcheck die niedersächsische Kappungsgrenze an: Bei ${h.eur(D.mieteAlt, 0)} bisheriger Miete sind höchstens ${h.eur(erh.zulaessig, 2)} zulässig; ein Schreiben vom 14. Oktober 2026 beantworten Sie bis zum ${h.date(erh.zustimmungBis)}.</p>
<p>Niedersachsen hat ${ni.mpb!.gemeinden.length} Gemeinden und Samtgemeinden in seine Verordnung aufgenommen, von Hannover über Göttingen bis zu den Inseln; die Liste steht auf der Seite ${h.a('mpb-ni', 'Mietpreisbremse Niedersachsen')}.</p>
`,
  },
  en: {
    slug: 'hanover-rent-index',
    nav: 'Hanover rent index',
    card: 'Qualified 2025 index of the region, since December 2025.',
    title: 'Hanover Rent Index 2026: Fitting Points and Rent Limits',
    description: 'Hanover rent index 2026: the qualified 2025 index with fitting points, in force since December 2025, and the tenant-protection rules of Lower Saxony today.',
    h1: 'Hanover rent index: count the points, apply the limits',
    intro: 'In Hanover, fitting points decide where you sit in the range; the limits come from Lower Saxony’s ordinance.',
    resume: `The 2025 rent index for the city of Hanover (Mietspiegel Hannover) is a qualified index drawn up by the Hanover Region with the city and a rent index commission of tenant and landlord associations; a Hamburg institute ran the survey and analysis, with 1 April 2025 as the reference date. It has applied since the city council recognised it on ${dE(S.gueltigAb!)}, replacing the 2023 index. It is built as a table by construction period, four size bands and two locations, normal and good, with a mean and a range. Where a flat sits within the range follows from fitting points you award for features such as bathroom, kitchen, windows or balcony. Because the city's web portal only allows its information to be reproduced by arrangement, this calculator takes no Hanover figures. Hanover is in Lower Saxony's tenant-protection ordinance: rent brake until ${dE(st.mpbBis!)} and a 15 per cent cap.`,
    faqs: [
      { q: 'How do the fitting points in the Hanover index work?', a: 'For each feature the index lists, the flat earns points, up to a maximum. The more points, the higher in the range the reference rent sits; few points lead to the lower half. The points table and the conversion are in the brochure. Enter the result in euros per square metre into the rent check.' },
      { q: 'Does the City of Hanover index also cover the surrounding towns?', a: 'No. It covers the state capital. The Hanover Region has drawn up separate indexes for several surrounding municipalities. Whether the rent brake applies in your town does not depend on the index but on whether Lower Saxony listed it in its ordinance; the rent check tests that when you enter your municipality.' },
      { q: 'How high may a new rent in Hanover be?', a: `At most ten per cent above the reference rent. If the index gives, say, ${eE(9.2)} per square metre for 66 m², the ceiling is ${eE(mpb.zulaessig)}; at ${eE(720, 0)}, ${eE(mpb.ueberMonat)} a month would be too much. It may only be higher if the previous tenant paid more or one of the legal exemptions applies.` },
    ],
    body: (h) => `
<h2>A table plus points</h2>
<p>The Hanover index combines two steps. First you find the field: construction period, size band and location give a mean and a range. Then you count fitting points for your flat's features, and the score decides where in the range your reference rent lies. That way flats of the same age and size but very different fittings can be told apart. The index states no end date; as a qualified index it must be adjusted after two years.</p>
${faktenTabelle(S, st, h)}
<h2>Calculating with the Hanover figure</h2>
<p>The brochure is on the ${offiziell(S, h, 'City of Hanover rent index page')}. Enter the reference rent you work out above. For a rent increase the rent check applies Lower Saxony's cap: with a current rent of ${h.eur(D.mieteAlt, 0)}, at most ${h.eur(erh.zulaessig, 2)} is lawful; a letter received on 14 October 2026 must be answered by ${h.date(erh.zustimmungBis)}.</p>
<p>Lower Saxony has listed ${ni.mpb!.gemeinden.length} municipalities and joint municipalities in its ordinance, from Hanover to Göttingen and the islands; the list is on the ${h.a('mpb-ni', 'rent brake in Lower Saxony')} page.</p>
`,
  },
});
