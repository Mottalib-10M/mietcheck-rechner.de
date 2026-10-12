import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { indexmiete, vpiMonate, VPI } from '../../lib/engine/miete';
import { formatMoney, formatNumber, formatPercent, displayDate } from '../../lib/format';

const last = vpiMonate[vpiMonate.length - 1];
const [ly, lm] = last.split('-').map(Number);
const yearAgo = `${ly - 1}-${String(lm).padStart(2, '0')}`;
const r = indexmiete({ miete: 900, von: yearAgo, bis: last, zugang: '2026-10-15' });
const lang = indexmiete({ miete: 900, von: '2022-01', bis: last });
const MON = { de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'], en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
const mon = (m: string, l: 'de' | 'en') => { const [y, mo] = m.split('-').map(Number); return `${MON[l][mo - 1]} ${y}`; };
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const nD = (x: number) => formatNumber(x, 1, 'de'), nE = (x: number) => formatNumber(x, 1, 'en');
const pD = (x: number) => formatPercent(x, 2, 'de'), pE = (x: number) => formatPercent(x, 2, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');
const recent = [...vpiMonate].slice(-6).reverse();

export default defineGuide({
  id: 'indexmiete-rechner',
  group: 'rechner',
  order: 40,
  tool: 'index',
  related: ['indexmiete', 'staffelmiete', 'mieterhoehung-rechner', 'mietpreisbremse', 'vergleichsmiete'],
  sources: ['bgb557b', 'vpi'],
  de: {
    slug: 'indexmiete-rechner',
    nav: 'Indexmiete-Rechner',
    card: 'Neue Miete mit dem amtlichen Verbraucherpreisindex.',
    title: 'Indexmiete-Rechner 2026: neue Miete mit dem amtlichen VPI',
    description: `Indexmiete-Rechner 2026: neue Miete nach § 557b BGB mit dem Verbraucherpreisindex des Statistischen Bundesamts bis ${mon(last, 'de')}, Prozentänderung und Fälligkeit.`,
    h1: 'Indexmiete-Rechner: Ist die neue Miete richtig berechnet?',
    intro: 'Zwei Indexstände aus dem Schreiben des Vermieters auswählen; der Rechner prüft die neue Miete und das Datum, ab dem sie gilt.',
    resume: `Bei einer Indexmiete ändert sich die Nettokaltmiete im gleichen Verhältnis wie der Verbraucherpreisindex für Deutschland, den das Statistische Bundesamt jeden Monat veröffentlicht (§ 557b BGB). Gerechnet wird mit dem Indexstand bei der letzten Anpassung und dem neuen Indexstand: neue Miete gleich alte Miete mal neuer Stand geteilt durch alten Stand. Zwischen zwei Anpassungen muss mindestens ein Jahr liegen, und die neue Miete ist erst ab dem übernächsten Monat nach Zugang der Erklärung zu zahlen. Der Rechner enthält alle Monatswerte auf der Basis 2020 = 100 von ${mon(vpiMonate[0], 'de')} bis ${mon(last, 'de')}. Beispiel: ${eD(900, 0)} Miete, Index im ${mon(yearAgo, 'de')} ${nD(r.vpiVon)}, im ${mon(last, 'de')} ${nD(r.vpiBis)}. Das ist ein Anstieg um ${pD(r.aenderung)}, die neue Miete beträgt ${eD(r.neu)}. Geht die Erklärung am 15. Oktober 2026 zu, gilt sie ab dem ${dD(r.wirksam!)}. Sinkt der Index, kann auch der Mieter eine Senkung verlangen.`,
    faqs: [
      { q: 'Welchen Index darf der Vermieter für die Indexmiete nehmen?', a: 'Nur den vom Statistischen Bundesamt ermittelten Preisindex für die Lebenshaltung aller privaten Haushalte in Deutschland, also den Verbraucherpreisindex (VPI). Ein regionaler Index, ein Baukostenindex oder eine feste Prozentzahl erfüllen § 557b BGB nicht. Der Rechner verwendet die aktuelle Reihe mit dem Basisjahr 2020 = 100, wie das Statistische Bundesamt sie veröffentlicht; auf diese Reihe stützen sich Vermieter heute in ihren Erklärungen.' },
      { q: 'Muss der Vermieter die Indexstände im Schreiben nennen?', a: 'Ja. Die Erklärung in Textform muss die eingetretene Änderung des Index angeben, also beide Indexstände oder die Veränderung, und die neue Miete oder die Erhöhung in Euro. Fehlt eine dieser Angaben, ist die Erklärung unwirksam, und die alte Miete gilt weiter, bis eine vollständige Erklärung zugeht.' },
      { q: `Um wie viel ist der Index seit Januar 2022 gestiegen?`, a: `Von ${nD(VPI['2022-01'])} im Januar 2022 auf ${nD(VPI[last])} im ${mon(last, 'de')}, also um ${pD(lang.aenderung)}. Eine Miete von ${eD(900, 0)} aus dem Januar 2022 läge nach voller Anpassung heute bei ${eD(lang.neu)}. Weil zwischen zwei Anpassungen ein Jahr liegen muss, kann der Vermieter diesen Anstieg aber nicht rückwirkend, sondern nur für die Zukunft geltend machen.` },
    ],
    body: (h) => `
<h2>So rechnet der Rechner</h2>
<p>Er nimmt den Indexstand des Monats, mit dem die Miete zuletzt angepasst oder vereinbart wurde, und den Indexstand, auf den sich der Vermieter jetzt beruft, beide aus der ${h.src('vpi', 'Tabelle des Statistischen Bundesamts')}. Die neue Miete ist die alte Miete mal dem Verhältnis der beiden Werte, auf den Cent gerundet. Das Datum, ab dem sie zu zahlen ist, folgt aus ${h.src('bgb557b', '§ 557b Abs. 3 BGB')}: Beginn des übernächsten Monats nach Zugang der Erklärung. Ob seit der letzten Anpassung ein Jahr vergangen ist, prüfen Sie selbst am Datum der letzten Änderung; Erhöhungen nach Modernisierung und Änderungen der Betriebskosten zählen dabei nicht.</p>
<h2>Die letzten Indexstände</h2>
${h.table(['Monat', 'VPI 2020 = 100', 'Veränderung zum Vorjahresmonat'], recent.map((m) => { const [y, mo] = m.split('-').map(Number); const v = VPI[`${y - 1}-${String(mo).padStart(2, '0')}`]; return [mon(m, 'de'), h.num(VPI[m], 1), v ? h.pct(VPI[m] / v - 1, 1) : '–']; }), `Verbraucherpreisindex für Deutschland, Statistisches Bundesamt, Stand ${h.date(P.vpi.stand)}`, ['l', 'r', 'r'])}
<p>Neben der Indexanpassung ist bei einer Indexmiete eine Erhöhung bis zur Vergleichsmiete ausgeschlossen, eine Erhöhung nach Modernisierung nur in engen Fällen möglich. Die Mietpreisbremse gilt nur für die Ausgangsmiete. Mehr dazu auf der Seite ${h.a('indexmiete', 'Indexmiete')}; den Vergleich mit einer festen Staffel zeigt die Seite zur ${h.a('staffelmiete', 'Staffelmiete')}.</p>
`,
  },
  en: {
    slug: 'index-linked-rent-calculator',
    nav: 'Index rent calculator',
    card: 'New rent with the official consumer price index.',
    title: 'Index Rent Calculator Germany 2026: New Rent with the CPI',
    description: `Index-linked rent calculator 2026: new rent under Section 557b BGB with the official consumer price index up to ${mon(last, 'en')}, the change and the due date.`,
    h1: 'Index rent calculator: is the new rent worked out correctly?',
    intro: 'Pick the two index values from your landlord’s letter; the calculator checks the new rent and the date it applies from.',
    resume: `With an index-linked rent (Indexmiete) the net cold rent moves in line with Germany's consumer price index, which the Federal Statistical Office (Destatis) publishes every month (Section 557b of the Civil Code). The calculation uses the index at the last adjustment and the new index: new rent equals old rent times the new value divided by the old value. At least a year must pass between two adjustments, and the new rent is only payable from the start of the month after next once the notice has reached you. The calculator holds every monthly value on the 2020 = 100 base from ${mon(vpiMonate[0], 'en')} to ${mon(last, 'en')}. Example: rent of ${eE(900, 0)}, index ${nE(r.vpiVon)} in ${mon(yearAgo, 'en')} and ${nE(r.vpiBis)} in ${mon(last, 'en')}. That is a rise of ${pE(r.aenderung)}, so the new rent is ${eE(r.neu)}. If the notice arrives on 15 October 2026, it applies from ${dE(r.wirksam!)}. If the index falls, the tenant may ask for a reduction.`,
    faqs: [
      { q: 'Which index may the landlord use for an index-linked rent?', a: 'Only the price index for the cost of living of all private households in Germany published by the Federal Statistical Office, the consumer price index (VPI). A regional index, a construction-cost index or a fixed percentage does not meet Section 557b BGB. The calculator uses the current series with base year 2020 = 100 as the Federal Statistical Office publishes it, the series landlords now quote in their notices.' },
      { q: 'Must the landlord state the index values in his notice?', a: 'Yes. The notice in text form must state the change in the index, either both values or the change, and the new rent or the increase in euros. If one of these is missing, the notice is invalid and the old rent continues until a complete notice arrives.' },
      { q: 'How much has the index risen since January 2022?', a: `From ${nE(VPI['2022-01'])} in January 2022 to ${nE(VPI[last])} in ${mon(last, 'en')}, a rise of ${pE(lang.aenderung)}. A rent of ${eE(900, 0)} set in January 2022 would be ${eE(lang.neu)} after a full adjustment. Because a year must pass between adjustments, the landlord can only claim this rise for the future, never backdated.` },
    ],
    body: (h) => `
<h2>How the calculator works</h2>
<p>It takes the index for the month the rent was last adjusted or agreed, and the index the landlord now relies on, both from the ${h.src('vpi', 'Federal Statistical Office table')}. The new rent is the old rent times the ratio of the two values, rounded to the cent. The date it becomes payable follows from ${h.src('bgb557b', 'Section 557b(3) BGB')}: the start of the month after next once the notice has arrived. Whether a year has passed since the last adjustment you can check against the date of the last change; modernisation increases and service-charge changes do not count.</p>
<h2>The latest index values</h2>
${h.table(['Month', 'CPI 2020 = 100', 'Change on the same month a year earlier'], recent.map((m) => { const [y, mo] = m.split('-').map(Number); const v = VPI[`${y - 1}-${String(mo).padStart(2, '0')}`]; return [mon(m, 'en'), h.num(VPI[m], 1), v ? h.pct(VPI[m] / v - 1, 1) : '–']; }), `Consumer price index for Germany, Federal Statistical Office, as of ${h.date(P.vpi.stand)}`, ['l', 'r', 'r'])}
<p>With an index-linked rent, an increase up to the reference rent is ruled out, and a modernisation increase is only possible in narrow cases. The rent brake applies only to the starting rent. More on the ${h.a('indexmiete', 'index-linked rent')} page; the comparison with fixed steps is on the ${h.a('staffelmiete', 'graduated rent')} page.</p>
`,
  },
});
