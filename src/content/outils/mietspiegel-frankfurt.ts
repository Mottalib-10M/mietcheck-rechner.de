import { defineGuide } from '../../lib/guide-types';
import { status } from '../../lib/engine/gebiet';
import { stadtDaten, faktenTabelle, offiziell } from '../../lib/stadt-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Valeur supposée tirée du rechner officiel : 13,40 €/m² pour 68 m², loyer convenu 1 080 €.
const D = stadtDaten('frankfurt', 13.4, 68, 1080);
const { S, st, mpb, erh } = D;
const nachAblauf = status('HE', 'Frankfurt am Main', '2026-12-01');
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietspiegel-frankfurt',
  group: 'staedte',
  order: 50,
  tool: 'stadt',
  ort: 'frankfurt',
  related: ['mpb-he', 'mietpreisbremse-rechner', 'mietpreisbremse-ruege', 'mieterhoehung-rechner', 'vergleichsmiete'],
  sources: ['bgb556d', 'bgb556g', 'bgb558d'],
  de: {
    slug: 'mietspiegel-frankfurt',
    nav: 'Mietspiegel Frankfurt',
    card: 'Mietspiegel 2026 mit zehn Lagen; Hessens Verordnung läuft aus.',
    title: 'Mietspiegel Frankfurt 2026: Vergleichsmiete und neue Regeln',
    description: 'Mietspiegel Frankfurt 2026: neuer qualifizierter Mietspiegel bis Mai 2028, zehn Wohnlagen, und was das Auslaufen der hessischen Verordnung im November bedeutet.',
    h1: 'Mietspiegel Frankfurt am Main 2026: Wert ermitteln, Fristen kennen',
    intro: 'Frankfurt hat seit Juni 2026 einen neuen Mietspiegel, und die hessische Mieterschutzverordnung endet am 25. November 2026.',
    resume: `Der Frankfurter Mietspiegel 2026 gilt seit dem ${dD(S.gueltigAb!)} und läuft bis zum ${dD(S.gueltigBis!)}. Er ist ein qualifizierter Mietspiegel, den das Amt für Wohnungswesen herausgibt; wissenschaftlich bearbeitet hat ihn das Institut Wohnen und Umwelt in Darmstadt, Stichtag der Daten ist der 1. Juli 2025. Rechnerisch ist er ein Regressionsmietspiegel: Eine Basismiete nach Wohnfläche wird mit prozentualen Zu- und Abschlägen für Baujahr, Ausstattung und Wohnlage angepasst; für die Lage unterscheidet er zehn Kategorien, die ein Wohnlagenverzeichnis und eine Karte zuordnen. Die Stadt behält sich alle Rechte vor, deshalb nennt dieser Rechner keine Frankfurter Werte; den städtischen Mietspiegel-Rechner verlinken wir. Wichtig für 2026: Die hessische Mieterschutzverordnung, die Frankfurt die Mietpreisbremse und die Kappungsgrenze von 15 Prozent bringt, tritt am ${dD(st.mpbBis!)} außer Kraft. Eine neue Verordnung war im Herbst 2026 nach Presseberichten in Vorbereitung, aber noch nicht verkündet.`,
    faqs: [
      { q: 'Gilt die Mietpreisbremse in Frankfurt nach dem 25. November 2026 noch?', a: `Nach dem heutigen Stand nicht: Die hessische Verordnung tritt mit Ablauf des ${dD(st.mpbBis!)} außer Kraft, und ein Vertrag vom 1. Dezember 2026 fiele ${nachAblauf.mpb ? 'trotzdem' : 'nicht mehr'} darunter. Die Landesregierung hat eine Nachfolgeverordnung angekündigt. Sobald sie verkündet ist, tragen wir sie ein; für Verträge, die vor dem Stichtag geschlossen wurden, bleibt die Mietpreisbremse ohnehin maßgeblich.` },
      { q: 'Wie finde ich meine Wohnlage im Frankfurter Mietspiegel?', a: 'Über das Wohnlagenverzeichnis zum Mietspiegel 2026 und die zugehörige Karte, die die Stadt neben der Broschüre veröffentlicht, oder direkt im Online-Rechner der Stadt, der die Adresse abfragt. Frankfurt unterscheidet zehn Lagekategorien statt der üblichen drei; der Zu- oder Abschlag hängt an dieser Kategorie.' },
      { q: 'Wie viel kann ich in Frankfurt zurückfordern, wenn meine Miete zu hoch war?', a: `Ergibt der städtische Rechner für 68 m² etwa ${eD(13.4)} je Quadratmeter, lag die Grenze bei ${eD(mpb.zulaessig)}. Bei vereinbarten ${eD(1080, 0)} sind ${eD(mpb.ueberMonat)} im Monat zu viel. Mit einer Rüge innerhalb von 30 Monaten nach Mietbeginn bekommen Sie die Überzahlung seit Vertragsbeginn zurück; der Mietpreisbremse-Rechner zählt die Monate.` },
    ],
    body: (h) => `
<h2>Ein neuer Mietspiegel und ein auslaufender Schutz</h2>
<p>Für Frankfurter Mieter fallen 2026 zwei Daten zusammen. Am 25. Juni trat der neue Mietspiegel in Kraft, der den Mietspiegel 2024 ablöst und bis Ende Mai 2028 gilt. Und die hessische Mieterschutzverordnung, die für Frankfurt die Mietpreisbremse, die Kappungsgrenze von 15 Prozent und eine verlängerte Kündigungssperrfrist nach Umwandlung in Eigentum regelt, endet im November. Wer jetzt eine Wohnung sucht, sollte den Vertragsschluss im Blick behalten: Maßgeblich ist der Tag, an dem der Vertrag geschlossen wird. Ob und mit welchen Gemeinden eine Nachfolgeverordnung kommt, entscheidet die Landesregierung.</p>
${faktenTabelle(S, st, h)}
<h2>Rechnen mit dem Frankfurter Wert</h2>
<p>Den Wert für Ihre Wohnung ermitteln Sie im ${offiziell(S, h, 'Mietspiegel-Rechner der Stadt Frankfurt')}. Der Mietcheck oben verbindet ihn mit den hessischen Regeln. Für eine Mieterhöhung gilt bis zum Ablauf der Verordnung die abgesenkte Kappungsgrenze: Bei ${h.eur(D.mieteAlt, 0)} bisheriger Miete und 68 m² sind höchstens ${h.eur(erh.zulaessig, 2)} zulässig, statt der ${h.eur(D.verlangt, 0)}, die die Vergleichsmiete erlauben würde. Danach gälten 20 Prozent, sofern keine neue Verordnung kommt.</p>
<p>Die Liste aller hessischen Gemeinden und die Einzelheiten zur Verordnung stehen auf der Seite ${h.a('mpb-he', 'Mietpreisbremse Hessen')}. Wie eine Rüge aussieht und warum die Frist von 30 Monaten zählt, erklärt die Seite zur ${h.a('mietpreisbremse-ruege', 'Rüge')}.</p>
`,
  },
  en: {
    slug: 'frankfurt-rent-index',
    nav: 'Frankfurt rent index',
    card: '2026 index with ten locations; Hesse’s ordinance is expiring.',
    title: 'Frankfurt Rent Index 2026: Reference Rent and Expiring Rules',
    description: 'Frankfurt rent index 2026: new qualified index valid until May 2028, ten location categories, and what the end of the Hesse ordinance in November means for you.',
    h1: 'Frankfurt rent index 2026: find your figure, know the dates',
    intro: 'Frankfurt has a new rent index since June 2026, and Hesse’s tenant-protection ordinance ends on 25 November 2026.',
    resume: `Frankfurt's 2026 rent index (Frankfurter Mietspiegel) has applied since ${dE(S.gueltigAb!)} and runs until ${dE(S.gueltigBis!)}. It is a qualified index published by the city's housing office; the Institute for Housing and Environment in Darmstadt did the scientific work, and the data refer to 1 July 2025. Technically it is a regression index: a base rent by floor area is adjusted by percentage premiums and deductions for year built, fittings and location, and for location it distinguishes ten categories assigned by an official directory and map. The city reserves all rights, so this calculator gives no Frankfurt figures; we link the city's own tool. What matters in 2026: Hesse's tenant-protection ordinance, which gives Frankfurt the rent brake and the 15 per cent cap, expires on ${dE(st.mpbBis!)}. According to press reports a successor was being prepared in autumn 2026, but none had been published yet.`,
    faqs: [
      { q: 'Does the rent brake still apply in Frankfurt after 25 November 2026?', a: `On current law, no: Hesse’s ordinance expires at the end of ${dE(st.mpbBis!)}, and a lease signed on 1 December 2026 would ${nachAblauf.mpb ? 'still' : 'no longer'} be covered. The state government has announced a successor. We will add it once it is published; for leases signed before the cut-off date, the rent brake remains decisive anyway.` },
      { q: 'How do I find my location category in the Frankfurt index?', a: 'Through the location directory for the 2026 index and its map, which the city publishes next to the brochure, or directly in the city’s online tool, which asks for the address. Frankfurt uses ten location categories instead of the usual three, and the premium or deduction depends on that category.' },
      { q: 'How much can I reclaim in Frankfurt if my rent was too high?', a: `If the city’s tool gives, say, ${eE(13.4)} per square metre for 68 m², the ceiling was ${eE(mpb.zulaessig)}. At an agreed ${eE(1080, 0)}, ${eE(mpb.ueberMonat)} a month is too much. With a complaint within 30 months of the start you recover the overpayment from the first day; the rent brake calculator counts the months.` },
    ],
    body: (h) => `
<h2>A new index and expiring protection</h2>
<p>For Frankfurt tenants two dates meet in 2026. On 25 June the new rent index took effect, replacing the 2024 index and running until the end of May 2028. And Hesse's tenant-protection ordinance, which gives Frankfurt the rent brake, the 15 per cent cap and a longer notice ban after conversion into condominiums, ends in November. If you are looking for a flat now, watch the signing date: what counts is the day the lease is concluded. Whether a successor ordinance comes, and for which municipalities, is for the state government to decide.</p>
${faktenTabelle(S, st, h)}
<h2>Calculating with the Frankfurt figure</h2>
<p>Get the value for your flat from the ${offiziell(S, h, 'City of Frankfurt rent index tool')}. The rent check above combines it with Hesse's rules. Until the ordinance expires, the lowered cap applies to increases: with a current rent of ${h.eur(D.mieteAlt, 0)} and 68 m², at most ${h.eur(erh.zulaessig, 2)} is lawful instead of the ${h.eur(D.verlangt, 0)} the reference rent would allow. After that, 20 per cent would apply unless a new ordinance follows.</p>
<p>The list of all Hesse municipalities and the ordinance details are on the ${h.a('mpb-he', 'rent brake in Hesse')} page. What a complaint looks like and why the 30-month limit matters is on the ${h.a('mietpreisbremse-ruege', 'complaint')} page.</p>
`,
  },
});
