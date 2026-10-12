import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { mietpreisbremse, rueckforderung } from '../../lib/engine/miete';
import { berlinOvm } from '../../lib/engine/berlin';
import { formatMoney, displayDate } from '../../lib/format';

const M = P.mpb;
// Exemple : Berlin, gute Wohnlage, 1910, 72 m² (Zeile 136), vereinbart 980 €, Vertrag seit März 2025.
const b = berlinOvm({ lage: 'gut', baujahr: 1910, flaeche: 72 });
const r = mietpreisbremse({ ovm: b.ovm, flaeche: 72, miete: 980, gebiet: true });
const rf = rueckforderung({ ueberMonat: r.ueberMonat, beginn: '2025-03-01', ruege: '2026-10-12', heute: '2026-10-12' });
const spaet = rueckforderung({ ueberMonat: r.ueberMonat, beginn: '2023-03-01', ruege: '2026-10-12', heute: '2026-12-31' });
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietpreisbremse-rechner',
  group: 'rechner',
  order: 10,
  tool: 'mpb',
  related: ['mietpreisbremse', 'mietpreisbremse-ruege', 'vergleichsmiete', 'mietspiegel-berlin', 'staffelmiete', 'mieterhoehung-rechner'],
  sources: ['bgb556d', 'bgb556e', 'bgb556f', 'bgb556g', 'berlinMs'],
  de: {
    slug: 'mietpreisbremse-rechner',
    nav: 'Mietpreisbremse-Rechner',
    card: 'Höchstmiete bei Vertragsschluss und was Sie zurückfordern können.',
    title: 'Mietpreisbremse-Rechner 2026: Höchstmiete und Rückforderung',
    description: 'Mietpreisbremse-Rechner 2026: zulässige Miete bei Mietbeginn nach Landesverordnung Ihrer Gemeinde, Vormiete, Ausnahmen und Rückforderung nach der Rüge.',
    h1: 'Mietpreisbremse-Rechner: Ist Ihre neue Miete zu hoch?',
    intro: 'Gemeinde und Mietbeginn bestimmen, ob die Bremse greift; Vergleichsmiete und Vormiete bestimmen die Grenze.',
    resume: `Die Mietpreisbremse begrenzt die Miete zu Beginn eines Mietverhältnisses auf die ortsübliche Vergleichsmiete plus ${M.aufschlag * 100} Prozent, aber nur in Gemeinden, die das Land in einer Verordnung nach § 556d Abs. 2 BGB bestimmt hat, und nur für Verträge, die während der Laufzeit dieser Verordnung geschlossen werden. Der Rechner prüft beides mit dem Datum Ihres Vertrags, ermittelt für Berlin und Hamburg die Vergleichsmiete aus dem Mietspiegel und berücksichtigt die Ausnahmen: eine höhere Vormiete, Neubau nach dem 1. Oktober 2014 und die erste Vermietung nach umfassender Modernisierung. Ein Beispiel: Altbau von 1910 in guter Berliner Lage mit 72 m². Der Mietspiegel 2026 nennt ${eD(b.ovm)} je Quadratmeter, zulässig sind also ${eD(r.zulaessig)} kalt. Bei vereinbarten ${eD(980, 0)} zahlen Sie ${eD(r.ueberMonat)} im Monat zu viel. Mit einer Rüge im Oktober 2026 bei Mietbeginn im März 2025 sind ${eD(rf.betrag)} zurückzufordern, weil die Rüge innerhalb von ${M.ruege_monate} Monaten kommt.`,
    faqs: [
      { q: 'Wie berechnet sich die Höchstmiete nach der Mietpreisbremse?', a: `Ortsübliche Vergleichsmiete je Quadratmeter mal Wohnfläche, plus ${M.aufschlag * 100} Prozent. Maßgeblich ist die Nettokaltmiete ohne Betriebskosten. Liegt die Miete des Vormieters darüber, darf sie weiter verlangt werden, wobei Erhöhungen im letzten Jahr seines Vertrags nicht zählen. Nach einer Modernisierung in den letzten drei Jahren kommt der Betrag hinzu, den eine Erhöhung nach § 559 BGB ergeben hätte.` },
      { q: 'Woher weiß ich, ob meine Gemeinde unter die Mietpreisbremse fällt?', a: `Aus der Verordnung Ihres Landes; der Rechner sucht Ihre Gemeinde in der Liste und prüft, ob die Verordnung am Tag Ihres Vertrags galt. Verordnungen dürfen höchstens bis zum ${dD(M.vo_spaetestens_bis)} laufen. Einige erfassen nur Teile einer Gemeinde: Dann steht das in der Ergebniszeile, und Sie sollten Ihren Ortsteil in der Verordnung nachlesen, die der Rechner verlinkt.` },
      { q: 'Wie viel bekomme ich zurück, wenn ich erst spät rüge?', a: `Rügen Sie mehr als ${M.ruege_monate} Monate nach Mietbeginn oder erst nach dem Auszug, gibt es nur die Miete zurück, die nach dem Zugang der Rüge fällig wird. Bei Mietbeginn im März 2023 und einer Rüge im Oktober 2026 wären das im Beispiel bis Jahresende nur ${eD(spaet.betrag)} statt der Überzahlung seit 2023. Für die Zukunft zahlen Sie ab der Rüge nur noch die zulässige Miete.` },
      { q: 'Muss der Vermieter mir die Vormiete nennen?', a: 'Ja, wenn er sich auf sie berufen will. § 556g Abs. 1a BGB verlangt, dass er die Vormiete, eine Modernisierung der letzten drei Jahre, den Erstbezug nach dem 1. Oktober 2014 oder eine umfassende Modernisierung vor Ihrer Vertragserklärung unaufgefordert in Textform mitteilt. Tut er das nicht, gilt die normale Grenze; holt er es nach, erst zwei Jahre später.' },
    ],
    body: (h) => `
<h2>Was der Rechner prüft</h2>
<p>Zuerst die Gemeinde. Die Mietpreisbremse ist ein Bundesgesetz, das nur dort wirkt, wo eine Landesregierung einen angespannten Wohnungsmarkt festgestellt und die Gemeinde in eine Verordnung aufgenommen hat. Der Rechner kennt die Listen aller 16 Länder mit ihren Laufzeiten. Fällt Ihr Vertragsdatum vor das Inkrafttreten oder nach das Auslaufen der Verordnung, gilt keine Grenze aus ${h.src('bgb556d', '§ 556d BGB')}. Danach die Vergleichsmiete: in Berlin und Hamburg berechnet aus dem Mietspiegel, in anderen Städten von Ihnen aus dem offiziellen Mietspiegel der Stadt übernommen. Zuletzt die Ausnahmen aus ${h.src('bgb556e', '§ 556e')} und ${h.src('bgb556f', '§ 556f BGB')}.</p>
<p>Die Ergebnisse stehen rechts: die zulässige Höchstmiete, der Betrag, um den Ihre Miete darüber liegt, und mit Datum der Rüge der Betrag, den Sie bis dahin zurückfordern können. Den Rückforderungszeitraum begrenzt ${h.src('bgb556g', '§ 556g Abs. 2 BGB')}: Er reicht bis zum Mietbeginn zurück, wenn die Rüge innerhalb von ${M.ruege_monate} Monaten ankommt und der Vertrag noch läuft.</p>
<h2>Das Beispiel Schritt für Schritt</h2>
${h.table(['Schritt', 'Wert'], [
  ['Vergleichsmiete Berliner Mietspiegel 2026, gute Lage, bis 1918, 70 bis 80 m²', h.eur(b.ovm, 2) + ' je m²'],
  ['mal 72 m²', h.eur(b.ovm * 72, 2)],
  [`plus ${M.aufschlag * 100} Prozent`, h.eur(r.zulaessig, 2)],
  ['vereinbarte Nettokaltmiete', h.eur(980, 2)],
  ['zu viel im Monat', h.eur(r.ueberMonat, 2)],
  [`Rückforderung bei Rüge am ${h.date('2026-10-12')}, Mietbeginn ${h.date('2025-03-01')}`, `${h.eur(rf.betrag, 2)} für ${rf.monate} Monate`],
], 'Rechenweg für eine Altbauwohnung in Berlin', ['l', 'r'])}
<p>Mietspiegel-Werte gelten als Nettokaltmiete. Ist eine Teilinklusivmiete vereinbart, ziehen Sie vorher die enthaltenen Betriebskosten ab. Möblierungszuschläge sind nicht Teil des Mietspiegels; sie unterliegen der Mietpreisbremse trotzdem, nur gibt es für ihre Höhe keine amtliche Tabelle, deshalb bleiben sie hier außen vor.</p>
<h2>Nach dem Ergebnis</h2>
<p>Liegt Ihre Miete über der Grenze, folgt die Rüge in Textform; was hineingehört, steht auf der Seite zur ${h.a('mietpreisbremse-ruege', 'Rüge')}. Sie können auch zuerst Auskunft über die Tatsachen verlangen, auf die der Vermieter die Miethöhe stützt (§ 556g Abs. 3 BGB). Bei einer ${h.a('staffelmiete', 'Staffelmiete')} gilt die Grenze für jede Stufe, bei einer ${h.a('indexmiete', 'Indexmiete')} nur für die Ausgangsmiete.</p>
`,
  },
  en: {
    slug: 'rent-brake-calculator',
    nav: 'Rent brake calculator',
    card: 'Maximum rent at signing and what you can reclaim.',
    title: 'Rent Brake Calculator Germany 2026: Ceiling and Refund',
    description: 'Rent brake calculator Germany 2026: lawful starting rent under your state ordinance, previous rent, exemptions and how much you can reclaim after a complaint.',
    h1: 'Rent brake calculator: is your new rent too high?',
    intro: 'Your municipality and start date decide whether the brake applies; the reference rent and the previous rent set the ceiling.',
    resume: `The rent brake (Mietpreisbremse) caps the rent at the start of a German tenancy at the local reference rent plus ${M.aufschlag * 100} per cent, but only in municipalities a state has listed in an ordinance under Section 556d(2) of the Civil Code, and only for leases signed while that ordinance is in force. The calculator checks both against the date of your lease, works out the reference rent from the rent index for Berlin and Hamburg, and applies the exemptions: a higher previous rent, new builds first let after 1 October 2014, and the first letting after a full modernisation. Take a 1910 flat of 72 m² in a good Berlin location. The 2026 index gives ${eE(b.ovm)} per square metre, so the lawful rent is ${eE(r.zulaessig)} a month before service charges. At an agreed ${eE(980, 0)} you overpay ${eE(r.ueberMonat)} every month. With a complaint in October 2026 on a lease that began in March 2025, ${eE(rf.betrag)} can be reclaimed, because the complaint comes within ${M.ruege_monate} months.`,
    faqs: [
      { q: 'How is the rent-brake ceiling calculated?', a: `Reference rent per square metre times floor area, plus ${M.aufschlag * 100} per cent, always on the net cold rent without service charges. If the previous tenant paid more, the landlord may keep charging that, ignoring increases agreed in the last year of that tenancy. After modernisation in the last three years he may add what an increase under Section 559 of the Civil Code would have produced.` },
      { q: 'How do I know whether my municipality is covered?', a: `From your state's ordinance; the calculator finds your municipality on the list and checks that the ordinance was in force on the day you signed. Ordinances may run until ${dE(M.vo_spaetestens_bis)} at the latest. Some cover only parts of a town; the result then says so, and you should check your district in the ordinance the calculator links.` },
      { q: 'How much do I get back if I complain late?', a: `If you complain more than ${M.ruege_monate} months after the start, or only after moving out, you recover only rent falling due after the complaint arrives. With a lease from March 2023 and a complaint in October 2026, the example yields just ${eE(spaet.betrag)} to the end of the year instead of the overpayment since 2023. From the complaint on, you only pay the lawful rent.` },
      { q: 'Does the landlord have to tell me the previous rent?', a: 'Yes, if he wants to rely on it. Section 556g(1a) of the Civil Code requires him to disclose, in text form and before you sign, the previous rent, any modernisation in the last three years, a first letting after 1 October 2014 or a full modernisation. If he does not, the normal ceiling applies; if he discloses it later, only two years afterwards.' },
    ],
    body: (h) => `
<h2>What the calculator checks</h2>
<p>First the municipality. The rent brake is a federal law that only bites where a state government has found a tight housing market and listed the municipality in an ordinance. The calculator holds the lists of all 16 states with their dates. If your lease was signed before the ordinance took effect or after it expired, ${h.src('bgb556d', 'Section 556d BGB')} sets no ceiling. Then the reference rent: worked out from the index in Berlin and Hamburg, taken by you from the city's official rent index elsewhere. Last, the exemptions in ${h.src('bgb556e', 'Section 556e')} and ${h.src('bgb556f', 'Section 556f BGB')}.</p>
<p>The results appear on the right: the lawful ceiling, how far your rent exceeds it, and, with the date of your complaint, the amount you can reclaim up to then. ${h.src('bgb556g', 'Section 556g(2) BGB')} sets the refund period: it reaches back to the start if the complaint arrives within ${M.ruege_monate} months and the tenancy is still running.</p>
<h2>The example step by step</h2>
${h.table(['Step', 'Value'], [
  ['Reference rent, Berlin index 2026, good location, built by 1918, 70 to 80 m²', h.eur(b.ovm, 2) + ' per m²'],
  ['times 72 m²', h.eur(b.ovm * 72, 2)],
  [`plus ${M.aufschlag * 100} per cent`, h.eur(r.zulaessig, 2)],
  ['agreed net cold rent', h.eur(980, 2)],
  ['overpaid per month', h.eur(r.ueberMonat, 2)],
  [`refund with a complaint on ${h.date('2026-10-12')}, lease from ${h.date('2025-03-01')}`, `${h.eur(rf.betrag, 2)} for ${rf.monate} months`],
], 'Working for a pre-war flat in Berlin', ['l', 'r'])}
<p>Rent index values are net cold rents. If your lease includes some service charges in the rent, deduct them first. Furniture surcharges are not part of the index; they are still subject to the rent brake, but no official table sets their level, so the calculator leaves them out.</p>
<h2>After the result</h2>
<p>If your rent is above the ceiling, the next step is a written complaint; the ${h.a('mietpreisbremse-ruege', 'complaint page')} lists what it must contain. You can also first ask the landlord for the facts behind the rent (Section 556g(3) BGB). With a ${h.a('staffelmiete', 'graduated rent')} the ceiling applies to every step, with an ${h.a('indexmiete', 'index-linked rent')} only to the starting rent.</p>
`,
  },
});
