import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { proM2Monat } from '../../lib/engine/miete';
import { formatMoney } from '../../lib/format';

const B = P.berlin_bk;
/** Die 17 Nummern von § 2 BetrKV (Wortlaut gesetze-im-internet.de, gelesen am 2026-10-12), Kurzbezeichnung und Beispiele aus dem Text. */
const NR: Array<{ de: string; deBsp: string; en: string; enBsp: string }> = [
  { de: 'laufende öffentliche Lasten', deBsp: 'namentlich die Grundsteuer', en: 'recurring public charges', enBsp: 'above all property tax (Grundsteuer)' },
  { de: 'Wasserversorgung', deBsp: 'Verbrauch, Grundgebühren, Miete und Eichung der Wasserzähler', en: 'water supply', enBsp: 'consumption, standing charges, meter rental and calibration' },
  { de: 'Entwässerung', deBsp: 'Gebühren für Haus- und Grundstücksentwässerung, Entwässerungspumpe', en: 'drainage', enBsp: 'sewage fees, drainage pump' },
  { de: 'Heizung', deBsp: 'Brennstoff, Betriebsstrom, Wartung, Messungen, Verbrauchserfassung', en: 'heating', enBsp: 'fuel, operating power, servicing, emission checks, meter reading' },
  { de: 'Warmwasser', deBsp: 'zentrale Anlage, gewerbliche Lieferung, Wartung von Warmwassergeräten', en: 'hot water', enBsp: 'central system, supplied hot water, servicing of water heaters' },
  { de: 'verbundene Heizungs- und Warmwasseranlagen', deBsp: 'Kosten nach Nr. 4 und 2 für kombinierte Anlagen', en: 'combined heating and hot-water systems', enBsp: 'costs under items 4 and 2 for combined systems' },
  { de: 'Personen- oder Lastenaufzug', deBsp: 'Betriebsstrom, Bedienung, Prüfung, Reinigung', en: 'passenger or goods lift', enBsp: 'power, operation, inspection, cleaning' },
  { de: 'Straßenreinigung und Müllbeseitigung', deBsp: 'Gebühren, Müllschlucker, Müllmengenerfassung', en: 'street cleaning and waste disposal', enBsp: 'fees, waste chutes, waste metering' },
  { de: 'Gebäudereinigung und Ungezieferbekämpfung', deBsp: 'Flure, Treppen, Keller, Waschküche, Fahrkorb', en: 'building cleaning and pest control', enBsp: 'hallways, stairs, cellar, laundry room, lift car' },
  { de: 'Gartenpflege', deBsp: 'Pflanzen, Spielplatz samt Sand, nicht öffentliche Zugänge', en: 'gardening', enBsp: 'plants, playground including sand, private paths' },
  { de: 'Beleuchtung', deBsp: 'Strom für Außenlicht und gemeinsam genutzte Räume', en: 'lighting', enBsp: 'power for outdoor and common-area lights' },
  { de: 'Schornsteinreinigung', deBsp: 'Kehrgebühren, soweit nicht schon unter Nr. 4', en: 'chimney sweeping', enBsp: 'sweeping fees not already under item 4' },
  { de: 'Sach- und Haftpflichtversicherung', deBsp: 'Feuer, Sturm, Wasser, Elementarschäden, Glas, Haftpflicht', en: 'property and liability insurance', enBsp: 'fire, storm, water, natural hazards, glass, liability' },
  { de: 'Hauswart', deBsp: 'Vergütung und Sozialbeiträge, ohne Reparatur und Verwaltung', en: 'caretaker', enBsp: 'pay and social charges, excluding repairs and management' },
  { de: 'Antenne, Breitbandnetz, Glasfaser', deBsp: 'Betriebsstrom und Prüfung; Glasfaser mit Bereitstellungsentgelt', en: 'aerial, cable network, fibre', enBsp: 'power and inspection; fibre with a provision fee' },
  { de: 'Einrichtungen für die Wäschepflege', deBsp: 'Strom, Pflege und Prüfung gemeinsamer Waschmaschinen', en: 'laundry facilities', enBsp: 'power, upkeep and checks of shared machines' },
  { de: 'sonstige Betriebskosten', deBsp: 'laufende Kosten im Sinne von § 1, die Nr. 1 bis 16 nicht erfassen', en: 'other service charges', enBsp: 'recurring costs under Section 1 not covered by items 1 to 16' },
];
// Berliner Mittelwerte auf drei Wohnungsgrößen hochgerechnet.
const GROESSEN = [40, 62, 85].map((m) => ({ m, kalt: B.kalt_m2 * m, warm: B.warm_m2 * m }));
// Mini-Beispiel : 62 m², 1 650 € kalte Betriebskosten im Jahr.
const eigen = proM2Monat(1650, 62);
const abw = eigen / B.kalt_m2 - 1;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const pctD = Math.round(abw * 100), pctE = pctD;

export default defineGuide({
  id: 'nebenkosten',
  group: 'nebenkosten',
  order: 20,
  mini: 'bkm2',
  miniHref: 'nebenkostenabrechnung-pruefen',
  related: ['nebenkostenabrechnung', 'nebenkostenabrechnung-pruefen', 'heizkostenabrechnung', 'nebenkosten-nachzahlung', 'co2-kosten-rechner'],
  sources: ['betrkv', 'betrkv1', 'bgb556', 'berlinBk', 'bgb560'],
  de: {
    slug: 'nebenkosten-umlagefaehig',
    nav: 'Nebenkosten: was umlagefähig ist',
    card: 'Die 17 Posten der Betriebskostenverordnung und was nicht dazugehört.',
    title: 'Nebenkosten umlagefähig 2026: die 17 Posten der BetrKV',
    description: 'Nebenkosten 2026: welche Betriebskosten nach § 2 BetrKV umlagefähig sind, was als Verwaltung oder Reparatur ausscheidet und was der Berliner Mittelwert je m² zeigt.',
    h1: 'Nebenkosten: welche Betriebskosten Sie zahlen müssen',
    intro: 'Umlegen darf der Vermieter nur, was die Betriebskostenverordnung aufzählt und was Ihr Mietvertrag ausdrücklich auf Sie überträgt.',
    resume: `Nebenkosten im Mietrecht heißen Betriebskosten: laufende Kosten, die dem Eigentümer durch das Grundstück und den Gebrauch des Gebäudes entstehen. Sie tragen sie nur, wenn der Mietvertrag es vereinbart (§ 556 Abs. 1 BGB), und nur in den Grenzen der Betriebskostenverordnung. Deren § 2 zählt 17 Nummern auf, von der Grundsteuer über Wasser, Heizung, Aufzug, Müll, Reinigung, Garten und Versicherung bis zu den sonstigen Betriebskosten. Ausgeschlossen sind nach § 1 Abs. 2 BetrKV die Kosten der Verwaltung und der Instandhaltung. Seit dem 1. Juli 2024 gehören auch die Nutzungsentgelte für den Kabelanschluss nicht mehr dazu. Als Maßstab für die Höhe nennt die Berliner Betriebskostenübersicht für das Abrechnungsjahr ${B.jahr} im Mittel ${eD(B.kalt_m2)} je Quadratmeter und Monat für die kalten Posten und ${eD(B.warm_m2)} für Heizung und Warmwasser. Für eine Wohnung mit 62 m² sind das ${eD(B.kalt_m2 * 62)} und ${eD(B.warm_m2 * 62)} im Monat. Zahlen Sie für die kalten Posten ${eD(1650, 0)} im Jahr, liegen Sie mit ${eD(eigen)} je Quadratmeter etwa ${pctD} Prozent über dem Berliner Mittel.`,
    faqs: [
      { q: 'Welche Nebenkosten darf der Vermieter auf mich umlegen?', a: 'Nur Betriebskosten aus der Liste in § 2 der Betriebskostenverordnung, und davon nur die, die Ihr Mietvertrag auf Sie überträgt. Typisch sind Grundsteuer, Wasser und Abwasser, Heizung und Warmwasser, Aufzug, Müllabfuhr, Hausreinigung, Gartenpflege, Allgemeinstrom, Schornsteinfeger, Gebäudeversicherung und Hauswart. Steht im Vertrag nur eine Warmmiete ohne Vereinbarung über Betriebskosten, sind sie mit der Miete abgegolten.' },
      { q: 'Darf der Vermieter die Kosten der Hausverwaltung abrechnen?', a: 'Nein. § 1 Abs. 2 der Betriebskostenverordnung nimmt Verwaltungskosten ausdrücklich aus: das Personal und die Einrichtungen der Verwaltung, die eigene Verwaltungsarbeit des Vermieters, Prüfungen des Jahresabschlusses und die Geschäftsführung. Auch Kontoführungsgebühren und Kosten für das Erstellen der Abrechnung fallen darunter. Taucht in Ihrer Abrechnung eine Position Verwaltung auf, streichen Sie sie in Ihrem Widerspruch.' },
      { q: 'Muss ich seit Juli 2024 noch für den Kabelanschluss zahlen?', a: 'Das Nutzungsentgelt für den Kabelanschluss, die Urheberrechtsgebühren für die Kabelweitersendung und die monatlichen Grundgebühren für Breitbandanschlüsse sind nur bis zum 30. Juni 2024 umlagefähig. Seitdem bleiben bei einer Gemeinschaftsantenne oder einem Breitbandnetz im Haus nur Betriebsstrom und regelmäßige Prüfung. Den Fernsehanschluss buchen Sie nun selbst. Eine neue Glasfaserverteilung kann ein begrenztes Bereitstellungsentgelt auslösen.' },
      { q: 'Was ist der Unterschied zwischen Nebenkostenpauschale und Vorauszahlung?', a: 'Auf Vorauszahlungen folgt jedes Jahr eine Abrechnung mit Nachzahlung oder Guthaben. Eine Pauschale wird nicht abgerechnet: Sie zahlen den festen Betrag, egal was tatsächlich anfällt. Erhöhen darf der Vermieter sie nur, wenn der Vertrag das vorsieht, und nur mit einer begründeten Erklärung in Textform (§ 560 Abs. 1 BGB). Sinken die Kosten, muss er die Pauschale von sich aus herabsetzen.' },
      { q: 'Wie hoch sind die Nebenkosten pro Quadratmeter im Durchschnitt?', a: `Eine amtliche Zahl für ganz Deutschland gibt es nicht. Die Berliner Senatsverwaltung veröffentlicht Mittelwerte: Für das Abrechnungsjahr ${B.jahr} sind es ${eD(B.kalt_m2)} je Quadratmeter und Monat für die kalten Betriebskosten und ${eD(B.warm_m2)} für Heizung und Warmwasser. Andere Städte liegen darüber oder darunter, je nach Grundsteuer, Wasserpreisen und Gebäudebestand. Als Orientierung, ob ein Posten auffällt, taugt der Wert trotzdem.` },
      { q: 'Was fällt unter sonstige Betriebskosten?', a: 'Laufende Kosten im Sinne von § 1 BetrKV, die keine der Nummern 1 bis 16 erfasst, etwa die Wartung von Rauchwarnmeldern, Feuerlöschern oder einer Dachrinnenheizung, soweit es um regelmäßige Prüfung und nicht um Reparatur geht. Weil Sie nur vereinbarte Kosten tragen, muss der Mietvertrag die einzelnen sonstigen Kosten benennen. Das bloße Wort sonstige verrät nicht, welche Kosten gemeint sind.' },
    ],
    body: (h) => `
<h2>Was Betriebskosten sind</h2>
<p>Das Gesetz definiert sie in ${h.src('bgb556', '§ 556 Abs. 1 BGB')} und wortgleich in § 1 der Betriebskostenverordnung: Kosten, die dem Eigentümer durch das Eigentum am Grundstück oder durch den bestimmungsmäßigen Gebrauch des Gebäudes, der Nebengebäude, Anlagen und Einrichtungen laufend entstehen. Zwei Merkmale tragen diese Definition. Laufend heißt wiederkehrend, nicht unbedingt jährlich; eine Prüfung, die alle paar Jahre fällig ist, kann dazugehören, eine einmalige Anschaffung nicht. Und es geht um Gebrauch, nicht um Erhaltung: Was der Eigentümer aufwendet, um Abnutzung, Alterung und Witterungsschäden zu beseitigen, ist Instandhaltung und bleibt bei ihm.</p>
<p>Erledigt der Vermieter Arbeiten selbst, etwa die Gartenpflege, darf er den Betrag ansetzen, den eine gleichwertige Leistung eines Unternehmers kosten würde, aber ohne dessen Umsatzsteuer (§ 1 Abs. 1 Satz 2 BetrKV). Er muss diesen Betrag in der Abrechnung nachvollziehbar machen, zum Beispiel mit einem Vergleichsangebot.</p>

<h2>Die 17 Nummern der Betriebskostenverordnung</h2>
<p>Die abschließende Liste steht in ${h.src('betrkv', '§ 2 BetrKV')}. Abschließend heißt: Was nicht unter eine der Nummern fällt, ist keine Betriebskostenposition, auch wenn es laufend anfällt. Die Tabelle fasst jede Nummer mit Beispielen aus dem Wortlaut zusammen.</p>
${h.table(['Nr.', 'Posten', 'Was dazugehört (Beispiele aus dem Wortlaut)'], NR.map((n, i) => [String(i + 1), n.de, n.deBsp]), 'Betriebskosten nach § 2 BetrKV, Fassung vom 12. Oktober 2026', ['r', 'l', 'l'])}
<p>Bei den Nummern 4 bis 6 geht die Heizkostenverordnung vor: Sie bestimmt, dass ein Teil der Kosten nach Verbrauch verteilt wird, und gibt Ihnen Kürzungsrechte, wenn das nicht geschieht. Die Einzelheiten stehen auf der Seite zur ${h.a('heizkostenabrechnung', 'Heizkostenabrechnung')}. Beim Hauswart der Nummer 14 dürfen Arbeiten, die er selbst erledigt, nicht zusätzlich unter den Nummern 2 bis 10 und 16 erscheinen; sonst zahlen Sie dieselbe Arbeit zweimal.</p>

<h2>Was ausdrücklich keine Betriebskosten sind</h2>
<p>${h.src('betrkv1', '§ 1 Abs. 2 BetrKV')} nennt zwei Gruppen, die nie umgelegt werden dürfen:</p>
<ul>
<li><strong>Verwaltungskosten:</strong> Personal und Einrichtungen der Verwaltung, Aufsicht, die Verwaltungsarbeit des Vermieters selbst, Prüfung des Jahresabschlusses und Geschäftsführung.</li>
<li><strong>Instandhaltung und Instandsetzung:</strong> alles, was nötig ist, um Mängel durch Abnutzung, Alterung und Witterung zu beseitigen.</li>
</ul>
<p>Daraus folgt eine einfache Prüffrage für jede Rechnung in den Belegen: Wurde etwas betrieben, gereinigt, geprüft oder versichert, oder wurde etwas repariert oder ersetzt? Eine neue Pumpe für die Heizung, ein ausgetauschtes Türschloss oder die Reparatur des Aufzugs sind Instandsetzung, auch wenn sie auf einer Rechnung zusammen mit der Wartung stehen. Der Anteil muss dann herausgerechnet werden.</p>

<h2>Kabelfernsehen, Breitband und Glasfaser seit 2024</h2>
<p>Nummer 15 wurde mehrfach geändert und ist der Posten, bei dem alte Mietverträge am häufigsten nicht mehr stimmen. Bis zum 30. Juni 2024 durften das Nutzungsentgelt für einen Kabelanschluss, die Gebühren für die Kabelweitersendung und die monatlichen Grundgebühren für Breitbandanschlüsse umgelegt werden. Seit dem 1. Juli 2024 bleiben bei einer Gemeinschaftsantenne nur der Betriebsstrom und die regelmäßige Prüfung samt Einstellung; bei einem Breitbandnetz nur der Betriebsstrom. Für Anlagen, die ab dem 1. Dezember 2021 errichtet wurden, gelten die Buchstaben a und b überhaupt nicht mehr.</p>
<p>Neu ist Buchstabe c: der Betrieb einer gebäudeinternen Verteilung, die vollständig über Glasfaser an ein Netz mit sehr hoher Kapazität angeschlossen ist, wenn Sie Ihren Anbieter frei wählen können. Umlagefähig sind dort der Betriebsstrom und ein Bereitstellungsentgelt nach dem Telekommunikationsgesetz. Dieses Entgelt tragen Sie nur, wenn die Maßnahme wirtschaftlich umgesetzt wurde; bei einer aufwendigen Maßnahme muss der Vermieter vorher nach Möglichkeit drei Angebote eingeholt und das wirtschaftlichste gewählt haben (${h.src('bgb556', '§ 556 Abs. 3a BGB')}).</p>

<h2>Pauschale oder Vorauszahlung</h2>
<p>Der Vertrag kann die Betriebskosten auf zwei Arten regeln (§ 556 Abs. 2 BGB). Bei einer Vorauszahlung zahlen Sie monatlich einen Abschlag, der in angemessener Höhe vereinbart sein muss, und erhalten jährlich eine Abrechnung, wie auf der Seite zur ${h.a('nebenkostenabrechnung', 'Nebenkostenabrechnung')} beschrieben. Bei einer Pauschale gibt es keine Abrechnung. Steigen die Kosten, darf der Vermieter die Pauschale nur erhöhen, wenn der Vertrag das vorsieht, und nur mit einer Erklärung in Textform, die den Grund nennt und erläutert; sie wirkt ab dem übernächsten Monat (${h.src('bgb560', '§ 560 Abs. 1 und 2 BGB')}). Sinken die Kosten, muss er die Pauschale ab diesem Zeitpunkt herabsetzen und Ihnen das unverzüglich mitteilen.</p>

<h2>Wie hoch Nebenkosten üblicherweise sind</h2>
<p>Bundesweite amtliche Durchschnittswerte gibt es nicht. Die ${h.src('berlinBk', 'Berliner Betriebskostenübersicht')} der Senatsverwaltung nennt für das Abrechnungsjahr ${B.jahr} Mittelwerte von ${h.eur(B.kalt_m2, 2)} je Quadratmeter und Monat für die kalten Betriebskosten und ${h.eur(B.warm_m2, 2)} für Heizung und Warmwasser. Hochgerechnet auf typische Wohnungsgrößen:</p>
${h.table(['Wohnfläche', 'kalt im Monat', 'warm im Monat', 'zusammen im Jahr'], GROESSEN.map((g) => [h.num(g.m) + ' m²', h.eur(g.kalt, 2), h.eur(g.warm, 2), h.eur((g.kalt + g.warm) * 12, 0)]), 'Berliner Mittelwerte für ' + B.jahr + ' auf drei Wohnungsgrößen gerechnet', ['l', 'r', 'r', 'r'])}
<p>Ein Wert über dem Mittel ist kein Fehler: Ein Haus mit Aufzug, Hauswart und großer Gartenanlage kostet mehr als ein Haus ohne. Liegt aber ein einzelner Posten weit darüber, lohnt sich der Blick in die Belege. Der kleine Rechner oben rechnet Ihre kalten Kosten auf den Quadratmeter um; der ${h.a('nebenkostenabrechnung-pruefen', 'Rechner Nebenkostenabrechnung prüfen')} macht dasselbe für die warmen Kosten und prüft die Fristen. Folgt aus der Abrechnung eine Nachzahlung, hilft die Seite zur ${h.a('nebenkosten-nachzahlung', 'Nebenkosten-Nachzahlung')}.</p>
`,
  },
  en: {
    slug: 'service-charges-explained',
    nav: 'Service charges explained',
    card: 'The 17 items of the Service Charges Ordinance and what is excluded.',
    title: 'Service Charges Explained 2026: the 17 Chargeable Items',
    description: 'Service charges in Germany 2026: which running costs a landlord may pass on under the BetrKV list, what counts as management or repair, and the Berlin cost per m².',
    h1: 'Service charges in Germany: what you can be asked to pay',
    intro: 'Your landlord may only pass on costs that the Service Charges Ordinance lists and that your lease expressly puts on you.',
    resume: `In German tenancy law, the extra costs on top of rent (Nebenkosten) are legally called operating or service charges (Betriebskosten): the recurring costs an owner has from the land and from normal use of the building. You only pay them if your lease says so (Section 556(1) of the Civil Code, BGB), and only within the limits of the Service Charges Ordinance (Betriebskostenverordnung, BetrKV). Its Section 2 lists 17 items, from property tax through water, heating, lifts, waste, cleaning, gardening and insurance to other service charges. Section 1(2) excludes management and repair costs. Since 1 July 2024, cable TV usage fees are no longer chargeable either. As a benchmark, the Berlin service-charge overview gives average figures for ${B.jahr} of ${eE(B.kalt_m2)} per square metre and month for non-heating items and ${eE(B.warm_m2)} for heating and hot water. For a 62 m² flat that is ${eE(B.kalt_m2 * 62)} and ${eE(B.warm_m2 * 62)} a month. If you pay ${eE(1650, 0)} a year for the non-heating items, your ${eE(eigen)} per square metre is about ${pctE} per cent above the Berlin average.`,
    faqs: [
      { q: 'Which running costs can my landlord charge me for?', a: 'Only service charges on the list in Section 2 of the Service Charges Ordinance, and only those your lease transfers to you. Typical ones are property tax, water and sewage, heating and hot water, lift, waste collection, stairwell cleaning, gardening, communal electricity, chimney sweep, buildings insurance and caretaker. If your lease states a single all-in rent without a service-charge clause, these costs are covered by the rent.' },
      { q: 'Can the landlord charge me for the property manager?', a: 'No. Section 1(2) of the ordinance expressly excludes management costs: the staff and equipment of the managing agent (Hausverwaltung), the landlord’s own administrative work, audits of accounts and general management. Bank charges and fees for preparing the statement fall under this too. If a line called management (Verwaltung) appears in your statement, strike it out in your objection.' },
      { q: 'Do I still pay for cable TV through my service charges?', a: 'Not since 1 July 2024. The usage fee for a cable connection, copyright fees for cable retransmission and monthly broadband standing charges were only chargeable until 30 June 2024. For a shared aerial or an in-house cable network, only the power and regular checks remain. You now contract for TV yourself. A new fibre installation can trigger a limited provision fee instead.' },
      { q: 'What is the difference between a flat rate and advance payments?', a: 'Advance payments (Vorauszahlungen) are settled every year with a statement showing a balance due or a credit. A flat rate (Pauschale) is never settled: you pay the fixed amount whatever the real costs are. The landlord can raise it only if the lease allows, by a reasoned notice in text form (Section 560(1) BGB). If costs fall, he must lower it on his own initiative.' },
      { q: 'What do service charges typically cost per square metre?', a: `There is no official national figure. Berlin’s Senate publishes averages: for ${B.jahr}, ${eE(B.kalt_m2)} per square metre per month for non-heating service charges and ${eE(B.warm_m2)} for heating and hot water. Other cities sit above or below, depending on property tax, water prices and building stock. As a quick test of whether an item stands out, the Berlin figure still works well.` },
      { q: 'What counts as other service charges in a German lease?', a: 'Recurring costs within Section 1 of the ordinance that items 1 to 16 do not cover, such as servicing smoke alarms, fire extinguishers or gutter heating, as long as it is regular checking rather than repair. Because you only pay costs that were agreed, the lease must name each of these other costs. The bare word other (sonstige) does not tell you what you agreed to pay.' },
    ],
    body: (h) => `
<h2>What counts as a service charge</h2>
<p>The definition sits in ${h.src('bgb556', 'Section 556(1) BGB')} and, word for word, in Section 1 of the ordinance: costs that arise for the owner, on a recurring basis, from owning the land or from the intended use of the building, outbuildings, installations and facilities. Two words carry the weight. Recurring means regular, though not necessarily every year: an inspection due every few years can qualify, a one-off purchase cannot. And it is about use, not upkeep: anything spent on fixing wear, ageing or weather damage is maintenance and stays with the owner.</p>
<p>If the landlord does a job himself, say the gardening, he may charge what an equivalent firm would charge, but without that firm’s VAT (Section 1(1), second sentence, BetrKV). He needs to make the figure traceable in the statement, for example with a comparable quote.</p>

<h2>The 17 items on the official list</h2>
<p>The full list is in ${h.src('betrkv', 'Section 2 BetrKV')}. It is closed: a recurring cost that fits none of the items is not a service charge. The table sums up each item with examples taken from the wording of the ordinance.</p>
${h.table(['No.', 'Item', 'What it includes (examples from the text)'], NR.map((n, i) => [String(i + 1), n.en, n.enBsp]), 'Service charges under Section 2 BetrKV, as in force on 12 October 2026', ['r', 'l', 'l'])}
<p>For items 4 to 6 the Heating Costs Ordinance (Heizkostenverordnung) takes precedence: it requires part of the cost to follow metered consumption and gives you deduction rights if that does not happen. See the ${h.a('heizkostenabrechnung', 'heating-cost statement page')}. For the caretaker in item 14, work he does himself must not appear again under items 2 to 10 or 16, otherwise you pay twice for the same job.</p>

<h2>What is expressly excluded</h2>
<p>${h.src('betrkv1', 'Section 1(2) BetrKV')} names two groups that can never be passed on:</p>
<ul>
<li><strong>Management costs (Verwaltungskosten):</strong> staff and equipment for running the building, supervision, the landlord’s own admin, audits and general management.</li>
<li><strong>Maintenance and repair (Instandhaltung, Instandsetzung):</strong> whatever is needed to fix defects caused by wear, ageing and weather.</li>
</ul>
<p>That gives you one question to ask of every invoice: was something run, cleaned, checked or insured, or was something repaired or replaced? A new heating pump, a replaced door lock or a lift repair are repairs even when they appear on the same invoice as routine servicing, and that share must be taken out.</p>

<h2>Cable TV, broadband and fibre since 2024</h2>
<p>Item 15 has been rewritten several times and is where older leases most often no longer match the law. Until 30 June 2024, landlords could pass on the usage fee for a cable connection, fees for cable retransmission and monthly broadband standing charges. Since 1 July 2024 only the operating power and regular checks of a shared aerial remain, and only the power for an in-house cable network. For installations built from 1 December 2021, points a and b no longer apply at all.</p>
<p>Point c is new: running an in-house network connected entirely by fibre to a very high capacity network, provided you can freely choose your provider. Chargeable are the power and a provision fee under the Telecommunications Act. You only bear that fee if the work was carried out economically; for a complex installation the landlord must, where possible, have obtained three quotes and chosen the most economical (${h.src('bgb556', 'Section 556(3a) BGB')}).</p>

<h2>Flat rate or advance payments</h2>
<p>Your lease can deal with service charges in two ways (Section 556(2) BGB). With advance payments you pay a monthly amount, which must be set at a reasonable level, and receive an annual statement as described on the ${h.a('nebenkostenabrechnung', 'service-charge statement page')}. With a flat rate there is no statement. If costs rise, the landlord can only increase the flat rate if the lease provides for it, by a notice in text form that states and explains the reason; it takes effect from the month after next (${h.src('bgb560', 'Section 560(1) and (2) BGB')}). If costs fall, he must cut the flat rate from that point and tell you without delay.</p>

<h2>What service charges usually cost</h2>
<p>There are no official national averages. The ${h.src('berlinBk', 'Berlin service-charge overview')} from the Senate gives mean values for ${B.jahr} of ${h.eur(B.kalt_m2, 2)} per square metre and month for the non-heating items and ${h.eur(B.warm_m2, 2)} for heating and hot water. Scaled to common flat sizes:</p>
${h.table(['Floor area', 'Non-heating per month', 'Heating per month', 'Total per year'], GROESSEN.map((g) => [h.num(g.m) + ' m²', h.eur(g.kalt, 2), h.eur(g.warm, 2), h.eur((g.kalt + g.warm) * 12, 0)]), 'Berlin averages for ' + B.jahr + ' applied to three flat sizes', ['l', 'r', 'r', 'r'])}
<p>A figure above the average is not an error in itself: a building with a lift, a caretaker and large grounds costs more than one without. But if a single item is far above, look at the receipts. The small calculator above converts your non-heating costs to the per-square-metre unit; the ${h.a('nebenkostenabrechnung-pruefen', 'service-charge check')} does the same for heating and checks the deadlines too. If the statement ends in a balance to pay, see the page on the ${h.a('nebenkosten-nachzahlung', 'service-charge top-up')}.</p>
`,
  },
});
