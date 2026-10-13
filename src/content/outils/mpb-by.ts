import { defineGuide } from '../../lib/guide-types';
import { landDaten, gemeindeTabelle } from '../../lib/land-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Exemple : Ingolstadt, valeur de référence supposée 12,00 €/m², 70 m², loyer convenu 980 €.
const D = landDaten('BY', 'Ingolstadt', 12, 70, 980);
const { L, st, mpb, erh } = D;
const vo = L.mpb!;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mpb-by',
  group: 'laender',
  order: 20,
  tool: 'land',
  ort: 'BY',
  related: ['mietspiegel-muenchen', 'mietspiegel-nuernberg', 'mietpreisbremse', 'kappungsgrenze', 'eigenbedarfskuendigung'],
  sources: ['bgb556d', 'bgb558', 'bgb577a'],
  de: {
    slug: 'mietpreisbremse-bayern',
    nav: 'Mietpreisbremse Bayern',
    card: `${D.nMpb} Gemeinden in einer Verordnung, bis Ende 2029.`,
    title: 'Mietpreisbremse Bayern 2026: alle Gemeinden der Verordnung',
    description: `Mietpreisbremse Bayern 2026: die Mieterschutzverordnung mit ${D.nMpb} Gemeinden bis Ende 2029, Kappungsgrenze von 15 Prozent und zehn Jahre Kündigungssperre.`,
    h1: 'Mietpreisbremse in Bayern: eine Verordnung, drei Schutzregeln',
    intro: 'Gemeinde eintragen: Der Mietcheck zeigt, ob die bayerische Mieterschutzverordnung sie erfasst, und rechnet die Grenzen aus.',
    resume: `Bayern regelt alle drei Mieterschutzinstrumente des BGB in einer einzigen Verordnung, der Mieterschutzverordnung vom 16. Dezember 2025. Sie gilt seit dem 1. Januar 2026 und läuft bis zum ${dD(vo.bis)}. Für dieselbe Liste von Gemeinden ordnet sie dreierlei an: die Mietpreisbremse bei neuen Verträgen, die abgesenkte Kappungsgrenze von 15 Prozent bei Mieterhöhungen und eine Kündigungssperrfrist von zehn Jahren, wenn eine vermietete Wohnung in Eigentum umgewandelt und verkauft wird. Die Liste umfasste zunächst 285 Gemeinden; seit einer Änderung im Juli 2026 sind es ${D.nMpb}. Mehr als zwei Drittel davon liegen in Oberbayern, darunter die Landeshauptstadt München und fast alle Gemeinden ihres Umlands; dazu kommen Städte wie Nürnberg, Augsburg, Regensburg, Würzburg und Erlangen. Erfasst sind immer ganze Gemeinden, nie einzelne Ortsteile. Beispiel Ingolstadt: Bei einer angenommenen Vergleichsmiete von ${eD(12)} je Quadratmeter darf ein neuer Vertrag über 70 m² höchstens ${eD(mpb.zulaessig)} kalt kosten.`,
    faqs: [
      { q: 'Gilt die bayerische Mietpreisbremse in meiner Gemeinde?', a: `Nur, wenn sie in der Anlage der Mieterschutzverordnung steht; die vollständige Liste mit ${D.nMpb} Gemeinden steht unten, nach Landkreisen geordnet. Tragen Sie Ihre Gemeinde oben ein, prüft der Mietcheck zusätzlich das Datum Ihres Vertrags. Gemeinden, die nicht genannt sind, haben weder Mietpreisbremse noch abgesenkte Kappungsgrenze; dort gelten bei Mieterhöhungen 20 Prozent in drei Jahren.` },
      { q: 'Was bedeutet die zehnjährige Kündigungssperre in Bayern?', a: 'Wird eine vermietete Wohnung nach Ihrem Einzug in eine Eigentumswohnung umgewandelt und verkauft, darf der Käufer in den Gemeinden der Verordnung erst zehn Jahre nach dem Verkauf wegen Eigenbedarfs oder wirtschaftlicher Verwertung kündigen. Ohne Verordnung wären es drei Jahre (§ 577a BGB). Die Sperre schützt Sie vor dem Kauf zum Zweck der Eigennutzung.' },
      { q: 'Warum steht eine Gemeinde seit Juli 2026 nicht mehr in der bayerischen Liste?', a: 'Die Staatsregierung hat die Verordnung am 16. Juni 2026 geändert und die Gemeinde Reut im Landkreis Rottal-Inn gestrichen; die Änderung gilt seit dem 16. Juli 2026. Für Verträge, die vorher in Reut geschlossen wurden, galt die Mietpreisbremse noch. Der Mietcheck kennt die geltende Liste mit Datum.' },
    ],
    body: (h) => `
<h2>Die bayerische Mieterschutzverordnung</h2>
<p>Statt drei getrennter Verordnungen hat Bayern eine Sammelverordnung erlassen, die sich auf ${h.src('bgb556d', '§ 556d Abs. 2')}, ${h.src('bgb558', '§ 558 Abs. 3')} und ${h.src('bgb577a', '§ 577a Abs. 2 BGB')} stützt. Für die Mieter hat das einen praktischen Vorteil: Wo die Mietpreisbremse gilt, gilt auch die abgesenkte Kappungsgrenze und die längere Kündigungssperre, mit derselben Laufzeit. Die Vorgängerverordnung von 2021 lief Ende 2025 aus; die neue schließt nahtlos an. Fundstelle ist ${h.ext(vo.url, 'GVBl. 2025 S. 718')}, die Änderung von 2026 steht im GVBl. 2026 S. 334.</p>
<h2>Was der Mietcheck für Ingolstadt rechnet</h2>
<p>Bei einem neuen Vertrag über 70 m² und der Annahme einer Vergleichsmiete von ${h.eur(12, 2)} sind höchstens ${h.eur(mpb.zulaessig, 2)} zulässig; vereinbart sind ${h.eur(980, 0)}, also ${h.eur(mpb.ueberMonat, 2)} zu viel im Monat. Bei einer Mieterhöhung von ${h.eur(D.alt, 0)} auf ${h.eur(D.verlangt, 0)} bremst die Kappungsgrenze auf ${h.eur(erh.zulaessig, 2)}. Die Vergleichsmiete selbst kommt aus dem Mietspiegel der Gemeinde; für ${h.a('mietspiegel-muenchen', 'München')} und ${h.a('mietspiegel-nuernberg', 'Nürnberg')} erklären eigene Seiten, wo Sie ihn finden.</p>
<h2>Alle Gemeinden der Verordnung</h2>
${gemeindeTabelle(vo, h, `Bayerische Mieterschutzverordnung, Anlage, Stand ${h.date('2026-07-16')}: ${D.nMpb} Gemeinden`)}
`,
  },
  en: {
    slug: 'rent-brake-bavaria',
    nav: 'Rent brake Bavaria',
    card: `${D.nMpb} municipalities in one ordinance, to the end of 2029.`,
    title: 'Rent Brake Bavaria 2026: Every Municipality in the Ordinance',
    description: `Rent brake Bavaria 2026: the state tenant-protection ordinance with ${D.nMpb} municipalities until the end of 2029, a 15 per cent cap and a ten-year eviction ban.`,
    h1: 'The rent brake in Bavaria: one ordinance, three protections',
    intro: 'Enter your municipality: the rent check shows whether Bavaria’s tenant-protection ordinance covers it and works out the limits.',
    resume: `Bavaria sets all three tenant protections of the German Civil Code in a single ordinance, the tenant-protection ordinance (Mieterschutzverordnung) of 16 December 2025. It has applied since 1 January 2026 and runs until ${dE(vo.bis)}. For the same list of municipalities it orders three things: the rent brake (Mietpreisbremse) on new leases, the lowered 15 per cent cap on rent increases, and a ten-year notice ban when a rented flat is converted into a condominium and sold. The list first held 285 municipalities; since an amendment in July 2026 there are ${D.nMpb}. More than two thirds lie in Upper Bavaria, including Munich and almost every municipality around it, plus cities such as Nuremberg, Augsburg, Regensburg, Würzburg and Erlangen. Whole municipalities are always covered, never single districts. Take Ingolstadt: with an assumed reference rent of ${eE(12)} per square metre, a new 70 m² lease may cost at most ${eE(mpb.zulaessig)} a month before service charges.`,
    faqs: [
      { q: 'Does the Bavarian rent brake apply in my municipality?', a: `Only if it is listed in the annex to the tenant-protection ordinance; the full list of ${D.nMpb} municipalities is below, grouped by district. Enter your municipality above and the rent check also tests the date of your lease. Municipalities not listed have neither the rent brake nor the lowered cap; there, increases are limited to 20 per cent over three years.` },
      { q: 'What does Bavaria’s ten-year notice ban mean?', a: 'If a rented flat is converted into a condominium after you moved in and then sold, the buyer may only give notice for own use or economic exploitation ten years after the sale in the municipalities of the ordinance. Without the ordinance it would be three years (Section 577a of the Civil Code). The ban protects you against purchases aimed at moving in.' },
      { q: 'Why has one municipality dropped off the Bavarian list since July 2026?', a: 'The state government amended the ordinance on 16 June 2026 and removed the municipality of Reut in the Rottal-Inn district; the change has applied since 16 July 2026. Leases signed in Reut before then were still covered. The rent check knows the current list and its dates.' },
    ],
    body: (h) => `
<h2>Bavaria’s tenant-protection ordinance</h2>
<p>Instead of three separate ordinances, Bavaria issued one combined ordinance based on ${h.src('bgb556d', 'Section 556d(2)')}, ${h.src('bgb558', 'Section 558(3)')} and ${h.src('bgb577a', 'Section 577a(2) of the Civil Code')}. For tenants this has a practical advantage: wherever the rent brake applies, so do the lowered cap and the longer notice ban, with the same end date. The previous 2021 ordinance expired at the end of 2025 and the new one followed without a gap. It was published in ${h.ext(vo.url, 'GVBl. 2025 p. 718')}; the 2026 amendment is in GVBl. 2026 p. 334.</p>
<h2>What the rent check works out for Ingolstadt</h2>
<p>For a new 70 m² lease and an assumed reference rent of ${h.eur(12, 2)}, at most ${h.eur(mpb.zulaessig, 2)} is lawful; the agreed ${h.eur(980, 0)} is ${h.eur(mpb.ueberMonat, 2)} a month too much. For an increase from ${h.eur(D.alt, 0)} to ${h.eur(D.verlangt, 0)}, the cap brakes it to ${h.eur(erh.zulaessig, 2)}. The reference rent itself comes from the municipality's rent index; separate pages explain where to find it for ${h.a('mietspiegel-muenchen', 'Munich')} and ${h.a('mietspiegel-nuernberg', 'Nuremberg')}.</p>
<h2>Every municipality in the ordinance</h2>
${gemeindeTabelle(vo, h, `Bavarian tenant-protection ordinance, annex, as of ${h.date('2026-07-16')}: ${D.nMpb} municipalities`)}
`,
  },
});
