import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { mieterhoehung } from '../../lib/engine/miete';
import { formatMoney, displayDate } from '../../lib/format';

const E = P.erhoehung;
// Trois lettres reçues le même jour (14.10.2026) pour 72 m², loyer 690 €, il y a trois ans 640 €.
const ovmHoch = mieterhoehung({ miete: 690, mieteVor3: 640, flaeche: 72, ovm: 12.5, kappung: E.kappung_angespannt, verlangt: 900, zugang: '2026-10-14', letzteAenderung: '2024-02-01' });
const ovmNied = mieterhoehung({ miete: 690, mieteVor3: 640, flaeche: 72, ovm: 10, kappung: E.kappung_angespannt, verlangt: 780, zugang: '2026-10-14', letzteAenderung: '2024-02-01' });
const zwanzig = mieterhoehung({ miete: 690, mieteVor3: 640, flaeche: 72, ovm: 12.5, kappung: E.kappung, verlangt: 900, zugang: '2026-10-14', letzteAenderung: '2024-02-01' });
const zuFrueh = mieterhoehung({ miete: 690, flaeche: 72, ovm: 12.5, kappung: E.kappung_angespannt, verlangt: 760, zugang: '2026-10-14', letzteAenderung: '2026-03-01' });
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mieterhoehung',
  group: 'erhoehung',
  order: 60,
  mini: 'erhoehung',
  miniHref: 'mieterhoehung-rechner',
  related: ['mieterhoehung-rechner', 'kappungsgrenze', 'vergleichsmiete', 'modernisierungsankuendigung', 'indexmiete', 'staffelmiete'],
  sources: ['bgb558', 'bgb558a', 'bgb558b', 'bgb558d', 'bgb559', 'bgb560'],
  de: {
    slug: 'mieterhoehung',
    nav: 'Mieterhöhung',
    card: 'Form, Grenzen, Fristen und was Sie antworten können.',
    title: 'Mieterhöhung 2026: Grenzen, Fristen und Ihre Antwort darauf',
    description: 'Mieterhöhung 2026 nach § 558 BGB: Vergleichsmiete, Kappungsgrenze 15 oder 20 Prozent, Sperrfrist, Zustimmung bis Ende des zweiten Monats und Teilzustimmung.',
    h1: 'Mieterhöhung: was Ihr Vermieter darf und wie Sie reagieren',
    intro: 'Eine Mieterhöhung bis zur Vergleichsmiete braucht Ihre Zustimmung; Sie müssen aber nur zustimmen, soweit sie zulässig ist.',
    resume: `Bei einem unbefristeten Mietvertrag ohne Staffel- oder Indexvereinbarung kann der Vermieter die Miete auf drei Wegen erhöhen: bis zur ortsüblichen Vergleichsmiete nach § 558 BGB, nach einer Modernisierung nach § 559 BGB und bei den Betriebskosten nach § 560 BGB. Die häufigste ist die erste, und sie braucht Ihre Zustimmung. Drei Grenzen gelten gleichzeitig: Die neue Miete darf die Vergleichsmiete nicht übersteigen, sie darf in drei Jahren um höchstens ${E.kappung * 100} Prozent steigen, in Gemeinden mit Kappungsgrenzenverordnung um ${E.kappung_angespannt * 100} Prozent, und sie darf frühestens wirksam werden, wenn die Miete ${E.sperrfrist_monate} Monate unverändert war. Das Schreiben muss in Textform kommen und begründet sein. Sie haben bis zum Ende des zweiten Kalendermonats nach Zugang Zeit; erhalten Sie es am 14. Oktober 2026, endet die Frist am ${dD(ovmHoch.zustimmungBis)}, und die neue Miete gilt ab ${dD(ovmHoch.wirksam)}. Verlangt der Vermieter für 72 m² statt ${eD(690, 0)} nun ${eD(900, 0)}, sind bei 15 Prozent Kappungsgrenze höchstens ${eD(ovmHoch.zulaessig)} zulässig.`,
    faqs: [
      { q: 'Was passiert, wenn ich auf ein Mieterhöhungsschreiben nicht reagiere?', a: `Dann gilt die Erhöhung nicht als angenommen. Schweigen ist keine Zustimmung. Der Vermieter kann nach Ablauf der Zustimmungsfrist innerhalb von drei weiteren Monaten auf Zustimmung klagen, bei einem Schreiben vom 14. Oktober 2026 also bis zum ${dD(ovmHoch.klageBis)}. Das Gericht prüft dann die Vergleichsmiete. Wer die erhöhte Miete vorbehaltlos zahlt, riskiert allerdings, dass darin eine Zustimmung gesehen wird.` },
      { q: 'Kann ich einer Mieterhöhung nur teilweise zustimmen?', a: `Ja. Sie stimmen dem Betrag zu, der zulässig ist, und lehnen den Rest ab. Im Beispiel stimmen Sie ${eD(ovmHoch.zulaessig)} zu und lehnen ${eD(ovmHoch.ueberMonat)} ab. Am besten schriftlich und mit kurzer Begründung, etwa dem Hinweis auf die Kappungsgrenze Ihrer Gemeinde. Für den abgelehnten Teil muss der Vermieter klagen, wenn er ihn durchsetzen will.` },
      { q: 'Darf der Vermieter die Miete jedes Jahr erhöhen?', a: `Höchstens einmal in zwölf Monaten, und die neue Miete darf frühestens nach ${E.sperrfrist_monate} Monaten seit der letzten Änderung wirksam werden. Wurde die Miete zum 1. März 2026 erhöht, ist ein neues Verlangen erst ab dem 1. März 2027 zulässig und die neue Miete gilt frühestens ab ${dD(zuFrueh.fruehWirksam)}. Erhöhungen nach Modernisierung und bei den Betriebskosten zählen für diese Fristen nicht.` },
      { q: 'Gilt die Kappungsgrenze auch, wenn die Miete weit unter dem Mietspiegel liegt?', a: `Ja, gerade dann. Bei einer Vergleichsmiete von 12,50 Euro je Quadratmeter wären für 72 m² rechnerisch ${eD(ovmHoch.grenzeOvm)} möglich. Die Kappungsgrenze erlaubt aber nur ${E.kappung_angespannt * 100} oder ${E.kappung * 100} Prozent auf die Miete von vor drei Jahren, hier ${eD(ovmHoch.grenzeKappung)} oder ${eD(zwanzig.grenzeKappung)}. Wer lange günstig gewohnt hat, ist so vor Sprüngen geschützt.` },
      { q: 'Kann ich nach einer Mieterhöhung kündigen?', a: 'Ja, mit einem Sonderkündigungsrecht. Nach einer Erhöhung auf die Vergleichsmiete können Sie bis zum Ablauf des zweiten Monats nach Zugang des Schreibens zum Ablauf des übernächsten Monats kündigen; die Erhöhung tritt dann nicht ein. Das steht in § 561 BGB und gilt auch nach einer Modernisierungserhöhung.' },
      { q: 'Was muss ein wirksames Mieterhöhungsschreiben enthalten?', a: 'Die neue Miete in Euro, den Hinweis, dass Ihre Zustimmung verlangt wird, und eine Begründung, etwa mit dem Mietspiegel, einem Gutachten oder drei Vergleichswohnungen. Gibt es einen qualifizierten Mietspiegel mit Angaben für die Wohnung, muss der Vermieter diese immer nennen. Es genügt Textform; eine Unterschrift ist nicht nötig, wohl aber ein erkennbarer Absender.' },
    ],
    body: (h) => `
<h2>Drei Wege zu einer höheren Miete</h2>
<p><strong>Bis zur Vergleichsmiete</strong> (${h.src('bgb558', '§ 558 BGB')}): Der Vermieter verlangt Ihre Zustimmung zu einer neuen Miete, die er mit dem Mietspiegel oder einem anderen Mittel begründet. Ohne Zustimmung muss er klagen. <strong>Nach einer Modernisierung</strong> (${h.src('bgb559', '§ 559 BGB')}): Er erklärt einseitig eine Erhöhung um acht Prozent der Kosten im Jahr, gedeckelt auf drei Euro je Quadratmeter in sechs Jahren; das erklärt die Seite zur ${h.a('modernisierungsankuendigung', 'Modernisierung')}. <strong>Bei den Betriebskosten</strong> (${h.src('bgb560', '§ 560 BGB')}): Er passt Vorauszahlungen nach einer Abrechnung an oder legt Erhöhungen einer Pauschale um. Dazu kommen vertragliche Wege: Bei einer ${h.a('staffelmiete', 'Staffelmiete')} stehen die Erhöhungen im Vertrag, bei einer ${h.a('indexmiete', 'Indexmiete')} folgen sie dem Verbraucherpreisindex; beide schließen die Erhöhung nach § 558 aus.</p>
<h2>Die drei Grenzen im Vergleich</h2>
${h.table(['Fall (72 m², bisher 690 €, vor drei Jahren 640 €)', 'Grenze Vergleichsmiete', 'Grenze Kappung', 'zulässig'], [
  ['Vergleichsmiete 12,50 €/m², Kappung 15 %, verlangt 900 €', h.eur(ovmHoch.grenzeOvm, 2), h.eur(ovmHoch.grenzeKappung, 2), h.eur(ovmHoch.zulaessig, 2)],
  ['Vergleichsmiete 12,50 €/m², Kappung 20 %, verlangt 900 €', h.eur(zwanzig.grenzeOvm, 2), h.eur(zwanzig.grenzeKappung, 2), h.eur(zwanzig.zulaessig, 2)],
  ['Vergleichsmiete 10,00 €/m², Kappung 15 %, verlangt 780 €', h.eur(ovmNied.grenzeOvm, 2), h.eur(ovmNied.grenzeKappung, 2), h.eur(ovmNied.zulaessig, 2)],
], 'Mieterhöhung nach § 558 BGB, Schreiben erhalten am 14. Oktober 2026', ['l', 'r', 'r', 'r'])}
<p>Im ersten Fall bremst die Kappungsgrenze, im dritten die Vergleichsmiete: Die niedrigere der beiden Grenzen gilt immer. Welche Kappungsgrenze in Ihrer Gemeinde gilt, ermittelt der ${h.a('mieterhoehung-rechner', 'Mieterhöhungsrechner')} aus der Verordnung Ihres Landes; die Liste der Länder steht auf der Seite ${h.a('kappungsgrenze', 'Kappungsgrenze')}.</p>
<h2>Die Fristen</h2>
<ul>
<li><strong>Wartefrist:</strong> Das Verlangen darf frühestens ${E.wartefrist_monate} Monate nach der letzten Erhöhung kommen. Ein zu frühes Schreiben ist unwirksam und muss neu gestellt werden.</li>
<li><strong>Sperrfrist:</strong> Die neue Miete darf frühestens wirksam werden, wenn die bisherige ${E.sperrfrist_monate} Monate gegolten hat.</li>
<li><strong>Zustimmungsfrist:</strong> Bis zum Ende des zweiten Kalendermonats nach Zugang (${h.src('bgb558b', '§ 558b Abs. 2 BGB')}).</li>
<li><strong>Wirksamkeit:</strong> Ab Beginn des dritten Kalendermonats nach Zugang.</li>
<li><strong>Klagefrist:</strong> Drei weitere Monate nach Ablauf der Zustimmungsfrist; danach muss der Vermieter ein neues Verlangen stellen.</li>
</ul>
<p>Ein Schreiben, das am 14. Oktober 2026 ankommt, kann bis zum ${h.date(ovmHoch.zustimmungBis)} beantwortet werden; die neue Miete gilt ab ${h.date(ovmHoch.wirksam)}, die Klagefrist endet am ${h.date(ovmHoch.klageBis)}. Kommt dasselbe Schreiben nur sieben Monate nach der letzten Erhöhung, ist es zu früh: Die neue Miete könnte frühestens ab ${h.date(zuFrueh.fruehWirksam)} gelten.</p>
<h2>So prüfen Sie das Schreiben</h2>
<ol>
<li>Ist es in Textform, mit erkennbarem Absender und der neuen Miete in Euro?</li>
<li>Ist es begründet, und nennt es bei einem qualifizierten Mietspiegel dessen Werte (${h.src('bgb558a', '§ 558a Abs. 3')})?</li>
<li>Stimmen Wohnfläche, Baujahr, Wohnlage und Ausstattung, die der Vermieter ansetzt? Ein Fehler bei der Lage oder der Fläche verschiebt die Vergleichsmiete. Die Seite ${h.a('vergleichsmiete', 'Vergleichsmiete')} nennt die häufigsten Fehler.</li>
<li>Hält die neue Miete die Kappungsgrenze Ihrer Gemeinde ein, gerechnet auf die Miete von vor drei Jahren ohne Modernisierungs- und Betriebskostenerhöhungen?</li>
<li>Sind Wartefrist und Sperrfrist eingehalten?</li>
</ol>
<p>Fällt eine dieser Prüfungen negativ aus, stimmen Sie nur dem zulässigen Teil zu oder gar nicht. Bei Unsicherheit über die Vergleichsmiete hilft der Mieterverein, der das Schreiben mit dem Mietspiegel abgleicht.</p>
<h2>Zustimmen, ablehnen oder kündigen</h2>
<p>Sie haben drei Möglichkeiten. Sie stimmen ganz zu, wenn alle Prüfungen bestanden sind; dann schulden Sie die neue Miete ab dem dritten Monat. Sie stimmen teilweise zu, wenn die verlangte Miete eine Grenze überschreitet; dann schulden Sie den zulässigen Betrag, und über den Rest müsste ein Gericht entscheiden. Oder Sie kündigen mit dem Sonderkündigungsrecht nach § 561 BGB, wenn Sie die höhere Miete nicht tragen wollen; die Erhöhung tritt dann nicht ein. Wer zustimmt, sollte das schriftlich tun und den Betrag ausdrücklich nennen, damit später kein Streit über den Umfang entsteht. Eine Zustimmung unter dem Vorbehalt, dass eine Prüfung folgt, ist keine wirksame Zustimmung: Entweder Sie stimmen einem bestimmten Betrag zu oder nicht.</p>
<h2>Erhöhung nach § 558 und Mietpreisbremse</h2>
<p>Die Mietpreisbremse betrifft nur die Miete bei Vertragsbeginn. Eine Anfangsmiete, die über der damaligen Grenze lag, wird durch eine spätere Erhöhung nicht rechtmäßig; der Anspruch auf Rückzahlung nach einer Rüge bleibt bestehen. Und solange die Miete schon über der Vergleichsmiete liegt, ist eine Erhöhung nach § 558 ohnehin nicht möglich.</p>
`,
  },
  en: {
    slug: 'rent-increase-explained',
    nav: 'Rent increase explained',
    card: 'Form, limits, deadlines and how you can answer.',
    title: 'Rent Increase Germany 2026: Limits, Deadlines, Your Reply',
    description: 'Rent increase Germany 2026 under Section 558 BGB: reference rent, 15 or 20 per cent cap, waiting period, consent by the second month’s end, partial consent.',
    h1: 'Rent increases: what your landlord may do and how to respond',
    intro: 'An increase up to the reference rent needs your consent, but you only have to agree as far as it is lawful.',
    resume: `On an open-ended German lease without a graduated or index clause, the landlord can raise the rent in three ways: up to the local reference rent under Section 558 of the Civil Code (BGB), after a modernisation under Section 559, and for service charges under Section 560. The most common is the first, and it needs your consent. Three limits apply at once: the new rent may not exceed the reference rent (ortsübliche Vergleichsmiete), it may rise by at most ${E.kappung * 100} per cent in three years, or ${E.kappung_angespannt * 100} per cent where the state has lowered the cap (Kappungsgrenze), and it may only take effect once the rent has been unchanged for ${E.sperrfrist_monate} months. The letter must be in text form and justified. You have until the end of the second calendar month after receipt; if it arrives on 14 October 2026, the deadline is ${dE(ovmHoch.zustimmungBis)} and the new rent applies from ${dE(ovmHoch.wirksam)}. If the landlord asks ${eE(900, 0)} instead of ${eE(690, 0)} for 72 m², at most ${eE(ovmHoch.zulaessig)} is lawful under a 15 per cent cap.`,
    faqs: [
      { q: 'What happens if I do not reply to a rent increase letter?', a: `Then the increase is not accepted; silence is not consent. After the consent period the landlord can sue for consent within three more months, so for a letter of 14 October 2026 until ${dE(ovmHoch.klageBis)}. The court then examines the reference rent. If you pay the higher rent without reservation, though, you risk that being treated as consent.` },
      { q: 'Can I agree to only part of a rent increase?', a: `Yes. You agree to the lawful amount and refuse the rest. In the example you agree to ${eE(ovmHoch.zulaessig)} and refuse ${eE(ovmHoch.ueberMonat)}. Do it in writing with a short reason, such as your municipality’s cap. For the refused part the landlord must go to court if he wants to enforce it.` },
      { q: 'May the landlord raise the rent every year?', a: `At most once in twelve months, and the new rent may only take effect at the earliest ${E.sperrfrist_monate} months after the last change. If the rent went up on 1 March 2026, a new demand is only valid from 1 March 2027 and the new rent applies at the earliest from ${dE(zuFrueh.fruehWirksam)}. Modernisation and service-charge increases do not count for these periods.` },
      { q: 'Does the cap apply even if my rent is far below the rent index?', a: `Yes, especially then. With a reference rent of 12.50 euros per square metre, 72 m² would in theory allow ${eE(ovmHoch.grenzeOvm)}. The cap only allows ${E.kappung_angespannt * 100} or ${E.kappung * 100} per cent on the rent of three years earlier, here ${eE(ovmHoch.grenzeKappung)} or ${eE(zwanzig.grenzeKappung)}. Long-standing tenants with low rents are protected from big jumps this way.` },
      { q: 'Can I give notice after a rent increase?', a: 'Yes, with a special right of termination. After an increase to the reference rent you may give notice until the end of the second month after the letter arrived, effective at the end of the month after next; the increase then does not take effect. This is in Section 561 of the Civil Code and also applies after a modernisation increase.' },
      { q: 'What must a valid rent increase letter contain?', a: 'The new rent in euros, a statement that your consent is requested, and a justification, for example the rent index, an expert opinion or three comparable flats. If a qualified index has figures for the flat, the landlord must always quote them. Text form is enough; no signature is needed, but the sender must be identifiable.' },
    ],
    body: (h) => `
<h2>Three routes to a higher rent</h2>
<p><strong>Up to the reference rent</strong> (${h.src('bgb558', 'Section 558 BGB')}): the landlord asks you to agree to a new rent, justified with the rent index or another method. Without consent he must sue. <strong>After a modernisation</strong> (${h.src('bgb559', 'Section 559 BGB')}): he declares an increase of eight per cent of the costs a year, capped at three euros per square metre over six years; the ${h.a('modernisierungsankuendigung', 'modernisation')} page explains it. <strong>For service charges</strong> (${h.src('bgb560', 'Section 560 BGB')}): he adjusts advance payments after a statement or passes on increases in a flat rate. There are also contractual routes: with a ${h.a('staffelmiete', 'graduated rent')} the increases are in the lease, with an ${h.a('indexmiete', 'index-linked rent')} they follow the consumer price index; both exclude increases under Section 558.</p>
<h2>The three limits compared</h2>
${h.table(['Case (72 m², now €690, three years ago €640)', 'reference-rent limit', 'cap limit', 'lawful'], [
  ['reference rent €12.50/m², 15% cap, €900 demanded', h.eur(ovmHoch.grenzeOvm, 2), h.eur(ovmHoch.grenzeKappung, 2), h.eur(ovmHoch.zulaessig, 2)],
  ['reference rent €12.50/m², 20% cap, €900 demanded', h.eur(zwanzig.grenzeOvm, 2), h.eur(zwanzig.grenzeKappung, 2), h.eur(zwanzig.zulaessig, 2)],
  ['reference rent €10.00/m², 15% cap, €780 demanded', h.eur(ovmNied.grenzeOvm, 2), h.eur(ovmNied.grenzeKappung, 2), h.eur(ovmNied.zulaessig, 2)],
], 'Rent increase under Section 558 BGB, letter received on 14 October 2026', ['l', 'r', 'r', 'r'])}
<p>In the first case the cap brakes the increase, in the third the reference rent: the lower of the two limits always applies. Which cap applies in your municipality is worked out by the ${h.a('mieterhoehung-rechner', 'rent increase calculator')} from your state's ordinance; the list of states is on the ${h.a('kappungsgrenze', 'increase cap')} page.</p>
<h2>The deadlines</h2>
<ul>
<li><strong>Waiting period:</strong> the demand may come no earlier than ${E.wartefrist_monate} months after the last increase. A letter sent too early is invalid and must be sent again.</li>
<li><strong>Lock-in period:</strong> the new rent may only take effect once the old one has applied for ${E.sperrfrist_monate} months.</li>
<li><strong>Consent period:</strong> until the end of the second calendar month after receipt (${h.src('bgb558b', 'Section 558b(2) BGB')}).</li>
<li><strong>Effect:</strong> from the start of the third calendar month after receipt.</li>
<li><strong>Time to sue:</strong> three more months after the consent period; after that the landlord must make a new demand.</li>
</ul>
<p>A letter arriving on 14 October 2026 can be answered until ${h.date(ovmHoch.zustimmungBis)}; the new rent applies from ${h.date(ovmHoch.wirksam)}, and the time to sue ends on ${h.date(ovmHoch.klageBis)}. If the same letter arrives only seven months after the last increase, it is too early: the new rent could apply at the earliest from ${h.date(zuFrueh.fruehWirksam)}.</p>
<h2>How to check the letter</h2>
<ol>
<li>Is it in text form, with an identifiable sender and the new rent in euros?</li>
<li>Is it justified, and does it quote a qualified index where one exists (${h.src('bgb558a', 'Section 558a(3)')})?</li>
<li>Are the floor area, year built, location and fittings the landlord uses correct? A wrong location or area shifts the reference rent. The ${h.a('vergleichsmiete', 'reference rent')} page lists the common mistakes.</li>
<li>Does the new rent respect your municipality's cap, counted on the rent three years earlier without modernisation and service-charge increases?</li>
<li>Are the waiting and lock-in periods respected?</li>
</ol>
<p>If any check fails, agree only to the lawful part or not at all. If you are unsure about the reference rent, a tenants' association (Mieterverein) can compare the letter with the rent index.</p>
<h2>Agree, refuse or give notice</h2>
<p>You have three options. Agree in full if every check passes; you then owe the new rent from the third month. Agree in part if the rent demanded exceeds a limit; you then owe the lawful amount, and a court would have to decide on the rest. Or give notice under the special right in Section 561 of the Civil Code if you do not want to pay the higher rent; the increase then does not take effect. If you agree, do so in writing and state the amount expressly, so there is no later dispute about its scope. Agreeing subject to a later check is not valid consent: either you agree to a specific amount or you do not.</p>
<h2>Increases under Section 558 and the rent brake</h2>
<p>The rent brake only concerns the rent at the start of the lease. A starting rent above the ceiling at the time does not become lawful through a later increase; the refund claim after a complaint remains. And as long as the rent is already above the reference rent, an increase under Section 558 is not possible anyway.</p>
`,
  },
});
