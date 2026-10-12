import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { modernisierung } from '../../lib/engine/miete';
import { formatMoney } from '../../lib/format';

const M = P.modernisierung;
// Valeurs par défaut : 18 000 € dont 3 000 € d'entretien, 70 m², 700 € ; variantes plafonnée, simplifiée, chauffage.
const r = modernisierung({ kosten: 18000, erhaltung: 3000, flaeche: 70, miete: 700 });
const kap = modernisierung({ kosten: 45000, erhaltung: 5000, flaeche: 70, miete: 700 });
const nied = modernisierung({ kosten: 45000, erhaltung: 5000, flaeche: 70, miete: 420 });
const vf = modernisierung({ kosten: 9000, flaeche: 70, miete: 700, vereinfacht: true });
const hz = modernisierung({ kosten: 24000, drittmittel: 7000, flaeche: 70, miete: 700, heizung559e: true });
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');

export default defineGuide({
  id: 'modernisierung-rechner',
  group: 'rechner',
  order: 80,
  tool: 'modernisierung',
  related: ['modernisierungsankuendigung', 'mieterhoehung-rechner', 'mietpreisbremse-rechner', 'co2-kosten-rechner'],
  sources: ['bgb559', 'bgb559b', 'bgb559c', 'bgb559e'],
  de: {
    slug: 'modernisierungsumlage-rechner',
    nav: 'Modernisierungsumlage',
    card: 'Erhöhung nach Modernisierung mit Kappung in sechs Jahren.',
    title: 'Modernisierungsumlage-Rechner 2026: Erhöhung und Kappung',
    description: 'Modernisierungsumlage 2026: acht Prozent der Kosten nach § 559 BGB, Abzug für Erhaltung, Kappung 3 oder 2 Euro je m² in sechs Jahren und neue Heizung.',
    h1: 'Modernisierungsumlage: Wie viel mehr Miete nach dem Umbau?',
    intro: 'Kosten aus der Mieterhöhungserklärung eintragen; der Rechner zieht Erhaltung und Zuschüsse ab und wendet die Kappungsgrenze an.',
    resume: `Nach einer Modernisierung darf der Vermieter die jährliche Miete um ${M.umlage * 100} Prozent der für Ihre Wohnung aufgewendeten Kosten erhöhen (§ 559 BGB). Kosten, die ohnehin für Instandhaltung angefallen wären, gehören nicht dazu, ebenso wenig Zuschüsse aus öffentlichen Mitteln. Innerhalb von sechs Jahren darf die Miete durch Modernisierungen höchstens um ${eD(M.kappung_m2, 0)} je Quadratmeter steigen, bei einer Miete unter ${eD(M.niedrig_unter_m2, 0)} je Quadratmeter höchstens um ${eD(M.kappung_m2_niedrig, 0)}. Beispiel: ${eD(18000, 0)} Kosten für Ihre Wohnung, davon ${eD(3000, 0)} ersparte Erhaltung, ergeben ${eD(r.jahr)} im Jahr, also ${eD(r.monat)} im Monat mehr; die Miete steigt von ${eD(700, 0)} auf ${eD(r.neueMiete)}. Bei Kosten bis ${eD(M.vereinfacht_bis, 0)} kann der Vermieter das vereinfachte Verfahren mit ${M.vereinfacht_pauschale * 100} Prozent Pauschale für Erhaltung wählen. Für eine geförderte neue Heizung gelten zehn Prozent und höchstens ${eD(M.heizung_kappung_m2)} je Quadratmeter (§ 559e BGB). Die erhöhte Miete ist ab Beginn des dritten Monats nach Zugang der Erklärung zu zahlen.`,
    faqs: [
      { q: 'Wie wirkt die Kappungsgrenze bei einer teuren Modernisierung?', a: `Sie begrenzt die Erhöhung, egal wie hoch die Kosten sind. Bei ${eD(45000, 0)} Kosten und ${eD(5000, 0)} Erhaltungsanteil ergäben acht Prozent ${eD(kap.monatRoh)} im Monat; für 70 m² sind aber nur ${eD(kap.monat)} zulässig, drei Euro je Quadratmeter. Liegt die Miete vorher unter sieben Euro je Quadratmeter, sind es höchstens ${eD(nied.monat)}. Frühere Erhöhungen der letzten sechs Jahre werden angerechnet.` },
      { q: 'Was bedeutet das vereinfachte Verfahren für mich als Mieter?', a: `Bis ${eD(M.vereinfacht_bis, 0)} Kosten darf der Vermieter pauschal ${M.vereinfacht_pauschale * 100} Prozent für Erhaltung abziehen, statt sie einzeln zu schätzen. Bei ${eD(9000, 0)} Kosten steigt die Miete so um ${eD(vf.monat)} im Monat. Dafür sind Härteeinwände gegen die Erhöhung weitgehend ausgeschlossen, und weitere Erhöhungen nach § 559 sind für fünf Jahre weitgehend ausgeschlossen.` },
      { q: 'Wie wird eine neue Heizung mit Förderung umgelegt?', a: `Nach § 559e BGB mit zehn Prozent der Kosten abzüglich der Fördermittel, wobei pauschal 15 Prozent als Erhaltung abgehen. Bei ${eD(24000, 0)} Kosten und ${eD(7000, 0)} Förderung ergäben sich ${eD(hz.monatRoh)} im Monat, gedeckelt auf ${eD(M.heizung_kappung_m2)} je Quadratmeter, für 70 m² also ${eD(hz.monat)}. Wird keine Förderung gewährt, obwohl sie dem Grunde nach möglich wäre, gilt die normale Umlage von acht Prozent.` },
    ],
    body: (h) => `
<h2>Die Rechnung Schritt für Schritt</h2>
<p>Der Rechner folgt ${h.src('bgb559', '§ 559 BGB')}. Von den Kosten, die auf Ihre Wohnung entfallen, zieht er die ersparten Erhaltungskosten und die Drittmittel ab. Auf den Rest wendet er acht Prozent im Jahr an und teilt durch zwölf. Danach prüft er die Kappungsgrenze von Absatz 3a: höchstens ${h.eur(M.kappung_m2, 0)} je Quadratmeter in sechs Jahren, ${h.eur(M.kappung_m2_niedrig, 0)}, wenn die Miete vorher unter ${h.eur(M.niedrig_unter_m2, 0)} lag. Haben Sie in den letzten sechs Jahren schon eine Modernisierungserhöhung bekommen, tragen Sie sie im letzten Feld ein; sie wird angerechnet.</p>
${h.table(['Fall', 'Basis', 'pro Monat', 'neue Miete'], [
  ['Standard: 18.000 € minus 3.000 € Erhaltung', h.eur(r.basis, 0), h.eur(r.monat, 2), h.eur(r.neueMiete, 2)],
  ['teuer: 45.000 € minus 5.000 €, Kappung 3 €/m²', h.eur(kap.basis, 0), h.eur(kap.monat, 2), h.eur(kap.neueMiete, 2)],
  ['dieselbe Maßnahme, Miete vorher 6 €/m²', h.eur(nied.basis, 0), h.eur(nied.monat, 2), h.eur(nied.neueMiete, 2)],
  ['vereinfacht: 9.000 €, 30 % Pauschale', h.eur(vf.basis, 0), h.eur(vf.monat, 2), h.eur(vf.neueMiete, 2)],
  ['Heizung § 559e: 24.000 € minus 7.000 € Förderung', h.eur(hz.basis, 0), h.eur(hz.monat, 2), h.eur(hz.neueMiete, 2)],
], 'Modernisierungsumlage für eine Wohnung mit 70 m²', ['l', 'r', 'r', 'r'])}
<h2>Wann die Erhöhung gilt</h2>
<p>Die Erklärung muss in Textform kommen und die Erhöhung anhand der entstandenen Kosten berechnen und erläutern (${h.src('bgb559b', '§ 559b BGB')}). Gezahlt wird ab Beginn des dritten Monats nach Zugang. Die Frist verlängert sich um sechs Monate, wenn die Maßnahme nicht ordnungsgemäß angekündigt wurde oder die tatsächliche Erhöhung die angekündigte um mehr als zehn Prozent übersteigt. Was in der Ankündigung stehen muss und wie Sie einen Härteeinwand erheben, erklärt die Seite zur ${h.a('modernisierungsankuendigung', 'Modernisierungsankündigung')}. Eine Erhöhung bis zur Vergleichsmiete nach § 558 bleibt daneben möglich; die Modernisierungsumlage zählt bei deren ${h.a('kappungsgrenze', 'Kappungsgrenze')} nicht mit.</p>
`,
  },
  en: {
    slug: 'modernisation-rent-increase',
    nav: 'Modernisation increase',
    card: 'Rent increase after modernisation, with the six-year cap.',
    title: 'Modernisation Rent Increase Germany 2026: Calculator and Cap',
    description: 'Modernisation rent increase 2026: eight per cent of costs under Section 559 BGB, repair deduction, cap of 3 or 2 euros per m² over six years, new heating.',
    h1: 'Modernisation increase: how much more rent after the works?',
    intro: 'Enter the costs from the landlord’s notice; the calculator deducts repairs and grants and applies the cap.',
    resume: `After a modernisation a German landlord may raise the annual rent by ${M.umlage * 100} per cent of the costs spent on your flat (Section 559 of the Civil Code). Costs that would have been needed for repairs anyway are excluded, and so are public grants. Within six years, modernisations may raise the rent by at most ${eE(M.kappung_m2, 0)} per square metre, or ${eE(M.kappung_m2_niedrig, 0)} if the rent was below ${eE(M.niedrig_unter_m2, 0)} per square metre. Example: ${eE(18000, 0)} of costs for your flat, of which ${eE(3000, 0)} saved repairs, give ${eE(r.jahr)} a year, so ${eE(r.monat)} more a month; the rent rises from ${eE(700, 0)} to ${eE(r.neueMiete)}. For costs up to ${eE(M.vereinfacht_bis, 0)} the landlord may choose the simplified procedure with a flat ${M.vereinfacht_pauschale * 100} per cent repair deduction. For a subsidised new heating system, ten per cent and at most ${eE(M.heizung_kappung_m2)} per square metre apply (Section 559e). The higher rent is due from the start of the third month after the notice arrives.`,
    faqs: [
      { q: 'How does the cap work on an expensive modernisation?', a: `It limits the increase however high the costs. With ${eE(45000, 0)} of costs and ${eE(5000, 0)} of repairs, eight per cent would give ${eE(kap.monatRoh)} a month; for 70 m² only ${eE(kap.monat)} is allowed, three euros per square metre. If the rent was below seven euros per square metre before, the maximum is ${eE(nied.monat)}. Earlier increases within six years count towards the cap.` },
      { q: 'What does the simplified procedure mean for me as a tenant?', a: `For costs up to ${eE(M.vereinfacht_bis, 0)} the landlord may deduct a flat ${M.vereinfacht_pauschale * 100} per cent for repairs instead of estimating them. With ${eE(9000, 0)} of costs, the rent rises by ${eE(vf.monat)} a month. In return, hardship objections are largely excluded, and further increases under Section 559 are broadly barred for five years.` },
      { q: 'How is a subsidised new heating system passed on?', a: `Under Section 559e BGB at ten per cent of the costs minus the subsidy, with a flat 15 per cent deducted as repairs. With ${eE(24000, 0)} of costs and ${eE(7000, 0)} of subsidy that would be ${eE(hz.monatRoh)} a month, capped at ${eE(M.heizung_kappung_m2)} per square metre, so ${eE(hz.monat)} for 70 m². If no subsidy is granted although one would be available in principle, the normal eight per cent applies.` },
    ],
    body: (h) => `
<h2>The calculation step by step</h2>
<p>The calculator follows ${h.src('bgb559', 'Section 559 BGB')}. From the costs attributed to your flat it deducts the saved repair costs and any third-party funds. It applies eight per cent a year to the rest and divides by twelve. Then it checks the cap in subsection 3a: at most ${h.eur(M.kappung_m2, 0)} per square metre over six years, ${h.eur(M.kappung_m2_niedrig, 0)} if the rent was below ${h.eur(M.niedrig_unter_m2, 0)} before. If you already had a modernisation increase in the last six years, enter it in the last field; it counts towards the cap.</p>
${h.table(['Case', 'Basis', 'per month', 'new rent'], [
  ['standard: €18,000 minus €3,000 repairs', h.eur(r.basis, 0), h.eur(r.monat, 2), h.eur(r.neueMiete, 2)],
  ['expensive: €45,000 minus €5,000, cap €3/m²', h.eur(kap.basis, 0), h.eur(kap.monat, 2), h.eur(kap.neueMiete, 2)],
  ['same works, rent before €6/m²', h.eur(nied.basis, 0), h.eur(nied.monat, 2), h.eur(nied.neueMiete, 2)],
  ['simplified: €9,000, 30% flat deduction', h.eur(vf.basis, 0), h.eur(vf.monat, 2), h.eur(vf.neueMiete, 2)],
  ['heating, Section 559e: €24,000 minus €7,000 subsidy', h.eur(hz.basis, 0), h.eur(hz.monat, 2), h.eur(hz.neueMiete, 2)],
], 'Modernisation increase for a 70 m² flat', ['l', 'r', 'r', 'r'])}
<h2>When the increase applies</h2>
<p>The notice must be in text form and must calculate and explain the increase from the costs incurred (${h.src('bgb559b', 'Section 559b BGB')}). Payment starts at the beginning of the third month after receipt. That date moves back by six months if the works were not properly announced or the actual increase exceeds the announced one by more than ten per cent. What the announcement must contain and how to raise a hardship objection is on the ${h.a('modernisierungsankuendigung', 'modernisation notice')} page. An increase up to the reference rent under Section 558 remains possible alongside; modernisation increases do not count towards its ${h.a('kappungsgrenze', 'increase cap')}.</p>
`,
  },
});
