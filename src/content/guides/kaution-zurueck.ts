import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { kaution } from '../../lib/engine/miete';
import { addMonths } from '../../lib/engine/dates';
import { formatMoney, displayDate, formatPercent } from '../../lib/format';

const K = P.kaution;
// Beispiel : 980 € Nettokaltmiete, volle Kaution, sechs Jahre auf dem Kautionskonto.
const KALT = 980, JAHRE = 6;
const basis = kaution({ kaltmiete: KALT });
const ZINSEN = [0.001, 0.005, 0.01, 0.02].map((z) => ({ z, r: kaution({ kaltmiete: KALT, zins: z, jahre: JAHRE }) }));
const z05 = ZINSEN[1].r;
// § 548 Abs. 1 : sechs Monate ab Rückgabe der Wohnung.
const RUECKGABE = ['2026-11-30', '2026-08-31', '2027-03-15'].map((d) => ({ d, bis: addMonths(d, 6) }));
const r1 = RUECKGABE[0];
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');
const pD = (x: number) => formatPercent(x, 1, 'de'), pE = (x: number) => formatPercent(x, 1, 'en');

export default defineGuide({
  id: 'kaution-zurueck',
  group: 'vertrag',
  order: 60,
  mini: 'kautionzins',
  miniHref: 'kaution-rechner',
  related: ['mietkaution', 'kaution-rechner', 'nebenkosten-nachzahlung', 'nebenkostenabrechnung', 'maengelanzeige'],
  sources: ['bgb551', 'bgb548', 'bgb556'],
  de: {
    slug: 'kaution-zurueck',
    nav: 'Kaution zurück',
    card: 'Wann die Kaution fällig wird, was abgezogen werden darf und warum die Zinsen Ihnen gehören.',
    title: 'Kaution zurück 2026: Rückzahlung, Zinsen, Frist nach § 548',
    description: 'Kaution zurück 2026: keine feste Frist im Gesetz, sechs Monate Verjährung für Schäden nach § 548 BGB, Zinsen für den Mieter, Einbehalt für Nebenkosten.',
    h1: 'Kaution zurück: wann Sie Ihr Geld nach dem Auszug bekommen',
    intro: 'Das Gesetz nennt keinen festen Tag für die Rückzahlung, aber es setzt dem Vermieter enge Grenzen, wie lange er Schäden noch geltend machen kann.',
    resume: `Nach dem Auszug muss der Vermieter über die Kaution abrechnen und sie samt Zinsen zurückzahlen, soweit er keine berechtigten Ansprüche mehr hat. Eine feste gesetzliche Frist für die Rückzahlung gibt es nicht; das BGB legt keinen Monat fest, und Angaben wie drei oder sechs Monate sind Faustregeln, keine Gesetzesregel. Fest steht dagegen die Verjährung nach § 548 Abs. 1 BGB: Ersatzansprüche des Vermieters wegen Veränderungen oder Verschlechterungen der Wohnung verjähren sechs Monate, nachdem er die Wohnung zurückerhalten hat. Geben Sie die Schlüssel am ${dD(r1.d)} zurück, endet diese Frist am ${dD(r1.bis)}. Die Zinsen gehören nach § 551 Abs. 3 BGB Ihnen und erhöhen die Kaution. Auf einer Kaution von ${eD(basis.hoechst, 0)} ergeben ${pD(0.005)} über ${JAHRE} Jahre mit Zinseszins ${eD(z05.zinsen)}, bei ${pD(0.02)} schon ${eD(ZINSEN[3].r.zinsen)}. Steht noch eine Betriebskostenabrechnung aus, darf der Vermieter einen angemessenen Teil zurückhalten; wie viel, sagt das Gesetz nicht.`,
    faqs: [
      { q: 'Wie lange darf der Vermieter die Kaution nach dem Auszug behalten?', a: 'Eine feste Frist steht nicht im Gesetz. Der Vermieter darf so lange prüfen, wie er braucht, um seine Ansprüche zu überblicken, also den Zustand der Wohnung, offene Mieten und ausstehende Abrechnungen. Über den Teil, für den keine Ansprüche in Betracht kommen, muss er zügig abrechnen. Monatsangaben, die man oft liest, sind Erfahrungswerte und keine Regel; im Streit entscheidet der Einzelfall.' },
      { q: 'Was passiert mit den Zinsen auf meine Kaution?', a: `Sie gehören Ihnen. § 551 Abs. 3 BGB sagt, dass die Erträge dem Mieter zustehen und die Sicherheit erhöhen. Der Vermieter zahlt sie also mit der Kaution zurück. Bei ${eD(basis.hoechst, 0)} und ${pD(0.01)} Zinsen über ${JAHRE} Jahre sind das ${eD(ZINSEN[2].r.zinsen)}. Fordern Sie eine Aufstellung der Bank an, wenn die Abrechnung keine Zinsen ausweist. Nur in Studenten- und Jugendwohnheimen entfällt die Pflicht zur Verzinsung.` },
      { q: 'Darf der Vermieter einen Teil der Kaution für die Nebenkostenabrechnung einbehalten?', a: 'Ja, soweit eine Nachzahlung aus einer noch ausstehenden Abrechnung zu erwarten ist. Die Höhe muss sich an realistischen Zahlen orientieren, etwa an den Nachzahlungen der Vorjahre; die ganze Kaution darf er dafür nicht blockieren. Den Rest muss er auszahlen. Kommt die Abrechnung, muss sie die gesetzliche Frist von zwölf Monaten nach Ende des Abrechnungszeitraums einhalten, sonst entfällt auch hier die Nachforderung.' },
      { q: 'Was bedeutet die Sechsmonatsfrist des § 548 BGB für meine Kaution?', a: `Ansprüche wegen Schäden an der Wohnung verjähren sechs Monate nach der Rückgabe, bei Rückgabe am ${dD(r1.d)} also am ${dD(r1.bis)}. Danach kann der Vermieter Sie wegen solcher Schäden nicht mehr verklagen. Ob er sie noch mit der Kaution verrechnen darf, hängt nach § 215 BGB davon ab, ob die Verrechnung schon vor der Verjährung möglich war. Miete und Betriebskosten verjähren nicht nach § 548.` },
      { q: 'Wie fordere ich meine Kaution zurück, wenn der Vermieter nicht reagiert?', a: 'Schreiben Sie ihm mit Anschrift und Kontoverbindung, verlangen Sie die Abrechnung über die Kaution samt Zinsen und setzen Sie eine klare Frist von zwei bis drei Wochen. Bleibt das ohne Antwort, folgt eine Mahnung. Danach bleiben das gerichtliche Mahnverfahren oder eine Klage beim Amtsgericht. Mietervereine helfen bei der Formulierung. Bewahren Sie Übergabeprotokoll, Fotos und Zahlungsnachweis der Kaution auf.' },
      { q: 'Darf der Vermieter normale Abnutzung von der Kaution abziehen?', a: 'Nein. Veränderungen und Verschlechterungen, die durch den vertragsgemäßen Gebrauch entstehen, hat der Mieter nach § 538 BGB nicht zu vertreten. Leichte Laufspuren im Parkett, verblasste Tapeten oder Dübellöcher in üblichem Umfang sind keine Schäden. Abziehen darf der Vermieter nur Schäden darüber hinaus und Kosten, die Sie nach einer wirksamen Vertragsklausel tragen müssen, etwa für Schönheitsreparaturen.' },
    ],
    body: (h) => `
<h2>Keine feste Frist, aber eine Pflicht zur Abrechnung</h2>
<p>Viele Ratgeber nennen eine feste Frist für die Rückzahlung der Kaution. Im Gesetz steht sie nicht. Weder ${h.src('bgb551', '§ 551 BGB')} noch eine andere Vorschrift bestimmt, wann die Kaution nach dem Ende des Mietverhältnisses zurückzuzahlen ist. Der Rückzahlungsanspruch wird erst fällig, wenn der Vermieter angemessene Zeit hatte, seine Ansprüche zu prüfen. Wie lang diese Zeit ist, hängt vom Einzelfall ab: Bei einer sauber übergebenen Wohnung ohne offene Posten ist sie kurz, bei Streit über Schäden oder einer ausstehenden Abrechnung länger.</p>
<p>Das heißt nicht, dass der Vermieter beliebig warten darf. Er muss über die Kaution abrechnen: aufstellen, welche Ansprüche er hat, sie mit der Kaution samt Zinsen verrechnen und den Rest auszahlen. Ansprüche, die erkennbar nicht bestehen, rechtfertigen keinen Einbehalt. Und die kurze Verjährung für Schäden setzt ihm einen festen Rahmen.</p>

<h2>Sechs Monate für Schäden: § 548 BGB</h2>
<p>Nach ${h.src('bgb548', '§ 548 Abs. 1 BGB')} verjähren Ersatzansprüche des Vermieters wegen Veränderungen oder Verschlechterungen der Mietsache in sechs Monaten. Die Frist beginnt, sobald er die Wohnung zurückerhält, in der Regel mit der Schlüsselübergabe, nicht erst mit dem Vertragsende. Umgekehrt verjähren Ihre Ansprüche auf Ersatz von Aufwendungen oder auf Wegnahme einer Einrichtung, etwa einer eingebauten Küche, sechs Monate nach Beendigung des Mietverhältnisses (§ 548 Abs. 2).</p>
${h.table(['Rückgabe der Wohnung', 'Verjährung der Schadensansprüche'], RUECKGABE.map((x) => [h.date(x.d), h.date(x.bis)]), 'Sechsmonatsfrist nach § 548 Abs. 1 BGB', ['l', 'r'])}
<p>Die zweite Zeile zeigt eine Besonderheit: Gibt es im Zielmonat keinen entsprechenden Tag, endet die Frist am letzten Tag des Monats. Was die Verjährung für die Kaution bedeutet, ist weniger einfach, als es scheint. Nach ${h.ext('https://www.gesetze-im-internet.de/bgb/__215.html', '§ 215 BGB')} schließt die Verjährung eine Aufrechnung nicht aus, wenn der Anspruch zu dem Zeitpunkt, als erstmals aufgerechnet werden konnte, noch nicht verjährt war. Ob ein Vermieter nach sechs Monaten noch Schäden mit der Kaution verrechnen darf, ist deshalb eine Frage des Einzelfalls. Sicher ist: Wer innerhalb der sechs Monate weder abrechnet noch Schäden konkret benennt, steht schlecht da.</p>

<h2>Was abgezogen werden darf, und was nicht</h2>
<p>Die Kaution sichert alle Ansprüche aus dem Mietverhältnis. Abziehen darf der Vermieter:</p>
<ul>
<li>offene Mieten und Nutzungsentschädigung für die Zeit nach dem Vertragsende,</li>
<li>eine Nachzahlung aus einer Betriebskostenabrechnung, die rechtzeitig gekommen ist,</li>
<li>Schadensersatz für Beschädigungen über die normale Abnutzung hinaus,</li>
<li>Kosten, die Sie nach einer wirksamen Vertragsklausel tragen müssen.</li>
</ul>
<p>Normale Abnutzung gehört nicht dazu: Veränderungen durch vertragsgemäßen Gebrauch hat der Mieter nach ${h.ext('https://www.gesetze-im-internet.de/bgb/__538.html', '§ 538 BGB')} nicht zu vertreten. Jeder Abzug muss in der Abrechnung so beschrieben sein, dass Sie ihn prüfen können, mit Art des Schadens und Betrag. Ein Übergabeprotokoll, das beide unterschrieben haben, ist dafür das wichtigste Beweismittel, ebenso Fotos mit Datum beim Ein- und Auszug.</p>

<h2>Einbehalt für eine ausstehende Betriebskostenabrechnung</h2>
<p>Die Abrechnung über das letzte Jahr kommt oft erst lange nach dem Auszug. Der Vermieter darf deshalb einen Teil der Kaution zurückhalten, der einer zu erwartenden Nachzahlung entspricht. Das Gesetz nennt dafür keine Höhe. Ein vernünftiger Anhalt sind die Nachzahlungen der letzten Jahre. Für die Abrechnung selbst gilt die Frist aus ${h.src('bgb556', '§ 556 Abs. 3 BGB')}: zwölf Monate nach Ende des Abrechnungszeitraums, sonst ist eine Nachforderung ausgeschlossen. Mehr dazu auf der Seite zur ${h.a('nebenkosten-nachzahlung', 'Nebenkosten-Nachzahlung')}.</p>

<h2>Die Zinsen gehören Ihnen</h2>
<p>Der Vermieter muss eine Geldkaution verzinslich anlegen, und die Erträge stehen dem Mieter zu; sie erhöhen die Sicherheit (§ 551 Abs. 3 BGB). Über Jahre wächst die Kaution so mit Zinseszins. Für eine Kaution von ${h.eur(basis.hoechst, 0)} (drei Nettokaltmieten zu ${h.eur(KALT, 0)}) nach ${JAHRE} Jahren:</p>
${h.table(['Zinssatz des Kontos', 'Zinsen', 'Rückzahlung ohne Abzüge'], ZINSEN.map((x) => [h.pct(x.z, 1), h.eur(x.r.zinsen, 2), h.eur(basis.hoechst + x.r.zinsen, 2)]), `Kaution von ${h.eur(basis.hoechst, 0)} über ${JAHRE} Jahre mit Zinseszins`, ['r', 'r', 'r'])}
<p>Den tatsächlichen Zinssatz kennt nur die Bank; der kleine Rechner oben rechnet mit dem Satz, den Sie eintragen. Hat der Vermieter die Kaution nicht angelegt, schuldet er Ihnen trotzdem die Zinsen, die eine ordnungsgemäße Anlage gebracht hätte. In einem Studenten- oder Jugendwohnheim entfällt die Verzinsungspflicht.</p>

<h2>So holen Sie Ihr Geld zurück</h2>
<ol>
<li>Bei der Übergabe ein Protokoll anfertigen und unterschreiben lassen, Zählerstände notieren.</li>
<li>Neue Anschrift und Kontoverbindung schriftlich mitteilen.</li>
<li>Abrechnung über die Kaution samt Zinsen verlangen und eine Frist setzen.</li>
<li>Nach Fristablauf mahnen; bleibt das erfolglos, Mahnbescheid oder Klage beim Amtsgericht.</li>
</ol>
<p>Lag die Kaution auf einem verpfändeten Sparbuch oder Konto auf Ihren Namen, brauchen Sie keine Auszahlung, sondern die Freigabe des Pfandrechts durch den Vermieter. Bei einer Bürgschaft verlangen Sie die Rückgabe der Bürgschaftsurkunde. Wie hoch die Kaution von Anfang an sein durfte, erklärt die Seite zur ${h.a('mietkaution', 'Mietkaution')}; Zinsen und Raten rechnet der ${h.a('kaution-rechner', 'Kaution-Rechner')}.</p>
`,
  },
  en: {
    slug: 'deposit-refund',
    nav: 'Deposit refund',
    card: 'When the deposit falls due, what may be deducted and why the interest is yours.',
    title: 'Deposit Refund 2026: Return, Interest and the Six-Month Rule',
    description: 'Deposit refund in Germany 2026: no fixed legal deadline, a six-month limit on damage claims, interest owed to you, and money held back for service charges.',
    h1: 'Getting your deposit back: when the money is due after you move out',
    intro: 'German law sets no fixed day for repaying a deposit, but it gives the landlord very little time to pursue damage claims.',
    resume: `After you move out, your landlord must account for the deposit (Kaution) and repay it with interest, to the extent he has no valid claims left. There is no fixed legal deadline for repayment: the Civil Code (BGB) names no month, and figures like three or six months are rules of thumb, not law. What the law does fix is the limitation period in Section 548(1) BGB: the landlord’s claims for changes to or deterioration of the flat become time-barred six months after he gets the flat back. If you return the keys on ${dE(r1.d)}, that period ends on ${dE(r1.bis)}. Under Section 551(3) BGB the interest belongs to you and is added to the deposit. On a deposit of ${eE(basis.hoechst, 0)}, ${pE(0.005)} over ${JAHRE} years with compound interest gives ${eE(z05.zinsen)}, and ${pE(0.02)} gives ${eE(ZINSEN[3].r.zinsen)}. If a service-charge statement is still outstanding, the landlord may hold back a reasonable part; the law does not say how much.`,
    faqs: [
      { q: 'How long can a landlord keep my deposit after I move out?', a: 'No fixed period is written into German law. The landlord may take as long as he reasonably needs to see what he is owed: the state of the flat, unpaid rent and pending statements. Whatever part is clearly not needed for any claim he must settle promptly. The month figures you often read are experience, not a rule; in a dispute the individual case decides.' },
      { q: 'Who gets the interest on a rental deposit?', a: `You do. Section 551(3) BGB says the returns belong to the tenant and increase the security, so the landlord repays them with the deposit. On ${eE(basis.hoechst, 0)} at ${pE(0.01)} over ${JAHRE} years that is ${eE(ZINSEN[2].r.zinsen)}. Ask for a bank statement if the settlement shows no interest. Only student and youth halls of residence are exempt from paying interest.` },
      { q: 'Can the landlord hold back part of the deposit for the final service-charge bill?', a: 'Yes, to the extent a top-up from a statement still to come is likely. The amount should be realistic, for example based on previous years’ top-ups; he may not freeze the whole deposit for this. The rest must be paid out. When the statement arrives, it must meet the legal deadline of twelve months after the billing period, otherwise no top-up can be claimed.' },
      { q: 'What does the six-month rule in Section 548 mean for my deposit?', a: `Claims for damage to the flat become time-barred six months after it is returned, so on ${dE(r1.bis)} for keys handed back on ${dE(r1.d)}. After that the landlord can no longer sue you for such damage. Whether he can still set it off against the deposit depends, under Section 215 BGB, on whether set-off was already possible before the limitation ran out. Rent and service charges are not covered by Section 548.` },
      { q: 'How do I claim my deposit back if the landlord does not respond?', a: 'Write to him with your new address and bank details, ask for a settlement of the deposit with interest and set a clear deadline of two to three weeks. If nothing happens, send a reminder. After that, the court payment-order procedure (Mahnverfahren) or a claim at the local court (Amtsgericht) remain. Tenant associations (Mietervereine) can help with wording. Keep the handover record, photos and proof of payment.' },
      { q: 'Can the landlord deduct normal wear and tear from the deposit?', a: 'No. Under Section 538 BGB the tenant is not responsible for changes caused by normal, contractual use. Light marks on parquet, faded wallpaper or a usual number of screw holes are not damage. The landlord may only deduct damage beyond that and costs you must bear under a valid lease clause, such as decorative repairs (Schönheitsreparaturen).' },
    ],
    body: (h) => `
<h2>No fixed deadline, but a duty to settle</h2>
<p>Many guides quote a fixed deadline for returning a deposit. The law contains none. Neither ${h.src('bgb551', 'Section 551 BGB')} nor any other provision says when the deposit must be repaid after the tenancy ends. The refund falls due once the landlord has had a reasonable time to check his claims. How long that is depends on the case: short for a clean handover with nothing outstanding, longer where damage is disputed or a service-charge statement is pending.</p>
<p>That does not mean the landlord may wait as long as he likes. He has to settle the deposit: list his claims, set them against the deposit plus interest and pay out the rest. Claims that plainly do not exist do not justify holding money back. And the short limitation period for damage puts a firm frame around him.</p>

<h2>Six months for damage claims: Section 548 BGB</h2>
<p>Under ${h.src('bgb548', 'Section 548(1) BGB')}, the landlord’s claims for changes to or deterioration of the property become time-barred after six months. The clock starts when he gets the flat back, usually at the key handover, not when the lease formally ends. Your own claims for reimbursement of expenses or to remove fittings you installed, such as a kitchen, become time-barred six months after the tenancy ends (Section 548(2)).</p>
${h.table(['Flat returned', 'Damage claims time-barred'], RUECKGABE.map((x) => [h.date(x.d), h.date(x.bis)]), 'Six-month period under Section 548(1) BGB', ['l', 'r'])}
<p>The second row shows a detail: where the target month has no matching day, the period ends on the last day of that month. What limitation means for the deposit is less simple than it looks. ${h.ext('https://www.gesetze-im-internet.de/bgb/__215.html', 'Section 215 BGB')} allows set-off against a time-barred claim if the claim was not yet barred when set-off first became possible. Whether a landlord may still deduct damage from the deposit after six months is therefore a question of the individual case. What is certain: a landlord who neither settles nor names specific damage within six months is in a weak position.</p>

<h2>What may be deducted, and what may not</h2>
<p>The deposit secures all claims under the tenancy. The landlord may deduct:</p>
<ul>
<li>unpaid rent, and compensation for use after the tenancy ended,</li>
<li>a top-up from a service-charge statement that arrived in time,</li>
<li>damages for harm beyond normal wear and tear,</li>
<li>costs you must bear under a valid lease clause.</li>
</ul>
<p>Normal wear is not on that list: under ${h.ext('https://www.gesetze-im-internet.de/bgb/__538.html', 'Section 538 BGB')} the tenant is not responsible for changes caused by contractual use. Every deduction must be described so you can check it, with the type of damage and the amount. A handover record (Übergabeprotokoll) signed by both sides is the key evidence, together with dated photos at move-in and move-out.</p>

<h2>Holding back money for a pending service-charge statement</h2>
<p>The statement for your final year often arrives long after you leave. The landlord may therefore keep a part of the deposit matching the top-up he can expect. The law sets no amount; previous years’ top-ups are a sensible guide. The statement itself must meet the deadline in ${h.src('bgb556', 'Section 556(3) BGB')}, twelve months after the billing period ends, or no top-up can be claimed. More on the ${h.a('nebenkosten-nachzahlung', 'service-charge top-up page')}.</p>

<h2>The interest is yours</h2>
<p>A cash deposit must earn interest, and the returns belong to the tenant and increase the security (Section 551(3) BGB). Over the years the deposit grows with compound interest. For a deposit of ${h.eur(basis.hoechst, 0)} (three months at ${h.eur(KALT, 0)} base rent) after ${JAHRE} years:</p>
${h.table(['Account interest rate', 'Interest', 'Refund before deductions'], ZINSEN.map((x) => [h.pct(x.z, 1), h.eur(x.r.zinsen, 2), h.eur(basis.hoechst + x.r.zinsen, 2)]), `Deposit of ${h.eur(basis.hoechst, 0)} over ${JAHRE} years with compound interest`, ['r', 'r', 'r'])}
<p>Only the bank knows the actual rate; the small calculator above uses whatever rate you enter. If the landlord never invested the deposit, he still owes you the interest a proper investment would have earned. Student and youth halls are exempt from the interest duty.</p>

<h2>How to get your money back</h2>
<ol>
<li>At handover, prepare a record, have it signed and note the meter readings.</li>
<li>Give your new address and bank details in writing.</li>
<li>Ask for a settlement of the deposit with interest and set a deadline.</li>
<li>After the deadline, send a reminder; if that fails, a payment order or a claim at the local court.</li>
</ol>
<p>If the deposit sat in a pledged savings account in your name, you do not need a payment but the landlord’s release of the pledge. For a guarantee, ask for the guarantee document back. How high the deposit could be in the first place is covered on the ${h.a('mietkaution', 'rental deposit page')}; the ${h.a('kaution-rechner', 'deposit calculator')} works out interest and instalments.</p>
`,
  },
});
