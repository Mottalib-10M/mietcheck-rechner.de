import { defineGuide } from '../../lib/guide-types';
import { stadtDaten, faktenTabelle, offiziell } from '../../lib/stadt-seite';
import { formatMoney, formatNumber, displayDate } from '../../lib/format';

// Valeur supposée, saisie par l'utilisateur après le rechner officiel : 17,00 €/m² pour 65 m², loyer convenu 1 250 €.
const D = stadtDaten('muenchen', 17, 65, 1250);
const { S, st, mpb, erh } = D;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const nD = (x: number) => formatNumber(x, 2, 'de'), nE = (x: number) => formatNumber(x, 2, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietspiegel-muenchen',
  group: 'staedte',
  order: 30,
  tool: 'stadt',
  ort: 'muenchen',
  related: ['mpb-by', 'mietpreisbremse-rechner', 'mieterhoehung-rechner', 'qualifizierter-mietspiegel', 'mietspiegel-nuernberg'],
  sources: ['bgb558d', 'bgb556d', 'bgb558'],
  de: {
    slug: 'mietspiegel-muenchen',
    nav: 'Mietspiegel München',
    card: 'Regressionsmietspiegel 2025 mit Grundpreis und Zuschlägen.',
    title: 'Mietspiegel München 2026: Vergleichsmiete, Mietpreisbremse',
    description: 'Mietspiegel München 2026: wie der Regressionsmietspiegel 2025 rechnet, wo Sie Ihren Wert ermitteln und was Mietpreisbremse und Kappungsgrenze daraus machen.',
    h1: 'Mietspiegel München: Vergleichsmiete ermitteln, Grenzen prüfen',
    intro: 'Den Wert liefert der Online-Rechner der Stadt; was er für Ihren Vertrag bedeutet, rechnet der Mietcheck oben.',
    resume: `Der Mietspiegel für München 2025 ist ein qualifizierter Regressionsmietspiegel, den die Landeshauptstadt mit dem Statistischen Amt und dem Sozialreferat erstellt hat; die Erhebung führte ein Marktforschungsinstitut durch, die Auswertung der Lehrstuhl für Statistik der LMU. Laut Stadt beträgt die durchschnittliche Nettokaltmiete ${eD(S.kennzahl!)} je Quadratmeter, ein Plus von 5,5 Prozent gegenüber dem Mietspiegel 2023. Die Vergleichsmiete einer Wohnung ergibt sich nicht aus einem Tabellenfeld, sondern aus einem Grundpreis nach Wohnfläche und Baujahr mit Zu- und Abschlägen für Lage und Ausstattung. Die Stadt behält sich alle Rechte am Mietspiegel und an seiner Veröffentlichung im Internet vor; deshalb übernimmt dieser Rechner keine Münchner Werte. Sie ermitteln die Vergleichsmiete im offiziellen Online-Rechner und tragen sie oben ein. München steht in der bayerischen Mieterschutzverordnung: Mietpreisbremse bis zum ${dD(st.mpbBis!)} und Kappungsgrenze von 15 Prozent.`,
    faqs: [
      { q: 'Wie ermittle ich die Münchner Vergleichsmiete ohne die Broschüre durchzurechnen?', a: 'Mit dem Online-Rechner zum Mietspiegel 2025, den die Stadt kostenlos anbietet. Er fragt Wohnfläche, Baujahr, Lage und Ausstattungsmerkmale ab und gibt den Durchschnittswert mit Spanne aus. Diesen Wert in Euro je Quadratmeter tragen Sie in den Mietcheck ein; der rechnet daraus die Grenze der Mietpreisbremse und die zulässige Mieterhöhung.' },
      { q: 'Warum zeigt dieser Rechner keine Werte aus dem Münchner Mietspiegel an?', a: 'Weil die Landeshauptstadt München sich Vervielfältigung, Verkauf und alle sonstigen Rechte am Mietspiegel, an seiner Dokumentation und an der Veröffentlichung im Internet ausdrücklich vorbehält. Wir respektieren das und verlinken das offizielle Angebot. Zitiert wird nur die Durchschnittsmiete, die die Stadt selbst auf ihrer Seite nennt.' },
      { q: 'Was bedeutet die Mietpreisbremse für eine neue Wohnung in München?', a: `Liegt die Vergleichsmiete laut städtischem Rechner etwa bei ${eD(17, 0)} je Quadratmeter, darf ein neuer Vertrag über 65 m² höchstens ${eD(mpb.zulaessig)} kalt kosten. Bei ${eD(1250, 0)} wären ${eD(mpb.ueberMonat)} im Monat zu viel. Ausnahmen gelten für Erstvermietungen nach dem 1. Oktober 2014, für die erste Vermietung nach Kernsanierung und für eine höhere Vormiete.` },
    ],
    body: (h) => `
<h2>Wie der Münchner Mietspiegel rechnet</h2>
<p>München hat keinen Tabellenmietspiegel. Die Stadt hat die erhobenen Mieten statistisch ausgewertet und daraus ein Rechenmodell gebaut: Ein Grundpreis hängt von Wohnfläche und Baujahr ab, und Zu- oder Abschläge berücksichtigen die Wohnlage, die Ausstattung von Bad und Küche, die Art des Gebäudes und weitere Merkmale. Dazu kommt eine Spanne, innerhalb derer begründete Abweichungen möglich sind. Erfasst wurden Mieten, die in den sechs Jahren vor der Erhebung neu vereinbart oder geändert wurden, wie es § 558 Abs. 2 BGB verlangt. Die nächste neu erstellte Ausgabe kündigt die Stadt für 2027 an.</p>
${faktenTabelle(S, st, h)}
<h2>Was der Mietcheck mit Ihrem Wert macht</h2>
<p>Sie holen sich den Durchschnittswert im ${offiziell(S, h, 'Online-Rechner der Stadt München')} und tragen ihn in Euro je Quadratmeter ein. Für einen neuen Vertrag prüft der Mietcheck dann, ob die Mietpreisbremse am Tag Ihres Vertrags galt, und rechnet die Höchstmiete aus. Für eine Mieterhöhung setzt er die bayerische Kappungsgrenze von ${h.pct(st.kappung, 0)} an: Bei einer bisherigen Miete von ${h.eur(D.mieteAlt, 0)} für 65 m² sind höchstens ${h.eur(erh.zulaessig, 2)} zulässig, auch wenn die Vergleichsmiete ${h.eur(D.verlangt, 0)} erlauben würde. Zustimmen müssten Sie einem Schreiben vom 14. Oktober 2026 bis zum ${h.date(erh.zustimmungBis)}.</p>
<p>München ist eine von zahlreichen bayerischen Gemeinden mit Mietpreisbremse; die vollständige Liste und ihre Laufzeit stehen auf der Seite ${h.a('mpb-by', 'Mietpreisbremse Bayern')}. Wer in Nürnberg sucht, findet dort einen ähnlich aufgebauten Regressionsmietspiegel, ebenfalls mit Rechtevorbehalt: ${h.a('mietspiegel-nuernberg', 'Mietspiegel Nürnberg')}.</p>
`,
  },
  en: {
    slug: 'munich-rent-index',
    nav: 'Munich rent index',
    card: 'Regression index 2025 with base price and adjustments.',
    title: 'Munich Rent Index 2026: Reference Rent and Rent Brake Check',
    description: 'Munich rent index in 2026: how the 2025 regression index works, where to get your figure and what the rent brake and the increase cap in Bavaria do with it.',
    h1: 'Munich rent index: find your reference rent, check the limits',
    intro: 'The city’s online tool gives the figure; the rent check above works out what it means for your lease.',
    resume: `Munich's 2025 rent index (Mietspiegel für München) is a qualified regression index produced by the city with its statistics office and social department; a market research firm ran the survey and the statistics chair of Munich's LMU university did the analysis. According to the city, the average net cold rent is ${eE(S.kennzahl!)} per square metre, 5.5 per cent more than in the 2023 index. A flat's reference rent comes not from a table field but from a base price by floor area and year built, with adjustments for location and fittings. The city reserves all rights to the index and its publication online, so this calculator takes no Munich figures. You get the reference rent from the official online tool and enter it above. Munich is listed in Bavaria's tenant-protection ordinance: rent brake (Mietpreisbremse) until ${dE(st.mpbBis!)} and a 15 per cent increase cap.`,
    faqs: [
      { q: 'How do I get the Munich reference rent without working through the brochure?', a: 'With the free online tool for the 2025 index that the city provides. It asks for floor area, year built, location and fittings and returns the average value with its range. Enter that figure in euros per square metre into the rent check, which then works out the rent-brake ceiling and the lawful increase.' },
      { q: 'Why does this calculator show no figures from the Munich index?', a: 'Because the City of Munich expressly reserves reproduction, sale and all other rights to the index, its documentation and its publication online. We respect that and link the official service instead. The only figure quoted is the average rent the city itself states on its website.' },
      { q: 'What does the rent brake mean for a new flat in Munich?', a: `If the city’s tool gives a reference rent of, say, ${eE(17, 0)} per square metre, a new 65 m² lease may cost at most ${eE(mpb.zulaessig)} a month before service charges. At ${eE(1250, 0)}, ${eE(mpb.ueberMonat)} a month would be too much. Exemptions apply to first lettings after 1 October 2014, the first letting after a full refurbishment, and a higher previous rent.` },
    ],
    body: (h) => `
<h2>How the Munich index calculates</h2>
<p>Munich has no table index. The city analysed the surveyed rents statistically and built a model from them: a base price depends on floor area and year built, and premiums or deductions reflect the residential location, bathroom and kitchen fittings, building type and other features. A range allows for justified deviations. The survey covered rents agreed or changed in the six years before it, as Section 558(2) of the Civil Code requires. The city plans the next fully new edition for 2027.</p>
${faktenTabelle(S, st, h)}
<h2>What the rent check does with your figure</h2>
<p>Get the average value from the ${offiziell(S, h, 'City of Munich online tool')} and enter it in euros per square metre. For a new lease, the rent check then tests whether the rent brake applied on the day you signed and works out the ceiling. For a rent increase it applies Bavaria's ${h.pct(st.kappung, 0)} cap: with a current rent of ${h.eur(D.mieteAlt, 0)} for 65 m², at most ${h.eur(erh.zulaessig, 2)} is lawful, even if the reference rent would allow ${h.eur(D.verlangt, 0)}. You would have until ${h.date(erh.zustimmungBis)} to answer a letter received on 14 October 2026.</p>
<p>Munich is one of many Bavarian municipalities with the rent brake; the full list and its end date are on the ${h.a('mpb-by', 'rent brake in Bavaria')} page. Nuremberg has a similar regression index, also with rights reserved: ${h.a('mietspiegel-nuernberg', 'Nuremberg rent index')}.</p>
`,
  },
});
