import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { stadtDaten, faktenTabelle, offiziell } from '../../lib/stadt-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Valeur supposée tirée du Mietspiegelrechner : 7,60 €/m² pour 65 m², loyer convenu 620 €.
const D = stadtDaten('essen', 7.6, 65, 620);
const { S, st, erh } = D;
const E = P.erhoehung;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietspiegel-essen',
  group: 'staedte',
  order: 130,
  tool: 'stadt',
  ort: 'essen',
  related: ['mietspiegel-dortmund', 'mpb-nw', 'mieterhoehung-rechner', 'kappungsgrenze', 'vergleichsmiete'],
  sources: ['bgb558', 'bgb558d', 'bgb556d'],
  de: {
    slug: 'mietspiegel-essen',
    nav: 'Mietspiegel Essen',
    card: 'Mietspiegel 2026; keine Mietpreisbremse, Kappung 20 Prozent.',
    title: 'Mietspiegel Essen 2026: Vergleichsmiete ohne Mietpreisbremse',
    description: 'Mietspiegel Essen 2026: qualifizierter Mietspiegel bis Juli 2028, warum in Essen keine Mietpreisbremse gilt und was die Kappungsgrenze von 20 Prozent erlaubt.',
    h1: 'Mietspiegel Essen: was gilt, wenn die Mietpreisbremse fehlt',
    intro: 'Essen steht nicht in der Mieterschutzverordnung von NRW; der Mietspiegel bleibt trotzdem der Maßstab für jede Mieterhöhung.',
    resume: `Der qualifizierte Mietspiegel 2026 für nicht preisgebundene Wohnungen in Essen gilt vom ${dD(S.gueltigAb!)} bis zum ${dD(S.gueltigBis!)}. Er ist eine Fortschreibung des Mietspiegels 2024 mit dem Verbraucherpreisindex und wird vom Amt für Grundstücksmanagement und Wohnraumförderung der Stadt herausgegeben; die Daten hat ein Hamburger Beratungsunternehmen mit einem Regressionsverfahren ausgewertet. Die Vergleichsmiete ergibt sich aus einer Basismiete nach Wohnflächenklasse mit prozentualen Zu- und Abschlägen für Baualter, Wohnungstyp, Ausstattung, Heizung, Modernisierung und Wohnlage. Die Stadt behält sich alle Rechte vor, auch die elektronische Speicherung; dieser Rechner nennt daher keine Essener Werte. Anders als Dortmund, Düsseldorf oder Köln steht Essen nicht in der Mieterschutzverordnung von Nordrhein-Westfalen. Bei Vertragsschluss gilt deshalb keine Mietpreisbremse, und bei Mieterhöhungen gilt die bundesweite Kappungsgrenze von ${E.kappung * 100} Prozent in drei Jahren.`,
    faqs: [
      { q: 'Warum gibt es in Essen keine Mietpreisbremse?', a: 'Weil die Landesregierung Essen nicht in die Liste der Gemeinden mit angespanntem Wohnungsmarkt aufgenommen hat. Die Mietpreisbremse gilt nur dort, wo eine Landesverordnung sie anordnet. Für Essen gibt es daher bei Vertragsschluss keine Grenze aus § 556d BGB. Ändert das Land seine Verordnung, prüft der Mietcheck das automatisch anhand des Vertragsdatums.' },
      { q: 'Wie viel darf die Miete in Essen bei einer Erhöhung steigen?', a: `Höchstens 20 Prozent in drei Jahren und nie über die Vergleichsmiete. Wer 65 m² für ${eD(D.mieteAlt, 0)} mietet und laut städtischem Mietspiegel eine Vergleichsmiete von ${eD(7.6)} hat, kann zu höchstens ${eD(erh.zulaessig)} verpflichtet werden. In Dortmund wären es bei gleicher Lage wegen der 15-Prozent-Grenze unter Umständen weniger.` },
      { q: 'Hilft mir der Essener Mietspiegel bei einem neuen Vertrag?', a: 'Als Orientierung ja, als Grenze nein. Ohne Mietpreisbremse ist die Anfangsmiete frei vereinbar. Der Mietspiegel zeigt aber, was ortsüblich ist, und er bestimmt, wie weit der Vermieter die Miete später erhöhen kann. Eine Miete, die deutlich über der Vergleichsmiete beginnt, kann über Jahre nicht nach § 558 BGB steigen.' },
    ],
    body: (h) => `
<h2>Ein Mietspiegel ohne Mietpreisbremse</h2>
<p>Das Ruhrgebiet ist in der Verordnung von Nordrhein-Westfalen nur teilweise vertreten. Dortmund steht darin, Essen nicht. Für Essener Mieter bedeutet das: Die Anfangsmiete eines neuen Vertrags ist frei, und Mieterhöhungen werden nur durch die Vergleichsmiete und die Kappungsgrenze von 20 Prozent gebremst. Umso wichtiger ist der Mietspiegel, denn er ist die Obergrenze jeder Erhöhung nach § 558 BGB. Die Fortschreibung 2026 hat die Werte des Mietspiegels 2024 mit dem Verbraucherpreisindex angehoben; für 2028 kündigt die Stadt eine neue Datenerhebung an.</p>
${faktenTabelle(S, st, h)}
<h2>Rechnen mit dem Essener Wert</h2>
<p>Den Mietspiegel finden Sie über die ${offiziell(S, h, 'Seite der Stadt Essen zum Mietspiegel')}. Tragen Sie die Vergleichsmiete oben ein und wählen Sie „Mieterhöhung erhalten“. Der Mietcheck rechnet mit der Kappungsgrenze von ${h.pct(st.kappung, 0)}: Bei ${h.eur(D.mieteAlt, 0)} bisheriger Miete sind höchstens ${h.eur(erh.zulaessig, 2)} zulässig, wenn die Vergleichsmiete ${h.eur(D.verlangt, 0)} beträgt. Bei einem neuen Vertrag zeigt er „keine Grenze“, nennt aber die Vergleichsmiete als Maßstab.</p>
<p>Zum Vergleich mit der Nachbarstadt, deren Mietspiegel dieser Rechner selbst ausrechnet: ${h.a('mietspiegel-dortmund', 'Mietspiegel Dortmund')}. Welche Kommunen in NRW unter die Verordnung fallen, steht auf der Seite ${h.a('mpb-nw', 'Mietpreisbremse Nordrhein-Westfalen')}.</p>
`,
  },
  en: {
    slug: 'essen-rent-index',
    nav: 'Essen rent index',
    card: '2026 index; no rent brake, 20 per cent cap.',
    title: 'Essen Rent Index 2026: Reference Rent without a Rent Brake',
    description: 'Essen rent index 2026: qualified index valid until July 2028, why no rent brake applies in Essen and what the 20 per cent increase cap allows your landlord.',
    h1: 'Essen rent index: what applies when there is no rent brake',
    intro: 'Essen is not in North Rhine-Westphalia’s tenant-protection ordinance; the rent index still sets the limit for every increase.',
    resume: `Essen's qualified 2026 rent index for non-subsidised flats applies from ${dE(S.gueltigAb!)} to ${dE(S.gueltigBis!)}. It updates the 2024 index with the consumer price index and is published by the city's property management and housing promotion office; a Hamburg consultancy analysed the data with a regression method. The reference rent comes from a base rent by floor-area band with percentage premiums and deductions for age, type of flat, fittings, heating, modernisation and location. The city reserves all rights, including electronic storage, so this calculator gives no Essen figures. Unlike Dortmund, Düsseldorf or Cologne, Essen is not listed in North Rhine-Westphalia's tenant-protection ordinance. No rent brake applies at signing, and for increases the nationwide cap of ${E.kappung * 100} per cent over three years applies.`,
    faqs: [
      { q: 'Why is there no rent brake in Essen?', a: 'Because the state government did not put Essen on its list of municipalities with a tight housing market. The rent brake only applies where a state ordinance imposes it. For Essen there is therefore no ceiling under Section 556d of the Civil Code at signing. If the state changes its ordinance, the rent check picks that up automatically from the lease date.' },
      { q: 'How much may rent rise in Essen in an increase?', a: `By at most 20 per cent in three years and never above the reference rent. If you rent 65 m² for ${eE(D.mieteAlt, 0)} and the city’s index gives a reference rent of ${eE(7.6)}, you can be required to pay at most ${eE(erh.zulaessig)}. In Dortmund, with its 15 per cent cap, the figure could be lower for a similar flat.` },
      { q: 'Does the Essen index help me with a new lease?', a: 'As guidance, yes; as a limit, no. Without the rent brake the starting rent can be agreed freely. The index does show what is usual locally, and it determines how far the landlord can later raise the rent. A rent that starts well above the reference rent cannot rise under Section 558 of the Civil Code for years.' },
    ],
    body: (h) => `
<h2>A rent index without a rent brake</h2>
<p>The Ruhr area is only partly represented in North Rhine-Westphalia's ordinance. Dortmund is on the list, Essen is not. For Essen tenants that means the starting rent of a new lease is free, and increases are only checked by the reference rent and the 20 per cent cap. That makes the index all the more important, because it is the upper limit for every increase under Section 558 of the Civil Code. The 2026 update raised the 2024 values with the consumer price index; the city plans a new survey for 2028.</p>
${faktenTabelle(S, st, h)}
<h2>Calculating with the Essen figure</h2>
<p>The index is available via the ${offiziell(S, h, 'City of Essen rent index page')}. Enter the reference rent above and choose “rent increase received”. The rent check applies the ${h.pct(st.kappung, 0)} cap: with a current rent of ${h.eur(D.mieteAlt, 0)}, at most ${h.eur(erh.zulaessig, 2)} is lawful when the reference rent is ${h.eur(D.verlangt, 0)}. For a new lease it shows “no cap” but still gives the reference rent as the yardstick.</p>
<p>For comparison with the neighbouring city whose index this calculator works out itself: ${h.a('mietspiegel-dortmund', 'Dortmund rent index')}. Which NRW municipalities the ordinance covers is on the ${h.a('mpb-nw', 'rent brake in North Rhine-Westphalia')} page.</p>
`,
  },
});
