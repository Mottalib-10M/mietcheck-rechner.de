import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { staffel } from '../../lib/engine/miete';
import { addMonths, endOfMonth } from '../../lib/engine/dates';
import { formatMoney, displayDate } from '../../lib/format';

const S = P.staffel;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');
const WORT = ['null', 'ein', 'zwei', 'drei', 'vier', 'fünf'], WORD = ['zero', 'one', 'two', 'three', 'four', 'five'];
const kD = WORT[S.kuendigungsausschluss_jahre], kE = WORD[S.kuendigungsausschluss_jahre];
const aufD = Math.round(P.mpb.aufschlag * 100);

/* Beispiel: Vertrag in einer Gemeinde mit Mietpreisbremse, 70 m², angenommene Vergleichsmiete 12 €/m²,
   unterschrieben am 15. Dezember 2025, Mietbeginn 1. Februar 2026, vier Stufen. */
const FL = 70, OVM = 12, ABSCHLUSS = '2025-12-15';
const STUFEN = [{ ab: '2026-02-01', miete: 880 }, { ab: '2027-02-01', miete: 910 }, { ab: '2028-01-01', miete: 940 }, { ab: '2029-01-01', miete: 970 }];
const st = staffel(STUFEN, { ovm: OVM, flaeche: FL, gebiet: true });
const grenze = st[0].grenze!;
const zuFrueh = st.filter((x) => !x.abstandOk);
const ueber = st.filter((x) => x.ueber > 0);
const letzte = st[st.length - 1];
const kuendigungFrueh = addMonths(ABSCHLUSS, 12 * S.kuendigungsausschluss_jahre);
// Die Mieterkündigung wirkt zum Monatsende (§ 573c Abs. 1 BGB): erstes mögliches Mietende.
const mietende = endOfMonth(kuendigungFrueh);
const KM = P.kuendigung.mieter_monate;
const fruehesteStufe = zuFrueh.length ? addMonths(st[st.indexOf(zuFrueh[0]) - 1].ab, S.min_monate) : '';
const ueberJahr = ueber.length ? ueber[ueber.length - 1].ueber * 12 : 0;
// Nach der letzten Stufe: Erhöhungsverlangen nach § 558 frühestens nach der Wartefrist.
const naechstes558 = addMonths(letzte.ab, P.erhoehung.wartefrist_monate);

export default defineGuide({
  id: 'staffelmiete',
  group: 'erhoehung',
  order: 80,
  mini: 'staffel',
  miniHref: 'mietpreisbremse-rechner',
  related: ['indexmiete', 'mietpreisbremse', 'mietpreisbremse-rechner', 'kappungsgrenze', 'kuendigungsfrist-rechner', 'mieterhoehung'],
  sources: ['bgb557a', 'bgb556d', 'bgb556g', 'bgb558', 'bgb560'],
  de: {
    slug: 'staffelmiete',
    nav: 'Staffelmiete',
    card: 'Feste Erhöhungen im Vertrag: Form, Abstand, Kündigungsverzicht, Grenze.',
    title: 'Staffelmiete 2026: Regeln, Mietpreisbremse und Kündigung',
    description: 'Staffelmiete 2026: Schriftform, Beträge in Euro, mindestens ein Jahr je Stufe, Kündigungsverzicht bis vier Jahre und die Mietpreisbremse für jede neue Stufe.',
    h1: 'Staffelmiete: was der Vertrag festlegen darf und was nicht',
    intro: 'Bei einer Staffelmiete stehen alle künftigen Erhöhungen schon im Vertrag, dafür sind andere Mieterhöhungen ausgeschlossen.',
    resume: `Eine Staffelmiete nach § 557a BGB legt im Mietvertrag fest, wie hoch die Miete in bestimmten Zeiträumen ist. Die Vereinbarung braucht die Schriftform, jede Stufe muss als Miete oder als Erhöhung in Euro ausgewiesen sein, und zwischen zwei Stufen muss mindestens ein Jahr liegen. Solange die Staffel läuft, sind Erhöhungen auf die Vergleichsmiete und wegen Modernisierung nach §§ 558 bis 559b ausgeschlossen; Betriebskosten dürfen sich weiter ändern. Das Kündigungsrecht des Mieters kann für höchstens ${kD} Jahre ab Abschluss ausgeschlossen werden. In Gemeinden mit Mietpreisbremse gilt die Grenze von Vergleichsmiete plus ${aufD} Prozent für jede Stufe, gemessen an dem Tag, an dem die Stufe fällig wird. Beispiel: ${FL} m², Vergleichsmiete ${eD(OVM)} je m², Grenze also ${eD(grenze)}. Stufen von ${eD(STUFEN[0].miete, 0)} bis ${eD(letzte.miete, 0)}: ${ueber.length ? `Ab dem ${dD(ueber[0].ab)} läge die Miete bei unveränderter Vergleichsmiete über der Grenze, zuletzt um ${eD(letzte.ueber)} im Monat.` : 'Alle Stufen bleiben unter der Grenze.'}`,
    faqs: [
      { q: 'Darf eine Staffelmiete in Prozent statt in Euro vereinbart werden?', a: `Nein. § 557a Abs. 1 BGB verlangt, dass die jeweilige Miete oder die jeweilige Erhöhung in einem Geldbetrag ausgewiesen ist. „Jährlich drei Prozent mehr“ genügt nicht, auch wenn sich der Betrag ausrechnen ließe. Eine solche Klausel ist als Staffelmiete unwirksam; es bleibt bei der Ausgangsmiete, und der Vermieter kann nur nach den allgemeinen Regeln erhöhen, also bis zur Vergleichsmiete mit Kappungsgrenze.` },
      { q: 'Wie lange kann ich bei einer Staffelmiete nicht kündigen?', a: `Höchstens ${kD} Jahre ab Abschluss der Staffelmietvereinbarung, und die Kündigung ist frühestens zum Ablauf dieses Zeitraums zulässig. Wer am ${dD(ABSCHLUSS)} unterschreibt, ist bis zum ${dD(kuendigungFrueh)} gebunden; weil die Kündigung zum Monatsende wirkt, endet der Vertrag frühestens am ${dD(mietende)}. Aussprechen dürfen Sie die Kündigung schon vorher, mit der gesetzlichen Frist von ${WORT[KM]} Monaten. Ein längerer Ausschluss ist nicht wirksam. Fehlt eine Klausel, gilt die normale Kündigungsfrist ab dem ersten Tag.` },
      { q: 'Kann der Vermieter während einer Staffelmiete modernisieren und die Miete deshalb erhöhen?', a: 'Modernisieren darf er, und Sie müssen die Arbeiten nach den allgemeinen Regeln dulden. Eine Mieterhöhung wegen Modernisierung ist aber ausgeschlossen, solange die Staffel läuft, denn § 557a Abs. 2 BGB sperrt die §§ 558 bis 559b. Erst nach der letzten Stufe kann er wieder nach diesen Vorschriften vorgehen. Steigende Betriebskosten darf er dagegen jederzeit über die Abrechnung weitergeben.' },
      { q: 'Was passiert mit meiner Miete nach der letzten Stufe?', a: `Sie bleibt auf der Höhe der letzten Stufe, bis der Vermieter eine Erhöhung nach den allgemeinen Regeln verlangt. Die Wartefrist läuft ab dieser letzten Stufe: Ein Erhöhungsverlangen auf die Vergleichsmiete ist frühestens ${P.erhoehung.wartefrist_monate} Monate danach möglich, im Beispiel ab dem ${dD(naechstes558)}. Für die Kappungsgrenze zählen die Staffelerhöhungen der letzten drei Jahre mit, weil sie keine Erhöhungen nach §§ 559 bis 560 sind.` },
      { q: 'Was gilt, wenn eine Stufe weniger als ein Jahr nach der vorigen beginnt?', a: `Dann hält die Vereinbarung § 557a Abs. 2 BGB nicht ein, wonach die Miete jeweils mindestens ein Jahr unverändert bleiben muss. Eine Abweichung zum Nachteil des Mieters ist unwirksam, die Stufe kann also zu dem zu frühen Termin nicht verlangt werden. Im Beispiel beginnt eine Stufe am ${dD(zuFrueh[0]?.ab ?? STUFEN[0].ab)}, obwohl ein Jahr erst am ${dD(fruehesteStufe || STUFEN[0].ab)} um ist. Zahlen Sie dort vorerst die alte Stufe weiter.` },
    ],
    body: (h) => `
<h2>Was eine Staffelmiete ausmacht</h2>
<p>Bei einer Staffelmiete vereinbaren Mieter und Vermieter schon im Vertrag, wie sich die Miete entwickelt: ab Februar 2026 so viel, ab Februar 2027 so viel. Der Vermieter verzichtet damit auf alle anderen Wege, die Miete zu erhöhen. Der Mieter weiß im Voraus, was auf ihn zukommt, trägt aber das Risiko, dass die Stufen schneller steigen als der Markt. Die Regeln dafür stehen in ${h.src('bgb557a', '§ 557a BGB')}, und keine davon darf zum Nachteil des Mieters abbedungen werden.</p>
<h3>Form und Inhalt</h3>
<ul>
<li><strong>Schriftform.</strong> Die Staffelmiete muss schriftlich vereinbart sein, also in einer von beiden Seiten unterschriebenen Urkunde, in der Regel im Mietvertrag selbst. Eine E-Mail oder eine nachträgliche Mitteilung des Vermieters reicht nicht.</li>
<li><strong>Beträge in Euro.</strong> Jede Stufe nennt die neue Miete oder die Erhöhung als Geldbetrag. Prozentangaben oder ein Verweis auf eine Formel genügen nicht.</li>
<li><strong>Mindestens ein Jahr.</strong> Die Miete muss jeweils mindestens ${S.min_monate} Monate unverändert bleiben. Eine Höchstzahl an Stufen oder eine Höchstlaufzeit kennt das Gesetz nicht.</li>
</ul>
<h3>Was während der Staffel ausgeschlossen ist</h3>
<p>Solange die Staffel läuft, ist eine Erhöhung nach den §§ 558 bis 559b BGB ausgeschlossen. Das betrifft die Erhöhung auf die ${h.a('vergleichsmiete', 'ortsübliche Vergleichsmiete')} ebenso wie die Umlage von Modernisierungskosten. Die ${h.a('kappungsgrenze', 'Kappungsgrenze')} spielt deshalb während der Staffel keine Rolle, denn es gibt keine Erhöhung nach § 558, die sie begrenzen könnte. Nicht gesperrt ist ${h.src('bgb560', '§ 560 BGB')}: Vorauszahlungen auf die Betriebskosten kann der Vermieter nach einer Abrechnung anpassen, und eine vereinbarte Pauschale kann er erhöhen, wenn der Vertrag das vorsieht.</p>

<h2>Kündigungsverzicht bis zu ${kD} Jahren</h2>
<p>Mit der Staffelmiete darf der Vermieter einen Kündigungsverzicht des Mieters verbinden, aber nur für höchstens ${kD} Jahre seit Abschluss der Staffelmietvereinbarung. Die Kündigung ist frühestens zum Ablauf dieses Zeitraums zulässig. Gezählt wird ab der Unterschrift, nicht ab dem Einzug. Wer am ${h.date(ABSCHLUSS)} unterschreibt und am ${h.date(STUFEN[0].ab)} einzieht, ist bis zum ${h.date(kuendigungFrueh)} gebunden. Da die Kündigung des Mieters zum Ende eines Monats wirkt, endet der Vertrag frühestens am ${h.date(mietende)}. Mit der Frist von ${WORT[KM]} Monaten lässt sich im ${h.a('kuendigungsfrist-rechner', 'Kündigungsfrist-Rechner')} ausrechnen, wann das Schreiben spätestens ankommen muss. Ein Verzicht für länger als ${kD} Jahre ist nicht wirksam.</p>

<h2>Die Mietpreisbremse gilt für jede Stufe</h2>
<p>Liegt die Wohnung in einer Gemeinde, für die eine Landesverordnung nach ${h.src('bgb556d', '§ 556d BGB')} gilt, darf schon die erste Miete die Vergleichsmiete um höchstens ${aufD} Prozent übersteigen. Bei der Staffelmiete kommt eine Besonderheit hinzu: § 557a Abs. 4 BGB wendet die Mietpreisbremse auf jede einzelne Stufe an. Für die zweite und jede weitere Stufe zählt nicht der Mietbeginn, sondern der Tag, an dem die erste Miete dieser Stufe fällig wird. Maßgeblich ist dann die Vergleichsmiete zu diesem Zeitpunkt, und die Gemeinde muss an diesem Tag noch unter die Verordnung fallen. Eine Miethöhe, die in einer früheren Stufe wirksam begründet war, bleibt erhalten.</p>
<p>Das Beispiel: ${h.num(FL, 0)} m², Mietvertrag unterschrieben am ${h.date(ABSCHLUSS)}, angenommene Vergleichsmiete ${h.eur(OVM, 2)} je m², die wir der Einfachheit halber über die ganze Laufzeit konstant halten. Die Grenze liegt bei ${h.eur(grenze, 2)} im Monat.</p>
${h.table(['Stufe ab', 'Miete', 'Erhöhung', 'Abstand mindestens ein Jahr', 'Grenze der Mietpreisbremse', 'darüber'], st.map((x) => [h.date(x.ab), h.eur(x.miete, 2), x.plus ? h.eur(x.plus, 2) : 'Ausgangsmiete', x.abstandOk ? 'ja' : 'nein', h.eur(x.grenze!, 2), x.ueber ? h.eur(x.ueber, 2) : 'nein']), 'Staffelmiete mit vier Stufen bei angenommener Vergleichsmiete', ['l', 'r', 'r', 'l', 'r', 'r'])}
<p>Zwei Fehler stecken in dieser Staffel. ${zuFrueh.length ? `Die Stufe ab dem ${h.date(zuFrueh[0].ab)} kommt zu früh: Ein Jahr nach der vorigen Stufe ist erst am ${h.date(fruehesteStufe)} um. Bis dahin schulden Sie die vorige Stufe.` : ''} ${ueber.length ? `Und ab dem ${h.date(ueber[0].ab)} läge die Miete über der Grenze der Mietpreisbremse, wenn die Vergleichsmiete gleich bliebe. In der letzten Stufe wären das ${h.eur(letzte.ueber, 2)} im Monat oder ${h.eur(ueberJahr, 2)} im Jahr.` : ''} Steigt die Vergleichsmiete bis zur Fälligkeit einer Stufe, steigt auch die Grenze mit; prüfen Sie deshalb jede Stufe mit dem Mietspiegel, der an ihrem Fälligkeitstag gilt, im ${h.a('mietpreisbremse-rechner', 'Mietpreisbremse-Rechner')} oder mit dem Mini-Rechner oben.</p>
<p>Zu viel gezahlte Miete aus einer Stufe fordern Sie wie bei jeder ${h.a('mietpreisbremse', 'Mietpreisbremse')} mit einer Rüge in Textform zurück; die Grenzen des Rückforderungszeitraums stehen in ${h.src('bgb556g', '§ 556g Abs. 2 BGB')}. Für Verträge, die geschlossen wurden, bevor die Gemeinde in eine Verordnung aufgenommen wurde, enthält Art. 229 § 35 EGBGB eine Übergangsregel, nach der Absatz 4 nicht anzuwenden ist.</p>

<h2>Staffel, Index oder Vergleichsmiete?</h2>
<p>Ein Mietvertrag kennt genau einen Weg, auf dem die Kaltmiete steigt. Ohne besondere Vereinbarung erhöht der Vermieter nach ${h.src('bgb558', '§ 558 BGB')} bis zur Vergleichsmiete, begrenzt durch die Kappungsgrenze und die Sperrfristen. Bei einer Staffelmiete stehen die Erhöhungen im Vertrag. Bei einer ${h.a('indexmiete', 'Indexmiete')} folgt die Miete dem Verbraucherpreisindex. Die Unterschiede, die im Alltag zählen:</p>
<ul>
<li><strong>Planbarkeit.</strong> Die Staffel ist auf den Euro genau bekannt, die Indexmiete hängt von der Inflation ab, die Vergleichsmiete vom nächsten Mietspiegel.</li>
<li><strong>Mietpreisbremse.</strong> Sie gilt bei der Staffel für jede Stufe, bei der Indexmiete nur für die Ausgangsmiete.</li>
<li><strong>Modernisierung.</strong> Während der Staffel ist eine Umlage ausgeschlossen, bei der Indexmiete nur in engen Fällen möglich, sonst nach den allgemeinen Regeln.</li>
<li><strong>Nach dem Ende.</strong> Nach der letzten Stufe gelten wieder die allgemeinen Regeln; ein Verlangen nach § 558 ist frühestens ${P.erhoehung.wartefrist_monate} Monate nach dieser Stufe möglich, im Beispiel ab dem ${h.date(naechstes558)}.</li>
</ul>
<p>Wer einen Vertrag mit Staffel unterschreiben soll, prüft zuerst, ob die erste Stufe die Mietpreisbremse einhält, dann den Abstand der Stufen, die Form und die Dauer eines Kündigungsverzichts. Wie sich eine Erhöhung nach dem Ende der Staffel berechnet, zeigt die Seite zur ${h.a('mieterhoehung', 'Mieterhöhung')}.</p>
`,
  },
  en: {
    slug: 'graduated-rent',
    nav: 'Graduated rent',
    card: 'Fixed rises written into the lease: form, intervals, notice waiver, ceiling.',
    title: 'Graduated Rent 2026: Rules, Rent Brake and Notice Waiver',
    description: 'Graduated rent (Staffelmiete) 2026: written form, steps in euros, at least a year per step, notice waiver of up to four years and the rent brake on every step.',
    h1: 'Graduated rent: what the lease may fix in advance',
    intro: 'With a graduated rent every future rise is already in the lease, and in return other rent increases are ruled out.',
    resume: `A graduated rent (Staffelmiete) under Section 557a of the German Civil Code (BGB) sets out in the lease what the rent will be for successive periods. The agreement must be in writing, each step must state the rent or the rise as an amount in euros, and at least a year must pass between two steps. While the steps run, the landlord cannot raise the rent to the local reference rent or pass on modernisation costs under Sections 558 to 559b; service charges can still change. The tenant’s right to give notice may be excluded for no more than ${kE} years from signing. Where the rent brake (Mietpreisbremse) applies, the ceiling of reference rent plus ${aufD} per cent applies to every step, measured on the day that step falls due. Example: ${FL} m², reference rent ${eE(OVM)} per m², so a ceiling of ${eE(grenze)}. Steps rise from ${eE(STUFEN[0].miete, 0)} to ${eE(letzte.miete, 0)}: ${ueber.length ? `from ${dE(ueber[0].ab)}, with an unchanged reference rent, the rent would exceed the ceiling, by ${eE(letzte.ueber)} a month in the last step.` : 'every step stays below the ceiling.'}`,
    faqs: [
      { q: 'Can a graduated rent be set in percentages rather than euros?', a: 'No. Section 557a(1) BGB requires each rent or each rise to be stated as an amount of money. “Three per cent more every year” is not enough, even though the figure could be worked out. Such a clause does not work as a graduated rent; the starting rent stays, and the landlord can only raise it under the general rules, up to the reference rent and subject to the increase cap.' },
      { q: 'How long can a graduated-rent lease stop me from giving notice?', a: `For at most ${kE} years from signing the graduated-rent agreement, and notice can take effect no earlier than the end of that period. If you sign on ${dE(ABSCHLUSS)}, you are bound until ${dE(kuendigungFrueh)}; since notice takes effect at the end of a month, the tenancy can end on ${dE(mietende)} at the earliest. You may send the notice before then, with the usual ${WORD[KM]} months. A longer waiver is not valid. Without such a clause, the normal notice period applies from day one.` },
      { q: 'Can my landlord modernise during a graduated rent and charge more for it?', a: 'He may modernise, and you have to tolerate the work under the general rules. But a rent increase for modernisation is ruled out while the steps run, because Section 557a(2) BGB blocks Sections 558 to 559b. Only after the last step can he use those provisions again. Rising service charges, on the other hand, can be passed on through the annual statement at any time.' },
      { q: 'What happens to my rent after the last step?', a: `It stays at the level of the last step until the landlord asks for an increase under the general rules. The waiting period runs from that last step: a demand to raise the rent to the reference rent is possible ${P.erhoehung.wartefrist_monate} months later at the earliest, from ${dE(naechstes558)} in the example. The steps of the past three years count towards the increase cap, since they are not increases under Sections 559 to 560.` },
      { q: 'What if a step starts less than a year after the previous one?', a: `Then the agreement breaches Section 557a(2) BGB, under which the rent must stay unchanged for at least a year each time. A term to the tenant’s disadvantage is void, so the step cannot be claimed on the early date. In the example, one step starts on ${dE(zuFrueh[0]?.ab ?? STUFEN[0].ab)} although a full year only ends on ${dE(fruehesteStufe || STUFEN[0].ab)}. Until then, keep paying the previous step.` },
    ],
    body: (h) => `
<h2>What a graduated rent is</h2>
<p>With a graduated rent, landlord and tenant agree in the lease how the rent will develop: this much from February 2026, that much from February 2027. In return the landlord gives up every other way of raising the rent. You know in advance what you will pay, but you carry the risk that the steps rise faster than the market. The rules are in ${h.src('bgb557a', 'Section 557a BGB')}, and none of them can be varied to the tenant’s disadvantage.</p>
<h3>Form and content</h3>
<ul>
<li><strong>In writing.</strong> The graduated rent must be agreed in writing (Schriftform), meaning a document signed by both parties, usually the lease itself. An e-mail or a later notice from the landlord is not enough.</li>
<li><strong>Amounts in euros.</strong> Each step states the new rent or the rise as a sum of money. Percentages or a formula do not qualify.</li>
<li><strong>At least a year.</strong> The rent must stay unchanged for at least ${S.min_monate} months at a time. The law sets no maximum number of steps and no maximum term.</li>
</ul>
<h3>What is ruled out while the steps run</h3>
<p>As long as the graduated rent runs, increases under Sections 558 to 559b BGB are excluded. That covers raising the rent to the ${h.a('vergleichsmiete', 'local reference rent')} as well as passing on modernisation costs. The ${h.a('kappungsgrenze', 'increase cap')} therefore plays no part during the steps, because there is no increase under Section 558 for it to limit. ${h.src('bgb560', 'Section 560 BGB')} is not blocked: the landlord may adjust service-charge advances after a statement, and raise an agreed flat rate if the lease allows it.</p>

<h2>A notice waiver of up to ${kE} years</h2>
<p>A landlord may combine a graduated rent with the tenant giving up the right to terminate, but only for up to ${kE} years from the date the graduated-rent agreement was made. Notice can take effect no earlier than the end of that period. The clock starts at signing, not on moving in. If you sign on ${h.date(ABSCHLUSS)} and move in on ${h.date(STUFEN[0].ab)}, you are bound until ${h.date(kuendigungFrueh)}. Because a tenant’s notice takes effect at the end of a month, the tenancy can end on ${h.date(mietende)} at the earliest. The ${h.a('kuendigungsfrist-rechner', 'notice period calculator')} shows when a letter with the usual ${WORD[KM]} months’ notice must arrive. A waiver for more than ${kE} years is not valid.</p>

<h2>The rent brake applies to every step</h2>
<p>If the flat is in a municipality covered by a state ordinance under ${h.src('bgb556d', 'Section 556d BGB')}, even the first rent may exceed the reference rent by no more than ${aufD} per cent. A graduated rent adds a twist: Section 557a(4) BGB applies the rent brake to each step. For the second and every later step, what counts is not the start of the tenancy but the day the first rent of that step falls due. The reference rent on that day is the yardstick, and the municipality must still be covered by the ordinance at that point. A rent level validly reached in an earlier step is kept.</p>
<p>The example: ${h.num(FL, 0)} m², lease signed on ${h.date(ABSCHLUSS)}, an assumed reference rent of ${h.eur(OVM, 2)} per m², which for simplicity we hold constant throughout. The ceiling is ${h.eur(grenze, 2)} a month.</p>
${h.table(['Step from', 'Rent', 'Rise', 'At least a year apart', 'Rent-brake ceiling', 'Above it'], st.map((x) => [h.date(x.ab), h.eur(x.miete, 2), x.plus ? h.eur(x.plus, 2) : 'starting rent', x.abstandOk ? 'yes' : 'no', h.eur(x.grenze!, 2), x.ueber ? h.eur(x.ueber, 2) : 'no']), 'A four-step graduated rent with an assumed reference rent', ['l', 'r', 'r', 'l', 'r', 'r'])}
<p>This schedule contains two flaws. ${zuFrueh.length ? `The step from ${h.date(zuFrueh[0].ab)} comes too early: a year after the previous step only ends on ${h.date(fruehesteStufe)}, and until then you owe the previous step.` : ''} ${ueber.length ? `And from ${h.date(ueber[0].ab)} the rent would be above the rent-brake ceiling if the reference rent stayed put, by ${h.eur(letzte.ueber, 2)} a month or ${h.eur(ueberJahr, 2)} a year in the last step.` : ''} If the reference rent rises before a step falls due, the ceiling rises too, so check each step against the rent index valid on its due date, in the ${h.a('mietpreisbremse-rechner', 'rent brake calculator')} or with the small calculator above.</p>
<p>Overpaid rent from a step is reclaimed as with any ${h.a('mietpreisbremse', 'rent brake')} case, with a complaint in text form; ${h.src('bgb556g', 'Section 556g(2) BGB')} sets how far back the refund reaches. For leases signed before the municipality was added to an ordinance, a transitional rule in Article 229 Section 35 of the Introductory Act to the Civil Code (EGBGB) disapplies subsection 4.</p>

<h2>Graduated, index-linked or reference rent?</h2>
<p>A German lease has exactly one route by which the base rent goes up. Without a special clause, the landlord raises it under ${h.src('bgb558', 'Section 558 BGB')} towards the reference rent, limited by the cap and waiting periods. With a graduated rent the rises are written into the lease. With an ${h.a('indexmiete', 'index-linked rent')} (Indexmiete) the rent tracks the consumer price index. The differences that matter day to day:</p>
<ul>
<li><strong>Predictability.</strong> A graduated rent is known to the euro; an index rent depends on inflation, the reference rent on the next rent index.</li>
<li><strong>Rent brake.</strong> It applies to every step of a graduated rent, but only to the starting rent of an index-linked lease.</li>
<li><strong>Modernisation.</strong> A surcharge is excluded during the steps, possible only in narrow cases under an index rent, and otherwise allowed under the general rules.</li>
<li><strong>After the end.</strong> After the last step the general rules apply again; a demand under Section 558 is possible ${P.erhoehung.wartefrist_monate} months after that step at the earliest, from ${h.date(naechstes558)} in the example.</li>
</ul>
<p>If you are asked to sign a lease with steps, check first whether the first step respects the rent brake, then the spacing of the steps, the form and the length of any notice waiver. How an increase works once the steps are over is explained on the ${h.a('mieterhoehung', 'rent increase page')}.</p>
`,
  },
});
