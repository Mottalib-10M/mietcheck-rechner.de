import { defineGuide } from '../../lib/guide-types';
import { status } from '../../lib/engine/gebiet';
import { landDaten, gemeindeTabelle } from '../../lib/land-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Exemple : Wiesbaden, valeur de référence supposée 11,20 €/m², 75 m², loyer convenu 960 €, contrat le 1.10.2026.
const D = landDaten('HE', 'Wiesbaden', 11.2, 75, 960);
const { L, st, mpb, erh } = D;
const vo = L.mpb!;
const dez = status('HE', 'Wiesbaden', '2026-12-01');
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mpb-he',
  group: 'laender',
  order: 40,
  tool: 'land',
  ort: 'HE',
  related: ['mietspiegel-frankfurt', 'mietpreisbremse-ruege', 'mietpreisbremse', 'kappungsgrenze', 'mpb-rp'],
  sources: ['bgb556d', 'bgb558', 'bgb577a'],
  de: {
    slug: 'mietpreisbremse-hessen',
    nav: 'Mietpreisbremse Hessen',
    card: `${D.nMpb} Gemeinden, Verordnung endet am 25. November 2026.`,
    title: 'Mietpreisbremse Hessen 2026: Gemeinden und Ende im November',
    description: `Mietpreisbremse Hessen 2026: ${D.nMpb} Gemeinden von Bad Homburg bis Wiesbaden, Kappungsgrenze 15 Prozent, acht Jahre Kündigungssperre, alles bis 25. November 2026.`,
    h1: 'Mietpreisbremse in Hessen: was bis zum 25. November 2026 gilt',
    intro: 'Hessens Mieterschutzverordnung läuft Ende November 2026 aus; eine Nachfolge ist angekündigt, aber noch nicht verkündet.',
    resume: `Hessen regelt Mietpreisbremse, Kappungsgrenze und Kündigungssperrfrist in einer gemeinsamen Mieterschutzverordnung vom 18. November 2020. Eine Änderung vom November 2025 hat sie bei unveränderter Gemeindeliste bis zum ${dD(vo.bis)} verlängert. Erfasst sind ${D.nMpb} ganze Gemeinden, vor allem im Rhein-Main-Gebiet: Frankfurt am Main, Wiesbaden, Darmstadt, Offenbach, Bad Homburg und viele Städte im Taunus und in den Kreisen Groß-Gerau und Offenbach, dazu Marburg und Fuldabrück bei Kassel. In ihnen gilt bei neuen Verträgen die Mietpreisbremse, bei Erhöhungen die Kappungsgrenze von 15 Prozent und nach einer Umwandlung in Eigentum eine Kündigungssperre von acht Jahren. Nach Presseberichten vom September 2026 bereitet die Landesregierung eine neue Verordnung für 71 Kommunen vor, über die sie Mitte November entscheiden will; verkündet ist sie noch nicht. Beispiel Wiesbaden: Mit einer angenommenen Vergleichsmiete von ${eD(11.2)} für 75 m² darf ein Vertrag vom Oktober 2026 höchstens ${eD(mpb.zulaessig)} kalt kosten; ein Vertrag vom 1. Dezember 2026 fiele ${dez.mpb ? 'trotzdem' : 'nach heutigem Stand nicht mehr'} darunter.`,
    faqs: [
      { q: 'Was passiert mit meiner Miete, wenn die hessische Verordnung ausläuft?', a: 'Für einen laufenden Vertrag, der während der Verordnung geschlossen wurde, bleibt die Mietpreisbremse für die Anfangsmiete maßgeblich; zu viel gezahlte Miete können Sie weiter rügen. Was sich ändert: Für neue Verträge ab dem 26. November 2026 gilt keine Grenze, und Mieterhöhungen sind wieder bis 20 Prozent in drei Jahren möglich, falls keine Nachfolgeverordnung in Kraft tritt.' },
      { q: 'Welche hessischen Städte sollen neu in die Mietpreisbremse kommen?', a: 'Das steht erst fest, wenn die neue Verordnung verkündet ist. Nach Presseberichten umfasst der Entwurf 71 Kommunen statt 49. Welche das sind, kann sich in der Anhörung noch ändern. Der Mietcheck rechnet nur mit verkündeten Verordnungen und übernimmt die neue Liste mit ihrem Datum, sobald sie im Gesetz- und Verordnungsblatt steht.' },
      { q: 'Gilt die Mietpreisbremse in Kassel?', a: `Nein. Kassel steht nicht in der hessischen Verordnung, wohl aber die Nachbargemeinde Fuldabrück. Für Kassel gilt daher weder die Mietpreisbremse noch die abgesenkte Kappungsgrenze; Mieterhöhungen sind bis 20 Prozent in drei Jahren zulässig. Der Mietcheck zeigt das, wenn Sie Hessen wählen und Kassel als Gemeinde eintragen.` },
    ],
    body: (h) => `
<h2>Die Mieterschutzverordnung von 2020 und ihre Verlängerung</h2>
<p>Die ${h.ext(vo.url, 'hessische Mieterschutzverordnung')} bündelt seit 2020 die Gebietsbestimmungen nach ${h.src('bgb556d', '§ 556d Abs. 2')}, ${h.src('bgb558', '§ 558 Abs. 3')} und ${h.src('bgb577a', '§ 577a Abs. 2 BGB')}. Seit 2020 erfasst sie ganze Gemeinden, keine einzelnen Stadtteile mehr. Die Änderung vom 12. November 2025, in Kraft seit dem 18. November 2025, hat nur die Laufzeit verlängert. Weil das Ende so nah ist, prüft der Mietcheck bei Hessen besonders genau das Datum: bei neuen Verträgen den Tag des Vertragsschlusses, bei Erhöhungen den Tag, an dem das Schreiben ankommt.</p>
<h2>Wiesbaden als Beispiel</h2>
<p>Ein Vertrag über 75 m² zu ${h.eur(960, 0)} vom Oktober 2026: Die Grenze liegt mit der angenommenen Vergleichsmiete von ${h.eur(11.2, 2)} bei ${h.eur(mpb.zulaessig, 2)}, die Miete ${h.eur(mpb.ueberMonat, 2)} darüber. Wer innerhalb von 30 Monaten rügt, bekommt die Überzahlung seit Vertragsbeginn zurück, auch wenn die Verordnung inzwischen ausgelaufen ist; wie das geht, erklärt die Seite zur ${h.a('mietpreisbremse-ruege', 'Rüge')}. Eine Erhöhung von ${h.eur(D.alt, 0)} auf ${h.eur(D.verlangt, 0)}, die vor dem Ablauf zugeht, ist auf ${h.eur(erh.zulaessig, 2)} gedeckelt.</p>
<h2>Alle Gemeinden der Verordnung</h2>
${gemeindeTabelle(vo, h, `Hessische Mieterschutzverordnung in der Fassung vom November 2025: ${D.nMpb} Gemeinden`)}
`,
  },
  en: {
    slug: 'rent-brake-hesse',
    nav: 'Rent brake Hesse',
    card: `${D.nMpb} municipalities, ordinance ends on 25 November 2026.`,
    title: 'Rent Brake Hesse 2026: Municipalities and November Expiry',
    description: `Rent brake in Hesse 2026: ${D.nMpb} municipalities from Bad Homburg to Wiesbaden, a 15 per cent cap, an eight-year notice ban, all only until 25 November 2026.`,
    h1: 'The rent brake in Hesse: what applies until 25 November 2026',
    intro: 'Hesse’s tenant-protection ordinance expires at the end of November 2026; a successor has been announced but not yet published.',
    resume: `Hesse sets the rent brake, the increase cap and the notice ban in one tenant-protection ordinance (Mieterschutzverordnung) of 18 November 2020. An amendment in November 2025 extended it, with an unchanged list, until ${dE(vo.bis)}. It covers ${D.nMpb} whole municipalities, mostly in the Rhine-Main area: Frankfurt am Main, Wiesbaden, Darmstadt, Offenbach, Bad Homburg and many towns in the Taunus and the Groß-Gerau and Offenbach districts, plus Marburg and Fuldabrück near Kassel. There, the rent brake applies to new leases, a 15 per cent cap to increases and an eight-year notice ban after conversion into condominiums. According to press reports in September 2026, the state government is preparing a new ordinance for 71 municipalities, with a decision expected in mid-November; it has not been published yet. Take Wiesbaden: with an assumed reference rent of ${eE(11.2)} for 75 m², a lease signed in October 2026 may cost at most ${eE(mpb.zulaessig)} a month; a lease of 1 December 2026 would ${dez.mpb ? 'still' : 'on current law no longer'} be covered.`,
    faqs: [
      { q: 'What happens to my rent when the Hesse ordinance expires?', a: 'For a running lease signed while the ordinance applied, the rent brake remains decisive for the starting rent, and you can still complain about overpayment. What changes: new leases from 26 November 2026 have no ceiling, and increases of up to 20 per cent in three years become possible again, unless a successor ordinance takes effect.' },
      { q: 'Which Hesse towns are to be added to the rent brake?', a: 'That is only certain once the new ordinance is published. According to press reports the draft covers 71 municipalities instead of 49. Which ones may still change during consultation. The rent check only uses published ordinances and will adopt the new list with its date once it appears in the official gazette.' },
      { q: 'Does the rent brake apply in Kassel?', a: 'No. Kassel is not in the Hesse ordinance, although neighbouring Fuldabrück is. Kassel therefore has neither the rent brake nor the lowered cap; increases of up to 20 per cent in three years are lawful. The rent check shows this when you enter Kassel as your municipality and pick Hesse.' },
    ],
    body: (h) => `
<h2>The 2020 ordinance and its extension</h2>
<p>Since 2020 the ${h.ext(vo.url, 'Hesse tenant-protection ordinance')} has combined the area designations under ${h.src('bgb556d', 'Section 556d(2)')}, ${h.src('bgb558', 'Section 558(3)')} and ${h.src('bgb577a', 'Section 577a(2) of the Civil Code')}. Since 2020 it has covered whole municipalities, no longer single districts. The amendment of 12 November 2025, in force since 18 November 2025, only extended its term. Because the end is so close, the rent check watches the date carefully for Hesse: for new leases the signing date, for increases the day the letter arrives.</p>
<h2>Wiesbaden as an example</h2>
<p>A 75 m² lease at ${h.eur(960, 0)} signed in October 2026: with the assumed reference rent of ${h.eur(11.2, 2)}, the ceiling is ${h.eur(mpb.zulaessig, 2)}, and the rent is ${h.eur(mpb.ueberMonat, 2)} above it. A complaint within 30 months recovers the overpayment from the start, even if the ordinance has since expired; the ${h.a('mietpreisbremse-ruege', 'complaint')} page explains how. An increase from ${h.eur(D.alt, 0)} to ${h.eur(D.verlangt, 0)} that arrives before the expiry is capped at ${h.eur(erh.zulaessig, 2)}.</p>
<h2>Every municipality in the ordinance</h2>
${gemeindeTabelle(vo, h, `Hesse tenant-protection ordinance as amended in November 2025: ${D.nMpb} municipalities`)}
`,
  },
});
