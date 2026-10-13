import { defineGuide } from '../../lib/guide-types';
import { stadtDaten, faktenTabelle, offiziell } from '../../lib/stadt-seite';
import { landVo } from '../../lib/engine/gebiet';
const weitere = landVo('NW')!.mpb!.gemeinden.length - 4;
import { formatMoney, displayDate } from '../../lib/format';

// Valeur supposée lue dans le Mietspiegel : 11,80 €/m² pour 75 m², loyer convenu 1 020 €.
const D = stadtDaten('duesseldorf', 11.8, 75, 1020);
const { S, st, mpb, erh } = D;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietspiegel-duesseldorf',
  group: 'staedte',
  order: 70,
  tool: 'stadt',
  ort: 'duesseldorf',
  related: ['mpb-nw', 'mietspiegel-koeln', 'mieterhoehung', 'vergleichsmiete', 'mietpreisbremse-rechner'],
  sources: ['bgb558c', 'bgb558a', 'bgb558'],
  de: {
    slug: 'mietspiegel-duesseldorf',
    nav: 'Mietspiegel Düsseldorf',
    card: 'Neuer Mietspiegel seit August 2026, von beiden Verbänden.',
    title: 'Mietspiegel Düsseldorf 2026: neue Ausgabe seit August',
    description: 'Mietspiegel Düsseldorf 2026: seit 1. August gilt die neue Ausgabe von Haus und Grund und Mieterverein; so nutzen Sie sie für Mietpreisbremse und Mieterhöhung.',
    h1: 'Mietspiegel Düsseldorf 2026: die neue Ausgabe richtig nutzen',
    intro: 'Seit dem 1. August 2026 gibt es einen neuen Düsseldorfer Mietspiegel; den Wert tragen Sie oben ein, die Regeln aus NRW kommen dazu.',
    resume: `Seit dem ${dD(S.gueltigAb!)} gilt in Düsseldorf ein neuer Mietspiegel. Herausgegeben wird er nicht von der Stadt, sondern gemeinsam von Haus und Grund Düsseldorf und Umgebung und vom Mieterverein Düsseldorf; die Stadt verweist auf ihn. Er ist ein Tabellenmietspiegel mit Spannen und Mittelwerten nach Baujahr und Wohnlage, einfach, mittel oder gut, und mit Zu- und Abschlägen für einzelne Merkmale. Einen Hinweis auf eine Anerkennung als qualifizierter Mietspiegel enthält er nicht; er ist daher ein einfacher Mietspiegel, der als Begründungsmittel genügt, aber keine gesetzliche Vermutung trägt. Jede Seite des PDF trägt den Vermerk, dass Abdruck verboten ist. Dieser Rechner nennt deshalb keine Düsseldorfer Werte; Sie lesen Ihren Wert im Mietspiegel ab und tragen ihn ein. Düsseldorf steht in der Mieterschutzverordnung von Nordrhein-Westfalen: Mietpreisbremse bis zum ${dD(st.mpbBis!)} und Kappungsgrenze von 15 Prozent bis zum ${dD(st.kappungBis!)}.`,
    faqs: [
      { q: 'Darf mein Vermieter eine Düsseldorfer Mieterhöhung noch mit dem alten Mietspiegel begründen?', a: 'Seit dem 1. August 2026 liegt ein neuer Mietspiegel vor, und ein Erhöhungsschreiben sollte sich auf ihn stützen. Nach § 558a Abs. 4 BGB darf ein veralteter Mietspiegel nur verwendet werden, wenn kein aktueller vorhanden ist. Ein Schreiben vom Herbst 2026 mit Werten der alten Ausgabe ist deshalb angreifbar; lassen Sie es im Zweifel beim Mieterverein prüfen.' },
      { q: 'Wie hoch darf die Miete bei einem neuen Vertrag in Düsseldorf sein?', a: `Höchstens zehn Prozent über der Vergleichsmiete, solange keine Ausnahme greift. Ergibt der Mietspiegel für eine 75-m²-Wohnung etwa ${eD(11.8)} je Quadratmeter, sind ${eD(mpb.zulaessig)} kalt die Obergrenze. Bei ${eD(1020, 0)} lägen ${eD(mpb.ueberMonat)} monatlich darüber. Neubauten mit Erstbezug nach dem 1. Oktober 2014 sind ausgenommen.` },
      { q: 'Wo gibt es den Düsseldorfer Mietspiegel?', a: 'Als PDF über die gemeinsame Website der beiden Verbände und gedruckt gegen eine Schutzgebühr bei Haus und Grund oder dem Mieterverein. Eine Online-Abfrage nach Adresse gibt es nicht; die Wohnlage ordnen Sie nach den Beschreibungen im Mietspiegel ein. Bei Streit über die Lage helfen die Beratungsstellen beider Verbände.' },
    ],
    body: (h) => `
<h2>Ein Mietspiegel der beiden Verbände</h2>
<p>Das Gesetz kennt zwei Wege zu einem Mietspiegel: Die Gemeinde erstellt oder anerkennt ihn, oder Interessenvertreter von Mietern und Vermietern erstellen oder anerkennen ihn gemeinsam (${h.src('bgb558c', '§ 558c BGB')}). Düsseldorf geht den zweiten Weg. Haus und Grund und der Mieterverein einigen sich auf eine Tabelle, die Spannen und Mittelwerte für Baualtersgruppen und Lagen nennt, und auf eine Liste von Zu- und Abschlägen in Euro oder Prozent. Dass beide Seiten zustimmen, gibt dem Mietspiegel in der Praxis Gewicht, auch ohne Qualifizierung.</p>
${faktenTabelle(S, st, h)}
<h2>Vom Mietspiegelwert zur Grenze</h2>
<p>Lesen Sie im ${offiziell(S, h, 'Düsseldorfer Mietspiegel')} das Feld für Baujahr und Lage ab, wenden Sie die Zu- und Abschläge für Ihre Wohnung an und tragen Sie das Ergebnis je Quadratmeter oben ein. Für eine Mieterhöhung prüft der Mietcheck dann die Kappungsgrenze: Bei ${h.eur(D.mieteAlt, 0)} bisheriger Miete sind höchstens ${h.eur(erh.zulaessig, 2)} zulässig, auch wenn der Vermieter ${h.eur(D.verlangt, 0)} verlangt. Ein Schreiben vom 14. Oktober 2026 müssen Sie bis zum ${h.date(erh.zustimmungBis)} beantworten.</p>
<p>Düsseldorf teilt sich die Verordnung mit Köln, Bonn, Münster und ${weitere} weiteren Kommunen in NRW: ${h.a('mpb-nw', 'Mietpreisbremse Nordrhein-Westfalen')}. Den Kölner Mietspiegel, ebenfalls von Verbänden erstellt, erklärt die Seite ${h.a('mietspiegel-koeln', 'Mietspiegel Köln')}.</p>
`,
  },
  en: {
    slug: 'duesseldorf-rent-index',
    nav: 'Düsseldorf rent index',
    card: 'New index since August 2026, by both associations.',
    title: 'Düsseldorf Rent Index 2026: New Edition since August',
    description: 'Düsseldorf rent index 2026: a new edition by the homeowners’ and tenants’ associations has applied since 1 August; how to use it for the rent brake and rises.',
    h1: 'Düsseldorf rent index 2026: using the new edition properly',
    intro: 'A new Düsseldorf rent index applies from 1 August 2026; enter its figure above and the NRW rules are added.',
    resume: `Since ${dE(S.gueltigAb!)}, Düsseldorf has had a new rent index (Mietspiegel). It is published not by the city but jointly by the homeowners' association Haus und Grund Düsseldorf und Umgebung and the Düsseldorf tenants' association (Mieterverein); the city refers to it. It is a table index with ranges and means by year built and residential location, basic, average or good, plus premiums and deductions for individual features. It contains no reference to recognition as a qualified index, so it is a simple index: enough to justify an increase, but without the legal presumption. Every page of the PDF carries the note that reprinting is forbidden. This calculator therefore gives no Düsseldorf figures; you read your value in the index and enter it. Düsseldorf is in North Rhine-Westphalia's tenant-protection ordinance: rent brake until ${dE(st.mpbBis!)} and a 15 per cent cap until ${dE(st.kappungBis!)}.`,
    faqs: [
      { q: 'May my landlord still justify a Düsseldorf increase with the old index?', a: 'A new index has existed since 1 August 2026, and an increase letter should rely on it. Under Section 558a(4) of the Civil Code an outdated index may only be used when no current one exists. A letter from autumn 2026 quoting figures from the old edition is therefore open to challenge; if in doubt, have the tenants’ association check it.' },
      { q: 'How high may the rent be on a new lease in Düsseldorf?', a: `At most ten per cent above the reference rent unless an exemption applies. If the index gives, say, ${eE(11.8)} per square metre for a 75 m² flat, ${eE(mpb.zulaessig)} before service charges is the ceiling. At ${eE(1020, 0)}, ${eE(mpb.ueberMonat)} a month would be above it. New builds first let after 1 October 2014 are exempt.` },
      { q: 'Where can I get the Düsseldorf rent index?', a: 'As a PDF from the joint website of the two associations, and in print for a small fee from Haus und Grund or the Mieterverein. There is no online lookup by address; you place the location using the descriptions in the index. In a dispute about the location, both associations’ advice services can help.' },
    ],
    body: (h) => `
<h2>An index made by the two associations</h2>
<p>The law knows two routes to a rent index: the municipality draws it up or recognises it, or tenant and landlord representatives draw it up or recognise it jointly (${h.src('bgb558c', 'Section 558c BGB')}). Düsseldorf takes the second route. Haus und Grund and the Mieterverein agree a table with ranges and means for age groups and locations, and a list of premiums and deductions in euros or per cent. Agreement by both sides gives the index weight in practice, even without qualification.</p>
${faktenTabelle(S, st, h)}
<h2>From the index value to the limit</h2>
<p>Read the field for year built and location in the ${offiziell(S, h, 'Düsseldorf rent index')}, apply the premiums and deductions for your flat and enter the result per square metre above. For a rent increase the rent check then applies the cap: with a current rent of ${h.eur(D.mieteAlt, 0)}, at most ${h.eur(erh.zulaessig, 2)} is lawful even if the landlord asks ${h.eur(D.verlangt, 0)}. A letter received on 14 October 2026 must be answered by ${h.date(erh.zustimmungBis)}.</p>
<p>Düsseldorf shares the ordinance with Cologne, Bonn, Münster and ${weitere} other NRW municipalities: ${h.a('mpb-nw', 'rent brake in North Rhine-Westphalia')}. The Cologne index, also made by associations, is explained on the ${h.a('mietspiegel-koeln', 'Cologne rent index')} page.</p>
`,
  },
});
