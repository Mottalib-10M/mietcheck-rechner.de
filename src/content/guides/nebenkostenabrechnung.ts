import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { bkFristen, proM2Monat } from '../../lib/engine/miete';
import { formatMoney, displayDate } from '../../lib/format';

const B = P.betriebskosten;
// Beispiel : Kalenderjahr 2025, Abrechnung am 3. September 2026 im Briefkasten.
const f = bkFristen({ periodeEnde: '2025-12-31', zugang: '2026-09-03', heute: '2026-10-13' });
// Drei Abrechnungszeiträume, drei Zugangsdaten.
const FAELLE = [
  { start: '2024-07-01', ende: '2025-06-30', zugang: '2026-05-12' },
  { start: '2024-10-01', ende: '2025-09-30', zugang: '2026-10-02' },
  { start: '2025-01-01', ende: '2025-12-31', zugang: '2026-09-03' },
].map((x) => ({ ...x, r: bkFristen({ periodeEnde: x.ende, zugang: x.zugang }) }));
// Umlage nach Wohnfläche (§ 556a Abs. 1) : Haus mit 480 m², Wohnung mit 72 m².
const HAUS = 480, WHG = 72;
const POSTEN = [
  { de: 'Grundsteuer', en: 'property tax (Grundsteuer)', betrag: 2880 },
  { de: 'Gebäudeversicherung', en: 'buildings insurance', betrag: 1920 },
  { de: 'Müllabfuhr', en: 'waste collection', betrag: 1440 },
  { de: 'Treppenhausreinigung', en: 'stairwell cleaning', betrag: 2160 },
].map((p) => ({ ...p, anteil: Math.round((p.betrag * WHG / HAUS) * 100) / 100 }));
const summe = POSTEN.reduce((s, p) => s + p.anteil, 0);
const proM2 = proM2Monat(summe, WHG);
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'nebenkostenabrechnung',
  group: 'nebenkosten',
  order: 10,
  mini: 'bkfrist',
  miniHref: 'nebenkostenabrechnung-pruefen',
  related: ['nebenkostenabrechnung-pruefen', 'nebenkosten', 'heizkostenabrechnung', 'nebenkosten-nachzahlung', 'co2-kosten-rechner'],
  sources: ['bgb556', 'bgb556a', 'betrkv', 'betrkv1', 'bgb560'],
  de: {
    slug: 'nebenkostenabrechnung',
    nav: 'Nebenkostenabrechnung',
    card: 'Frist, Umlageschlüssel, Belegeinsicht: so lesen Sie Ihre Abrechnung.',
    title: 'Nebenkostenabrechnung 2026: Frist, Belege, Umlageschlüssel',
    description: 'Nebenkostenabrechnung 2026: Abrechnungs- und Einwendungsfrist nach § 556 BGB, Belegeinsicht, Umlage nach Wohnfläche oder Verbrauch, Wirtschaftlichkeit.',
    h1: 'Nebenkostenabrechnung: was drinstehen muss und wie Sie sie prüfen',
    intro: 'Eine Abrechnung ist erst dann richtig, wenn Sie jede Zahl darin bis zur Rechnung des Versorgers zurückverfolgen können.',
    resume: `Zahlen Sie monatliche Vorauszahlungen auf die Betriebskosten, muss Ihr Vermieter einmal im Jahr darüber abrechnen und dabei wirtschaftlich handeln (§ 556 Abs. 3 BGB). Die Abrechnung muss Ihnen spätestens ${B.abrechnung_monate} Monate nach dem Ende des Abrechnungszeitraums zugehen. Für das Kalenderjahr 2025 endet diese Frist am ${dD(f.abrechnungBis)}; danach ist eine Nachforderung ausgeschlossen, außer der Vermieter hat die Verspätung nicht zu vertreten. Ihre eigene Frist für Einwendungen beträgt ebenfalls ${B.einwendung_monate} Monate ab Zugang: Kam die Abrechnung am ${dD('2026-09-03')}, können Sie bis zum ${dD(f.einwendungBis!)} widersprechen. Verteilt wird nach dem vereinbarten Schlüssel, ohne Vereinbarung nach Wohnfläche (§ 556a BGB). Im Beispiel eines Hauses mit ${HAUS} m² trägt eine Wohnung mit ${WHG} m² genau ${WHG / HAUS * 100} Prozent jedes Postens, bei vier Posten zusammen ${eD(summe)} im Jahr. Auf Verlangen muss der Vermieter Ihnen die Belege zeigen, auch elektronisch.`,
    faqs: [
      { q: 'Welche Angaben braucht eine Nebenkostenabrechnung, damit ich sie nachrechnen kann?', a: 'Für jeden Posten die Gesamtkosten des Hauses, den Schlüssel, nach dem verteilt wird, die Summe der Schlüsselwerte (etwa die Gesamtwohnfläche) und Ihren Anteil daran. Am Ende müssen Ihre Vorauszahlungen abgezogen sein, damit Nachzahlung oder Guthaben herauskommt. Fehlt einer dieser Bausteine, können Sie die Abrechnung nicht prüfen; dann fragen Sie schriftlich nach und sehen die Belege ein.' },
      { q: 'Darf ich die Originalrechnungen beim Vermieter einsehen?', a: 'Ja. § 556 Abs. 4 BGB gibt Ihnen auf Verlangen das Recht, die Belege einzusehen, die der Abrechnung zugrunde liegen: Rechnungen der Versorger, Verträge mit Hausmeister- oder Reinigungsfirmen, Grundsteuerbescheid, Versicherungspolicen. Der Vermieter darf die Belege auch elektronisch bereitstellen, etwa als Scan oder über ein Portal. Verlangen Sie die Einsicht schriftlich und rechtzeitig vor dem Ende Ihrer Einwendungsfrist.' },
      { q: 'Muss ich eine Nachzahlung leisten, solange ich die Belege noch nicht gesehen habe?', a: 'Haben Sie die Einsicht verlangt und der Vermieter gewährt sie nicht, ist es vertretbar, den strittigen Betrag zunächst zurückzuhalten, bis Sie die Belege gesehen haben. Unbestrittene Teile zahlen Sie besser fristgerecht. Wer ganz ohne Begründung nicht zahlt, riskiert Mahnkosten. Halten Sie in Ihrem Schreiben fest, welche Posten Sie prüfen wollen und dass Sie unter Vorbehalt zahlen oder zurückhalten.' },
      { q: 'Kann der Vermieter den Verteilerschlüssel einfach ändern?', a: 'Nur in einem Fall ohne Ihre Zustimmung: § 556a Abs. 2 BGB erlaubt ihm, durch Erklärung in Textform auf eine Umlage nach erfasstem Verbrauch oder erfasster Verursachung umzustellen, und zwar nur vor Beginn eines Abrechnungszeitraums. Von Wohnfläche auf Personenzahl oder Wohnungszahl zu wechseln, geht dagegen nur mit einer Vereinbarung. Eine Umstellung mitten im laufenden Jahr ist unwirksam.' },
      { q: 'Was bedeutet das Gebot der Wirtschaftlichkeit für meine Abrechnung?', a: 'Der Vermieter darf nur Kosten umlegen, die bei vernünftiger Bewirtschaftung entstehen. Einen überteuerten Wartungsvertrag, eine doppelt bezahlte Leistung oder eine Versicherung, die weit über dem Üblichen liegt, muss er sich entgegenhalten lassen. Das Gebot steht in § 556 Abs. 3 und § 560 Abs. 5 BGB. Ein Vergleich mit Vorjahren und mit veröffentlichten Durchschnittswerten zeigt, wo sich ein genauer Blick lohnt.' },
      { q: 'Gilt die Frist auch, wenn der Vermieter mir ein Guthaben schuldet?', a: `Die Ausschlussfrist trifft nur Nachforderungen. Ein Guthaben aus zu hohen Vorauszahlungen bleibt Ihr Anspruch, auch wenn die Abrechnung nach dem ${dD(f.abrechnungBis)} kommt. Bleibt die Abrechnung ganz aus, fordern Sie sie schriftlich und mit einer Frist an; Ihr Guthabenanspruch geht dadurch nicht verloren. Teilabrechnungen für einzelne Posten schuldet er nicht, das sagt § 556 Abs. 3 BGB ausdrücklich.` },
    ],
    body: (h) => `
<h2>Zwei Fristen, die unabhängig voneinander laufen</h2>
<p>Die Betriebskostenabrechnung kennt eine Frist für den Vermieter und eine für Sie. Der Vermieter muss spätestens bis zum Ablauf des ${B.abrechnung_monate}. Monats nach dem Ende des Abrechnungszeitraums abrechnen, so ${h.src('bgb556', '§ 556 Abs. 3 Satz 2 BGB')}. Maßgeblich ist der Tag, an dem die Abrechnung in Ihren Machtbereich gelangt, also im Briefkasten liegt oder im vereinbarten Postfach eingeht; das Datum oben auf dem Schreiben zählt nicht. Verpasst der Vermieter die Frist, verliert er jede Nachforderung, es sei denn, er hat die Verspätung nicht zu vertreten. Ein typischer Fall dafür wäre ein Grundsteuerbescheid, der rückwirkend geändert wurde; ein überlastetes Abrechnungsbüro gehört nicht dazu.</p>
<p>Ihre Frist beginnt erst mit dem Zugang. Einwendungen müssen dem Vermieter bis zum Ablauf des ${B.einwendung_monate}. Monats danach mitgeteilt werden. Wer die Frist ohne Entschuldigung verstreichen lässt, kann später nichts mehr beanstanden, selbst wenn ein Posten offensichtlich nicht umlagefähig war. Der Abrechnungszeitraum muss nicht das Kalenderjahr sein; viele Verwaltungen rechnen vom 1. Juli bis 30. Juni oder vom 1. Oktober bis 30. September ab. Die Tabelle zeigt, was das für die Fristen bedeutet.</p>
${h.table(['Abrechnungszeitraum', 'Abrechnung spätestens', 'zugegangen am', 'Nachforderung möglich?', 'Einwendungen bis'], FAELLE.map((x) => [
  `${h.date(x.start)} bis ${h.date(x.ende)}`, h.date(x.r.abrechnungBis), h.date(x.zugang), x.r.zuSpaet ? 'nein, zu spät' : 'ja', h.date(x.r.einwendungBis!),
]), 'Fristen nach § 556 Abs. 3 BGB für drei Abrechnungszeiträume', ['l', 'r', 'r', 'l', 'r'])}
<p>Im zweiten Fall kam die Abrechnung zwei Tage zu spät. Der Vermieter kann die Nachzahlung nicht mehr fordern, muss ein etwaiges Guthaben aber trotzdem auszahlen. Ob Ihre eigene Abrechnung rechtzeitig war, rechnet der kleine Rechner oben für jedes Enddatum aus; die vollständige Prüfung mit Kosten je Quadratmeter bietet der ${h.a('nebenkostenabrechnung-pruefen', 'Rechner Nebenkostenabrechnung prüfen')}.</p>

<h2>Woran Sie eine prüfbare Abrechnung erkennen</h2>
<p>Das Gesetz schreibt keine Form vor, aber abrechnen heißt: Kosten so darstellen, dass der Mieter sie nachvollziehen kann. Für jeden Posten brauchen Sie vier Angaben, sonst lässt sich nichts nachrechnen:</p>
<ul>
<li>die Gesamtkosten des Postens für das Haus oder die Wirtschaftseinheit,</li>
<li>den Verteilerschlüssel, etwa Wohnfläche, Verbrauch laut Zähler oder Zahl der Wohnungen,</li>
<li>die Summe dieses Schlüssels im ganzen Haus und Ihren Wert darin,</li>
<li>Ihren Anteil in Euro.</li>
</ul>
<p>Unter dem Strich stehen Ihre Vorauszahlungen, so wie Sie sie tatsächlich gezahlt haben, und das Ergebnis. Prüfen Sie zuerst, ob der Zeitraum genau zwölf Monate umfasst, ob Ihre Wohnfläche mit dem Mietvertrag übereinstimmt und ob die Summe der Vorauszahlungen Ihren Kontoauszügen entspricht. Ein Fehler bei den Vorauszahlungen lässt sich mit dem Kontoauszug am leichtesten belegen.</p>

<h2>Der Umlageschlüssel nach § 556a BGB</h2>
<p>Haben Sie im Mietvertrag nichts anderes vereinbart, wird nach dem Anteil der Wohnfläche umgelegt (${h.src('bgb556a', '§ 556a Abs. 1 BGB')}). Kosten, die von einem erfassten Verbrauch abhängen, etwa Wasser mit Wohnungszählern, sind nach einem Maßstab zu verteilen, der diesem Verbrauch Rechnung trägt. Für Heizung und Warmwasser gilt zusätzlich die Heizkostenverordnung, die auf der Seite zur ${h.a('heizkostenabrechnung', 'Heizkostenabrechnung')} erklärt ist. Bei einer vermieteten Eigentumswohnung wird ohne Vereinbarung nach dem Schlüssel verteilt, den die Eigentümergemeinschaft untereinander anwendet, solange er nicht billigem Ermessen widerspricht (§ 556a Abs. 3).</p>
<p>Ein Beispiel zeigt, wie der Flächenschlüssel rechnet. Das Haus hat ${h.num(HAUS)} m² Wohnfläche, Ihre Wohnung ${h.num(WHG)} m².</p>
${h.table(['Posten', 'Kosten des Hauses', 'Ihr Anteil (' + h.num(WHG) + ' von ' + h.num(HAUS) + ' m²)'], [
  ...POSTEN.map((p) => [p.de, h.eur(p.betrag, 0), h.eur(p.anteil, 2)]),
  ['Summe', h.eur(POSTEN.reduce((s, p) => s + p.betrag, 0), 0), h.eur(summe, 2)],
  ['je m² und Monat', '', h.eur(proM2, 2)],
], 'Umlage nach Wohnfläche für vier kalte Posten', ['l', 'r', 'r'])}
<p>Stimmt die Gesamtfläche nicht, ist jeder Posten falsch. Steht ein Laden im Erdgeschoss leer oder ist eine Wohnung unvermietet, trägt der Vermieter deren Anteil selbst; die Gesamtfläche darf deshalb nicht um leere Einheiten verkleinert werden. Wie man die Wohnfläche richtig ermittelt, steht auf der Seite zur ${h.a('wohnflaeche', 'Wohnfläche')}.</p>

<h2>Was nicht in die Abrechnung gehört</h2>
<p>Umlegen darf der Vermieter nur Betriebskosten im Sinne der ${h.src('betrkv', 'Betriebskostenverordnung')}, und auch nur die Posten, die der Mietvertrag nennt. Ausdrücklich ausgenommen sind nach ${h.src('betrkv1', '§ 1 Abs. 2 BetrKV')} die Kosten der Verwaltung und die Kosten der Instandhaltung und Instandsetzung. Eine Rechnung über die Reparatur der Haustür, die Kontoführungsgebühr der Hausverwaltung oder das Honorar für die Erstellung der Abrechnung haben in Ihrer Abrechnung nichts zu suchen. Häufig versteckt sich so etwas in Sammelrechnungen des Hausmeisters: Dessen Kosten sind umlagefähig, soweit er Gartenpflege, Reinigung oder Kontrollgänge erledigt, nicht soweit er repariert oder verwaltet. Welche Nummern die Verordnung im Einzelnen erlaubt, finden Sie auf der Seite ${h.a('nebenkosten', 'Nebenkosten: was umlagefähig ist')}.</p>

<h2>Wirtschaftlichkeit: der Vermieter muss sparsam einkaufen</h2>
<p>Das Gebot der Wirtschaftlichkeit steht gleich zweimal im Gesetz: bei der Abrechnung in § 556 Abs. 3 Satz 1 und bei Veränderungen der Betriebskosten in ${h.src('bgb560', '§ 560 Abs. 5 BGB')}. Es verpflichtet den Vermieter, Leistungen zu marktüblichen Preisen einzukaufen und keine unnötigen Kosten zu verursachen. Sie müssen in einem Streit darlegen, dass ein Posten überhöht ist; dafür helfen Vergleichswerte aus Vorjahren und veröffentlichte Übersichten wie die Berliner Betriebskostenübersicht, die der Prüfrechner verwendet. Ein Anstieg eines Postens um ein Vielfaches gegenüber dem Vorjahr ist ein klarer Anlass, nach dem Grund zu fragen und den neuen Vertrag einzusehen.</p>

<h2>Belegeinsicht und Widerspruch in der Praxis</h2>
<p>${h.src('bgb556', '§ 556 Abs. 4 BGB')} gibt Ihnen das Recht, die Belege einzusehen. Nach Satz 2 darf der Vermieter sie auch elektronisch bereitstellen. Gehen Sie so vor:</p>
<ol>
<li>Prüfen Sie Zeitraum, Fläche und Vorauszahlungen gegen Ihre Unterlagen.</li>
<li>Vergleichen Sie jeden Posten mit dem Vorjahr und notieren Sie auffällige Sprünge.</li>
<li>Verlangen Sie schriftlich Einsicht in die Belege zu genau diesen Posten.</li>
<li>Erheben Sie Ihre Einwendungen in Textform, mit Posten und Grund, vor Ablauf Ihrer Frist.</li>
</ol>
<p>Eine Abweichung von diesen Regeln zu Ihrem Nachteil ist unwirksam (§ 556 Abs. 5 BGB), auch wenn sie im Mietvertrag steht. Ergibt die Abrechnung eine Nachzahlung, erklärt die Seite zur ${h.a('nebenkosten-nachzahlung', 'Nebenkosten-Nachzahlung')}, wann sie fällig wird und wie sich die Vorauszahlung danach ändert.</p>
`,
  },
  en: {
    slug: 'service-charge-statement',
    nav: 'Service-charge statement',
    card: 'Deadline, allocation key and receipts: how to read your annual statement.',
    title: 'Service Charge Statement 2026: Deadlines, Receipts and Split',
    description: 'Service charge statement in Germany 2026: landlord deadline, your objection deadline, the right to see receipts and how costs are split by area or usage.',
    h1: 'Service-charge statement: what it must show and how to check it',
    intro: 'A statement is only right if you can trace every figure in it back to an invoice from the supplier.',
    resume: `If you pay monthly advances towards service charges (Betriebskosten, often called Nebenkosten), your landlord must send an annual statement (Nebenkostenabrechnung) and keep costs economical, under Section 556(3) of the German Civil Code (BGB). The statement must reach you within ${B.abrechnung_monate} months of the end of the billing period. For calendar year 2025 that deadline is ${dE(f.abrechnungBis)}; after it the landlord cannot claim any top-up unless the delay was not his fault. You in turn have ${B.einwendung_monate} months from receipt to object: a statement that arrived on ${dE('2026-09-03')} can be challenged until ${dE(f.einwendungBis!)}. Costs are split by the key agreed in your lease, and by floor area if nothing was agreed (Section 556a BGB). In a building of ${HAUS} m², a ${WHG} m² flat bears exactly ${WHG / HAUS * 100} per cent of every item, ${eE(summe)} a year across four items in our example. On request the landlord must let you see the receipts, and may do so electronically.`,
    faqs: [
      { q: 'What does a service-charge statement need to show so I can check the maths?', a: 'For each item: the total cost for the building, the key used to split it, the total of that key (for example the combined floor area) and your share of it. At the end your advance payments must be deducted to give a balance due or a credit. If any of these pieces is missing you cannot verify the statement, so ask in writing and inspect the receipts.' },
      { q: 'Can I look at the original invoices behind my statement?', a: 'Yes. Section 556(4) BGB gives you the right, on request, to inspect the documents behind the statement: utility bills, contracts with caretaker or cleaning firms, the property-tax notice, insurance policies. The landlord may provide them electronically, as scans or through an online portal. Ask in writing and well before your objection deadline runs out, so you still have time to react.' },
      { q: 'Do I have to pay the balance before I have seen the receipts?', a: 'If you have asked to inspect the receipts and the landlord refuses, it is generally defensible to hold back the disputed amount until you have seen them. Pay the undisputed part on time. Simply not paying without any explanation risks reminder fees. Put in writing which items you want to check and that you are paying under reservation or withholding for now.' },
      { q: 'Can my landlord switch to a different allocation key on his own?', a: 'Only in one direction. Section 556a(2) BGB lets him announce in text form, before a billing period starts, that costs will be split by recorded consumption or usage. Moving from floor area to head count or number of flats needs your agreement. A change announced in the middle of a running billing year has no effect for that year.' },
      { q: 'What does the duty to keep costs economical mean in practice?', a: 'The landlord may only pass on costs that sensible management would incur. An overpriced maintenance contract, a service paid twice, or insurance far above the usual level can be challenged. The rule appears in Section 556(3) and Section 560(5) BGB. Comparing with previous years and with published averages shows where a closer look is worthwhile; you have to point to the problem.' },
      { q: 'Does the deadline matter if the landlord owes me money back?', a: `No, the cut-off only bars top-up claims. A credit from advances that were too high remains yours even if the statement arrives after ${dE(f.abrechnungBis)}. If no statement comes at all, ask for it in writing with a deadline; your claim to any credit is not lost by the delay. The landlord does not owe partial statements for single items; Section 556(3) BGB says so expressly.` },
    ],
    body: (h) => `
<h2>Two deadlines that run separately</h2>
<p>German service-charge law sets one deadline for the landlord and another for you. The landlord must deliver the statement by the end of the ${B.abrechnung_monate}th month after the billing period closes, as ${h.src('bgb556', 'Section 556(3) BGB')} puts it. What counts is the day the statement reaches you, in your letterbox or the agreed inbox, not the date printed on it. If he misses the deadline he loses any top-up claim, unless the delay was outside his control. A tax notice changed retroactively by the authority would be such a case; an overloaded billing contractor would not.</p>
<p>Your clock starts only on receipt. You must tell the landlord about objections by the end of the ${B.einwendung_monate}th month after that. If you let this pass without good reason, you cannot raise anything later, even an item that plainly should never have been charged. The billing period does not have to match the calendar year: many managing agents bill from 1 July to 30 June or from 1 October to 30 September. The table shows how that moves the dates.</p>
${h.table(['Billing period', 'Statement due by', 'Received on', 'Top-up still possible?', 'Objections until'], FAELLE.map((x) => [
  `${h.date(x.start)} to ${h.date(x.ende)}`, h.date(x.r.abrechnungBis), h.date(x.zugang), x.r.zuSpaet ? 'no, too late' : 'yes', h.date(x.r.einwendungBis!),
]), 'Deadlines under Section 556(3) BGB for three billing periods', ['l', 'r', 'r', 'l', 'r'])}
<p>In the second row the statement came two days late. The landlord can no longer demand the balance, but must still refund any credit. The small calculator above gives the deadline for any end date; the full check, including cost per square metre, is in the ${h.a('nebenkostenabrechnung-pruefen', 'service-charge check calculator')}.</p>

<h2>How to recognise a statement you can actually verify</h2>
<p>The law prescribes no template, but a statement has to let the tenant follow the arithmetic. For every line you need four pieces of information:</p>
<ul>
<li>the total cost of that item for the building or estate,</li>
<li>the allocation key (Umlageschlüssel), such as floor area, meter readings or number of flats,</li>
<li>the total of that key for the whole building and your figure within it,</li>
<li>your share in euros.</li>
</ul>
<p>At the bottom come the advances you actually paid and the resulting balance. Start by checking that the period covers exactly twelve months, that your floor area matches the lease, and that the advances match your bank statements. A wrong advance total is the easiest error to prove, with your bank statement.</p>

<h2>The allocation key under Section 556a BGB</h2>
<p>Unless your lease says otherwise, costs are shared by floor area (${h.src('bgb556a', 'Section 556a(1) BGB')}). Costs that depend on recorded consumption, such as water measured by flat meters, must be split in a way that reflects that consumption. Heating and hot water follow an extra set of rules, the Heating Costs Ordinance (Heizkostenverordnung), explained on the ${h.a('heizkostenabrechnung', 'heating-cost statement page')}. If you rent a privately owned flat in a building split into condominiums, the key used among the owners applies by default, as long as it is not unfair (Section 556a(3)).</p>
<p>Here is how the floor-area key works for a building with ${h.num(HAUS)} m² of living space and a flat of ${h.num(WHG)} m².</p>
${h.table(['Item', 'Building total', 'Your share (' + h.num(WHG) + ' of ' + h.num(HAUS) + ' m²)'], [
  ...POSTEN.map((p) => [p.en, h.eur(p.betrag, 0), h.eur(p.anteil, 2)]),
  ['Total', h.eur(POSTEN.reduce((s, p) => s + p.betrag, 0), 0), h.eur(summe, 2)],
  ['per m² per month', '', h.eur(proM2, 2)],
], 'Floor-area split for four non-heating items', ['l', 'r', 'r'])}
<p>If the building total is wrong, every line is wrong. Empty flats or a vacant shop do not shrink the total: the landlord carries their share himself. How floor area should be measured is covered on the ${h.a('wohnflaeche', 'floor area page')}.</p>

<h2>What does not belong in the statement</h2>
<p>Only costs listed in the ${h.src('betrkv', 'Service Charges Ordinance (Betriebskostenverordnung, BetrKV)')} can be passed on, and only those your lease names. ${h.src('betrkv1', 'Section 1(2) BetrKV')} expressly excludes management costs and the costs of maintenance and repair. A bill for fixing the front door, the managing agent's bank charges or a fee for preparing the statement have no place in your share. Such items often hide in the caretaker's invoice: his work is chargeable for gardening, cleaning or inspection rounds, not for repairs or administration. The page on ${h.a('nebenkosten', 'which service charges are allowed')} goes through the list item by item.</p>

<h2>Economy: the landlord has to buy sensibly</h2>
<p>The principle of economy (Wirtschaftlichkeitsgebot) appears twice: for the statement in Section 556(3), first sentence, and for changes in costs in ${h.src('bgb560', 'Section 560(5) BGB')}. It obliges the landlord to buy services at market prices and avoid needless costs. In a dispute it is up to you to show that an item is excessive, so previous years and published benchmarks such as the Berlin service-charge overview, which the check calculator uses, are your best evidence. An item that has multiplied since last year is a clear reason to ask why and to inspect the new contract.</p>

<h2>Inspecting receipts and objecting, step by step</h2>
<p>${h.src('bgb556', 'Section 556(4) BGB')} lets you inspect the documents, and its second sentence allows the landlord to make them available electronically. A practical sequence:</p>
<ol>
<li>Check period, floor area and advances against your own records.</li>
<li>Compare each item with last year and mark big jumps.</li>
<li>Ask in writing to see the receipts for exactly those items.</li>
<li>Send your objections in text form, an e-mail is enough, naming the item and the reason, before your deadline.</li>
</ol>
<p>Any clause that departs from these rules to your disadvantage is void (Section 556(5) BGB), even if it is in your lease. If the statement ends in a balance to pay, the page on the ${h.a('nebenkosten-nachzahlung', 'service-charge top-up')} explains when it falls due and how your monthly advance may change afterwards.</p>
`,
  },
});
