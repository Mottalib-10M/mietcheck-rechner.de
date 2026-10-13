import { defineGuide } from '../../lib/guide-types';
import { landDaten, gemeindeTabelle } from '../../lib/land-seite';
import { formatMoney, displayDate } from '../../lib/format';

// Exemple : Kiel, valeur de référence supposée 9,00 €/m², 65 m² ; hausse de 497 € à 585 €.
const D = landDaten('SH', 'Kiel', 9, 65, 640);
const { L, erh } = D;
const kap = L.kappung!;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mpb-sh',
  group: 'laender',
  order: 100,
  tool: 'land',
  ort: 'SH',
  related: ['kappungsgrenze', 'mieterhoehung-rechner', 'mpb-mv', 'mietspiegel-hamburg', 'mieterhoehung'],
  sources: ['bgb558', 'bgb556d'],
  de: {
    slug: 'kappungsgrenze-schleswig-holstein',
    nav: 'Kappungsgrenze Schleswig-Holstein',
    card: `Keine Mietpreisbremse, aber 15 Prozent in ${D.nKap} Gemeinden.`,
    title: `Kappungsgrenze Schleswig-Holstein 2026: ${D.nKap} Gemeinden, 15 %`,
    description: `Kappungsgrenze Schleswig-Holstein 2026: 15 % in ${D.nKap} Gemeinden bis April 2029, darunter Kiel, Lübeck und Sylt; eine Mietpreisbremse gibt es seit 2019 nicht.`,
    h1: 'Schleswig-Holstein: Kappungsgrenze ja, Mietpreisbremse nein',
    intro: `Schleswig-Holstein bremst Mieterhöhungen in ${D.nKap} Gemeinden, lässt die Anfangsmiete bei neuen Verträgen aber frei.`,
    resume: `Schleswig-Holstein hat seit dem 30. November 2019 keine Mietpreisbremse mehr. Bei einem neuen Vertrag ist die Anfangsmiete daher im ganzen Land frei vereinbar. Für Mieterhöhungen gilt dagegen in ${D.nKap} Gemeinden eine abgesenkte Kappungsgrenze von 15 Prozent in drei Jahren. Die Kappungsgrenzenverordnung ist seit dem ${dD(kap.inKraft)} in Kraft und gilt bis zum ${dD(kap.bis)}. Erfasst sind die Städte Kiel, Lübeck und Flensburg, das Hamburger Umland mit Norderstedt, Pinneberg, Ahrensburg, Reinbek oder Wedel und viele Urlaubsorte an Nord- und Ostsee, von Sylt, Föhr und Amrum bis Fehmarn, Timmendorfer Strand und Scharbeutz. In allen anderen Gemeinden gilt die bundesweite Grenze von 20 Prozent. Ein Beispiel aus Kiel: Eine Miete von ${eD(D.alt, 0)} für 65 m² darf bei einer angenommenen Vergleichsmiete von ${eD(9)} je Quadratmeter höchstens auf ${eD(erh.zulaessig)} steigen, auch wenn der Vermieter ${eD(D.verlangt, 0)} verlangt.`,
    faqs: [
      { q: 'Gibt es in Schleswig-Holstein eine Mietpreisbremse?', a: 'Nein. Die frühere Mietpreisbegrenzungsverordnung des Landes ist am 30. November 2019 außer Kraft getreten, und eine neue gibt es nicht. Bei einem neuen Mietvertrag in Kiel, Lübeck oder auf Sylt ist die Anfangsmiete deshalb frei vereinbar. Erst bei späteren Erhöhungen greifen Vergleichsmiete und Kappungsgrenze.' },
      { q: 'Warum stehen so viele Urlaubsorte in der Kappungsgrenzenverordnung?', a: 'Die Landesregierung hat die Gemeinden ausgewählt, in denen sie die Versorgung mit Mietwohnungen zu angemessenen Bedingungen als besonders gefährdet ansieht. Dazu gehören neben den großen Städten und dem Hamburger Umland viele Orte an Nord- und Ostsee wie Sylt, Wyk auf Föhr, Fehmarn oder Timmendorfer Strand. Für Dauermieter dort gilt die Grenze von 15 Prozent.' },
      { q: 'Wie berechne ich die Kappungsgrenze für meine Wohnung in Schleswig-Holstein?', a: `Ausgangspunkt ist die Miete drei Jahre vor dem Wirksamwerden der Erhöhung, ohne Modernisierungszuschläge und Betriebskostenänderungen. Darauf kommen höchstens 15 Prozent in den Gemeinden der Verordnung, sonst 20 Prozent. Im Kieler Beispiel sind das ${eD(erh.grenzeKappung)}. Liegt die Vergleichsmiete darunter, setzt sie die Grenze.` },
    ],
    body: (h) => `
<h2>Nur eine Verordnung</h2>
<p>Die ${h.ext(kap.url, 'Kappungsgrenzenverordnung Schleswig-Holstein')} (GVOBl. Schl.-H. 2024 S. 308) beruht auf ${h.src('bgb558', '§ 558 Abs. 3 BGB')} und nennt ${D.nKap} Gemeinden, durchnummeriert. Eine Verordnung nach ${h.src('bgb556d', '§ 556d BGB')} hat das Land seit 2019 nicht mehr erlassen. Der Mietcheck zeigt deshalb für jede Gemeinde in Schleswig-Holstein bei einem neuen Vertrag keine Grenze an und rechnet bei Mieterhöhungen mit 15 oder 20 Prozent, je nachdem, ob die Gemeinde in der Liste steht.</p>
<h2>Kiel als Beispiel</h2>
<p>Eine Wohnung mit 65 m², bisherige Miete ${h.eur(D.alt, 0)}, angenommene Vergleichsmiete ${h.eur(9, 2)}: Die Vergleichsmiete erlaubt ${h.eur(erh.grenzeOvm, 2)}, die Kappungsgrenze ${h.eur(erh.grenzeKappung, 2)}. Zulässig ist der niedrigere Betrag, ${h.eur(erh.zulaessig, 2)}. Ein Schreiben vom 14. Oktober 2026 beantworten Sie bis zum ${h.date(erh.zustimmungBis)}. Wer bei einem neuen Vertrag über ${h.eur(640, 0)} prüfen will, ob die Miete hoch ist, kann sie mit der Vergleichsmiete vergleichen; eine gesetzliche Grenze gibt es dafür in Schleswig-Holstein nicht.</p>
<h2>Alle Gemeinden mit Kappungsgrenze 15 Prozent</h2>
${gemeindeTabelle(kap, h, `Kappungsgrenzenverordnung Schleswig-Holstein: ${D.nKap} Gemeinden`, false)}
`,
  },
  en: {
    slug: 'rent-cap-schleswig-holstein',
    nav: 'Rent cap Schleswig-Holstein',
    card: `No rent brake, but a 15 per cent cap in ${D.nKap} municipalities.`,
    title: `Rent Cap Schleswig-Holstein 2026: ${D.nKap} Municipalities at 15%`,
    description: `Rent cap Schleswig-Holstein 2026: 15% in ${D.nKap} municipalities until April 2029, including Kiel, Lübeck and Sylt; and no rent brake has applied since 2019.`,
    h1: 'Schleswig-Holstein: an increase cap, but no rent brake',
    intro: `Schleswig-Holstein limits rent increases in ${D.nKap} municipalities but leaves the starting rent of new leases free.`,
    resume: `Schleswig-Holstein has had no rent brake (Mietpreisbremse) since 30 November 2019, so the starting rent of a new lease can be agreed freely throughout the state. For rent increases, however, a lowered cap of 15 per cent over three years applies in ${D.nKap} municipalities. The cap ordinance has been in force since ${dE(kap.inKraft)} and runs until ${dE(kap.bis)}. It covers the cities of Kiel, Lübeck and Flensburg, the Hamburg commuter belt with Norderstedt, Pinneberg, Ahrensburg, Reinbek or Wedel, and many holiday resorts on the North Sea and Baltic, from Sylt, Föhr and Amrum to Fehmarn, Timmendorfer Strand and Scharbeutz. Everywhere else the nationwide 20 per cent limit applies. An example from Kiel: a rent of ${eE(D.alt, 0)} for 65 m² may rise to at most ${eE(erh.zulaessig)} at an assumed reference rent of ${eE(9)} per square metre, even if the landlord asks for ${eE(D.verlangt, 0)}.`,
    faqs: [
      { q: 'Is there a rent brake in Schleswig-Holstein?', a: 'No. The state’s former rent ordinance expired on 30 November 2019, and there is no new one. On a new lease in Kiel, Lübeck or on Sylt the starting rent can therefore be agreed freely. Only later increases are limited by the reference rent and the increase cap.' },
      { q: 'Why are so many holiday resorts in the cap ordinance?', a: 'The state government chose the municipalities where it considers the supply of rental housing on reasonable terms particularly at risk. Besides the large cities and the Hamburg commuter belt, these include many places on the North Sea and Baltic coasts such as Sylt, Wyk auf Föhr, Fehmarn or Timmendorfer Strand. Permanent tenants there benefit from the 15 per cent limit.' },
      { q: 'How do I work out the cap for my flat in Schleswig-Holstein?', a: `Start from the rent three years before the increase takes effect, leaving out modernisation premiums and service-charge changes. Add at most 15 per cent in the municipalities of the ordinance, 20 per cent elsewhere. In the Kiel example that gives ${eE(erh.grenzeKappung)}. If the reference rent is lower, it sets the limit.` },
    ],
    body: (h) => `
<h2>Only one ordinance</h2>
<p>The ${h.ext(kap.url, 'Schleswig-Holstein cap ordinance')} (GVOBl. Schl.-H. 2024 p. 308) rests on ${h.src('bgb558', 'Section 558(3) of the Civil Code')} and lists ${D.nKap} numbered municipalities. The state has issued no ordinance under ${h.src('bgb556d', 'Section 556d')} since 2019. The rent check therefore shows no ceiling for any Schleswig-Holstein municipality on a new lease and applies 15 or 20 per cent to increases, depending on whether the municipality is listed.</p>
<h2>Kiel as an example</h2>
<p>A 65 m² flat, current rent ${h.eur(D.alt, 0)}, assumed reference rent ${h.eur(9, 2)}: the reference rent allows ${h.eur(erh.grenzeOvm, 2)}, the cap ${h.eur(erh.grenzeKappung, 2)}. The lower amount, ${h.eur(erh.zulaessig, 2)}, is lawful. A letter received on 14 October 2026 must be answered by ${h.date(erh.zustimmungBis)}. If you want to judge whether a new lease at ${h.eur(640, 0)} is high, compare it with the reference rent; Schleswig-Holstein sets no legal ceiling for it.</p>
<h2>Every municipality with the 15 per cent cap</h2>
${gemeindeTabelle(kap, h, `Schleswig-Holstein cap ordinance: ${D.nKap} municipalities`, false)}
`,
  },
});
