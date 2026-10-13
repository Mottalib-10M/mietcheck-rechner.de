import { defineGuide } from '../../lib/guide-types';
import { status } from '../../lib/engine/gebiet';
import { stadtDaten, faktenTabelle, offiziell } from '../../lib/stadt-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Valeur supposée tirée du Mietspiegelrechner officiel : 13,90 €/m² pour 60 m², loyer convenu 960 €.
const D = stadtDaten('stuttgart', 13.9, 60, 960);
const { S, st, mpb, erh } = D;
const jan27 = status('BW', 'Stuttgart', '2027-01-15');
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietspiegel-stuttgart',
  group: 'staedte',
  order: 60,
  tool: 'stadt',
  ort: 'stuttgart',
  related: ['mpb-bw', 'mieterhoehung-rechner', 'mietpreisbremse-rechner', 'qualifizierter-mietspiegel', 'kappungsgrenze'],
  sources: ['bgb558d', 'bgb558', 'bgb556d'],
  de: {
    slug: 'mietspiegel-stuttgart',
    nav: 'Mietspiegel Stuttgart',
    card: 'Mietspiegel 2025/2026 bis Jahresende, Landesverordnung ebenso.',
    title: 'Mietspiegel Stuttgart 2026: Vergleichsmiete bis Jahresende',
    description: 'Mietspiegel Stuttgart 2026: der qualifizierte Mietspiegel 2025/2026 und die Verordnung von Baden-Württemberg enden am 31. Dezember: was das für Ihre Miete heißt',
    h1: 'Mietspiegel Stuttgart: was bis Ende 2026 gilt und was danach kommt',
    intro: 'Mietspiegel und Landesverordnung laufen in Stuttgart gleichzeitig aus; der Mietcheck prüft das Datum Ihres Vertrags.',
    resume: `Der qualifizierte Mietspiegel 2025/2026 der Landeshauptstadt Stuttgart gilt vom ${dD(S.gueltigAb!)} bis zum ${dD(S.gueltigBis!)}. Das Statistische Amt und das Amt für Stadtplanung und Wohnen haben ihn aus einer eigenen Wohnungsmarktbefragung vom April 2024 erstellt, gemeinsam mit Haus und Grund und dem Mieterverein; der Gemeinderat hat ihn im Dezember 2024 anerkannt. Er ist ein Regressionsmietspiegel: Eine Basismiete nach Wohnfläche und Baujahr wird mit Zu- und Abschlägen angepasst, und für die Lage teilt die Stadt ihr Gebiet in Nord, Mitte, Filder und Neckar mit je drei Stufen ein. Die Stadt untersagt ausdrücklich, die Daten ohne Genehmigung elektronisch zu speichern und anzubieten. Deshalb nennt dieser Rechner keine Werte; Sie ermitteln sie im Mietspiegelrechner der Stadt. Auch die baden-württembergische Verordnung, die Stuttgart Mietpreisbremse und 15 Prozent Kappungsgrenze bringt, endet am ${dD(st.mpbBis!)}; Entwürfe für 2027 lagen im Herbst 2026 vor, waren aber noch nicht verkündet.`,
    faqs: [
      { q: 'Welcher Mietspiegel gilt in Stuttgart ab Januar 2027?', a: 'Der Mietspiegel 2025/2026 gilt bis zum 31. Dezember 2026. Die Stadt erstellt ihren Mietspiegel alle zwei Jahre; für 2027 und 2028 ist eine neue Ausgabe zu erwarten. Solange sie nicht veröffentlicht ist, darf ein Vermieter sich nach § 558a Abs. 4 BGB auch auf einen veralteten Mietspiegel stützen. Der Mietcheck rechnet mit dem Wert, den Sie eintragen.' },
      { q: 'Was passiert mit der Mietpreisbremse in Stuttgart nach dem Jahreswechsel?', a: `Nach den heute verkündeten Verordnungen gilt sie für Verträge bis zum ${dD(st.mpbBis!)}; ein Vertrag vom 15. Januar 2027 fiele ${jan27.mpb ? 'noch' : 'nicht mehr'} darunter. Die Landesregierung hat im September 2026 Entwürfe für Nachfolgeverordnungen in die Anhörung gegeben. Sobald sie im Gesetzblatt stehen, übernimmt der Rechner sie.` },
      { q: 'Wie viel darf eine Stuttgarter Miete bei einer Erhöhung steigen?', a: `Bis Ende 2026 höchstens 15 Prozent in drei Jahren und nie über die Vergleichsmiete. Wer 60 m² für ${eD(D.mieteAlt, 0)} mietet und laut städtischem Rechner eine Vergleichsmiete von ${eD(13.9)} hat, muss höchstens ${eD(erh.zulaessig)} zustimmen, nicht ${eD(D.verlangt, 0)}. Ohne neue Kappungsgrenzenverordnung gälten ab 2027 wieder 20 Prozent.` },
    ],
    body: (h) => `
<h2>Wie Stuttgart seinen Mietspiegel erstellt</h2>
<p>Stuttgart erhebt die Daten selbst. Das Statistische Amt befragt Haushalte zu Miete und Wohnung, das Amt für Stadtplanung und Wohnen begleitet die Auswertung, und Vermieter- wie Mieterverband sind beteiligt. Daraus entsteht ein Rechenmodell mit einer Basismiete und Zu- und Abschlägen, die in der Broschüre und im Methodenbericht beschrieben sind. Für die Lage gibt es eine Karte mit zwölf Zonen: vier Stadtbereiche mit je drei Qualitätsstufen. Die gedruckte Broschüre kostet eine Schutzgebühr, das PDF ist kostenlos.</p>
${faktenTabelle(S, st, h)}
<h2>Mit dem städtischen Wert weiterrechnen</h2>
<p>Im ${offiziell(S, h, 'Mietspiegelrechner der Stadt Stuttgart')} geben Sie Adresse, Fläche, Baujahr und Ausstattung ein und erhalten die Vergleichsmiete je Quadratmeter. Diesen Wert tragen Sie in den Mietcheck ein. Bei einem neuen Vertrag über 60 m² mit der Beispielannahme von ${h.eur(13.9, 2)} liegt die Grenze der Mietpreisbremse bei ${h.eur(mpb.zulaessig, 2)}; bei ${h.eur(960, 0)} wären ${h.eur(mpb.ueberMonat, 2)} monatlich zu viel. Wer im Dezember 2026 unterschreibt, ist noch geschützt, wer im Januar 2027 unterschreibt, nur, wenn bis dahin eine neue Verordnung in Kraft ist.</p>
<p>Welche Gemeinden in Baden-Württemberg die Verordnung heute erfasst und welche 2026 herausgefallen sind, zeigt die Seite ${h.a('mpb-bw', 'Mietpreisbremse Baden-Württemberg')}.</p>
`,
  },
  en: {
    slug: 'stuttgart-rent-index',
    nav: 'Stuttgart rent index',
    card: '2025/2026 index to year end, and the state ordinance too.',
    title: 'Stuttgart Rent Index 2026: Reference Rent until Year End',
    description: 'Stuttgart rent index 2026: the qualified 2025/2026 index and the Baden-Württemberg ordinance both end on 31 December, and what that means for your rent.',
    h1: 'Stuttgart rent index: what applies until the end of 2026 and after',
    intro: 'In Stuttgart the rent index and the state ordinance expire together; the rent check tests the date of your lease.',
    resume: `Stuttgart's qualified 2025/2026 rent index runs from ${dE(S.gueltigAb!)} to ${dE(S.gueltigBis!)}. The city's statistics office and its planning and housing office built it from their own housing survey of April 2024, together with the homeowners' association Haus und Grund and the tenants' association; the city council recognised it in December 2024. It is a regression index: a base rent by floor area and year built is adjusted by premiums and deductions, and for location the city divides its territory into North, Centre, Filder and Neckar, each with three grades. The city expressly forbids storing and offering the data electronically without permission, so this calculator gives no figures; you get them from the city's rent index tool. The Baden-Württemberg ordinance that gives Stuttgart the rent brake and the 15 per cent cap also ends on ${dE(st.mpbBis!)}; drafts for 2027 existed in autumn 2026 but had not been published as law.`,
    faqs: [
      { q: 'Which rent index applies in Stuttgart from January 2027?', a: 'The 2025/2026 index applies until 31 December 2026. The city produces its index every two years, so a new edition for 2027 and 2028 can be expected. Until it is published, Section 558a(4) of the Civil Code lets a landlord rely on an outdated index too. The rent check uses whatever value you enter.' },
      { q: 'What happens to the rent brake in Stuttgart after New Year?', a: `Under the ordinances published today it covers leases signed up to ${dE(st.mpbBis!)}; a lease of 15 January 2027 would ${jan27.mpb ? 'still' : 'no longer'} be covered. The state government sent drafts of successor ordinances out for consultation in September 2026. Once they appear in the official gazette, the calculator will include them.` },
      { q: 'How far may a Stuttgart rent rise in an increase?', a: `Until the end of 2026, by at most 15 per cent in three years and never above the reference rent. If you rent 60 m² for ${eE(D.mieteAlt, 0)} and the city tool gives a reference rent of ${eE(13.9)}, you need agree to at most ${eE(erh.zulaessig)}, not ${eE(D.verlangt, 0)}. Without a new cap ordinance, 20 per cent would apply again from 2027.` },
    ],
    body: (h) => `
<h2>How Stuttgart builds its index</h2>
<p>Stuttgart collects the data itself. The statistics office surveys households about their rent and flat, the planning and housing office oversees the analysis, and both landlord and tenant associations take part. The result is a model with a base rent and premiums and deductions described in the brochure and the methods report. For location there is a map with twelve zones: four parts of the city with three quality grades each. The printed brochure costs a small fee, the PDF is free.</p>
${faktenTabelle(S, st, h)}
<h2>Working with the city’s figure</h2>
<p>In the ${offiziell(S, h, 'City of Stuttgart rent index tool')} you enter address, floor area, year built and fittings and get the reference rent per square metre. Enter that figure in the rent check. For a new 60 m² lease, with the example assumption of ${h.eur(13.9, 2)}, the rent-brake ceiling is ${h.eur(mpb.zulaessig, 2)}; at ${h.eur(960, 0)}, ${h.eur(mpb.ueberMonat, 2)} a month would be too much. Anyone signing in December 2026 is still protected; anyone signing in January 2027 only if a new ordinance is in force by then.</p>
<p>Which Baden-Württemberg municipalities the ordinance covers today, and which dropped out in 2026, is on the ${h.a('mpb-bw', 'rent brake in Baden-Württemberg')} page.</p>
`,
  },
});
