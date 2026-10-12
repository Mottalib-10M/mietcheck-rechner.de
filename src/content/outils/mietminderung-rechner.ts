import { defineGuide } from '../../lib/guide-types';
import { minderung } from '../../lib/engine/miete';
import { formatMoney } from '../../lib/format';

// Valeurs par défaut du calculateur : 750 € froid, 220 € d'avance, 10 %, du 10.1. au 15.3.2026.
const r = minderung({ kalt: 750, nebenkosten: 220, quote: 0.1, von: '2026-01-10', bis: '2026-03-15' });
const nurKalt = minderung({ kalt: 750, nebenkosten: 0, quote: 0.1, von: '2026-01-10', bis: '2026-03-15' });
const feb = minderung({ kalt: 750, nebenkosten: 220, quote: 0.1, von: '2026-02-01', bis: '2026-02-28' });
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');

export default defineGuide({
  id: 'mietminderung-rechner',
  group: 'rechner',
  order: 50,
  tool: 'minderung',
  related: ['mietminderung', 'maengelanzeige', 'nebenkosten', 'kaution-rechner', 'heizkostenabrechnung'],
  sources: ['bgb536', 'bgb536c', 'bgb556b'],
  de: {
    slug: 'mietminderung-rechner',
    nav: 'Mietminderung-Rechner',
    card: 'Minderungsbetrag auf die Bruttomiete, taggenau.',
    title: 'Mietminderung-Rechner 2026: taggenau auf die Bruttomiete',
    description: 'Mietminderung-Rechner 2026: Minderung nach § 536 BGB auf die Bruttomiete mit Nebenkosten, taggenau für jeden Monat mit Mangel, mit Hinweis zur Mängelanzeige.',
    h1: 'Mietminderung-Rechner: Wie viel dürfen Sie weniger zahlen?',
    intro: 'Kaltmiete, Nebenkostenvorauszahlung, Quote und Zeitraum eintragen: Der Rechner zählt jeden Tag mit Mangel einzeln.',
    resume: `Ist die Wohnung mangelhaft, mindert sich die Miete nach § 536 BGB von selbst, solange der Mangel die Tauglichkeit zum vertragsgemäßen Gebrauch herabsetzt; eine Vereinbarung oder ein Urteil braucht es dafür nicht. Gemindert wird nicht die Kaltmiete, sondern die Bruttomiete einschließlich der Vorauszahlung oder Pauschale für Nebenkosten; so hat es der Bundesgerichtshof am 6. April 2005 entschieden (XII ZR 225/03). Der Rechner rechnet deshalb mit Kaltmiete plus Nebenkosten und verteilt die Minderung auf jeden Kalendertag des Mangels, weil ein Monat mit 28 Tagen anders zählt als einer mit 31. Beispiel: ${eD(750, 0)} Kaltmiete und ${eD(220, 0)} Vorauszahlung ergeben ${eD(r.brutto, 0)} brutto. Bei einer Quote von zehn Prozent sind das ${eD(r.monat)} im vollen Monat; vom 10. Januar bis 15. März 2026 kommen ${eD(r.summe)} zusammen. Die Quote selbst legt kein Gesetz fest; sie hängt vom Mangel ab und wird im Streit vom Gericht bestimmt.`,
    faqs: [
      { q: 'Warum rechnet der Rechner mit der Bruttomiete statt der Kaltmiete?', a: `Weil der Bundesgerichtshof das so entschieden hat: Bemessungsgrundlage der Minderung ist die Gesamtmiete einschließlich aller Nebenkosten, gleich ob als Pauschale oder Vorauszahlung (Urteil vom 6. April 2005, XII ZR 225/03). Im Beispiel macht das einen Unterschied: ${eD(r.summe)} statt ${eD(nurKalt.summe)} auf die Kaltmiete allein.` },
      { q: 'Gibt es eine amtliche Tabelle für Minderungsquoten?', a: 'Nein. Das Gesetz spricht nur von einer angemessen herabgesetzten Miete. Tabellen im Netz sammeln Urteile zu Einzelfällen, deren Umstände sich selten auf Ihre Wohnung übertragen lassen. Deshalb trägt der Rechner keine Quote vor, sondern lässt Sie sie wählen, etwa nach Rücksprache mit dem Mieterverein, und zeigt, was sie in Euro bedeutet.' },
      { q: 'Wie wird ein halber Monat mit Mangel berechnet?', a: `Tageweise: Jeder Tag zählt mit dem Anteil des jeweiligen Monats. Im Februar 2026 mit 28 Tagen ergibt eine Quote von zehn Prozent auf ${eD(r.brutto, 0)} genau ${eD(feb.summe)}; in einem Monat mit 31 Tagen ist der einzelne Tag entsprechend weniger wert. So bleibt der volle Monat immer bei zehn Prozent der Bruttomiete.` },
    ],
    body: (h) => `
<h2>Was der Rechner rechnet, und was nicht</h2>
<p>Er rechnet die Folge einer Minderungsquote in Euro aus: Bruttomiete mal Quote für jeden vollen Monat, und für angebrochene Monate jeder Tag mit seinem Anteil. Er sagt nicht, wie hoch die Quote sein muss. ${h.src('bgb536', '§ 536 BGB')} kennt nur drei Stufen: Ist die Tauglichkeit aufgehoben, entfällt die Miete ganz; ist sie gemindert, ist eine angemessen herabgesetzte Miete zu zahlen; bleibt die Beeinträchtigung unerheblich, gibt es keine Minderung. Für die ersten drei Monate einer energetischen Modernisierung ist die Minderung ausgeschlossen (§ 536 Abs. 1a BGB).</p>
<h2>Drei Voraussetzungen vor dem ersten gekürzten Euro</h2>
<ol>
<li><strong>Anzeige des Mangels.</strong> Nach ${h.src('bgb536c', '§ 536c BGB')} müssen Sie einen Mangel unverzüglich melden. Wer nicht meldet, verliert das Minderungsrecht, soweit der Vermieter deshalb nicht abhelfen konnte. Die Seite zur ${h.a('maengelanzeige', 'Mängelanzeige')} zeigt, was hineingehört.</li>
<li><strong>Kein Mangel, den Sie bei Vertragsschluss kannten.</strong> Wer einen Mangel bei der Unterschrift kannte, kann nicht mindern; wer eine mangelhafte Wohnung in Kenntnis des Mangels übernimmt, muss sich seine Rechte bei der Übergabe vorbehalten (§ 536b BGB).</li>
<li><strong>Vorsicht bei der Kürzung.</strong> Die Miete ist zum dritten Werktag fällig (${h.src('bgb556b', '§ 556b BGB')}). Wer zu viel kürzt, gerät mit dem Rest in Verzug. Viele zahlen deshalb weiter unter Vorbehalt und fordern später zurück.</li>
</ol>
${h.table(['Rechenschritt', 'Betrag'], [
  ['Kaltmiete plus Vorauszahlung', h.eur(r.brutto, 2)],
  ['Quote', '10 %'],
  ['Minderung im vollen Monat', h.eur(r.monat, 2)],
  [`Minderung vom 10. Januar bis 15. März 2026 (${r.tage} Tage)`, h.eur(r.summe, 2)],
], 'Taggenaue Minderung, Beispiel mit den Voreinstellungen des Rechners', ['l', 'r'])}
<p>Mehr zu den Voraussetzungen und dazu, warum es keine verlässliche Quotentabelle gibt, steht auf der Seite zur ${h.a('mietminderung', 'Mietminderung')}.</p>
`,
  },
  en: {
    slug: 'rent-reduction-calculator',
    nav: 'Rent reduction calculator',
    card: 'Reduction on the gross rent, to the day.',
    title: 'Rent Reduction Calculator Germany 2026: Exact Daily Amount',
    description: 'Rent reduction calculator 2026: the amount under Section 536 BGB on the gross rent including service charges, day by day, with a note on reporting defects.',
    h1: 'Rent reduction calculator: how much less may you pay?',
    intro: 'Enter base rent, service-charge advance, rate and period: the calculator counts every day of the defect separately.',
    resume: `If your flat has a defect, German law reduces the rent automatically for as long as the defect impairs its use (Section 536 of the Civil Code); no agreement or court ruling is needed. The reduction (Mietminderung) applies not to the base rent but to the gross rent including the advance or flat rate for service charges, as the Federal Court of Justice decided on 6 April 2005 (XII ZR 225/03). The calculator therefore uses base rent plus service charges and spreads the reduction over every calendar day of the defect, because a 28-day month counts differently from a 31-day one. Example: ${eE(750, 0)} base rent and ${eE(220, 0)} advance make ${eE(r.brutto, 0)} gross. At a rate of ten per cent that is ${eE(r.monat)} in a full month; from 10 January to 15 March 2026 it adds up to ${eE(r.summe)}. No statute sets the rate itself; it depends on the defect and, in a dispute, is set by the court.`,
    faqs: [
      { q: 'Why does the calculator use the gross rent, not the base rent?', a: `Because the Federal Court of Justice said so: the basis of a reduction is the total rent including all service charges, whether paid as a flat rate or an advance (judgment of 6 April 2005, XII ZR 225/03). In the example that matters: ${eE(r.summe)} instead of ${eE(nurKalt.summe)} on the base rent alone.` },
      { q: 'Is there an official table of reduction rates?', a: 'No. The law only speaks of an appropriately reduced rent. Tables online collect court rulings on single cases whose circumstances rarely match your flat. So the calculator suggests no rate but lets you choose one, for instance after talking to a tenants’ association, and shows what it means in euros.' },
      { q: 'How is half a month with a defect calculated?', a: `Day by day: each day counts with its share of that month. In February 2026, with 28 days, a ten per cent rate on ${eE(r.brutto, 0)} gives exactly ${eE(feb.summe)}; in a 31-day month a single day is worth correspondingly less. That way a full month always stays at ten per cent of the gross rent.` },
    ],
    body: (h) => `
<h2>What the calculator does, and what it does not</h2>
<p>It turns a reduction rate into euros: gross rent times rate for each full month, and for part months each day with its share. It does not tell you what the rate should be. ${h.src('bgb536', 'Section 536 BGB')} knows three levels only: if the flat cannot be used at all, no rent is owed; if its use is impaired, an appropriately reduced rent is owed; if the impairment is minor, there is no reduction. During the first three months of an energy-saving modernisation a reduction is excluded (Section 536(1a) BGB).</p>
<h2>Three conditions before you pay a single euro less</h2>
<ol>
<li><strong>Report the defect.</strong> Under ${h.src('bgb536c', 'Section 536c BGB')} you must report a defect without delay. If you do not, you lose the right to reduce as far as the landlord could not fix it because of that. The ${h.a('maengelanzeige', 'reporting defects')} page shows what to include.</li>
<li><strong>Not a defect you knew of when signing.</strong> If you knew of a defect when you signed, you cannot reduce the rent for it; if you take over a defective flat knowing of the defect, you must reserve your rights at the handover (Section 536b BGB).</li>
<li><strong>Careful with the cut.</strong> Rent is due by the third working day (${h.src('bgb556b', 'Section 556b BGB')}). Cut too much and you fall into arrears for the rest. Many tenants therefore keep paying under reservation and reclaim later.</li>
</ol>
${h.table(['Step', 'Amount'], [
  ['base rent plus advance', h.eur(r.brutto, 2)],
  ['rate', '10%'],
  ['reduction in a full month', h.eur(r.monat, 2)],
  [`reduction from 10 January to 15 March 2026 (${r.tage} days)`, h.eur(r.summe, 2)],
], 'Day-by-day reduction, example with the calculator’s default values', ['l', 'r'])}
<p>The ${h.a('mietminderung', 'rent reduction')} page has more on the conditions and on why no reliable rate table exists.</p>
`,
  },
});
