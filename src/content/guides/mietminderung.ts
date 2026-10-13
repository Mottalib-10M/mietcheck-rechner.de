import { defineGuide } from '../../lib/guide-types';
import { minderung } from '../../lib/engine/miete';
import { formatMoney, formatPercent } from '../../lib/format';

// Beispiel : 820 € kalt, 230 € Vorauszahlung, eine selbst gewählte Quote von 15 Prozent (keine Empfehlung).
const KALT = 820, NK = 230, Q = 0.15;
const brutto = minderung({ kalt: KALT, nebenkosten: NK, quote: Q, von: '2026-03-01', bis: '2026-03-31' });
const kalt = minderung({ kalt: KALT, nebenkosten: 0, quote: Q, von: '2026-03-01', bis: '2026-03-31' });
// Ein Mangel vom 12. Februar bis 20. April 2026 : taggenaue Summe.
const zeitraum = minderung({ kalt: KALT, nebenkosten: NK, quote: Q, von: '2026-02-12', bis: '2026-04-20' });
// Wäre die Quote zu hoch und schuldete man doch die volle Miete: aufgelaufener Rückstand.
const MONATE = [1, 3, 6, 9, 12].map((m) => ({ m, rueck: brutto.monat * m }));
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const qD = formatPercent(Q, 0, 'de'), qE = formatPercent(Q, 0, 'en');

export default defineGuide({
  id: 'mietminderung',
  group: 'vertrag',
  order: 70,
  mini: 'minderung',
  miniHref: 'mietminderung-rechner',
  related: ['mietminderung-rechner', 'maengelanzeige', 'heizkostenabrechnung', 'mietkaution', 'nebenkosten'],
  sources: ['bgb536', 'bgb536b', 'bgb536c', 'bgb556b', 'bgb569', 'bgb536a'],
  de: {
    slug: 'mietminderung',
    nav: 'Mietminderung',
    card: 'Wann die Miete sinkt, auf welche Miete gerechnet wird und warum es keine Quotentabelle gibt.',
    title: 'Mietminderung 2026: Voraussetzungen, Bruttomiete, Risiken',
    description: 'Mietminderung 2026: wann die Miete bei einem Mangel nach § 536 BGB von selbst sinkt, warum die Bruttomiete zählt und was eine zu hohe Kürzung Sie kostet.',
    h1: 'Mietminderung: wann Sie weniger zahlen und wie viel',
    intro: 'Die Miete sinkt bei einem Mangel von selbst, aber die richtige Höhe nennt Ihnen kein Gesetz und keine Tabelle.',
    resume: `Hat die Wohnung einen Mangel, der ihre Tauglichkeit zum vertragsgemäßen Gebrauch mindert, zahlen Sie für diese Zeit nur eine angemessen herabgesetzte Miete; ist die Tauglichkeit ganz aufgehoben, entfällt die Miete (§ 536 Abs. 1 BGB). Die Minderung tritt kraft Gesetzes ein, Sie müssen sie weder beantragen noch genehmigen lassen. Voraussetzung ist, dass Sie den Mangel unverzüglich anzeigen (§ 536c BGB) und ihn nicht schon bei Vertragsschluss kannten (§ 536b BGB). Unerhebliche Beeinträchtigungen zählen nicht, und bei einer energetischen Modernisierung bleibt eine Minderung drei Monate lang außer Betracht. Gerechnet wird auf die Bruttomiete einschließlich Nebenkosten, so der Bundesgerichtshof im Urteil XII ZR 225/03. Bei ${eD(KALT, 0)} kalt und ${eD(NK, 0)} Vorauszahlung macht eine selbst gewählte Quote von ${qD} ${eD(brutto.monat)} im Monat aus statt ${eD(kalt.monat)} auf die Kaltmiete. Eine amtliche Quotentabelle gibt es nicht; wer zu hoch kürzt, baut einen Rückstand auf, der nach einigen Monaten eine Kündigung tragen kann.`,
    faqs: [
      { q: 'Muss ich die Mietminderung beim Vermieter beantragen?', a: 'Nein. § 536 BGB ordnet die Minderung selbst an: Für die Zeit des Mangels sind Sie von der Miete ganz oder teilweise befreit, ohne dass der Vermieter zustimmen oder ein Gericht entscheiden muss. Sie müssen den Mangel aber anzeigen. Teilen Sie außerdem schriftlich mit, dass und ab wann Sie mindern; das verhindert Missverständnisse und dokumentiert Ihre Position.' },
      { q: 'Kann ich mindern, wenn ich den Mangel schon beim Einzug kannte?', a: 'In der Regel nicht. Kennt der Mieter den Mangel bei Vertragsschluss, stehen ihm die Rechte aus §§ 536 und 536a nicht zu (§ 536b BGB). Ist ihm der Mangel grob fahrlässig entgangen, nur dann, wenn der Vermieter ihn arglistig verschwiegen hat. Nehmen Sie die Wohnung in Kenntnis eines Mangels an, müssen Sie sich Ihre Rechte bei der Übergabe ausdrücklich vorbehalten, am besten im Protokoll.' },
      { q: 'Darf ich während einer energetischen Sanierung die Miete mindern?', a: 'Für die ersten drei Monate nicht, soweit die Beeinträchtigung auf einer Maßnahme beruht, die einer energetischen Modernisierung nach § 555b Nr. 1 BGB dient (§ 536 Abs. 1a BGB), etwa der Dämmung der Fassade. Danach gilt die normale Minderung. Für andere Arbeiten im selben Zeitraum, etwa einen neuen Aufzug oder einen Balkonanbau, greift der Ausschluss nicht.' },
      { q: 'Was riskiere ich, wenn ich die Miete zu stark mindere?', a: `Stellt sich die Quote als zu hoch heraus, schulden Sie die Differenz von Anfang an, und sie zählt als Mietrückstand. Bei ${eD(brutto.monat)} im Monat sind nach einem Jahr ${eD(MONATE[4].rueck)} aufgelaufen, mehr als eine Bruttomiete. Ein solcher Rückstand kann eine fristlose Kündigung wegen Zahlungsverzugs tragen. Wer unsicher ist, zahlt unter Vorbehalt weiter und fordert später zurück.` },
      { q: 'Kann ich zu viel gezahlte Miete später mit der nächsten Miete verrechnen?', a: 'Ja, aber mit Vorlauf: § 556b Abs. 2 BGB erlaubt die Aufrechnung mit einem Anspruch wegen zu viel gezahlter Miete oder auf Schadensersatz nach § 536a auch gegen eine Vertragsklausel, wenn Sie die Absicht mindestens einen Monat vor Fälligkeit der Miete in Textform angekündigt haben. Ohne diese Ankündigung riskieren Sie, dass die Verrechnung an einer Klausel im Mietvertrag scheitert.' },
      { q: 'Darf der Mietvertrag eine Mietminderung ausschließen?', a: 'Nicht bei Wohnraum. § 536 Abs. 4 BGB erklärt jede Vereinbarung für unwirksam, die zum Nachteil des Mieters von den Minderungsregeln abweicht. Eine Klausel wie Minderung ausgeschlossen oder nur nach Zustimmung des Vermieters ist daher nichtig. Zulässig bleibt nur die Regel des § 556b Abs. 2 BGB, nach der eine Aufrechnung einen Monat vorher in Textform angekündigt werden muss.' },
    ],
    body: (h) => `
<h2>Was ein Mangel im Sinne des Gesetzes ist</h2>
<p>${h.src('bgb536', '§ 536 BGB')} kennt drei Arten von Mängeln. Ein Sachmangel liegt vor, wenn die Wohnung von dem Zustand abweicht, den der Vertrag voraussetzt, und das ihre Tauglichkeit zum vertragsgemäßen Gebrauch beeinträchtigt: Heizung fällt aus, Wasser dringt ein, Schimmel breitet sich aus, Fenster schließen nicht. Gleich behandelt wird das Fehlen einer zugesicherten Eigenschaft (Abs. 2), etwa eines im Vertrag ausdrücklich zugesagten Stellplatzes oder einer Einbauküche. Und ein Rechtsmangel (Abs. 3) liegt vor, wenn ein Dritter Ihnen den Gebrauch ganz oder teilweise entzieht, zum Beispiel weil der Vermieter einen Kellerraum doppelt vermietet hat.</p>
<p>Es kommt auf die Wirkung an, nicht auf die Ursache. Auch Baulärm vom Nachbargrundstück oder eine defekte Gemeinschaftsanlage können die Tauglichkeit mindern. Wer den Mangel verschuldet hat, spielt für die Minderung keine Rolle; es sei denn, Sie selbst haben ihn verursacht.</p>

<h2>Drei Stufen: frei, gemindert, unerheblich</h2>
<ul>
<li><strong>Tauglichkeit aufgehoben:</strong> Sie sind für diese Zeit ganz von der Miete befreit, etwa wenn die Wohnung nach einem Wasserschaden unbewohnbar ist.</li>
<li><strong>Tauglichkeit gemindert:</strong> Sie zahlen eine angemessen herabgesetzte Miete. Das ist der Normalfall.</li>
<li><strong>Unerhebliche Minderung:</strong> bleibt außer Betracht, etwa ein kurz tropfender Wasserhahn, der sofort repariert wird.</li>
</ul>
<p>Eine Sonderregel gilt bei energetischer Modernisierung: Für drei Monate bleibt eine Minderung außer Betracht, soweit sie auf einer Maßnahme nach § 555b Nr. 1 BGB beruht (§ 536 Abs. 1a). Alles andere kann der Mietvertrag nicht einschränken; jede Abweichung zum Nachteil des Mieters ist bei Wohnraum unwirksam (§ 536 Abs. 4).</p>

<h2>Warum wir keine Quotentabelle veröffentlichen</h2>
<p>Im Netz kursieren Tabellen, die für Schimmel, Heizungsausfall oder Lärm feste Prozentsätze nennen. Das Gesetz kennt solche Werte nicht; es verlangt eine angemessen herabgesetzte Miete. Diese Tabellen sammeln Urteile zu Einzelfällen, oft Jahrzehnte alt, mit Umständen, die sich selten auf Ihre Wohnung übertragen lassen. Ein Heizungsausfall im Juli ist etwas anderes als im Januar, Schimmel hinter dem Schrank im Flur etwas anderes als im Kinderzimmer. Eine Zahl aus einer Tabelle erweckt eine Sicherheit, die es nicht gibt, und genau diese Sicherheit kann teuer werden.</p>
<p>Was die Höhe bestimmt, lässt sich aber benennen: wie viel der Wohnfläche betroffen ist und welche Räume, wie stark und wie oft die Beeinträchtigung auftritt, zu welcher Jahreszeit, und ob eine Gesundheitsgefahr besteht. Besprechen Sie die Quote mit Ihrem Mieterverein oder einer öffentlichen Mieterberatung. Der kleine Rechner oben und der ${h.a('mietminderung-rechner', 'Mietminderung-Rechner')} zeigen dann, was die gewählte Quote in Euro bedeutet.</p>

<h2>Die Bemessungsgrundlage ist die Bruttomiete</h2>
<p>Gemindert wird die Gesamtmiete einschließlich der Nebenkosten, gleich ob als Vorauszahlung oder Pauschale vereinbart. Das hat der Bundesgerichtshof im Urteil vom 6. April 2005 entschieden (XII ZR 225/03). Für eine Wohnung mit ${h.eur(KALT, 0)} Kaltmiete und ${h.eur(NK, 0)} Vorauszahlung bedeutet eine Quote von ${h.pct(Q, 0)} ${h.eur(brutto.monat, 2)} im Monat; nur auf die Kaltmiete gerechnet wären es ${h.eur(kalt.monat, 2)}. Dauert der Mangel vom ${h.date('2026-02-12')} bis ${h.date('2026-04-20')}, ergibt die taggenaue Rechnung ${h.eur(zeitraum.summe, 2)} für ${zeitraum.tage} Tage. Die Nebenkostenabrechnung ändert sich dadurch nicht: Die Vorauszahlungen gelten als voll geleistet, die Minderung betrifft die Miete als Ganzes.</p>

<h2>Voraussetzungen und Fallstricke</h2>
<p>Erstens die Anzeige: Nach ${h.src('bgb536c', '§ 536c BGB')} müssen Sie einen Mangel unverzüglich melden. Soweit der Vermieter wegen einer unterlassenen Anzeige nicht abhelfen konnte, können Sie nicht mindern. Wie eine gute Anzeige aussieht, steht auf der Seite ${h.a('maengelanzeige', 'Mängelanzeige')}. Zweitens die Kenntnis: Wer den Mangel bei Vertragsschluss kannte, kann nicht mindern; wer eine mangelhafte Wohnung in Kenntnis des Mangels übernimmt, muss sich die Rechte vorbehalten (${h.src('bgb536b', '§ 536b BGB')}).</p>
<p>Drittens das Risiko einer zu hohen Quote. Die Miete ist bis zum dritten Werktag fällig. Kürzen Sie mehr, als angemessen ist, entsteht in Höhe der Differenz ein Rückstand. Die Tabelle zeigt, wie sich ein Rückstand aufbaut, wenn sich herausstellt, dass gar keine Minderung berechtigt war:</p>
${h.table(['Monate gekürzt', 'aufgelaufener Rückstand', 'mehr als eine Bruttomiete?'], MONATE.map((x) => [String(x.m), h.eur(x.rueck, 2), x.rueck > brutto.brutto ? 'ja' : 'nein']), `Quote ${h.pct(Q, 0)} auf ${h.eur(brutto.brutto, 0)} Bruttomiete, wenn die Minderung unberechtigt war`, ['r', 'r', 'l'])}
<p>Ein Rückstand, der die Miete für einen Monat übersteigt, gilt nach ${h.src('bgb569', '§ 569 Abs. 3 Nr. 1 BGB')} als nicht unerheblich und kann zusammen mit § 543 BGB eine fristlose Kündigung wegen Zahlungsverzugs tragen. Wer unsicher ist, zahlt deshalb die volle Miete unter Vorbehalt weiter und fordert den Minderungsbetrag später zurück. Für die Verrechnung mit künftigen Mieten verlangt ${h.src('bgb556b', '§ 556b Abs. 2 BGB')} eine Ankündigung in Textform mindestens einen Monat vor Fälligkeit.</p>

<h2>Neben der Minderung: Schadensersatz und Selbsthilfe</h2>
<p>Die Minderung gleicht nur den geringeren Wert der Wohnung aus. Sind Ihnen darüber hinaus Schäden entstanden, etwa an Möbeln durch einen Wasserschaden, kommt Schadensersatz nach ${h.src('bgb536a', '§ 536a BGB')} in Betracht, wenn der Mangel schon bei Vertragsschluss bestand, der Vermieter ihn zu vertreten hat oder mit der Beseitigung in Verzug ist. Ist er in Verzug, dürfen Sie den Mangel auch selbst beseitigen lassen und die erforderlichen Kosten verlangen. Bei Heizungsmängeln prüfen Sie zusätzlich die ${h.a('heizkostenabrechnung', 'Heizkostenabrechnung')}.</p>
`,
  },
  en: {
    slug: 'rent-reduction',
    nav: 'Rent reduction',
    card: 'When rent falls, which rent the reduction applies to and why there is no rate table.',
    title: 'Rent Reduction 2026: Conditions, Gross Rent Basis, Risks',
    description: 'Rent reduction Germany 2026: when rent drops by law for a defect under Section 536 BGB, why the gross rent is the basis and what cutting too much costs.',
    h1: 'Rent reduction in Germany: when you pay less, and how much',
    intro: 'Rent drops automatically when your flat has a defect, but no law and no table tells you the right amount.',
    resume: `If your flat has a defect that impairs its fitness for normal use, German law lets you pay only an appropriately reduced rent for that period; if the flat is unusable, no rent is due (Section 536(1) of the Civil Code, BGB). This rent reduction (Mietminderung) happens by operation of law: you do not have to apply for it or get permission. The conditions are that you report the defect without delay (Section 536c BGB) and did not already know of it when signing (Section 536b BGB). Trivial impairments do not count, and during energy-saving modernisation no reduction applies for three months. The reduction is calculated on the gross rent including service charges, as the Federal Court of Justice held in case XII ZR 225/03. With ${eE(KALT, 0)} base rent and ${eE(NK, 0)} in advances, a rate of ${qE} that you choose yourself is worth ${eE(brutto.monat)} a month, against ${eE(kalt.monat)} on the base rent alone. There is no official table of rates; cut too much and you build up arrears that, after some months, can justify termination.`,
    faqs: [
      { q: 'Do I need my landlord’s approval to reduce the rent?', a: 'No. Section 536 BGB itself reduces the rent: for the duration of the defect you are wholly or partly released from paying, without the landlord’s consent or a court ruling. You must report the defect, though. It is also wise to tell the landlord in writing that you are reducing and from when, which avoids misunderstandings and documents your position.' },
      { q: 'Can I reduce the rent for a defect I knew about when I moved in?', a: 'Usually not. A tenant who knew of the defect when signing loses the rights under Sections 536 and 536a (Section 536b BGB). If you missed it through gross negligence, you keep them only if the landlord concealed it fraudulently. If you accept the flat knowing of a defect, you must expressly reserve your rights at handover, ideally in the handover record.' },
      { q: 'Can I reduce the rent while the building is being insulated?', a: 'Not for the first three months, as far as the disruption comes from work serving energy-saving modernisation under Section 555b No. 1 BGB (Section 536(1a) BGB), such as insulating the façade. After that the normal rules apply. Other work during the same period, such as a new lift or added balconies, is not covered by this exclusion.' },
      { q: 'What happens if I reduce my rent by too much?', a: `If your rate turns out too high, you owe the difference from the start, and it counts as rent arrears. At ${eE(brutto.monat)} a month, ${eE(MONATE[4].rueck)} has built up after a year, more than one month’s gross rent. Arrears like that can support termination without notice for non-payment. If unsure, keep paying in full under reservation and claim the money back later.` },
      { q: 'Can I offset rent I overpaid against future rent?', a: 'Yes, with notice: Section 556b(2) BGB allows you to offset a claim for overpaid rent or for damages under Section 536a, even against a lease clause, if you announced it in text form at least one month before the rent falls due. Without that notice, the offset may fail because of a clause in your lease.' },
      { q: 'Can a lease clause rule out rent reduction?', a: 'Not for residential tenancies. Section 536(4) BGB makes any agreement that departs from the reduction rules to the tenant’s disadvantage void. A clause saying reduction is excluded, or only with the landlord’s consent, has no effect. The only permitted restriction is the one in Section 556b(2) BGB: offsetting must be announced one month ahead in text form.' },
    ],
    body: (h) => `
<h2>What the law treats as a defect</h2>
<p>${h.src('bgb536', 'Section 536 BGB')} covers three kinds of defect. A physical defect (Sachmangel) exists when the flat departs from the condition the lease assumes and this impairs its fitness for normal use: the heating fails, water comes in, mould spreads, windows do not close. A missing assured feature (Section 536(2)) is treated the same way, for example a parking space or fitted kitchen the lease expressly promised. And a legal defect (Section 536(3)) exists when a third party’s rights deprive you of use, say because the landlord let the same cellar room twice.</p>
<p>What matters is the effect, not the cause. Building noise from next door or a broken shared facility can also impair the flat. Who caused the defect is irrelevant for reduction, unless you caused it yourself.</p>

<h2>Three levels: no rent, reduced rent, no change</h2>
<ul>
<li><strong>Fitness removed:</strong> no rent is due for that time, for example if a burst pipe makes the flat uninhabitable.</li>
<li><strong>Fitness reduced:</strong> you pay an appropriately reduced rent. This is the normal case.</li>
<li><strong>Trivial impairment:</strong> ignored, for example a dripping tap that is fixed straight away.</li>
</ul>
<p>One special rule covers energy-saving modernisation: for three months, any reduction caused by work under Section 555b No. 1 BGB is disregarded (Section 536(1a)). Everything else is beyond the reach of the lease; any departure to the tenant’s disadvantage is void for residential lets (Section 536(4)).</p>

<h2>Why we publish no table of rates</h2>
<p>Online you will find tables giving fixed percentages for mould, heating failure or noise. The law contains no such figures; it requires an appropriately reduced rent. Those tables collect court decisions on individual cases, often decades old, whose facts rarely match your flat. Heating failing in July is not the same as in January, and mould behind a hallway cupboard is not the same as in a child’s bedroom. A number from a table suggests a certainty that does not exist, and that false certainty can cost you.</p>
<p>What drives the amount can still be named: how much of the floor area is affected and which rooms, how strong and how frequent the problem is, the season, and whether health is at risk. Discuss the rate with your tenants’ association (Mieterverein) or a public tenancy advice service. The small calculator above and the ${h.a('mietminderung-rechner', 'rent reduction calculator')} then show what your chosen rate means in euros.</p>

<h2>The basis is the gross rent</h2>
<p>The reduction applies to the whole rent including service charges, whether paid as advances or a flat rate. The Federal Court of Justice (Bundesgerichtshof) decided this on 6 April 2005 (XII ZR 225/03). For a flat at ${h.eur(KALT, 0)} base rent and ${h.eur(NK, 0)} advances, a rate of ${h.pct(Q, 0)} means ${h.eur(brutto.monat, 2)} a month; on the base rent alone it would be ${h.eur(kalt.monat, 2)}. If the defect lasts from ${h.date('2026-02-12')} to ${h.date('2026-04-20')}, the day-by-day calculation gives ${h.eur(zeitraum.summe, 2)} for ${zeitraum.tage} days. Your service-charge statement does not change: the advances count as fully paid, and the reduction applies to the rent as a whole.</p>

<h2>Conditions and pitfalls</h2>
<p>First, notice: under ${h.src('bgb536c', 'Section 536c BGB')} you must report a defect without delay. Where the landlord could not fix it because you stayed silent, you cannot reduce. The ${h.a('maengelanzeige', 'reporting defects page')} shows what a good notice contains. Second, knowledge: if you knew of the defect when signing, you cannot reduce, and if you accept a defective flat knowingly, you must reserve your rights (${h.src('bgb536b', 'Section 536b BGB')}).</p>
<p>Third, the risk of setting the rate too high. Rent is due by the third working day of the month. If you cut more than is appropriate, the difference becomes arrears. The table shows how arrears build up if it turns out no reduction was justified at all:</p>
${h.table(['Months reduced', 'Arrears built up', 'More than one month’s gross rent?'], MONATE.map((x) => [String(x.m), h.eur(x.rueck, 2), x.rueck > brutto.brutto ? 'yes' : 'no']), `Rate of ${h.pct(Q, 0)} on ${h.eur(brutto.brutto, 0)} gross rent, where the reduction was not justified`, ['r', 'r', 'l'])}
<p>Arrears exceeding one month’s rent count as significant under ${h.src('bgb569', 'Section 569(3) No. 1 BGB')} and, together with Section 543 BGB, can support termination without notice for non-payment. If in doubt, keep paying the full rent under reservation (unter Vorbehalt) and reclaim the reduction later. To offset it against future rent, ${h.src('bgb556b', 'Section 556b(2) BGB')} requires notice in text form at least one month before the rent is due.</p>

<h2>Beyond reduction: damages and self-help</h2>
<p>Reduction only compensates for the flat being worth less. If you suffered further loss, such as furniture ruined by a leak, damages under ${h.src('bgb536a', 'Section 536a BGB')} are possible where the defect existed at signing, the landlord is responsible for it, or he is late in fixing it. If he is in default, you may also have the defect repaired yourself and claim the necessary costs. For heating problems, check your ${h.a('heizkostenabrechnung', 'heating-cost statement')} as well.</p>
`,
  },
});
