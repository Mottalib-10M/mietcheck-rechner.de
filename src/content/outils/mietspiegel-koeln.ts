import { defineGuide } from '../../lib/guide-types';
import { stadtDaten, faktenTabelle, offiziell } from '../../lib/stadt-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Valeur supposée lue dans le Mietspiegel de la RIB : 12,50 €/m² pour 70 m², loyer convenu 1 050 €.
const D = stadtDaten('koeln', 12.5, 70, 1050);
const { S, st, mpb, erh } = D;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietspiegel-koeln',
  group: 'staedte',
  order: 40,
  tool: 'stadt',
  ort: 'koeln',
  related: ['mpb-nw', 'vergleichsmiete', 'qualifizierter-mietspiegel', 'mieterhoehung-rechner', 'mietspiegel-duesseldorf'],
  sources: ['bgb558c', 'bgb558a', 'bgb556d'],
  de: {
    slug: 'mietspiegel-koeln',
    nav: 'Mietspiegel Köln',
    card: 'Einfacher Mietspiegel der Immobilienbörse, mit Regeln aus NRW.',
    title: 'Mietspiegel Köln 2026: Vergleichsmiete und Grenzen in NRW',
    description: 'Mietspiegel Köln 2026: was der einfache Mietspiegel 2025 der Rheinischen Immobilienbörse leistet, wo Sie ihn bekommen und welche Grenzen in Köln gelten.',
    h1: 'Mietspiegel Köln: ein einfacher Mietspiegel und strenge Grenzen',
    intro: 'Köln hat keinen qualifizierten Mietspiegel; die Mietpreisbremse und die Kappungsgrenze von 15 Prozent gelten trotzdem.',
    resume: `Der Kölner Mietspiegel 2025 ist die 26. Auflage eines einfachen Mietspiegels, den ein Arbeitskreis aus Mieterverein, Haus- und Grundbesitzerverein, Stadt Köln, Gutachterausschuss und weiteren Verbänden aufstellt und den die Rheinische Immobilienbörse bei der Industrie- und Handelskammer herausgibt. Er beruht nicht auf einer wissenschaftlichen Erhebung im Sinne von § 558d BGB und hat deshalb nicht die gesetzliche Vermutung eines qualifizierten Mietspiegels für sich; als Begründungsmittel einer Mieterhöhung und als Orientierung taugt er trotzdem. Er ist ein Tabellenmietspiegel nach Baualter, Wohnlage, Größe und Ausstattung. Die Herausgeberin erlaubt die Wiedergabe im Internet nur mit ihrer Zustimmung, also zeigt dieser Rechner keine Kölner Werte. Sie lesen den Wert im kostenlosen Download nach und tragen ihn ein. Köln steht in der Mieterschutzverordnung von Nordrhein-Westfalen: Mietpreisbremse bis zum ${dD(st.mpbBis!)}, Kappungsgrenze 15 Prozent bis zum ${dD(st.kappungBis!)}.`,
    faqs: [
      { q: 'Was ändert es, dass der Kölner Mietspiegel nur ein einfacher Mietspiegel ist?', a: 'Bei einem qualifizierten Mietspiegel wird vermutet, dass seine Werte die ortsübliche Vergleichsmiete wiedergeben; wer das bestreitet, muss es widerlegen. Beim einfachen Kölner Mietspiegel fehlt diese Vermutung. Gerichte können ihn als Anhaltspunkt verwenden, im Streit kann aber ein Gutachten den Ausschlag geben. Für die Begründung eines Erhöhungsschreibens genügt er.' },
      { q: 'Wie hoch darf eine neue Miete in Köln sein?', a: `Höchstens die Vergleichsmiete plus zehn Prozent. Liest jemand im Kölner Mietspiegel für seine 70-m²-Wohnung beispielsweise ${eD(12.5)} je Quadratmeter ab, liegt die Grenze bei ${eD(mpb.zulaessig)} kalt. Eine vereinbarte Miete von ${eD(1050, 0)} läge dann um ${eD(mpb.ueberMonat)} im Monat darüber, sofern keine Ausnahme wie Erstbezug nach dem 1. Oktober 2014 greift.` },
      { q: 'Wo bekomme ich den Kölner Mietspiegel?', a: 'Als kostenlosen Download auf der Website der Rheinischen Immobilienbörse oder gedruckt gegen eine Schutzgebühr. Eine Online-Abfrage mit Adresseingabe bietet die Herausgeberin nicht an; die Wohnlage schätzen Sie anhand der Beschreibungen im Mietspiegel selbst ein. Die Stadt Köln verweist auf denselben Mietspiegel.' },
    ],
    body: (h) => `
<h2>Wer den Kölner Mietspiegel macht</h2>
<p>Anders als in Berlin oder München ist in Köln nicht die Stadt Herausgeberin. Zusammengestellt wird der Mietspiegel bei der Rheinischen Immobilienbörse, einer Einrichtung bei der IHK Köln, in einem Arbeitskreis, in dem Mieter- und Vermieterseite, die Stadt, der Gutachterausschuss und Maklerverbände sitzen. Eine repräsentative Erhebung nach wissenschaftlichen Grundsätzen liegt ihm nicht zugrunde. Das Gesetz lässt solche Mietspiegel ausdrücklich zu: Nach § 558c BGB genügt es, dass Interessenvertreter von Mietern und Vermietern ihn gemeinsam erstellen oder anerkennen.</p>
${faktenTabelle(S, st, h)}
<h2>Rechnen mit Ihrem Kölner Wert</h2>
<p>Lesen Sie im ${offiziell(S, h, 'Mietspiegel der Rheinischen Immobilienbörse')} das Feld für Baualter, Lage, Größe und Ausstattung Ihrer Wohnung ab und tragen Sie einen Wert innerhalb der Spanne ein. Der Mietcheck rechnet daraus für einen neuen Vertrag die Höchstmiete. Für eine Mieterhöhung wendet er die Kölner Kappungsgrenze an: Wer bisher ${h.eur(D.mieteAlt, 0)} zahlt, muss höchstens ${h.eur(erh.zulaessig, 2)} zustimmen, auch wenn der Mietspiegelwert bei ${h.eur(D.verlangt, 0)} läge. Die Zustimmungsfrist für ein Schreiben vom 14. Oktober 2026 läuft bis zum ${h.date(erh.zustimmungBis)}.</p>
<p>Köln ist eine der Gemeinden der ${h.a('mpb-nw', 'Mieterschutzverordnung NRW')}; die Nachbarn Düsseldorf und Bonn stehen ebenfalls darin. Den Unterschied zwischen einfachem und qualifiziertem Mietspiegel erklärt die Seite zum ${h.a('qualifizierter-mietspiegel', 'qualifizierten Mietspiegel')}.</p>
`,
  },
  en: {
    slug: 'cologne-rent-index',
    nav: 'Cologne rent index',
    card: 'Simple index by the property exchange, with NRW rules.',
    title: 'Cologne Rent Index 2026: Reference Rent and Limits in NRW',
    description: 'Cologne rent index 2026: what the simple 2025 index of the Rhineland property exchange offers, where to get it and which limits apply to your rent in Cologne.',
    h1: 'Cologne rent index: a simple index and strict limits',
    intro: 'Cologne has no qualified rent index; the rent brake and the 15 per cent cap still apply.',
    resume: `Cologne's 2025 rent index (Kölner Mietspiegel) is the 26th edition of a simple index drawn up by a working group of the tenants' association, the homeowners' association, the City of Cologne, the valuation committee and other bodies, and published by the Rhineland property exchange (Rheinische Immobilienbörse) at the chamber of commerce. It does not rest on a scientific survey within the meaning of Section 558d of the Civil Code, so it lacks the legal presumption a qualified index carries; it still serves to justify a rent increase and as guidance. It is a table index by age, location, size and fittings. The publisher only allows online reproduction with its consent, so this calculator shows no Cologne figures. You look the value up in the free download and enter it. Cologne is in North Rhine-Westphalia's tenant-protection ordinance: rent brake until ${dE(st.mpbBis!)}, 15 per cent cap until ${dE(st.kappungBis!)}.`,
    faqs: [
      { q: 'What difference does it make that Cologne’s index is only a simple one?', a: 'With a qualified index, the law presumes its figures reflect the local reference rent, and whoever disputes that must disprove it. Cologne’s simple index lacks that presumption. Courts can use it as a guide, but in a dispute an expert opinion may decide. It is still enough to justify an increase letter.' },
      { q: 'How high may a new rent in Cologne be?', a: `At most the reference rent plus ten per cent. If someone reads, say, ${eE(12.5)} per square metre in the Cologne index for a 70 m² flat, the ceiling is ${eE(mpb.zulaessig)} before service charges. An agreed rent of ${eE(1050, 0)} would then be ${eE(mpb.ueberMonat)} a month too high, unless an exemption such as a first letting after 1 October 2014 applies.` },
      { q: 'Where do I get the Cologne rent index?', a: 'As a free download from the Rhineland property exchange website, or in print for a small fee. The publisher offers no online lookup by address; you judge the residential location yourself from the descriptions in the index. The City of Cologne refers to the same index.' },
    ],
    body: (h) => `
<h2>Who makes the Cologne index</h2>
<p>Unlike Berlin or Munich, the city is not the publisher in Cologne. The index is compiled at the Rhineland property exchange, a body at the Cologne chamber of commerce, by a working group of tenant and landlord representatives, the city, the valuation committee and estate agents' associations. It does not rest on a representative survey carried out to scientific standards. The law expressly allows such indexes: under Section 558c of the Civil Code it is enough for tenant and landlord representatives to draw one up or recognise it jointly.</p>
${faktenTabelle(S, st, h)}
<h2>Calculating with your Cologne figure</h2>
<p>Read the field for your flat's age, location, size and fittings in the ${offiziell(S, h, 'property exchange rent index')} and enter a value within its range. For a new lease, the rent check works out the ceiling. For a rent increase it applies Cologne's cap: if you pay ${h.eur(D.mieteAlt, 0)} now, you need agree to at most ${h.eur(erh.zulaessig, 2)}, even if the index value were ${h.eur(D.verlangt, 0)}. For a letter received on 14 October 2026, the consent period runs until ${h.date(erh.zustimmungBis)}.</p>
<p>Cologne is one of the municipalities in the ${h.a('mpb-nw', 'NRW tenant-protection ordinance')}; neighbouring Düsseldorf and Bonn are listed too. The ${h.a('qualifizierter-mietspiegel', 'qualified rent index')} page explains the difference between a simple and a qualified index.</p>
`,
  },
});
