import { defineGuide } from '../../lib/guide-types';
import { minderung } from '../../lib/engine/miete';
import { addDays } from '../../lib/engine/dates';
import { formatMoney } from '../../lib/format';

// Coût d'une semaine de retard dans l'avis : loyer brut 950 €, taux supposé 15 %, 7, 21 et 60 jours.
const brutto = 950, quote = 0.15;
const tage = [7, 21, 60].map((n) => ({ n, r: minderung({ kalt: brutto, nebenkosten: 0, quote, von: '2026-01-05', bis: addDays('2026-01-05', n - 1) }) }));
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');

export default defineGuide({
  id: 'maengelanzeige',
  group: 'vertrag',
  order: 80,
  mini: 'mangeltage',
  miniHref: 'mietminderung-rechner',
  related: ['mietminderung', 'mietminderung-rechner', 'kaution-zurueck', 'heizkostenabrechnung', 'nebenkosten'],
  sources: ['bgb536c', 'bgb536a', 'bgb536', 'bgb536b'],
  de: {
    slug: 'maengelanzeige',
    nav: 'Mängelanzeige',
    card: 'Warum die Anzeige zählt und was hineingehört.',
    title: 'Mängelanzeige an den Vermieter 2026: Inhalt, Form, Folgen',
    description: 'Mängelanzeige 2026 nach § 536c BGB: unverzüglich melden, was hineingehört, wie Sie den Zugang belegen und was Sie verlieren, wenn der Vermieter nichts erfährt.',
    h1: 'Mängelanzeige: den Mangel richtig melden',
    intro: 'Wer einen Mangel nicht meldet, verliert unter Umständen Minderung, Schadensersatz und das Recht zur fristlosen Kündigung.',
    resume: `Zeigt sich während der Mietzeit ein Mangel, muss der Mieter ihn dem Vermieter unverzüglich anzeigen (§ 536c Abs. 1 BGB). Das gilt auch, wenn eine Maßnahme zum Schutz der Wohnung gegen eine unvorhergesehene Gefahr nötig wird, etwa bei einem Rohrbruch, oder wenn ein Dritter ein Recht an der Wohnung beansprucht. Unterlässt der Mieter die Anzeige, haftet er für den Schaden, der daraus entsteht. Und soweit der Vermieter deshalb nicht abhelfen konnte, verliert der Mieter drei Rechte: die Mietminderung, den Schadensersatz nach § 536a BGB und die fristlose Kündigung ohne vorherige Fristsetzung. Eine bestimmte Form schreibt das Gesetz nicht vor, aber eine schriftliche Anzeige mit Datum, Beschreibung und Fotos ist der sicherste Beweis. Jede Woche zählt: Bei ${eD(brutto, 0)} Bruttomiete und einer angenommenen Minderungsquote von 15 Prozent sind 21 Tage ${eD(tage[1].r.summe)} wert. Eine Anzeige ist zugleich der Anfang jeder Lösung, denn erst mit ihr muss der Vermieter tätig werden.`,
    faqs: [
      { q: 'Was bedeutet unverzüglich bei einer Mängelanzeige?', a: 'Ohne schuldhaftes Zögern, also so schnell, wie es Ihnen unter den Umständen zumutbar ist. Bei einem Wasserschaden oder einem Heizungsausfall im Winter heißt das sofort, bei einem tropfenden Wasserhahn innerhalb weniger Tage. Eine starre Frist nennt das Gesetz nicht. Je länger Sie warten, desto eher kann der Vermieter einwenden, ein Schaden sei durch die späte Meldung größer geworden.' },
      { q: 'Muss ich einen Mangel melden, den der Vermieter schon kennt?', a: 'Nicht noch einmal, wenn er nachweislich Bescheid weiß, etwa weil er selbst den Schaden gesehen hat oder ein anderer Mieter den Mangel am gemeinsamen Dach gemeldet hat. Sicherer ist trotzdem eine eigene kurze Anzeige, weil Sie im Streit beweisen müssen, dass der Vermieter Kenntnis hatte. Die eigene Anzeige kostet nichts und schließt diese Lücke.' },
      { q: 'Darf ich einen Mangel selbst beseitigen und die Kosten verlangen?', a: 'Nur in zwei Fällen: wenn der Vermieter mit der Beseitigung in Verzug ist, also nach Anzeige und Fristsetzung nicht gehandelt hat, oder wenn die sofortige Beseitigung nötig ist, um die Wohnung zu erhalten, etwa bei einem Rohrbruch am Wochenende (§ 536a Abs. 2 BGB). Dann können Sie Ersatz der erforderlichen Aufwendungen verlangen. Ohne diese Voraussetzungen tragen Sie die Kosten selbst.' },
      { q: 'Wie beweise ich, dass meine Mängelanzeige angekommen ist?', a: 'Am sichersten mit einem Einwurf in den Briefkasten des Vermieters oder der Hausverwaltung vor einem Zeugen, der den Inhalt gesehen hat, oder per Bote. Eine E-Mail an die bekannte Adresse ist ebenfalls eine Anzeige, ihr Zugang ist aber im Streit schwerer zu belegen. Heben Sie eine Kopie mit Datum und Fotos auf.' },
      { q: 'Was passiert, wenn der Vermieter auf die Mängelanzeige nicht reagiert?', a: 'Die Miete ist trotzdem gemindert, solange der Mangel besteht, und zwar kraft Gesetzes ab dem Zeitpunkt, an dem er auftritt, soweit die Anzeige nicht zu spät kam. Setzen Sie eine angemessene Frist zur Beseitigung. Verstreicht sie, gerät der Vermieter in Verzug; dann sind Schadensersatz und Selbstbeseitigung möglich, und bei erheblichen Mängeln die fristlose Kündigung.' },
    ],
    body: (h) => `
<h2>Warum die Anzeige so viel Gewicht hat</h2>
<p>Das Mietrecht verteilt die Pflichten klar: Der Vermieter muss die Wohnung in einem zum vertragsgemäßen Gebrauch geeigneten Zustand erhalten, der Mieter muss ihm Mängel melden, die er bemerkt. Denn der Vermieter wohnt nicht in der Wohnung und erfährt sonst oft nichts von einem Schaden. ${h.src('bgb536c', '§ 536c BGB')} knüpft deshalb harte Folgen an eine fehlende Anzeige. Wer schweigt, haftet für den Schaden, der durch das Schweigen entsteht, zum Beispiel wenn sich ein kleiner Wasserfleck zu einem Schimmelbefall ausweitet. Und er verliert, soweit der Vermieter nicht abhelfen konnte, die Rechte, die ihm der Mangel sonst gäbe.</p>
<h2>Was in die Mängelanzeige gehört</h2>
<ol>
<li><strong>Wer und wo.</strong> Ihr Name, die Adresse und die Lage der Wohnung im Haus.</li>
<li><strong>Was.</strong> Eine genaue Beschreibung: welcher Raum, welches Bauteil, wie groß, seit wann. „Feuchter Fleck von etwa 40 mal 60 Zentimetern an der Außenwand im Schlafzimmer, seit dem 5. Januar sichtbar“ ist besser als „Schimmel“.</li>
<li><strong>Belege.</strong> Fotos mit Datum, bei Heizung oder Warmwasser gemessene Temperaturen, bei Lärm ein Protokoll mit Uhrzeiten.</li>
<li><strong>Folgen.</strong> Was Sie in der Nutzung einschränkt, etwa dass ein Zimmer nicht beheizt werden kann.</li>
<li><strong>Frist.</strong> Eine angemessene Frist zur Beseitigung, je nach Dringlichkeit von wenigen Tagen bis zu einigen Wochen.</li>
<li><strong>Vorbehalt.</strong> Der Hinweis, dass Sie die Miete ab Auftreten des Mangels nur unter Vorbehalt zahlen. Damit sichern Sie die Rückforderung, auch wenn Sie zunächst voll weiterzahlen.</li>
</ol>
<h2>Was eine späte Meldung kosten kann</h2>
<p>Die Minderung tritt kraft Gesetzes ein, sobald der Mangel die Tauglichkeit der Wohnung herabsetzt (${h.src('bgb536', '§ 536 BGB')}). Konnte der Vermieter aber mangels Anzeige nicht abhelfen, entfällt sie für die Zeit, in der er hätte abhelfen können. Wie viel das ausmacht, zeigt die Tabelle für eine Bruttomiete von ${h.eur(brutto, 0)} und eine angenommene Quote von 15 Prozent. Die Quote selbst legt kein Gesetz fest; sie hängt von der Schwere des Mangels ab.</p>
${h.table(['Zeitraum', 'Tage', 'Minderung'], tage.map(({ n, r }) => [`ab dem 5. Januar 2026`, n, h.eur(r.summe, 2)]), `Taggenaue Minderung, Bruttomiete ${h.eur(brutto, 0)}, angenommene Quote 15 %`, ['l', 'r', 'r'])}
<p>Der Mietminderungsrechner rechnet diesen Betrag für Ihre eigene Miete und Ihren Zeitraum. Warum es keine verlässliche Tabelle für die Quote gibt und wie die Minderung wirkt, erklärt die Seite ${h.a('mietminderung', 'Mietminderung')}.</p>
<h2>Mängel, die schon beim Einzug da waren</h2>
<p>Für Mängel, die Sie bei Vertragsschluss kannten, gibt es keine Minderung und keinen Schadensersatz (${h.src('bgb536b', '§ 536b BGB')}). Waren sie Ihnen grob fahrlässig unbekannt, nur, wenn der Vermieter sie arglistig verschwiegen hat. Und wer eine mangelhafte Wohnung in Kenntnis des Mangels übernimmt, muss sich seine Rechte bei der Übergabe vorbehalten. Deshalb lohnt ein genaues Übergabeprotokoll mit allen sichtbaren Schäden, Zählerständen und Fotos. Es schützt Sie auch beim Auszug, wenn es um die ${h.a('kaution-zurueck', 'Rückzahlung der Kaution')} geht.</p>
<h2>Schadensersatz und Selbsthilfe</h2>
<p>Neben der Minderung kann der Mieter Schadensersatz verlangen, wenn der Mangel schon bei Vertragsschluss bestand, später durch einen Umstand entsteht, den der Vermieter zu vertreten hat, oder wenn der Vermieter mit der Beseitigung in Verzug ist (${h.src('bgb536a', '§ 536a Abs. 1 BGB')}). Typisch sind beschädigte Möbel nach einem Wasserschaden, für den eine bekannte, aber nicht reparierte Leitung verantwortlich war. Selbst beseitigen und die Kosten verlangen darf der Mieter, wenn der Vermieter in Verzug ist oder die sofortige Beseitigung zur Erhaltung der Wohnung notwendig ist. In beiden Fällen ist die vorherige Anzeige der Weg, auf dem der Verzug überhaupt eintritt.</p>
<h2>Gemeinschaftsflächen und Nachbarn</h2>
<p>Auch Mängel außerhalb der Wohnung können die Wohnung beeinträchtigen: ein defekter Aufzug, eine kaputte Haustür, eine ausgefallene Heizung im ganzen Haus. Melden Sie sie ebenfalls, auch wenn Sie annehmen, andere hätten es schon getan. Mehrere Anzeigen schaden nicht, eine fehlende kann sehr wohl schaden. Bei Lärm durch Nachbarn ist der Vermieter der richtige Adressat, weil er gegenüber dem störenden Mieter einschreiten kann. Bei Heizungsausfall, Wasserschaden oder Stromausfall im ganzen Haus hat die Hausverwaltung meist eine Notrufnummer; nutzen Sie sie und schicken Sie die schriftliche Anzeige trotzdem hinterher, damit Datum und Inhalt festgehalten sind.</p>
`,
  },
  en: {
    slug: 'reporting-defects',
    nav: 'Reporting defects',
    card: 'Why reporting matters and what to include.',
    title: 'Reporting Defects to the Landlord 2026: Content and Effect',
    description: 'Reporting defects 2026 under Section 536c BGB: report without delay, what to include, how to prove receipt and what you lose if the landlord never hears.',
    h1: 'Reporting a defect (Mängelanzeige): doing it right',
    intro: 'If you do not report a defect, you may lose rent reduction, damages and the right to terminate without notice.',
    resume: `If a defect appears during the tenancy, a German tenant must report it to the landlord without delay (Section 536c(1) of the Civil Code). The same applies when a measure is needed to protect the flat against an unforeseen danger, such as a burst pipe, or when a third party claims a right to the flat. If you fail to report, you are liable for the damage that results. And as far as the landlord could not fix the problem because of that, you lose three rights: rent reduction (Mietminderung), damages under Section 536a, and termination without notice without first setting a deadline. The law prescribes no particular form, but a written report with date, description and photos is the safest proof. Every week counts: with gross rent of ${eE(brutto, 0)} and an assumed reduction rate of 15 per cent, 21 days are worth ${eE(tage[1].r.summe)}. A report is also the start of any solution, because only then must the landlord act.`,
    faqs: [
      { q: 'What does without delay mean for a defect report?', a: 'Without culpable hesitation, so as quickly as can reasonably be expected in the circumstances. For water damage or a heating failure in winter that means immediately; for a dripping tap within a few days. The law sets no fixed deadline. The longer you wait, the more the landlord can argue that the late report made the damage worse.' },
      { q: 'Do I have to report a defect the landlord already knows about?', a: 'Not again if he demonstrably knows, for example because he saw the damage himself or another tenant reported the defect in the shared roof. A short report of your own is still safer, because in a dispute you must prove the landlord knew. Your own report costs nothing and closes that gap.' },
      { q: 'May I fix a defect myself and claim the costs?', a: 'Only in two cases: if the landlord is in default with the repair, meaning he did nothing after your report and deadline, or if immediate repair is needed to preserve the flat, such as a burst pipe at the weekend (Section 536a(2) of the Civil Code). Then you can claim the necessary expenses. Without these conditions you bear the costs yourself.' },
      { q: 'How do I prove my defect report arrived?', a: 'Most safely by putting it in the letterbox of the landlord or property manager in front of a witness who saw the contents, or by messenger. An e-mail to the known address is also a report, but its receipt is harder to prove in a dispute. Keep a copy with date and photos.' },
      { q: 'What if the landlord does not respond to my report?', a: 'The rent is still reduced while the defect lasts, by law from the moment it occurs, as long as your report was not too late. Set a reasonable deadline for the repair. Once it passes, the landlord is in default; then damages and self-help become possible, and for serious defects termination without notice.' },
    ],
    body: (h) => `
<h2>Why the report carries so much weight</h2>
<p>Tenancy law splits the duties clearly: the landlord must keep the flat fit for its agreed use, and the tenant must report defects he notices. The landlord does not live in the flat and would often not learn of damage otherwise. ${h.src('bgb536c', 'Section 536c BGB')} therefore attaches tough consequences to a missing report. A tenant who stays silent is liable for the damage his silence causes, for instance when a small damp patch spreads into mould. And as far as the landlord could not remedy the defect, he loses the rights the defect would otherwise give him.</p>
<h2>What goes into the report</h2>
<ol>
<li><strong>Who and where.</strong> Your name, the address and the position of the flat in the building.</li>
<li><strong>What.</strong> A precise description: which room, which part, how large, since when. “Damp patch about 40 by 60 centimetres on the outer wall of the bedroom, visible since 5 January” beats “mould”.</li>
<li><strong>Evidence.</strong> Dated photos, measured temperatures for heating or hot water, a log with times for noise.</li>
<li><strong>Effects.</strong> How it limits your use, for example that a room cannot be heated.</li>
<li><strong>Deadline.</strong> A reasonable deadline for the repair, from a few days to a few weeks depending on urgency.</li>
<li><strong>Reservation.</strong> A note that from the appearance of the defect you pay rent only under reservation. That secures a later refund even if you keep paying in full at first.</li>
</ol>
<h2>What a late report can cost</h2>
<p>The reduction applies by law as soon as the defect impairs the flat's use (${h.src('bgb536', 'Section 536 BGB')}). If the landlord could not remedy it for lack of a report, however, it lapses for the time in which he could have fixed it. The table shows what that means for gross rent of ${h.eur(brutto, 0)} and an assumed rate of 15 per cent. No statute sets the rate itself; it depends on how serious the defect is.</p>
${h.table(['Period', 'Days', 'Reduction'], tage.map(({ n, r }) => [`from 5 January 2026`, n, h.eur(r.summe, 2)]), `Day-by-day reduction, gross rent ${h.eur(brutto, 0)}, assumed rate 15%`, ['l', 'r', 'r'])}
<p>The rent reduction calculator works this out for your own rent and period. Why there is no reliable table for the rate and how the reduction works is explained on the ${h.a('mietminderung', 'rent reduction')} page.</p>
<h2>Defects that existed when you moved in</h2>
<p>For defects you knew of when signing there is no reduction and no damages (${h.src('bgb536b', 'Section 536b BGB')}). If you did not know of them through gross negligence, only if the landlord fraudulently concealed them. And if you take over a defective flat knowing of the defect, you must reserve your rights at the handover. That is why a detailed handover record with all visible damage, meter readings and photos pays off. It protects you at move-out too, when the ${h.a('kaution-zurueck', 'deposit refund')} is at stake.</p>
<h2>Damages and self-help</h2>
<p>Besides the reduction, a tenant can claim damages if the defect existed when the lease was signed, arises later from something the landlord is responsible for, or if the landlord is in default with the repair (${h.src('bgb536a', 'Section 536a(1) BGB')}). A typical case is furniture damaged by water from a known but unrepaired pipe. The tenant may fix the defect himself and claim the costs if the landlord is in default or the immediate repair is necessary to preserve the flat. In both cases the prior report is what puts the landlord in default in the first place.</p>
<h2>Shared areas and neighbours</h2>
<p>Defects outside the flat can affect it too: a broken lift, a damaged front door, heating failing for the whole building. Report them as well, even if you assume others already have. Several reports do no harm; a missing one can. For noise from neighbours the landlord is the right person to tell, because he can act against the disruptive tenant. For heating failure, water damage or a power cut in the whole building, the property manager usually has an emergency number; use it and still send the written report afterwards so the date and content are on record.</p>
`,
  },
});
