import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { modernisierung } from '../../lib/engine/miete';
import { addMonths, endOfMonth, firstOfMonthAfter } from '../../lib/engine/dates';
import { formatMoney, formatPercent, displayDate } from '../../lib/format';

const M = P.modernisierung;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');
const pD = (x: number, d = 0) => formatPercent(x, d, 'de'), pE = (x: number, d = 0) => formatPercent(x, d, 'en');
const U555E = 'https://www.gesetze-im-internet.de/bgb/__555e.html';

// Fristen aus dem Gesetzestext (nicht in params-2026.json):
const ANKUENDIGUNG_MONATE = 3; // § 555c Abs. 1 Satz 1: spätestens drei Monate vor Beginn
const FAELLIG_MONAT = 3; // § 559b Abs. 2 Satz 1: mit Beginn des dritten Monats nach Zugang
const VERZOEGERUNG_MONATE = 6; // § 559b Abs. 2 Satz 2: Verlängerung um sechs Monate
const TOLERANZ = 0.1; // § 559 Abs. 5 Satz 2, § 559b Abs. 2 Satz 2 Nr. 2: mehr als 10 Prozent über der angekündigten Erhöhung

/* Beispiel: 70 m², Nettokaltmiete 630 €. Angekündigt: 24 000 € Kosten für die Wohnung, davon 4 000 € Erhaltung.
   Abgerechnet: 27 000 €, Erhaltung unverändert. Ankündigung geht am 20. Oktober 2026 zu. */
const FL = 70, MIETE = 630, KOSTEN_ANK = 24000, KOSTEN_IST = 27000, ERH = 4000;
const ZUGANG = '2026-10-20', KUENDIGUNG = '2026-11-25', ERKLAERUNG = '2027-06-10';
const ank = modernisierung({ kosten: KOSTEN_ANK, erhaltung: ERH, flaeche: FL, miete: MIETE });
const ist = modernisierung({ kosten: KOSTEN_IST, erhaltung: ERH, flaeche: FL, miete: MIETE });
const mehr = ist.monat / ank.monat - 1;
const ueberToleranz = mehr > TOLERANZ;
const beginnFrueh = addMonths(ZUGANG, ANKUENDIGUNG_MONATE);
const haerteBis = endOfMonth(ZUGANG, 1);
const sonderBis = endOfMonth(ZUGANG, 1);
const sonderEnde = endOfMonth(KUENDIGUNG, 2);
const faellig = firstOfMonthAfter(ERKLAERUNG, FAELLIG_MONAT);
const faelligSpaet = firstOfMonthAfter(ERKLAERUNG, FAELLIG_MONAT + VERZOEGERUNG_MONATE);
const verlust = ist.monat * VERZOEGERUNG_MONATE;
// Vereinfachtes Verfahren und neue Heizung zum Vergleich.
const KLEIN = 8000;
const vereinf = modernisierung({ kosten: KLEIN, flaeche: FL, miete: MIETE, vereinfacht: true });
const heiz = modernisierung({ kosten: 30000, drittmittel: 9000, flaeche: FL, miete: MIETE, heizung559e: true });
const tolD = pD(TOLERANZ), tolE = pE(TOLERANZ);
const umlP = Math.round(M.umlage * 100);
const W = ['null', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs'], WE = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];

export default defineGuide({
  id: 'modernisierungsankuendigung',
  group: 'erhoehung',
  order: 100,
  mini: 'modern',
  miniHref: 'modernisierung-rechner',
  related: ['modernisierung-rechner', 'kappungsgrenze', 'indexmiete', 'staffelmiete', 'mieterhoehung', 'mietminderung'],
  sources: ['bgb555b', 'bgb555c', 'bgb555d', 'bgb559', 'bgb559b', 'bgb559c', 'bgb559e'],
  de: {
    slug: 'modernisierungsankuendigung',
    nav: 'Modernisierungsankündigung',
    card: 'Was in der Ankündigung stehen muss und welche Fristen für Sie laufen.',
    title: 'Modernisierungsankündigung 2026: Inhalt, Fristen, Härte',
    description: `Modernisierungsankündigung 2026: drei Monate vorher in Textform, Pflichtangaben, Härteeinwand bis Ende des Folgemonats und Umlage von ${umlP} Prozent der Kosten.`,
    h1: 'Modernisierungsankündigung: Ihre Rechte ab dem ersten Brief',
    intro: 'Mit der Ankündigung beginnt eine kurze Frist für Einwände, und sie legt fest, wie teuer die Modernisierung später werden darf.',
    resume: `Vor einer Modernisierung muss der Vermieter die Maßnahme nach § 555c BGB spätestens ${W[ANKUENDIGUNG_MONATE]} Monate vor Beginn in Textform ankündigen: Art und Umfang in wesentlichen Zügen, voraussichtlicher Beginn und Dauer, die zu erwartende Mieterhöhung und die voraussichtlichen künftigen Betriebskosten. Der Mieter muss die Arbeiten grundsätzlich dulden. Umstände, die für ihn eine Härte bedeuten, muss er bis zum Ende des Monats nach Zugang der Ankündigung in Textform mitteilen (§ 555d Abs. 3). Bis zum selben Tag kann er außerordentlich kündigen. Nach den Arbeiten darf die Jahresmiete um ${pD(M.umlage)} der Kosten steigen, ohne Erhaltungsanteil und gedeckelt auf ${eD(M.kappung_m2, 0)} je m² in ${W[M.kappung_jahre]} Jahren. Beispiel: Ankündigung am ${dD(ZUGANG)}, Arbeiten frühestens ab dem ${dD(beginnFrueh)}, Härteeinwand bis zum ${dD(haerteBis)}. Angekündigt sind ${eD(ank.monat)} im Monat. Rechnet der Vermieter später ${eD(ist.monat)} ab, liegt er ${pD(mehr, 1)} darüber; die Erhöhung wird dann erst sechs Monate später fällig, ab dem ${dD(faelligSpaet)} statt ab dem ${dD(faellig)}.`,
    faqs: [
      { q: 'Wie viel Zeit habe ich, um nach einer Modernisierungsankündigung eine Härte geltend zu machen?', a: `Bis zum Ablauf des Monats, der auf den Zugang der Ankündigung folgt, in Textform. Kommt der Brief am ${dD(ZUGANG)}, endet die Frist am ${dD(haerteBis)}. Sie läuft nur an, wenn die Ankündigung den Anforderungen von § 555c BGB entspricht. Hat der Vermieter nicht auf Form und Frist hingewiesen, sind Sie an beides nicht gebunden; Härtegründe gegen die Mieterhöhung müssen aber spätestens bis zum Beginn der Arbeiten bei ihm sein.` },
      { q: 'Muss ich die Handwerker in meine Wohnung lassen?', a: 'Grundsätzlich ja, denn § 555d Abs. 1 BGB verpflichtet den Mieter, eine Modernisierung zu dulden. Die Pflicht entfällt nur, wenn die Arbeiten für Sie, Ihre Familie oder Ihren Haushalt eine Härte bedeuten, die auch unter Würdigung der Interessen des Vermieters, der anderen Mieter sowie von Energieeinsparung und Klimaschutz nicht zu rechtfertigen ist. Die spätere Mieterhöhung zählt bei dieser Abwägung nicht mit.' },
      { q: 'Kann ich nach einer Modernisierungsankündigung vorzeitig ausziehen?', a: `Ja. § 555e BGB gibt Ihnen ein Sonderkündigungsrecht: Bis zum Ablauf des Monats nach Zugang der Ankündigung können Sie außerordentlich kündigen, und das Mietverhältnis endet zum Ablauf des übernächsten Monats. Bei Zugang am ${dD(ZUGANG)} muss die Kündigung bis zum ${dD(sonderBis)} beim Vermieter sein; geht sie am ${dD(KUENDIGUNG)} zu, endet der Vertrag am ${dD(sonderEnde)}. Bei Bagatellmaßnahmen gilt das Recht nicht.` },
      { q: 'Was passiert, wenn die Mieterhöhung höher ausfällt als angekündigt?', a: `Übersteigt die tatsächliche Erhöhung die angekündigte um mehr als ${tolD}, verschiebt sich die Fälligkeit um sechs Monate (§ 559b Abs. 2 BGB), und Härtegründe gegen die Erhöhung können Sie auch nach Ablauf der Ausschlussfrist noch vorbringen (§ 559 Abs. 5 BGB). Im Beispiel kostet die Verschiebung den Vermieter ${eD(verlust)}. Eine höhere Erhöhung als die gesetzlich zulässige wird dadurch nicht erlaubt.` },
      { q: 'Wann ist eine Ankündigung entbehrlich?', a: 'Bei Maßnahmen, die nur unerheblich auf die Wohnung einwirken und nur zu einer unerheblichen Mieterhöhung führen (§ 555c Abs. 4 BGB). Beides muss zusammenkommen. Für alle anderen Modernisierungen ist die Ankündigung Pflicht. Fehlt sie, beginnt die Frist für Ihren Härteeinwand nicht, und eine spätere Mieterhöhung bleibt zwar möglich, wird aber erst sechs Monate später fällig.' },
      { q: 'Muss die Ankündigung die künftigen Heizkosten nennen?', a: `Sie muss die voraussichtlichen künftigen Betriebskosten angeben, wenn der Vermieter eine Erhöhung nach § 559 oder § 559c BGB verlangen will. Im vereinfachten Verfahren für Kosten bis ${eD(M.vereinfacht_bis, 0)} entfällt diese Angabe, dafür muss die Ankündigung sagen, dass er dieses Verfahren nutzt. Bei energetischen Maßnahmen darf er für die Qualität von Bauteilen auf allgemein anerkannte Pauschalwerte verweisen.` },
    ],
    body: (h) => `
<h2>Was als Modernisierung gilt</h2>
<p>${h.src('bgb555b', '§ 555b BGB')} zählt die baulichen Veränderungen auf, die eine Modernisierung sind: Maßnahmen, die Endenergie für die Wohnung nachhaltig einsparen (energetische Modernisierung), der Einbau oder die Aufstellung einer Heizungsanlage im Sinne des Gebäudemodernisierungsgesetzes, Maßnahmen, die nicht erneuerbare Primärenergie sparen oder das Klima schützen, den Wasserverbrauch senken, den Gebrauchswert erhöhen, einen ersten Glasfaseranschluss schaffen, die allgemeinen Wohnverhältnisse dauerhaft verbessern, Maßnahmen, die der Vermieter wegen Umständen durchführt, die er nicht zu vertreten hat, und die Schaffung neuen Wohnraums. Nicht dazu gehören reine Reparaturen: Erhaltungsmaßnahmen bezahlt der Vermieter selbst, und ihr Anteil wird aus den Modernisierungskosten herausgerechnet.</p>

<h2>Was in der Ankündigung stehen muss</h2>
<p>Die Ankündigung ist nach ${h.src('bgb555c', '§ 555c Abs. 1 BGB')} spätestens ${W[ANKUENDIGUNG_MONATE]} Monate vor Beginn der Arbeiten in Textform zu machen. Ein Brief ohne Unterschrift oder eine E-Mail genügt, ein Aushang im Treppenhaus in der Regel nicht, weil er Ihnen nicht zugeht. Inhaltlich verlangt das Gesetz:</p>
<ul>
<li>die Art und den voraussichtlichen Umfang der Maßnahme in wesentlichen Zügen, also so, dass Sie verstehen, was in Ihrer Wohnung und am Haus passiert;</li>
<li>den voraussichtlichen Beginn und die voraussichtliche Dauer;</li>
<li>den Betrag der zu erwartenden Mieterhöhung, wenn der Vermieter eine Erhöhung nach § 559 oder § 559c verlangen will, sowie die voraussichtlichen künftigen Betriebskosten.</li>
</ul>
<p>Außerdem soll der Vermieter auf Form und Frist des Härteeinwands hinweisen (§ 555c Abs. 2). Das ist keine Wirksamkeitsvoraussetzung, aber fehlt der Hinweis, sind Sie an Form und Frist nicht gebunden. Bei energetischen Maßnahmen darf er für die Qualität von Bauteilen auf allgemein anerkannte Pauschalwerte Bezug nehmen. Ganz entbehrlich ist die Ankündigung nur bei Maßnahmen mit unerheblicher Einwirkung auf die Wohnung und unerheblicher Mieterhöhung.</p>

<h2>Ihre Fristen nach dem Zugang</h2>
<p>Mit dem Zugang der Ankündigung beginnen zwei kurze Fristen, die am selben Tag enden. Im Beispiel geht die Ankündigung am ${h.date(ZUGANG)} zu.</p>
${h.table(['Was', 'Frist', 'Im Beispiel', 'Grundlage'], [
  ['Beginn der Arbeiten frühestens', `${W[ANKUENDIGUNG_MONATE]} Monate nach Zugang`, h.date(beginnFrueh), '§ 555c Abs. 1'],
  ['Härteeinwand in Textform', 'bis Ende des Folgemonats', h.date(haerteBis), '§ 555d Abs. 3'],
  ['Sonderkündigung des Mieters', 'bis Ende des Folgemonats', h.date(sonderBis), '§ 555e Abs. 1'],
  [`Mietende bei Kündigung am ${h.date(KUENDIGUNG)}`, 'Ablauf des übernächsten Monats', h.date(sonderEnde), '§ 555e Abs. 1'],
], 'Fristen nach einer Modernisierungsankündigung', ['l', 'l', 'r', 'l'])}
<h3>Der Härteeinwand</h3>
<p>Nach ${h.src('bgb555d', '§ 555d BGB')} müssen Sie eine Modernisierung dulden, außer sie wäre für Sie, Ihre Familie oder einen Angehörigen Ihres Haushalts eine Härte, die auch unter Würdigung der Interessen des Vermieters, der anderen Mieter und des Klimaschutzes nicht zu rechtfertigen ist. Das Gesetz zählt die Gründe nicht auf; in Betracht kommen etwa eine schwere Krankheit oder eine Behinderung, mit der die Bauarbeiten nicht zu vereinbaren sind. Die künftige Miete spielt bei der Frage, ob Sie dulden müssen, keine Rolle; sie wird erst bei der Mieterhöhung geprüft.</p>
<p>Härtegründe teilen Sie bis zum Ablauf des Monats nach Zugang der Ankündigung in Textform mit. Die Frist beginnt nur, wenn die Ankündigung § 555c entspricht. Waren Sie ohne Verschulden verhindert, können Sie Gründe unverzüglich nachreichen; Gründe gegen die Mieterhöhung müssen aber spätestens bis zum Beginn der Arbeiten mitgeteilt sein. Wer die finanzielle Härte erst bei der Erhöhungserklärung vorbringt, ist nach ${h.src('bgb559', '§ 559 Abs. 5 BGB')} in der Regel zu spät. Eine Ausnahme gilt, wenn die tatsächliche Erhöhung die angekündigte um mehr als ${tolD} übersteigt.</p>
<h3>Das Sonderkündigungsrecht</h3>
<p>Wer die Modernisierung nicht abwarten will, kann nach ${h.ext(U555E, '§ 555e BGB')} außerordentlich kündigen, bis zum Ablauf des Monats nach Zugang der Ankündigung. Das Mietverhältnis endet dann zum Ablauf des übernächsten Monats nach der Kündigung. Ein Grund ist nicht nötig, und die Kündigung ist auch während einer vereinbarten Mindestlaufzeit möglich. Bei Bagatellmaßnahmen nach § 555c Abs. 4 entfällt das Recht.</p>

<h2>Von der Ankündigung zur Mieterhöhung</h2>
<p>Sind die Arbeiten abgeschlossen, kann der Vermieter die jährliche Miete um ${h.pct(M.umlage, 0)} der für Ihre Wohnung aufgewendeten Kosten erhöhen, abzüglich der Kosten, die für eine Erhaltung ohnehin angefallen wären, und abzüglich von Zuschüssen. Die Erhöhung ist nach ${h.src('bgb559b', '§ 559b BGB')} in Textform zu erklären, mit einer Berechnung aus den entstandenen Kosten und einer Erläuterung. Die Miete steigt mit Beginn des dritten Monats nach Zugang der Erklärung. Die Frist verlängert sich um sechs Monate, wenn die Maßnahme nicht ordnungsgemäß angekündigt wurde oder die tatsächliche Erhöhung die angekündigte um mehr als ${tolD} übersteigt.</p>
${h.table(['', 'angekündigt', 'abgerechnet'], [
  ['Kosten für die Wohnung', h.eur(KOSTEN_ANK), h.eur(KOSTEN_IST)],
  ['abzüglich Erhaltungsanteil', h.eur(ank.erhaltung), h.eur(ist.erhaltung)],
  ['umlagefähig', h.eur(ank.basis), h.eur(ist.basis)],
  [`${h.pct(M.umlage, 0)} im Jahr`, h.eur(ank.jahr, 2), h.eur(ist.jahr, 2)],
  ['Erhöhung im Monat', h.eur(ank.monat, 2), h.eur(ist.monat, 2)],
  [`Kappung ${h.eur(ank.kapM2, 2)} je m² in ${W[M.kappung_jahre]} Jahren`, h.eur(ank.kapM2 * FL, 2), h.eur(ist.kapM2 * FL, 2)],
  ['neue Nettokaltmiete', h.eur(ank.neueMiete, 2), h.eur(ist.neueMiete, 2)],
], `Modernisierung einer Wohnung mit ${h.num(FL, 0)} m² und ${h.eur(MIETE)} Nettokaltmiete`, ['l', 'r', 'r'])}
<p>Die abgerechnete Erhöhung liegt ${h.pct(mehr, 1)} über der angekündigten${ueberToleranz ? `, also mehr als ${tolD}` : ''}. Geht die Erhöhungserklärung am ${h.date(ERKLAERUNG)} zu, wäre die neue Miete sonst ab dem ${h.date(faellig)} fällig; ${ueberToleranz ? `so verschiebt sich die Fälligkeit auf den ${h.date(faelligSpaet)}` : 'die Fälligkeit bleibt'}. Die Kappung von ${h.eur(ank.kapM2, 0)} je m² greift hier nicht, weil die Miete vor der Erhöhung über ${h.eur(M.niedrig_unter_m2, 0)} je m² lag und die Erhöhung unter der Grenze bleibt; bei einer Miete unter ${h.eur(M.niedrig_unter_m2, 0)} je m² wären es höchstens ${h.eur(M.kappung_m2_niedrig, 0)} je m². Alle Werte rechnet der ${h.a('modernisierung-rechner', 'Modernisierungs-Rechner')} für Ihre Zahlen nach.</p>

<h2>Zwei Sonderfälle in der Ankündigung</h2>
<p><strong>Vereinfachtes Verfahren.</strong> Betragen die Kosten für die Wohnung höchstens ${h.eur(M.vereinfacht_bis)}, darf der Vermieter nach ${h.src('bgb559c', '§ 559c BGB')} pauschal ${h.pct(M.vereinfacht_pauschale, 0)} als Erhaltungsanteil abziehen, statt ihn zu ermitteln. Die Ankündigung muss das sagen, die künftigen Betriebskosten muss sie dann nicht nennen. Bei ${h.eur(KLEIN)} Kosten ergibt das ${h.eur(vereinf.monat, 2)} im Monat. Einen Härteeinwand gegen die Erhöhung gibt es in diesem Verfahren grundsätzlich nicht, und der Vermieter kann ${W[M.vereinfacht_sperre_jahre]} Jahre lang keine weitere Erhöhung nach § 559 oder § 559e verlangen.</p>
<p><strong>Neue Heizung mit Förderung.</strong> Baut der Vermieter eine Heizungsanlage ein, die die Voraussetzungen für öffentliche Zuschüsse erfüllt, und nimmt er Fördermittel in Anspruch, darf er nach ${h.src('bgb559e', '§ 559e BGB')} ${h.pct(M.umlage_559e, 0)} der Kosten abzüglich der Förderung umlegen, mit einem pauschalen Erhaltungsabzug von ${h.pct(M.erhaltung_pauschal_559e, 0)}. Die Erhöhung ist auf ${h.eur(M.heizung_kappung_m2, 2)} je m² in ${W[M.kappung_jahre]} Jahren begrenzt. Bei ${h.eur(30000)} Kosten und ${h.eur(9000)} Förderung wären rechnerisch ${h.eur(heiz.monatRoh, 2)} im Monat möglich, die Kappung lässt aber nur ${h.eur(heiz.monat, 2)} zu.</p>

<h2>Was Sie mit der Ankündigung tun</h2>
<ol>
<li>Datum des Zugangs notieren und die beiden Fristen ausrechnen: Härteeinwand und Sonderkündigung bis zum Ende des Folgemonats.</li>
<li>Prüfen, ob alle Pflichtangaben enthalten sind, insbesondere der Betrag der erwarteten Erhöhung und die künftigen Betriebskosten. Fehlt etwas, beginnt die Härtefrist nicht, und eine spätere Erhöhung wird sechs Monate später fällig.</li>
<li>Härtegründe, auch finanzielle, vorsorglich in Textform mitteilen, bevor die Frist abläuft.</li>
<li>Die angekündigte Erhöhung mit dem Mini-Rechner oben nachrechnen und mit der späteren Erklärung vergleichen.</li>
</ol>
<p>Bei einer ${h.a('indexmiete', 'Indexmiete')} sind Modernisierungserhöhungen nur in engen Fällen erlaubt, bei einer laufenden ${h.a('staffelmiete', 'Staffelmiete')} gar nicht. Beeinträchtigen die Bauarbeiten die Wohnung, kann eine ${h.a('mietminderung', 'Mietminderung')} in Betracht kommen; bei einer energetischen Modernisierung nach § 555b Nr. 1 bleibt eine Beeinträchtigung aber drei Monate lang außer Betracht (${h.src('bgb536', '§ 536 Abs. 1a BGB')}).</p>
`,
  },
  en: {
    slug: 'modernisation-notice',
    nav: 'Modernisation notice',
    card: 'What the notice must say and which deadlines start running for you.',
    title: 'Modernisation Notice 2026: Content, Deadlines, Hardship',
    description: `Modernisation notice (Modernisierungsankündigung) 2026: three months ahead in text form, required details, hardship deadline, then ${umlP} per cent of costs a year.`,
    h1: 'Modernisation notice: your rights from the first letter',
    intro: 'The notice starts a short deadline for objections, and it fixes how expensive the work may later become for you.',
    resume: `Before modernising, a German landlord must announce the work in text form at least ${WE[ANKUENDIGUNG_MONATE]} months before it starts (Section 555c of the Civil Code, BGB): its nature and scope in outline, the expected start and duration, the expected rent increase and the expected future service charges. The tenant generally has to tolerate the work. Circumstances that would cause you hardship (Härte) must be reported in text form by the end of the month after the notice arrives (Section 555d(3)). By the same date you can terminate the lease with special notice. Once the work is done, the annual rent may rise by ${pE(M.umlage)} of the costs, minus the share for repairs and capped at ${eE(M.kappung_m2, 0)} per m² over ${WE[M.kappung_jahre]} years. Example: notice on ${dE(ZUGANG)}, work no earlier than ${dE(beginnFrueh)}, hardship objection by ${dE(haerteBis)}. The announced increase is ${eE(ank.monat)} a month. If the landlord later bills ${eE(ist.monat)}, that is ${pE(mehr, 1)} more, and the increase only falls due six months later, from ${dE(faelligSpaet)} instead of ${dE(faellig)}.`,
    faqs: [
      { q: 'How long do I have to raise hardship after a modernisation notice?', a: `Until the end of the month following the month in which the notice reached you, in text form. If the letter arrives on ${dE(ZUGANG)}, the deadline is ${dE(haerteBis)}. It only starts if the notice meets Section 555c BGB. If the landlord did not tell you about the form and deadline, you are bound by neither; but hardship grounds against the rent increase must still reach him before the work begins.` },
      { q: 'Do I have to let the builders into my flat?', a: 'In principle yes, because Section 555d(1) BGB obliges tenants to tolerate modernisation. The duty only lapses if the work would mean hardship for you, your family or your household that cannot be justified even after weighing the interests of the landlord, the other tenants, energy saving and climate protection. The later rent increase is left out of that balancing exercise.' },
      { q: 'Can I move out early after a modernisation notice?', a: `Yes. Section 555e BGB gives you a special right to terminate. You can give extraordinary notice until the end of the month after the announcement arrives, and the tenancy then ends at the close of the month after next. With a notice received on ${dE(ZUGANG)}, your termination must reach the landlord by ${dE(sonderBis)}; if it arrives on ${dE(KUENDIGUNG)}, the lease ends on ${dE(sonderEnde)}. The right does not apply to trivial works.` },
      { q: 'What if the rent increase turns out higher than announced?', a: `If the actual increase exceeds the announced one by more than ${tolE}, it falls due six months later (Section 559b(2) BGB), and you can still raise hardship grounds against it after the usual cut-off (Section 559(5) BGB). In the example the delay costs the landlord ${eE(verlust)}. It does not, however, make an increase above the legal maximum lawful.` },
      { q: 'When can the landlord skip the notice?', a: 'Only for works that have a negligible effect on the flat and lead to a negligible rent increase (Section 555c(4) BGB); both conditions must be met. For every other modernisation the notice is compulsory. Without it, the deadline for your hardship objection does not start, and while a later rent increase is still possible, it only falls due six months later.' },
      { q: 'Must the notice state the future heating costs?', a: `It must give the expected future service charges if the landlord wants an increase under Section 559 or 559c BGB. Under the simplified procedure for costs of up to ${eE(M.vereinfacht_bis, 0)} that detail is not required, but the notice must say that the simplified procedure is being used. For energy-saving work he may refer to generally recognised standard values for the quality of building components.` },
    ],
    body: (h) => `
<h2>What counts as modernisation</h2>
<p>${h.src('bgb555b', 'Section 555b BGB')} lists the building works that count as modernisation (Modernisierung): measures that permanently save final energy for the flat (energy-saving modernisation), installing or setting up a heating system within the meaning of the Building Modernisation Act (Gebäudemodernisierungsgesetz), measures that save non-renewable primary energy or protect the climate, cut water consumption, raise the practical value of the flat, provide a first fibre-optic connection, permanently improve general living conditions, works the landlord carries out because of circumstances beyond his control, and the creation of new living space. Plain repairs are not included: the landlord pays for maintenance (Erhaltung) himself, and its share is deducted from the modernisation costs.</p>

<h2>What the notice must contain</h2>
<p>Under ${h.src('bgb555c', 'Section 555c(1) BGB')} the notice must be given in text form at least ${WE[ANKUENDIGUNG_MONATE]} months before work starts. An unsigned letter or an e-mail is enough; a notice pinned up in the stairwell usually is not, because it is not delivered to you. The law requires:</p>
<ul>
<li>the nature and expected scope of the work in outline, so that you understand what will happen in your flat and to the building;</li>
<li>the expected start date and duration;</li>
<li>the amount of the expected rent increase, if the landlord intends to raise the rent under Section 559 or 559c, together with the expected future service charges.</li>
</ul>
<p>The landlord should also tell you about the form of and deadline for a hardship objection (Section 555c(2)). That is not a condition of validity, but if it is missing you are not bound by that form and deadline. For energy-saving work he may refer to generally recognised standard values for the quality of building components. The notice can only be skipped altogether for works with a negligible effect on the flat and a negligible rent increase.</p>

<h2>Your deadlines once the notice arrives</h2>
<p>Receipt of the notice starts two short deadlines that end on the same day. In the example the notice arrives on ${h.date(ZUGANG)}.</p>
${h.table(['What', 'Deadline', 'In the example', 'Basis'], [
  ['Earliest start of the work', `${WE[ANKUENDIGUNG_MONATE]} months after receipt`, h.date(beginnFrueh), 'Section 555c(1)'],
  ['Hardship objection in text form', 'by the end of the following month', h.date(haerteBis), 'Section 555d(3)'],
  ['Special termination by the tenant', 'by the end of the following month', h.date(sonderBis), 'Section 555e(1)'],
  [`End of tenancy if notice is given on ${h.date(KUENDIGUNG)}`, 'close of the month after next', h.date(sonderEnde), 'Section 555e(1)'],
], 'Deadlines after a modernisation notice', ['l', 'l', 'r', 'l'])}
<h3>The hardship objection</h3>
<p>Under ${h.src('bgb555d', 'Section 555d BGB')} you must tolerate modernisation unless it would cause you, your family or a member of your household hardship that cannot be justified even after weighing the interests of the landlord, the other tenants and climate protection. The law gives no list of grounds; a serious illness or a disability that cannot be reconciled with the building work are typical examples. The future rent plays no part in whether you must tolerate the work; it is only examined when the increase comes.</p>
<p>Report hardship grounds in text form by the end of the month after the notice arrives. The deadline only starts if the notice complies with Section 555c. If you were prevented through no fault of your own, you can add grounds without delay; but grounds against the rent increase must reach the landlord before work begins. A tenant who first mentions financial hardship when the increase letter arrives is usually too late under ${h.src('bgb559', 'Section 559(5) BGB')}. The exception: the actual increase exceeds the announced one by more than ${tolE}.</p>
<h3>The special right to terminate</h3>
<p>If you would rather not wait for the building work, ${h.ext(U555E, 'Section 555e BGB')} lets you terminate with extraordinary notice until the end of the month after the announcement arrives. The tenancy then ends at the close of the month after next following your notice. No reason is needed, and the right applies even during an agreed minimum term. It does not apply to trivial works under Section 555c(4).</p>

<h2>From notice to rent increase</h2>
<p>Once the work is complete, the landlord may raise the annual rent by ${h.pct(M.umlage, 0)} of the costs spent on your flat, minus what maintenance would have cost anyway and minus any grants. Under ${h.src('bgb559b', 'Section 559b BGB')} the increase must be declared in text form, with a calculation based on the actual costs and an explanation. The rent goes up from the start of the third month after the declaration arrives. That date moves six months later if the work was not properly announced or the actual increase exceeds the announced one by more than ${tolE}.</p>
${h.table(['', 'announced', 'billed'], [
  ['Costs for the flat', h.eur(KOSTEN_ANK), h.eur(KOSTEN_IST)],
  ['minus maintenance share', h.eur(ank.erhaltung), h.eur(ist.erhaltung)],
  ['chargeable', h.eur(ank.basis), h.eur(ist.basis)],
  [`${h.pct(M.umlage, 0)} a year`, h.eur(ank.jahr, 2), h.eur(ist.jahr, 2)],
  ['Increase per month', h.eur(ank.monat, 2), h.eur(ist.monat, 2)],
  [`Cap of ${h.eur(ank.kapM2, 2)} per m² over ${WE[M.kappung_jahre]} years`, h.eur(ank.kapM2 * FL, 2), h.eur(ist.kapM2 * FL, 2)],
  ['New net cold rent', h.eur(ank.neueMiete, 2), h.eur(ist.neueMiete, 2)],
], `Modernisation of a ${h.num(FL, 0)} m² flat with a net cold rent of ${h.eur(MIETE)}`, ['l', 'r', 'r'])}
<p>The billed increase is ${h.pct(mehr, 1)} above the announced one${ueberToleranz ? `, so more than ${tolE}` : ''}. If the increase letter arrives on ${h.date(ERKLAERUNG)}, the new rent would normally be due from ${h.date(faellig)}; ${ueberToleranz ? `instead it is due from ${h.date(faelligSpaet)}` : 'that date stands'}. The cap of ${h.eur(ank.kapM2, 0)} per m² does not bite here, because the rent before the increase was above ${h.eur(M.niedrig_unter_m2, 0)} per m² and the increase stays below the limit; for a rent under ${h.eur(M.niedrig_unter_m2, 0)} per m² the cap would be ${h.eur(M.kappung_m2_niedrig, 0)} per m². The ${h.a('modernisierung-rechner', 'modernisation calculator')} reworks all of this with your own figures.</p>

<h2>Two special cases in the notice</h2>
<p><strong>Simplified procedure.</strong> If the costs for the flat are no more than ${h.eur(M.vereinfacht_bis)}, ${h.src('bgb559c', 'Section 559c BGB')} lets the landlord deduct a flat ${h.pct(M.vereinfacht_pauschale, 0)} for maintenance instead of working it out. The notice must say so, and it then need not state future service charges. With costs of ${h.eur(KLEIN)} that gives ${h.eur(vereinf.monat, 2)} a month. In this procedure there is generally no hardship objection to the increase, and the landlord cannot claim another increase under Section 559 or 559e for ${WE[M.vereinfacht_sperre_jahre]} years.</p>
<p><strong>New heating system with a grant.</strong> If the landlord installs a heating system that qualifies for public subsidies and takes up the funding, ${h.src('bgb559e', 'Section 559e BGB')} lets him pass on ${h.pct(M.umlage_559e, 0)} of the costs minus the grant, with a flat maintenance deduction of ${h.pct(M.erhaltung_pauschal_559e, 0)}. The increase is capped at ${h.eur(M.heizung_kappung_m2, 2)} per m² over ${WE[M.kappung_jahre]} years. With costs of ${h.eur(30000)} and a grant of ${h.eur(9000)}, the formula would allow ${h.eur(heiz.monatRoh, 2)} a month, but the cap only permits ${h.eur(heiz.monat, 2)}.</p>

<h2>What to do with the notice</h2>
<ol>
<li>Note the date it arrived and work out both deadlines: hardship objection and special termination, each by the end of the following month.</li>
<li>Check that every required detail is there, especially the expected increase and the future service charges. If something is missing, the hardship deadline does not start and any later increase falls due six months later.</li>
<li>Report hardship grounds, financial ones included, in text form before the deadline, as a precaution.</li>
<li>Recalculate the announced increase with the small calculator above and compare it with the later increase letter.</li>
</ol>
<p>With an ${h.a('indexmiete', 'index-linked rent')} modernisation increases are only allowed in narrow cases, and during a ${h.a('staffelmiete', 'graduated rent')} not at all. If the building work impairs the flat, a ${h.a('mietminderung', 'rent reduction')} (Mietminderung) may come into play; for energy-saving modernisation under Section 555b no. 1, however, any impairment is disregarded for three months (${h.src('bgb536', 'Section 536(1a) BGB')}).</p>
`,
  },
});
