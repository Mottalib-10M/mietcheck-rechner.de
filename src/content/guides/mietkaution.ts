import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { kaution } from '../../lib/engine/miete';
import { formatMoney, displayDate } from '../../lib/format';

const K = P.kaution;
// Drei Wohnungen : Nettokaltmiete und Vorauszahlung.
const WHG = [
  { kalt: 640, nk: 180 },
  { kalt: 980, nk: 240 },
  { kalt: 1450, nk: 310 },
].map((w) => ({ ...w, r: kaution({ kaltmiete: w.kalt, beginn: '2026-12-01' }) }));
// Hauptbeispiel : 980 € kalt, Mietbeginn 1. Dezember 2026, Vermieter verlangt 3 600 €.
const haupt = WHG[1].r;
const zuviel = kaution({ kaltmiete: 980, verlangt: 3600 });
// Bürgschaft zusätzlich zu einer vollen Barkaution: Summe zählt gegen die Grenze.
const BUERG = 1500;
const kombi = kaution({ kaltmiete: 980, verlangt: haupt.hoechst + BUERG });
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietkaution',
  group: 'vertrag',
  order: 50,
  mini: 'kaution',
  miniHref: 'kaution-rechner',
  related: ['kaution-rechner', 'kaution-zurueck', 'nebenkosten', 'mietminderung', 'eigenbedarfskuendigung'],
  sources: ['bgb551', 'bgb569', 'bgb548'],
  de: {
    slug: 'mietkaution',
    nav: 'Mietkaution',
    card: 'Höchstbetrag, Raten, getrennte Anlage und welche Form der Sicherheit zulässig ist.',
    title: 'Mietkaution 2026: Höchstbetrag, Raten und sichere Anlage',
    description: 'Mietkaution 2026: höchstens drei Nettokaltmieten nach § 551 BGB, Zahlung in drei Raten, getrennte Anlage, Bürgschaft und fristlose Kündigung bei Verzug.',
    h1: 'Mietkaution: was der Vermieter verlangen darf und wie er sie anlegen muss',
    intro: 'Die Kaution ist Ihr Geld, das der Vermieter nur treuhänderisch verwahrt, und das Gesetz begrenzt sie unabhängig davon, was im Vertrag steht.',
    resume: `Die Mietkaution sichert die Ansprüche des Vermieters aus dem Mietverhältnis, etwa offene Mieten, Nachzahlungen oder Schäden. Nach § 551 Abs. 1 BGB darf sie höchstens das Dreifache der Monatsmiete ohne die als Pauschale oder Vorauszahlung ausgewiesenen Betriebskosten betragen. Bei ${eD(980, 0)} Nettokaltmiete und ${eD(240, 0)} Vorauszahlung sind das ${eD(haupt.hoechst)}. Diese Grenze gilt für alle Sicherheiten zusammen, also auch, wenn Barkaution und Bürgschaft kombiniert werden. Eine Geldkaution dürfen Sie in drei gleichen Monatsraten zahlen, hier also ${eD(haupt.rate)} zum Mietbeginn am ${dD(haupt.raten[0])} und je eine Rate mit den Mieten im ${dD(haupt.raten[1])} und ${dD(haupt.raten[2])}. Der Vermieter muss das Geld getrennt von seinem Vermögen bei einer Bank anlegen, mindestens zum üblichen Zins für Spareinlagen mit dreimonatiger Kündigungsfrist; die Zinsen gehören Ihnen. Geraten Sie mit Kautionszahlungen in Höhe von zwei Nettokaltmieten in Verzug, hier ${eD(haupt.verzugsgrenze)}, darf er nach § 569 Abs. 2a BGB fristlos kündigen.`,
    faqs: [
      { q: 'Wie hoch darf die Mietkaution 2026 höchstens sein?', a: `Höchstens das Dreifache der Nettokaltmiete, so § 551 Abs. 1 BGB. Betriebskosten, die als Pauschale oder Vorauszahlung ausgewiesen sind, bleiben außen vor. Bei ${eD(640, 0)} kalt sind es ${eD(WHG[0].r.hoechst)}, bei ${eD(1450, 0)} kalt ${eD(WHG[2].r.hoechst)}. Die Grenze ist zwingend: Ein Mietvertrag, der mehr verlangt, ist im Umfang des Überschusses unwirksam, und zu viel Gezahltes können Sie zurückfordern.` },
      { q: 'Muss der Vermieter die Kaution auf ein eigenes Konto legen?', a: 'Ja. § 551 Abs. 3 BGB verlangt eine Anlage getrennt vom Vermögen des Vermieters, im Regelfall auf einem Konto bei einer Bank zum üblichen Zinssatz für Spareinlagen mit dreimonatiger Kündigungsfrist. Diese Trennung schützt Ihr Geld, wenn der Vermieter in Insolvenz gerät oder seine Gläubiger vollstrecken. Bitten Sie um eine Bestätigung der Bank, auf der das Kautionskonto als solches bezeichnet ist.' },
      { q: 'Darf der Vermieter zusätzlich zur Barkaution eine Bürgschaft verlangen?', a: `Nur bis zur Grenze von drei Nettokaltmieten für alle Sicherheiten zusammen. Hat er bereits ${eD(haupt.hoechst)} in bar erhalten, ist eine zusätzliche Bürgschaft der Eltern über ${eD(BUERG, 0)} im Grundsatz unwirksam, weil die Summe ${eD(kombi.zuviel)} über der Grenze liegt. Zu viel gestellte Sicherheit können Sie zurückverlangen, bei einer Bürgschaft also die Herausgabe der Urkunde.` },
      { q: 'Ist eine Kautionsversicherung eine gute Alternative zur Barkaution?', a: 'Sie schont Ihre Liquidität, kostet aber jedes Jahr einen Beitrag, den Sie nicht zurückbekommen. Der Versicherer zahlt im Schadensfall an den Vermieter und holt sich das Geld anschließend bei Ihnen zurück. Ob sich das lohnt, hängt davon ab, wie lange Sie bleiben: Über viele Jahre summieren sich die Beiträge oft auf mehr, als die Zinsen einer Barkaution kosten würden. Der Vermieter muss diese Form nicht akzeptieren.' },
      { q: 'Bekomme ich im Studentenwohnheim Zinsen auf die Kaution?', a: 'Nicht zwingend. Für Wohnraum in einem Studenten- oder Jugendwohnheim nimmt § 551 Abs. 3 Satz 5 BGB den Vermieter von der Pflicht aus, die Kaution zu verzinsen. Die Höchstgrenze von drei Monatsmieten ohne Betriebskosten und Ihr Recht auf drei Raten gelten dagegen auch dort. Bei einem möblierten Zimmer zur Untermiete beim Vermieter selbst bleibt es ebenfalls bei diesen Regeln.' },
      { q: 'Was gilt, wenn im Mietvertrag eine höhere Kaution steht?', a: `Die Klausel ist nur insoweit unwirksam, als sie die Grenze überschreitet; der Rest bleibt gültig. Verlangt der Vermieter bei ${eD(980, 0)} kalt ${eD(3600, 0)}, schulden Sie ${eD(zuviel.hoechst)}, und ${eD(zuviel.zuviel)} können Sie zurückfordern, auch noch während des laufenden Mietverhältnisses. Dasselbe gilt für eine Klausel, die die Ratenzahlung ausschließt (§ 551 Abs. 4 BGB).` },
    ],
    body: (h) => `
<h2>Wozu die Kaution dient</h2>
<p>Die Mietsicherheit deckt alle Ansprüche des Vermieters aus dem Mietverhältnis: rückständige Miete, eine Nachzahlung aus der Betriebskostenabrechnung, Schadensersatz für Schäden über die normale Abnutzung hinaus, Kosten einer Räumung. Sie ist kein Vorschuss auf die letzte Miete. Wer in den letzten Monaten keine Miete mehr zahlt und auf die Kaution verweist, gerät in Verzug, denn die Kaution soll gerade für die Zeit nach dem Auszug zur Verfügung stehen, wenn Ansprüche erst sichtbar werden. Wann Sie sie zurückbekommen, steht auf der Seite ${h.a('kaution-zurueck', 'Kaution zurück')}.</p>

<h2>Die Höchstgrenze von drei Nettokaltmieten</h2>
<p>${h.src('bgb551', '§ 551 Abs. 1 BGB')} begrenzt jede Sicherheit, die Sie leisten müssen, auf das ${K.faktor}-Fache der Monatsmiete ohne die als Pauschale oder Vorauszahlung ausgewiesenen Betriebskosten. Ist eine Inklusivmiete ohne gesonderte Betriebskosten vereinbart, ist sie selbst die Grundlage. Für drei typische Wohnungen mit Mietbeginn am ${h.date('2026-12-01')}:</p>
${h.table(['Nettokaltmiete', 'Vorauszahlung', 'höchste Kaution', 'je Rate', 'fristlose Kündigung ab'], WHG.map((w) => [h.eur(w.kalt, 0), h.eur(w.nk, 0), h.eur(w.r.hoechst, 0), h.eur(w.r.rate, 2), h.eur(w.r.verzugsgrenze, 0) + ' Rückstand']), 'Kautionsgrenze, Raten und Verzugsgrenze nach §§ 551 und 569 BGB', ['r', 'r', 'r', 'r', 'r'])}
<p>Die Grenze gilt für alle Sicherheiten zusammen. Wer neben einer vollen Barkaution von ${h.eur(haupt.hoechst, 0)} noch eine Bürgschaft über ${h.eur(BUERG, 0)} verlangt, überschreitet sie um ${h.eur(kombi.zuviel, 0)}. Was über die Grenze hinausgeht, ist unwirksam; eine abweichende Vereinbarung zu Ihrem Nachteil lässt ${h.src('bgb551', '§ 551 Abs. 4 BGB')} nicht zu.</p>

<h2>Drei Raten, und was bei Verzug passiert</h2>
<p>Eine Geldkaution dürfen Sie in drei gleichen monatlichen Teilzahlungen leisten (§ 551 Abs. 2). Die erste ist zu Beginn des Mietverhältnisses fällig, also mit dem vereinbarten Mietbeginn, nicht schon bei Vertragsunterschrift. Die zweite und dritte werden zusammen mit den unmittelbar folgenden Mieten fällig. Im Beispiel mit ${h.eur(980, 0)} Nettokaltmiete sind das drei Raten zu ${h.eur(haupt.rate, 2)} am ${h.date(haupt.raten[0])}, ${h.date(haupt.raten[1])} und ${h.date(haupt.raten[2])}. Der kleine Rechner oben teilt jede Kaution so auf.</p>
<p>Zahlen Sie nicht, hat der Vermieter ein besonderes Kündigungsrecht: ${h.src('bgb569', '§ 569 Abs. 2a BGB')} erlaubt die fristlose Kündigung, wenn Sie mit einem Betrag in Höhe von zwei Monatsmieten im Verzug sind, wiederum ohne Betriebskosten gerechnet. Eine Abmahnung oder Frist zur Abhilfe ist nicht nötig. Die Kündigung wird aber unwirksam, wenn Sie den Rückstand spätestens zwei Monate nach Zustellung der Räumungsklage ausgleichen oder eine öffentliche Stelle sich dazu verpflichtet; das verweist auf § 569 Abs. 3 Nr. 2.</p>

<h2>Formen der Sicherheit</h2>
<ul>
<li><strong>Barkaution oder Überweisung:</strong> der Normalfall. Der Vermieter legt das Geld an.</li>
<li><strong>Verpfändetes Sparbuch oder Kautionskonto auf Ihren Namen:</strong> Das Konto gehört Ihnen, der Vermieter hat ein Pfandrecht und kann erst bei berechtigten Ansprüchen darauf zugreifen.</li>
<li><strong>Bankbürgschaft oder Bürgschaft einer Person:</strong> Der Bürge zahlt, wenn Sie nicht zahlen. Zählt voll gegen die Grenze.</li>
<li><strong>Kautionsversicherung:</strong> eine Bürgschaft gegen Jahresbeitrag. Der Vermieter muss sie nicht akzeptieren, und der Beitrag ist verloren.</li>
</ul>
<p>Andere Anlageformen als das Sparkonto, etwa ein Fonds, sind nach § 551 Abs. 3 Satz 2 erlaubt, wenn beide Seiten das vereinbaren. Auch dann muss die Anlage getrennt vom Vermögen des Vermieters erfolgen, und die Erträge stehen Ihnen zu; ein Verlust durch Kursschwankungen trifft dann allerdings Ihre Kaution.</p>

<h2>Getrennte Anlage und Zinsen</h2>
<p>Der Vermieter muss die Geldkaution bei einem Kreditinstitut zu dem für Spareinlagen mit dreimonatiger Kündigungsfrist üblichen Zinssatz anlegen, getrennt von seinem Vermögen (§ 551 Abs. 3 Satz 1 und 3). Die Trennung ist der eigentliche Schutz: Gerät der Vermieter in Insolvenz oder vollstrecken seine Gläubiger, bleibt ein offen ausgewiesenes Treuhandkonto Ihnen erhalten. Lassen Sie sich die Anlage deshalb bestätigen. Die Zinsen erhöhen die Sicherheit; sie werden nicht jährlich ausgezahlt, sondern wachsen der Kaution zu und kommen mit ihr zurück. In einem Studenten- oder Jugendwohnheim entfällt die Pflicht zur Verzinsung.</p>

<h2>Wenn Sie zu viel gezahlt haben</h2>
<p>Hat der Vermieter mehr als die zulässige Kaution erhalten, können Sie den Überschuss sofort zurückverlangen, nicht erst beim Auszug. Im Beispiel mit ${h.eur(3600, 0)} statt ${h.eur(zuviel.hoechst, 0)} sind das ${h.eur(zuviel.zuviel, 0)}. Schreiben Sie dem Vermieter, nennen Sie die Nettokaltmiete und die Grenze, und setzen Sie eine Frist. Mit dem ${h.a('kaution-rechner', 'Kaution-Rechner')} prüfen Sie Höchstbetrag, Raten und Zinsen für Ihren eigenen Vertrag. Ansprüche des Vermieters wegen Schäden an der Wohnung verjähren übrigens schon sechs Monate nach der Rückgabe (${h.src('bgb548', '§ 548 BGB')}), was für die Abrechnung der Kaution am Ende eine wichtige Rolle spielt.</p>
`,
  },
  en: {
    slug: 'rental-deposit',
    nav: 'Rental deposit',
    card: 'Maximum amount, instalments, separate account and which forms of security are allowed.',
    title: 'Rental Deposit 2026: Legal Maximum, Instalments, Safekeeping',
    description: 'Rental deposit (Mietkaution) 2026: at most three months of base rent, payable in three instalments, kept apart from the landlord’s money, guarantees, arrears.',
    h1: 'Rental deposit in Germany: what a landlord may ask and how he must hold it',
    intro: 'The deposit is your money, held in trust by the landlord, and the law caps it whatever your lease says.',
    resume: `A German rental deposit (Mietkaution) secures the landlord’s claims under the tenancy, such as unpaid rent, a service-charge top-up or damage. Under Section 551(1) of the Civil Code (BGB) it may not exceed three times the monthly rent excluding service charges shown as a flat rate or advance payment. With a base rent (Nettokaltmiete) of ${eE(980, 0)} and advances of ${eE(240, 0)}, the cap is ${eE(haupt.hoechst)}. The cap covers all forms of security together, so it also applies when a cash deposit is combined with a guarantee. A cash deposit can be paid in three equal monthly instalments: here ${eE(haupt.rate)} when the tenancy starts on ${dE(haupt.raten[0])}, then one with each of the rents due on ${dE(haupt.raten[1])} and ${dE(haupt.raten[2])}. The landlord must keep the money at a bank, separate from his own assets, earning at least the usual rate for savings with three months’ notice; the interest is yours. If you fall behind on the deposit by an amount equal to two months’ base rent, ${eE(haupt.verzugsgrenze)} here, he may terminate without notice under Section 569(2a) BGB.`,
    faqs: [
      { q: 'What is the maximum rental deposit in Germany in 2026?', a: `Three times the base rent, under Section 551(1) BGB. Service charges shown as a flat rate or advance payment are left out. On ${eE(640, 0)} base rent the cap is ${eE(WHG[0].r.hoechst)}, on ${eE(1450, 0)} it is ${eE(WHG[2].r.hoechst)}. The cap is mandatory: a lease asking for more is void as to the excess, and you can reclaim anything paid above the limit.` },
      { q: 'Does the landlord have to keep my deposit in a separate account?', a: 'Yes. Section 551(3) BGB requires the money to be kept apart from the landlord’s own assets, normally in a bank account paying the usual rate for savings with three months’ notice. That separation protects you if the landlord goes bankrupt or his creditors seize his assets. Ask for a bank confirmation that names the account as a rental deposit account.' },
      { q: 'Can a landlord ask for a guarantor on top of a cash deposit?', a: `Only up to the cap of three months’ base rent for all security combined. If he already holds ${eE(haupt.hoechst)} in cash, an extra guarantee (Bürgschaft) from your parents for ${eE(BUERG, 0)} is in principle void, because the total exceeds the cap by ${eE(kombi.zuviel)}. You can demand the excess back, which for a guarantee means the return of the guarantee document.` },
      { q: 'Is deposit insurance a good alternative to a cash deposit?', a: 'It keeps cash in your pocket but costs a yearly premium you never get back. If the landlord claims, the insurer pays him and then recovers the money from you. Whether it is worth it depends on how long you stay: over many years the premiums often add up to more than a cash deposit costs you in lost interest. The landlord does not have to accept it.' },
      { q: 'Will I earn interest on a deposit in student housing?', a: 'Not necessarily. For rooms in a student or youth hall of residence, Section 551(3), fifth sentence, BGB exempts the landlord from paying interest. The cap of three months’ rent without service charges and your right to pay in three instalments still apply there. In a furnished room inside the landlord’s own flat, these same rules on the cap and instalments apply too.' },
      { q: 'What if my lease asks for a higher deposit than allowed?', a: `The clause is void only to the extent it exceeds the cap; the rest stands. If the landlord asks for ${eE(3600, 0)} on ${eE(980, 0)} base rent, you owe ${eE(zuviel.hoechst)} and can reclaim ${eE(zuviel.zuviel)}, even while the tenancy is running. The same goes for a clause ruling out instalments (Section 551(4) BGB).` },
    ],
    body: (h) => `
<h2>What the deposit is for</h2>
<p>The deposit covers every claim the landlord may have under the tenancy: rent arrears, a top-up from the service-charge statement, compensation for damage beyond normal wear, costs of an eviction. It is not an advance on your last rent. If you stop paying in your final months and point to the deposit, you are in arrears, because the deposit is meant for the period after you leave, when claims come to light. When you get it back is explained on the ${h.a('kaution-zurueck', 'deposit refund page')}.</p>

<h2>The cap: three months’ base rent</h2>
<p>${h.src('bgb551', 'Section 551(1) BGB')} limits any security you have to provide to ${K.faktor} times the monthly rent without service charges shown as a flat rate (Pauschale) or advance (Vorauszahlung). If your rent is all-inclusive with no separate service charges, that rent is the basis. For three typical flats with a tenancy starting on ${h.date('2026-12-01')}:</p>
${h.table(['Base rent', 'Advance', 'Maximum deposit', 'Per instalment', 'Termination from'], WHG.map((w) => [h.eur(w.kalt, 0), h.eur(w.nk, 0), h.eur(w.r.hoechst, 0), h.eur(w.r.rate, 2), h.eur(w.r.verzugsgrenze, 0) + ' in arrears']), 'Deposit cap, instalments and arrears threshold under Sections 551 and 569 BGB', ['r', 'r', 'r', 'r', 'r'])}
<p>The cap applies to all security combined. A landlord who asks for a guarantee of ${h.eur(BUERG, 0)} on top of a full cash deposit of ${h.eur(haupt.hoechst, 0)} goes over it by ${h.eur(kombi.zuviel, 0)}. The excess is void; ${h.src('bgb551', 'Section 551(4) BGB')} rules out any agreement to your disadvantage.</p>

<h2>Three instalments, and what happens if you fall behind</h2>
<p>You may pay a cash deposit in three equal monthly instalments (Section 551(2)). The first is due when the tenancy begins, meaning the agreed start date, not when you sign. The second and third fall due with the next two rent payments. With ${h.eur(980, 0)} base rent that is three payments of ${h.eur(haupt.rate, 2)} on ${h.date(haupt.raten[0])}, ${h.date(haupt.raten[1])} and ${h.date(haupt.raten[2])}. The small calculator above splits any deposit this way.</p>
<p>If you do not pay, the landlord has a special right: ${h.src('bgb569', 'Section 569(2a) BGB')} allows termination without notice once you are behind by an amount equal to two months’ rent, again without service charges. No warning letter or deadline is needed. The termination lapses, however, if you clear the arrears within two months of an eviction claim being served, or a public body undertakes to pay, as Section 569(3) No. 2 provides.</p>

<h2>Forms of security</h2>
<ul>
<li><strong>Cash or bank transfer:</strong> the usual case; the landlord invests the money.</li>
<li><strong>Pledged savings account in your name (Kautionskonto, Sparbuch):</strong> the account is yours; the landlord holds a pledge and can only draw on it for valid claims.</li>
<li><strong>Bank or personal guarantee (Bürgschaft):</strong> the guarantor pays if you do not. It counts in full towards the cap.</li>
<li><strong>Deposit insurance (Kautionsversicherung):</strong> a guarantee bought for a yearly premium. The landlord need not accept it, and the premium is gone.</li>
</ul>
<p>Other investments than a savings account, such as a fund, are allowed under Section 551(3), second sentence, if both sides agree. The money must still be kept apart from the landlord’s assets and the returns are yours, but a market loss then reduces your deposit.</p>

<h2>Separate account and interest</h2>
<p>The landlord must place a cash deposit with a bank at the usual rate for savings with three months’ notice, separately from his own assets (Section 551(3), first and third sentences). The separation is what actually protects you: if he becomes insolvent or his creditors enforce against him, a clearly labelled trust account stays yours. So ask for confirmation. The interest increases the security; it is not paid out every year but added to the deposit and returned with it. In student or youth halls there is no duty to pay interest.</p>

<h2>If you paid too much</h2>
<p>If the landlord received more than the cap, you can claim the excess back straight away, not only when you move out. In the example with ${h.eur(3600, 0)} instead of ${h.eur(zuviel.hoechst, 0)}, that is ${h.eur(zuviel.zuviel, 0)}. Write to the landlord, state the base rent and the cap, and set a deadline. The ${h.a('kaution-rechner', 'deposit calculator')} checks cap, instalments and interest for your own lease. Note also that the landlord’s claims for damage to the flat become time-barred just six months after he gets it back (${h.src('bgb548', 'Section 548 BGB')}), which matters a great deal when the deposit is settled at the end.</p>
`,
  },
});
