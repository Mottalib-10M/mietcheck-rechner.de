import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { mieterhoehung } from '../../lib/engine/miete';
import { LAENDER_VO } from '../../lib/engine/gebiet';
import { addMonths, cmp } from '../../lib/engine/dates';
import { formatMoney, formatPercent, displayDate } from '../../lib/format';

const E = P.erhoehung;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');
const WORT = ['null', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs'], WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];
const ORD = ['', 'ersten', 'zweiten', 'dritten', 'vierten'], ORD_EN = ['', 'first', 'second', 'third', 'fourth'];
const listD = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(', ')} und ${a[a.length - 1]}` : a[0] ?? '');
const listE = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}` : a[0] ?? '');
const EN: Record<string, string> = { BY: 'Bavaria', HE: 'Hesse', NI: 'Lower Saxony', NW: 'North Rhine-Westphalia', RP: 'Rhineland-Palatinate', SN: 'Saxony', ST: 'Saxony-Anhalt', TH: 'Thuringia', MV: 'Mecklenburg-Western Pomerania', SL: 'Saarland' };
const enName = (code: string, name: string) => EN[code] ?? name;
const jD = WORT[E.kappung_jahre], jE = WORD[E.kappung_jahre], voD = WORT[E.vo_kappung_max_jahre], voE = WORD[E.vo_kappung_max_jahre];
const k15 = Math.round(E.kappung_angespannt * 100), k20 = Math.round(E.kappung * 100);

/* Landesverordnungen nach § 558 Abs. 3 Satz 3 BGB */
const mitVo = LAENDER_VO.filter((l) => l.kappung);
const ohneVo = LAENDER_VO.filter((l) => !l.kappung);
const zeilen = mitVo.map((l) => {
  const t = l.kappung!.teile;
  return { code: l.code, name: l.name, en: enName(l.code, l.name), gemeinden: t.reduce((s, x) => s + x.gemeinden.length, 0), seit: t.map((x) => x.inKraft).sort()[0], bis: t.map((x) => x.bis).sort(), teile: t.length };
});
const summe = zeilen.reduce((s, z) => s + z.gemeinden, 0);
const STICHTAG_KURZ = '2027-12-31';
const baldAus = zeilen.filter((z) => cmp(z.bis[z.bis.length - 1], STICHTAG_KURZ) <= 0).sort((a, b) => cmp(a.bis[0], b.bis[0]));
const stadtstaaten = zeilen.filter((z) => z.gemeinden === 1).map((z) => z.name);
const meiste = [...zeilen].sort((a, b) => b.gemeinden - a.gemeinden)[0];

/* Beispiel: 65 m², angenommene Vergleichsmiete 13,50 €/m², Miete vor drei Jahren 700 €,
   seitdem eine Erhöhung nach § 558 auf 735 € und eine Modernisierungsumlage von 40 €. */
const FL = 65, OVM = 13.5, ALT = 700, NACH558 = 735, MOD = 40;
const ZUGANG = '2026-10-20', LETZTE = '2025-03-01';
const basisRechnung = (kappung: number) => mieterhoehung({ miete: ALT, mieteVor3: ALT, flaeche: FL, ovm: OVM, kappung, verlangt: OVM * FL, zugang: ZUGANG, letzteAenderung: LETZTE });
const r15 = basisRechnung(E.kappung_angespannt), r20 = basisRechnung(E.kappung);
const aktuell = NACH558 + MOD;
const grenze15 = Math.min(r15.grenzeKappung + MOD, r15.grenzeOvm), grenze20 = Math.min(r20.grenzeKappung + MOD, r20.grenzeOvm);
const wirksam = r15.wirksam, basisTag = addMonths(wirksam, -12 * E.kappung_jahre);
const plus15 = grenze15 - aktuell, plus20 = grenze20 - aktuell;
const verbraucht = NACH558 - ALT;

export default defineGuide({
  id: 'kappungsgrenze',
  group: 'erhoehung',
  order: 70,
  mini: 'kappung',
  miniHref: 'mieterhoehung-rechner',
  related: ['mieterhoehung', 'mieterhoehung-rechner', 'vergleichsmiete', 'qualifizierter-mietspiegel', 'modernisierungsankuendigung', 'mpb-sh'],
  sources: ['bgb558', 'bgb558a', 'bgb558b', 'bgb559', 'bgb560'],
  de: {
    slug: 'kappungsgrenze',
    nav: 'Kappungsgrenze',
    card: 'Wie viel Ihre Miete in drei Jahren steigen darf, Land für Land.',
    title: `Kappungsgrenze 2026: ${k15} oder ${k20} Prozent in drei Jahren`,
    description: `Kappungsgrenze 2026: ${k20} Prozent in drei Jahren, ${k15} Prozent in ${summe} Gemeinden aus ${mitVo.length} Ländern. Welche Miete die Basis bildet und welche Erhöhungen nicht zählen.`,
    h1: 'Kappungsgrenze: die zweite Grenze jeder Mieterhöhung',
    intro: 'Auch wenn die Vergleichsmiete mehr erlaubt, darf die Miete in drei Jahren nur um einen festen Prozentsatz steigen.',
    resume: `Die Kappungsgrenze in § 558 Abs. 3 BGB begrenzt Mieterhöhungen bis zur ortsüblichen Vergleichsmiete: Innerhalb von ${jD} Jahren darf die Miete um höchstens ${k20} Prozent steigen, in Gebieten mit besonders gefährdeter Wohnraumversorgung um höchstens ${k15} Prozent. Welche Gemeinden das sind, bestimmt jede Landesregierung durch Verordnung für höchstens ${voD} Jahre. Im Oktober 2026 haben ${mitVo.length} von 16 Ländern eine solche Verordnung mit zusammen ${summe} Gemeinden; ${listD(ohneVo.map((l) => l.name))} haben keine, dort bleibt es bei ${k20} Prozent. Basis ist die Miete ${jD} Jahre vor dem Tag, an dem die Erhöhung wirken soll. Erhöhungen wegen Modernisierung und Betriebskosten nach §§ 559 bis 560 zählen nicht mit. Beispiel: ${eD(ALT, 0)} vor drei Jahren, später eine Erhöhung auf ${eD(NACH558, 0)} und ${eD(MOD, 0)} Modernisierungsumlage. Bei ${k15} Prozent sind höchstens ${eD(grenze15)} erreichbar, ${eD(plus15)} mehr als heute; bei ${k20} Prozent wären es ${eD(grenze20)}.`,
    faqs: [
      { q: 'Zählt eine Modernisierungsumlage bei der Kappungsgrenze mit?', a: `Nein. § 558 Abs. 3 BGB nimmt Erhöhungen nach den §§ 559 bis 560 ausdrücklich aus, also Modernisierungsumlagen, die Umlage nach Einbau einer Heizung und Anpassungen der Betriebskosten. Sie verbrauchen den Spielraum von ${k15} oder ${k20} Prozent nicht und kommen zur gekappten Miete hinzu. Die Vergleichsmiete begrenzt dann trotzdem die gesamte Miete, denn verglichen wird die modernisierte Wohnung mit ähnlichen Wohnungen.` },
      { q: 'Was passiert mit der Kappungsgrenze, wenn die Landesverordnung ausläuft?', a: `Dann gilt in der Gemeinde wieder die Grenze von ${k20} Prozent, bis das Land eine neue Verordnung erlässt. Eine Verordnung darf höchstens ${voD} Jahre laufen, danach muss die Regierung die Lage neu bewerten. Die Verordnungen von ${listD(baldAus.map((z) => z.name))} enden spätestens Ende 2027. Für ein laufendes Verfahren kommt es darauf an, welche Grenze zum maßgeblichen Zeitpunkt galt; im Zweifel lohnt die Rückfrage beim Mieterverein.` },
      { q: 'Darf der Vermieter die Kappungsgrenze in mehreren kleinen Schritten ausschöpfen?', a: `Ja, die Grenze gilt für die Summe aller Erhöhungen nach § 558 BGB innerhalb von ${jD} Jahren, nicht für jeden Schritt einzeln. Jede Stufe muss aber die Sperrfrist einhalten: Das Verlangen darf frühestens ${E.wartefrist_monate} Monate nach der letzten Erhöhung kommen, und die Miete muss beim Wirksamwerden ${E.sperrfrist_monate} Monate unverändert gewesen sein. In drei Jahren sind deshalb höchstens drei Schritte möglich.` },
      { q: 'Kann ich im Mietvertrag wirksam auf die Kappungsgrenze verzichten?', a: 'Nein. § 558 Abs. 6 BGB erklärt jede Vereinbarung für unwirksam, die vom Gesetz zum Nachteil des Mieters abweicht. Eine Klausel, nach der Erhöhungen bis zur Vergleichsmiete ohne Kappung möglich sein sollen, bindet Sie nicht. Anders liegt es, wenn der Vertrag eine Staffelmiete oder eine Indexmiete vereinbart: Dann gibt es keine Erhöhung nach § 558 und damit auch keine Kappungsgrenze.' },
      { q: 'Gibt es Mieterhöhungen, für die gar keine Kappungsgrenze gilt?', a: 'Ja, in einem engen Fall: Endet bei einer früheren Sozialwohnung die öffentliche Bindung und damit die Pflicht zur Ausgleichszahlung (Fehlbelegungsabgabe), darf der Vermieter die Miete ohne Kappung erhöhen, soweit die Erhöhung die zuletzt gezahlte Ausgleichszahlung nicht übersteigt (§ 558 Abs. 4 BGB). Für einen neuen Mietvertrag gilt die Kappungsgrenze ohnehin nicht, dort greift allenfalls die Mietpreisbremse.' },
    ],
    body: (h) => `
<h2>Zwei Obergrenzen, die niedrigere entscheidet</h2>
<p>Eine Mieterhöhung nach ${h.src('bgb558', '§ 558 BGB')} muss zwei Hürden nehmen. Die neue Miete darf die ortsübliche Vergleichsmiete nicht übersteigen, die sich meist aus dem ${h.a('qualifizierter-mietspiegel', 'qualifizierten Mietspiegel')} ergibt. Und sie darf in ${jD} Jahren nicht um mehr als die Kappungsgrenze steigen. Liegt Ihre Miete weit unter dem Mietspiegel, etwa weil Sie seit vielen Jahren in der Wohnung wohnen, ist meist die Kappungsgrenze die engere Grenze. Sie verhindert, dass ein langjähriger Mieter auf einen Schlag auf Marktniveau gehoben wird.</p>
<p>Die Grenze beträgt ${k20} Prozent. Sie sinkt auf ${k15} Prozent, wenn die ausreichende Versorgung der Bevölkerung mit Mietwohnungen zu angemessenen Bedingungen in der Gemeinde oder einem Teil davon besonders gefährdet ist und die Landesregierung das Gebiet durch Rechtsverordnung bestimmt hat. Die Verordnung gilt für höchstens ${voD} Jahre; danach braucht es eine neue, sonst gilt wieder der Bundeswert.</p>

<h2>Welche Länder die Grenze gesenkt haben</h2>
<p>Im Oktober 2026 haben ${mitVo.length} Länder eine Kappungsgrenzenverordnung. ${listD(stadtstaaten)} gelten jeweils als ganze Stadt, in Bremen allerdings nur die Stadtgemeinde Bremen ohne Bremerhaven. Die längste Liste hat ${meiste.name} mit ${meiste.gemeinden} Gemeinden. Manche Länder verbinden die Kappungsgrenze in einer einzigen Mieterschutzverordnung mit der Mietpreisbremse und der Kündigungssperrfrist nach Umwandlung, andere haben eigene Verordnungen mit eigenen Laufzeiten. Deshalb kann eine Gemeinde unter der gesenkten Kappungsgrenze stehen, ohne dass dort die Mietpreisbremse gilt, wie in ganz Schleswig-Holstein.</p>
${h.table(['Land', 'Gemeinden mit ' + k15 + ' %', 'in Kraft seit', 'läuft bis'], [
  ...zeilen.map((z) => [z.name, z.gemeinden, h.date(z.seit), z.bis.map((d) => h.date(d)).join(' / ')]),
  ...ohneVo.map((l) => [l.name, 0, 'keine Verordnung', `${k20} % gilt`]),
], `Kappungsgrenzenverordnungen der Länder, zusammen ${summe} Gemeinden`, ['l', 'r', 'r', 'r'])}
<p>Mecklenburg-Vorpommern hat zwei Verordnungen mit unterschiedlichen Laufzeiten, deshalb stehen dort zwei Enddaten. In Rheinland-Pfalz nennt die Verordnung Landkreise; die Zahl der Gemeinden ergibt sich aus dem amtlichen Gemeindeverzeichnis. Knapp wird es in ${listD(baldAus.map((z) => `${z.name} (${h.date(z.bis[z.bis.length - 1])})`))}: Ohne Anschlussverordnung gilt dort danach wieder ${k20} Prozent. Ob Ihre Gemeinde betroffen ist, prüft der ${h.a('mieterhoehung-rechner', 'Mieterhöhungs-Rechner')} mit dem Datum des Erhöhungsschreibens; die Landesseiten wie ${h.a('mpb-sh', 'Schleswig-Holstein')} nennen die Verordnung mit Fundstelle.</p>

<h2>Welche Miete die Basis ist</h2>
<p>Die Kappungsgrenze rechnet rückwärts. Ausgangspunkt ist der Tag, an dem die neue Miete gelten soll, also der Beginn des dritten Kalendermonats nach Zugang des Erhöhungsverlangens (${h.src('bgb558b', '§ 558b Abs. 1 BGB')}). Von dort gehen Sie ${jD} Jahre zurück und nehmen die Nettokaltmiete, die an diesem Tag geschuldet war. Alle Erhöhungen nach § 558 BGB, die seitdem wirksam geworden sind, zählen gegen die Grenze; was davon schon verbraucht ist, steht für die nächste Erhöhung nicht mehr zur Verfügung.</p>
<p>Nicht mit zählen Erhöhungen nach den §§ 559 bis 560 BGB: die ${h.src('bgb559', 'Modernisierungsumlage')}, die Umlage nach Einbau einer neuen Heizung und die Anpassung von Betriebskostenvorauszahlungen oder -pauschalen (${h.src('bgb560', '§ 560 BGB')}). Sie verbrauchen den Spielraum nicht, sie werden aber auch nicht herausgerechnet, wenn es um die Vergleichsmiete geht: Dort wird die gesamte Miete der modernisierten Wohnung mit vergleichbaren Wohnungen verglichen.</p>

<h2>Ein Beispiel mit Modernisierung</h2>
<p>Eine Wohnung mit ${h.num(FL, 0)} m² in einer Gemeinde mit gesenkter Kappungsgrenze. Das Erhöhungsschreiben geht am ${h.date(ZUGANG)} zu, die neue Miete soll ab dem ${h.date(wirksam)} gelten. Am ${h.date(basisTag)} betrug die Nettokaltmiete ${h.eur(ALT)}. Seitdem gab es eine Erhöhung nach § 558 auf ${h.eur(NACH558)} und nach einer Modernisierung eine Umlage von ${h.eur(MOD)}, zusammen zahlt der Mieter heute ${h.eur(aktuell)}. Als Vergleichsmiete nehmen wir ${h.eur(OVM, 2)} je m² an.</p>
${h.table(['Schritt', `${k15} %`, `${k20} %`], [
  ['Miete am Stichtag drei Jahre zuvor', h.eur(ALT, 2), h.eur(ALT, 2)],
  ['plus Kappungsgrenze', h.eur(r15.grenzeKappung - ALT, 2), h.eur(r20.grenzeKappung - ALT, 2)],
  ['davon schon verbraucht durch die frühere Erhöhung', h.eur(verbraucht, 2), h.eur(verbraucht, 2)],
  ['plus Modernisierungsumlage (zählt nicht mit)', h.eur(MOD, 2), h.eur(MOD, 2)],
  ['Obergrenze aus der Kappung', h.eur(r15.grenzeKappung + MOD, 2), h.eur(r20.grenzeKappung + MOD, 2)],
  [`Obergrenze aus der Vergleichsmiete (${h.num(FL, 0)} m² mal ${h.eur(OVM, 2)})`, h.eur(r15.grenzeOvm, 2), h.eur(r20.grenzeOvm, 2)],
  ['zulässige neue Miete', h.eur(grenze15, 2), h.eur(grenze20, 2)],
  ['Erhöhung gegenüber heute', h.eur(plus15, 2), h.eur(plus20, 2)],
], 'Kappungsgrenze und Vergleichsmiete im Beispiel', ['l', 'r', 'r'])}
<p>Mit ${k15} Prozent ist die Kappung die engere Grenze, der Mieter zahlt künftig höchstens ${h.eur(grenze15, 2)}. Mit ${k20} Prozent wären ${h.eur(grenze20, 2)} möglich${grenze20 < r20.grenzeKappung + MOD ? ', weil dann die Vergleichsmiete die Grenze setzt' : ''}. Der Unterschied von ${h.eur(grenze20 - grenze15, 2)} im Monat zeigt, was die Landesverordnung für einen Mieter wert ist. Läge die Modernisierung mehr als ${jD} Jahre zurück, steckte die Umlage bereits in der Ausgangsmiete und würde mit gekappt.</p>

<h2>Was der Vermieter außerdem beachten muss</h2>
<ul>
<li><strong>Sperrfrist.</strong> Das Verlangen darf frühestens ${E.wartefrist_monate} Monate nach der letzten Erhöhung nach § 558 kommen, und die Miete muss beim Wirksamwerden ${E.sperrfrist_monate} Monate unverändert sein. Modernisierungs- und Betriebskostenerhöhungen setzen diese Frist nicht neu in Gang.</li>
<li><strong>Textform und Begründung.</strong> Das Schreiben muss nach ${h.src('bgb558a', '§ 558a BGB')} begründet sein, mit Mietspiegel, Mietdatenbank, Gutachten oder drei Vergleichswohnungen. Die Kappungsgrenze muss es nicht vorrechnen; ob sie eingehalten ist, prüfen Sie selbst.</li>
<li><strong>Überlegungsfrist.</strong> Sie haben bis zum Ende des ${ORD[E.zustimmung_kalendermonate]} Kalendermonats nach Zugang Zeit. Ist nur ein Teil der Erhöhung zulässig, können Sie diesem Teil zustimmen und den Rest ablehnen.</li>
</ul>
<p>Für Staffel- und Indexmieten gibt es keine Kappungsgrenze, weil Erhöhungen nach § 558 dort ausgeschlossen sind; die Grenzen stehen auf den Seiten zur ${h.a('staffelmiete', 'Staffelmiete')} und zur ${h.a('indexmiete', 'Indexmiete')}. Wie Sie ein Schreiben insgesamt prüfen, beschreibt die Seite zur ${h.a('mieterhoehung', 'Mieterhöhung')}.</p>
`,
  },
  en: {
    slug: 'rent-increase-cap',
    nav: 'Rent increase cap',
    card: 'How far your rent may rise in three years, state by state.',
    title: `Rent Increase Cap 2026: ${k15} or ${k20} Per Cent in Three Years`,
    description: `Rent increase cap 2026: ${k20} per cent over three years, ${k15} per cent in ${summe} municipalities across ${mitVo.length} states. Which rent is the base and what is left out.`,
    h1: 'Rent increase cap: the second limit on every rent rise',
    intro: 'Even where the reference rent would allow more, your rent may only rise by a fixed percentage within three years.',
    resume: `The cap on rent increases (Kappungsgrenze) in Section 558(3) of the German Civil Code (BGB) limits rises towards the local reference rent: within ${jE} years the rent may go up by no more than ${k20} per cent, or ${k15} per cent where the supply of rental housing is especially at risk. Each state government designates those areas by ordinance for at most ${voE} years. In October 2026, ${mitVo.length} of the 16 states have such an ordinance, covering ${summe} municipalities between them; ${listE(ohneVo.map((l) => enName(l.code, l.name)))} have none and stay at ${k20} per cent. The base is the rent owed ${jE} years before the date the increase is to take effect. Increases for modernisation and service charges under Sections 559 to 560 are left out. Example: ${eE(ALT, 0)} three years ago, later an increase to ${eE(NACH558, 0)} plus a modernisation surcharge of ${eE(MOD, 0)}. With a ${k15} per cent cap the rent can reach at most ${eE(grenze15)}, ${eE(plus15)} more than now; with ${k20} per cent it would be ${eE(grenze20)}.`,
    faqs: [
      { q: 'Does a modernisation surcharge count towards the cap?', a: `No. Section 558(3) BGB expressly excludes increases under Sections 559 to 560: modernisation surcharges, the surcharge after a new heating system and adjustments of service charges. They do not use up the ${k15} or ${k20} per cent and are added on top of the capped rent. The reference rent still limits the whole rent, though, because the modernised flat is compared with similar flats.` },
      { q: 'What happens to the cap when the state ordinance expires?', a: `The municipality falls back to ${k20} per cent until the state issues a new ordinance. An ordinance can run for no more than ${voE} years, after which the government must reassess the market. The ordinances of ${listE(baldAus.map((z) => z.en))} end by the close of 2027 at the latest. For an increase already under way, what matters is which cap applied at the relevant time; a tenants’ association can help if in doubt.` },
      { q: 'Can the landlord use up the cap in several small steps?', a: `Yes. The cap applies to the sum of all increases under Section 558 BGB within ${jE} years, not to each step. But every step must respect the waiting periods: the demand may come no earlier than ${E.wartefrist_monate} months after the last increase, and the rent must have stayed unchanged for ${E.sperrfrist_monate} months when the new one takes effect. That allows at most three steps in three years.` },
      { q: 'Can a lease clause waive the cap?', a: 'No. Under Section 558(6) BGB any agreement that departs from the statute to the tenant’s disadvantage is void, so a clause allowing increases up to the reference rent without a cap does not bind you. It is different if the lease sets a graduated rent (Staffelmiete) or an index-linked rent (Indexmiete): then there is no increase under Section 558 at all, and so no cap.' },
      { q: 'Are there any increases to which no cap applies?', a: 'One narrow case. When a former social housing flat leaves public control and the tenant’s duty to pay a compensatory levy (Fehlbelegungsabgabe) ends, the landlord may raise the rent without the cap, as long as the rise does not exceed the levy last paid (Section 558(4) BGB). A new lease is not covered by the cap anyway; there, only the rent brake can apply.' },
    ],
    body: (h) => `
<h2>Two ceilings, and the lower one wins</h2>
<p>A rent increase under ${h.src('bgb558', 'Section 558 BGB')} has to clear two hurdles. The new rent may not exceed the local reference rent, usually taken from the ${h.a('qualifizierter-mietspiegel', 'qualified rent index')}. And it may not rise by more than the cap within ${jE} years. If your rent is far below the index, for instance because you have lived in the flat for many years, the cap is usually the tighter limit. It stops a long-standing tenant from being lifted to market level in one go.</p>
<p>The cap is ${k20} per cent. It falls to ${k15} per cent where an adequate supply of rental housing on reasonable terms is especially at risk in a municipality or part of one, and the state government has designated that area by ordinance (Verordnung). Each ordinance lasts at most ${voE} years; without a successor the federal figure applies again.</p>

<h2>Which states have lowered the cap</h2>
<p>In October 2026, ${mitVo.length} states have a cap ordinance. ${listE(stadtstaaten)} are each covered as a whole, although in Bremen only the city of Bremen counts, not Bremerhaven. The longest list belongs to ${meiste.en}, with ${meiste.gemeinden} municipalities. Some states bundle the cap with the rent brake and the notice ban after conversion to condominiums in a single tenant protection ordinance; others use separate ordinances with their own dates. That is why a town can have the lower cap without the rent brake, as everywhere in Schleswig-Holstein.</p>
${h.table(['State', `Municipalities at ${k15} %`, 'In force since', 'Runs until'], [
  ...zeilen.map((z) => [z.en, z.gemeinden, h.date(z.seit), z.bis.map((d) => h.date(d)).join(' / ')]),
  ...ohneVo.map((l) => [enName(l.code, l.name), 0, 'no ordinance', `${k20} % applies`]),
], `State cap ordinances, ${summe} municipalities in total`, ['l', 'r', 'r', 'r'])}
<p>Mecklenburg-Western Pomerania has two ordinances with different end dates, hence two dates in its row. In Rhineland-Palatinate the ordinance names districts, so the number of municipalities comes from the official register of municipalities. Time is short in ${listE(baldAus.map((z) => `${z.en} (${h.date(z.bis[z.bis.length - 1])})`))}: without a follow-up ordinance the cap there returns to ${k20} per cent. The ${h.a('mieterhoehung-rechner', 'rent increase calculator')} checks your municipality against the date of the increase letter, and state pages such as ${h.a('mpb-sh', 'Schleswig-Holstein')} cite the ordinance and where it was published.</p>

<h2>Which rent is the starting point</h2>
<p>The cap looks backwards. Start from the date the new rent is meant to apply, which is the beginning of the third calendar month after the demand reaches you (${h.src('bgb558b', 'Section 558b(1) BGB')}). Go back ${jE} years from there and take the net cold rent (rent without service charges) owed on that day. Every increase under Section 558 that has taken effect since then counts against the cap; whatever has been used up is no longer available for the next increase.</p>
<p>Increases under Sections 559 to 560 BGB do not count: the ${h.src('bgb559', 'modernisation surcharge')}, the surcharge after a new heating system, and adjustments of service-charge advances or flat rates (${h.src('bgb560', 'Section 560 BGB')}). They do not eat into the cap, but they are not stripped out for the reference-rent test either: there, the whole rent of the modernised flat is compared with similar flats.</p>

<h2>A worked example with modernisation</h2>
<p>A flat of ${h.num(FL, 0)} m² in a municipality with the lower cap. The increase letter arrives on ${h.date(ZUGANG)}, so the new rent would apply from ${h.date(wirksam)}. On ${h.date(basisTag)} the net cold rent was ${h.eur(ALT)}. Since then there has been one increase under Section 558 to ${h.eur(NACH558)} and, after building work, a modernisation surcharge of ${h.eur(MOD)}, so the tenant now pays ${h.eur(aktuell)}. We assume a reference rent of ${h.eur(OVM, 2)} per m².</p>
${h.table(['Step', `${k15} %`, `${k20} %`], [
  ['Rent on the date three years earlier', h.eur(ALT, 2), h.eur(ALT, 2)],
  ['plus the cap', h.eur(r15.grenzeKappung - ALT, 2), h.eur(r20.grenzeKappung - ALT, 2)],
  ['of which already used by the earlier increase', h.eur(verbraucht, 2), h.eur(verbraucht, 2)],
  ['plus modernisation surcharge (not counted)', h.eur(MOD, 2), h.eur(MOD, 2)],
  ['Ceiling from the cap', h.eur(r15.grenzeKappung + MOD, 2), h.eur(r20.grenzeKappung + MOD, 2)],
  [`Ceiling from the reference rent (${h.num(FL, 0)} m² times ${h.eur(OVM, 2)})`, h.eur(r15.grenzeOvm, 2), h.eur(r20.grenzeOvm, 2)],
  ['Lawful new rent', h.eur(grenze15, 2), h.eur(grenze20, 2)],
  ['Rise compared with today', h.eur(plus15, 2), h.eur(plus20, 2)],
], 'The cap and the reference rent in the example', ['l', 'r', 'r'])}
<p>At ${k15} per cent the cap is the tighter limit and the tenant pays no more than ${h.eur(grenze15, 2)} from now on. At ${k20} per cent ${h.eur(grenze20, 2)} would be possible${grenze20 < r20.grenzeKappung + MOD ? ', because the reference rent then takes over as the limit' : ''}. The difference of ${h.eur(grenze20 - grenze15, 2)} a month shows what the state ordinance is worth to a tenant. Had the modernisation taken place more than ${jE} years ago, the surcharge would already be part of the starting rent and would be capped along with it.</p>

<h2>What else the landlord has to respect</h2>
<ul>
<li><strong>Waiting periods.</strong> The demand may come no earlier than ${E.wartefrist_monate} months after the last increase under Section 558, and the rent must have stayed unchanged for ${E.sperrfrist_monate} months when the new one applies. Modernisation and service-charge increases do not restart this clock.</li>
<li><strong>Text form and reasons.</strong> The letter has to be justified under ${h.src('bgb558a', 'Section 558a BGB')}, by a rent index, a rent database, an expert report or three comparable flats. It need not work out the cap for you; checking that is up to you.</li>
<li><strong>Time to decide.</strong> You have until the end of the ${ORD_EN[E.zustimmung_kalendermonate]} calendar month after receipt. If only part of the increase is lawful, you can agree to that part and refuse the rest.</li>
</ul>
<p>There is no cap for graduated or index-linked rents, because increases under Section 558 are excluded there; their limits are explained on the pages on ${h.a('staffelmiete', 'graduated rent')} and ${h.a('indexmiete', 'index-linked rent')}. How to check an increase letter as a whole is covered on the ${h.a('mieterhoehung', 'rent increase page')}.</p>
`,
  },
});
