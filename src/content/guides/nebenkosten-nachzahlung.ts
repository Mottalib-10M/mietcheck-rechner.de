import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { bkFristen, vorauszahlung } from '../../lib/engine/miete';
import { formatMoney, displayDate } from '../../lib/format';

const B = P.betriebskosten;
// Beispiel : 190 € Vorauszahlung im Monat, Abrechnung 2025 mit 456 € Nachzahlung, zugegangen am 20. November 2026.
const BISHER = 190, NACH = 456;
const neu = vorauszahlung({ bisher: BISHER, ergebnis: NACH });
const rechtzeitig = bkFristen({ periodeEnde: '2025-12-31', zugang: '2026-11-20' });
const verspaetet = bkFristen({ periodeEnde: '2025-12-31', zugang: '2027-01-12' });
// Drei Ergebnisse derselben Abrechnung.
const SZEN = [
  { de: 'kleine Nachzahlung', en: 'small top-up', ergebnis: NACH },
  { de: 'hohe Nachzahlung nach Preisanstieg', en: 'large top-up after price rises', ergebnis: 1140 },
  { de: 'Guthaben', en: 'credit', ergebnis: -300 },
].map((s) => ({ ...s, r: vorauszahlung({ bisher: BISHER, ergebnis: s.ergebnis }) }));
const hoch = SZEN[1].r, gut = SZEN[2].r;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'nebenkosten-nachzahlung',
  group: 'nebenkosten',
  order: 40,
  mini: 'vorauszahlung',
  miniHref: 'nebenkostenabrechnung-pruefen',
  related: ['nebenkostenabrechnung', 'nebenkostenabrechnung-pruefen', 'nebenkosten', 'heizkostenabrechnung', 'kaution-zurueck'],
  sources: ['bgb556', 'bgb560', 'betrkv'],
  de: {
    slug: 'nebenkosten-nachzahlung',
    nav: 'Nebenkosten-Nachzahlung',
    card: 'Wann Sie nachzahlen müssen und wie sich die Vorauszahlung danach ändert.',
    title: 'Nebenkosten-Nachzahlung 2026: Frist und neue Vorauszahlung',
    description: 'Nebenkosten-Nachzahlung 2026: wann der Vermieter nachfordern darf, wann die Forderung wegen Fristablauf erlischt und wie die Vorauszahlung nach § 560 steigt.',
    h1: 'Nebenkosten-Nachzahlung: zahlen, prüfen oder verweigern?',
    intro: 'Eine Nachzahlung ist nur geschuldet, wenn die Abrechnung rechtzeitig kam und stimmt, und sie zieht oft eine höhere Vorauszahlung nach sich.',
    resume: `Ergibt die Betriebskostenabrechnung, dass Ihre Vorauszahlungen nicht gereicht haben, verlangt der Vermieter den Rest als Nachzahlung. Das darf er nur, wenn die Abrechnung Ihnen spätestens ${B.abrechnung_monate} Monate nach dem Ende des Abrechnungszeitraums zugegangen ist (§ 556 Abs. 3 BGB). Für das Jahr 2025 heißt das: Eine Abrechnung, die am ${dD('2026-11-20')} ankommt, ist rechtzeitig; kommt sie erst am ${dD('2027-01-12')}, ist die Nachforderung ausgeschlossen, solange der Vermieter die Verspätung zu vertreten hat. Nach der Abrechnung kann jede Seite die monatliche Vorauszahlung in Textform auf eine angemessene Höhe anpassen (§ 560 Abs. 4 BGB). Wer bisher ${eD(BISHER, 0)} im Monat zahlt und ${eD(NACH, 0)} nachzahlen soll, landet bei einer neuen Vorauszahlung von ${eD(neu.neu)}, also ${eD(neu.diff)} mehr im Monat. Umgekehrt dürfen Sie nach einem Guthaben von ${eD(300, 0)} auf ${eD(gut.neu)} senken. Einwendungen gegen die Abrechnung bleiben ${B.einwendung_monate} Monate ab Zugang möglich, auch wenn Sie schon gezahlt haben.`,
    faqs: [
      { q: 'Wann muss ich eine Nebenkostennachzahlung bezahlen?', a: 'Das Gesetz nennt keinen eigenen Zahltag für die Nachzahlung. Viele Abrechnungen setzen eine Frist von einigen Wochen. Nutzen Sie diese Zeit, um Zeitraum, Fläche, Vorauszahlungen und Umlageschlüssel zu prüfen und gegebenenfalls Belegeinsicht zu verlangen. Zahlen Sie den unbestrittenen Teil fristgerecht; für den strittigen Teil erklären Sie schriftlich, dass Sie unter Vorbehalt zahlen oder erst nach Einsicht in die Belege.' },
      { q: 'Muss ich nachzahlen, wenn die Abrechnung zu spät kommt?', a: `Nein, sofern der Vermieter die Verspätung zu vertreten hat. Nach § 556 Abs. 3 Satz 3 BGB ist eine Nachforderung dann ausgeschlossen. Für das Abrechnungsjahr 2025 lief die Frist am ${dD(verspaetet.abrechnungBis)} ab. Haben Sie trotzdem gezahlt, ohne die Verspätung zu bemerken, können Sie den Betrag zurückverlangen. Ein Guthaben zu Ihren Gunsten muss der Vermieter auch bei verspäteter Abrechnung auszahlen.` },
      { q: 'Darf der Vermieter nach einer Nachzahlung die Vorauszahlung erhöhen?', a: `Ja, aber nur nach einer Abrechnung und nur auf eine angemessene Höhe, durch Erklärung in Textform (§ 560 Abs. 4 BGB). Maßstab ist das Ergebnis der letzten Abrechnung. Bei ${eD(BISHER, 0)} Vorauszahlung und ${eD(1140, 0)} Nachzahlung sind ${eD(hoch.neu)} angemessen. Verlangt er deutlich mehr, ohne das zu begründen, müssen Sie den überschießenden Teil nicht zahlen. Eine Erhöhung ohne vorherige Abrechnung ist unwirksam.` },
      { q: 'Kann ich die Nachzahlung in Raten zahlen?', a: 'Einen gesetzlichen Anspruch auf Ratenzahlung gibt es nicht. Bei einer hohen Nachzahlung lohnt es sich trotzdem, den Vermieter früh und schriftlich um Raten zu bitten und einen konkreten Plan vorzuschlagen. Beziehen Sie Bürgergeld, Grundsicherung oder Wohngeld, reichen Sie die Abrechnung sofort beim zuständigen Amt ein, denn dort wird über eine Übernahme gesondert entschieden.' },
      { q: 'Muss ich nach dem Auszug noch Nebenkosten nachzahlen?', a: 'Ja, für die Zeit, in der Sie gewohnt haben. Die Abrechnung kommt mit dem regulären Abrechnungslauf, oft erst Monate nach dem Auszug, und es gelten dieselben Fristen. Viele Vermieter behalten deshalb einen Teil der Kaution bis zur nächsten Abrechnung zurück. Hinterlassen Sie Ihre neue Anschrift schriftlich, damit die Abrechnung Sie rechtzeitig erreicht und Sie Ihre Einwendungsfrist nutzen können.' },
      { q: 'Kann ich nach einem Guthaben die Vorauszahlung senken?', a: `Ja. § 560 Abs. 4 BGB gibt das Anpassungsrecht beiden Vertragsparteien. Ergab die Abrechnung bei ${eD(BISHER, 0)} Vorauszahlung ein Guthaben von ${eD(300, 0)}, ist eine Vorauszahlung von ${eD(gut.neu)} angemessen. Teilen Sie die Senkung in Textform mit und beziehen Sie sich auf die Abrechnung. Rechnen Sie aber absehbare Preissteigerungen, etwa beim Gas, ehrlich mit ein, sonst folgt die nächste Nachzahlung.` },
    ],
    body: (h) => `
<h2>Erst prüfen, ob die Forderung überhaupt besteht</h2>
<p>Eine Nachzahlung entsteht aus der Differenz zwischen Ihrem Anteil an den Betriebskosten und den Vorauszahlungen, die Sie im Abrechnungszeitraum geleistet haben. Bevor Sie zahlen, klären Sie drei Fragen. Kam die Abrechnung rechtzeitig? Sind nur Kosten enthalten, die die ${h.src('betrkv', 'Betriebskostenverordnung')} erlaubt und Ihr Mietvertrag auf Sie überträgt? Und stimmen die Vorauszahlungen, die abgezogen wurden, mit dem überein, was Sie tatsächlich überwiesen haben? Wurden statt der gezahlten Beträge nur die vereinbarten Soll-Beträge eingesetzt, kann eine Nachzahlung entstehen, die es in Wahrheit nicht gibt, zum Beispiel wenn Sie nach einer früheren Erhöhung bereits mehr gezahlt haben.</p>
<p>Eine hohe Nachzahlung zeigt oft, dass die Vorauszahlung von Anfang an knapp bemessen war. Das Gesetz zieht hier nur eine Grenze nach oben: Vorauszahlungen dürfen nach § 556 Abs. 2 Satz 2 BGB nur in angemessener Höhe vereinbart werden. Eine niedrige Vorauszahlung ist also erlaubt, und sie sagt nichts darüber, was das Wohnen tatsächlich kostet. Vergleichen Sie deshalb schon beim Einzug die vereinbarte Vorauszahlung mit Durchschnittswerten je Quadratmeter.</p>

<h2>Die Ausschlussfrist des § 556 Abs. 3 BGB</h2>
<p>Die Abrechnung muss Ihnen bis zum Ablauf des ${B.abrechnung_monate}. Monats nach dem Ende des Abrechnungszeitraums zugehen (${h.src('bgb556', '§ 556 Abs. 3 Satz 2 BGB')}). Danach ist eine Nachforderung ausgeschlossen, es sei denn, der Vermieter hat die Verspätung nicht zu vertreten. Diese Ausnahme ist eng: Sie greift, wenn ihm Zahlen fehlen, die er trotz aller Bemühungen nicht früher bekommen konnte, nicht schon dann, wenn die Verwaltung personell knapp besetzt war. Zwei Abrechnungen für das Kalenderjahr 2025 im Vergleich:</p>
${h.table(['Zugang', 'Frist endet', 'Ergebnis'], [
  [h.date('2026-11-20'), h.date(rechtzeitig.abrechnungBis), rechtzeitig.zuSpaet ? 'zu spät, keine Nachforderung' : 'rechtzeitig, Nachzahlung geschuldet'],
  [h.date('2027-01-12'), h.date(verspaetet.abrechnungBis), verspaetet.zuSpaet ? 'zu spät, keine Nachforderung' : 'rechtzeitig, Nachzahlung geschuldet'],
], 'Abrechnungsjahr 2025: rechtzeitige und verspätete Abrechnung', ['l', 'r', 'l'])}
<p>Wichtig ist der Zugang, nicht der Poststempel. Trägt der Vermieter vor, die Abrechnung sei rechtzeitig eingeworfen worden, muss er das beweisen. Bewahren Sie deshalb den Umschlag auf und notieren Sie, wann der Brief im Kasten lag. Die verspätete Abrechnung bleibt übrigens nicht folgenlos für den Vermieter: Er muss ein Guthaben trotzdem auszahlen, und Ihre eigene Einwendungsfrist von ${B.einwendung_monate} Monaten beginnt erst mit dem Zugang.</p>

<h2>Wie Sie mit einer Nachzahlung umgehen</h2>
<ol>
<li>Zeitraum, Wohnfläche und Vorauszahlungen gegen Mietvertrag und Kontoauszüge prüfen.</li>
<li>Jeden Posten mit dem Vorjahr vergleichen; Ausreißer markieren.</li>
<li>Bei Zweifeln Einsicht in die Belege verlangen, wie auf der Seite zur ${h.a('nebenkostenabrechnung', 'Nebenkostenabrechnung')} beschrieben.</li>
<li>Den unbestrittenen Betrag zahlen, für den Rest schriftlich Einwendungen erheben oder unter Vorbehalt zahlen.</li>
</ol>
<p>Zahlung unter Vorbehalt bedeutet: Sie zahlen, um Mahnungen zu vermeiden, behalten sich aber ausdrücklich vor, den Betrag zurückzufordern, wenn sich die Abrechnung als falsch herausstellt. Schreiben Sie das in den Verwendungszweck und in einen kurzen Brief. Einwendungen sind bis zum Ablauf des ${B.einwendung_monate}. Monats nach Zugang möglich; bei einem Zugang am ${h.date('2026-11-20')} also bis zum ${h.date(rechtzeitig.einwendungBis!)}.</p>

<h2>Die neue Vorauszahlung nach § 560 Abs. 4 BGB</h2>
<p>Nach jeder Abrechnung können Vermieter und Mieter die Vorauszahlung durch Erklärung in Textform auf eine angemessene Höhe anpassen (${h.src('bgb560', '§ 560 Abs. 4 BGB')}). Angemessen ist, was die tatsächlichen Kosten voraussichtlich deckt; den naheliegenden Maßstab liefert die letzte Abrechnung. Der kleine Rechner oben verteilt deshalb das Ergebnis auf zwölf Monate und schlägt es auf die bisherige Vorauszahlung auf.</p>
${h.table(['Ergebnis der Abrechnung', 'Betrag', 'neue Vorauszahlung', 'Änderung im Monat'], SZEN.map((s) => [s.de, h.eur(Math.abs(s.ergebnis), 0), h.eur(s.r.neu, 2), (s.r.diff >= 0 ? '+' : '') + h.eur(s.r.diff, 2)]), `Anpassung bei bisher ${h.eur(BISHER, 0)} Vorauszahlung im Monat`, ['l', 'r', 'r', 'r'])}
<p>Die Anpassung setzt eine Abrechnung voraus. Eine Erhöhung zwischendurch, nur weil Preise gestiegen sind, sieht das Gesetz für Vorauszahlungen nicht vor. Auch das Wirtschaftlichkeitsgebot des § 560 Abs. 5 gilt: Kosten, die der Vermieter nicht hätte verursachen dürfen, rechtfertigen keine höhere Vorauszahlung. Eine abweichende Vereinbarung zu Ihrem Nachteil ist unwirksam (§ 560 Abs. 6).</p>

<h2>Sonderfälle: Pauschale, Auszug, Heizkosten</h2>
<p>Haben Sie eine Betriebskostenpauschale vereinbart, gibt es keine Abrechnung und damit auch keine Nachzahlung; erhöhen darf der Vermieter die Pauschale nur unter den Voraussetzungen von § 560 Abs. 1 und 2, die auf der Seite ${h.a('nebenkosten', 'Nebenkosten')} erklärt sind. Ziehen Sie aus, schulden Sie die Nachzahlung für die Monate, in denen Sie gewohnt haben; das Gesetz regelt nicht, wie viel Kaution der Vermieter dafür zurückhalten darf, mehr dazu bei ${h.a('kaution-zurueck', 'Kaution zurück')}. Und stammt der größte Teil der Nachzahlung aus Heizung und Warmwasser, prüfen Sie zusätzlich die Kürzungsrechte auf der Seite zur ${h.a('heizkostenabrechnung', 'Heizkostenabrechnung')}. Fristen und Kosten je Quadratmeter für Ihre eigene Abrechnung rechnet der ${h.a('nebenkostenabrechnung-pruefen', 'Rechner Nebenkostenabrechnung prüfen')} aus.</p>
`,
  },
  en: {
    slug: 'service-charge-top-up',
    nav: 'Service-charge top-up',
    card: 'When you have to pay a balance and how your monthly advance changes.',
    title: 'Service Charge Top-Up 2026: Deadline and New Advance Payment',
    description: 'Service charge top-up 2026: when a landlord may claim a balance, when the claim lapses after the deadline, and how your advance rises under Section 560 BGB.',
    h1: 'Service-charge top-up: pay, check or refuse?',
    intro: 'A top-up is only owed if the statement arrived on time and is correct, and it often brings a higher monthly advance with it.',
    resume: `If your annual service-charge statement shows that your monthly advances did not cover the costs, the landlord asks for the difference as a top-up (Nachzahlung). He may only do so if the statement reached you within ${B.abrechnung_monate} months of the end of the billing period (Section 556(3) of the Civil Code, BGB). For 2025 that means a statement arriving on ${dE('2026-11-20')} is in time, while one arriving on ${dE('2027-01-12')} cannot support a top-up, as long as the delay was the landlord’s fault. After a statement, either side may adjust the monthly advance (Vorauszahlung) to a reasonable level by notice in text form (Section 560(4) BGB). A tenant paying ${eE(BISHER, 0)} a month who owes a ${eE(NACH, 0)} top-up ends up with a new advance of ${eE(neu.neu)}, ${eE(neu.diff)} more each month. After a credit of ${eE(300, 0)} you may lower it to ${eE(gut.neu)} instead. You keep ${B.einwendung_monate} months from receipt to object to the statement, even if you have already paid.`,
    faqs: [
      { q: 'When do I have to pay a service-charge top-up?', a: 'The law sets no specific payment date for the balance. Many statements give a deadline of a few weeks. Use that time to check the period, floor area, advances and allocation key, and ask to see the receipts if something looks wrong. Pay the undisputed part on time; for the disputed part, state in writing that you are paying under reservation or only after inspecting the receipts.' },
      { q: 'Do I owe a top-up if the statement came too late?', a: `No, provided the landlord was responsible for the delay. Section 556(3), third sentence, BGB then bars the claim. For the 2025 billing year the deadline ran out on ${dE(verspaetet.abrechnungBis)}. If you paid without noticing the delay, you can ask for the money back. A credit in your favour must still be paid out, however late the statement.` },
      { q: 'Can my landlord raise my monthly advance after a top-up?', a: `Yes, but only after a statement, only to a reasonable level, and by notice in text form (Section 560(4) BGB). The yardstick is the result of the last statement. With an advance of ${eE(BISHER, 0)} and a top-up of ${eE(1140, 0)}, ${eE(hoch.neu)} is reasonable. If he asks for much more without justification, you need not pay the excess. An increase without a preceding statement has no effect.` },
      { q: 'Can I pay a large service-charge balance in instalments?', a: 'There is no legal right to instalments. With a large balance it is still worth asking the landlord early, in writing, and proposing a concrete plan. If you receive citizen’s income (Bürgergeld), basic income support or housing benefit (Wohngeld), send the statement to the relevant office straight away, because it decides separately whether to cover the amount.' },
      { q: 'Do I still owe service charges after moving out?', a: 'Yes, for the months you lived there. The statement follows the normal billing cycle, often months after you leave, and the same deadlines apply. Many landlords therefore keep part of the deposit until the next statement. Give your new address in writing so the statement reaches you in time and you can use your objection period.' },
      { q: 'Can I lower my advance after a credit?', a: `Yes. Section 560(4) BGB gives the right to adjust to both parties. If the statement showed a credit of ${eE(300, 0)} on an advance of ${eE(BISHER, 0)}, an advance of ${eE(gut.neu)} is reasonable. Tell the landlord in text form, referring to the statement. Be honest about foreseeable price rises, gas for instance, or the next top-up will follow.` },
    ],
    body: (h) => `
<h2>First check whether the claim exists at all</h2>
<p>A top-up is the gap between your share of the service charges and the advances you paid during the billing period. Before paying, answer three questions. Did the statement arrive in time? Does it only contain costs that the ${h.src('betrkv', 'Service Charges Ordinance (BetrKV)')} allows and your lease passes on to you? And do the advances deducted match what you actually transferred? If the statement deducts only the agreed amounts rather than the amounts paid, it can show a balance that does not really exist, for instance if you were already paying more after an earlier increase.</p>
<p>A large top-up often shows that the advance was set low from the start. The law only draws a line at the top: under Section 556(2), second sentence, BGB, advances may only be agreed at a reasonable level. A low advance is therefore allowed, and it says nothing about what living in the flat really costs. When you sign a lease, compare the agreed advance with average costs per square metre.</p>

<h2>The cut-off in Section 556(3) BGB</h2>
<p>The statement must reach you by the end of the ${B.abrechnung_monate}th month after the billing period ends (${h.src('bgb556', 'Section 556(3), second sentence, BGB')}). After that, a top-up is barred unless the delay was not the landlord’s fault. That exception is narrow: it covers figures he could not obtain earlier despite every effort, not a short-staffed managing agent. Two statements for calendar year 2025 compared:</p>
${h.table(['Received', 'Deadline', 'Result'], [
  [h.date('2026-11-20'), h.date(rechtzeitig.abrechnungBis), rechtzeitig.zuSpaet ? 'too late, no top-up' : 'in time, top-up owed'],
  [h.date('2027-01-12'), h.date(verspaetet.abrechnungBis), verspaetet.zuSpaet ? 'too late, no top-up' : 'in time, top-up owed'],
], 'Billing year 2025: a timely and a late statement', ['l', 'r', 'l'])}
<p>What counts is receipt, not the postmark. If the landlord claims he delivered in time, he has to prove it, so keep the envelope and note when the letter arrived. A late statement still has consequences for him: he must pay out any credit, and your own ${B.einwendung_monate}-month objection period only starts when you receive it.</p>

<h2>Dealing with a top-up step by step</h2>
<ol>
<li>Check period, floor area and advances against your lease and bank statements.</li>
<li>Compare each item with last year and flag outliers.</li>
<li>If in doubt, ask to see the receipts, as described on the ${h.a('nebenkostenabrechnung', 'service-charge statement page')}.</li>
<li>Pay the undisputed amount and object in writing to the rest, or pay under reservation.</li>
</ol>
<p>Paying under reservation (unter Vorbehalt) means you pay to avoid reminders but expressly keep the right to reclaim the money if the statement turns out wrong. Put it in the payment reference and in a short letter or e-mail. Objections are possible until the end of the ${B.einwendung_monate}th month after receipt; for a statement received on ${h.date('2026-11-20')}, until ${h.date(rechtzeitig.einwendungBis!)}.</p>

<h2>The new advance under Section 560(4) BGB</h2>
<p>After every statement, landlord and tenant may each adjust the monthly advance to a reasonable level by a notice in text form (${h.src('bgb560', 'Section 560(4) BGB')}). Reasonable means what is likely to cover the real costs, and the obvious yardstick is the last statement. The small calculator above therefore spreads the result over twelve months and adds it to the current advance.</p>
${h.table(['Statement result', 'Amount', 'New advance', 'Change per month'], SZEN.map((s) => [s.en, h.eur(Math.abs(s.ergebnis), 0), h.eur(s.r.neu, 2), (s.r.diff >= 0 ? '+' : '') + h.eur(s.r.diff, 2)]), `Adjustment with a current advance of ${h.eur(BISHER, 0)} a month`, ['l', 'r', 'r', 'r'])}
<p>The adjustment requires a statement first. The law does not let a landlord raise advances mid-year just because prices went up. The duty of economy in Section 560(5) also applies: costs he should not have incurred cannot justify a higher advance. Any clause to your disadvantage is void (Section 560(6)).</p>

<h2>Special cases: flat rate, moving out, heating</h2>
<p>If your lease has a flat rate for service charges (Betriebskostenpauschale), there is no statement and so no top-up; the landlord can only raise a flat rate under Section 560(1) and (2), covered on the page about ${h.a('nebenkosten', 'service charges')}. If you move out, you owe the top-up for the months you lived there; the law does not say how much of the deposit the landlord may hold back for it, see ${h.a('kaution-zurueck', 'getting your deposit back')}. And if most of the balance comes from heating and hot water, check your deduction rights on the ${h.a('heizkostenabrechnung', 'heating-cost statement page')}. Deadlines and cost per square metre for your own statement are worked out by the ${h.a('nebenkostenabrechnung-pruefen', 'service-charge check')}.</p>
`,
  },
});
