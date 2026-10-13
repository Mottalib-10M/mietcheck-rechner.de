import { defineGuide } from '../../lib/guide-types';
import { stadtDaten, faktenTabelle, offiziell } from '../../lib/stadt-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Valeur supposée lue dans le Mietspiegel : 7,40 €/m² pour 62 m², loyer convenu 560 €.
const D = stadtDaten('leipzig', 7.4, 62, 560);
const { S, st, mpb, erh } = D;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietspiegel-leipzig',
  group: 'staedte',
  order: 80,
  tool: 'stadt',
  ort: 'leipzig',
  related: ['mpb-sn', 'mietspiegel-dresden', 'mietpreisbremse-rechner', 'staffelmiete', 'vergleichsmiete'],
  sources: ['bgb558d', 'bgb556d', 'bgb556f'],
  de: {
    slug: 'mietspiegel-leipzig',
    nav: 'Mietspiegel Leipzig',
    card: 'Mietspiegel 2025 bis 2027, Regeln aus Sachsen bis Mitte 2027.',
    title: 'Mietspiegel Leipzig 2026: Vergleichsmiete, Mietpreisbremse',
    description: 'Mietspiegel Leipzig 2026, Ausgabe 2025 bis 2027: so ermitteln Sie Ihren Wert, und so wirken Mietpreisbremse und Kappungsgrenze in Sachsen bis Juni 2027.',
    h1: 'Mietspiegel Leipzig: Wert ermitteln und sächsische Grenzen anwenden',
    intro: 'Der Leipziger Mietspiegel gilt bis Ende Juni 2027, genauso lange wie die sächsische Mietpreisbremse.',
    resume: `Der Leipziger Mietspiegel 2025 bis 2027 gilt vom ${dD(S.gueltigAb!)} bis zum ${dD(S.gueltigBis!)}. Er ist qualifiziert: Das Sozialamt hat ihn mit dem Amt für Statistik und Wahlen aus einer eigenen Befragung zum Stichtag 1. Oktober 2024 erstellt, wissenschaftlich begleitet von der Universität Leipzig, und der Stadtrat sowie Mieterverein und Vermieterplattform haben ihn anerkannt. Die Vergleichsmiete ergibt sich aus einem Regressionsmodell; die Broschüre stellt es in Tabellen nach Baualtersklassen mit Spannen von zwei Dritteln der Mieten dar, und die Wohnlage beurteilen Sie mit einer Karte und einer Tabelle der Stadt. Die Stadt behält sich alle Rechte vor und untersagt die gewerbliche Vervielfältigung ohne Genehmigung; dieser Rechner nennt deshalb keine Leipziger Werte. Leipzig und Dresden sind die beiden Städte der sächsischen Verordnung: Mietpreisbremse und Kappungsgrenze von 15 Prozent gelten bis zum ${dD(st.mpbBis!)}.`,
    faqs: [
      { q: 'Was gilt in Leipzig, wenn die sächsische Mietpreisbremse im Juni 2027 endet?', a: `Die Verordnung tritt mit Ablauf des ${dD(st.mpbBis!)} außer Kraft. Verträge, die bis dahin geschlossen werden, bleiben an die Grenze gebunden; für spätere gilt sie nur, wenn Sachsen verlängert. Das Bundesrecht erlaubt Verordnungen bis Ende 2029. Für Mieterhöhungen ist das Datum entscheidend, an dem das Schreiben ankommt.` },
      { q: 'Wie wirkt sich der Mietspiegel auf eine Leipziger Staffelmiete aus?', a: 'Bei einer Staffelmiete gilt die Mietpreisbremse für jede einzelne Stufe, gemessen an der Vergleichsmiete zu dem Zeitpunkt, an dem die Stufe fällig wird. Eine Staffel, die ab Mitte 2027 über zehn Prozent über der Vergleichsmiete liegt, ist nur dann zulässig, wenn die Verordnung zu diesem Zeitpunkt nicht mehr gilt. Die Seite zur Staffelmiete zeigt die Prüfung.' },
      { q: 'Wie hoch darf eine neue Leipziger Miete sein?', a: `Höchstens die Vergleichsmiete plus zehn Prozent. Liest jemand im Leipziger Mietspiegel für 62 m² etwa ${eD(7.4)} je Quadratmeter ab, liegt die Grenze bei ${eD(mpb.zulaessig)} kalt; bei vereinbarten ${eD(560, 0)} wären ${eD(mpb.ueberMonat)} monatlich zu viel. Nicht erfasst sind Erstvermietungen nach dem 1. Oktober 2014.` },
    ],
    body: (h) => `
<h2>Ein Mietspiegel aus eigener Befragung</h2>
<p>Leipzig hat für diesen Mietspiegel Haushalte von Oktober 2024 bis Februar 2025 selbst befragt. Ausgewertet wurde mit einem Regressionsmodell, das den Einfluss von Größe, Baujahr, Ausstattung und Lage auf die Miete schätzt. Für die Anwendung hat die Stadt das Modell in Tabellen übersetzt: Sie suchen die Tabelle Ihrer Baualtersklasse, lesen den Wert für Ihre Fläche ab und berücksichtigen die Merkmale, die die Broschüre aufführt. Die Lage beurteilen Sie anhand von Karte und Tabelle, die die Stadt zusätzlich veröffentlicht.</p>
${faktenTabelle(S, st, h)}
<h2>Mit dem Leipziger Wert weiterrechnen</h2>
<p>Den Mietspiegel und die Lagekarte finden Sie auf der ${offiziell(S, h, 'Mietspiegel-Seite der Stadt Leipzig')}. Tragen Sie den Wert, den Sie dort ermitteln, oben ein. Bei einer Mieterhöhung gilt die abgesenkte Kappungsgrenze: Bei ${h.eur(D.mieteAlt, 0)} bisheriger Miete für 62 m² sind höchstens ${h.eur(erh.zulaessig, 2)} zulässig, selbst wenn die Vergleichsmiete ${h.eur(D.verlangt, 0)} hergäbe. Die Zustimmungsfrist für ein Schreiben vom 14. Oktober 2026 endet am ${h.date(erh.zustimmungBis)}.</p>
<p>Dresden steht in derselben Verordnung und hat einen eigenen qualifizierten Mietspiegel: ${h.a('mietspiegel-dresden', 'Mietspiegel Dresden')}. Die Einzelheiten der sächsischen Verordnung stehen auf der Seite ${h.a('mpb-sn', 'Mietpreisbremse Sachsen')}.</p>
`,
  },
  en: {
    slug: 'leipzig-rent-index',
    nav: 'Leipzig rent index',
    card: '2025 to 2027 index, Saxony’s rules until mid-2027.',
    title: 'Leipzig Rent Index 2026: Reference Rent and Rent Brake Check',
    description: 'Leipzig rent index in 2026: how to find your figure in the 2025 to 2027 index, and how the rent brake and the increase cap in Saxony work until June 2027.',
    h1: 'Leipzig rent index: find your figure, apply Saxony’s limits',
    intro: 'The Leipzig rent index runs until the end of June 2027, as long as Saxony’s rent brake.',
    resume: `Leipzig's 2025 to 2027 rent index (Leipziger Mietspiegel) applies from ${dE(S.gueltigAb!)} to ${dE(S.gueltigBis!)}. It is qualified: the city's social welfare office built it with the statistics office from its own survey as of 1 October 2024, with scientific support from Leipzig University, and the city council, the tenants' association and the landlords' platform recognised it. The reference rent comes from a regression model; the brochure presents it as tables by construction period, with ranges covering two thirds of rents, and you assess the location with a map and a table published by the city. The city reserves all rights and forbids commercial reproduction without permission, so this calculator gives no Leipzig figures. Leipzig and Dresden are the two cities in Saxony's ordinance: the rent brake and the 15 per cent cap apply until ${dE(st.mpbBis!)}.`,
    faqs: [
      { q: 'What applies in Leipzig when Saxony’s rent brake ends in June 2027?', a: `The ordinance expires at the end of ${dE(st.mpbBis!)}. Leases signed until then remain bound by the ceiling; later ones only if Saxony extends it. Federal law allows ordinances until the end of 2029. For rent increases, what counts is the date the letter arrives.` },
      { q: 'How does the index affect a graduated rent in Leipzig?', a: 'With a graduated rent (Staffelmiete) the rent brake applies to each step, measured against the reference rent when that step falls due. A step from mid-2027 more than ten per cent above the reference rent is only lawful if the ordinance has expired by then. The graduated rent page shows the check.' },
      { q: 'How high may a new Leipzig rent be?', a: `At most the reference rent plus ten per cent. If someone reads, say, ${eE(7.4)} per square metre for 62 m² in the Leipzig index, the ceiling is ${eE(mpb.zulaessig)} before service charges; at an agreed ${eE(560, 0)}, ${eE(mpb.ueberMonat)} a month would be too much. First lettings after 1 October 2014 are not covered.` },
    ],
    body: (h) => `
<h2>An index from the city’s own survey</h2>
<p>For this index Leipzig surveyed households itself from October 2024 to February 2025. The analysis used a regression model that estimates how size, year built, fittings and location affect rent. To make it usable the city turned the model into tables: you find the table for your construction period, read the value for your floor area and take into account the features the brochure lists. You assess the location with the map and table the city publishes alongside.</p>
${faktenTabelle(S, st, h)}
<h2>Working with the Leipzig figure</h2>
<p>The index and the location map are on the ${offiziell(S, h, 'City of Leipzig rent index page')}. Enter the value you find there above. For a rent increase the lowered cap applies: with a current rent of ${h.eur(D.mieteAlt, 0)} for 62 m², at most ${h.eur(erh.zulaessig, 2)} is lawful, even if the reference rent would give ${h.eur(D.verlangt, 0)}. The consent period for a letter received on 14 October 2026 ends on ${h.date(erh.zustimmungBis)}.</p>
<p>Dresden is in the same ordinance and has its own qualified index: ${h.a('mietspiegel-dresden', 'Dresden rent index')}. The details of Saxony's ordinance are on the ${h.a('mpb-sn', 'rent brake in Saxony')} page.</p>
`,
  },
});
