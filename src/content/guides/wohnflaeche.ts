import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { wohnflaeche, mietpreisbremse } from '../../lib/engine/miete';
import { berlinOvm } from '../../lib/engine/berlin';
import { formatMoney, formatNumber } from '../../lib/format';

const W = P.woflv;
// Dachgeschoss : 52 m² sous 2 m et plus, 14 m² entre 1 et 2 m, 4 m² sous 1 m, balcon 8 m².
const dg = wohnflaeche({ voll: 52, halb: 14, balkon: 8 });
const naiv = 52 + 14 + 4 + 8;
const halbBalkon = wohnflaeche({ voll: 52, halb: 14, balkon: 8, balkonQuote: W.balkon_max });
const bReal = berlinOvm({ lage: 'mittel', baujahr: 1910, flaeche: dg.flaeche });
const bNaiv = berlinOvm({ lage: 'mittel', baujahr: 1910, flaeche: naiv });
const mpReal = mietpreisbremse({ ovm: bReal.ovm, flaeche: dg.flaeche, miete: 720, gebiet: true });
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const nD = (x: number) => formatNumber(x, 2, 'de'), nE = (x: number) => formatNumber(x, 2, 'en');

export default defineGuide({
  id: 'wohnflaeche',
  group: 'vertrag',
  order: 100,
  mini: 'flaeche',
  miniHref: 'mietpreisbremse-rechner',
  related: ['vergleichsmiete', 'mietpreisbremse-rechner', 'nebenkosten', 'mieterhoehung', 'mietspiegel'],
  sources: ['woflv', 'bgb558', 'bgb556a', 'berlinMs'],
  de: {
    slug: 'wohnflaeche-berechnen',
    nav: 'Wohnfläche berechnen',
    card: 'Dachschräge, Balkon und Keller nach der Wohnflächenverordnung.',
    title: 'Wohnfläche berechnen 2026: Dachschräge, Balkon, Abstellraum',
    description: 'Wohnfläche berechnen 2026 nach Wohnflächenverordnung: volle Fläche ab zwei Meter Höhe, Hälfte darunter, Balkon meist ein Viertel, Keller und Waschküche nie.',
    h1: 'Wohnfläche berechnen: was zählt und was nicht',
    intro: 'Die Wohnfläche geht in fast jede Mietrechnung ein: Vergleichsmiete, Mietpreisbremse, Betriebskosten und Heizkosten.',
    resume: `Wie groß eine Mietwohnung ist, bestimmt nach üblicher Praxis die Wohnflächenverordnung, die für den geförderten Wohnungsbau gilt und auch bei freien Mietverträgen herangezogen wird, wenn nichts anderes vereinbart ist. Nach ihrem § 4 zählen die Grundflächen von Räumen mit einer lichten Höhe von mindestens zwei Metern voll, Flächen mit einer Höhe zwischen einem und zwei Metern zur Hälfte und Flächen unter einem Meter gar nicht. Unbeheizbare Wintergärten zählen zur Hälfte, Balkone, Loggien, Dachgärten und Terrassen in der Regel zu einem Viertel, höchstens zur Hälfte. Keller, Abstellräume außerhalb der Wohnung, Waschküchen, Dachböden, Heizungsräume und Garagen gehören nie dazu. Bei einer Dachgeschosswohnung mit 52 m² voller Höhe, 14 m² unter der Schräge, 4 m² unter einem Meter und 8 m² Balkon ergibt das ${nD(dg.flaeche)} m², nicht die ${naiv} m², die man beim Ausmessen der Grundfläche erhält. Im Berliner Mietspiegel macht das bei einem Altbau in mittlerer Lage einen Unterschied von ${eD(bNaiv.monat - bReal.monat)} Vergleichsmiete im Monat.`,
    faqs: [
      { q: 'Zählt die Fläche unter einer Dachschräge zur Wohnfläche?', a: `Teilweise. Wo die lichte Höhe mindestens zwei Meter beträgt, zählt die Fläche voll, zwischen einem und zwei Metern zur Hälfte, unter einem Meter gar nicht (§ 4 WoFlV). In unserem Beispiel werden aus 14 m² unter der Schräge ${nD(dg.halbAnteil)} m² Wohnfläche, und die 4 m² am Fuß der Schräge fallen ganz weg.` },
      { q: 'Wie viel von meinem Balkon gehört zur Wohnfläche?', a: `In der Regel ein Viertel, höchstens die Hälfte. Ein Balkon mit 8 m² zählt also meist mit ${nD(dg.balkonAnteil)} m², bei einem besonders hochwertigen Balkon oder einer großen Dachterrasse mit bis zu ${nD(8 * W.balkon_max)} m². Im Beispiel ergäbe die halbe Anrechnung ${nD(halbBalkon.flaeche)} m² statt ${nD(dg.flaeche)} m². Was im Vertrag steht, sollte deshalb begründet sein.` },
      { q: 'Gehört der Kellerraum zur Wohnfläche meiner Mietwohnung?', a: 'Nein. Kellerräume, Abstellräume und Kellerersatzräume außerhalb der Wohnung, Waschküchen, Dachböden, Trockenräume, Heizungsräume und Garagen sind Zubehörräume und zählen nach § 2 Abs. 3 WoFlV nicht zur Wohnfläche. Auch Räume, die den Anforderungen des Bauordnungsrechts nicht genügen, und Geschäftsräume bleiben außen vor.' },
      { q: 'Wie wird die Grundfläche eines Raums gemessen?', a: 'Nach den lichten Maßen zwischen den Bauteilen, gemessen ab der Vorderkante der Bekleidung, also etwa des Putzes (§ 3 WoFlV). Fußleisten, Einbaumöbel, fest eingebaute Öfen oder Badewannen werden mitgerechnet. Nicht mit gezählt werden Schornsteine und Pfeiler über 1,50 Meter Höhe mit mehr als 0,1 m² Grundfläche, Treppen mit mehr als drei Stufen und Türnischen.' },
      { q: 'Was hat die Wohnfläche mit den Betriebskosten zu tun?', a: 'Haben die Parteien nichts anderes vereinbart, werden Betriebskosten nach dem Anteil der Wohnfläche umgelegt (§ 556a Abs. 1 BGB), und ein Teil der Heizkosten wird ebenfalls nach Fläche verteilt. Eine zu groß angesetzte Fläche erhöht also nicht nur die Vergleichsmiete in Euro, sondern auch Ihren Anteil an den Nebenkosten.' },
    ],
    body: (h) => `
<h2>Die Regeln der Wohnflächenverordnung</h2>
<p>Die ${h.src('woflv', 'Wohnflächenverordnung')} legt in drei Schritten fest, was zur Wohnfläche gehört. Zuerst, welche Räume: alle Räume, die ausschließlich zur Wohnung gehören, dazu Wintergärten, Balkone, Loggien, Dachgärten und Terrassen, wenn sie ausschließlich der Wohnung zugeordnet sind; nicht dazu Zubehörräume wie Keller, Waschküche, Dachboden oder Garage. Dann, wie gemessen wird: nach den lichten Maßen zwischen den Bauteilen, ab der Vorderkante der Bekleidung. Zuletzt, wie stark jede Fläche zählt: voll, zur Hälfte, zu einem Viertel oder gar nicht.</p>
${h.table(['Fläche', 'Anrechnung'], [
  ['Räume mit mindestens 2 m lichter Höhe', 'voll'],
  ['Raumteile mit 1 m bis unter 2 m lichter Höhe', 'zur Hälfte'],
  ['Raumteile unter 1 m lichter Höhe', 'gar nicht'],
  ['unbeheizbare Wintergärten, Schwimmbäder, allseits geschlossene Räume', 'zur Hälfte'],
  ['Balkone, Loggien, Dachgärten, Terrassen', `in der Regel ${h.pct(W.balkon_regel, 0)}, höchstens ${h.pct(W.balkon_max, 0)}`],
  ['Keller, Waschküche, Dachboden, Heizungsraum, Garage', 'gar nicht'],
], '§§ 2 bis 4 Wohnflächenverordnung', ['l', 'l'])}
<h2>Rechenbeispiel Dachgeschoss</h2>
<p>Eine Altbauwohnung unter dem Dach misst am Boden 70 m², dazu kommt ein Balkon mit 8 m². Davon haben 52 m² mindestens zwei Meter lichte Höhe, 14 m² liegen unter der Schräge zwischen einem und zwei Metern, 4 m² unter einem Meter. Nach der Verordnung ergibt das 52 m² voll, ${h.num(dg.halbAnteil, 2)} m² aus der Schräge und ${h.num(dg.balkonAnteil, 2)} m² aus dem Balkon, zusammen ${h.num(dg.flaeche, 2)} m². Wer einfach die Bodenfläche mit dem Balkon addiert, kommt auf ${naiv} m², also ${h.num(naiv - dg.flaeche, 2)} m² zu viel.</p>
${h.table(['Rechnung', 'Fläche', 'Vergleichsmiete im Monat'], [
  ['nach Wohnflächenverordnung', `${h.num(dg.flaeche, 2)} m²`, h.eur(bReal.monat, 2)],
  ['Bodenfläche plus Balkon voll', `${naiv} m²`, h.eur(bNaiv.monat, 2)],
], 'Berliner Mietspiegel 2026, mittlere Lage, bezugsfertig bis 1918', ['l', 'r', 'r'])}
<p>${bReal.zeile?.zeile === bNaiv.zeile?.zeile ? 'Beide Flächen fallen in dasselbe Feld des Mietspiegels, in Euro entscheidet aber die Fläche.' : `Die beiden Flächen fallen sogar in verschiedene Größenklassen des Mietspiegels (Zeile ${bReal.zeile?.zeile} und ${bNaiv.zeile?.zeile}), und in Euro entscheidet ohnehin die Fläche.`} Bei einem neuen Vertrag über ${h.eur(720, 0)} läge die Grenze der Mietpreisbremse mit der richtigen Fläche bei ${h.eur(mpReal.zulaessig, 2)}. Der kleine Rechner oben ermittelt die Fläche für Ihre Werte.</p>
<h2>Wo die Wohnfläche überall zählt</h2>
<p><strong>Vergleichsmiete.</strong> Mietspiegel nennen Euro je Quadratmeter; die ${h.a('vergleichsmiete', 'Vergleichsmiete')} in Euro ist dieser Wert mal Fläche, und Mietspiegel ordnen Wohnungen zusätzlich nach Größenklassen ein (${h.src('bgb558', '§ 558 Abs. 2 BGB')} nennt die Größe als Merkmal). <strong>Mietpreisbremse und Mieterhöhung.</strong> Beide Grenzen werden aus dem Quadratmeterwert und der Fläche gerechnet. <strong>Modernisierung.</strong> Die Kappung von drei oder zwei Euro je Quadratmeter hängt an der Fläche. <strong>Betriebskosten.</strong> Ohne andere Vereinbarung wird nach Wohnfläche umgelegt (${h.src('bgb556a', '§ 556a Abs. 1 BGB')}), und auch bei den Heizkosten wird ein Teil nach Fläche verteilt; die Seite zu den ${h.a('nebenkosten', 'Nebenkosten')} erklärt die Umlage.</p>
<h2>Wenn die Fläche im Vertrag nicht stimmt</h2>
<p>Viele Mietverträge nennen eine Fläche, ohne zu sagen, wie sie ermittelt wurde. Prüfen Sie sie mit Maßband und Grundriss nach den Regeln oben. Liegt die tatsächliche Fläche deutlich darunter, betrifft das die Vergleichsmiete, die Mietpreisbremse, jede künftige Mieterhöhung und die Verteilung der Betriebskosten. Teilen Sie dem Vermieter Ihre Messung mit, am besten mit einer Skizze und den gemessenen Maßen, und lassen Sie sich die Berechnung der Vertragsfläche zeigen. Bei der nächsten Mieterhöhung oder Nebenkostenabrechnung sollte dann die richtige Fläche angesetzt werden. Ob und in welchem Umfang eine Abweichung darüber hinaus zu einer Minderung oder Rückforderung führt, entscheiden im Streit die Gerichte; der Mieterverein kann Sie dazu beraten.</p>
<h2>Was beim Nachmessen oft übersehen wird</h2>
<ul>
<li><strong>Mitgezählt</strong> werden nach § 3 WoFlV auch die Flächen unter Fußleisten, Tür- und Fensterumrahmungen, fest eingebauten Öfen, Heizgeräten, Herden, Bade- und Duschwannen, freiliegenden Leitungen und Einbaumöbeln. Wer nur die frei begehbare Fläche misst, misst zu wenig.</li>
<li><strong>Nicht mitgezählt</strong> werden Schornsteine, Vormauerungen und freistehende Pfeiler, wenn sie höher als 1,50 Meter sind und mehr als 0,1 m² Grundfläche haben, außerdem Treppen mit mehr als drei Steigungen samt Absätzen und Türnischen.</li>
<li><strong>Fensternischen</strong> zählen nur, wenn sie bis zum Fußboden reichen und tiefer als 0,13 Meter sind.</li>
<li><strong>Beheizte Wintergärten</strong> zählen wie normale Räume nach ihrer Höhe; nur unbeheizbare zur Hälfte.</li>
</ul>
<h2>Gemessen oder aus dem Bauplan</h2>
<p>Die Verordnung erlaubt beides: die Ausmessung der fertigen Wohnung oder die Ermittlung aus einer Bauzeichnung, die für ein Bauverfahren gefertigt wurde und die lichten Maße erkennen lässt. Wurde anders gebaut als gezeichnet, ist die Fläche nach dem tatsächlichen Bau zu ermitteln. Bei Altbauten mit vielen Umbauten ist das Nachmessen deshalb meist verlässlicher als jeder alte Plan. Messen Sie jeden Raum einzeln, notieren Sie Länge, Breite und die Höhen unter Schrägen, und rechnen Sie die Teilflächen getrennt: So lässt sich jede Zahl später nachprüfen, auch vom Vermieter.</p>
`,
  },
  en: {
    slug: 'floor-area',
    nav: 'Floor area',
    card: 'Sloped ceilings, balconies and cellars under the ordinance.',
    title: 'Floor Area Germany 2026: Sloped Ceilings, Balcony, Storage',
    description: 'Floor area in Germany 2026 under the Living Space Ordinance: full area from two metres high, half below, balconies usually a quarter, cellars never count.',
    h1: 'Calculating floor area: what counts and what does not',
    intro: 'Floor area enters almost every rent calculation: reference rent, rent brake, service charges and heating costs.',
    resume: `How large a rented flat is in Germany is, in common practice, decided by the Living Space Ordinance (Wohnflächenverordnung, WoFlV), which applies to subsidised housing and is also used for private leases unless something else was agreed. Under its Section 4, floor areas of rooms with a clear height of at least two metres count in full, areas between one and two metres high count half, and areas below one metre not at all. Unheated conservatories count half; balconies, loggias, roof gardens and terraces usually a quarter, at most half. Cellars, storage rooms outside the flat, laundry rooms, lofts, boiler rooms and garages never count. For an attic flat with 52 m² at full height, 14 m² under the slope, 4 m² below one metre and an 8 m² balcony, that gives ${nE(dg.flaeche)} m², not the ${naiv} m² you get by measuring the floor. In Berlin's rent index, for a pre-war flat in an average location, that makes a difference of ${eE(bNaiv.monat - bReal.monat)} of reference rent a month.`,
    faqs: [
      { q: 'Does the area under a sloped ceiling count as floor area?', a: `Partly. Where the clear height is at least two metres the area counts in full, between one and two metres half, below one metre not at all (Section 4 WoFlV). In our example, 14 m² under the slope become ${nE(dg.halbAnteil)} m² of floor area, and the 4 m² at the foot of the slope drop out entirely.` },
      { q: 'How much of my balcony counts as floor area?', a: `Usually a quarter, at most half. An 8 m² balcony therefore usually counts as ${nE(dg.balkonAnteil)} m², and an exceptionally good balcony or large roof terrace as up to ${nE(8 * W.balkon_max)} m². In the example, half would give ${nE(halbBalkon.flaeche)} m² instead of ${nE(dg.flaeche)} m². Whatever the lease says should therefore be justified.` },
      { q: 'Is my cellar room part of my flat’s floor area?', a: 'No. Cellars, storage rooms outside the flat, laundry rooms, lofts, drying rooms, boiler rooms and garages are ancillary rooms and do not count as floor area under Section 2(3) WoFlV. Rooms that do not meet building regulations and business premises are left out too.' },
      { q: 'How is a room’s floor area measured?', a: 'By the clear dimensions between the building elements, measured from the front edge of the finish, such as the plaster (Section 3 WoFlV). Skirting boards, built-in furniture, fixed stoves or bathtubs are included. Chimneys and pillars over 1.50 metres high with more than 0.1 m² of floor area, stairs with more than three steps and door recesses are not.' },
      { q: 'What does floor area have to do with service charges?', a: 'Unless agreed otherwise, service charges are split by share of floor area (Section 556a(1) of the Civil Code), and part of the heating costs is split by area too. An inflated area therefore raises not only the reference rent in euros but also your share of the service charges.' },
    ],
    body: (h) => `
<h2>The rules of the Living Space Ordinance</h2>
<p>The ${h.src('woflv', 'Living Space Ordinance')} decides in three steps what counts as floor area. First, which rooms: all rooms belonging exclusively to the flat, plus conservatories, balconies, loggias, roof gardens and terraces if they belong exclusively to it; not ancillary rooms such as the cellar, laundry room, loft or garage. Then, how to measure: by the clear dimensions between building elements, from the front edge of the finish. Finally, how much each area counts: in full, half, a quarter or not at all.</p>
${h.table(['Area', 'Counts as'], [
  ['rooms at least 2 m clear height', 'in full'],
  ['parts 1 m to under 2 m clear height', 'half'],
  ['parts under 1 m clear height', 'not at all'],
  ['unheated conservatories, pools, enclosed rooms', 'half'],
  ['balconies, loggias, roof gardens, terraces', `usually ${h.pct(W.balkon_regel, 0)}, at most ${h.pct(W.balkon_max, 0)}`],
  ['cellar, laundry room, loft, boiler room, garage', 'not at all'],
], 'Sections 2 to 4, Living Space Ordinance', ['l', 'l'])}
<h2>Worked example: an attic flat</h2>
<p>A pre-war attic flat measures 70 m² at floor level, plus an 8 m² balcony. Of this, 52 m² have at least two metres of clear height, 14 m² lie under the slope between one and two metres, and 4 m² below one metre. Under the ordinance that gives 52 m² in full, ${h.num(dg.halbAnteil, 2)} m² from the slope and ${h.num(dg.balkonAnteil, 2)} m² from the balcony, ${h.num(dg.flaeche, 2)} m² in all. Simply adding floor and balcony gives ${naiv} m², which is ${h.num(naiv - dg.flaeche, 2)} m² too much.</p>
${h.table(['Calculation', 'Area', 'Reference rent per month'], [
  ['under the Living Space Ordinance', `${h.num(dg.flaeche, 2)} m²`, h.eur(bReal.monat, 2)],
  ['floor plus full balcony', `${naiv} m²`, h.eur(bNaiv.monat, 2)],
], 'Berlin rent index 2026, average location, completed by 1918', ['l', 'r', 'r'])}
<p>${bReal.zeile?.zeile === bNaiv.zeile?.zeile ? 'Both areas fall into the same index field, but in euros the area decides.' : `The two areas even fall into different size bands of the index (lines ${bReal.zeile?.zeile} and ${bNaiv.zeile?.zeile}), and in euros the area decides anyway.`} For a new lease at ${h.eur(720, 0)}, the rent-brake ceiling with the correct area would be ${h.eur(mpReal.zulaessig, 2)}. The small calculator above works out the area for your figures.</p>
<h2>Where floor area matters</h2>
<p><strong>Reference rent.</strong> Rent indexes give euros per square metre; the ${h.a('vergleichsmiete', 'reference rent')} in euros is that value times the area, and indexes also sort flats into size bands (${h.src('bgb558', 'Section 558(2) BGB')} names size as a feature). <strong>Rent brake and rent increases.</strong> Both limits are calculated from the value per square metre and the area. <strong>Modernisation.</strong> The cap of three or two euros per square metre depends on the area. <strong>Service charges.</strong> Without another agreement they are split by floor area (${h.src('bgb556a', 'Section 556a(1) BGB')}), and part of the heating costs is split by area as well; the ${h.a('nebenkosten', 'service charges')} page explains the split.</p>
<h2>If the area in the lease is wrong</h2>
<p>Many leases state an area without saying how it was worked out. Check it with a tape measure and floor plan using the rules above. If the actual area is clearly smaller, that affects the reference rent, the rent brake, every future increase and the split of service charges. Tell the landlord your measurement, ideally with a sketch and the measured dimensions, and ask to see how the lease area was calculated. At the next rent increase or service-charge statement the correct area should then be used. Whether and how far a discrepancy leads beyond that to a reduction or a refund is for the courts to decide in a dispute; a tenants' association can advise you.</p>
<h2>What is often missed when measuring</h2>
<ul>
<li><strong>Included</strong> under Section 3 WoFlV are the areas under skirting boards, door and window frames, fixed stoves, heaters, cookers, bathtubs and shower trays, exposed pipes and built-in furniture. Measuring only the free floor gives too little.</li>
<li><strong>Excluded</strong> are chimneys, wall projections and free-standing pillars higher than 1.50 metres with more than 0.1 m² of floor area, stairs with more than three steps including landings, and door recesses.</li>
<li><strong>Window recesses</strong> only count if they reach the floor and are deeper than 0.13 metres.</li>
<li><strong>Heated conservatories</strong> count like normal rooms by their height; only unheated ones count half.</li>
</ul>
<h2>Measured or from the building plan</h2>
<p>The ordinance allows both: measuring the finished flat or taking the area from a building drawing prepared for a planning procedure that shows the clear dimensions. If the flat was built differently from the drawing, the area must follow what was actually built. For old buildings with many alterations, measuring is therefore usually more reliable than any old plan. Measure each room separately, note length, width and the heights under slopes, and calculate the parts one by one, so every figure can be checked later, by the landlord too.</p>
`,
  },
});
