import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { kaution } from '../../lib/engine/miete';
import { formatMoney, displayDate } from '../../lib/format';

// Valeurs par défaut du calculateur : 850 € froid, 2 550 € demandés, début 1.11.2026, 0,5 %, 4 ans.
const r = kaution({ kaltmiete: 850, verlangt: 2550, beginn: '2026-11-01', zins: 0.005, jahre: 4 });
const zu = kaution({ kaltmiete: 850, verlangt: 3000 });
const K = P.kaution;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'kaution-rechner',
  group: 'rechner',
  order: 60,
  tool: 'kaution',
  related: ['mietkaution', 'kaution-zurueck', 'mietpreisbremse-rechner', 'kuendigungsfrist-rechner'],
  sources: ['bgb551', 'bgb569'],
  de: {
    slug: 'mietkaution-rechner',
    nav: 'Mietkaution-Rechner',
    card: 'Höchstbetrag, drei Raten mit Datum und Zinsen bis zum Auszug.',
    title: 'Mietkaution-Rechner 2026: Höchstbetrag, Raten und Zinsen',
    description: 'Mietkaution-Rechner 2026: höchstens drei Nettokaltmieten nach § 551 BGB, drei Raten mit Fälligkeit, Zinsen bis zum Auszug und Grenze der fristlosen Kündigung.',
    h1: 'Mietkaution-Rechner: Wie hoch darf die Kaution sein?',
    intro: 'Nettokaltmiete und verlangte Kaution genügen; mit Mietbeginn und Zinssatz kommen Raten und Zinsen dazu.',
    resume: `Die Mietkaution darf höchstens das Dreifache der monatlichen Miete ohne die als Pauschale oder Vorauszahlung ausgewiesenen Betriebskosten betragen (§ 551 Abs. 1 BGB). Maßgeblich ist also die Nettokaltmiete. Als Geldbetrag dürfen Sie die Kaution in drei gleichen monatlichen Raten zahlen: die erste zu Beginn des Mietverhältnisses, die beiden weiteren zusammen mit den folgenden Mieten. Der Vermieter muss das Geld getrennt von seinem Vermögen bei einer Bank anlegen, mindestens zum Zinssatz für Spareinlagen mit dreimonatiger Kündigungsfrist; die Zinsen gehören Ihnen und erhöhen die Kaution. Bei ${eD(850, 0)} Nettokaltmiete sind höchstens ${eD(r.hoechst)} zulässig, also drei Raten zu ${eD(r.rate)}, fällig am ${dD(r.raten[0])}, ${dD(r.raten[1])} und ${dD(r.raten[2])}. Bei 0,5 Prozent Zinsen über vier Jahre kommen ${eD(r.zinsen)} hinzu. Verlangt der Vermieter ${eD(3000, 0)}, ist die Abrede über ${eD(zu.zuviel)} unwirksam.`,
    faqs: [
      { q: 'Zählen die Nebenkosten bei der Höhe der Kaution mit?', a: `Nein. § 551 BGB nimmt die als Pauschale oder Vorauszahlung ausgewiesenen Betriebskosten ausdrücklich heraus. Zahlen Sie ${eD(850, 0)} kalt und ${eD(200, 0)} Vorauszahlung, liegt die Grenze bei ${eD(r.hoechst)}, nicht bei ${eD(3 * 1050)}. Nur wenn keine Betriebskosten gesondert ausgewiesen sind, etwa bei einer Inklusivmiete, ist die Gesamtmiete die Grundlage.` },
      { q: 'Darf der Vermieter die ganze Kaution bei der Schlüsselübergabe verlangen?', a: `Nein. Sie dürfen in ${K.raten} gleichen Raten zahlen, und diese Regel lässt sich nicht zu Ihrem Nachteil abbedingen. Fällig ist die erste Rate zu Beginn des Mietverhältnisses, die zweite und dritte mit den beiden nächsten Mieten. Ein Vertrag, der die Übergabe der Schlüssel von der vollen Kaution abhängig macht, ist insoweit unwirksam.` },
      { q: 'Ab wann darf der Vermieter wegen unbezahlter Kaution kündigen?', a: `Fristlos, wenn Sie mit einem Betrag in Höhe von zwei Nettokaltmieten im Verzug sind (§ 569 Abs. 2a BGB), bei ${eD(850, 0)} Miete also ab ${eD(r.verzugsgrenze)}. Eine Abmahnung oder Abhilfefrist braucht er dafür nicht. Wer nur eine Rate zu spät zahlt, erreicht diese Grenze bei einer Kaution von drei Mieten noch nicht.` },
    ],
    body: (h) => `
<h2>Was der Rechner prüft</h2>
<p>Er multipliziert Ihre Nettokaltmiete mit drei und vergleicht das Ergebnis mit der verlangten Kaution. Liegt die Forderung darüber, ist die Vereinbarung nur in Höhe des Überschusses unwirksam; bis zur Grenze bleibt sie gültig, und was Sie zu viel gezahlt haben, können Sie zurückverlangen. Mit dem Datum des Mietbeginns zeigt er die drei Raten, die ${h.src('bgb551', '§ 551 Abs. 2 BGB')} Ihnen zugesteht. Mit dem Zinssatz Ihres Kautionskontos rechnet er die Zinsen bis zum Auszug mit Zinseszins aus, weil die Erträge der Kaution zuwachsen.</p>
${h.table(['Angabe', 'Wert'], [
  ['Nettokaltmiete', h.eur(850, 2)],
  ['höchstens zulässige Kaution', h.eur(r.hoechst, 2)],
  ...r.raten.map((d, k) => [`${k + 1}. Rate am ${h.date(d)}`, h.eur(r.rate, 2)] as [string, string]),
  ['Zinsen bei 0,5 Prozent über vier Jahre', h.eur(r.zinsen, 2)],
  ['Grenze für die fristlose Kündigung wegen Kautionsverzugs', h.eur(r.verzugsgrenze, 2)],
], 'Mietkaution nach § 551 BGB, Beispiel mit den Voreinstellungen', ['l', 'r'])}
<h2>Wie Sie die Kaution leisten können</h2>
<p>Das Gesetz geht von einer Geldsumme aus, lässt aber andere Formen zu, wenn sie vereinbart sind: ein verpfändetes Sparbuch auf Ihren Namen, eine Bankbürgschaft oder eine Kautionsversicherung. Die Grenze von drei Monatsmieten gilt für alle Sicherheiten zusammen. Für Wohnraum in einem Studenten- oder Jugendwohnheim muss der Vermieter die Kaution nicht verzinsen. Wann und wie Sie das Geld nach dem Auszug zurückbekommen, steht auf der Seite ${h.a('kaution-zurueck', 'Kaution zurück')}; die Grundsätze erklärt die Seite zur ${h.a('mietkaution', 'Mietkaution')}.</p>
`,
  },
  en: {
    slug: 'rental-deposit-calculator',
    nav: 'Deposit calculator',
    card: 'Maximum deposit, three instalments with dates and interest.',
    title: 'Rental Deposit Calculator Germany 2026: Limit, Instalments',
    description: 'Rental deposit calculator 2026: at most three months of net cold rent under Section 551 BGB, three dated instalments, interest to move-out, arrears limit.',
    h1: 'Rental deposit calculator: how high may the deposit be?',
    intro: 'Net cold rent and the deposit asked for are enough; add the start date and interest rate for instalments and interest.',
    resume: `A German rental deposit (Mietkaution) may be at most three times the monthly rent without the service charges shown as a flat rate or advance (Section 551(1) of the Civil Code). What counts is therefore the net cold rent (Nettokaltmiete). A cash deposit may be paid in three equal monthly instalments: the first at the start of the tenancy, the other two with the following rent payments. The landlord must keep the money separate from his own, in a bank account paying at least the usual rate for savings with three months' notice; the interest belongs to you and is added to the deposit. With net cold rent of ${eE(850, 0)}, at most ${eE(r.hoechst)} is allowed, so three instalments of ${eE(r.rate)}, due on ${dE(r.raten[0])}, ${dE(r.raten[1])} and ${dE(r.raten[2])}. At 0.5 per cent interest over four years, ${eE(r.zinsen)} is added. If the landlord asks for ${eE(3000, 0)}, the agreement is void as to the ${eE(zu.zuviel)} above the limit.`,
    faqs: [
      { q: 'Do service charges count towards the deposit limit?', a: `No. Section 551 BGB expressly leaves out service charges shown as a flat rate or advance. If you pay ${eE(850, 0)} net cold rent plus a ${eE(200, 0)} advance, the limit is ${eE(r.hoechst)}, not ${eE(3 * 1050)}. Only if no service charges are shown separately, as with an all-inclusive rent, is the total rent the basis.` },
      { q: 'Can the landlord demand the full deposit when handing over the keys?', a: `No. You may pay in ${K.raten} equal instalments, and this rule cannot be changed to your disadvantage. The first instalment is due at the start of the tenancy, the second and third with the next two rent payments. A lease that makes the keys conditional on the full deposit is void on that point.` },
      { q: 'When can the landlord terminate over an unpaid deposit?', a: `Without notice once you are in arrears with an amount equal to two months’ net cold rent (Section 569(2a) BGB), so from ${eE(r.verzugsgrenze)} at ${eE(850, 0)} rent. He needs no warning or deadline for that. Paying one instalment late does not reach this limit with a deposit of three months’ rent.` },
    ],
    body: (h) => `
<h2>What the calculator checks</h2>
<p>It multiplies your net cold rent by three and compares the result with the deposit demanded. If the demand is higher, the agreement is void only as to the excess; up to the limit it stands, and anything you overpaid can be reclaimed. With the start date it shows the three instalments that ${h.src('bgb551', 'Section 551(2) BGB')} grants you. With your deposit account's interest rate it works out the interest to move-out, compounded, because the earnings are added to the deposit.</p>
${h.table(['Item', 'Value'], [
  ['net cold rent', h.eur(850, 2)],
  ['maximum lawful deposit', h.eur(r.hoechst, 2)],
  ...r.raten.map((d, k) => [`instalment ${k + 1} on ${h.date(d)}`, h.eur(r.rate, 2)] as [string, string]),
  ['interest at 0.5 per cent over four years', h.eur(r.zinsen, 2)],
  ['arrears limit for termination without notice', h.eur(r.verzugsgrenze, 2)],
], 'Rental deposit under Section 551 BGB, example with the default values', ['l', 'r'])}
<h2>How you can provide the deposit</h2>
<p>The law assumes a sum of money but allows other forms if agreed: a savings book in your name pledged to the landlord, a bank guarantee or a deposit insurance. The three-month limit applies to all securities together. For student or youth halls the landlord need not pay interest. When and how you get the money back after moving out is on the ${h.a('kaution-zurueck', 'deposit refund')} page; the principles are on the ${h.a('mietkaution', 'rental deposit')} page.</p>
`,
  },
});
