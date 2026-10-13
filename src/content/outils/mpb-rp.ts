import { defineGuide } from '../../lib/guide-types';
import { status } from '../../lib/engine/gebiet';
import { landDaten, gemeindeTabelle } from '../../lib/land-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Exemple : Mainz, valeur de référence supposée 11,00 €/m², 65 m², loyer convenu 850 €.
const D = landDaten('RP', 'Mainz', 11, 65, 850);
const { L, st, mpb, erh } = D;
const vo = L.mpb!, kap = L.kappung!;
const worms = status('RP', 'Worms', '2026-10-12');
const trier = status('RP', 'Trier', '2026-10-12');
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mpb-rp',
  group: 'laender',
  order: 80,
  tool: 'land',
  ort: 'RP',
  related: ['mpb-he', 'kappungsgrenze', 'mietpreisbremse', 'mieterhoehung-rechner', 'mpb-bw'],
  sources: ['bgb556d', 'bgb558'],
  de: {
    slug: 'mietpreisbremse-rheinland-pfalz',
    nav: 'Mietpreisbremse Rheinland-Pfalz',
    card: `${D.nMpb} Gemeinden mit Mietpreisbremse, ${D.nKap} mit 15 Prozent.`,
    title: 'Mietpreisbremse Rheinland-Pfalz 2026: zwei Listen, ein Land',
    description: `Mietpreisbremse Rheinland-Pfalz 2026: ${D.nMpb} Gemeinden bis Ende 2029, aber Kappungsgrenze 15 Prozent nur in ${D.nKap}; Mainz, Speyer, Worms und Rhein-Pfalz-Kreis.`,
    h1: 'Mietpreisbremse in Rheinland-Pfalz: zwei verschiedene Listen',
    intro: 'In Rheinland-Pfalz decken sich die Gebiete von Mietpreisbremse und Kappungsgrenze nicht; der Mietcheck prüft beide getrennt.',
    resume: `Rheinland-Pfalz hat für die Mietpreisbremse und die Kappungsgrenze zwei Verordnungen mit unterschiedlichen Gebieten. Die Mietpreisbegrenzungsverordnung vom September 2025 gilt seit dem 8. Oktober 2025 bis zum ${dD(vo.bis)}; sie nennt die kreisfreien Städte Landau, Ludwigshafen, Mainz, Speyer und Worms sowie alle Gemeinden im Landkreis Alzey-Worms und im Rhein-Pfalz-Kreis, zusammen ${D.nMpb} Gemeinden. Die Kappungsgrenzenverordnung von 2024 gilt bis zum ${dD(kap.bis)} und ist enger: Landau, Ludwigshafen, Mainz, Speyer und der Rhein-Pfalz-Kreis, ${D.nKap} Gemeinden. In Worms und im Landkreis Alzey-Worms gilt also bei Vertragsschluss die Mietpreisbremse, bei Mieterhöhungen aber die normale Grenze von 20 Prozent. Trier steht in keiner der beiden Verordnungen. Beispiel Mainz: Bei einer angenommenen Vergleichsmiete von ${eD(11)} für 65 m² darf ein neuer Vertrag höchstens ${eD(mpb.zulaessig)} kalt kosten; eine Erhöhung von ${eD(D.alt, 0)} ist auf ${eD(erh.zulaessig)} gedeckelt.`,
    faqs: [
      { q: 'Warum gilt in Worms die Mietpreisbremse, aber keine abgesenkte Kappungsgrenze?', a: `Weil Worms nur in der Verordnung zur Mietpreisbremse von 2025 steht, nicht in der Kappungsgrenzenverordnung von 2024. Für einen neuen Vertrag gilt dort also die Grenze von zehn Prozent über der Vergleichsmiete, für eine Erhöhung bestehender Mieten die bundesweite Kappungsgrenze von ${worms.kappung * 100} Prozent in drei Jahren. Dasselbe gilt für alle Gemeinden im Landkreis Alzey-Worms.` },
      { q: 'Gilt in Trier eine Mietpreisbremse?', a: `${trier.gefunden ? 'Ja.' : 'Nein.'} Trier stand in einem Entwurf der Kappungsgrenzenverordnung von 2024, wurde in die endgültigen Verordnungen aber nicht aufgenommen. In Trier gelten daher weder die Mietpreisbremse noch die abgesenkte Kappungsgrenze; Mieterhöhungen sind dort bis 20 Prozent in drei Jahren und bis zur Vergleichsmiete zulässig.` },
      { q: 'Woher weiß ich, ob mein Dorf im Rhein-Pfalz-Kreis erfasst ist?', a: 'Die Verordnungen nennen nicht jede Gemeinde einzeln, sondern alle Gemeinden im Rhein-Pfalz-Kreis und im Landkreis Alzey-Worms. Die Liste unten löst das nach dem amtlichen Gemeindeverzeichnis des Statistischen Bundesamts auf. Liegt Ihr Wohnort in einem dieser Kreise, ist er erfasst, auch wenn sich Gemeindegrenzen später ändern.' },
    ],
    body: (h) => `
<h2>Zwei Verordnungen, zwei Gebiete</h2>
<p>Die ${h.ext(vo.url, 'Mietpreisbegrenzungsverordnung Rheinland-Pfalz')} (GVBl. 2025 Nr. 18 S. 538) beruht auf ${h.src('bgb556d', '§ 556d Abs. 2 BGB')}, die Kappungsgrenzenverordnung (GVBl. 2024 Nr. 21 S. 331) auf ${h.src('bgb558', '§ 558 Abs. 3 BGB')}. Die beiden Verordnungen wurden zu verschiedenen Zeitpunkten mit eigenen Begründungen erlassen, und ihre Gebiete weichen voneinander ab. Für Mieter ist die Folge wichtig: Ob bei Vertragsschluss eine Grenze gilt und ob eine Erhöhung mit 15 oder 20 Prozent gekappt wird, muss getrennt geprüft werden. Der Mietcheck tut das, sobald Sie Ihre Gemeinde eintragen.</p>
${h.table(['Gebiet', 'Mietpreisbremse', 'Kappungsgrenze 15 %'], [
  ['Mainz, Ludwigshafen, Landau, Speyer', 'ja', 'ja'],
  ['Worms', 'ja', 'nein, 20 %'],
  ['Rhein-Pfalz-Kreis', 'ja', 'ja'],
  ['Landkreis Alzey-Worms', 'ja', 'nein, 20 %'],
  ['Trier, Koblenz, Kaiserslautern und übrige Gemeinden', 'nein', 'nein, 20 %'],
], `Rheinland-Pfalz, Stand ${h.date('2026-10-12')}`, ['l', 'l', 'l'])}
<h2>Alle Gemeinden mit Mietpreisbremse</h2>
${gemeindeTabelle(vo, h, `Mietpreisbegrenzungsverordnung Rheinland-Pfalz: ${D.nMpb} Gemeinden`)}
`,
  },
  en: {
    slug: 'rent-brake-rhineland-palatinate',
    nav: 'Rent brake Rhineland-Palatinate',
    card: `${D.nMpb} municipalities with the rent brake, ${D.nKap} with the 15 per cent cap.`,
    title: 'Rent Brake Rhineland-Palatinate 2026: Two Lists, One State',
    description: `Rent brake in Rhineland-Palatinate 2026: ${D.nMpb} municipalities until 2029, but the 15 per cent cap in only ${D.nKap}; Mainz, Speyer, Worms and the Rhein-Pfalz district.`,
    h1: 'The rent brake in Rhineland-Palatinate: two different lists',
    intro: 'In Rhineland-Palatinate the rent-brake and cap areas do not match; the rent check tests each separately.',
    resume: `Rhineland-Palatinate has two ordinances with different areas for the rent brake (Mietpreisbremse) and the increase cap. The rent ordinance of September 2025 has applied since 8 October 2025 and runs until ${dE(vo.bis)}; it names the independent cities of Landau, Ludwigshafen, Mainz, Speyer and Worms plus all municipalities in the Alzey-Worms district and the Rhein-Pfalz district, ${D.nMpb} municipalities in all. The 2024 cap ordinance runs until ${dE(kap.bis)} and is narrower: Landau, Ludwigshafen, Mainz, Speyer and the Rhein-Pfalz district, ${D.nKap} municipalities. So in Worms and the Alzey-Worms district the rent brake applies at signing, but the normal 20 per cent limit applies to increases. Trier is in neither ordinance. Take Mainz: with an assumed reference rent of ${eE(11)} for 65 m², a new lease may cost at most ${eE(mpb.zulaessig)} a month before service charges, and an increase from ${eE(D.alt, 0)} is capped at ${eE(erh.zulaessig)}.`,
    faqs: [
      { q: 'Why does Worms have the rent brake but no lowered cap?', a: `Because Worms is only in the 2025 rent-brake ordinance, not in the 2024 cap ordinance. A new lease there is limited to ten per cent above the reference rent, while increases on existing rents follow the nationwide cap of ${worms.kappung * 100} per cent in three years. The same applies to every municipality in the Alzey-Worms district.` },
      { q: 'Is there a rent brake in Trier?', a: `${trier.gefunden ? 'Yes.' : 'No.'} Trier was in a 2024 draft of the cap ordinance but was not included in the final ordinances. Trier therefore has neither the rent brake nor the lowered cap; increases there are lawful up to 20 per cent in three years and up to the reference rent.` },
      { q: 'How do I know whether my village in the Rhein-Pfalz district is covered?', a: 'The ordinances do not name each municipality but all municipalities in the Rhein-Pfalz district and the Alzey-Worms district. The list below resolves that using the Federal Statistical Office’s official municipality register. If you live in one of these districts you are covered, even if municipal boundaries change later.' },
    ],
    body: (h) => `
<h2>Two ordinances, two areas</h2>
<p>The ${h.ext(vo.url, 'Rhineland-Palatinate rent ordinance')} (GVBl. 2025 No. 18 p. 538) rests on ${h.src('bgb556d', 'Section 556d(2) of the Civil Code')}, the cap ordinance (GVBl. 2024 No. 21 p. 331) on ${h.src('bgb558', 'Section 558(3)')}. The two ordinances were adopted at different times with their own reasons, and their areas differ. For tenants the consequence matters: whether a ceiling applies at signing and whether an increase is capped at 15 or 20 per cent must be checked separately. The rent check does so once you enter your municipality.</p>
${h.table(['Area', 'Rent brake', '15% cap'], [
  ['Mainz, Ludwigshafen, Landau, Speyer', 'yes', 'yes'],
  ['Worms', 'yes', 'no, 20%'],
  ['Rhein-Pfalz district', 'yes', 'yes'],
  ['Alzey-Worms district', 'yes', 'no, 20%'],
  ['Trier, Koblenz, Kaiserslautern and all others', 'no', 'no, 20%'],
], `Rhineland-Palatinate as of ${h.date('2026-10-12')}`, ['l', 'l', 'l'])}
<h2>Every municipality with the rent brake</h2>
${gemeindeTabelle(vo, h, `Rhineland-Palatinate rent ordinance: ${D.nMpb} municipalities`)}
`,
  },
});
