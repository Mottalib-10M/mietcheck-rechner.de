import { defineGuide } from '../../lib/guide-types';
import { landDaten, gemeindeTabelle } from '../../lib/land-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Exemple : Göttingen, valeur de référence supposée 9,80 €/m², 45 m², loyer convenu 520 €.
const D = landDaten('NI', 'Göttingen', 9.8, 45, 520);
const { L, st, mpb, erh } = D;
const vo = L.mpb!;
const inseln = vo.gemeinden.filter((g) => /Borkum|Juist|Norderney|Baltrum|Langeoog|Spiekeroog|Wangerooge/.test(g)).length;
const samt = vo.gemeinden.filter((g) => /Samtgemeinde/.test(g)).length;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mpb-ni',
  group: 'laender',
  order: 60,
  tool: 'land',
  ort: 'NI',
  related: ['mietspiegel-hannover', 'mietspiegel-bremen', 'mietpreisbremse', 'kappungsgrenze', 'eigenbedarfskuendigung'],
  sources: ['bgb556d', 'bgb558', 'bgb577a'],
  de: {
    slug: 'mietpreisbremse-niedersachsen',
    nav: 'Mietpreisbremse Niedersachsen',
    card: `${D.nMpb} Städte, Gemeinden und Samtgemeinden bis Ende 2029.`,
    title: 'Mietpreisbremse Niedersachsen 2026: Städte, Inseln, Fristen',
    description: `Mietpreisbremse Niedersachsen 2026: ${D.nMpb} Gebiete von Hannover bis zu den Ostfriesischen Inseln, Kappung 15 Prozent bis 2029 und Kündigungssperre fünf Jahre.`,
    h1: 'Mietpreisbremse in Niedersachsen: von der Landeshauptstadt bis zu den Inseln',
    intro: 'Die niedersächsische Mieterschutzverordnung erfasst Großstädte, Universitätsstädte, das Hamburger Umland und sieben Inseln.',
    resume: `Niedersachsen bündelt seinen Mieterschutz in der Niedersächsischen Mieterschutzverordnung vom 20. Dezember 2024, geändert im Dezember 2025. Sie gilt seit dem 1. Januar 2025; die Mietpreisbremse und die Kappungsgrenze von 15 Prozent laufen bis zum ${dD(vo.bis)}, die verlängerte Kündigungssperrfrist von fünf Jahren nach Umwandlung in Eigentumswohnungen bis Ende 2031. Die drei Regeln gelten für dieselben ${D.nMpb} Gebiete: die Landeshauptstadt Hannover, Großstädte wie Braunschweig, Osnabrück, Oldenburg, Wolfsburg und Göttingen, das Umland von Hamburg und Bremen mit Buxtehude, Seevetal, Stuhr oder Lilienthal und ${inseln} der Ostfriesischen Inseln. ${samt} Samtgemeinden sind als Ganzes erfasst, also mit allen Mitgliedsgemeinden. In Göttingen ergibt eine angenommene Vergleichsmiete von ${eD(9.8)} für eine Wohnung mit 45 m² eine Höchstmiete von ${eD(mpb.zulaessig)} bei neuen Verträgen; bei ${eD(520, 0)} wären ${eD(mpb.ueberMonat)} im Monat zu viel.`,
    faqs: [
      { q: 'Gilt die Mietpreisbremse auf Norderney und den anderen Inseln?', a: `Ja, für die Inseln in der Verordnung: Borkum, Juist, Norderney, Baltrum, Langeoog, Spiekeroog und Wangerooge, also ${inseln} Inseln. Für Dauermietverträge über Wohnraum gelten die Mietpreisbremse und die Kappungsgrenze von 15 Prozent wie auf dem Festland. Ferienwohnungen, die nur zum vorübergehenden Gebrauch vermietet werden, erfasst die Mietpreisbremse dagegen nicht.` },
      { q: 'Was bedeutet es, dass eine Samtgemeinde in der Verordnung steht?', a: `Eine Samtgemeinde besteht aus mehreren Mitgliedsgemeinden. Steht sie in der Liste, gilt die Verordnung für alle ihre Mitgliedsgemeinden. Erfasst sind ${samt} Samtgemeinden, etwa Bardowick und Gellersen bei Lüneburg oder Tostedt im Landkreis Harburg. Wer in einer Mitgliedsgemeinde wohnt, trägt im Mietcheck den Namen der Samtgemeinde ein.` },
      { q: 'Wie lange gilt in Niedersachsen die Kündigungssperre nach einer Umwandlung?', a: 'Fünf Jahre statt drei, für Wohnungen in den Gebieten der Verordnung, die nach dem Einzug des Mieters in Eigentumswohnungen umgewandelt und verkauft wurden. Diese Regel steht in § 3 der Verordnung und gilt bis Ende 2031, also zwei Jahre länger als die Mietpreisbremse. Grundlage ist § 577a Abs. 2 BGB.' },
    ],
    body: (h) => `
<h2>Eine Sammelverordnung mit drei Paragrafen</h2>
<p>Die ${h.ext(vo.url, 'Niedersächsische Mieterschutzverordnung')} bestimmt in § 1 die Gebiete der Mietpreisbremse nach ${h.src('bgb556d', '§ 556d BGB')}, in § 2 die der Kappungsgrenze nach ${h.src('bgb558', '§ 558 Abs. 3')} und in § 3 die der Kündigungssperrfrist nach ${h.src('bgb577a', '§ 577a')}. Die Liste ist dreimal dieselbe. Die Vorgängerverordnung von 2020 lief Ende 2024 aus; die neue schloss lückenlos an, und die Änderung vom 3. Dezember 2025 hat die Fristen von §§ 1 und 2 bis Ende 2029 festgelegt.</p>
<h2>Göttingen als Beispiel</h2>
<p>Für eine Wohnung in Göttingen mit 45 m² zu ${h.eur(520, 0)} und eine angenommene Vergleichsmiete von ${h.eur(9.8, 2)} liegt die Grenze bei ${h.eur(mpb.zulaessig, 2)}. Bei einer Mieterhöhung von ${h.eur(D.alt, 0)} auf ${h.eur(D.verlangt, 0)} erlaubt die Kappungsgrenze ${h.eur(erh.zulaessig, 2)}. Für Hannover erklärt die Seite ${h.a('mietspiegel-hannover', 'Mietspiegel Hannover')}, wie die Vergleichsmiete dort ermittelt wird.</p>
<h2>Alle Gebiete der Verordnung</h2>
${gemeindeTabelle(vo, h, `Niedersächsische Mieterschutzverordnung, § 1: ${D.nMpb} Städte, Gemeinden und Samtgemeinden`, false)}
`,
  },
  en: {
    slug: 'rent-brake-lower-saxony',
    nav: 'Rent brake Lower Saxony',
    card: `${D.nMpb} towns, municipalities and joint municipalities to 2029.`,
    title: 'Rent Brake Lower Saxony 2026: Cities, Islands and Deadlines',
    description: `Rent brake in Lower Saxony 2026: ${D.nMpb} areas from Hanover to the East Frisian Islands, a 15 per cent cap until 2029 and a five-year notice ban after conversion.`,
    h1: 'The rent brake in Lower Saxony: from the capital to the islands',
    intro: 'Lower Saxony’s tenant-protection ordinance covers large cities, university towns, the Hamburg commuter belt and seven islands.',
    resume: `Lower Saxony brings its tenant protection together in the Lower Saxony tenant-protection ordinance of 20 December 2024, amended in December 2025. It has applied since 1 January 2025; the rent brake (Mietpreisbremse) and the 15 per cent increase cap run until ${dE(vo.bis)}, and the longer five-year notice ban after conversion into condominiums until the end of 2031. All three rules cover the same ${D.nMpb} areas: the state capital Hanover, cities such as Braunschweig, Osnabrück, Oldenburg, Wolfsburg and Göttingen, the Hamburg and Bremen commuter belts with Buxtehude, Seevetal, Stuhr or Lilienthal, and ${inseln} of the East Frisian Islands. ${samt} joint municipalities (Samtgemeinden) are covered as a whole, with all member municipalities. In Göttingen an assumed reference rent of ${eE(9.8)} for a 45 m² flat gives a ceiling of ${eE(mpb.zulaessig)} on new leases; at ${eE(520, 0)}, ${eE(mpb.ueberMonat)} a month would be too much.`,
    faqs: [
      { q: 'Does the rent brake apply on Norderney and the other islands?', a: `Yes, on the islands in the ordinance: Borkum, Juist, Norderney, Baltrum, Langeoog, Spiekeroog and Wangerooge, ${inseln} islands in all. For permanent residential leases the rent brake and the 15 per cent cap apply just as on the mainland. Holiday flats let only for temporary use, on the other hand, are outside the rent brake.` },
      { q: 'What does it mean that a joint municipality is listed?', a: `A joint municipality (Samtgemeinde) consists of several member municipalities. If it is listed, the ordinance covers all of them. ${samt} joint municipalities are covered, such as Bardowick and Gellersen near Lüneburg or Tostedt in the Harburg district. If you live in a member municipality, enter the joint municipality’s name in the rent check.` },
      { q: 'How long is the notice ban after conversion in Lower Saxony?', a: 'Five years instead of three, for flats in the ordinance’s areas that were converted into condominiums and sold after the tenant moved in. The rule is in Section 3 of the ordinance and runs until the end of 2031, two years longer than the rent brake. Its basis is Section 577a(2) of the Civil Code.' },
    ],
    body: (h) => `
<h2>One combined ordinance with three sections</h2>
<p>The ${h.ext(vo.url, 'Lower Saxony tenant-protection ordinance')} sets the rent-brake areas under ${h.src('bgb556d', 'Section 556d of the Civil Code')} in its Section 1, the cap areas under ${h.src('bgb558', 'Section 558(3)')} in Section 2 and the notice-ban areas under ${h.src('bgb577a', 'Section 577a')} in Section 3. The list is the same three times. The 2020 predecessor expired at the end of 2024; the new one followed without a gap, and the amendment of 3 December 2025 fixed the end of Sections 1 and 2 at the end of 2029.</p>
<h2>Göttingen as an example</h2>
<p>For a 45 m² flat in Göttingen at ${h.eur(520, 0)} and an assumed reference rent of ${h.eur(9.8, 2)}, the ceiling is ${h.eur(mpb.zulaessig, 2)}. For an increase from ${h.eur(D.alt, 0)} to ${h.eur(D.verlangt, 0)}, the cap allows ${h.eur(erh.zulaessig, 2)}. For Hanover, the ${h.a('mietspiegel-hannover', 'Hanover rent index')} page explains how the reference rent is found there.</p>
<h2>Every area in the ordinance</h2>
${gemeindeTabelle(vo, h, `Lower Saxony tenant-protection ordinance, Section 1: ${D.nMpb} towns, municipalities and joint municipalities`, false)}
`,
  },
});
