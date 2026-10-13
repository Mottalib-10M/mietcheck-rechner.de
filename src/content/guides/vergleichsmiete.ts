import { defineGuide } from '../../lib/guide-types';
import { berlinOvm } from '../../lib/engine/berlin';
import { dortmundOvm } from '../../lib/engine/dortmund';
import { mietpreisbremse, mieterhoehung } from '../../lib/engine/miete';
import { formatMoney } from '../../lib/format';

const ok = <T extends { ok: boolean }>(x: T) => x as Extract<T, { ok: true }>;
// Même appartement (1975, 70 m², bon équipement moyen) dans trois systèmes.
const bE = berlinOvm({ lage: 'mittel', baujahr: 1975, flaeche: 70 });
const bG = berlinOvm({ lage: 'mittel', baujahr: 1975, flaeche: 70, gruppen: [1, 1, 0, 0, 0] });
const bS = berlinOvm({ lage: 'mittel', baujahr: 1975, flaeche: 70, gruppen: [-1, -1, -1, 0, 0] });
const dW = ok(dortmundOvm({ baujahr: 1975, flaeche: 70, gebiet: 3 }));
const dM = ok(dortmundOvm({ baujahr: 1975, flaeche: 70, gebiet: 1 }));
const mp = mietpreisbremse({ ovm: bE.ovm, flaeche: 70, miete: 600, gebiet: true });
const er = mieterhoehung({ miete: 480, flaeche: 70, ovm: bE.ovm, kappung: 0.15, verlangt: 560, zugang: '2026-10-14', letzteAenderung: '2024-01-01' });
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');

export default defineGuide({
  id: 'vergleichsmiete',
  group: 'erhoehung',
  order: 20,
  mini: 'vergleich',
  miniHref: 'mietspiegel-berlin',
  related: ['mietspiegel', 'mieterhoehung', 'mietpreisbremse', 'mietspiegel-berlin', 'mietspiegel-dortmund', 'wohnflaeche'],
  sources: ['bgb558', 'bgb558a', 'bgb558e', 'bgb558d', 'berlinMs', 'dortmundMs'],
  de: {
    slug: 'ortsuebliche-vergleichsmiete',
    nav: 'Ortsübliche Vergleichsmiete',
    card: 'Was die Vergleichsmiete ist und wie man sie begründet.',
    title: 'Ortsübliche Vergleichsmiete 2026: Ermittlung und Begründung',
    description: 'Ortsübliche Vergleichsmiete 2026: Mieten der letzten sechs Jahre nach § 558 BGB, begründet mit Mietspiegel, Datenbank, Gutachten oder drei Vergleichswohnungen.',
    h1: 'Ortsübliche Vergleichsmiete: die Zahl hinter jeder Mietgrenze',
    intro: 'Mieterhöhung, Mietpreisbremse und Sozialleistungen hängen an einer Zahl: der ortsüblichen Vergleichsmiete Ihrer Wohnung.',
    resume: `Die ortsübliche Vergleichsmiete wird nach § 558 Abs. 2 BGB aus den üblichen Entgelten gebildet, die in der Gemeinde für Wohnraum vergleichbarer Art, Größe, Ausstattung, Beschaffenheit und Lage, einschließlich der energetischen Ausstattung, in den letzten sechs Jahren vereinbart oder geändert wurden. Mieten, die durch Gesetz oder eine Förderzusage festgelegt sind, zählen nicht. Sie ist also kein Marktpreis für eine neue Wohnung, sondern ein Durchschnitt aus Neuverträgen und Bestandsmieten. Begründet wird sie mit einem Mietspiegel, einer Mietdatenbank, einem Gutachten oder drei Vergleichswohnungen (§ 558a BGB). Wie stark die Ausstattung zählt, zeigt der Berliner Mietspiegel 2026: Eine Wohnung von 1975 mit 70 m² in mittlerer Lage liegt beim Mittelwert von ${eD(bE.ovm)} je Quadratmeter, mit besserem Bad und besserer Küche bei ${eD(bG.ovm)}, mit drei schwächeren Merkmalgruppen bei ${eD(bS.ovm)}. In Dortmund macht allein das Gebiet einen Unterschied von ${eD(dM.ovm - dW.ovm)} je Quadratmeter zwischen Dortmund-West und Innenstadt-Mitte.`,
    faqs: [
      { q: 'Ist die ortsübliche Vergleichsmiete dasselbe wie die Marktmiete?', a: 'Nein. Die Marktmiete ist das, was ein Vermieter heute bei einer Neuvermietung verlangen könnte. Die Vergleichsmiete ist ein Durchschnitt aus Mieten, die in den letzten sechs Jahren neu vereinbart oder geändert wurden, also auch aus Bestandsmieten. Sie liegt deshalb in angespannten Märkten meist deutlich unter den Angebotspreisen in Inseraten.' },
      { q: 'Warum zählen nur die Mieten der letzten sechs Jahre?', a: 'Weil der Gesetzgeber den Betrachtungszeitraum 2020 von vier auf sechs Jahre verlängert hat, um starke Sprünge der Vergleichsmiete zu dämpfen. Je länger der Zeitraum, desto mehr ältere und niedrigere Mieten fließen ein. Mieten, die sich in diesen sechs Jahren gar nicht geändert haben, zählen nicht mit.' },
      { q: 'Reichen drei Vergleichswohnungen für eine Mieterhöhung?', a: 'Formal ja: § 558a Abs. 2 Nr. 4 BGB lässt die Benennung von drei Wohnungen mit ihren Mieten genügen. Sie müssen aber tatsächlich vergleichbar sein und so genau bezeichnet werden, dass Sie sie finden können. Gibt es einen qualifizierten Mietspiegel, muss der Vermieter dessen Werte zusätzlich nennen, und im Streit hat der Mietspiegel das größere Gewicht.' },
      { q: 'Wie beeinflusst die Wohnfläche die Vergleichsmiete?', a: 'Doppelt. Kleinere Wohnungen haben im Mietspiegel meist einen höheren Wert je Quadratmeter, und die Vergleichsmiete in Euro ergibt sich aus Wert mal Fläche. Maßgeblich ist die tatsächliche Wohnfläche, berechnet nach der Wohnflächenverordnung, nicht eine abweichende Angabe im Vertrag. Ein zu großer Flächenansatz treibt die Vergleichsmiete in Euro nach oben.' },
      { q: 'Wer muss die Vergleichsmiete beweisen?', a: 'Bei einer Mieterhöhung der Vermieter: Er verlangt die Zustimmung und muss im Streit zeigen, dass die neue Miete die Vergleichsmiete nicht übersteigt. Ein qualifizierter Mietspiegel hilft ihm dabei durch die gesetzliche Vermutung. Bei der Mietpreisbremse muss der Mieter zunächst rügen; der Vermieter muss dann Auskunft über die Tatsachen geben, die für die Miethöhe maßgeblich sind.' },
    ],
    body: (h) => `
<h2>Die fünf Merkmale des Gesetzes</h2>
<p>${h.src('bgb558', '§ 558 Abs. 2 BGB')} nennt fünf Merkmale, nach denen Wohnungen vergleichbar sein müssen. <strong>Art</strong> meint die Bauweise: Mehrfamilienhaus, Einfamilienhaus, Altbau oder Neubau. <strong>Größe</strong> ist die Wohnfläche. <strong>Ausstattung</strong> umfasst alles, was der Vermieter zur Verfügung stellt: Heizung, Bad, Küche, Bodenbeläge, Balkon. <strong>Beschaffenheit</strong> meint Baualter, Zustand und Zuschnitt der Wohnung, ausdrücklich einschließlich der energetischen Ausstattung und Beschaffenheit. <strong>Lage</strong> ist das Wohnumfeld: Verkehr, Lärm, Grün, Infrastruktur. Mietspiegel übersetzen diese Merkmale in Tabellenfelder, Zuschläge oder Punkte.</p>
<h2>Ein Beispiel, zwei Systeme</h2>
${h.table(['Wohnung 1975, 70 m²', 'Vergleichsmiete je m²', 'im Monat'], [
  ['Berlin, mittlere Lage, Mittelwert', h.eur(bE.ovm, 2), h.eur(bE.monat, 2)],
  ['Berlin, mittlere Lage, Bad und Küche besser', h.eur(bG.ovm, 2), h.eur(bG.monat, 2)],
  ['Berlin, mittlere Lage, drei Gruppen schlechter', h.eur(bS.ovm, 2), h.eur(bS.monat, 2)],
  ['Dortmund, Gebiet Dortmund-West, ohne Zuschläge', h.eur(dW.ovm, 2), h.eur(dW.monat, 2)],
  ['Dortmund, Innenstadt-Mitte, ohne weitere Zuschläge', h.eur(dM.ovm, 2), h.eur(dM.monat, 2)],
], 'Berliner Mietspiegel 2026 und Mietspiegel Dortmund 2025/2026, Nettokaltmiete', ['l', 'r', 'r'])}
<p>Die Berliner Werte zeigen, wie viel die Einordnung in die Spanne ausmacht: Zwischen schwacher und guter Ausstattung liegen bei derselben Wohnung ${h.eur(bG.monat - bS.monat, 2)} im Monat. In Dortmund verschiebt die Lage den Wert, weil der Mietspiegel einen festen Zuschlag je Gebiet vorsieht. Wer die Vergleichsmiete ohne Rechner bestimmt, unterschätzt meist diese Spielräume.</p>
<h2>Die vier Begründungsmittel</h2>
<p>Für eine Mieterhöhung muss der Vermieter die Vergleichsmiete in seinem Schreiben begründen. ${h.src('bgb558a', '§ 558a Abs. 2 BGB')} nennt vier Wege, ohne die Liste abschließend zu machen:</p>
<ol>
<li><strong>Mietspiegel.</strong> Der übliche Weg; liegt die verlangte Miete innerhalb der Spanne, reicht die Bezugnahme. Mehr dazu auf der Seite ${h.a('mietspiegel', 'Mietspiegel erklärt')}.</li>
<li><strong>Mietdatenbank.</strong> Eine fortlaufend geführte Sammlung von Mieten, die von der Gemeinde oder beiden Interessenseiten gemeinsam geführt oder anerkannt wird (${h.src('bgb558e', '§ 558e BGB')}). In der Praxis selten.</li>
<li><strong>Gutachten.</strong> Ein mit Gründen versehenes Gutachten eines öffentlich bestellten und vereidigten Sachverständigen. Teuer, aber für Wohnungen außerhalb eines Mietspiegels oft der einzige Weg.</li>
<li><strong>Drei Vergleichswohnungen.</strong> Mit Adresse, Lage im Haus, Größe und Miete, so dass der Mieter sie überprüfen kann.</li>
</ol>
<p>Enthält ein ${h.a('qualifizierter-mietspiegel', 'qualifizierter Mietspiegel')} Angaben für die Wohnung, muss der Vermieter sie auch dann mitteilen, wenn er sich auf ein anderes Begründungsmittel stützt (§ 558a Abs. 3). So sieht der Mieter, ob ein Gutachten weit über dem amtlichen Wert liegt.</p>
<h2>Was die Vergleichsmiete für Sie entscheidet</h2>
<p>Bei einem neuen Vertrag in einem Gebiet mit Mietpreisbremse ist sie die Basis der Höchstmiete: Für die Berliner Wohnung von 1975 sind höchstens ${h.eur(mp.zulaessig, 2)} zulässig; wer ${h.eur(600, 0)} zahlt, zahlt ${h.eur(mp.ueberMonat, 2)} zu viel. Bei einer Mieterhöhung ist sie die Obergrenze: Von ${h.eur(480, 0)} darf die Miete hier höchstens auf ${h.eur(er.zulaessig, 2)} steigen, weil die Kappungsgrenze von 15 Prozent früher greift als die Vergleichsmiete. Den Unterschied zwischen den beiden Grenzen erklärt die Seite zur ${h.a('mieterhoehung', 'Mieterhöhung')}. Weil die Fläche in jede Rechnung eingeht, lohnt sich auch ein Blick auf die ${h.a('wohnflaeche', 'Berechnung der Wohnfläche')}.</p>
<h2>Fünf Fehler, die die Vergleichsmiete verfälschen</h2>
<ul>
<li><strong>Falsches Baujahr.</strong> Mietspiegel fragen nach der Bezugsfertigkeit des Gebäudes oder der Wohnung, nicht nach dem Jahr einer Sanierung. Eine 1910 gebaute und 2015 modernisierte Wohnung bleibt ein Altbau; die Modernisierung zählt als Ausstattungsmerkmal.</li>
<li><strong>Eigene Einbauten mitgezählt.</strong> Was Sie selbst eingebaut und bezahlt haben, etwa eine Küche oder einen neuen Bodenbelag, darf die Vergleichsmiete nicht erhöhen. Es zählt nur die Ausstattung, die der Vermieter stellt.</li>
<li><strong>Inklusivmiete nicht umgerechnet.</strong> Mietspiegel nennen Nettokaltmieten. Steckt in Ihrer Miete ein Anteil für Betriebskosten, muss er vor dem Vergleich herausgerechnet werden, sonst wirkt die Miete zu hoch.</li>
<li><strong>Lage nach Gefühl.</strong> Die Wohnlage ergibt sich aus dem Verzeichnis der Stadt für Ihre Adresse. Eine ruhige Seitenstraße kann einfach eingestuft sein, eine laute Hauptstraße in einem begehrten Viertel gut.</li>
<li><strong>Veralteter Mietspiegel.</strong> Ein Erhöhungsschreiben mit Werten einer abgelösten Ausgabe ist angreifbar, wenn ein aktueller Mietspiegel vorliegt. Prüfen Sie das Datum der Ausgabe, auf die sich der Vermieter beruft.</li>
</ul>
<h2>Wenn kein Mietspiegel passt</h2>
<p>Viele Mietspiegel schließen bestimmte Wohnungen aus: Einfamilienhäuser, sehr neue Gebäude, besonders große oder kleine Wohnungen, Wohnungen ohne Bad. Dann lässt sich die Vergleichsmiete nur mit einem Gutachten oder Vergleichswohnungen begründen. Nach § 558a Abs. 4 BGB darf auch ein veralteter Mietspiegel oder der einer vergleichbaren Gemeinde herangezogen werden, wenn kein aktueller vorhanden ist. Im Mietcheck tragen Sie für solche Fälle den Wert ein, der Ihnen begründet wurde. Fehlt jede Begründung, ist ein Erhöhungsschreiben formal unwirksam: Der Vermieter muss es dann neu und vollständig begründet stellen, und erst mit dem neuen Zugang beginnen die Fristen wieder zu laufen.</p>
`,
  },
  en: {
    slug: 'local-reference-rent',
    nav: 'Local reference rent',
    card: 'What the reference rent is and how it is justified.',
    title: 'Local Reference Rent Germany 2026: How It Is Determined',
    description: 'Local reference rent Germany 2026: rents of the last six years under Section 558 BGB, justified by rent index, database, expert opinion or three similar flats.',
    h1: 'The local reference rent: the figure behind every rent limit',
    intro: 'Rent increases, the rent brake and housing benefits all depend on one figure: your flat’s local reference rent.',
    resume: `Under Section 558(2) of the German Civil Code, the local reference rent (ortsübliche Vergleichsmiete) is formed from the usual rents agreed or changed in the municipality over the last six years for housing of comparable type, size, fittings, condition and location, including energy features. Rents set by law or under a subsidy commitment are left out. So it is not the market price of a new flat but an average of new leases and existing rents. It is justified with a rent index (Mietspiegel), a rent database, an expert opinion or three comparable flats (Section 558a). Berlin's 2026 index shows how much fittings matter: a 1975 flat of 70 m² in an average location sits at the mean of ${eE(bE.ovm)} per square metre, at ${eE(bG.ovm)} with a better bathroom and kitchen, and at ${eE(bS.ovm)} with three weaker groups of features. In Dortmund the area alone makes a difference of ${eE(dM.ovm - dW.ovm)} per square metre between Dortmund-West and Innenstadt-Mitte.`,
    faqs: [
      { q: 'Is the local reference rent the same as the market rent?', a: 'No. The market rent is what a landlord could ask today on a new letting. The reference rent is an average of rents newly agreed or changed in the last six years, including existing tenancies. In tight markets it is therefore usually well below the asking rents in advertisements.' },
      { q: 'Why do only the last six years of rents count?', a: 'Because the legislator extended the period from four to six years in 2020 to dampen sharp jumps in the reference rent. The longer the period, the more older and lower rents are included. Rents that did not change at all in those six years are not counted.' },
      { q: 'Are three comparable flats enough for a rent increase?', a: 'Formally yes: Section 558a(2) no. 4 of the Civil Code accepts naming three flats with their rents. They must really be comparable and be described precisely enough for you to find them. If a qualified rent index exists, the landlord must quote it as well, and in a dispute the index carries more weight.' },
      { q: 'How does floor area affect the reference rent?', a: 'Twice. Smaller flats usually have a higher value per square metre in the index, and the reference rent in euros is the value times the area. What counts is the actual floor area under the Living Space Ordinance, not a different figure in the lease. An inflated area pushes the reference rent in euros up.' },
      { q: 'Who has to prove the reference rent?', a: 'For a rent increase, the landlord: he asks for consent and in a dispute must show the new rent does not exceed the reference rent. A qualified index helps him through the legal presumption. For the rent brake, the tenant first has to complain; the landlord must then disclose the facts that determine the rent.' },
    ],
    body: (h) => `
<h2>The five features in the law</h2>
<p>${h.src('bgb558', 'Section 558(2) BGB')} names five features by which flats must be comparable. <strong>Type</strong> means the kind of building: apartment block, house, pre-war or post-war. <strong>Size</strong> is the floor area. <strong>Fittings</strong> cover everything the landlord provides: heating, bathroom, kitchen, flooring, balcony. <strong>Condition</strong> means age, state and layout of the flat, expressly including energy features. <strong>Location</strong> is the surroundings: traffic, noise, green space, infrastructure. Rent indexes translate these features into table fields, premiums or points.</p>
<h2>One example, two systems</h2>
${h.table(['Flat built 1975, 70 m²', 'Reference rent per m²', 'per month'], [
  ['Berlin, average location, mean', h.eur(bE.ovm, 2), h.eur(bE.monat, 2)],
  ['Berlin, average location, better bathroom and kitchen', h.eur(bG.ovm, 2), h.eur(bG.monat, 2)],
  ['Berlin, average location, three groups worse', h.eur(bS.ovm, 2), h.eur(bS.monat, 2)],
  ['Dortmund, Dortmund-West area, no premiums', h.eur(dW.ovm, 2), h.eur(dW.monat, 2)],
  ['Dortmund, Innenstadt-Mitte, no other premiums', h.eur(dM.ovm, 2), h.eur(dM.monat, 2)],
], 'Berlin rent index 2026 and Dortmund rent index 2025/2026, net cold rent', ['l', 'r', 'r'])}
<p>The Berlin figures show how much placement within the range matters: between weak and good fittings, the same flat differs by ${h.eur(bG.monat - bS.monat, 2)} a month. In Dortmund the location shifts the value because the index sets a fixed premium per area. Anyone working out the reference rent without a calculator usually underestimates these margins.</p>
<h2>The four ways to justify it</h2>
<p>For a rent increase, the landlord must justify the reference rent in his letter. ${h.src('bgb558a', 'Section 558a(2) BGB')} names four ways, without making the list exhaustive:</p>
<ol>
<li><strong>Rent index.</strong> The usual route; if the rent demanded lies within the range, a reference to it is enough. More on the ${h.a('mietspiegel', 'rent index explained')} page.</li>
<li><strong>Rent database.</strong> A continuously kept collection of rents run or recognised by the municipality or jointly by both sides (${h.src('bgb558e', 'Section 558e BGB')}). Rare in practice.</li>
<li><strong>Expert opinion.</strong> A reasoned opinion by a publicly appointed and sworn expert. Expensive, but often the only route for flats outside an index.</li>
<li><strong>Three comparable flats.</strong> With address, position in the building, size and rent, so the tenant can check them.</li>
</ol>
<p>If a ${h.a('qualifizierter-mietspiegel', 'qualified rent index')} contains figures for the flat, the landlord must state them even when relying on another method (Section 558a(3)). That way the tenant sees whether an expert opinion lies far above the official value.</p>
<h2>What the reference rent decides for you</h2>
<p>On a new lease in a rent-brake area it is the basis of the ceiling: for the 1975 Berlin flat, at most ${h.eur(mp.zulaessig, 2)} is lawful; anyone paying ${h.eur(600, 0)} pays ${h.eur(mp.ueberMonat, 2)} too much. On a rent increase it is the upper limit: from ${h.eur(480, 0)} the rent may rise to at most ${h.eur(er.zulaessig, 2)} here, because the 15 per cent cap bites before the reference rent. The ${h.a('mieterhoehung', 'rent increase')} page explains the difference between the two limits. Since the area goes into every calculation, the ${h.a('wohnflaeche', 'floor area')} page is worth a look too.</p>
<h2>Five mistakes that distort the reference rent</h2>
<ul>
<li><strong>Wrong year built.</strong> Rent indexes ask when the building or flat was completed, not when it was refurbished. A flat built in 1910 and modernised in 2015 remains a pre-war flat; the modernisation counts as a feature.</li>
<li><strong>Your own installations counted.</strong> What you installed and paid for yourself, such as a kitchen or new flooring, may not raise the reference rent. Only the fittings the landlord provides count.</li>
<li><strong>All-inclusive rent not converted.</strong> Rent indexes give net cold rents. If your rent includes a share for service charges, take it out before comparing, otherwise the rent looks too high.</li>
<li><strong>Location by gut feeling.</strong> The residential location follows from the city's directory for your address. A quiet side street can be rated basic, a noisy main road in a sought-after district good.</li>
<li><strong>Outdated index.</strong> An increase letter quoting a superseded edition is open to challenge if a current index exists. Check the date of the edition the landlord relies on.</li>
</ul>
<h2>When no rent index fits</h2>
<p>Many indexes exclude certain homes: houses, very new buildings, very large or small flats, flats without a bathroom. Then the reference rent can only be justified with an expert opinion or comparable flats. Under Section 558a(4) an outdated index or that of a comparable municipality may also be used if no current one exists. In the rent check, enter the value you were given for such cases. If an increase letter gives no justification at all, it is formally invalid: the landlord must send a new, fully justified letter, and the deadlines only start again when it arrives.</p>
`,
  },
});
