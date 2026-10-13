import { defineGuide } from '../../lib/guide-types';
import { landDaten, gemeindeTabelle } from '../../lib/land-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Exemple : Potsdam, valeur de référence supposée 9,60 €/m², 60 m², loyer convenu 720 €.
const D = landDaten('BB', 'Potsdam', 9.6, 60, 720);
const { L, st, mpb, erh } = D;
const vo = L.mpb!, kap = L.kappung!;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mpb-bb',
  group: 'laender',
  order: 30,
  tool: 'land',
  ort: 'BB',
  related: ['mietspiegel-berlin', 'mietpreisbremse-rechner', 'kappungsgrenze', 'mpb-mv', 'mietpreisbremse'],
  sources: ['bgb556d', 'bgb558'],
  de: {
    slug: 'mietpreisbremse-brandenburg',
    nav: 'Mietpreisbremse Brandenburg',
    card: `Potsdam und ${D.nMpb - 1} Gemeinden im Berliner Umland.`,
    title: 'Mietpreisbremse Brandenburg 2026: Potsdam und das Umland',
    description: `Mietpreisbremse Brandenburg 2026: Potsdam und ${D.nMpb - 1} Gemeinden im Berliner Umland bis Ende 2029, Kappungsgrenze 15 Prozent bis Ende 2030, mit Beispiel Potsdam.`,
    h1: 'Mietpreisbremse in Brandenburg: der Speckgürtel um Berlin',
    intro: 'Brandenburg hat die Liste zum 1. Januar 2026 fast verdoppelt; erfasst sind Potsdam und Gemeinden rund um Berlin.',
    resume: `Seit dem 1. Januar 2026 gelten in Brandenburg zwei neue Verordnungen vom 3. Dezember 2025: die Mietpreisbegrenzungsverordnung bis zum ${dD(vo.bis)} und die Kappungsgrenzenverordnung bis zum ${dD(kap.bis)}, also ein Jahr länger. Beide nennen dieselben ${D.nMpb} Gemeinden, etwa doppelt so viele wie zuvor: die Landeshauptstadt Potsdam und ${D.nMpb - 1} Gemeinden in acht Landkreisen rund um Berlin, von Bernau und Panketal im Norden über Falkensee und Werder im Westen bis Königs Wusterhausen, Schönefeld und Erkner im Südosten. Wer hier eine Wohnung mietet, ist bei Vertragsschluss durch die Mietpreisbremse geschützt und bei Erhöhungen durch die Kappungsgrenze von 15 Prozent. Für Potsdam ergibt eine angenommene Vergleichsmiete von ${eD(9.6)} für 60 m² eine Grenze von ${eD(mpb.zulaessig)}; bei ${eD(720, 0)} wären ${eD(mpb.ueberMonat)} im Monat zu viel. Weiter entfernte Städte wie Cottbus oder Frankfurt (Oder) stehen nicht in der Liste.`,
    faqs: [
      { q: 'Gilt die Mietpreisbremse in Cottbus oder Frankfurt (Oder)?', a: 'Nein. Brandenburg hat nur Potsdam und Gemeinden im Berliner Umland in die Verordnungen aufgenommen. In Cottbus, Frankfurt (Oder), Brandenburg an der Havel und den übrigen Landesteilen gilt bei Vertragsschluss keine Grenze aus § 556d BGB, und Mieterhöhungen dürfen bis 20 Prozent in drei Jahren betragen, sofern die Vergleichsmiete das hergibt.' },
      { q: 'Warum läuft die Kappungsgrenze in Brandenburg länger als die Mietpreisbremse?', a: `Weil die beiden Verordnungen auf unterschiedlichen Ermächtigungen beruhen. Eine Verordnung zur Mietpreisbremse darf nach § 556d BGB höchstens bis Ende 2029 gelten, eine zur Kappungsgrenze nach § 558 BGB jeweils fünf Jahre. Brandenburg hat beide ausgeschöpft: Mietpreisbremse bis ${dD(vo.bis)}, Kappungsgrenze bis ${dD(kap.bis)}.` },
      { q: 'Welche Vergleichsmiete gilt in einer Brandenburger Umlandgemeinde ohne Mietspiegel?', a: 'Hat Ihre Gemeinde keinen eigenen Mietspiegel, kann der Vermieter eine Erhöhung mit dem Mietspiegel einer vergleichbaren Gemeinde, einem Gutachten oder drei Vergleichswohnungen begründen (§ 558a BGB). Der Berliner Mietspiegel gilt nicht automatisch für das Umland. Im Mietcheck tragen Sie den Wert ein, der in Ihrem Fall begründet wurde.' },
    ],
    body: (h) => `
<h2>Zwei Verordnungen mit derselben Liste</h2>
<p>Die ${h.ext(vo.url, 'Mietpreisbegrenzungsverordnung Brandenburg')} (GVBl. II 2025 Nr. 95) und die Kappungsgrenzenverordnung (GVBl. II 2025 Nr. 94) nennen dieselben Gemeinden, jeweils mit ihrem Landkreis. Sie lösen ältere Verordnungen ab, die weniger Gemeinden umfassten. Eine Verordnung zur verlängerten Kündigungssperrfrist nach Umwandlung haben wir im brandenburgischen Landesrecht nicht gefunden; ohne sie gilt die gesetzliche Frist von drei Jahren. Rechtsgrundlagen sind ${h.src('bgb556d', '§ 556d Abs. 2')} und ${h.src('bgb558', '§ 558 Abs. 3 BGB')}.</p>
<h2>Potsdam als Beispiel</h2>
<p>Für einen neuen Vertrag über 60 m² zu ${h.eur(720, 0)} und eine angenommene Vergleichsmiete von ${h.eur(9.6, 2)} liegt die Grenze bei ${h.eur(mpb.zulaessig, 2)}. Eine Mieterhöhung von ${h.eur(D.alt, 0)} auf ${h.eur(D.verlangt, 0)} ist auf ${h.eur(erh.zulaessig, 2)} gedeckelt. Wer zwischen Berlin und dem Umland vergleicht, findet die Berliner Vergleichsmiete auf der Seite ${h.a('mietspiegel-berlin', 'Mietspiegel Berlin')}; dort rechnet der Mietcheck sie selbst aus.</p>
<h2>Alle Gemeinden der Verordnungen</h2>
${gemeindeTabelle(vo, h, `Brandenburg, Verordnungen vom 3. Dezember 2025: ${D.nMpb} Gemeinden`)}
`,
  },
  en: {
    slug: 'rent-brake-brandenburg',
    nav: 'Rent brake Brandenburg',
    card: `Potsdam and ${D.nMpb - 1} municipalities around Berlin.`,
    title: 'Rent Brake Brandenburg 2026: Potsdam and the Berlin Belt',
    description: `Rent brake in Brandenburg 2026: Potsdam and ${D.nMpb - 1} municipalities around Berlin until the end of 2029, a 15 per cent cap to 2030, and a worked Potsdam example.`,
    h1: 'The rent brake in Brandenburg: the commuter belt around Berlin',
    intro: 'Brandenburg nearly doubled its list on 1 January 2026; Potsdam and municipalities around Berlin are covered.',
    resume: `Since 1 January 2026, Brandenburg has had two new ordinances of 3 December 2025: the rent ordinance until ${dE(vo.bis)} and the cap ordinance until ${dE(kap.bis)}, one year longer. Both list the same ${D.nMpb} municipalities, about twice as many as before: the state capital Potsdam and ${D.nMpb - 1} municipalities in eight districts around Berlin, from Bernau and Panketal in the north via Falkensee and Werder in the west to Königs Wusterhausen, Schönefeld and Erkner in the south-east. Anyone renting here is protected by the rent brake (Mietpreisbremse) at signing and by the 15 per cent cap on increases. For Potsdam, an assumed reference rent of ${eE(9.6)} for 60 m² gives a ceiling of ${eE(mpb.zulaessig)}; at ${eE(720, 0)}, ${eE(mpb.ueberMonat)} a month would be too much. Towns further away, such as Cottbus or Frankfurt (Oder), are not on the list.`,
    faqs: [
      { q: 'Does the rent brake apply in Cottbus or Frankfurt (Oder)?', a: 'No. Brandenburg only listed Potsdam and municipalities around Berlin. In Cottbus, Frankfurt (Oder), Brandenburg an der Havel and the rest of the state there is no ceiling under Section 556d of the Civil Code at signing, and increases may reach 20 per cent in three years if the reference rent allows it.' },
      { q: 'Why does the cap run longer than the rent brake in Brandenburg?', a: `Because the two ordinances rest on different powers. A rent-brake ordinance may run until the end of 2029 at most under Section 556d of the Civil Code, a cap ordinance at most five years at a time under Section 558. Brandenburg used both: rent brake until ${dE(vo.bis)}, cap until ${dE(kap.bis)}.` },
      { q: 'Which reference rent applies in a Brandenburg town without a rent index?', a: 'If your municipality has no rent index of its own, the landlord can justify an increase with the index of a comparable municipality, an expert opinion or three comparable flats (Section 558a of the Civil Code). Berlin’s index does not automatically apply to the surrounding towns. In the rent check, enter the value used to justify your case.' },
    ],
    body: (h) => `
<h2>Two ordinances with the same list</h2>
<p>The ${h.ext(vo.url, 'Brandenburg rent ordinance')} (GVBl. II 2025 No. 95) and the cap ordinance (GVBl. II 2025 No. 94) list the same municipalities, each with its district. They replace older ordinances that covered fewer municipalities. We found no Brandenburg ordinance on a longer notice ban after conversion; without one, the statutory three years apply. The legal bases are ${h.src('bgb556d', 'Section 556d(2)')} and ${h.src('bgb558', 'Section 558(3) of the Civil Code')}.</p>
<h2>Potsdam as an example</h2>
<p>For a new 60 m² lease at ${h.eur(720, 0)} and an assumed reference rent of ${h.eur(9.6, 2)}, the ceiling is ${h.eur(mpb.zulaessig, 2)}. An increase from ${h.eur(D.alt, 0)} to ${h.eur(D.verlangt, 0)} is capped at ${h.eur(erh.zulaessig, 2)}. If you are comparing Berlin with the surrounding area, the Berlin reference rent is on the ${h.a('mietspiegel-berlin', 'Berlin rent index')} page, where the rent check works it out itself.</p>
<h2>Every municipality in the ordinances</h2>
${gemeindeTabelle(vo, h, `Brandenburg, ordinances of 3 December 2025: ${D.nMpb} municipalities`)}
`,
  },
});
