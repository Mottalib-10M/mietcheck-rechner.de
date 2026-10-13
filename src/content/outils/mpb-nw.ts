import { defineGuide } from '../../lib/guide-types';
import { status } from '../../lib/engine/gebiet';
import { landDaten, gemeindeTabelle } from '../../lib/land-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Exemple : Münster, valeur de référence supposée 10,50 €/m², 68 m², loyer convenu 850 €.
const D = landDaten('NW', 'Münster', 10.5, 68, 850);
const { L, st, mpb, erh } = D;
const vo = L.mpb!, kap = L.kappung!;
const essen = status('NW', 'Essen', '2026-10-12');
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mpb-nw',
  group: 'laender',
  order: 70,
  tool: 'land',
  ort: 'NW',
  related: ['mietspiegel-koeln', 'mietspiegel-duesseldorf', 'mietspiegel-dortmund', 'mietspiegel-essen', 'eigenbedarfskuendigung'],
  sources: ['bgb556d', 'bgb558', 'bgb577a'],
  de: {
    slug: 'mietpreisbremse-nordrhein-westfalen',
    nav: 'Mietpreisbremse NRW',
    card: `${D.nMpb} Kommunen, Mietpreisbremse bis Ende 2029.`,
    title: `Mietpreisbremse NRW 2026: die ${D.nMpb} Kommunen der Verordnung`,
    description: `Mietpreisbremse NRW 2026: ${D.nMpb} Kommunen von Aachen bis Wesseling, Mietpreisbremse bis Ende 2029, Kappungsgrenze 15 Prozent und Kündigungssperre bis Februar 2030.`,
    h1: 'Mietpreisbremse in Nordrhein-Westfalen: wo sie gilt und bis wann',
    intro: 'Eine Anlage, drei Regeln: Wer in einer der Kommunen der NRW-Verordnung wohnt, hat Mietpreisbremse, 15-Prozent-Grenze und längere Kündigungssperre.',
    resume: `Nordrhein-Westfalen fasst den Mieterschutz in der Mieterschutzverordnung vom 28. Januar 2025 zusammen. Ihre Anlage nennt ${D.nMpb} Kommunen, für die drei Regeln gelten: die Mietpreisbremse bei neuen Verträgen bis zum ${dD(vo.bis)}, die Kappungsgrenze von 15 Prozent bei Mieterhöhungen und eine Kündigungssperrfrist von acht Jahren nach Umwandlung in Eigentumswohnungen, die beiden letzten bis zum ${dD(kap.bis)}. Ursprünglich sollte die Mietpreisbremse schon Ende 2025 enden; eine Änderungsverordnung vom 28. Oktober 2025 hat sie bis 2029 verlängert, ohne die Liste zu ändern. Erfasst sind große Städte wie Köln, Düsseldorf, Bonn, Münster, Dortmund und Aachen und viele Gemeinden im Rheinland, besonders im Rhein-Sieg-Kreis und im Rhein-Erft-Kreis. Essen, Duisburg und Gelsenkirchen fehlen. In Münster ergibt eine angenommene Vergleichsmiete von ${eD(10.5)} für 68 m² eine Höchstmiete von ${eD(mpb.zulaessig)} bei neuen Verträgen.`,
    faqs: [
      { q: 'Warum gilt in Essen keine Mietpreisbremse, in Dortmund aber schon?', a: `Weil die Landesregierung die Gemeinden nach den Kriterien des § 556d Abs. 2 BGB ausgewählt hat, etwa Mietentwicklung, Mietbelastung und Leerstand, und Essen ${essen.gefunden ? 'doch' : 'nicht'} auf der Liste steht. Dortmund dagegen ist erfasst. Für Essener Mieter gelten bei Erhöhungen deshalb 20 Prozent in drei Jahren, in Dortmund 15 Prozent; bei Vertragsschluss gibt es in Essen keine Grenze aus § 556d BGB.` },
      { q: 'Bis wann gilt die Mietpreisbremse in NRW?', a: `Bis zum ${dD(vo.bis)}, so die Fassung der Verordnung seit November 2025. Die abgesenkte Kappungsgrenze und die verlängerte Kündigungssperrfrist laufen etwas länger, bis zum ${dD(kap.bis)}. Länger als bis Ende 2029 darf eine Verordnung zur Mietpreisbremse nach dem BGB nicht gelten.` },
      { q: 'Wie lange darf nach einer Umwandlung in NRW nicht wegen Eigenbedarfs gekündigt werden?', a: 'In den Kommunen der Verordnung acht Jahre ab dem Verkauf der umgewandelten Wohnung, statt der gesetzlichen drei Jahre (§ 577a BGB). Die Frist gilt für Wohnungen, die nach Ihrem Einzug in Wohnungseigentum umgewandelt und verkauft wurden. Für Umwandlungen vor März 2025 enthält die Verordnung eine Übergangsregel.' },
    ],
    body: (h) => `
<h2>Eine Verordnung für drei Paragrafen</h2>
<p>Die ${h.ext(vo.url, 'Mieterschutzverordnung NRW')} stützt sich auf ${h.src('bgb556d', '§ 556d')}, ${h.src('bgb558', '§ 558 Abs. 3')} und ${h.src('bgb577a', '§ 577a BGB')} und hat eine einzige Anlage. Sie trat am 1. März 2025 in Kraft und löste die Verordnung von 2020 ab. Die Liste nennt bei jeder Kommune den Kreis und den Regierungsbezirk; die Tabelle unten folgt dieser Gliederung. Ein Schreibfehler im amtlichen Text ordnet Kaarst dem Kreis Mettmann zu, obwohl die Stadt zum Rhein-Kreis Neuss gehört; maßgeblich ist der Name der Gemeinde.</p>
<h2>Münster als Beispiel</h2>
<p>Ein neuer Vertrag über 68 m² zu ${h.eur(850, 0)}: Mit der angenommenen Vergleichsmiete von ${h.eur(10.5, 2)} liegt die Grenze bei ${h.eur(mpb.zulaessig, 2)}; die vereinbarte Miete liegt ${h.eur(mpb.ueberMonat, 2)} darüber. Für eine Erhöhung von ${h.eur(D.alt, 0)} auf ${h.eur(D.verlangt, 0)} lässt die Kappungsgrenze ${h.eur(erh.zulaessig, 2)} zu. Für die Mietspiegel von ${h.a('mietspiegel-koeln', 'Köln')}, ${h.a('mietspiegel-duesseldorf', 'Düsseldorf')}, ${h.a('mietspiegel-dortmund', 'Dortmund')} und ${h.a('mietspiegel-essen', 'Essen')} gibt es eigene Seiten.</p>
<h2>Alle Kommunen der Verordnung</h2>
${gemeindeTabelle(vo, h, `Mieterschutzverordnung NRW, Anlage zu § 1: ${D.nMpb} Kommunen`)}
`,
  },
  en: {
    slug: 'rent-brake-north-rhine-westphalia',
    nav: 'Rent brake NRW',
    card: `${D.nMpb} municipalities, rent brake until the end of 2029.`,
    title: `Rent Brake NRW 2026: the ${D.nMpb} Municipalities in the Ordinance`,
    description: `Rent brake in North Rhine-Westphalia 2026: ${D.nMpb} municipalities from Aachen to Wesseling, rent brake to 2029, a 15 per cent cap and a notice ban to February 2030.`,
    h1: 'The rent brake in North Rhine-Westphalia: where and until when',
    intro: 'One annex, three rules: if you live in one of the NRW ordinance’s municipalities, you have the rent brake, the 15 per cent cap and a longer notice ban.',
    resume: `North Rhine-Westphalia brings its tenant protection together in the tenant-protection ordinance (Mieterschutzverordnung) of 28 January 2025. Its annex lists ${D.nMpb} municipalities where three rules apply: the rent brake (Mietpreisbremse) on new leases until ${dE(vo.bis)}, the 15 per cent cap on rent increases, and an eight-year notice ban after conversion into condominiums, the last two until ${dE(kap.bis)}. The rent brake was originally to end in late 2025; an amending ordinance of 28 October 2025 extended it to 2029 without changing the list. Large cities such as Cologne, Düsseldorf, Bonn, Münster, Dortmund and Aachen are covered, and many towns in the Rhineland, especially in the Rhein-Sieg and Rhein-Erft districts. Essen, Duisburg and Gelsenkirchen are not. In Münster an assumed reference rent of ${eE(10.5)} for 68 m² gives a ceiling of ${eE(mpb.zulaessig)} on new leases.`,
    faqs: [
      { q: 'Why is there no rent brake in Essen when there is one in Dortmund?', a: `Because the state government chose municipalities under the criteria of Section 556d(2) of the Civil Code, such as rent trends, rent burden and vacancy, and Essen is ${essen.gefunden ? '' : 'not '}on the list. Dortmund is. For Essen tenants, increases are therefore capped at 20 per cent in three years, in Dortmund at 15 per cent; at signing there is no ceiling under Section 556d of the Civil Code in Essen.` },
      { q: 'Until when does the rent brake apply in NRW?', a: `Until ${dE(vo.bis)}, under the version in force since November 2025. The lowered cap and the longer notice ban run a little longer, until ${dE(kap.bis)}. Under the Civil Code a rent-brake ordinance may not run beyond the end of 2029.` },
      { q: 'How long after a conversion is an own-use eviction barred in NRW?', a: 'In the municipalities of the ordinance, eight years from the sale of the converted flat, instead of the statutory three (Section 577a of the Civil Code). The period applies to flats converted into condominiums and sold after you moved in. The ordinance contains a transitional rule for conversions before March 2025.' },
    ],
    body: (h) => `
<h2>One ordinance for three sections</h2>
<p>The ${h.ext(vo.url, 'NRW tenant-protection ordinance')} rests on ${h.src('bgb556d', 'Section 556d')}, ${h.src('bgb558', 'Section 558(3)')} and ${h.src('bgb577a', 'Section 577a of the Civil Code')} and has a single annex. It took effect on 1 March 2025, replacing the 2020 ordinance. The list gives each municipality's district and administrative region, and the table below follows that structure. A slip in the official text places Kaarst in the Mettmann district although the town belongs to the Rhein-Kreis Neuss; what counts is the municipality's name.</p>
<h2>Münster as an example</h2>
<p>A new 68 m² lease at ${h.eur(850, 0)}: with the assumed reference rent of ${h.eur(10.5, 2)}, the ceiling is ${h.eur(mpb.zulaessig, 2)}, and the agreed rent is ${h.eur(mpb.ueberMonat, 2)} above it. For an increase from ${h.eur(D.alt, 0)} to ${h.eur(D.verlangt, 0)}, the cap allows ${h.eur(erh.zulaessig, 2)}. The rent indexes of ${h.a('mietspiegel-koeln', 'Cologne')}, ${h.a('mietspiegel-duesseldorf', 'Düsseldorf')}, ${h.a('mietspiegel-dortmund', 'Dortmund')} and ${h.a('mietspiegel-essen', 'Essen')} have their own pages.</p>
<h2>Every municipality in the ordinance</h2>
${gemeindeTabelle(vo, h, `NRW tenant-protection ordinance, annex to Section 1: ${D.nMpb} municipalities`)}
`,
  },
});
