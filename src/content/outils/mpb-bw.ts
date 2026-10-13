import { defineGuide } from '../../lib/guide-types';
import { status } from '../../lib/engine/gebiet';
import { landDaten, gemeindeTabelle } from '../../lib/land-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Exemple : Heidelberg, valeur de référence supposée 12,50 €/m², 60 m², loyer convenu 900 €.
const D = landDaten('BW', 'Heidelberg', 12.5, 60, 900);
const { L, st, mpb, erh } = D;
const vo = L.mpb!;
const mannheim = status('BW', 'Mannheim', '2026-10-12');
const jan = status('BW', 'Heidelberg', '2027-01-04');
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mpb-bw',
  group: 'laender',
  order: 10,
  tool: 'land',
  ort: 'BW',
  related: ['mietspiegel-stuttgart', 'mietpreisbremse', 'kappungsgrenze', 'mietpreisbremse-rechner', 'mpb-by'],
  sources: ['bgb556d', 'bgb558', 'bgb577a'],
  de: {
    slug: 'mietpreisbremse-baden-wuerttemberg',
    nav: 'Mietpreisbremse Baden-Württemberg',
    card: `${D.nMpb} Gemeinden, aber nur bis zum 31. Dezember 2026.`,
    title: 'Mietpreisbremse Baden-Württemberg 2026: Liste und Ablauf',
    description: `Mietpreisbremse Baden-Württemberg 2026: ${D.nMpb} Städte und Gemeinden, Kappungsgrenze 15 Prozent, beide Verordnungen nur bis 31. Dezember 2026, Entwürfe für 2027.`,
    h1: `Mietpreisbremse in Baden-Württemberg: ${D.nMpb} Gemeinden für ein Jahr`,
    intro: 'Die Verordnungen von Baden-Württemberg gelten nur für 2026; der Mietcheck prüft Gemeinde und Vertragsdatum.',
    resume: `Baden-Württemberg hat am 16. Dezember 2025 drei Verordnungen mit derselben Gemeindeliste beschlossen: zur Mietpreisbremse, zur Kappungsgrenze von 15 Prozent und zur verlängerten Kündigungssperrfrist von fünf Jahren nach Umwandlung in Eigentumswohnungen. Alle drei gelten nur vom 1. Januar bis zum ${dD(vo.bis)}. Die Liste umfasst ${D.nMpb} Städte und Gemeinden, deutlich mehr als die 89 der Vorgängerverordnung von 2020; darunter Stuttgart, Freiburg, Heidelberg, Karlsruhe, Tübingen, Ulm und viele Gemeinden in deren Umland. Mannheim und Konstanz sind seit 2026 nicht mehr erfasst. Für 2027 hat der Ministerrat am 22. September 2026 Entwürfe neuer Verordnungen mit erweiterter Gebietskulisse zur Anhörung freigegeben; verkündet war bis Anfang Oktober 2026 nichts. Wer in Heidelberg einen Vertrag über 60 m² schließt, darf bei einer angenommenen Vergleichsmiete von ${eD(12.5)} je Quadratmeter höchstens ${eD(mpb.zulaessig)} kalt zahlen; ein Vertrag vom 4. Januar 2027 wäre ${jan.mpb ? 'weiter' : 'nach heutigem Stand nicht mehr'} gebunden.`,
    faqs: [
      { q: 'Gilt die Mietpreisbremse in Mannheim noch?', a: `Nein, ${mannheim.mpb ? 'doch' : 'seit dem 1. Januar 2026 nicht mehr'}. Mannheim stand in der Verordnung von 2020, ist in der Liste der ${D.nMpb} Gemeinden für 2026 aber nicht enthalten, ebenso wenig Konstanz. Für Verträge, die dort bis Ende 2025 geschlossen wurden, bleibt die damalige Grenze maßgeblich; für neuere gilt sie nicht, und Mieterhöhungen sind dort bis 20 Prozent in drei Jahren möglich.` },
      { q: 'Was passiert in Baden-Württemberg nach dem 31. Dezember 2026?', a: 'Die heutigen Verordnungen treten aus. Die Landesregierung hat im September 2026 Entwürfe für Nachfolgeverordnungen vorgelegt, die mehr Hochschulstandorte einbeziehen sollen. Erst wenn sie im Gesetzblatt verkündet sind, gelten sie. Wer Anfang 2027 einen Vertrag unterschreibt, sollte das Datum der Verkündung prüfen; der Mietcheck übernimmt die neue Liste, sobald sie vorliegt.' },
      { q: 'Wie lange ist die Kündigungssperre nach einer Umwandlung in Baden-Württemberg?', a: 'In den Gemeinden der Verordnung fünf Jahre statt der gesetzlichen drei Jahre (§ 577a BGB). Wird Ihre Mietwohnung nach Ihrem Einzug in eine Eigentumswohnung umgewandelt und verkauft, kann der Käufer erst nach Ablauf dieser Frist wegen Eigenbedarfs kündigen. Auch diese Verordnung ist bis Ende 2026 befristet.' },
    ],
    body: (h) => `
<h2>Drei Verordnungen, eine Liste, ein Jahr</h2>
<p>Die ${h.ext(vo.url, 'Mietpreisbegrenzungsverordnung Baden-Württemberg')} steht im Gesetzblatt 2025 als Nummer 144, die Kappungsgrenzenverordnung als Nummer 145, die Kündigungssperrfristverordnung als Nummer 146. Die Gemeindelisten sind wortgleich. Ungewöhnlich ist die kurze Laufzeit: Das Bundesrecht erlaubt Verordnungen bis Ende 2029 (${h.src('bgb556d', '§ 556d Abs. 2 BGB')}), Baden-Württemberg hat nur ein Jahr gewählt. Damit stehen Mieter und Vermieter im Land Ende 2026 vor einer Lücke, falls die Nachfolger nicht rechtzeitig kommen.</p>
<h2>Heidelberg als Beispiel</h2>
<p>Ein neuer Vertrag über 60 m² zu ${h.eur(900, 0)}: Mit der Annahme einer Vergleichsmiete von ${h.eur(12.5, 2)} liegt die Grenze bei ${h.eur(mpb.zulaessig, 2)}, die Miete also ${h.eur(mpb.ueberMonat, 2)} darüber. Bei einer Mieterhöhung von ${h.eur(D.alt, 0)} auf ${h.eur(D.verlangt, 0)} lässt die Kappungsgrenze nur ${h.eur(erh.zulaessig, 2)} zu. Für Stuttgart, wo auch der Mietspiegel Ende 2026 ausläuft, gibt es eine eigene Seite: ${h.a('mietspiegel-stuttgart', 'Mietspiegel Stuttgart')}.</p>
<h2>Alle Gemeinden 2026</h2>
${gemeindeTabelle(vo, h, `Baden-Württemberg, Verordnungen vom 16. Dezember 2025: ${D.nMpb} Städte und Gemeinden`)}
`,
  },
  en: {
    slug: 'rent-brake-baden-wurttemberg',
    nav: 'Rent brake Baden-Württemberg',
    card: `${D.nMpb} municipalities, but only until 31 December 2026.`,
    title: 'Rent Brake Baden-Württemberg 2026: List and Expiry Date',
    description: `Rent brake in Baden-Württemberg 2026: ${D.nMpb} towns and municipalities, a 15 per cent cap, both ordinances only until 31 December 2026, and drafts for 2027.`,
    h1: `The rent brake in Baden-Württemberg: ${D.nMpb} municipalities for one year`,
    intro: 'Baden-Württemberg’s ordinances only cover 2026; the rent check tests your municipality and the lease date.',
    resume: `On 16 December 2025 Baden-Württemberg adopted three ordinances with the same list of municipalities: on the rent brake (Mietpreisbremse), on the 15 per cent increase cap and on a five-year notice ban after conversion into condominiums. All three apply only from 1 January to ${dE(vo.bis)}. The list holds ${D.nMpb} towns and municipalities, far more than the 89 of the 2020 ordinance, including Stuttgart, Freiburg, Heidelberg, Karlsruhe, Tübingen, Ulm and many towns around them. Mannheim and Konstanz are no longer covered since 2026. For 2027 the state cabinet released draft ordinances with a wider list for consultation on 22 September 2026; none had been published as law by early October 2026. Anyone signing a 60 m² lease in Heidelberg may pay at most ${eE(mpb.zulaessig)} a month before service charges at an assumed reference rent of ${eE(12.5)} per square metre; a lease of 4 January 2027 would ${jan.mpb ? 'still' : 'on current law no longer'} be bound.`,
    faqs: [
      { q: 'Does the rent brake still apply in Mannheim?', a: `No, ${mannheim.mpb ? 'it still does' : 'not since 1 January 2026'}. Mannheim was in the 2020 ordinance but is not among the ${D.nMpb} municipalities for 2026, and neither is Konstanz. For leases signed there up to the end of 2025 the earlier ceiling remains decisive; for newer ones it does not apply, and increases of up to 20 per cent in three years are possible there.` },
      { q: 'What happens in Baden-Württemberg after 31 December 2026?', a: 'The current ordinances expire. In September 2026 the state government presented drafts of successor ordinances meant to include more university towns. They only apply once published in the official gazette. If you sign a lease in early 2027, check the publication date; the rent check adopts the new list once it exists.' },
      { q: 'How long is the notice ban after conversion in Baden-Württemberg?', a: 'In the municipalities of the ordinance, five years instead of the statutory three (Section 577a of the Civil Code). If your rented flat is converted into a condominium after you moved in and is sold, the buyer can only give notice for own use after that period. This ordinance too is limited to the end of 2026.' },
    ],
    body: (h) => `
<h2>Three ordinances, one list, one year</h2>
<p>The ${h.ext(vo.url, 'Baden-Württemberg rent ordinance')} is number 144 in the 2025 official gazette, the cap ordinance number 145 and the notice-ban ordinance number 146. The municipality lists are identical. What is unusual is the short term: federal law allows ordinances until the end of 2029 (${h.src('bgb556d', 'Section 556d(2) of the Civil Code')}), but Baden-Württemberg chose one year. Tenants and landlords in the state therefore face a gap at the end of 2026 if the successors do not arrive in time.</p>
<h2>Heidelberg as an example</h2>
<p>A new 60 m² lease at ${h.eur(900, 0)}: assuming a reference rent of ${h.eur(12.5, 2)}, the ceiling is ${h.eur(mpb.zulaessig, 2)}, so the rent is ${h.eur(mpb.ueberMonat, 2)} above it. For an increase from ${h.eur(D.alt, 0)} to ${h.eur(D.verlangt, 0)}, the cap allows only ${h.eur(erh.zulaessig, 2)}. Stuttgart, where the rent index also expires at the end of 2026, has its own page: ${h.a('mietspiegel-stuttgart', 'Stuttgart rent index')}.</p>
<h2>Every municipality in 2026</h2>
${gemeindeTabelle(vo, h, `Baden-Württemberg, ordinances of 16 December 2025: ${D.nMpb} towns and municipalities`)}
`,
  },
});
