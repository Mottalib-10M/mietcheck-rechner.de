import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { kuendigung } from '../../lib/engine/miete';
import { displayDate } from '../../lib/format';

const K = P.kuendigung;
// Exemples : réception le 4.11.2026 (3e jour ouvrable), le 5.11.2026 ; bailleur, remise des clés 2019 et 2016.
const a = kuendigung({ zugang: '2026-11-04', partei: 'mieter', land: 'BE' });
const b = kuendigung({ zugang: '2026-11-05', partei: 'mieter', land: 'BE' });
const v6 = kuendigung({ zugang: '2026-11-03', partei: 'vermieter', ueberlassen: '2019-04-01', land: 'BE' });
const v9 = kuendigung({ zugang: '2026-11-03', partei: 'vermieter', ueberlassen: '2016-04-01', land: 'BE' });
const okt = kuendigung({ zugang: '2026-10-03', partei: 'mieter', land: 'BE' });
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'kuendigungsfrist-rechner',
  group: 'rechner',
  order: 70,
  tool: 'kuendigung',
  related: ['eigenbedarfskuendigung', 'kaution-zurueck', 'staffelmiete', 'mietkaution'],
  sources: ['bgb573c', 'bgb573', 'bgb568', 'bgb557a'],
  de: {
    slug: 'kuendigungsfrist-mietvertrag',
    nav: 'Kündigungsfrist Mietvertrag',
    card: 'Letzter Tag der Miete, je nach Zugang und Mietdauer.',
    title: 'Kündigungsfrist Mietvertrag 2026: Enddatum genau berechnen',
    description: 'Kündigungsfrist im Mietvertrag 2026: drei Monate für Mieter, drei, sechs oder neun für Vermieter, Zugang bis zum dritten Werktag, Samstag und Landesfeiertage.',
    h1: 'Kündigungsfrist im Mietvertrag: Wann endet Ihre Miete?',
    intro: 'Wer kündigt, wann kommt das Schreiben an und seit wann wohnen Sie dort: Daraus folgt der letzte Tag des Mietverhältnisses.',
    resume: `Die ordentliche Kündigung eines unbefristeten Mietvertrags über Wohnraum ist spätestens am dritten Werktag eines Monats zum Ablauf des übernächsten Monats zulässig (§ 573c BGB). Für Mieter sind das immer ${K.mieter_monate} Monate, gleich wie lange sie schon dort wohnen. Für Vermieter verlängert sich die Frist nach fünf und nach acht Jahren seit der Überlassung um jeweils drei Monate, auf sechs und neun Monate. Maßgeblich ist der Zugang beim Empfänger. Der Samstag zählt als Werktag (BGH, Urteil vom 27. April 2005, VIII ZR 206/04), Sonntage und Feiertage nicht; deshalb fragt der Rechner nach Ihrem Bundesland. Ein Beispiel aus Berlin: Kommt Ihre Kündigung am 4. November 2026 an, dem dritten Werktag, endet das Mietverhältnis am ${dD(a.ende)}. Kommt sie am 5. November, endet es erst am ${dD(b.ende)}. Kündigt der Vermieter einer Wohnung, die seit April 2019 überlassen ist, gelten sechs Monate bis zum ${dD(v6.ende)}.`,
    faqs: [
      { q: 'Zählt der Samstag bei der Kündigungsfrist als Werktag?', a: `Ja. Der Bundesgerichtshof hat entschieden, dass der Sonnabend bei den drei Werktagen der Kündigungsfrist mitzählt (VIII ZR 206/04). Im Oktober 2026 fällt der 3. Oktober als Feiertag aus: Der dritte Werktag ist ${dD(okt.stichtag)}. Fällt der dritte Werktag selbst auf einen Samstag, hat der BGH offengelassen, ob die Frist sich auf Montag verschiebt; der Rechner rät dann zum Zugang bis Freitag.` },
      { q: 'Gilt die längere Frist auch, wenn ich als Mieter kündige?', a: `Nein. Die Verlängerung auf sechs und neun Monate gilt nur für den Vermieter. Mieter kündigen immer mit ${K.mieter_monate} Monaten, auch nach zwanzig Jahren in der Wohnung. Eine Klausel im Vertrag, die dem Mieter eine längere Frist auferlegt, ist unwirksam. Ein befristeter Kündigungsverzicht ist bei einer Staffelmiete für höchstens vier Jahre ab Vereinbarung möglich.` },
      { q: 'Muss die Kündigung des Mietvertrags unterschrieben sein?', a: 'Ja. Die Kündigung eines Wohnraummietvertrags braucht nach § 568 BGB die Schriftform, also ein eigenhändig unterschriebenes Schreiben; eine E-Mail oder eine Nachricht im Mieterportal genügt nicht. Bei mehreren Mietern müssen alle unterschreiben, bei mehreren Vermietern muss die Kündigung allen zugehen. Den Zugang beweisen Sie am sichersten mit Boten oder Einwurf vor Zeugen.' },
    ],
    body: (h) => `
<h2>So rechnet der Rechner</h2>
<p>Er sucht im Monat des Zugangs den dritten Werktag: Montag bis Samstag zählen, Sonntage und Feiertage nicht. Neben den bundesweiten Feiertagen berücksichtigt er die Feiertage Ihres Landes, die in die ersten Tage eines Monats fallen können, etwa den 6. Januar in Bayern, Baden-Württemberg und Sachsen-Anhalt oder den 1. November in Nordrhein-Westfalen. Kommt die Kündigung bis zu diesem Tag an, zählt der laufende Monat mit; sonst beginnt die Frist im Folgemonat. Das Ende ist der letzte Tag des Monats, in dem die Frist abläuft. Für den Vermieter zählt er die Jahre seit der Überlassung der Wohnung, also seit dem Einzug, nicht seit Vertragsunterschrift.</p>
${h.table(['Fall', 'Frist', 'Ende'], [
  ['Mieter, Zugang 4. November 2026', `${a.monate} Monate`, h.date(a.ende)],
  ['Mieter, Zugang 5. November 2026', `${b.monate} Monate`, h.date(b.ende)],
  ['Vermieter, Wohnung seit April 2019', `${v6.monate} Monate`, h.date(v6.ende)],
  ['Vermieter, Wohnung seit April 2016', `${v9.monate} Monate`, h.date(v9.ende)],
], 'Kündigungsfristen nach § 573c BGB, Feiertage Berlin', ['l', 'r', 'r'])}
<h2>Was der Rechner nicht prüft</h2>
<p>Ob eine Kündigung des Vermieters überhaupt zulässig ist, steht nicht in ${h.src('bgb573c', '§ 573c')}, sondern in ${h.src('bgb573', '§ 573 BGB')}: Er braucht ein berechtigtes Interesse, etwa Eigenbedarf, und muss die Gründe im Schreiben angeben. Die Seite zur ${h.a('eigenbedarfskuendigung', 'Eigenbedarfskündigung')} erklärt Voraussetzungen, Widerspruch und Sperrfristen. Für möblierte Zimmer in der Wohnung des Vermieters und für Wohnraum zum vorübergehenden Gebrauch gelten kürzere Fristen; diese Fälle bildet der Rechner nicht ab.</p>
`,
  },
  en: {
    slug: 'notice-period-calculator',
    nav: 'Notice period calculator',
    card: 'Last day of the tenancy, by date of receipt and length of stay.',
    title: 'Notice Period Calculator Germany 2026: Tenancy End Date',
    description: 'Notice period for a German lease in 2026: three months for tenants, three, six or nine for landlords, delivery by the third working day, state holidays.',
    h1: 'Notice period calculator: when does your tenancy end?',
    intro: 'Who gives notice, when the letter arrives and how long you have lived there decide the last day of the tenancy.',
    resume: `Ordinary notice on an open-ended German residential lease must reach the other side by the third working day of a month, and the tenancy then ends at the close of the month after next (Section 573c of the Civil Code). For tenants that is always ${K.mieter_monate} months, however long they have lived there. For landlords the period grows by three months after five and after eight years from handover, to six and nine months. What counts is receipt by the other side. Saturday counts as a working day (Federal Court of Justice, 27 April 2005, VIII ZR 206/04); Sundays and public holidays do not, which is why the calculator asks for your state. A Berlin example: if your notice arrives on 4 November 2026, the third working day, the tenancy ends on ${dE(a.ende)}. If it arrives on 5 November, it ends only on ${dE(b.ende)}. If the landlord gives notice on a flat handed over in April 2019, six months apply, to ${dE(v6.ende)}.`,
    faqs: [
      { q: 'Does Saturday count as a working day for the notice deadline?', a: `Yes. The Federal Court of Justice ruled that Saturday counts among the three working days (VIII ZR 206/04). In October 2026, 3 October is a public holiday, so the third working day is ${dE(okt.stichtag)}. If the third working day itself falls on a Saturday, the court left open whether the deadline moves to Monday; the calculator then advises delivery by Friday.` },
      { q: 'Does the longer period apply when I, the tenant, give notice?', a: `No. The extension to six and nine months applies only to the landlord. Tenants always give ${K.mieter_monate} months’ notice, even after twenty years in the flat. A clause imposing a longer period on the tenant is void. Waiving notice for a fixed time is possible with a graduated rent, for at most four years from the agreement.` },
      { q: 'Does a notice to end a German lease have to be signed?', a: 'Yes. Under Section 568 BGB, notice on a residential lease needs written form, meaning a letter with a handwritten signature; an e-mail or tenant-portal message is not enough. With several tenants all must sign; with several landlords it must reach all of them. Delivery by messenger or through the letterbox in front of a witness is the safest proof of receipt.' },
    ],
    body: (h) => `
<h2>How the calculator works</h2>
<p>It finds the third working day in the month of receipt: Monday to Saturday count, Sundays and public holidays do not. Besides national holidays it includes the holidays of your state that can fall in the first days of a month, such as 6 January in Bavaria, Baden-Württemberg and Saxony-Anhalt or 1 November in North Rhine-Westphalia. If notice arrives by that day, the current month counts; otherwise the period starts the following month. The end is the last day of the month in which the period runs out. For a landlord it counts the years since the flat was handed over, the move-in, not the signing.</p>
${h.table(['Case', 'Period', 'End'], [
  ['tenant, received 4 November 2026', `${a.monate} months`, h.date(a.ende)],
  ['tenant, received 5 November 2026', `${b.monate} months`, h.date(b.ende)],
  ['landlord, flat since April 2019', `${v6.monate} months`, h.date(v6.ende)],
  ['landlord, flat since April 2016', `${v9.monate} months`, h.date(v9.ende)],
], 'Notice periods under Section 573c BGB, Berlin holidays', ['l', 'r', 'r'])}
<h2>What the calculator does not check</h2>
<p>Whether a landlord may give notice at all is not in ${h.src('bgb573c', 'Section 573c')} but in ${h.src('bgb573', 'Section 573 BGB')}: he needs a legitimate interest, such as own use (Eigenbedarf), and must state the reasons in the letter. The ${h.a('eigenbedarfskuendigung', 'own-use eviction')} page explains conditions, objections and waiting periods. Shorter periods apply to furnished rooms in the landlord's own flat and to temporary lettings; the calculator does not cover these.</p>
`,
  },
});
