import { defineGuide } from '../../lib/guide-types';
import { status, basis } from '../../lib/engine/gebiet';
import { landDaten } from '../../lib/land-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Exemple : Rostock, valeur de référence supposée 8,40 €/m², 58 m², loyer convenu 620 €.
const D = landDaten('MV', 'Rostock', 8.4, 58, 620);
const { L, st, mpb, erh } = D;
const vo = L.mpb!, kap = L.kappung!;
const [stadtTeil, kuesteTeil] = vo.teile;
const kapKueste = kap.teile[1];
const kueste = kuesteTeil.gemeinden.map(basis);
const schwerin = status('MV', 'Schwerin', '2026-10-12');
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mpb-mv',
  group: 'laender',
  order: 50,
  tool: 'land',
  ort: 'MV',
  related: ['mpb-sh', 'mpb-bb', 'kappungsgrenze', 'mietpreisbremse', 'mietpreisbremse-rechner'],
  sources: ['bgb556d', 'bgb558', 'bgb549'],
  de: {
    slug: 'mietpreisbremse-mecklenburg-vorpommern',
    nav: 'Mietpreisbremse Mecklenburg-Vorpommern',
    card: 'Rostock, Greifswald und acht Ostseebäder.',
    title: 'Mietpreisbremse Mecklenburg-Vorpommern 2026: Stadt und Küste',
    description: 'Mietpreisbremse Mecklenburg-Vorpommern 2026: Rostock und Greifswald bis September 2028, acht Ostseebäder seit März 2026 bis Ende 2029, Kappung 15 Prozent.',
    h1: 'Mietpreisbremse in Mecklenburg-Vorpommern: zwei Städte und die Küste',
    intro: 'Seit März 2026 gilt die Mietpreisbremse auch in acht Ostseebädern; der Mietcheck kennt die unterschiedlichen Laufzeiten.',
    resume: `Mecklenburg-Vorpommern hat zwei kombinierte Verordnungen, die jeweils Mietpreisbremse und Kappungsgrenze regeln. Die erste von 2023 erfasst die Hanse- und Universitätsstädte Rostock und Greifswald; nach einer Änderung im November 2025 gilt sie dort lückenlos bis zum ${dD(stadtTeil.bis)}. Die zweite, die Küstenverordnung, ist seit dem ${dD(kuesteTeil.inKraft)} in Kraft und erfasst acht Ostseebäder: ${kueste.join(', ')}. Dort gilt die Mietpreisbremse bis zum ${dD(kuesteTeil.bis)} und die Kappungsgrenze von 15 Prozent bis zum ${dD(kapKueste.bis)}. Schwerin, Wismar, Stralsund und Neubrandenburg sind nicht erfasst. In den Ostseebädern betrifft die Verordnung Dauermietverträge über Wohnraum; Ferienwohnungen zum vorübergehenden Gebrauch sind von der Mietpreisbremse ausgenommen (§ 549 Abs. 2 BGB). Beispiel Rostock: Bei einer angenommenen Vergleichsmiete von ${eD(8.4)} für 58 m² liegt die Grenze bei ${eD(mpb.zulaessig)}; ein Vertrag über ${eD(620, 0)} läge ${eD(mpb.ueberMonat)} darüber.`,
    faqs: [
      { q: 'Seit wann gilt die Mietpreisbremse in Kühlungsborn und Binz?', a: `Seit dem ${dD(kuesteTeil.inKraft)}, dem Tag nach der Verkündung der Küstenverordnung. Verträge, die vorher geschlossen wurden, fallen nicht darunter, weil maßgeblich ist, ob die Verordnung bei Vertragsschluss galt. Für Mieterhöhungen gilt in den acht Orten seitdem die Kappungsgrenze von 15 Prozent, und zwar bis zum ${dD(kapKueste.bis)}.` },
      { q: 'Gilt die Mietpreisbremse in Schwerin?', a: `${schwerin.gefunden ? 'Ja.' : 'Nein.'} Die Landeshauptstadt steht in keiner der beiden Verordnungen, ebenso wenig Wismar, Stralsund oder Neubrandenburg. Dort ist die Anfangsmiete frei vereinbar, und Mieterhöhungen dürfen bis 20 Prozent in drei Jahren betragen, begrenzt durch die ortsübliche Vergleichsmiete aus dem Mietspiegel oder anderen Begründungsmitteln.` },
      { q: 'Warum endet die Mietpreisbremse in Rostock früher als an der Küste?', a: `Weil die beiden Verordnungen unterschiedlich befristet sind. Die Verordnung für Rostock und Greifswald von 2023 läuft nach ihrer Änderung bis zum ${dD(stadtTeil.bis)}, die Küstenverordnung von 2026 bis Ende 2029. Eine Verlängerung für die beiden Städte ist möglich, aber noch nicht beschlossen.` },
    ],
    body: (h) => `
<h2>Zwei kombinierte Verordnungen</h2>
<p>Die Landesverordnung von 2023 (GVOBl. M-V 2023 S. 723) bestimmt in einem Paragrafen die Gebiete der Mietpreisbremse nach ${h.src('bgb556d', '§ 556d BGB')} und in einem zweiten die der Kappungsgrenze nach ${h.src('bgb558', '§ 558 Abs. 3 BGB')}. Ursprünglich sollte der Teil zur Mietpreisbremse Ende 2025 auslaufen; die Änderung vom 22. November 2025 hat das gestrichen. Die ${h.ext(kuesteTeil.url, 'Küstenverordnung')} vom 28. Februar 2026 (GVOBl. M-V 2026 S. 142) ist genauso aufgebaut.</p>
${h.table(['Gebiet', 'Mietpreisbremse', 'Kappungsgrenze 15 %'], [
  ['Rostock, Greifswald', `bis ${h.date(stadtTeil.bis)}`, `bis ${h.date(kap.teile[0].bis)}`],
  [kueste.join(', '), `${h.date(kuesteTeil.inKraft)} bis ${h.date(kuesteTeil.bis)}`, `${h.date(kapKueste.inKraft)} bis ${h.date(kapKueste.bis)}`],
], `Mecklenburg-Vorpommern, Stand ${h.date('2026-10-12')}`, ['l', 'l', 'l'])}
<h2>Rostock als Beispiel</h2>
<p>Eine Mieterhöhung von ${h.eur(D.alt, 0)} auf ${h.eur(D.verlangt, 0)} für 58 m² ist in Rostock auf ${h.eur(erh.zulaessig, 2)} gedeckelt. Für einen neuen Vertrag zieht der Mietcheck die Grenze von zehn Prozent über der Vergleichsmiete. Auf der Insel Rügen und auf Usedom gilt die Regel nur in Binz, Sellin, Heringsdorf und Zinnowitz, nicht in den übrigen Gemeinden der Inseln. Wie das benachbarte Schleswig-Holstein vorgeht, das nur die Kappungsgrenze kennt, zeigt die Seite ${h.a('mpb-sh', 'Kappungsgrenze Schleswig-Holstein')}.</p>
`,
  },
  en: {
    slug: 'rent-brake-mecklenburg-western-pomerania',
    nav: 'Rent brake Mecklenburg-Western Pomerania',
    card: 'Rostock, Greifswald and eight Baltic resorts.',
    title: 'Rent Brake Mecklenburg-Vorpommern 2026: Cities and Coast',
    description: 'Rent brake Mecklenburg-Western Pomerania 2026: Rostock and Greifswald until September 2028, eight Baltic resorts since March 2026, and a 15 per cent cap.',
    h1: 'The rent brake in Mecklenburg-Western Pomerania: two cities and the coast',
    intro: 'Since March 2026 the rent brake also applies in eight Baltic resorts; the rent check knows the different end dates.',
    resume: `Mecklenburg-Western Pomerania has two combined ordinances, each covering the rent brake (Mietpreisbremse) and the increase cap. The first, from 2023, covers the Hanseatic university cities of Rostock and Greifswald; after an amendment in November 2025 it applies there without a gap until ${dE(stadtTeil.bis)}. The second, the coast ordinance, has been in force since ${dE(kuesteTeil.inKraft)} and covers eight Baltic resorts: ${kueste.join(', ')}. There the rent brake applies until ${dE(kuesteTeil.bis)} and the 15 per cent cap until ${dE(kapKueste.bis)}. Schwerin, Wismar, Stralsund and Neubrandenburg are not covered. In the resorts the ordinance concerns permanent residential leases; holiday flats let for temporary use are exempt from the rent brake (Section 549(2) of the Civil Code). Take Rostock: with an assumed reference rent of ${eE(8.4)} for 58 m², the ceiling is ${eE(mpb.zulaessig)}; a lease at ${eE(620, 0)} would be ${eE(mpb.ueberMonat)} above it.`,
    faqs: [
      { q: 'Since when does the rent brake apply in Kühlungsborn and Binz?', a: `Since ${dE(kuesteTeil.inKraft)}, the day after the coast ordinance was published. Leases signed before then are not covered, because what counts is whether the ordinance applied when the lease was signed. For increases, the 15 per cent cap has applied in the eight resorts since then, until ${dE(kapKueste.bis)}.` },
      { q: 'Does the rent brake apply in Schwerin?', a: `${schwerin.gefunden ? 'Yes.' : 'No.'} The state capital is in neither ordinance, and neither are Wismar, Stralsund or Neubrandenburg. There the starting rent can be agreed freely, and increases may reach 20 per cent in three years, limited by the local reference rent from the rent index or another justification.` },
      { q: 'Why does the rent brake end earlier in Rostock than on the coast?', a: `Because the two ordinances have different terms. The 2023 ordinance for Rostock and Greifswald runs until ${dE(stadtTeil.bis)} after its amendment, the 2026 coast ordinance until the end of 2029. An extension for the two cities is possible but has not been decided.` },
    ],
    body: (h) => `
<h2>Two combined ordinances</h2>
<p>The 2023 state ordinance (GVOBl. M-V 2023 p. 723) sets the rent-brake areas under ${h.src('bgb556d', 'Section 556d of the Civil Code')} in one section and the cap areas under ${h.src('bgb558', 'Section 558(3)')} in another. The rent-brake part was originally to expire at the end of 2025; the amendment of 22 November 2025 removed that limit. The ${h.ext(kuesteTeil.url, 'coast ordinance')} of 28 February 2026 (GVOBl. M-V 2026 p. 142) has the same structure.</p>
${h.table(['Area', 'Rent brake', '15% cap'], [
  ['Rostock, Greifswald', `until ${h.date(stadtTeil.bis)}`, `until ${h.date(kap.teile[0].bis)}`],
  [kueste.join(', '), `${h.date(kuesteTeil.inKraft)} to ${h.date(kuesteTeil.bis)}`, `${h.date(kapKueste.inKraft)} to ${h.date(kapKueste.bis)}`],
], `Mecklenburg-Western Pomerania as of ${h.date('2026-10-12')}`, ['l', 'l', 'l'])}
<h2>Rostock as an example</h2>
<p>An increase from ${h.eur(D.alt, 0)} to ${h.eur(D.verlangt, 0)} on 58 m² is capped at ${h.eur(erh.zulaessig, 2)} in Rostock. For a new lease the rent check sets the ceiling at ten per cent above the reference rent. On the islands of Rügen and Usedom the rule applies only in Binz, Sellin, Heringsdorf and Zinnowitz, not in the islands' other municipalities. How neighbouring Schleswig-Holstein proceeds, with only the cap, is on the ${h.a('mpb-sh', 'Schleswig-Holstein cap')} page.</p>
`,
  },
});
