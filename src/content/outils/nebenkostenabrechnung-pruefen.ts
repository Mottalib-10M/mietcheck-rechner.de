import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { bkFristen, bkVergleich, vorauszahlung } from '../../lib/engine/miete';
import { formatMoney, displayDate } from '../../lib/format';

// Valeurs par défaut du calculateur : période 2025, reçue le 15.6.2026, 65 m², 1 500 € froid, 1 150 € chaud, avance 210 €.
const fr = bkFristen({ periodeEnde: '2025-12-31', zugang: '2026-06-15' });
const v = bkVergleich({ kalt: 1500, warm: 1150, flaeche: 65 });
const saldo = 1500 + 1150 - 12 * 210;
const neu = vorauszahlung({ bisher: 210, ergebnis: saldo });
const spaet = bkFristen({ periodeEnde: '2025-12-31', zugang: '2027-01-08' });
const B = P.berlin_bk;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'nebenkostenabrechnung-pruefen',
  group: 'rechner',
  order: 30,
  tool: 'nebenkosten',
  related: ['nebenkostenabrechnung', 'nebenkosten', 'heizkostenabrechnung', 'nebenkosten-nachzahlung', 'co2-kosten-rechner'],
  sources: ['bgb556', 'bgb560', 'berlinBk', 'betrkv'],
  de: {
    slug: 'nebenkostenabrechnung-pruefen',
    nav: 'Nebenkostenabrechnung prüfen',
    card: 'Fristen, Kosten je m² und neue Vorauszahlung in einem Schritt.',
    title: 'Nebenkostenabrechnung prüfen 2026: Fristen und Kosten je m²',
    description: 'Nebenkostenabrechnung prüfen 2026: Abrechnungs- und Einwendungsfrist nach § 556 BGB, Kosten je m² gegen den Berliner Mittelwert und angemessene Vorauszahlung.',
    h1: 'Nebenkostenabrechnung prüfen: Frist, Höhe, Vorauszahlung',
    intro: 'Mit vier Zahlen aus der Abrechnung sehen Sie, ob sie rechtzeitig kam, ob die Kosten auffallen und welche Vorauszahlung angemessen ist.',
    resume: `Über die Betriebskosten muss der Vermieter jährlich abrechnen, und die Abrechnung muss spätestens zwölf Monate nach dem Ende des Abrechnungszeitraums bei Ihnen sein (§ 556 Abs. 3 BGB). Für das Kalenderjahr 2025 ist das der ${dD(fr.abrechnungBis)}. Kommt sie später, kann der Vermieter keine Nachzahlung mehr verlangen, es sei denn, er hat die Verspätung nicht zu vertreten; ein Guthaben muss er trotzdem auszahlen. Einwendungen können Sie bis zum Ablauf des zwölften Monats nach Zugang erheben. Der Rechner zeigt beide Fristen, rechnet Ihre kalten und warmen Betriebskosten auf Euro je Quadratmeter und Monat um und stellt sie neben die Werte der Berliner Betriebskostenübersicht 2026: ${eD(B.kalt_m2)} kalt und ${eD(B.warm_m2)} warm für das Abrechnungsjahr 2024. Im Beispiel mit 65 m² ergeben sich ${eD(v.kalt)} kalt und ${eD(v.warm)} warm, eine Nachzahlung von ${eD(saldo, 0)} und eine angemessene Vorauszahlung von ${eD(neu.neu)} statt ${eD(210, 0)} im Monat.`,
    faqs: [
      { q: 'Bis wann muss die Nebenkostenabrechnung für 2025 bei mir sein?', a: `Bei einem Abrechnungszeitraum vom 1. Januar bis 31. Dezember 2025 bis zum ${dD(fr.abrechnungBis)}. Entscheidend ist der Zugang bei Ihnen, nicht das Datum auf dem Schreiben. Kommt die Abrechnung erst am 8. Januar 2027, ist eine Nachforderung ausgeschlossen. Endet der Abrechnungszeitraum zu einem anderen Datum, verschiebt sich die Frist entsprechend: Der Rechner nimmt das Enddatum aus Ihrer Abrechnung.` },
      { q: 'Wie lange kann ich einer Nebenkostenabrechnung widersprechen?', a: `Bis zum Ende des zwölften Monats nach Zugang. Haben Sie die Abrechnung am 15. Juni 2026 erhalten, endet die Frist am ${dD(fr.einwendungBis!)}. Danach sind Einwendungen ausgeschlossen, außer Sie konnten die Verspätung nicht vermeiden. Bezahlen und gleichzeitig unter Vorbehalt prüfen ist möglich; der Widerspruch braucht keine Begründung bis ins Detail, aber er muss den Posten benennen.` },
      { q: 'Was sagt der Vergleich mit Berlin über meine Abrechnung?', a: `Er zeigt, ob Ihre Kosten auffallen, nicht ob sie falsch sind. Die Berliner Übersicht beruht auf den Abrechnungen größerer Wohnungsunternehmen für 2024, mit einem Mittel von ${eD(B.kalt_m2)} kalt und ${eD(B.warm_m2)} warm je Quadratmeter und Monat. Liegt ein Wert deutlich darüber, ist das ein Anlass, die Belege einzusehen, die der Vermieter auf Verlangen zeigen muss.` },
    ],
    body: (h) => `
<h2>Was der Rechner aus vier Zahlen macht</h2>
<p>Sie tragen das Ende des Abrechnungszeitraums ein, den Tag, an dem die Abrechnung ankam, Ihre Wohnfläche, die Summe der kalten Betriebskosten, die Summe für Heizung und Warmwasser und Ihre monatliche Vorauszahlung. Daraus ergeben sich drei Antworten. Erstens die Fristen aus ${h.src('bgb556', '§ 556 Abs. 3 BGB')}: bis wann die Abrechnung da sein musste und bis wann Sie Einwendungen erheben können. Zweitens die Höhe: Jahresbetrag geteilt durch Wohnfläche und zwölf Monate, so wie die ${h.src('berlinBk', 'Berliner Betriebskostenübersicht')} rechnet. Drittens die Vorauszahlung: Nach ${h.src('bgb560', '§ 560 Abs. 4 BGB')} können beide Seiten sie nach einer Abrechnung auf eine angemessene Höhe anpassen; der Rechner verteilt das Ergebnis der Abrechnung auf zwölf Monate.</p>
<h2>Beispiel mit 65 m²</h2>
${h.table(['Posten', 'Wert'], [
  ['kalte Betriebskosten 2025', h.eur(1500, 0) + ' = ' + h.eur(v.kalt, 2) + ' je m² und Monat'],
  ['Heizung und Warmwasser 2025', h.eur(1150, 0) + ' = ' + h.eur(v.warm, 2) + ' je m² und Monat'],
  ['Vorauszahlungen', '12 × ' + h.eur(210, 0) + ' = ' + h.eur(2520, 0)],
  ['Nachzahlung', h.eur(saldo, 0)],
  ['neue Vorauszahlung', h.eur(neu.neu, 2)],
  ['Abrechnung fällig bis', h.date(fr.abrechnungBis)],
  ['Einwendungen bis', h.date(fr.einwendungBis!)],
], 'Prüfung einer Abrechnung für das Kalenderjahr 2025, erhalten am 15. Juni 2026', ['l', 'r'])}
<p>Wäre dieselbe Abrechnung erst am ${h.date('2027-01-08')} gekommen, hätte der Vermieter die ${h.eur(saldo, 0)} nicht mehr verlangen können, denn die Frist endete am ${h.date(spaet.abrechnungBis)}. Welche Posten überhaupt umgelegt werden dürfen, listet die ${h.src('betrkv', 'Betriebskostenverordnung')} in 17 Nummern auf; die Seite ${h.a('nebenkosten', 'Nebenkosten')} erklärt sie einzeln. Heizkosten folgen eigenen Regeln mit Kürzungsrechten, die auf der Seite zur ${h.a('heizkostenabrechnung', 'Heizkostenabrechnung')} stehen.</p>
`,
  },
  en: {
    slug: 'service-charge-statement-check',
    nav: 'Service-charge check',
    card: 'Deadlines, cost per m² and new advance payment in one go.',
    title: 'Service Charge Check 2026: Statement Deadlines, Cost per m²',
    description: 'Service charge check for 2026: statement and objection deadlines under Section 556 BGB, costs per m² against the Berlin average and a fair new advance payment.',
    h1: 'Check your service-charge statement: deadline, amount, advance',
    intro: 'Four figures from the statement tell you whether it came in time, whether the costs stand out and what advance payment is reasonable.',
    resume: `Your landlord must settle the service charges (Betriebskosten, often called Nebenkosten) once a year, and the statement must reach you within twelve months of the end of the billing period (Section 556(3) of the Civil Code). For calendar year 2025 that means by ${dE(fr.abrechnungBis)}. If it arrives later, the landlord can no longer claim a top-up unless the delay was not his fault; he must still pay out any credit. You can object until the end of the twelfth month after receiving it. The calculator shows both deadlines, converts your cold and warm service charges into euros per square metre and month and sets them against the Berlin service-charge overview 2026: ${eE(B.kalt_m2)} cold and ${eE(B.warm_m2)} warm for the 2024 billing year. In the 65 m² example that gives ${eE(v.kalt)} cold and ${eE(v.warm)} warm, a top-up of ${eE(saldo, 0)} and a reasonable advance of ${eE(neu.neu)} instead of ${eE(210, 0)} a month.`,
    faqs: [
      { q: 'By when must my 2025 service-charge statement arrive?', a: `For a billing period from 1 January to 31 December 2025, by ${dE(fr.abrechnungBis)}. What counts is when it reaches you, not the date on the letter. If the statement only arrives on 8 January 2027, any top-up is barred. If your billing period ends on another date, the deadline moves with it; the calculator takes the end date from your statement.` },
      { q: 'How long can I object to a service-charge statement?', a: `Until the end of the twelfth month after you received it. If it reached you on 15 June 2026, the deadline is ${dE(fr.einwendungBis!)}. After that, objections are barred unless you could not help the delay. You can pay and still check the figures; the objection need not be detailed, but it must name the item you dispute.` },
      { q: 'What does the Berlin comparison tell me about my statement?', a: `Whether your costs stand out, not whether they are wrong. The Berlin overview is based on the 2024 statements of larger housing companies, with averages of ${eE(B.kalt_m2)} cold and ${eE(B.warm_m2)} warm per square metre and month. If one of your figures is well above that, it is worth inspecting the receipts, which the landlord must show you on request.` },
    ],
    body: (h) => `
<h2>What the calculator does with four figures</h2>
<p>You enter the end of the billing period, the day the statement arrived, your floor area, the total of cold service charges, the total for heating and hot water and your monthly advance. That gives three answers. First the deadlines from ${h.src('bgb556', 'Section 556(3) BGB')}: when the statement had to arrive and until when you may object. Second the level: the annual amount divided by floor area and twelve months, the method of the ${h.src('berlinBk', 'Berlin service-charge overview')}. Third the advance: under ${h.src('bgb560', 'Section 560(4) BGB')} either side may adjust it to a reasonable level after a statement; the calculator spreads the result over twelve months.</p>
<h2>Example with 65 m²</h2>
${h.table(['Item', 'Value'], [
  ['cold service charges 2025', h.eur(1500, 0) + ' = ' + h.eur(v.kalt, 2) + ' per m² and month'],
  ['heating and hot water 2025', h.eur(1150, 0) + ' = ' + h.eur(v.warm, 2) + ' per m² and month'],
  ['advance payments', '12 × ' + h.eur(210, 0) + ' = ' + h.eur(2520, 0)],
  ['top-up', h.eur(saldo, 0)],
  ['new advance', h.eur(neu.neu, 2)],
  ['statement due by', h.date(fr.abrechnungBis)],
  ['objections until', h.date(fr.einwendungBis!)],
], 'Checking a statement for calendar year 2025, received on 15 June 2026', ['l', 'r'])}
<p>Had the same statement only arrived on ${h.date('2027-01-08')}, the landlord could no longer have claimed the ${h.eur(saldo, 0)}. Which items may be passed on at all is set out in the ${h.src('betrkv', 'Service Charges Ordinance')} in 17 numbered items; the ${h.a('nebenkosten', 'service charges')} page explains each. Heating costs follow their own rules, with rights to deduct, described on the ${h.a('heizkostenabrechnung', 'heating statement')} page.</p>
`,
  },
});
