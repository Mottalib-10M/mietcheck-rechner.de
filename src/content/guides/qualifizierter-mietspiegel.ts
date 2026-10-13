import { defineGuide } from '../../lib/guide-types';
import { STAEDTE, type Stadt } from '../../lib/engine/staedte';
import { addMonths, cmp } from '../../lib/engine/dates';
import { displayDate } from '../../lib/format';
import qBerlin from '../../../data-src/mietspiegel/berlin-quelle.json';
import qHamburg from '../../../data-src/mietspiegel/hamburg-quelle.json';
import qFrankfurt from '../../../data-src/mietspiegel/frankfurt-quelle.json';
import qHannover from '../../../data-src/mietspiegel/hannover-quelle.json';
import qLeipzig from '../../../data-src/mietspiegel/leipzig-quelle.json';
import qDresden from '../../../data-src/mietspiegel/dresden-quelle.json';

// Fristen des § 558d Abs. 2 BGB, gezählt ab dem Stichtag der Datenerhebung (Satz 4).
const ANPASSUNG_MONATE = 24, NEU_MONATE = 48;
const HEUTE = '2026-10-13';
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

const qual = STAEDTE.filter((s) => s.qualifiziert);
const einfach = STAEDTE.filter((s) => !s.qualifiziert);
const einfachNamen = einfach.map((s) => s.name);
const EN_STADT: Record<string, string> = { koeln: 'Cologne', muenchen: 'Munich', nuernberg: 'Nuremberg', hannover: 'Hanover' };
const enStadt = (s: Stadt) => EN_STADT[s.id] ?? s.name;
const einfachEn = einfach.map(enStadt);

// Stichtage, die im amtlichen Mietspiegel als Datum genannt sind (neu erhobene Ausgaben).
const STICH: Array<[string, { stichtag: string }]> = [['berlin', qBerlin], ['hamburg', qHamburg], ['frankfurt', qFrankfurt], ['hannover', qHannover], ['leipzig', qLeipzig], ['dresden', qDresden]];
const fristen = STICH.map(([id, q]) => {
  const s = STAEDTE.find((x) => x.id === id) as Stadt;
  const stichtag = q.stichtag.slice(0, 10);
  const anpassung = addMonths(stichtag, ANPASSUNG_MONATE), neu = addMonths(stichtag, NEU_MONATE);
  return { s, stichtag, anpassung, neu };
});
const berlinF = fristen.find((f) => f.s.id === 'berlin')!;
const kuenftig = fristen.filter((f) => cmp(f.anpassung, HEUTE) > 0).sort((a, b) => cmp(a.anpassung, b.anpassung));
const naechste = { datum: kuenftig[0].anpassung, namen: kuenftig.filter((f) => f.anpassung === kuenftig[0].anpassung).map((f) => f.s.name), en: kuenftig.filter((f) => f.anpassung === kuenftig[0].anpassung).map(enStadt) };
const vorbei = fristen.filter((f) => cmp(f.anpassung, HEUTE) <= 0);

const gilt = (s: Stadt, l: 'de' | 'en') => (s.gueltigAb ? (l === 'de' ? dD(s.gueltigAb) : dE(s.gueltigAb)) : l === 'de' ? 'ohne Datum' : 'no date given');
const bis = (s: Stadt, l: 'de' | 'en') => (s.gueltigBis ? (l === 'de' ? dD(s.gueltigBis) : dE(s.gueltigBis)) : l === 'de' ? 'bis zur nächsten Ausgabe' : 'until the next edition');

export default defineGuide({
  id: 'qualifizierter-mietspiegel',
  group: 'erhoehung',
  order: 30,
  mini: 'mietspiegelalter',
  miniHref: 'mietspiegel-berlin',
  related: ['mietspiegel', 'vergleichsmiete', 'mieterhoehung', 'mietspiegel-berlin', 'mietspiegel-koeln', 'mieterhoehung-rechner'],
  sources: ['bgb558c', 'bgb558d', 'bgb558a', 'berlinMs', 'hamburgMs'],
  de: {
    slug: 'qualifizierter-mietspiegel',
    nav: 'Qualifizierter Mietspiegel',
    card: 'Was die gesetzliche Vermutung bewirkt und wann ein Mietspiegel veraltet.',
    title: 'Qualifizierter Mietspiegel 2026: Vermutung, Fristen, Städte',
    description: 'Qualifizierter Mietspiegel 2026: was ihn vom einfachen unterscheidet, welche Vermutung gilt, wann er angepasst werden muss und welche Großstädte einen haben.',
    h1: 'Qualifizierter Mietspiegel: warum seine Werte vor Gericht zählen',
    intro: 'Ein Mietspiegel nach wissenschaftlichen Grundsätzen trägt eine gesetzliche Vermutung, aber nur, solange er rechtzeitig angepasst wird.',
    resume: `Ein qualifizierter Mietspiegel ist nach § 558d BGB ein Mietspiegel, der nach anerkannten wissenschaftlichen Grundsätzen erstellt und von der zuständigen Behörde oder von den Interessenvertretern der Vermieter und Mieter anerkannt worden ist. Sein Vorteil liegt in der Vermutung des Absatzes 3: Die dort genannten Entgelte gelten als ortsübliche Vergleichsmiete, wer anderes behauptet, muss es beweisen. Die Vermutung trägt aber nur, wenn der Mietspiegel nach zwei Jahren an die Marktentwicklung angepasst und nach vier Jahren neu erstellt wird, gerechnet ab dem Stichtag der Datenerhebung. Von den ${STAEDTE.length} Großstädten auf dieser Seite haben ${qual.length} einen qualifizierten Mietspiegel, ${einfachNamen.join(' und ')} nur einen einfachen. Beispiel Berlin: Die Daten des Mietspiegels 2026 stammen vom ${dD(berlinF.stichtag)}, die angepasste Fassung muss also auf Daten spätestens vom ${dD(berlinF.anpassung)} beruhen, eine Neuerstellung auf Daten spätestens vom ${dD(berlinF.neu)}. Enthält ein qualifizierter Mietspiegel Angaben zu Ihrer Wohnung, muss jedes Erhöhungsverlangen sie nennen, selbst wenn es sich auf Vergleichswohnungen oder ein Gutachten stützt.`,
    faqs: [
      { q: 'Woran erkenne ich, ob der Mietspiegel meiner Stadt qualifiziert ist?', a: 'Am Titelblatt und an der Anerkennung. Qualifizierte Mietspiegel nennen sich fast immer so und verweisen auf § 558d BGB; dazu gehört ein Methodenbericht über die Stichprobe und die Auswertung. Entscheidend ist die Anerkennung durch die Gemeinde oder durch Mieter- und Vermieterverbände. Steht nur „Mietspiegel“ auf dem Heft und fehlt jeder Hinweis auf eine wissenschaftliche Erhebung, ist es in der Regel ein einfacher.' },
      { q: 'Verliert ein qualifizierter Mietspiegel nach zwei Jahren seine Wirkung?', a: `Die gesetzliche Vermutung hängt daran, dass eine Anpassung folgt, deren Stichtag höchstens zwei Jahre nach dem der Datenerhebung liegt, per Stichprobe oder mit dem Verbraucherpreisindex. Bleibt sie aus, entfällt die Vermutung, das Heft wird aber nicht wertlos: Der Vermieter darf ein Erhöhungsverlangen nach § 558a Abs. 4 BGB auch auf einen veralteten Mietspiegel stützen, wenn kein aktueller existiert. Vor Gericht zählt er dann nur noch als Anhaltspunkt.` },
      { q: 'Muss mein Vermieter den qualifizierten Mietspiegel erwähnen, wenn er drei Vergleichswohnungen nennt?', a: 'Ja. Enthält ein qualifizierter Mietspiegel, der fristgerecht angepasst ist, Angaben für Ihre Wohnung, muss das Erhöhungsschreiben diese Angaben mitteilen, auch wenn es sich auf Vergleichswohnungen, eine Mietdatenbank oder ein Gutachten stützt (§ 558a Abs. 3 BGB). So sehen Sie sofort, ob die verlangte Miete über dem Rahmen des Mietspiegels liegt. Fehlt die Angabe, ist das Verlangen formell angreifbar.' },
      { q: 'Kann ich als Mieter gegen die Werte eines qualifizierten Mietspiegels vorgehen?', a: 'Ja, aber Sie tragen dann die Last, die Vermutung zu widerlegen, ebenso wie der Vermieter, der mehr verlangt. Das gelingt in der Praxis nur mit konkreten Angaben, etwa einem Gutachten zur Wohnung oder dem Nachweis, dass die Erhebung methodisch fehlerhaft war. Einfacher ist meist der Streit darüber, wo innerhalb der Spanne Ihre Wohnung liegt, denn die Einordnung bestimmt die Höhe.' },
      { q: 'Welche Rolle spielt der Stichtag bei einem fortgeschriebenen Mietspiegel?', a: 'Die Frist für die nächste Anpassung und die für die Neuerstellung laufen nach § 558d Abs. 2 Satz 4 BGB ab dem Stichtag, zu dem die Daten erhoben wurden, nicht ab der Veröffentlichung. Eine Fortschreibung mit dem Verbraucherpreisindex setzt keine neue Erhebung voraus. Die Pflicht zur Neuerstellung nach vier Jahren rechnet deshalb weiter ab der Erhebung, auf der die Fortschreibung beruht.' },
    ],
    body: (h) => `
<h2>Einfacher und qualifizierter Mietspiegel</h2>
<p>Das Gesetz kennt zwei Stufen. Ein Mietspiegel im Sinne von ${h.src('bgb558c', '§ 558c BGB')} ist jede Übersicht über die ortsübliche Vergleichsmiete, die von der nach Landesrecht zuständigen Behörde oder von Interessenvertretern der Vermieter und der Mieter gemeinsam erstellt oder anerkannt wurde. Wie die Zahlen zustande kommen, schreibt die Vorschrift nicht vor. Ein solcher einfacher Mietspiegel kann auf einer Befragung beruhen, auf der Erfahrung von Maklern und Verbänden oder auf einer Verhandlung zwischen Mieterverein und Eigentümerverein. Er soll alle zwei Jahre der Marktentwicklung angepasst werden; für Gemeinden mit mehr als 50 000 Einwohnern ist ein Mietspiegel zu erstellen, und er ist zu veröffentlichen.</p>
<p>Die zweite Stufe regelt ${h.src('bgb558d', '§ 558d BGB')}. Qualifiziert ist ein Mietspiegel, wenn er nach anerkannten wissenschaftlichen Grundsätzen erstellt und anerkannt wurde. Das bedeutet in der Praxis eine repräsentative Stichprobe von Mieten, die in den letzten sechs Jahren neu vereinbart oder geändert wurden, eine dokumentierte statistische Auswertung (Tabelle oder Regression) und einen Bericht, der die Schritte nachvollziehbar macht. Der Gesetzgeber erleichtert den Nachweis doppelt: Entspricht der Mietspiegel den Anforderungen der Rechtsverordnung nach § 558c Abs. 5 BGB, wird vermutet, dass er wissenschaftlichen Grundsätzen entspricht. Dasselbe gilt, wenn ihn die zuständige Behörde und die Verbände beider Seiten als qualifiziert anerkannt haben.</p>

<h2>Was die Vermutung im Streit bedeutet</h2>
<p>Der Kern steht in § 558d Abs. 3 BGB: Ist die Anpassungsfrist eingehalten, wird vermutet, dass die im qualifizierten Mietspiegel bezeichneten Entgelte die ortsübliche Vergleichsmiete wiedergeben. Für eine ${h.a('mieterhoehung', 'Mieterhöhung')} nach § 558 BGB heißt das: Verlangt der Vermieter eine Miete innerhalb der Spanne, die der Mietspiegel für Ihre Wohnung ausweist, müssen Sie schon gute Gründe haben, um die Zustimmung zu verweigern. Verlangt er mehr, liegt die Last bei ihm. Ein Sachverständigengutachten, das teuer und langsam ist, wird damit in vielen Verfahren entbehrlich.</p>
<p>Beim einfachen Mietspiegel fehlt diese Vermutung. Er bleibt ein zulässiges Begründungsmittel nach ${h.src('bgb558a', '§ 558a Abs. 2 BGB')}, und Gerichte ziehen ihn häufig heran, wenn keine bessere Grundlage da ist. Bestreitet aber eine Seite die Werte mit Substanz, entscheidet am Ende oft ein Gutachten. Für die ${h.a('vergleichsmiete', 'ortsübliche Vergleichsmiete')} bei der Mietpreisbremse gilt dasselbe: Ein qualifizierter Mietspiegel gibt Ihnen eine belastbare Zahl, ein einfacher nur einen Anhaltspunkt.</p>

<h2>Welche Großstädte einen qualifizierten Mietspiegel haben</h2>
<p>Von den ${STAEDTE.length} Städten, deren Mietspiegel dieser Rechner erfasst, sind ${qual.length} qualifiziert. ${einfachNamen.join(' und ')} arbeiten mit einfachen Mietspiegeln, die Vereine herausgeben: In ${h.a('mietspiegel-koeln', 'Köln')} stellt ein Arbeitskreis den Mietspiegel auf, den die Rheinische Immobilienbörse veröffentlicht, in ${h.a('mietspiegel-duesseldorf', 'Düsseldorf')} vereinbaren ihn Haus und Grund und der Mieterverein. Beide sind brauchbar, tragen aber nicht die Vermutung des § 558d Abs. 3 BGB.</p>
${h.table(['Stadt', 'Mietspiegel', 'Art', 'gilt ab', 'gilt bis'], STAEDTE.map((s) => [s.name, s.ausgabe.replace(/\s*\(.*\)$/, ''), s.qualifiziert ? 'qualifiziert' : 'einfach', gilt(s, 'de'), bis(s, 'de')]), 'Mietspiegel der erfassten Großstädte, Stand Oktober 2026', ['l', 'l', 'l', 'r', 'r'])}
<p>Einige qualifizierte Mietspiegel sind Fortschreibungen. Bremen und Essen haben die Werte ihrer letzten Erhebung mit dem Verbraucherpreisindex hochgerechnet, Dortmund und Nürnberg ihre Mietspiegel ebenfalls fortgeschrieben. Das ist erlaubt: § 558d Abs. 2 Satz 2 BGB lässt für die Anpassung eine Stichprobe oder die Entwicklung des Preisindexes für die Lebenshaltung aller privaten Haushalte zu. Die Vermutung bleibt erhalten, die Pflicht zur Neuerstellung rückt aber näher.</p>

<h2>Die Fristen: zwei Jahre anpassen, vier Jahre neu erstellen</h2>
<p>Ein qualifizierter Mietspiegel ist im Abstand von zwei Jahren der Marktentwicklung anzupassen und nach vier Jahren neu zu erstellen. Seit der Reform des Mietspiegelrechts misst § 558d Abs. 2 Satz 4 BGB diese Abstände am Stichtag, zu dem die Daten erhoben wurden, nicht am Datum der Veröffentlichung oder des Ratsbeschlusses. Der Stichtag der angepassten Fassung darf also höchstens zwei Jahre nach dem Stichtag der bisherigen liegen, der Stichtag einer Neuerstellung höchstens vier Jahre nach der letzten Erhebung. Satz 5 überträgt das auf die Veröffentlichung. Weil zwischen Erhebung und Inkrafttreten oft ein Jahr liegt, gelten viele Mietspiegel deutlich länger, als die Zweijahresfrist auf den ersten Blick vermuten lässt.</p>
${h.table(['Stadt', 'Stichtag der Daten', 'Stichtag der Anpassung spätestens', 'Stichtag der Neuerstellung spätestens'], fristen.map((f) => [f.s.name, h.date(f.stichtag), h.date(f.anpassung), h.date(f.neu)]), 'Rechnerische Fristen nach § 558d Abs. 2 BGB ab dem im Mietspiegel genannten Stichtag', ['l', 'r', 'r', 'r'])}
<p>Die Tabelle rechnet nur mit den Stichtagen, die die Städte als Kalenderdatum angeben, und zählt zwei und vier Jahre hinzu. Sie sagt, auf welchen Datenstand sich die nächste Fassung spätestens beziehen muss, nicht, an welchem Tag sie erscheinen muss. ${vorbei.length ? `Für ${vorbei.map((f) => f.s.name).join(' und ')} liegt dieser Zeitpunkt bereits hinter uns; ob die nächste Fassung ihn einhält, zeigt erst ihr eigener Stichtag.` : ''} Als Nächstes folgt${naechste.namen.length > 1 ? 'en' : ''} ${naechste.namen.join(' und ')} mit dem ${h.date(naechste.datum)}. Für Ihre eigene Stadt rechnet der Mini-Rechner oben dieselben Daten aus, wenn Sie Monat und Jahr des Stichtags eintragen, der im Mietspiegel oder in seinem Methodenbericht steht.</p>
<p>Was passiert, wenn eine Stadt die Frist versäumt? Der Mietspiegel verliert die Vermutung, er wird aber nicht nichtig. § 558a Abs. 4 BGB erlaubt es dem Vermieter ausdrücklich, ein Erhöhungsverlangen auf einen veralteten Mietspiegel oder den Mietspiegel einer vergleichbaren Gemeinde zu stützen, wenn kein Mietspiegel vorhanden ist, der die Fristen einhält. Im Streit wiegen diese Zahlen dann weniger, und eine Seite kann ein Gutachten verlangen.</p>

<h2>Was der Vermieter aus einem qualifizierten Mietspiegel nennen muss</h2>
<p>Die schärfste Folge für die Praxis steht in § 558a Abs. 3 BGB. Enthält ein qualifizierter Mietspiegel, dessen Fristen eingehalten sind, Angaben für Ihre Wohnung, muss der Vermieter diese Angaben in seinem Erhöhungsschreiben mitteilen, und zwar auch dann, wenn er die Erhöhung auf etwas anderes stützt: auf drei Vergleichswohnungen, eine Auskunft aus einer Mietdatenbank oder ein Gutachten. Er kann die Vermutung also nicht umgehen, indem er sie verschweigt. Prüfen Sie deshalb in jedem Schreiben:</p>
<ul>
<li>Nennt es das Feld oder die Berechnung aus dem Mietspiegel, mit Spanne und Mittelwert oder dem errechneten Wert?</li>
<li>Stimmen die Merkmale, die der Vermieter angesetzt hat: Baujahr, Wohnfläche, Lage, Ausstattung?</li>
<li>Liegt die verlangte Miete innerhalb der Spanne? Nach § 558a Abs. 4 Satz 1 BGB genügt das für die Begründung; ob die Miete auch inhaltlich berechtigt ist, ist eine zweite Frage.</li>
<li>Ist die ${h.a('kappungsgrenze', 'Kappungsgrenze')} eingehalten? Der Mietspiegel sagt nichts darüber, um wie viel Ihre Miete in drei Jahren steigen darf.</li>
</ul>
<p>In Berlin und Hamburg erlauben die Städte die Wiedergabe ihrer Tabellen; der Rechner zeigt dort den passenden Wert mit Zeile und Feld (${h.src('berlinMs', 'Berliner Mietspiegel 2026')}, ${h.src('hamburgMs', 'Hamburger Mietenspiegel 2025')}). Für die übrigen Städte verweist er auf den offiziellen Online-Rechner der Stadt, weil deren Rechtevorbehalt eine Übernahme der Zahlen ausschließt. Den Weg dorthin finden Sie auf der Seite zum ${h.a('mietspiegel', 'Mietspiegel')}.</p>

<h2>Prüfen in drei Schritten</h2>
<ol>
<li>Stellen Sie fest, ob Ihr Mietspiegel qualifiziert ist und welcher Stichtag in ihm steht.</li>
<li>Rechnen Sie die Zweijahres- und die Vierjahresfrist ab diesem Stichtag; liegt das Datum des Erhöhungsschreibens danach und gibt es keine Fortschreibung, hat der Mietspiegel keine Vermutung mehr.</li>
<li>Vergleichen Sie die verlangte Miete mit dem Wert für Ihre Wohnung und lassen Sie den ${h.a('mieterhoehung-rechner', 'Mieterhöhungs-Rechner')} Kappungsgrenze und Fristen prüfen.</li>
</ol>
`,
  },
  en: {
    slug: 'qualified-rent-index',
    nav: 'Qualified rent index',
    card: 'What the legal presumption does and when a rent index goes stale.',
    title: 'Qualified Rent Index 2026: Presumption, Deadlines, Cities',
    description: 'Qualified rent index 2026: how it differs from a simple index, the legal presumption it carries, when it must be updated, and which big cities have one.',
    h1: 'Qualified rent index: why its figures carry weight in court',
    intro: 'A rent index built on scientific methods comes with a legal presumption, but only while it is kept up to date.',
    resume: `A qualified rent index (qualifizierter Mietspiegel) is defined in Section 558d of the German Civil Code (BGB) as an index drawn up on recognised scientific principles and approved either by the municipality or jointly by tenant and landlord associations. Its value lies in a presumption: the rents it states are taken to be the local reference rent (ortsübliche Vergleichsmiete), and whoever disputes them has to prove otherwise. That presumption only holds if the index is updated after two years and rebuilt from scratch after four, counted from the date the data were collected. Of the ${STAEDTE.length} large cities covered here, ${qual.length} have a qualified index; ${einfachEn.join(' and ')} only have a simple one. Take Berlin: the 2026 index uses data collected on ${dE(berlinF.stichtag)}, so the updated version must rest on data from no later than ${dE(berlinF.anpassung)}, and a new edition on data from no later than ${dE(berlinF.neu)}. Where a qualified index covers your flat, every rent increase letter must quote it, even if the landlord relies on comparable flats or an expert report.`,
    faqs: [
      { q: 'How can I tell whether my city’s rent index is qualified?', a: 'Look at the cover and at who approved it. A qualified index almost always calls itself one and refers to Section 558d BGB, and it comes with a method report describing the sample and the statistics. What matters legally is approval by the municipality or by the tenant and landlord associations. If the booklet just says “Mietspiegel” and mentions no survey, it is usually a simple index.' },
      { q: 'Does a qualified index stop counting after two years?', a: 'Its presumption depends on an update whose reference date is no more than two years after the original data date, based on a new sample or on consumer prices. Without that update the presumption falls away, but the index is not worthless: under Section 558a(4) BGB a landlord may still base an increase on an outdated index if no current one exists. In court it then counts only as a pointer, not as proof.' },
      { q: 'Must the landlord mention the qualified index when he cites three comparable flats?', a: 'Yes. If an up-to-date qualified index contains figures for your flat, the increase letter must state them, even if the landlord bases his demand on comparable flats, a rent database or an expert report (Section 558a(3) BGB). That lets you see at once whether the demanded rent is above the index range. If the figures are missing, the letter can be challenged on form.' },
      { q: 'Can a tenant challenge the figures of a qualified index?', a: 'You can, but you then carry the burden of rebutting the presumption, just like a landlord who asks for more. In practice that takes concrete evidence, such as an expert report on the flat or proof that the survey was methodically flawed. The more promising argument is usually where your flat sits within the range, because that placement decides the figure.' },
      { q: 'Which date counts for an index that was only updated, not newly surveyed?', a: 'Under Section 558d(2) sentence 4 BGB, both the update deadline and the deadline for a new edition run from the date the data were collected, not from publication. Indexing an edition to consumer prices does not involve a new survey, so the four-year deadline for a fresh edition keeps running from the original survey on which the update is based.' },
    ],
    body: (h) => `
<h2>Simple index or qualified index</h2>
<p>German law has two tiers. A rent index (Mietspiegel) under ${h.src('bgb558c', 'Section 558c BGB')} is any overview of local reference rents drawn up or approved by the competent municipal authority, or jointly by landlord and tenant associations. The provision does not say how the figures must be produced. A simple index (einfacher Mietspiegel) may rest on a survey, on what agents and associations observe, or on a negotiation between the tenants’ association (Mieterverein) and the owners’ association. It should be brought into line with the market every two years. Municipalities with more than 50,000 inhabitants have to produce one, and every index must be published.</p>
<p>The higher tier is set out in ${h.src('bgb558d', 'Section 558d BGB')}. An index is qualified when it is drawn up on recognised scientific principles and approved. In practice that means a representative sample of rents agreed or changed in the previous six years, a documented statistical analysis (a table or a regression model) and a report explaining each step. Proof is made easier in two ways. An index that meets the requirements of the federal regulation issued under Section 558c(5) BGB is presumed to be scientific. So is an index that both the authority and the associations on both sides have recognised as qualified.</p>

<h2>What the presumption does in a dispute</h2>
<p>The key rule is Section 558d(3) BGB: as long as the update deadline is met, the rents shown in a qualified index are presumed to reflect the local reference rent. For a ${h.a('mieterhoehung', 'rent increase')} under Section 558 BGB this means that if the landlord asks for a rent inside the range the index gives for your flat, you need solid grounds to refuse consent. If he asks for more, the burden is on him. Many cases can then be decided without an expert valuation, which is slow and expensive.</p>
<p>A simple index lacks the presumption. It remains a permitted way of justifying an increase under ${h.src('bgb558a', 'Section 558a(2) BGB')}, and courts often use it when nothing better is available. But if one side disputes its figures with real arguments, an expert report frequently settles the matter. The same is true for the ${h.a('vergleichsmiete', 'reference rent')} under the rent brake (Mietpreisbremse): a qualified index gives you a figure you can rely on, a simple one only an indication.</p>

<h2>Which large cities have a qualified index</h2>
<p>Of the ${STAEDTE.length} cities whose indexes this site covers, ${qual.length} are qualified. ${einfachEn.join(' and ')} use simple indexes published by associations. In ${h.a('mietspiegel-koeln', 'Cologne')} a working group draws up the index and the Rhineland property exchange publishes it; in ${h.a('mietspiegel-duesseldorf', 'Düsseldorf')} the owners’ association Haus und Grund and the tenants’ association agree it between them. Both are useful, but neither carries the presumption of Section 558d(3) BGB.</p>
${h.table(['City', 'Rent index', 'Type', 'Valid from', 'Valid to'], STAEDTE.map((s) => [enStadt(s), s.ausgabe.replace(/\s*\(.*\)$/, ''), s.qualifiziert ? 'qualified' : 'simple', gilt(s, 'en'), bis(s, 'en')]), 'Rent indexes of the cities covered, as of October 2026', ['l', 'l', 'l', 'r', 'r'])}
<p>Several qualified indexes are updates rather than new surveys. Bremen and Essen have carried the figures of their last survey forward with the consumer price index, and Dortmund and Nuremberg have also updated theirs. The law allows this: Section 558d(2) sentence 2 BGB accepts either a sample or the movement of the price index for all private households as the basis for an update. The presumption survives, but the deadline for a fresh survey keeps approaching.</p>

<h2>The deadlines: update after two years, rebuild after four</h2>
<p>A qualified index must be adjusted to the market every two years and produced afresh after four. Since the reform of rent index law, Section 558d(2) sentence 4 BGB measures these intervals by the reference date on which the data were collected (Stichtag), not by the date of publication or of the council decision. The reference date of the updated version may therefore be at most two years after that of the previous one, and the reference date of a new edition at most four years after the last survey. Sentence 5 applies the same rule to publication. Because a year often passes between the survey and the index taking effect, many indexes stay in force well beyond what the two-year rule seems to suggest.</p>
${h.table(['City', 'Data reference date', 'Latest reference date of the update', 'Latest reference date of a new edition'], fristen.map((f) => [enStadt(f.s), h.date(f.stichtag), h.date(f.anpassung), h.date(f.neu)]), 'Deadlines under Section 558d(2) BGB counted from the reference date stated in each index', ['l', 'r', 'r', 'r'])}
<p>The table uses only reference dates that the cities give as a calendar date and adds two and four years. It shows the latest data date the next version must refer to, not the day it has to appear. ${vorbei.length ? `For ${vorbei.map((f) => enStadt(f.s)).join(' and ')} that point has already passed; whether the next edition meets it will only show from its own reference date.` : ''} Next in line ${naechste.namen.length > 1 ? 'are' : 'is'} ${naechste.en.join(' and ')}, on ${h.date(naechste.datum)}. The small calculator above works out the same dates for your own city once you enter the month and year of the reference date given in the index or its method report.</p>
<p>What if a city misses the deadline? The index loses its presumption but does not become void. Section 558a(4) BGB expressly lets a landlord base an increase on an outdated index, or on the index of a comparable town, when no index meeting the deadlines exists. In a dispute those figures weigh less, and either side can ask for an expert valuation.</p>

<h2>What the landlord must quote from a qualified index</h2>
<p>The rule with the most practical bite is Section 558a(3) BGB. If an up-to-date qualified index has figures for your flat, the landlord must state them in his increase letter even when he justifies the increase by something else: three comparable flats, a rent database (Mietdatenbank) or an expert report. He cannot sidestep the presumption by keeping quiet about it. In every letter, check:</p>
<ul>
<li>Does it name the field or calculation from the index, with the range and the mean or the computed value?</li>
<li>Are the features the landlord used correct: year of construction, floor area, location, fittings?</li>
<li>Is the demanded rent inside the range? Under Section 558a(4) sentence 1 BGB that is enough to justify the letter; whether the rent is also right on the merits is a second question.</li>
<li>Is the ${h.a('kappungsgrenze', 'increase cap')} respected? The index says nothing about how far your rent may rise within three years.</li>
</ul>
<p>Berlin and Hamburg allow their tables to be reproduced, so the calculator shows the matching value with its row and field there (${h.src('berlinMs', 'Berlin rent index 2026')}, ${h.src('hamburgMs', 'Hamburg rent index 2025')}). For other cities it links to the city’s own online calculator, because their reservation of rights rules out copying the figures. The ${h.a('mietspiegel', 'rent index page')} explains where to find each one.</p>

<h2>A three-step check</h2>
<ol>
<li>Find out whether your index is qualified and which reference date it states.</li>
<li>Count two and four years from that date; if your increase letter is dated later and there has been no update, the index no longer carries the presumption.</li>
<li>Compare the demanded rent with the value for your flat and let the ${h.a('mieterhoehung-rechner', 'rent increase calculator')} check the cap and the deadlines.</li>
</ol>
`,
  },
});
