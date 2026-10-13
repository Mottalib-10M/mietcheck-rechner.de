import { defineGuide } from '../../lib/guide-types';
import { stadtDaten, faktenTabelle, offiziell } from '../../lib/stadt-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Valeur supposée tirée du Online-Mietspiegel : 7,90 €/m² pour 58 m², loyer convenu 560 €.
const D = stadtDaten('dresden', 7.9, 58, 560);
const { S, st, mpb, erh } = D;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietspiegel-dresden',
  group: 'staedte',
  order: 90,
  tool: 'stadt',
  ort: 'dresden',
  related: ['mpb-sn', 'mietspiegel-leipzig', 'mieterhoehung-rechner', 'indexmiete', 'qualifizierter-mietspiegel'],
  sources: ['bgb558d', 'bgb558', 'bgb556d'],
  de: {
    slug: 'mietspiegel-dresden',
    nav: 'Mietspiegel Dresden',
    card: 'Online-Mietspiegel 2025 der Stadt, Fortschreibung 2027.',
    title: 'Mietspiegel Dresden 2026: Online-Wert und sächsische Grenzen',
    description: `Mietspiegel Dresden 2026: der qualifizierte Mietspiegel 2025 mit Online-Abfrage, Durchschnitt ${eD(S.kennzahl!)} je m², Fortschreibung 2027 und die Regeln Sachsens.`,
    h1: 'Mietspiegel Dresden: Online-Wert holen, Grenzen prüfen',
    intro: 'Dresden bietet einen Online-Mietspiegel; dessen Ergebnis bringen Sie hier mit Mietpreisbremse und Kappungsgrenze zusammen.',
    resume: `Der Dresdner Mietspiegel 2025 ist der 14. Mietspiegel der Stadt und ein qualifizierter Mietspiegel. Das Sozialamt hat ihn bei einem Hamburger Institut in Auftrag gegeben, erhoben wurden die zum 1. April 2024 gezahlten Mieten, und Mieterverein und Haus und Grund haben ihn in einer Projektgruppe begleitet. Er gilt vom ${dD(S.gueltigAb!)} bis zum ${dD(S.gueltigBis!)}; zum 1. Januar 2027 kündigt die Stadt eine Fortschreibung an. Nach Angaben der Stadt liegt die durchschnittliche Miete aller Dresdner Haushalte bei ${eD(S.kennzahl!)} je Quadratmeter. Gerechnet wird mit einer Basismiete nach Wohnfläche und Faktoren für Baualter, Lage, Ausstattung und energetischen Zustand. Weil die Stadt weder eine Lizenz noch eine ausdrückliche Freigabe für die Werte erteilt, übernimmt dieser Rechner keine Dresdner Tabellenwerte; die Stadt bietet einen Online-Mietspiegel an, dessen Ergebnis Sie eintragen. Dresden steht mit Leipzig in der sächsischen Verordnung: Mietpreisbremse und 15 Prozent Kappungsgrenze bis zum ${dD(st.mpbBis!)}.`,
    faqs: [
      { q: 'Wie benutze ich den Online-Mietspiegel der Stadt Dresden?', a: 'Auf dresden.de geben Sie Adresse, Wohnfläche, Baujahr und Ausstattungsmerkmale ein; der Online-Mietspiegel rechnet daraus die ortsübliche Vergleichsmiete mit ihrer Spanne. Diesen Wert je Quadratmeter tragen Sie in den Mietcheck ein, der die sächsischen Grenzen und Fristen anwendet. Die Broschüre mit allen Tabellen gibt es auch gedruckt.' },
      { q: 'Was ändert die Fortschreibung des Dresdner Mietspiegels 2027?', a: 'Ein qualifizierter Mietspiegel muss nach zwei Jahren an die Marktentwicklung angepasst werden, entweder mit einer Stichprobe oder mit dem Verbraucherpreisindex (§ 558d Abs. 2 BGB). Dresden hat die Fortschreibung zum 1. Januar 2027 angekündigt. Bis dahin gilt die Ausgabe 2025; ein Erhöhungsschreiben aus dem Jahr 2026 muss sich an ihr messen lassen.' },
      { q: 'Wie viel Mieterhöhung ist in Dresden erlaubt?', a: `Höchstens 15 Prozent in drei Jahren, solange die sächsische Verordnung gilt, und nie über die Vergleichsmiete. Bei ${eD(D.mieteAlt, 0)} Miete für 58 m² und einer Vergleichsmiete von ${eD(7.9)} laut Online-Mietspiegel sind höchstens ${eD(erh.zulaessig)} zulässig. Erhöhungen wegen Modernisierung und Betriebskosten zählen bei der Kappungsgrenze nicht mit.` },
    ],
    body: (h) => `
<h2>Wie der Dresdner Mietspiegel rechnet</h2>
<p>Dresden arbeitet mit einem Faktorenmodell. Ausgangspunkt ist eine Basismiete, die von der Wohnfläche abhängt. Dann wird sie mit Faktoren multipliziert, die das Baualter, die Wohnlage, die Ausstattung von Bad, Küche und Wohnung und den energetischen Zustand des Gebäudes abbilden. Aus allen Faktoren ergibt sich ein Gesamtfaktor, und um den Ergebniswert legt der Mietspiegel eine Spanne. Das Modell hat ein Institut aus den erhobenen Mieten geschätzt; die Projektgruppe aus Stadt, Mieterverein und Eigentümerverband hat die Ergebnisse geprüft und anerkannt.</p>
${faktenTabelle(S, st, h)}
<h2>Vom Online-Ergebnis zu Ihrer Grenze</h2>
<p>Im ${offiziell(S, h, 'Online-Mietspiegel der Landeshauptstadt Dresden')} erhalten Sie die Vergleichsmiete für Ihre Adresse. Mit diesem Wert rechnet der Mietcheck bei einem neuen Vertrag die Höchstmiete aus: Mit der Beispielannahme von ${h.eur(7.9, 2)} für 58 m² sind es ${h.eur(mpb.zulaessig, 2)}; wer ${h.eur(560, 0)} vereinbart hat, zahlt ${h.eur(mpb.ueberMonat, 2)} im Monat zu viel. Bei einer Erhöhung prüft er die Kappungsgrenze und gibt das Datum an, bis zu dem Sie antworten müssen: für ein Schreiben vom 14. Oktober 2026 der ${h.date(erh.zustimmungBis)}.</p>
<p>Wer eine Indexmiete hat, für den spielt der Mietspiegel bei Erhöhungen keine Rolle; dann folgt die Miete dem Verbraucherpreisindex, wie die Seite zur ${h.a('indexmiete', 'Indexmiete')} erklärt. Die sächsische Verordnung mit beiden Städten steht auf der Seite ${h.a('mpb-sn', 'Mietpreisbremse Sachsen')}.</p>
`,
  },
  en: {
    slug: 'dresden-rent-index',
    nav: 'Dresden rent index',
    card: 'The city’s 2025 online index, updated in 2027.',
    title: 'Dresden Rent Index 2026: Online Figure and Saxony’s Limits',
    description: `Dresden rent index 2026: the qualified 2025 index with its online lookup, an average of ${eE(S.kennzahl!)} per m², the 2027 update and Saxony’s rent brake and cap rules.`,
    h1: 'Dresden rent index: get the online figure, check the limits',
    intro: 'Dresden offers an online rent index; bring its result together with the rent brake and the cap here.',
    resume: `Dresden's 2025 rent index (Dresdner Mietspiegel) is the city's fourteenth and a qualified index. The social welfare office commissioned it from a Hamburg institute; it surveyed rents paid on 1 April 2024, and the tenants' association and Haus und Grund took part in a project group. It applies from ${dE(S.gueltigAb!)} to ${dE(S.gueltigBis!)}, and the city has announced an update for 1 January 2027. According to the city, the average rent of all Dresden households is ${eE(S.kennzahl!)} per square metre. The calculation uses a base rent by floor area and factors for age, location, fittings and energy performance. Because the city grants neither a licence nor an express release for the figures, this calculator takes no Dresden table values; the city offers an online rent index whose result you enter. Dresden is in Saxony's ordinance with Leipzig: rent brake and a 15 per cent cap until ${dE(st.mpbBis!)}.`,
    faqs: [
      { q: 'How do I use the City of Dresden’s online rent index?', a: 'On dresden.de you enter address, floor area, year built and fittings; the online index works out the local reference rent and its range. Enter that figure per square metre into the rent check, which applies Saxony’s limits and deadlines. The brochure with all tables is also available in print.' },
      { q: 'What will the 2027 update of the Dresden index change?', a: 'A qualified index must be adjusted to the market after two years, using either a sample or the consumer price index (Section 558d(2) of the Civil Code). Dresden has announced its update for 1 January 2027. Until then the 2025 edition applies, and an increase letter from 2026 has to be measured against it.' },
      { q: 'How large a rent increase is allowed in Dresden?', a: `At most 15 per cent in three years while Saxony’s ordinance applies, and never above the reference rent. With rent of ${eE(D.mieteAlt, 0)} for 58 m² and a reference rent of ${eE(7.9)} from the online index, at most ${eE(erh.zulaessig)} is lawful. Increases for modernisation and service charges do not count towards the cap.` },
    ],
    body: (h) => `
<h2>How the Dresden index calculates</h2>
<p>Dresden uses a factor model. The starting point is a base rent that depends on floor area. It is then multiplied by factors reflecting the building's age, the residential location, the fittings of bathroom, kitchen and flat, and the energy performance of the building. All factors combine into an overall factor, and the index places a range around the resulting value. An institute estimated the model from the surveyed rents; the project group of city, tenants' association and owners' association reviewed and recognised the results.</p>
${faktenTabelle(S, st, h)}
<h2>From the online result to your limit</h2>
<p>The ${offiziell(S, h, 'City of Dresden online rent index')} gives the reference rent for your address. With that figure the rent check works out the ceiling for a new lease: with the example assumption of ${h.eur(7.9, 2)} for 58 m² it is ${h.eur(mpb.zulaessig, 2)}; anyone who agreed ${h.eur(560, 0)} pays ${h.eur(mpb.ueberMonat, 2)} a month too much. For an increase it checks the cap and gives the date by which you must answer: ${h.date(erh.zustimmungBis)} for a letter received on 14 October 2026.</p>
<p>With an index-linked rent the rent index plays no part in increases; the rent then follows the consumer price index, as the ${h.a('indexmiete', 'index-linked rent')} page explains. Saxony's ordinance covering both cities is on the ${h.a('mpb-sn', 'rent brake in Saxony')} page.</p>
`,
  },
});
