import { defineGuide } from '../../lib/guide-types';
import { status } from '../../lib/engine/gebiet';
import { landDaten } from '../../lib/land-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Exemple : Jena, valeur de référence supposée 9,20 €/m², 55 m², loyer convenu 640 €.
const D = landDaten('TH', 'Jena', 9.2, 55, 640);
const { L, st, mpb, erh } = D;
const vo = L.mpb!, kap = L.kappung!;
const weimar = status('TH', 'Weimar', '2026-10-12');
const nach = status('TH', 'Erfurt', '2028-02-01');
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mpb-th',
  group: 'laender',
  order: 110,
  tool: 'land',
  ort: 'TH',
  related: ['mpb-sn', 'kappungsgrenze', 'mietpreisbremse-rechner', 'mieterhoehung', 'vergleichsmiete'],
  sources: ['bgb556d', 'bgb558'],
  de: {
    slug: 'mietpreisbremse-thueringen',
    nav: 'Mietpreisbremse Thüringen',
    card: 'Erfurt und Jena: Mietpreisbremse bis 2027, Kappung bis 2029.',
    title: 'Mietpreisbremse Thüringen 2026: Erfurt und Jena im Überblick',
    description: 'Mietpreisbremse Thüringen 2026: nur Erfurt und Jena, Mietpreisbremse verlängert bis Ende 2027, Kappungsgrenze 15 Prozent bis September 2029, Beispiel Jena.',
    h1: 'Mietpreisbremse in Thüringen: Erfurt und Jena',
    intro: 'Thüringen schützt Mieter nur in seinen beiden größten Hochschulstädten; die beiden Verordnungen laufen unterschiedlich lange.',
    resume: `In Thüringen gelten Mietpreisbremse und abgesenkte Kappungsgrenze nur in Erfurt und Jena. Die Thüringer Mietpreisbegrenzungsverordnung von 2021 wurde im Dezember 2025 bis zum ${dD(vo.bis)} verlängert; die Kappungsgrenzenverordnung von 2019 gilt nach einer Verlängerung von 2024 bis zum ${dD(kap.bis)}. Die Kappungsgrenze von 15 Prozent gilt in Erfurt seit Oktober 2019 und in Jena seit Januar 2020. Weimar, Gera und alle anderen Gemeinden sind nicht erfasst. Wer nach Ende 2027 in Erfurt oder Jena einen Vertrag schließt, ist ohne neue Verlängerung nicht mehr durch die Mietpreisbremse geschützt, bei Erhöhungen bleibt aber die Kappungsgrenze von 15 Prozent bis 2029. Beispiel Jena: Bei einer angenommenen Vergleichsmiete von ${eD(9.2)} für eine Wohnung mit 55 m² liegt die Grenze bei ${eD(mpb.zulaessig)}; bei ${eD(640, 0)} wären ${eD(mpb.ueberMonat)} im Monat zu viel. Eine Erhöhung von ${eD(D.alt, 0)} auf ${eD(D.verlangt, 0)} ist auf ${eD(erh.zulaessig)} gedeckelt.`,
    faqs: [
      { q: 'Gilt in Weimar eine Mietpreisbremse?', a: `${weimar.gefunden ? 'Ja.' : 'Nein.'} Thüringen hat nur Erfurt und Jena in seine Verordnungen aufgenommen. In Weimar, Gera, Gotha und allen übrigen Gemeinden gilt weder die Mietpreisbremse noch die abgesenkte Kappungsgrenze. Mieterhöhungen sind dort bis 20 Prozent in drei Jahren zulässig, immer begrenzt durch die ortsübliche Vergleichsmiete.` },
      { q: 'Was gilt in Erfurt ab 2028?', a: `Nach dem heutigen Stand endet die Mietpreisbremse mit Ablauf des ${dD(vo.bis)}; ein Vertrag vom 1. Februar 2028 fiele ${nach.mpb ? 'noch' : 'nicht mehr'} darunter. Die Kappungsgrenze von 15 Prozent gilt dagegen bis zum ${dD(kap.bis)} weiter. Bei einer Mieterhöhung im Jahr 2028 sind also weiterhin höchstens 15 Prozent in drei Jahren erlaubt.` },
      { q: 'Wo finde ich die Vergleichsmiete für Erfurt oder Jena?', a: 'Im Mietspiegel der jeweiligen Stadt, den Erfurt und Jena auf ihren Websites veröffentlichen. Diesen Wert in Euro je Quadratmeter tragen Sie in den Mietcheck ein. Gibt es für Ihre Wohnung keinen passenden Wert, kann der Vermieter eine Erhöhung auch mit einem Gutachten oder drei Vergleichswohnungen begründen.' },
    ],
    body: (h) => `
<h2>Zwei Verordnungen mit verschiedener Laufzeit</h2>
<p>Die ${h.ext(vo.url, 'Thüringer Mietpreisbegrenzungsverordnung')} (GVBl. 2021 S. 13) beruht auf ${h.src('bgb556d', '§ 556d Abs. 2 BGB')}; eine Änderung vom 9. Dezember 2025 hat ihre Geltung bis Ende 2027 verlängert. Die Thüringer Kappungsgrenzenverordnung (GVBl. 2019 S. 366) beruht auf ${h.src('bgb558', '§ 558 Abs. 3 BGB')} und wurde im August 2024 bis September 2029 verlängert. Beide nennen nur Erfurt und Jena.</p>
${h.table(['Regel', 'Erfurt', 'Jena', 'übriges Thüringen'], [
  ['Mietpreisbremse', `bis ${h.date(vo.bis)}`, `bis ${h.date(vo.bis)}`, 'nein'],
  ['Kappungsgrenze 15 %', `seit Oktober 2019, bis ${h.date(kap.bis)}`, `seit Januar 2020, bis ${h.date(kap.bis)}`, 'nein, 20 %'],
], `Thüringen, Stand ${h.date('2026-10-12')}`, ['l', 'l', 'l', 'l'])}
<h2>Was der Mietcheck für Jena zeigt</h2>
<p>Tragen Sie Jena oder Erfurt als Gemeinde ein, prüft der Mietcheck das Datum Ihres Vertrags oder Ihres Erhöhungsschreibens gegen beide Laufzeiten. Für einen Vertrag aus dem Jahr 2026 gilt die Grenze von zehn Prozent über der Vergleichsmiete. Die Vergleichsmiete bringen Sie aus dem Mietspiegel der Stadt mit; für eine Mieterhöhung tragen Sie zusätzlich das Datum ein, an dem das Schreiben angekommen ist, und den Tag der letzten Mieterhöhung. Wie die Mietpreisbremse in Sachsen nebenan geregelt ist, zeigt die Seite ${h.a('mpb-sn', 'Mietpreisbremse Sachsen')}.</p>
`,
  },
  en: {
    slug: 'rent-brake-thuringia',
    nav: 'Rent brake Thuringia',
    card: 'Erfurt and Jena: rent brake to 2027, cap to 2029.',
    title: 'Rent Brake Thuringia 2026: Erfurt and Jena at a Glance',
    description: 'Rent brake in Thuringia 2026: only Erfurt and Jena, rent brake extended to the end of 2027, 15 per cent cap until September 2029, with an example for Jena.',
    h1: 'The rent brake in Thuringia: Erfurt and Jena',
    intro: 'Thuringia only protects tenants in its two largest university cities, and its two ordinances run for different lengths of time.',
    resume: `In Thuringia the rent brake (Mietpreisbremse) and the lowered cap only apply in Erfurt and Jena. The Thuringian rent ordinance of 2021 was extended in December 2025 until ${dE(vo.bis)}; the 2019 cap ordinance runs until ${dE(kap.bis)} after an extension in 2024. The 15 per cent cap has applied in Erfurt since October 2019 and in Jena since January 2020. Weimar, Gera and every other municipality are not covered. Anyone signing a lease in Erfurt or Jena after the end of 2027 will no longer be protected by the rent brake unless it is extended again, but the 15 per cent cap on increases remains until 2029. Take Jena: with an assumed reference rent of ${eE(9.2)} for a 55 m² flat, the ceiling is ${eE(mpb.zulaessig)}; at ${eE(640, 0)}, ${eE(mpb.ueberMonat)} a month would be too much. An increase from ${eE(D.alt, 0)} to ${eE(D.verlangt, 0)} is capped at ${eE(erh.zulaessig)}.`,
    faqs: [
      { q: 'Is there a rent brake in Weimar?', a: `${weimar.gefunden ? 'Yes.' : 'No.'} Thuringia only listed Erfurt and Jena. In Weimar, Gera, Gotha and all other municipalities neither the rent brake nor the lowered cap applies. Increases there are lawful up to 20 per cent in three years, always limited by the local reference rent.` },
      { q: 'What applies in Erfurt from 2028?', a: `On current law the rent brake ends at the close of ${dE(vo.bis)}; a lease of 1 February 2028 would ${nach.mpb ? 'still' : 'no longer'} be covered. The 15 per cent cap, by contrast, continues until ${dE(kap.bis)}. So a rent increase in 2028 is still limited to 15 per cent in three years.` },
      { q: 'Where do I find the reference rent for Erfurt or Jena?', a: 'In the rent index (Mietspiegel) of the city concerned, which Erfurt and Jena publish on their websites. Enter that figure in euros per square metre into the rent check. If there is no matching value for your flat, the landlord can also justify an increase with an expert opinion or three comparable flats.' },
    ],
    body: (h) => `
<h2>Two ordinances with different terms</h2>
<p>The ${h.ext(vo.url, 'Thuringian rent ordinance')} (GVBl. 2021 p. 13) rests on ${h.src('bgb556d', 'Section 556d(2) of the Civil Code')}; an amendment of 9 December 2025 extended it to the end of 2027. The Thuringian cap ordinance (GVBl. 2019 p. 366) rests on ${h.src('bgb558', 'Section 558(3)')} and was extended in August 2024 to September 2029. Both name only Erfurt and Jena.</p>
${h.table(['Rule', 'Erfurt', 'Jena', 'rest of Thuringia'], [
  ['rent brake', `until ${h.date(vo.bis)}`, `until ${h.date(vo.bis)}`, 'no'],
  ['15% cap', `since October 2019, until ${h.date(kap.bis)}`, `since January 2020, until ${h.date(kap.bis)}`, 'no, 20%'],
], `Thuringia as of ${h.date('2026-10-12')}`, ['l', 'l', 'l', 'l'])}
<h2>What the rent check shows for Jena</h2>
<p>Enter Jena or Erfurt as your municipality and the rent check tests the date of your lease or increase letter against both terms. For a lease signed in 2026 the ceiling is ten per cent above the reference rent. Bring the reference rent from the city's rent index; for an increase, also enter the day the letter arrived and the date of the last increase. How the neighbouring state handles the rent brake is on the ${h.a('mpb-sn', 'rent brake in Saxony')} page.</p>
`,
  },
});
