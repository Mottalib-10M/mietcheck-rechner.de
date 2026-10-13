import { defineGuide } from '../../lib/guide-types';
import { stadtDaten, faktenTabelle, offiziell } from '../../lib/stadt-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Valeur supposée tirée du Mietenspiegel : 10,80 €/m² pour 64 m², loyer convenu 820 €.
const D = stadtDaten('nuernberg', 10.8, 64, 820);
const { S, st, mpb, erh } = D;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietspiegel-nuernberg',
  group: 'staedte',
  order: 110,
  tool: 'stadt',
  ort: 'nuernberg',
  related: ['mpb-by', 'mietspiegel-muenchen', 'mieterhoehung-rechner', 'kappungsgrenze', 'mietpreisbremse'],
  sources: ['bgb558d', 'bgb558', 'bgb556d'],
  de: {
    slug: 'mietspiegel-nuernberg',
    nav: 'Mietenspiegel Nürnberg',
    card: 'Fortgeschriebener Mietenspiegel seit August 2026.',
    title: 'Mietspiegel Nürnberg 2026: Mietenspiegel seit August',
    description: `Mietspiegel Nürnberg 2026: der fortgeschriebene Mietenspiegel seit 1. August, Durchschnitt ${eD(S.kennzahl!)} je m² laut Stadt, und wie Bayerns Grenzen Ihre Miete deckeln.`,
    h1: 'Mietenspiegel Nürnberg 2026: neue Ausgabe, bayerische Grenzen',
    intro: 'Nürnberg hat seinen Mietenspiegel zum 1. August 2026 fortgeschrieben; die Grenzen kommen aus der bayerischen Mieterschutzverordnung.',
    resume: `Der Nürnberger Mietenspiegel 2026 ist die 27. Ausgabe und eine Fortschreibung des 2024 neu erstellten qualifizierten Mietenspiegels; er gilt seit dem ${dD(S.gueltigAb!)}. Herausgeber sind die Stadt Nürnberg mit dem Amt für Stadtforschung und Statistik für Nürnberg und Fürth, gemeinsam mit Haus und Grund und dem Mieterbund; ausgewertet hat ein Regensburger Institut. Nach Angaben der Stadt liegt die durchschnittliche Nettokaltmiete bei ${eD(S.kennzahl!)} je Quadratmeter. Der Mietenspiegel ist ein Regressionsmodell: Eine Basismiete nach Wohnfläche wird mit prozentualen Zu- und Abschlägen für Baujahr und Ausstattung angepasst, und um den Mittelwert liegt eine Spanne. Das Urheberrecht liegt bei der Stadt, die ausdrücklich untersagt, die Daten zu vervielfältigen oder elektronisch anzubieten; dieser Rechner nennt deshalb keine Werte. Nürnberg steht in der bayerischen Mieterschutzverordnung: Mietpreisbremse bis zum ${dD(st.mpbBis!)} und 15 Prozent Kappungsgrenze. 2028 will die Stadt den Mietenspiegel neu erstellen.`,
    faqs: [
      { q: 'Was bedeutet fortgeschrieben beim Nürnberger Mietenspiegel 2026?', a: 'Die Stadt hat den 2024 neu erstellten Mietenspiegel an die Marktentwicklung angepasst, statt ihn komplett neu zu erheben. Das sieht § 558d Abs. 2 BGB für qualifizierte Mietspiegel nach zwei Jahren vor. Die Struktur bleibt gleich, die Werte ändern sich. Eine vollständige Neuerstellung mit neuer Befragung hat die Stadt für 2028 angekündigt.' },
      { q: 'Wie stark sind die Nürnberger Mieten laut Mietenspiegel gestiegen?', a: `Nach Angaben der Stadt von 9,65 Euro je Quadratmeter in der Ausgabe 2024 auf ${eD(S.kennzahl!)} in der Ausgabe 2026, ein Plus von 5,4 Prozent in zwei Jahren. Das ist ein Durchschnitt über alle Wohnungen; die Vergleichsmiete Ihrer Wohnung kann deutlich darüber oder darunter liegen, je nach Größe, Baujahr und Ausstattung.` },
      { q: 'Wie viel darf mein Nürnberger Vermieter die Miete erhöhen?', a: `Höchstens 15 Prozent in drei Jahren und nur bis zur Vergleichsmiete. Wer für 64 m² bisher ${eD(D.mieteAlt, 0)} zahlt und laut Mietenspiegel eine Vergleichsmiete von ${eD(10.8)} hat, muss höchstens ${eD(erh.zulaessig)} zustimmen. Die neue Miete gilt frühestens ab dem dritten Monat nach Zugang des Schreibens.` },
    ],
    body: (h) => `
<h2>Ein Mietenspiegel in Prozentschritten</h2>
<p>Nürnberg rechnet in Prozent. Die Basismiete hängt von der Wohnfläche ab, und jedes Merkmal, das vom Durchschnitt abweicht, verschiebt sie um einen Prozentsatz nach oben oder unten: das Baujahr, ein modernisiertes Bad, eine Einbauküche, ein fehlender Balkon. Die Summe der Prozente ergibt den Mittelwert Ihrer Wohnung, um den der Mietenspiegel eine Spanne legt. Grundlage der Ausgabe 2026 ist die städtische Wohnungs- und Haushaltserhebung „Leben in Nürnberg 2025“.</p>
${faktenTabelle(S, st, h)}
<h2>Mit Ihrem Wert weiterrechnen</h2>
<p>Den Mietenspiegel und seine Erläuterungen finden Sie auf der ${offiziell(S, h, 'Seite der Stadt Nürnberg zum Mietenspiegel')}. Tragen Sie den Wert für Ihre Wohnung oben ein. Bei einer Neuvermietung prüft der Mietcheck die bayerische Mietpreisbremse: Mit der Beispielannahme von ${h.eur(10.8, 2)} für 64 m² liegt die Grenze bei ${h.eur(mpb.zulaessig, 2)}; bei ${h.eur(820, 0)} wären ${h.eur(mpb.ueberMonat, 2)} zu viel. Bei einer Erhöhung rechnet er die Kappungsgrenze und die Fristen.</p>
<p>Wie München hat Nürnberg einen Regressionsmietspiegel mit Rechtevorbehalt: ${h.a('mietspiegel-muenchen', 'Mietspiegel München')}. Die bayerische Liste mit allen Gemeinden steht auf der Seite ${h.a('mpb-by', 'Mietpreisbremse Bayern')}.</p>
`,
  },
  en: {
    slug: 'nuremberg-rent-index',
    nav: 'Nuremberg rent index',
    card: 'Updated rent index since August 2026.',
    title: 'Nuremberg Rent Index 2026: Updated Edition since August',
    description: `Nuremberg rent index 2026: the updated index since 1 August, an average of ${eE(S.kennzahl!)} per m² according to the city, and how Bavaria’s limits cap your rent.`,
    h1: 'Nuremberg rent index 2026: new edition, Bavarian limits',
    intro: 'Nuremberg updated its rent index on 1 August 2026; the limits come from Bavaria’s tenant-protection ordinance.',
    resume: `Nuremberg's 2026 rent index (Mietenspiegel) is the 27th edition and an update of the qualified index newly drawn up in 2024; it has applied since ${dE(S.gueltigAb!)}. It is published by the City of Nuremberg with the statistics office for Nuremberg and Fürth, together with Haus und Grund and the tenants' federation; a Regensburg institute did the analysis. According to the city the average net cold rent is ${eE(S.kennzahl!)} per square metre. The index is a regression model: a base rent by floor area is adjusted by percentage premiums and deductions for year built and fittings, with a range around the mean. Copyright lies with the city, which expressly forbids copying the data or offering it electronically, so this calculator gives no figures. Nuremberg is in Bavaria's tenant-protection ordinance: rent brake until ${dE(st.mpbBis!)} and a 15 per cent cap. The city plans to draw up the index from scratch again in 2028.`,
    faqs: [
      { q: 'What does “updated” mean for Nuremberg’s 2026 rent index?', a: 'The city adjusted the index newly drawn up in 2024 to market developments instead of running a full new survey. Section 558d(2) of the Civil Code provides for that after two years in a qualified index. The structure stays, the values change. The city has announced a full new edition with a new survey for 2028.' },
      { q: 'How much have Nuremberg rents risen according to the index?', a: `According to the city, from 9.65 euros per square metre in the 2024 edition to ${eE(S.kennzahl!)} in the 2026 edition, an increase of 5.4 per cent in two years. That is an average over all flats; the reference rent of your flat can be well above or below it, depending on size, year built and fittings.` },
      { q: 'How much may my Nuremberg landlord raise the rent?', a: `By at most 15 per cent in three years and only up to the reference rent. If you pay ${eE(D.mieteAlt, 0)} for 64 m² and the index gives a reference rent of ${eE(10.8)}, you need agree to at most ${eE(erh.zulaessig)}. The new rent applies at the earliest from the third month after the letter arrives.` },
    ],
    body: (h) => `
<h2>An index in percentage steps</h2>
<p>Nuremberg calculates in per cent. The base rent depends on floor area, and each feature that differs from the average moves it up or down by a percentage: year built, a modernised bathroom, a fitted kitchen, no balcony. The sum of percentages gives your flat's mean, around which the index places a range. The 2026 edition draws on the city's housing and household survey “Leben in Nürnberg 2025”.</p>
${faktenTabelle(S, st, h)}
<h2>Working with your figure</h2>
<p>The index and its notes are on the ${offiziell(S, h, 'City of Nuremberg rent index page')}. Enter the value for your flat above. For a new lease the rent check tests Bavaria's rent brake: with the example assumption of ${h.eur(10.8, 2)} for 64 m² the ceiling is ${h.eur(mpb.zulaessig, 2)}; at ${h.eur(820, 0)}, ${h.eur(mpb.ueberMonat, 2)} would be too much. For an increase it works out the cap and the deadlines.</p>
<p>Like Munich, Nuremberg has a regression index with rights reserved: ${h.a('mietspiegel-muenchen', 'Munich rent index')}. Bavaria's full list of municipalities is on the ${h.a('mpb-by', 'rent brake in Bavaria')} page.</p>
`,
  },
});
