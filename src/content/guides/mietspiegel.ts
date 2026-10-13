import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { STAEDTE } from '../../lib/engine/staedte';
import { berlinOvm } from '../../lib/engine/berlin';
import { hamburgOvm } from '../../lib/engine/hamburg';
import { formatMoney } from '../../lib/format';

const qual = STAEDTE.filter((s) => s.qualifiziert).length;
const einfach = STAEDTE.filter((s) => !s.qualifiziert).map((s) => s.name);
const frei = STAEDTE.filter((s) => s.schema !== 'eingabe').map((s) => s.name);
const gesperrt = STAEDTE.filter((s) => s.schema === 'eingabe');
const b = berlinOvm({ lage: 'mittel', baujahr: 1965, flaeche: 62 });
const hh = hamburgOvm({ lage: 'normal', baujahr: 1965, flaeche: 62 });
const hhOvm = hh.ok ? hh.ovm : 0;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const seite = (id: string) => `mietspiegel-${id}`;

export default defineGuide({
  id: 'mietspiegel',
  group: 'erhoehung',
  order: 10,
  mini: 'berlinfeld',
  miniHref: 'mietspiegel-berlin',
  related: ['vergleichsmiete', 'qualifizierter-mietspiegel', 'mietspiegel-berlin', 'mietspiegel-hamburg', 'mieterhoehung', 'mietpreisbremse'],
  sources: ['bgb558c', 'bgb558d', 'bgb558a', 'berlinMs', 'hamburgMs'],
  de: {
    slug: 'mietspiegel-erklaert',
    nav: 'Mietspiegel erklärt',
    card: 'Was ein Mietspiegel ist, wie man ihn liest und wofür er zählt.',
    title: 'Mietspiegel 2026 erklärt: lesen, anwenden, richtig einordnen',
    description: 'Mietspiegel 2026 erklärt: Tabellen- und Regressionsmietspiegel, einfach oder qualifiziert, Wohnlage, Spanne und wie er Mietpreisbremse und Erhöhung bestimmt.',
    h1: 'Der Mietspiegel: wie er entsteht und wie Sie ihn lesen',
    intro: 'Ein Mietspiegel ist die amtliche Antwort auf die Frage, was eine Wohnung in Ihrer Gemeinde üblicherweise kostet.',
    resume: `Ein Mietspiegel ist nach § 558c BGB eine Übersicht über die ortsübliche Vergleichsmiete, die von der zuständigen Behörde oder von Interessenvertretern der Mieter und Vermieter gemeinsam erstellt oder anerkannt wurde. Gemeinden mit mehr als 50.000 Einwohnern müssen einen Mietspiegel erstellen und veröffentlichen. Er zeigt, welche Nettokaltmiete für Wohnungen vergleichbarer Art, Größe, Ausstattung, Beschaffenheit und Lage in den letzten sechs Jahren vereinbart oder geändert wurde. Es gibt zwei Bauarten: Tabellenmietspiegel wie in Berlin und Hamburg ordnen jede Wohnung einem Feld zu, Regressionsmietspiegel wie in München oder Frankfurt rechnen mit einer Basismiete und Zu- und Abschlägen. Ein qualifizierter Mietspiegel ist wissenschaftlich erstellt und anerkannt; für ihn wird vermutet, dass er die Vergleichsmiete richtig wiedergibt. Für eine Wohnung von 1965 mit 62 m² nennt der Berliner Mietspiegel 2026 in mittlerer Lage ${eD(b.ovm)} je Quadratmeter, der Hamburger Mietenspiegel 2025 in normaler Lage ${eD(hhOvm)}.`,
    faqs: [
      { q: 'Muss jede Stadt einen Mietspiegel haben?', a: 'Jede Gemeinde mit mehr als 50.000 Einwohnern muss seit der Reform des Mietspiegelrechts einen Mietspiegel erstellen und veröffentlichen (§ 558c Abs. 4 BGB). Kleinere Gemeinden sollen einen erstellen, wenn ein Bedürfnis besteht. Mehrere Gemeinden dürfen einen gemeinsamen Mietspiegel aufstellen, und ein Mietspiegel kann auch nur für Teile einer Gemeinde gelten.' },
      { q: 'Woher weiß ich, in welcher Wohnlage meine Wohnung liegt?', a: 'Aus dem Wohnlagenverzeichnis oder der Wohnlagenkarte, die zum Mietspiegel gehört. Berlin veröffentlicht ein Straßenverzeichnis mit Hausnummern, Hamburg ein Wohnlagenverzeichnis nach Straßenabschnitten, Dortmund eine Karte mit sieben Gebieten. Die Lage hängt an der Adresse, nicht an Ihrem Eindruck; in einem guten Viertel kann ein einzelnes Haus einfach eingestuft sein.' },
      { q: 'Warum zeigt diese Website nicht für jede Stadt Mietspiegelwerte an?', a: `Weil viele Städte sich die Rechte an ihren Tabellen vorbehalten. ${gesperrt.map((s) => s.name).slice(0, 6).join(', ')} und andere untersagen die Wiedergabe im Internet oder die elektronische Speicherung. Wir verlinken dort das offizielle Angebot und rechnen mit dem Wert weiter, den Sie eintragen. ${frei.join(', ')} veröffentlichen ihre Werte frei oder als offene Daten.` },
      { q: 'Was ist der Unterschied zwischen Mittelwert und Spanne im Mietspiegel?', a: 'Der Mittelwert zeigt, was eine durchschnittlich ausgestattete Wohnung des Feldes kostet. Die Spanne umfasst die mittleren Mieten, in Berlin drei Viertel, in Hamburg zwei Drittel der erhobenen Werte. Wo Ihre Wohnung in der Spanne liegt, hängt von Ausstattung und Zustand ab; manche Städte geben dafür Punkte oder Prozentsätze vor, andere nur Beispiele.' },
      { q: 'Gilt ein Mietspiegel auch für Einfamilienhäuser und möblierte Wohnungen?', a: 'Meist nicht. Die meisten Mietspiegel erfassen nur Wohnungen in Mehrfamilienhäusern, Berlin etwa ab drei Wohnungen im Gebäude, und schließen Ein- und Zweifamilienhäuser, Reihenhäuser, möblierte Wohnungen und geförderten Wohnraum aus. Für solche Wohnungen muss die Vergleichsmiete anders begründet werden, zum Beispiel mit einem Gutachten oder Vergleichswohnungen.' },
    ],
    body: (h) => `
<h2>Wozu ein Mietspiegel dient</h2>
<p>Der Mietspiegel ist das wichtigste Werkzeug, um die ${h.a('vergleichsmiete', 'ortsübliche Vergleichsmiete')} einer Wohnung zu bestimmen. Diese Zahl entscheidet über drei Dinge. Erstens über die Mieterhöhung: Nach § 558 BGB darf ein Vermieter die Zustimmung zu einer Erhöhung nur bis zur Vergleichsmiete verlangen, und er darf seine Forderung mit dem Mietspiegel begründen (${h.src('bgb558a', '§ 558a BGB')}). Zweitens über die Neuvermietung: In Gebieten mit ${h.a('mietpreisbremse', 'Mietpreisbremse')} darf die Anfangsmiete höchstens zehn Prozent darüber liegen. Drittens über die Sozialleistungen: Jobcenter und Sozialämter ziehen ihn heran, um angemessene Unterkunftskosten festzulegen.</p>
<h2>Tabellenmietspiegel und Regressionsmietspiegel</h2>
<p>Beim Tabellenmietspiegel bilden einige wenige Merkmale die Achsen einer Tabelle, typischerweise Baujahr, Wohnfläche und Wohnlage. Jede Wohnung fällt in genau ein Feld, und dieses Feld nennt einen Mittelwert und eine Spanne. Berlin hat 189 solcher Zeilen, verteilt auf drei Tabellen für einfache, mittlere und gute Lage; Hamburg hat eine Tabelle mit 90 Feldern für normale und gute Lage. Weitere Merkmale wie ein Balkon, eine Einbauküche oder ein modernisiertes Bad entscheiden über die Position innerhalb der Spanne.</p>
<p>Beim Regressionsmietspiegel hat ein statistisches Modell aus den erhobenen Mieten geschätzt, wie viel jedes Merkmal zur Miete beiträgt. Daraus entsteht eine Basismiete, meist nach Wohnfläche, und eine Liste von Zu- und Abschlägen in Euro oder Prozent. München, Frankfurt, Stuttgart, Leipzig, Nürnberg und Essen arbeiten so; Dortmund verbindet eine Basistabelle nach Baujahr mit Zuschlägen in Euro. Regressionsmietspiegel sind genauer, aber ohne Rechner mühsam: Man muss alle Merkmale kennen und korrekt addieren oder multiplizieren.</p>
${h.table(['Stadt', 'Ausgabe', 'Art', 'Werte hier'], STAEDTE.map((s) => [h.a(seite(s.id), s.name), s.ausgabe.split(' (')[0], s.qualifiziert ? 'qualifiziert' : 'einfach', s.schema === 'eingabe' ? 'Eingabe, Rechte vorbehalten' : 'berechnet']), `Mietspiegel der großen Städte, Stand ${h.date(P.retrieved_at)}`, ['l', 'l', 'l', 'l'])}
<h2>Einfach oder qualifiziert</h2>
<p>Von den ${STAEDTE.length} Städten in unserer Übersicht haben ${qual} einen qualifizierten Mietspiegel. ${einfach.join(' und ')} haben einfache Mietspiegel, die von Verbänden aufgestellt werden. Der Unterschied ist rechtlich erheblich: Ein qualifizierter Mietspiegel ist nach anerkannten wissenschaftlichen Grundsätzen erstellt und von der Gemeinde oder beiden Interessenseiten anerkannt (${h.src('bgb558d', '§ 558d BGB')}). Für ihn gilt die Vermutung, dass seine Werte die Vergleichsmiete wiedergeben, wenn er rechtzeitig angepasst wurde. Wer etwas anderes behauptet, muss es beweisen. Außerdem muss ein Vermieter die Werte eines qualifizierten Mietspiegels in seinem Erhöhungsschreiben auch dann nennen, wenn er die Erhöhung anders begründet. Mehr dazu auf der Seite ${h.a('qualifizierter-mietspiegel', 'qualifizierter Mietspiegel')}.</p>
<h2>So lesen Sie Ihren Mietspiegel</h2>
<ol>
<li><strong>Geltungsbereich prüfen.</strong> Gilt der Mietspiegel für Ihre Wohnung? Ausgeschlossen sind meist Ein- und Zweifamilienhäuser, geförderte Wohnungen, möblierte Wohnungen und sehr neue Gebäude. Der Berliner Mietspiegel 2026 erfasst zum Beispiel Wohnungen, die bis Ende 2024 bezugsfertig wurden.</li>
<li><strong>Wohnlage nachschlagen.</strong> Im Straßenverzeichnis, in der Wohnlagenkarte oder in der Online-Abfrage der Stadt.</li>
<li><strong>Baujahr und Fläche zuordnen.</strong> Maßgeblich ist das Jahr der Bezugsfertigkeit, nicht das Jahr einer späteren Sanierung, und die Wohnfläche nach der ${h.a('wohnflaeche', 'Wohnflächenverordnung')}.</li>
<li><strong>Ausstattung bewerten.</strong> Nach den Merkmalen, die der Mietspiegel aufzählt; nur was der Vermieter gestellt hat, zählt.</li>
<li><strong>Nettokaltmiete vergleichen.</strong> Der Mietspiegel nennt Nettokaltmieten. Zahlen Sie eine Inklusivmiete, rechnen Sie die Betriebskosten heraus.</li>
</ol>
<p>Für Berlin, Hamburg und Dortmund nimmt Ihnen der Mietcheck diese Schritte ab, für die übrigen Städte führt er Sie zum offiziellen Rechner und verbindet dessen Ergebnis mit den Regeln Ihrer Gemeinde. Das kleine Werkzeug oben zeigt, wie der Berliner Mietspiegel ein Feld auswählt: Die Wohnung von 1965 mit 62 m² in mittlerer Lage liegt in Zeile ${b.zeile?.zeile}.</p>
<h2>Wie alt darf ein Mietspiegel sein?</h2>
<p>Ein Mietspiegel soll alle zwei Jahre an die Marktentwicklung angepasst werden (${h.src('bgb558c', '§ 558c Abs. 3 BGB')}). Für einen qualifizierten Mietspiegel ist das Pflicht, und nach vier Jahren muss er neu erstellt werden; maßgeblich ist der Stichtag der Daten. Gibt es keinen aktuellen Mietspiegel, darf sich ein Vermieter nach § 558a Abs. 4 BGB auch auf einen veralteten oder den einer vergleichbaren Gemeinde stützen. Die Vermutungswirkung hat dann aber nur ein rechtzeitig angepasster qualifizierter Mietspiegel.</p>
`,
  },
  en: {
    slug: 'what-is-a-rent-index',
    nav: 'Rent index explained',
    card: 'What a rent index is, how to read it and what it decides.',
    title: 'Rent Index Germany 2026 Explained: How to Read a Mietspiegel',
    description: 'German rent index explained for 2026: table or regression index, simple or qualified, location and range, and how it decides the rent brake and rent increases.',
    h1: 'The German rent index: how it is made and how to read it',
    intro: 'A rent index (Mietspiegel) is the official answer to what a flat usually costs in your municipality.',
    resume: `Under Section 558c of the German Civil Code, a rent index (Mietspiegel) is an overview of the local reference rent (ortsübliche Vergleichsmiete), drawn up or recognised by the competent authority or jointly by tenant and landlord representatives. Municipalities with more than 50,000 inhabitants must produce and publish one. It shows which net cold rent was agreed or changed in the last six years for flats of comparable type, size, fittings, condition and location. There are two designs: table indexes, as in Berlin and Hamburg, place every flat in one field; regression indexes, as in Munich or Frankfurt, calculate with a base rent plus premiums and deductions. A qualified index (qualifizierter Mietspiegel) is drawn up scientifically and formally recognised, and the law presumes it reflects the reference rent correctly. For a 1965 flat of 62 m², Berlin's 2026 index gives ${eE(b.ovm)} per square metre in an average location, and Hamburg's 2025 index ${eE(hhOvm)} in a normal location.`,
    faqs: [
      { q: 'Must every German city have a rent index?', a: 'Every municipality with more than 50,000 inhabitants must produce and publish a rent index since the reform of rent index law (Section 558c(4) of the Civil Code). Smaller ones should produce one if there is a need. Several municipalities may share an index, and an index can also cover just part of a municipality.' },
      { q: 'How do I know which residential location my flat is in?', a: 'From the location directory or map that comes with the rent index. Berlin publishes a street directory by house number, Hamburg a location directory by street section, Dortmund a map of seven areas. The location depends on the address, not on your impression; a single building in a good neighbourhood can be rated basic.' },
      { q: 'Why does this site not show rent index figures for every city?', a: `Because many cities reserve the rights to their tables. ${gesperrt.map((s) => s.name).slice(0, 6).join(', ')} and others forbid online reproduction or electronic storage. There we link the official service and continue with the value you enter. ${frei.join(', ')} publish their figures freely or as open data.` },
      { q: 'What is the difference between the mean and the range in a rent index?', a: 'The mean shows what an averagely equipped flat in the field costs. The range covers the middle rents, three quarters of surveyed values in Berlin and two thirds in Hamburg. Where your flat sits in the range depends on fittings and condition; some cities set points or percentages for this, others only give examples.' },
      { q: 'Does a rent index cover houses and furnished flats?', a: 'Usually not. Most indexes cover only flats in apartment buildings, in Berlin from three flats per building, and exclude detached and semi-detached houses, terraced houses, furnished flats and subsidised housing. For such homes the reference rent must be justified another way, for example by an expert opinion or comparable flats.' },
    ],
    body: (h) => `
<h2>What a rent index is for</h2>
<p>The rent index is the main tool for working out a flat's ${h.a('vergleichsmiete', 'local reference rent')}. That figure decides three things. First, rent increases: under Section 558 of the Civil Code a landlord may only ask you to agree to an increase up to the reference rent, and may justify the demand with the index (${h.src('bgb558a', 'Section 558a BGB')}). Second, new leases: in areas with the ${h.a('mietpreisbremse', 'rent brake')} the starting rent may be at most ten per cent above it. Third, benefits: job centres and social welfare offices use it to set reasonable housing costs.</p>
<h2>Table indexes and regression indexes</h2>
<p>In a table index a few features form the axes of a table, typically year built, floor area and location. Each flat falls into exactly one field, which gives a mean and a range. Berlin has 189 such lines across three tables for basic, average and good locations; Hamburg has one table with 90 fields for normal and good locations. Further features such as a balcony, a fitted kitchen or a modernised bathroom decide the position within the range.</p>
<p>In a regression index a statistical model has estimated from the surveyed rents how much each feature contributes. The result is a base rent, usually by floor area, and a list of premiums and deductions in euros or per cent. Munich, Frankfurt, Stuttgart, Leipzig, Nuremberg and Essen work this way; Dortmund combines a base table by year built with premiums in euros. Regression indexes are more precise but tedious without a calculator: you must know every feature and add or multiply correctly.</p>
${h.table(['City', 'Edition', 'Type', 'Figures here'], STAEDTE.map((s) => [h.a(seite(s.id), s.name), s.ausgabe.split(' (')[0], s.qualifiziert ? 'qualified' : 'simple', s.schema === 'eingabe' ? 'entered by you, rights reserved' : 'calculated']), `Rent indexes of the large cities as of ${h.date(P.retrieved_at)}`, ['l', 'l', 'l', 'l'])}
<h2>Simple or qualified</h2>
<p>Of the ${STAEDTE.length} cities in our overview, ${qual} have a qualified index. ${einfach.join(' and ')} have simple indexes drawn up by associations. The difference matters legally: a qualified index is produced according to recognised scientific principles and recognised by the municipality or by both sides (${h.src('bgb558d', 'Section 558d BGB')}). It carries the presumption that its figures reflect the reference rent, provided it was updated in time; whoever claims otherwise must prove it. A landlord must also quote a qualified index in his increase letter even if he justifies the increase differently. More on the ${h.a('qualifizierter-mietspiegel', 'qualified rent index')} page.</p>
<h2>How to read your rent index</h2>
<ol>
<li><strong>Check its scope.</strong> Does the index cover your flat? Detached and semi-detached houses, subsidised flats, furnished flats and very new buildings are usually excluded. Berlin's 2026 index, for example, covers flats completed by the end of 2024.</li>
<li><strong>Look up the location.</strong> In the street directory, the location map or the city's online lookup.</li>
<li><strong>Assign year and size.</strong> What counts is the year the flat was completed, not a later refurbishment, and the floor area under the ${h.a('wohnflaeche', 'Living Space Ordinance')}.</li>
<li><strong>Rate the fittings.</strong> By the features the index lists; only what the landlord provided counts.</li>
<li><strong>Compare the net cold rent.</strong> Indexes give net cold rents. If you pay an all-inclusive rent, take the service charges out.</li>
</ol>
<p>For Berlin, Hamburg and Dortmund the rent check does these steps for you; for the other cities it takes you to the official tool and combines its result with your municipality's rules. The small tool above shows how the Berlin index picks a field: the 1965 flat of 62 m² in an average location lies in line ${b.zeile?.zeile}.</p>
<h2>How old may a rent index be?</h2>
<p>A rent index should be adjusted to the market every two years (${h.src('bgb558c', 'Section 558c(3) BGB')}). For a qualified index that is mandatory, and after four years it must be drawn up anew; the data reference date counts. If no current index exists, Section 558a(4) lets a landlord rely on an outdated one or that of a comparable municipality. Only a qualified index updated in time carries the legal presumption, though.</p>
`,
  },
});
