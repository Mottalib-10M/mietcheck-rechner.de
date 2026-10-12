import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { mieterhoehung } from '../../lib/engine/miete';
import { hamburgOvm } from '../../lib/engine/hamburg';
import { formatMoney, displayDate } from '../../lib/format';

const E = P.erhoehung;
// Exemple : Hamburg, normale Lage, Baujahr 1972, 70 m², Miete 680 €, vor drei Jahren 620 €, verlangt 820 €.
const hh = hamburgOvm({ lage: 'normal', baujahr: 1972, flaeche: 70 });
const ovm = hh.ok ? hh.ovm : 0;
const r = mieterhoehung({ miete: 680, mieteVor3: 620, flaeche: 70, ovm, kappung: E.kappung_angespannt, verlangt: 820, zugang: '2026-10-14', letzteAenderung: '2024-06-01' });
const frueh = mieterhoehung({ miete: 680, flaeche: 70, ovm, kappung: E.kappung_angespannt, verlangt: 760, zugang: '2026-10-14', letzteAenderung: '2026-01-01' });
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mieterhoehung-rechner',
  group: 'rechner',
  order: 20,
  tool: 'erhoehung',
  related: ['mieterhoehung', 'kappungsgrenze', 'vergleichsmiete', 'mietspiegel-hamburg', 'modernisierung-rechner', 'indexmiete-rechner'],
  sources: ['bgb558', 'bgb558a', 'bgb558b', 'hamburgMs'],
  de: {
    slug: 'mieterhoehung-rechner',
    nav: 'Mieterhöhung-Rechner',
    card: 'Zulässige neue Miete, Zustimmungsfrist und frühester Termin.',
    title: 'Mieterhöhung-Rechner 2026: zulässige Miete und Fristen',
    description: 'Mieterhöhung-Rechner 2026: neue Miete nach Vergleichsmiete und Kappungsgrenze Ihrer Gemeinde, Sperrfrist von 15 Monaten, Zustimmungsfrist und Teilzustimmung.',
    h1: 'Mieterhöhung-Rechner: Wie viel mehr müssen Sie zahlen?',
    intro: 'Schreiben des Vermieters zur Hand nehmen: bisherige Miete, verlangte Miete und Zugangsdatum genügen für die erste Prüfung.',
    resume: `Ein Vermieter kann bei laufendem Vertrag nach § 558 BGB die Zustimmung zu einer höheren Miete verlangen, aber nur bis zur ortsüblichen Vergleichsmiete und nur innerhalb der Kappungsgrenze: höchstens ${E.kappung * 100} Prozent mehr als vor drei Jahren, in Gemeinden mit Kappungsgrenzenverordnung ${E.kappung_angespannt * 100} Prozent. Erhöhungen nach Modernisierung und bei den Betriebskosten zählen dabei nicht mit. Zusätzlich muss die Miete beim Wirksamwerden seit ${E.sperrfrist_monate} Monaten unverändert sein. Der Rechner nimmt die Kappungsgrenze aus der Verordnung Ihres Landes und berechnet die Vergleichsmiete für Berlin, Hamburg und Dortmund selbst. Beispiel aus Hamburg: Wohnung von 1972 mit 70 m² in normaler Lage, Mittelwert des Mietenspiegels ${eD(ovm)} je Quadratmeter. Bei ${eD(680, 0)} Miete, ${eD(620, 0)} vor drei Jahren und verlangten ${eD(820, 0)} sind höchstens ${eD(r.zulaessig)} zulässig, denn die Kappungsgrenze erlaubt nur ${eD(r.grenzeKappung)}. Zustimmen müssen Sie bis zum ${dD(r.zustimmungBis)}, die neue Miete gilt ab ${dD(r.wirksam)}.`,
    faqs: [
      { q: 'Muss ich einer Mieterhöhung zustimmen, wenn sie zu hoch ist?', a: `Nur soweit sie zulässig ist. Sie können teilweise zustimmen, nämlich bis zu dem Betrag, den Vergleichsmiete und Kappungsgrenze erlauben, und den Rest ablehnen. Im Hamburger Beispiel stimmen Sie ${eD(r.zulaessig)} zu und lehnen ${eD(r.ueberMonat)} ab. Für den abgelehnten Teil müsste der Vermieter innerhalb von drei Monaten nach Ablauf der Zustimmungsfrist klagen.` },
      { q: 'Was passiert, wenn das Erhöhungsschreiben zu früh kommt?', a: `Ein Verlangen, das weniger als ${E.wartefrist_monate} Monate nach der letzten Erhöhung kommt, ist unwirksam; Sie müssen ihm nicht zustimmen. Wurde die Miete zum 1. Januar 2026 erhöht, wäre frühestens ein Schreiben ab dem 1. Januar 2027 zulässig, und die neue Miete gälte frühestens ab ${dD(frueh.fruehWirksam)}. Der Rechner zeigt diesen Termin an.` },
      { q: 'Welche Miete von vor drei Jahren zählt für die Kappungsgrenze?', a: 'Die Nettokaltmiete, die drei Jahre vor dem Wirksamwerden der neuen Miete galt, ohne Erhöhungen wegen Modernisierung (§§ 559 ff. BGB) und ohne Änderungen bei den Betriebskosten (§ 560 BGB). Lassen Sie das Feld leer, rechnet der Rechner mit der heutigen Miete; das ist richtig, wenn die Miete in den drei Jahren nicht erhöht wurde.' },
      { q: 'Reicht ein Erhöhungsschreiben per E-Mail?', a: 'Ja. § 558a BGB verlangt Textform, nicht Schriftform: ein Brief ohne Unterschrift, eine E-Mail oder ein Schreiben im Mieterportal genügen, wenn der Vermieter erkennbar ist. Das Schreiben muss aber begründet sein, etwa mit dem Mietspiegel, einem Gutachten, einer Mietdatenbank oder drei Vergleichswohnungen.' },
    ],
    body: (h) => `
<h2>Was der Rechner prüft</h2>
<p>Er geht die Voraussetzungen von ${h.src('bgb558', '§ 558 BGB')} der Reihe nach durch. Zuerst die Höhe: Die neue Miete darf die ortsübliche Vergleichsmiete nicht übersteigen und höchstens um die Kappungsgrenze über der Miete von vor drei Jahren liegen. Welche Grenze in Ihrer Gemeinde gilt, liest er aus der Kappungsgrenzenverordnung Ihres Landes, mit dem Tag, an dem Ihr Schreiben angekommen ist. Dann die Zeit: Das Verlangen darf frühestens ${E.wartefrist_monate} Monate nach der letzten Erhöhung kommen, und die neue Miete wird frühestens wirksam, wenn die alte ${E.sperrfrist_monate} Monate gegolten hat.</p>
<p>Zuletzt die Fristen aus ${h.src('bgb558b', '§ 558b BGB')}: Sie haben bis zum Ende des zweiten Kalendermonats nach Zugang Zeit, und die erhöhte Miete schulden Sie ab Beginn des dritten Monats. Stimmen Sie nicht zu, kann der Vermieter innerhalb von drei weiteren Monaten auf Zustimmung klagen; danach ist sein Verlangen erledigt.</p>
<h2>Das Hamburger Beispiel</h2>
${h.table(['Prüfschritt', 'Betrag'], [
  ['Vergleichsmiete Mietenspiegel 2025, Feld ' + (hh.ok ? hh.feld.feld : ''), h.eur(ovm, 2) + ' je m²'],
  ['Grenze Vergleichsmiete für 70 m²', h.eur(r.grenzeOvm, 2)],
  [`Grenze Kappung: ${h.eur(620, 0)} plus ${E.kappung_angespannt * 100} Prozent`, h.eur(r.grenzeKappung, 2)],
  ['verlangt', h.eur(820, 2)],
  ['zulässig', h.eur(r.zulaessig, 2)],
  ['zustimmen bis', h.date(r.zustimmungBis)],
  ['neue Miete ab', h.date(r.wirksam)],
], 'Mieterhöhung für eine Hamburger Wohnung, Schreiben erhalten am 14. Oktober 2026', ['l', 'r'])}
<p>Hamburg hat die Kappungsgrenze für das ganze Stadtgebiet auf 15 Prozent gesenkt; in einer Gemeinde ohne Verordnung wären es 20 Prozent gewesen, und dann hätte hier die Vergleichsmiete die Grenze gezogen. Den Hintergrund erklären die Seiten zur ${h.a('kappungsgrenze', 'Kappungsgrenze')} und zur ${h.a('mieterhoehung', 'Mieterhöhung')}. Für eine Erhöhung nach Modernisierung gilt ein eigenes Verfahren, das der ${h.a('modernisierung-rechner', 'Modernisierungsrechner')} abbildet; bei einer ${h.a('indexmiete', 'Indexmiete')} ist eine Erhöhung nach § 558 ganz ausgeschlossen.</p>
`,
  },
  en: {
    slug: 'rent-increase-calculator',
    nav: 'Rent increase calculator',
    card: 'Lawful new rent, consent deadline and earliest date.',
    title: 'Rent Increase Calculator Germany 2026: Limit and Deadlines',
    description: 'Rent increase calculator for Germany 2026: new rent under the reference rent and your local cap, the 15-month wait, the consent deadline and partial consent.',
    h1: 'Rent increase calculator: how much more do you have to pay?',
    intro: 'Have the landlord’s letter at hand: current rent, rent demanded and the date it arrived are enough for a first check.',
    resume: `During a tenancy a German landlord may ask you to agree to a higher rent under Section 558 of the Civil Code (BGB), but only up to the local reference rent (ortsübliche Vergleichsmiete) and only within the increase cap (Kappungsgrenze): at most ${E.kappung * 100} per cent above the rent of three years earlier, or ${E.kappung_angespannt * 100} per cent where the state has lowered the cap. Increases after modernisation and changes in service charges are left out of that count. On top of that, the rent must have stayed unchanged for ${E.sperrfrist_monate} months when the increase takes effect. The calculator takes the cap from your state's ordinance and works out the reference rent itself for Berlin, Hamburg and Dortmund. A Hamburg example: a 1972 flat of 70 m² in a normal location, index median ${eE(ovm)} per square metre. With rent of ${eE(680, 0)}, ${eE(620, 0)} three years ago and ${eE(820, 0)} demanded, at most ${eE(r.zulaessig)} is lawful, because the cap only allows ${eE(r.grenzeKappung)}. You have until ${dE(r.zustimmungBis)} to agree; the new rent applies from ${dE(r.wirksam)}.`,
    faqs: [
      { q: 'Do I have to agree to a rent increase that is too high?', a: `Only as far as it is lawful. You can agree in part, up to what the reference rent and the cap allow, and refuse the rest. In the Hamburg example you agree to ${eE(r.zulaessig)} and refuse ${eE(r.ueberMonat)}. For the refused part, the landlord would have to sue within three months after the consent deadline.` },
      { q: 'What if the increase letter comes too early?', a: `A demand that arrives less than ${E.wartefrist_monate} months after the last increase is invalid, and you need not agree. If the rent went up on 1 January 2026, a letter would be valid from 1 January 2027 at the earliest, and the new rent would apply from ${dE(frueh.fruehWirksam)} at the earliest. The calculator shows this date.` },
      { q: 'Which rent from three years ago counts for the cap?', a: 'The net cold rent in force three years before the new rent takes effect, leaving out increases for modernisation (Sections 559 ff. BGB) and service-charge changes (Section 560 BGB). If you leave the field empty, the calculator uses today’s rent, which is right when the rent has not risen in those three years.' },
      { q: 'Is an increase by e-mail valid?', a: 'Yes. Section 558a BGB requires text form, not a signed letter: an unsigned letter, an e-mail or a message in a tenant portal will do, as long as the landlord is identifiable. The demand must be justified, though, for example by the rent index, an expert opinion, a rent database or three comparable flats.' },
    ],
    body: (h) => `
<h2>What the calculator checks</h2>
<p>It works through the conditions of ${h.src('bgb558', 'Section 558 BGB')} in order. First the amount: the new rent may not exceed the local reference rent nor rise by more than the cap above the rent of three years earlier. Which cap applies in your municipality comes from your state's cap ordinance, checked for the day your letter arrived. Then timing: a demand may come no earlier than ${E.wartefrist_monate} months after the last increase, and the new rent takes effect only once the old one has applied for ${E.sperrfrist_monate} months.</p>
<p>Last, the deadlines in ${h.src('bgb558b', 'Section 558b BGB')}: you have until the end of the second calendar month after receipt, and you owe the higher rent from the start of the third. If you do not agree, the landlord can sue for consent within three more months; after that his demand lapses.</p>
<h2>The Hamburg example</h2>
${h.table(['Check', 'Amount'], [
  ['Reference rent, Hamburg index 2025, field ' + (hh.ok ? hh.feld.feld : ''), h.eur(ovm, 2) + ' per m²'],
  ['Reference-rent limit for 70 m²', h.eur(r.grenzeOvm, 2)],
  [`Cap limit: ${h.eur(620, 0)} plus ${E.kappung_angespannt * 100} per cent`, h.eur(r.grenzeKappung, 2)],
  ['demanded', h.eur(820, 2)],
  ['lawful', h.eur(r.zulaessig, 2)],
  ['agree by', h.date(r.zustimmungBis)],
  ['new rent from', h.date(r.wirksam)],
], 'Rent increase for a Hamburg flat, letter received on 14 October 2026', ['l', 'r'])}
<p>Hamburg has lowered the cap to 15 per cent across the city; in a municipality without an ordinance it would be 20 per cent, and here the reference rent would then have set the limit. The pages on the ${h.a('kappungsgrenze', 'increase cap')} and on ${h.a('mieterhoehung', 'rent increases')} explain the background. An increase after modernisation follows its own procedure, covered by the ${h.a('modernisierung-rechner', 'modernisation calculator')}; with an ${h.a('indexmiete', 'index-linked rent')} an increase under Section 558 is ruled out altogether.</p>
`,
  },
});
