import { defineGuide } from '../../lib/guide-types';
import { stadtDaten, faktenTabelle, offiziell } from '../../lib/stadt-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Valeur supposée tirée du Mietspiegel 2026 : 8,10 €/m² pour 72 m², loyer convenu 690 €.
const D = stadtDaten('bremen', 8.1, 72, 690);
const { S, st, mpb, erh } = D;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietspiegel-bremen',
  group: 'staedte',
  order: 120,
  tool: 'stadt',
  ort: 'bremen',
  related: ['mietpreisbremse-rechner', 'mieterhoehung-rechner', 'indexmiete', 'mietspiegel-hamburg', 'qualifizierter-mietspiegel'],
  sources: ['bgb558d', 'bgb556d', 'vpi'],
  de: {
    slug: 'mietspiegel-bremen',
    nav: 'Mietspiegel Bremen',
    card: 'Mietspiegel 2026, per Verbraucherpreisindex fortgeschrieben.',
    title: 'Mietspiegel Bremen 2026: Fortschreibung und Mietpreisbremse',
    description: 'Mietspiegel Bremen 2026: der mit dem Verbraucherpreisindex fortgeschriebene Mietspiegel bis Ende 2027 und warum Bremerhaven nicht in der Verordnung steht.',
    h1: 'Mietspiegel Bremen 2026: fortgeschrieben bis Ende 2027',
    intro: 'Bremen hat seinen Mietspiegel 2024 mit dem Verbraucherpreisindex fortgeschrieben; die Mietpreisbremse gilt in der Stadtgemeinde, nicht in Bremerhaven.',
    resume: `Der qualifizierte Mietspiegel 2026 für die Stadtgemeinde Bremen gilt vom ${dD(S.gueltigAb!)} bis zum ${dD(S.gueltigBis!)}. Er ist die erste Fortschreibung des Mietspiegels 2024: Statt neu zu befragen, wurden die Werte mit der Entwicklung des Verbraucherpreisindex angepasst, wie § 558d Abs. 2 BGB es erlaubt. Herausgeberin ist die Senatorin für Bau, Mobilität und Stadtentwicklung, die Förderbank BAB koordiniert, ein Arbeitskreis aus Mieter- und Vermieterverbänden hat mitgewirkt. Berechnet wird die Vergleichsmiete aus einer Basismiete nach Wohnfläche mit prozentualen Zu- und Abschlägen für Baujahr, Gebäudeart, Bad und Küche, Ausstattung und Wohnlage, um die eine Spanne liegt. Eine Lizenz oder Freigabe für die Werte gibt es nicht, deshalb übernimmt dieser Rechner keine Bremer Tabellenwerte. Bremen gehört zu den Ländern mit Mietpreisbremse: In der Stadtgemeinde Bremen gilt sie bis zum ${dD(st.mpbBis!)}, die Kappungsgrenze von 15 Prozent bis zum ${dD(st.kappungBis!)}. Bremerhaven ist nicht erfasst.`,
    faqs: [
      { q: 'Gilt die Mietpreisbremse auch in Bremerhaven?', a: 'Nein. Die Bremer Mietenbegrenzungsverordnung nennt nur die Stadtgemeinde Bremen. In Bremerhaven gilt bei Vertragsschluss keine Grenze aus § 556d BGB, und für Mieterhöhungen gilt dort die bundesweite Kappungsgrenze von 20 Prozent in drei Jahren. Wer den Mietcheck für Bremerhaven nutzt, wählt das Land Bremen und trägt die Gemeinde ein.' },
      { q: 'Warum ist der Bremer Mietspiegel 2026 nur fortgeschrieben?', a: 'Ein qualifizierter Mietspiegel muss alle zwei Jahre angepasst und alle vier Jahre neu erstellt werden. Für die Anpassung genügt die Entwicklung des Verbraucherpreisindex, und Bremen hat diesen Weg gewählt. Die nächste Ausgabe soll auf einer neuen Datenerhebung beruhen. Bis Ende 2027 bleibt die Fortschreibung 2026 maßgeblich.' },
      { q: 'Wie wirkt die Kappungsgrenze in Bremen?', a: `Bis zum Ablauf der Verordnung darf die Miete in drei Jahren höchstens um 15 Prozent steigen. Bei ${eD(D.mieteAlt, 0)} für 72 m² und einer Vergleichsmiete von ${eD(8.1)} laut Mietspiegel sind höchstens ${eD(erh.zulaessig)} zulässig. Die Grenze bezieht sich auf die Miete drei Jahre vor dem Wirksamwerden, ohne Modernisierungszuschläge.` },
    ],
    body: (h) => `
<h2>Fortschreibung statt Neuerhebung</h2>
<p>Die Bremer Werte beruhen auf einer Erhebung zum 1. März 2023, die für den Mietspiegel 2024 ausgewertet wurde. Für 2026 hat ein Institut sie auf den Stand vom 1. März 2025 hochgerechnet, mit dem Faktor, um den der ${h.src('vpi', 'Verbraucherpreisindex')} in dieser Zeit gestiegen ist. Das Verfahren ist günstiger als eine neue Befragung und gesetzlich vorgesehen; es überträgt aber die Struktur des alten Mietspiegels unverändert. Die Einordnung nach Lage, Baujahr und Ausstattung bleibt damit gleich, die Euro-Beträge steigen einheitlich.</p>
${faktenTabelle(S, st, h)}
<h2>Rechnen mit dem Bremer Wert</h2>
<p>Den Mietspiegel und seine Erläuterungen bietet die ${offiziell(S, h, 'Förderbank BAB für den Bremer Mietspiegel')} an. Mit dem dort ermittelten Wert prüft der Mietcheck einen neuen Vertrag: Mit der Beispielannahme von ${h.eur(8.1, 2)} für 72 m² sind höchstens ${h.eur(mpb.zulaessig, 2)} zulässig, bei ${h.eur(690, 0)} wären ${h.eur(mpb.ueberMonat, 2)} monatlich zu viel. Für eine Erhöhung nennt er die Kappungsgrenze und die Frist: Ein Schreiben vom 14. Oktober 2026 beantworten Sie bis zum ${h.date(erh.zustimmungBis)}.</p>
<p>Wer eine Indexmiete hat, bei dem folgt die Miete ebenfalls dem Verbraucherpreisindex, aber direkt und ohne Mietspiegel: ${h.a('indexmiete', 'Indexmiete')}.</p>
`,
  },
  en: {
    slug: 'bremen-rent-index',
    nav: 'Bremen rent index',
    card: '2026 index, updated with the consumer price index.',
    title: 'Bremen Rent Index 2026: Index Update and Rent Brake Check',
    description: 'Bremen rent index 2026: the qualified index updated with the consumer price index, valid until the end of 2027, and why Bremerhaven is not in the ordinance.',
    h1: 'Bremen rent index 2026: updated until the end of 2027',
    intro: 'Bremen updated its 2024 rent index with the consumer price index; the rent brake applies in the city of Bremen, not in Bremerhaven.',
    resume: `The qualified 2026 rent index for the city of Bremen (Mietspiegel) applies from ${dE(S.gueltigAb!)} to ${dE(S.gueltigBis!)}. It is the first update of the 2024 index: instead of a new survey, the values were adjusted in line with the consumer price index, as Section 558d(2) of the Civil Code allows. It is published by the state's senator for building, mobility and urban development, coordinated by the BAB development bank, with a working group of tenant and landlord associations. The reference rent comes from a base rent by floor area with percentage premiums and deductions for year built, building type, bathroom and kitchen, fittings and location, with a range around it. There is no licence or release for the figures, so this calculator takes no Bremen table values. Bremen is one of the states with a rent brake: in the city of Bremen it applies until ${dE(st.mpbBis!)}, the 15 per cent cap until ${dE(st.kappungBis!)}. Bremerhaven is not covered.`,
    faqs: [
      { q: 'Does the rent brake also apply in Bremerhaven?', a: 'No. Bremen’s rent ordinance names only the city of Bremen. In Bremerhaven no ceiling under Section 556d of the Civil Code applies at signing, and the nationwide 20 per cent cap over three years applies to increases. To use the rent check for Bremerhaven, choose the state of Bremen and enter the town.' },
      { q: 'Why is Bremen’s 2026 index only an update?', a: 'A qualified index must be adjusted every two years and drawn up anew every four. For the adjustment the consumer price index is enough, and Bremen took that route. The next edition is to rest on a new survey. Until the end of 2027 the 2026 update remains decisive.' },
      { q: 'How does the increase cap work in Bremen?', a: `Until the ordinance expires, rent may rise by at most 15 per cent in three years. With ${eE(D.mieteAlt, 0)} for 72 m² and a reference rent of ${eE(8.1)} from the index, at most ${eE(erh.zulaessig)} is lawful. The cap refers to the rent three years before the increase takes effect, without modernisation premiums.` },
    ],
    body: (h) => `
<h2>An update instead of a new survey</h2>
<p>Bremen's figures rest on a survey as of 1 March 2023, analysed for the 2024 index. For 2026 an institute projected them to 1 March 2025 using the factor by which the ${h.src('vpi', 'consumer price index')} rose in that time. The method is cheaper than a new survey and provided for by law, but it carries the old index's structure over unchanged. Placement by location, year built and fittings stays the same, and the euro amounts rise uniformly.</p>
${faktenTabelle(S, st, h)}
<h2>Calculating with the Bremen figure</h2>
<p>The index and its notes are provided by the ${offiziell(S, h, 'BAB development bank for the Bremen index')}. With the value you find there, the rent check tests a new lease: with the example assumption of ${h.eur(8.1, 2)} for 72 m², at most ${h.eur(mpb.zulaessig, 2)} is lawful; at ${h.eur(690, 0)}, ${h.eur(mpb.ueberMonat, 2)} a month would be too much. For an increase it shows the cap and the deadline: a letter received on 14 October 2026 must be answered by ${h.date(erh.zustimmungBis)}.</p>
<p>With an index-linked rent, the rent also follows the consumer price index, but directly and without a rent index: ${h.a('indexmiete', 'index-linked rent')}.</p>
`,
  },
});
