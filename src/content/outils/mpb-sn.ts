import { defineGuide } from '../../lib/guide-types';
import { status } from '../../lib/engine/gebiet';
import { landDaten } from '../../lib/land-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Exemple : Dresden, valeur de référence supposée 7,90 €/m², 70 m², loyer convenu 680 €.
const D = landDaten('SN', 'Dresden', 7.9, 70, 680);
const { L, st, mpb, erh } = D;
const vo = L.mpb!, kap = L.kappung!;
const juli27 = status('SN', 'Leipzig', '2027-07-15');
const chemnitz = status('SN', 'Chemnitz', '2026-10-12');
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mpb-sn',
  group: 'laender',
  order: 90,
  tool: 'land',
  ort: 'SN',
  related: ['mietspiegel-leipzig', 'mietspiegel-dresden', 'mpb-th', 'mietpreisbremse-ruege', 'staffelmiete'],
  sources: ['bgb556d', 'bgb558', 'bgb557a'],
  de: {
    slug: 'mietpreisbremse-sachsen',
    nav: 'Mietpreisbremse Sachsen',
    card: 'Nur Dresden und Leipzig, befristet bis Ende Juni 2027.',
    title: 'Mietpreisbremse Sachsen 2026: Dresden und Leipzig bis 2027',
    description: 'Mietpreisbremse Sachsen 2026: nur Dresden und Leipzig, Mietpreisbremse und Kappungsgrenze 15 Prozent bis 30. Juni 2027, und was danach für neue Verträge gilt.',
    h1: 'Mietpreisbremse in Sachsen: zwei Städte, eine kurze Frist',
    intro: 'Sachsen hat Mietpreisbremse und Kappungsgrenze nur für Dresden und Leipzig angeordnet und beide bis Mitte 2027 befristet.',
    resume: `Sachsen beschränkt seinen Mieterschutz auf zwei Städte. Die Sächsische Mietpreisbegrenzungsverordnung vom Dezember 2025 gilt seit dem 1. Januar 2026, die Kappungsgrenzenverordnung seit dem 1. Juli 2025, und beide enden am ${dD(vo.bis)}. Erfasst sind nur die Landeshauptstadt Dresden und die Stadt Leipzig. Dort gilt bei neuen Verträgen die Mietpreisbremse, also höchstens die Vergleichsmiete plus zehn Prozent, und bei Mieterhöhungen die Kappungsgrenze von 15 Prozent in drei Jahren. Chemnitz, Zwickau und alle anderen Gemeinden sind nicht erfasst. Die kurze Laufzeit bis Mitte 2027 ist eine Besonderheit: Das Bundesrecht erlaubt bis Ende 2029. Ob Sachsen verlängert, war im Oktober 2026 nicht entschieden. Für Dresden ergibt eine angenommene Vergleichsmiete von ${eD(7.9)} bei 70 m² eine Grenze von ${eD(mpb.zulaessig)}; ein Vertrag über ${eD(680, 0)} läge ${eD(mpb.ueberMonat)} darüber. Ein Leipziger Vertrag vom 15. Juli 2027 fiele ${juli27.mpb ? 'noch' : 'nach heutigem Stand nicht mehr'} unter die Bremse.`,
    faqs: [
      { q: 'Gilt die Mietpreisbremse in Chemnitz?', a: `${chemnitz.gefunden ? 'Ja.' : 'Nein.'} Sachsen hat nur Dresden und Leipzig in seine Verordnungen aufgenommen. In Chemnitz, Zwickau, Görlitz und allen übrigen sächsischen Gemeinden gilt bei Vertragsschluss keine Grenze aus § 556d BGB, und Mieterhöhungen dürfen bis zu 20 Prozent in drei Jahren betragen, aber nie über die ortsübliche Vergleichsmiete hinaus.` },
      { q: 'Was gilt für eine Leipziger Staffelmiete, deren Stufe nach Juni 2027 beginnt?', a: 'Die Mietpreisbremse gilt für jede Stufe zu dem Zeitpunkt, an dem diese fällig wird. Beginnt eine Stufe nach dem Auslaufen der Verordnung, ist sie an die Grenze nicht mehr gebunden, sofern Sachsen bis dahin nicht verlängert hat. Stufen davor bleiben gebunden; zu viel gezahlte Miete aus ihnen kann nach einer Rüge zurückgefordert werden.' },
      { q: 'Wie lange konnte man in Sachsen bisher von der Mietpreisbremse profitieren?', a: `Eine erste sächsische Mietpreisbremse galt von 2022 bis Ende 2025 und wurde nahtlos durch die heutige ersetzt. Eine sächsische Kappungsgrenzenverordnung von 2020 galt bis Mitte 2025; die heutige läuft seit dem ${dD(kap.inKraft)}. Wer einen Vertrag aus diesen Jahren hat, prüft im Mietcheck mit seinem Vertragsdatum.` },
    ],
    body: (h) => `
<h2>Zwei Verordnungen für zwei Städte</h2>
<p>Die ${h.ext(vo.url, 'Sächsische Mietpreisbegrenzungsverordnung')} (SächsGVBl. 2025 Nr. 17) stützt sich auf ${h.src('bgb556d', '§ 556d Abs. 2 BGB')}, die Kappungsgrenzenverordnung (SächsGVBl. 2025 Nr. 8) auf ${h.src('bgb558', '§ 558 Abs. 3 BGB')}. Beide nennen dieselben zwei Städte und laufen gleichzeitig aus. Eine Verordnung zur verlängerten Kündigungssperrfrist nach Umwandlung haben wir für Sachsen nicht ausgewertet. Für die Vergleichsmiete selbst haben beide Städte qualifizierte Mietspiegel, die auf eigenen Seiten erklärt sind: ${h.a('mietspiegel-dresden', 'Mietspiegel Dresden')} und ${h.a('mietspiegel-leipzig', 'Mietspiegel Leipzig')}.</p>
${h.table(['Regel', 'Dresden', 'Leipzig', 'übriges Sachsen'], [
  ['Mietpreisbremse', `bis ${h.date(vo.bis)}`, `bis ${h.date(vo.bis)}`, 'nein'],
  ['Kappungsgrenze', `15 % bis ${h.date(kap.bis)}`, `15 % bis ${h.date(kap.bis)}`, '20 %'],
], `Sachsen, Stand ${h.date('2026-10-12')}`, ['l', 'l', 'l', 'l'])}
<h2>Dresden als Beispiel</h2>
<p>Eine Mieterhöhung von ${h.eur(D.alt, 0)} auf ${h.eur(D.verlangt, 0)} für 70 m² lässt die Kappungsgrenze nur bis ${h.eur(erh.zulaessig, 2)} zu, wenn das Schreiben vor dem Ablauf ankommt. Kommt es nach dem 30. Juni 2027 und hat Sachsen nicht verlängert, rechnet der Mietcheck mit 20 Prozent. Zu viel gezahlte Miete bei Vertragsbeginn fordern Sie mit einer ${h.a('mietpreisbremse-ruege', 'Rüge')} zurück, auch nach dem Auslaufen der Verordnung.</p>
`,
  },
  en: {
    slug: 'rent-brake-saxony',
    nav: 'Rent brake Saxony',
    card: 'Only Dresden and Leipzig, limited to the end of June 2027.',
    title: 'Rent Brake Saxony 2026: Dresden and Leipzig until 2027',
    description: 'Rent brake in Saxony 2026: only Dresden and Leipzig, rent brake and 15 per cent cap until 30 June 2027, and what applies to new leases after that date.',
    h1: 'The rent brake in Saxony: two cities, a short deadline',
    intro: 'Saxony applies the rent brake and the cap only to Dresden and Leipzig, both limited to mid-2027.',
    resume: `Saxony limits its tenant protection to two cities. The Saxon rent ordinance of December 2025 has applied since 1 January 2026, the cap ordinance since 1 July 2025, and both end on ${dE(vo.bis)}. Only the state capital Dresden and the city of Leipzig are covered. There the rent brake (Mietpreisbremse) applies to new leases, at most the reference rent plus ten per cent, and the 15 per cent cap over three years to increases. Chemnitz, Zwickau and all other municipalities are not covered. The short term to mid-2027 is unusual: federal law allows until the end of 2029. Whether Saxony will extend had not been decided in October 2026. For Dresden, an assumed reference rent of ${eE(7.9)} for 70 m² gives a ceiling of ${eE(mpb.zulaessig)}; a lease at ${eE(680, 0)} would be ${eE(mpb.ueberMonat)} above it. A Leipzig lease of 15 July 2027 would ${juli27.mpb ? 'still' : 'on current law no longer'} be covered.`,
    faqs: [
      { q: 'Does the rent brake apply in Chemnitz?', a: `${chemnitz.gefunden ? 'Yes.' : 'No.'} Saxony only listed Dresden and Leipzig. In Chemnitz, Zwickau, Görlitz and all other Saxon municipalities there is no ceiling under Section 556d of the Civil Code at signing, and increases may reach 20 per cent in three years, but never above the local reference rent.` },
      { q: 'What applies to a Leipzig graduated rent with a step after June 2027?', a: 'The rent brake applies to each step at the time it falls due. If a step starts after the ordinance has expired, it is no longer bound by the ceiling, unless Saxony has extended it by then. Earlier steps stay bound, and overpaid rent from them can be reclaimed after a complaint.' },
      { q: 'How long has the rent brake applied in Saxony so far?', a: `A first Saxon rent brake applied from 2022 to the end of 2025 and was replaced without a gap by the current one. A Saxon cap ordinance of 2020 applied until mid-2025; the current one has run since ${dE(kap.inKraft)}. If your lease dates from those years, check it in the rent check with its date.` },
    ],
    body: (h) => `
<h2>Two ordinances for two cities</h2>
<p>The ${h.ext(vo.url, 'Saxon rent ordinance')} (SächsGVBl. 2025 No. 17) rests on ${h.src('bgb556d', 'Section 556d(2) of the Civil Code')}, the cap ordinance (SächsGVBl. 2025 No. 8) on ${h.src('bgb558', 'Section 558(3)')}. Both name the same two cities and expire together. We have not reviewed a Saxon ordinance on a longer notice ban after conversion. For the reference rent itself, both cities have qualified rent indexes explained on their own pages: ${h.a('mietspiegel-dresden', 'Dresden rent index')} and ${h.a('mietspiegel-leipzig', 'Leipzig rent index')}.</p>
${h.table(['Rule', 'Dresden', 'Leipzig', 'rest of Saxony'], [
  ['rent brake', `until ${h.date(vo.bis)}`, `until ${h.date(vo.bis)}`, 'no'],
  ['increase cap', `15% until ${h.date(kap.bis)}`, `15% until ${h.date(kap.bis)}`, '20%'],
], `Saxony as of ${h.date('2026-10-12')}`, ['l', 'l', 'l', 'l'])}
<h2>Dresden as an example</h2>
<p>For an increase from ${h.eur(D.alt, 0)} to ${h.eur(D.verlangt, 0)} on 70 m², the cap allows only ${h.eur(erh.zulaessig, 2)} if the letter arrives before expiry. If it arrives after 30 June 2027 and Saxony has not extended, the rent check uses 20 per cent. Overpaid starting rent is reclaimed with a ${h.a('mietpreisbremse-ruege', 'complaint')}, even after the ordinance has expired.</p>
`,
  },
});
