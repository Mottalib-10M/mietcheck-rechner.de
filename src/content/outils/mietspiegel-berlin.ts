import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { berlinOvm, BERLIN } from '../../lib/engine/berlin';
import { stadt, stadtStatus } from '../../lib/engine/staedte';
import { mietpreisbremse } from '../../lib/engine/miete';
import { formatMoney, displayDate } from '../../lib/format';

const S = stadt('berlin')!;
const st = stadtStatus(S, P.retrieved_at);
const lb = S.land === 'BE' ? undefined : undefined;
void lb;
// Exemples : 1965, 62 m², einfache / mittlere / gute Lage ; Neubau 2018, 80 m², gute Lage.
const e = berlinOvm({ lage: 'einfach', baujahr: 1965, flaeche: 62 });
const m = berlinOvm({ lage: 'mittel', baujahr: 1965, flaeche: 62 });
const g = berlinOvm({ lage: 'gut', baujahr: 1965, flaeche: 62 });
const nb = berlinOvm({ lage: 'gut', baujahr: 2018, flaeche: 80 });
const mp = mietpreisbremse({ ovm: m.ovm, flaeche: 62, miete: 700, gebiet: true });
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietspiegel-berlin',
  group: 'staedte',
  order: 10,
  tool: 'stadt',
  ort: 'berlin',
  related: ['mietpreisbremse-rechner', 'mieterhoehung-rechner', 'vergleichsmiete', 'qualifizierter-mietspiegel', 'mietspiegel-hamburg', 'nebenkosten'],
  sources: ['berlinMs', 'bgb558d', 'bgb556d', 'bgb558'],
  de: {
    slug: 'mietspiegel-berlin',
    nav: 'Mietspiegel Berlin',
    card: 'Vergleichsmiete aus dem Mietspiegel 2026 mit Orientierungshilfe.',
    title: 'Mietspiegel Berlin 2026: Vergleichsmiete selbst berechnen',
    description: 'Mietspiegel Berlin 2026: Vergleichsmiete nach Wohnlage, Baujahr und Fläche mit Orientierungshilfe, dazu Mietpreisbremse bis 2029 und Kappungsgrenze 15 Prozent.',
    h1: 'Mietspiegel Berlin 2026: Ihre Vergleichsmiete in einer Minute',
    intro: 'Wohnlage aus dem Straßenverzeichnis, Baujahr und Fläche genügen; die Ausstattung ordnen Sie bei Bedarf darunter genauer ein.',
    resume: `Der Berliner Mietspiegel 2026 gilt seit dem ${dD(S.gueltigAb!)} und bildet die Mieten zum Stichtag 1. September 2025 ab. Er ist ein qualifizierter Mietspiegel nach § 558d BGB, erstellt von der Senatsverwaltung für Stadtentwicklung, Bauen und Wohnen und anerkannt von den Mieter- und Vermieterverbänden. Für eine Wohnung bestimmen drei Merkmale das Tabellenfeld: die Wohnlage (einfach, mittel, gut) aus dem Straßenverzeichnis, das Jahr der Bezugsfertigkeit und die Wohnfläche. Ausgangswert ist der Mittelwert des Feldes; die Orientierungshilfe verschiebt ihn je nach Ausstattung in Richtung des unteren oder oberen Spannenwerts. Eine Wohnung von 1965 mit 62 m² liegt in einfacher Lage bei ${eD(e.ovm)}, in mittlerer bei ${eD(m.ovm)} und in guter bei ${eD(g.ovm)} je Quadratmeter. In ganz Berlin gilt die Mietpreisbremse bis zum ${dD(st.mpbBis!)} und die Kappungsgrenze von 15 Prozent bis zum ${dD(st.kappungBis!)}.`,
    faqs: [
      { q: 'Woher weiß ich, ob meine Berliner Adresse einfache, mittlere oder gute Wohnlage ist?', a: 'Aus dem Straßenverzeichnis zum Mietspiegel 2026, das im Amtsblatt vom 28. Mai 2026 und auf mietspiegel.berlin.de steht. Die Karte in der Broschüre zeigt nur die überwiegende Lage eines Gebiets; innerhalb eines Gebiets können einzelne Adressen anders eingestuft sein. Maßgeblich ist allein der Eintrag für Ihre Hausnummer, den auch die Online-Abfrage der Senatsverwaltung liefert.' },
      { q: 'Gilt der Berliner Mietspiegel auch für einen Neubau?', a: `Für Wohnungen, die bis zum 31. Dezember 2024 bezugsfertig wurden, ja; die jüngste Klasse reicht von 2020 bis 2024. Ein Neubau von 2018 mit 80 m² in guter Lage liegt beim Mittelwert von ${eD(nb.ovm)}. Ab 2025 fertiggestellte Wohnungen sind nicht erfasst. Für eine Neuvermietung ist das oft gleichgültig, weil Erstvermietungen nach dem 1. Oktober 2014 ohnehin nicht unter die Mietpreisbremse fallen.` },
      { q: 'Warum gibt es für 1973 bis 1990 zwei verschiedene Zeilen?', a: 'Weil Ost- und West-Berlin in diesen Jahren unterschiedlich gebaut haben und die Mieten noch heute auseinanderliegen. Für die früheren Ostbezirke und West-Staaken gilt die Klasse 1973 bis 1990 Ost einschließlich der Wendewohnungen, für die früheren Westbezirke die Klassen 1973 bis 1985 und 1986 bis 1990 West. Maßgeblich sind die Bezirksgrenzen vor der Gebietsreform von 2001.' },
      { q: 'Muss ich die Orientierungshilfe benutzen?', a: 'Nein. Sie gehört nicht zum qualifizierten Teil des Mietspiegels, wird aber von Berliner Gerichten als Schätzgrundlage verwendet. Ohne sie gilt der Mittelwert des Feldes. Mit ihr zählen Sie für fünf Gruppen, ob die besseren oder die schlechteren Merkmale überwiegen; jede überwiegend gute Gruppe hebt den Wert um ein Fünftel des Abstands zum oberen Spannenwert.' },
    ],
    body: (h) => `
<h2>So liest der Rechner den Berliner Mietspiegel</h2>
<p>Der Berliner Mietspiegel ist ein Tabellenmietspiegel. Für jede Wohnlage gibt es eine Tabelle, darin für jede Baualtersklasse mehrere Größenklassen mit unterem Spannenwert, Mittelwert und oberem Spannenwert, zusammen ${BERLIN.zeilen.length} Zeilen. Der Rechner nimmt das Feld, in das Ihre Angaben fallen, und zeigt Ihnen die Zeilennummer, damit Sie den Wert in der ${h.src('berlinMs', 'Broschüre der Senatsverwaltung')} nachschlagen können. Er zeigt nur dieses eine Feld, nie die ganze Tabelle.</p>
<p>Die Werte gelten für voll ausgestattete Wohnungen mit Sammelheizung, Bad und WC in der Wohnung. Fehlen bei einer bis 1949 bezugsfertigen Wohnung Sammelheizung oder Bad, sieht der Mietspiegel einen Abschlag von ${h.eur(BERLIN.minderausstattung_abschlag, 2)} je Quadratmeter vor. Die Orientierungshilfe ordnet die Wohnung innerhalb der Spanne ein. Sie unterscheidet fünf Merkmalgruppen: Bad und WC, Küche, Wohnung, Gebäude, Wohnumfeld. In jeder Gruppe zählt die einfache Mehrheit der zutreffenden besseren oder schlechteren Merkmale, und die Gruppen werden gegeneinander aufgerechnet.</p>
<h2>Drei Lagen, ein Baujahr</h2>
${h.table(['Wohnlage', 'Zeile', 'Spanne je m²', 'Mittelwert je m²'], [e, m, g].map((r, i) => [['einfach', 'mittel', 'gut'][i], String(r.zeile!.zeile), `${h.num(r.spanne[0], 2)} bis ${h.num(r.spanne[1], 2)} €`, h.eur(r.ovm, 2)]), 'Berliner Mietspiegel 2026, Bezugsfertigkeit 1965 bis 1972, 62 m²', ['l', 'r', 'r', 'r'])}
<h2>Was der Wert für Sie bedeutet</h2>
<p>Bei einem neuen Vertrag gilt in Berlin die ${h.a('mietpreisbremse', 'Mietpreisbremse')}: Höchstens die Vergleichsmiete plus zehn Prozent. Für die Wohnung von 1965 in mittlerer Lage sind das ${h.eur(mp.zulaessig, 2)} im Monat; bei ${h.eur(700, 0)} Miete wären ${h.eur(mp.ueberMonat, 2)} zu viel. Bei einer Mieterhöhung darf die neue Miete die Vergleichsmiete nicht übersteigen und höchstens 15 Prozent über der Miete von vor drei Jahren liegen, denn Berlin hat die ${h.a('kappungsgrenze', 'Kappungsgrenze')} abgesenkt. Ein Vermieter, der seine Erhöhung auf etwas anderes stützt, muss die Werte des qualifizierten Mietspiegels trotzdem nennen (${h.src('bgb558', '§ 558a Abs. 3 BGB')}).</p>
`,
  },
  en: {
    slug: 'berlin-rent-index',
    nav: 'Berlin rent index',
    card: 'Reference rent from the 2026 index with the official guidance.',
    title: 'Berlin Rent Index 2026 (Mietspiegel): Reference Rent Check',
    description: 'Berlin rent index 2026: reference rent by location, year built and floor area with the official guidance, plus the rent brake to 2029 and the 15 per cent cap.',
    h1: 'Berlin rent index 2026: your reference rent in a minute',
    intro: 'Location from the street directory, year completed and floor area are enough; refine the fittings below if you like.',
    resume: `Berlin's 2026 rent index (Berliner Mietspiegel) has applied since ${dE(S.gueltigAb!)} and reflects rents as of 1 September 2025. It is a qualified index under Section 558d of the Civil Code, produced by the Senate Department for Urban Development, Building and Housing and recognised by tenant and landlord associations. Three features decide a flat's field in the table: the residential location (basic, average or good) from the street directory, the year the flat was completed and its floor area. The starting point is the field's mean; the official guidance (Orientierungshilfe) moves it towards the lower or upper end depending on the fittings. A 1965 flat of 62 m² comes to ${eE(e.ovm)} per square metre in a basic location, ${eE(m.ovm)} in an average one and ${eE(g.ovm)} in a good one. Across Berlin, the rent brake applies until ${dE(st.mpbBis!)} and the 15 per cent increase cap until ${dE(st.kappungBis!)}.`,
    faqs: [
      { q: 'How do I know whether my Berlin address is a basic, average or good location?', a: 'From the street directory for the 2026 index, published in the official gazette on 28 May 2026 and on mietspiegel.berlin.de. The map in the brochure only shows the prevailing location of an area; single addresses inside it can be rated differently. Only the entry for your house number counts, and the Senate department\'s online lookup returns it.' },
      { q: 'Does the Berlin rent index cover new builds?', a: `Flats completed by 31 December 2024, yes; the youngest band runs from 2020 to 2024. A 2018 flat of 80 m² in a good location sits at a mean of ${eE(nb.ovm)}. Flats completed from 2025 are not covered. For a new lease this often does not matter, because first lettings after 1 October 2014 are exempt from the rent brake anyway.` },
      { q: 'Why are there two separate lines for 1973 to 1990?', a: 'Because East and West Berlin built differently in those years and rents still differ today. The former eastern districts and West-Staaken use the band 1973 to 1990 East, including flats started before reunification and finished after it; the former western districts use 1973 to 1985 and 1986 to 1990 West. District borders before the 2001 reform decide.' },
      { q: 'Do I have to use the official guidance?', a: 'No. It is not part of the qualified index, but Berlin courts use it as a basis for estimates. Without it, the field mean applies. With it, you check for five groups whether the better or the worse features prevail; each mostly good group raises the value by a fifth of the distance to the top of the range.' },
    ],
    body: (h) => `
<h2>How the calculator reads the Berlin index</h2>
<p>The Berlin index is a table index. Each residential location has a table, and each table has several floor-area bands per age band, with the bottom of the range, the mean and the top of the range: ${BERLIN.zeilen.length} lines in all. The calculator takes the field your details fall into and shows its line number, so you can look the value up in the ${h.src('berlinMs', 'Senate department brochure')}. It shows only that one field, never the whole table.</p>
<p>The values apply to fully equipped flats with central heating, a bathroom and an indoor toilet. For flats completed up to 1949 without central heating or a bathroom, the index allows a deduction of ${h.eur(BERLIN.minderausstattung_abschlag, 2)} per square metre. The guidance places the flat within the range using five groups: bathroom and toilet, kitchen, flat, building and surroundings. In each group a simple majority of the better or worse features decides, and the groups offset one another.</p>
<h2>Three locations, one year</h2>
${h.table(['Location', 'Line', 'Range per m²', 'Mean per m²'], [e, m, g].map((r, i) => [['basic', 'average', 'good'][i], String(r.zeile!.zeile), `${h.num(r.spanne[0], 2)} to ${h.num(r.spanne[1], 2)} €`, h.eur(r.ovm, 2)]), 'Berlin rent index 2026, completed 1965 to 1972, 62 m²', ['l', 'r', 'r', 'r'])}
<h2>What the figure means for you</h2>
<p>For a new lease, Berlin's ${h.a('mietpreisbremse', 'rent brake')} applies: at most the reference rent plus ten per cent. For the 1965 flat in an average location that is ${h.eur(mp.zulaessig, 2)} a month; at ${h.eur(700, 0)} rent, ${h.eur(mp.ueberMonat, 2)} would be too much. For a rent increase, the new rent may not exceed the reference rent nor rise more than 15 per cent above the rent three years earlier, because Berlin has lowered the ${h.a('kappungsgrenze', 'increase cap')}. A landlord who bases an increase on something else must still quote the qualified index (${h.src('bgb558', 'Section 558a(3) BGB')}).</p>
`,
  },
});
