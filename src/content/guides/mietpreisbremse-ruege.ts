import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { rueckforderung } from '../../lib/engine/miete';
import { addMonths } from '../../lib/engine/dates';
import { formatMoney, displayDate } from '../../lib/format';

const M = P.mpb;
const BEGINN = '2024-04-01';
// Même trop-perçu de 140 €/mois : plainte à 12, 29 et 31 mois ; arrêt du calcul au 31.10.2026.
const ueber = 140;
const faelle = [12, 29, 31].map((m) => ({ m, r: rueckforderung({ ueberMonat: ueber, beginn: BEGINN, ruege: addMonths(BEGINN, m), heute: '2026-10-31' }) }));
const ausgezogen = rueckforderung({ ueberMonat: ueber, beginn: BEGINN, ruege: '2026-06-15', heute: '2026-10-31', beendet: true });
const frist = addMonths(BEGINN, M.ruege_monate);
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietpreisbremse-ruege',
  group: 'erhoehung',
  order: 50,
  mini: 'ruege',
  miniHref: 'mietpreisbremse-rechner',
  related: ['mietpreisbremse', 'mietpreisbremse-rechner', 'vergleichsmiete', 'mietspiegel-berlin', 'mpb-he'],
  sources: ['bgb556g', 'bgb556d', 'bgb556e', 'bgb556f'],
  de: {
    slug: 'mietpreisbremse-ruege',
    nav: 'Rüge zur Mietpreisbremse',
    card: 'Was in die Rüge gehört und warum 30 Monate zählen.',
    title: 'Rüge Mietpreisbremse 2026: Inhalt, Frist und Rückforderung',
    description: 'Rüge nach der Mietpreisbremse 2026: Textform, Bezug auf die Auskunft des Vermieters, volle Rückzahlung bei Rüge binnen 30 Monaten und Beispiele je Frist.',
    h1: 'Die Rüge: wie Sie zu viel gezahlte Miete zurückbekommen',
    intro: 'Ohne Rüge kein Geld zurück: Erst die Rüge in Textform öffnet den Anspruch auf Rückzahlung nach § 556g BGB.',
    resume: `Liegt die vereinbarte Miete über der Grenze der Mietpreisbremse, ist die Vereinbarung insoweit unwirksam, und der Vermieter muss zu viel gezahlte Miete herausgeben. Zurückverlangen können Sie sie nach § 556g Abs. 2 BGB aber erst, wenn Sie den Verstoß gerügt haben. Die Rüge muss in Textform erklärt werden, ein Brief oder eine E-Mail genügt, und sich auf die Auskunft beziehen, die der Vermieter vor Vertragsschluss gegeben hat, falls er eine erteilt hat. Entscheidend ist der Zeitpunkt: Rügen Sie innerhalb von ${M.ruege_monate} Monaten nach Beginn des Mietverhältnisses und läuft der Vertrag noch, bekommen Sie alles zurück, was Sie seit Vertragsbeginn zu viel gezahlt haben. Rügen Sie später oder nach dem Auszug, gibt es nur die Miete zurück, die nach Zugang der Rüge fällig wird. Bei ${eD(ueber, 0)} Überzahlung im Monat und Mietbeginn am 1. April 2024 sind das bis Ende Oktober 2026 mit einer Rüge nach 29 Monaten ${eD(faelle[1].r.betrag, 0)}, mit einer Rüge nach 31 Monaten nur ${eD(faelle[2].r.betrag, 0)}.`,
    faqs: [
      { q: 'Muss die Rüge zur Mietpreisbremse begründet werden?', a: 'Sie muss erkennen lassen, dass und warum Sie die Miethöhe beanstanden. Eine detaillierte Berechnung ist nicht vorgeschrieben, aber sinnvoll: Nennen Sie die Vergleichsmiete nach dem Mietspiegel, die Grenze von zehn Prozent und den Betrag, den Sie für zu hoch halten. Hat der Vermieter eine Ausnahme mitgeteilt, etwa eine höhere Vormiete, muss sich die Rüge darauf beziehen.' },
      { q: 'Bis wann muss die Rüge ankommen, damit ich alles zurückbekomme?', a: `Innerhalb von ${M.ruege_monate} Monaten nach Beginn des Mietverhältnisses, und das Mietverhältnis darf zu diesem Zeitpunkt noch nicht beendet sein. Bei Mietbeginn am 1. April 2024 ist das der ${dD(frist)}. Maßgeblich ist der Zugang beim Vermieter, nicht das Absenden. Wer knapp dran ist, sorgt für einen nachweisbaren Zugang, etwa per Bote oder Einwurf mit Zeugen.` },
      { q: 'Kann ich nach dem Auszug noch zu viel gezahlte Miete zurückfordern?', a: `Nur sehr eingeschränkt. War das Mietverhältnis bei Zugang der Rüge schon beendet, kann nur die nach der Rüge fällig gewordene Miete zurückverlangt werden, und nach dem Auszug wird keine Miete mehr fällig. Im Beispiel bliebe bei einer Rüge nach Vertragsende ${eD(ausgezogen.betrag, 0)}. Deshalb lohnt die Rüge, solange Sie noch dort wohnen.` },
      { q: 'Muss ich nach der Rüge weniger Miete zahlen?', a: 'Sie schulden ab sofort nur noch die zulässige Miete. Viele Mieter zahlen trotzdem zunächst unter Vorbehalt weiter und fordern den Überschuss gesammelt zurück, um Streit über einen Zahlungsrückstand zu vermeiden. Eine Kürzung ist rechtlich möglich, setzt aber voraus, dass Ihre Berechnung stimmt; sonst riskieren Sie einen Rückstand.' },
      { q: 'Kann der Vermieter wegen einer Rüge kündigen?', a: 'Nein. Die Rüge ist die Ausübung eines gesetzlichen Rechts und kein Kündigungsgrund. Eine Kündigung zum Zwecke der Mieterhöhung ist nach § 573 Abs. 1 BGB ausdrücklich ausgeschlossen. Eine ordentliche Kündigung braucht ein berechtigtes Interesse wie Eigenbedarf, das der Vermieter im Schreiben darlegen und im Streit beweisen muss.' },
    ],
    body: (h) => `
<h2>Was die Rüge bewirkt</h2>
<p>${h.src('bgb556g', '§ 556g BGB')} unterscheidet zwei Dinge. Die Vereinbarung über eine zu hohe Miete ist von Anfang an unwirksam, soweit sie die zulässige Miete übersteigt (Absatz 1). Und der Anspruch auf Rückzahlung entsteht nur für die Zeit, die die Rüge abdeckt (Absatz 2). Ohne Rüge bleibt das Geld also beim Vermieter, obwohl er es nicht verlangen durfte. Mit einer frühen Rüge holen Sie es vollständig zurück, mit einer späten nur ab der Rüge.</p>
<h2>Die 30-Monats-Grenze in Zahlen</h2>
${h.table(['Rüge nach', 'zurück ab', 'Monate bis Ende Oktober 2026', 'Betrag'], faelle.map(({ m, r }) => [`${m} Monaten`, r.voll ? 'Mietbeginn' : h.date(r.ab), r.monate, h.eur(r.betrag, 0)]), `Überzahlung ${h.eur(ueber, 0)} im Monat, Mietbeginn ${h.date(BEGINN)}, § 556g Abs. 2 BGB`, ['l', 'l', 'r', 'r'])}
<p>Der Sprung zwischen 29 und 31 Monaten zeigt, warum die Frist so wichtig ist: Zwei Monate später gerügt, und die Überzahlung von mehr als zweieinhalb Jahren ist verloren. Die Grenze von 30 Monaten gilt für Mietverträge, die ab dem 1. April 2020 geschlossen wurden; für ältere Verträge galt eine engere Regel. Der kleine Rechner oben rechnet die Grenze für Ihre eigenen Zahlen.</p>
<h2>Was in die Rüge gehört</h2>
<ol>
<li><strong>Ihre Daten und die Wohnung.</strong> Name, Anschrift, Lage der Wohnung, Datum des Mietvertrags und des Mietbeginns.</li>
<li><strong>Die Beanstandung.</strong> Dass die vereinbarte Nettokaltmiete die nach § 556d BGB zulässige Miete übersteigt.</li>
<li><strong>Die Grundlage.</strong> Die Vergleichsmiete laut Mietspiegel mit Ausgabe und Feld oder Ergebnis der städtischen Online-Abfrage, die Grenze von zehn Prozent und der Betrag, um den die Miete zu hoch ist.</li>
<li><strong>Bezug auf die Auskunft.</strong> Hat der Vermieter vor Vertragsschluss eine Vormiete, eine Modernisierung, einen Neubau oder eine umfassende Modernisierung genannt, gehen Sie darauf ein und erklären, warum die Ausnahme nicht trägt.</li>
<li><strong>Die Forderung.</strong> Rückzahlung der zu viel gezahlten Beträge und künftig Zahlung nur der zulässigen Miete.</li>
<li><strong>Bitte um Auskunft.</strong> Nach § 556g Abs. 3 BGB muss der Vermieter Ihnen die Tatsachen mitteilen, die für die Zulässigkeit der Miete maßgeblich sind, soweit sie nicht allgemein zugänglich sind und er sie unschwer geben kann.</li>
</ol>
<h2>So kann eine Rüge aussehen</h2>
<p>Ein Beispiel, das Sie an Ihren Fall anpassen: „Sehr geehrte Damen und Herren, für die Wohnung im zweiten Obergeschoss links, Musterstraße 1, haben wir am 15. März 2024 einen Mietvertrag mit Beginn am 1. April 2024 geschlossen. Die vereinbarte Nettokaltmiete von 900 Euro übersteigt die nach § 556d BGB zulässige Miete. Nach dem Mietspiegel ergibt sich für die Wohnung eine ortsübliche Vergleichsmiete von 10,90 Euro je Quadratmeter, bei 70 Quadratmetern also 763 Euro; zulässig sind höchstens 839,30 Euro. Wir rügen hiermit den Verstoß gegen die Vorschriften über die zulässige Miethöhe bei Mietbeginn, verlangen die Rückzahlung der seit Mietbeginn zu viel gezahlten Beträge und bitten um Auskunft über die Tatsachen, auf die Sie die vereinbarte Miete stützen.“ Datum, Name, gegebenenfalls Unterschrift. Die Zahlen im Beispiel sind frei gewählt; setzen Sie Ihre eigenen ein.</p>
<h2>Die Auskunft des Vermieters vor Vertragsschluss</h2>
<p>Will sich der Vermieter auf eine Ausnahme berufen, muss er Sie vor Ihrer Vertragserklärung unaufgefordert in Textform informieren (§ 556g Abs. 1a). Hat er das versäumt, gilt die normale Grenze, auch wenn die Ausnahme in der Sache vorläge. Holt er die Auskunft nach, kann er sich erst zwei Jahre später darauf berufen; hat er sie nicht in Textform erteilt, erst nach formgerechter Nachholung. Prüfen Sie deshalb vor der Rüge, ob und wann Sie eine solche Auskunft bekommen haben, und heben Sie den Mietvertrag mit allen Anlagen auf.</p>
<h2>Wenn die Verordnung inzwischen ausgelaufen ist</h2>
<p>Maßgeblich ist, ob die Mietpreisbremse am Tag des Vertragsschlusses in Ihrer Gemeinde galt. Läuft die Landesverordnung später aus, wie in Hessen im November 2026 oder in Baden-Württemberg Ende 2026, bleibt Ihr Anspruch bestehen. Auch die Rüge ist danach noch möglich, nur gilt die 30-Monats-Grenze weiter. Die Seiten der Länder, etwa ${h.a('mpb-he', 'Mietpreisbremse Hessen')}, nennen die Laufzeiten. Ob Ihre Miete überhaupt zu hoch war, rechnet der ${h.a('mietpreisbremse-rechner', 'Mietpreisbremse-Rechner')} aus; die Grundlagen stehen auf der Seite ${h.a('mietpreisbremse', 'Mietpreisbremse')}.</p>
<h2>Kosten und Hilfe</h2>
<p>Eine Rüge kostet nichts, und Sie brauchen dafür weder eine Kanzlei noch einen Dienstleister. Mietervereine helfen ihren Mitgliedern beim Schreiben und bei der Durchsetzung. Legal-Tech-Anbieter übernehmen das Verfahren gegen einen Anteil an der zurückgeforderten Summe; ob sich das lohnt, hängt vom Betrag und vom Aufwand ab, den Sie selbst tragen möchten. Kommt keine Einigung zustande, entscheidet das Amtsgericht am Ort der Wohnung.</p>
`,
  },
  en: {
    slug: 'rent-brake-complaint',
    nav: 'Rent brake complaint',
    card: 'What goes into the complaint and why 30 months matter.',
    title: 'Rent Brake Complaint Germany 2026: Content, Deadline, Refund',
    description: 'Rent brake complaint 2026: text form, reference to the landlord’s disclosure, full refund if made within 30 months, and worked examples for each deadline.',
    h1: 'The complaint (Rüge): how to get overpaid rent back',
    intro: 'No complaint, no refund: only a complaint in text form opens the claim to repayment under Section 556g of the Civil Code.',
    resume: `If the agreed rent exceeds the rent-brake ceiling, the agreement is void to that extent, and the landlord must hand back overpaid rent. You can only reclaim it under Section 556g(2) of the German Civil Code, though, once you have complained about the breach (Rüge). The complaint must be made in text form, so a letter or e-mail will do, and must refer to any disclosure the landlord gave before the lease was signed. Timing decides: if you complain within ${M.ruege_monate} months of the start of the tenancy and the lease is still running, you recover everything overpaid since the start. If you complain later or after moving out, you only get back rent falling due after the complaint arrives. With an overpayment of ${eE(ueber, 0)} a month and a tenancy starting on 1 April 2024, a complaint after 29 months yields ${eE(faelle[1].r.betrag, 0)} up to the end of October 2026, a complaint after 31 months only ${eE(faelle[2].r.betrag, 0)}.`,
    faqs: [
      { q: 'Does a rent-brake complaint have to give reasons?', a: 'It must show that and why you object to the rent. A detailed calculation is not required but is sensible: state the reference rent from the rent index, the ten per cent limit and the amount you consider excessive. If the landlord disclosed an exemption, such as a higher previous rent, the complaint must address it.' },
      { q: 'By when must the complaint arrive for a full refund?', a: `Within ${M.ruege_monate} months of the start of the tenancy, and the tenancy must not have ended by then. With a start on 1 April 2024 that is ${dE(frist)}. What counts is receipt by the landlord, not sending. If time is short, make sure receipt can be proven, for example by messenger or letterbox delivery in front of a witness.` },
      { q: 'Can I reclaim overpaid rent after moving out?', a: `Only to a very limited extent. If the tenancy had already ended when the complaint arrived, only rent falling due after the complaint can be reclaimed, and after moving out no further rent falls due. In the example a complaint after the end of the lease leaves ${eE(ausgezogen.betrag, 0)}. That is why it pays to complain while you still live there.` },
      { q: 'Do I have to pay less rent after complaining?', a: 'From then on you only owe the lawful rent. Many tenants still keep paying under reservation at first and reclaim the excess in one go, to avoid a dispute over arrears. Paying less is lawful, but only if your calculation is right; otherwise you risk falling into arrears.' },
      { q: 'Can the landlord give notice because of a complaint?', a: 'No. Complaining is the exercise of a legal right and not a ground for notice. Section 573(1) of the Civil Code expressly rules out notice for the purpose of raising the rent. Ordinary notice needs a legitimate interest such as own use, which the landlord must set out in the letter and prove in a dispute.' },
    ],
    body: (h) => `
<h2>What the complaint does</h2>
<p>${h.src('bgb556g', 'Section 556g BGB')} separates two things. The agreement on an excessive rent is void from the start to the extent it exceeds the lawful rent (subsection 1). And the claim to repayment only arises for the period the complaint covers (subsection 2). Without a complaint the money stays with the landlord even though he was not entitled to it. An early complaint recovers it in full, a late one only from the complaint onward.</p>
<h2>The 30-month limit in figures</h2>
${h.table(['Complaint after', 'refund from', 'months to end of October 2026', 'Amount'], faelle.map(({ m, r }) => [`${m} months`, r.voll ? 'start of tenancy' : h.date(r.ab), r.monate, h.eur(r.betrag, 0)]), `Overpayment ${h.eur(ueber, 0)} a month, tenancy from ${h.date(BEGINN)}, Section 556g(2) BGB`, ['l', 'l', 'r', 'r'])}
<p>The jump between 29 and 31 months shows why the deadline matters so much: complain two months later and the overpayment of more than two and a half years is lost. The 30-month limit applies to leases signed from 1 April 2020; older leases had a narrower rule. The small calculator above works out the limit with your own figures.</p>
<h2>What goes into the complaint</h2>
<ol>
<li><strong>Your details and the flat.</strong> Name, address, position of the flat, date of the lease and of the start of the tenancy.</li>
<li><strong>The objection.</strong> That the agreed net cold rent exceeds the rent permitted under Section 556d BGB.</li>
<li><strong>The basis.</strong> The reference rent from the rent index with edition and field, or the result of the city's online lookup, the ten per cent limit and the amount by which the rent is too high.</li>
<li><strong>Reference to the disclosure.</strong> If the landlord named a previous rent, a modernisation, a new build or a full modernisation before signing, address it and explain why the exemption does not hold.</li>
<li><strong>The demand.</strong> Repayment of the overpaid amounts and, from now on, payment of the lawful rent only.</li>
<li><strong>A request for information.</strong> Under Section 556g(3) BGB the landlord must tell you the facts that determine whether the rent is lawful, as far as they are not publicly accessible and he can provide them without difficulty.</li>
</ol>
<h2>What a complaint can look like</h2>
<p>An example to adapt (letters to German landlords are best written in German): "Dear Sir or Madam, for the flat on the second floor left at Musterstraße 1 we signed a lease on 15 March 2024 starting on 1 April 2024. The agreed net cold rent of 900 euros exceeds the rent permitted under Section 556d BGB. According to the rent index, the local reference rent for the flat is 10.90 euros per square metre, so 763 euros for 70 square metres; at most 839.30 euros is lawful. We hereby complain about the breach of the rules on permissible rent at the start of a tenancy, demand repayment of the amounts overpaid since the start, and ask you to tell us the facts on which you base the agreed rent." Date, name, signature if on paper. The figures in the example are made up; insert your own.</p>
<h2>The landlord's disclosure before signing</h2>
<p>If the landlord wants to rely on an exemption, he must inform you in text form, unprompted, before you make your declaration (Section 556g(1a)). If he failed to, the normal ceiling applies even if the exemption existed in fact. If he discloses later, he can only rely on it two years afterwards; if he did not use text form, only after a proper disclosure. So before complaining, check whether and when you received such information, and keep the lease with all its annexes.</p>
<h2>If the ordinance has since expired</h2>
<p>What counts is whether the rent brake applied in your municipality on the day the lease was signed. If the state ordinance expires later, as in Hesse in November 2026 or in Baden-Württemberg at the end of 2026, your claim remains. A complaint is still possible afterwards, but the 30-month limit continues to apply. The state pages, such as the ${h.a('mpb-he', 'rent brake in Hesse')}, give the end dates. Whether your rent was too high at all is worked out by the ${h.a('mietpreisbremse-rechner', 'rent brake calculator')}; the basics are on the ${h.a('mietpreisbremse', 'rent brake')} page.</p>
<h2>Costs and help</h2>
<p>A complaint costs nothing, and you need neither a law firm nor a service provider for it. Tenants' associations (Mietervereine) help members draft it and enforce the claim. Legal-tech providers run the procedure for a share of the amount recovered; whether that pays off depends on the sum and on how much effort you want to put in yourself. If no agreement is reached, the local court where the flat is located decides.</p>
`,
  },
});
