import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { indexmiete, vpiMonate, VPI } from '../../lib/engine/miete';
import { addMonths, cmp } from '../../lib/engine/dates';
import { formatMoney, formatNumber, formatPercent, displayDate } from '../../lib/format';

const MON = { de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'], en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
const mon = (m: string, l: 'de' | 'en') => { const [y, mo] = m.split('-').map(Number); return `${MON[l][mo - 1]} ${y}`; };
const vorjahr = (m: string) => { const [y, mo] = m.split('-').map(Number); return `${y - 1}-${String(mo).padStart(2, '0')}`; };
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const nD = (x: number) => formatNumber(x, 1, 'de'), nE = (x: number) => formatNumber(x, 1, 'en');
const pD = (x: number, d = 1) => formatPercent(x, d, 'de'), pE = (x: number, d = 1) => formatPercent(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');
const auf = Math.round(P.mpb.aufschlag * 100);
const tausendD = formatMoney(1000, 0, 'de'), tausendE = formatMoney(1000, 0, 'en');
const jahrD = P.index.min_monate === 12 ? 'ein Jahr' : `${P.index.min_monate} Monate`, jahrE = P.index.min_monate === 12 ? 'one year' : `${P.index.min_monate} months`;

/* Letzte zwölf veröffentlichte Monate mit Vorjahresvergleich, gerechnet mit indexmiete() auf 1 000 €. */
const last = vpiMonate[vpiMonate.length - 1];
const zwoelf = vpiMonate.slice(-12).reverse().filter((m) => VPI[vorjahr(m)] !== undefined).map((m) => ({ m, v: VPI[m], r: indexmiete({ miete: 1000, von: vorjahr(m), bis: m }) }));
const hoch = [...zwoelf].sort((a, b) => b.r.aenderung - a.r.aenderung)[0], tief = [...zwoelf].sort((a, b) => a.r.aenderung - b.r.aenderung)[0];
// Rückgänge gegenüber dem Vormonat (Indexmiete kann auch sinken).
const rueck = vpiMonate.slice(1).filter((m, i) => VPI[m] < VPI[vpiMonate[i]]);
const letzterRueck = rueck[rueck.length - 1];
const vorRueck = vpiMonate[vpiMonate.indexOf(letzterRueck) - 1];

/* Beispiel: 950 € vereinbart, letzte Anpassung mit dem Index für August 2025, wirksam seit 1. Dezember 2025;
   neue Erklärung mit dem Index für August 2026, Zugang am 15. Oktober 2026. */
const MIETE = 950, VON = vorjahr(last), LETZTE_WIRKUNG = '2025-12-01', ZUGANG = '2026-10-15';
const r = indexmiete({ miete: MIETE, von: VON, bis: last, zugang: ZUGANG });
const jahrUm = addMonths(LETZTE_WIRKUNG, P.index.min_monate);
const abstandOk = cmp(r.wirksam!, jahrUm) >= 0;
// Hohe Inflation: Anpassung von August 2022 auf August 2023 (falls in der Reihe).
const infl = indexmiete({ miete: MIETE, von: '2021-08', bis: '2022-08' });
const infl2 = indexmiete({ miete: infl.neu, von: '2022-08', bis: '2023-08' });
const zweiJahre = indexmiete({ miete: MIETE, von: '2021-08', bis: '2023-08' });

export default defineGuide({
  id: 'indexmiete',
  group: 'erhoehung',
  order: 90,
  mini: 'index',
  miniHref: 'indexmiete-rechner',
  related: ['indexmiete-rechner', 'staffelmiete', 'mietpreisbremse', 'kappungsgrenze', 'modernisierungsankuendigung', 'mieterhoehung'],
  sources: ['bgb557b', 'vpi', 'bgb559', 'bgb559e', 'bgb555b', 'bgb556d'],
  de: {
    slug: 'indexmiete',
    nav: 'Indexmiete',
    card: 'Miete, die der Inflation folgt: Regeln, Grenzen und aktuelle Indexstände.',
    title: 'Indexmiete 2026: Regeln, Verbraucherpreisindex und Grenzen',
    description: `Indexmiete 2026: mit dem Verbraucherpreisindex, frühestens nach einem Jahr, in Textform mit Euro-Betrag. Indexstände bis ${mon(last, 'de')} mit Vorjahresvergleich.`,
    h1: 'Indexmiete: wenn die Inflation die Miete bestimmt',
    intro: 'Eine Indexmiete steigt und fällt mit den Verbraucherpreisen, schließt dafür aber die Erhöhung auf den Mietspiegel aus.',
    resume: `Bei einer Indexmiete nach § 557b BGB vereinbaren Mieter und Vermieter schriftlich, dass sich die Miete nach dem Verbraucherpreisindex für Deutschland richtet, den das Statistische Bundesamt ermittelt. Ein anderer Index ist nicht zulässig. Zwischen zwei Anpassungen muss die Miete mindestens ${jahrD} unverändert bleiben. Jede Änderung wird durch Erklärung in Textform geltend gemacht, mit der Indexänderung und dem neuen Betrag in Euro, und gilt ab dem übernächsten Monat nach Zugang. Erhöhungen auf die Vergleichsmiete sind ausgeschlossen, Modernisierungsumlagen nur in engen Fällen möglich, und die Mietpreisbremse gilt nur für die Ausgangsmiete. Eine Kappungsgrenze gibt es nicht. Der Index lag im ${mon(last, 'de')} bei ${nD(VPI[last])} Punkten, ${pD(r.aenderung)} über dem Vorjahresmonat. Eine Miete von ${eD(MIETE, 0)}, zuletzt mit dem Wert für ${mon(VON, 'de')} angepasst, steigt damit auf ${eD(r.neu)}, also um ${eD(r.plus)} im Monat. Geht die Erklärung am ${dD(ZUGANG)} zu, ist die neue Miete ab dem ${dD(r.wirksam!)} zu zahlen.`,
    faqs: [
      { q: 'Kann die Miete bei einer Indexmiete auch sinken?', a: `Ja. Die Vereinbarung bindet die Miete an den Index in beide Richtungen. Fällt der Verbraucherpreisindex gegenüber dem Stand der letzten Anpassung, können Sie die Senkung selbst geltend machen, ebenfalls in Textform mit der Indexänderung und dem neuen Betrag, frühestens ${jahrD} nach der letzten Änderung. Zuletzt gab der Index von ${mon(vorRueck, 'de')} auf ${mon(letzterRueck, 'de')} nach, von ${nD(VPI[vorRueck])} auf ${nD(VPI[letzterRueck])} Punkte; maßgeblich ist aber immer der Vergleich mit dem Stand bei der letzten Anpassung.` },
      { q: 'Darf der Vermieter bei einer Indexmiete zusätzlich auf den Mietspiegel erhöhen?', a: 'Nein. § 557b Abs. 2 Satz 3 BGB schließt eine Erhöhung nach § 558 BGB aus, solange die Indexmiete gilt. Der Vermieter kann die Miete also nicht an den Mietspiegel heranführen, auch wenn sie weit darunter liegt. Umgekehrt schützt Sie keine Kappungsgrenze, wenn die Inflation hoch ist. Betriebskosten kann er dagegen weiter nach § 560 BGB anpassen.' },
      { q: 'Gilt die Mietpreisbremse auch für spätere Indexerhöhungen?', a: `Nein, nur für die Ausgangsmiete (§ 557b Abs. 4 BGB). Ist die erste Miete in einer Gemeinde mit Mietpreisbremse zu hoch, können Sie das rügen und zu viel Gezahltes zurückverlangen; die späteren Anpassungen rechnen dann von der zulässigen Miete aus. Liegt eine indexierte Miete Jahre später über dem Mietspiegel plus ${auf} Prozent, ist das zulässig, solange sie korrekt nach dem Index berechnet wurde.` },
      { q: 'Darf der Vermieter mehrere Jahre warten und dann die gesamte Indexsteigerung verlangen?', a: `Ja. Er muss nicht jedes Jahr anpassen. Verlangt er nach drei Jahren eine Anpassung, rechnet er vom Indexstand der letzten Anpassung bis zum aktuellen Stand und erfasst damit die ganze Steigerung, aber nur für die Zukunft. Nachzahlungen für die Jahre ohne Erklärung schulden Sie nicht, weil die geänderte Miete erst ab dem übernächsten Monat nach Zugang der Erklärung zu zahlen ist.` },
      { q: 'Welche Modernisierungskosten darf der Vermieter bei einer Indexmiete umlegen?', a: 'Nur solche aus Maßnahmen, die er auf Grund von Umständen durchgeführt hat, die er nicht zu vertreten hat, etwa weil ein Gesetz sie vorschreibt. Eine Ausnahme gilt für den Einbau oder die Aufstellung einer Heizungsanlage nach § 555b Nr. 1a BGB: Dafür ist eine Erhöhung nach § 559 oder § 559e BGB auch bei einer Indexmiete möglich. Freiwillige Verschönerungen kann er nicht umlegen.' },
      { q: 'Muss eine Indexmiete im Mietvertrag unterschrieben sein?', a: 'Ja. § 557b Abs. 1 BGB verlangt eine schriftliche Vereinbarung, also eine Urkunde mit den Unterschriften beider Seiten, meist im Mietvertrag. Für die spätere Anpassung genügt dagegen die Textform, also auch ein Schreiben ohne eigenhändige Unterschrift oder eine E-Mail. Fehlt die Schriftform der Vereinbarung, ist die Indexklausel unwirksam, und der Vermieter kann nur nach den allgemeinen Regeln erhöhen.' },
    ],
    body: (h) => `
<h2>Wie eine Indexmiete funktioniert</h2>
<p>Mit einer Indexmiete legen die Parteien keine festen Beträge fest, sondern einen Maßstab: den vom Statistischen Bundesamt ermittelten Preisindex für die Lebenshaltung aller privaten Haushalte in Deutschland, kurz Verbraucherpreisindex (VPI). Andere Indizes erlaubt ${h.src('bgb557b', '§ 557b BGB')} nicht, weder einen regionalen Index noch einen Baukostenindex. Die Vereinbarung muss schriftlich getroffen werden. Steigt der Index, kann der Vermieter die Miete im selben Verhältnis anheben; fällt er, kann der Mieter eine Senkung verlangen.</p>
<p>Die Rechnung ist einfach: neue Miete gleich bisherige Miete mal neuer Indexstand geteilt durch den Indexstand bei der letzten Anpassung. Das Statistische Bundesamt veröffentlicht die Werte monatlich auf der Basis 2020 = 100 (${h.src('vpi', 'Verbraucherpreisindex')}). Der Index sagt nichts über den Wohnungsmarkt, er misst die Preise eines Warenkorbs. Eine Indexmiete kann deshalb schneller steigen als die Mieten vor Ort, wie 2022 und 2023, oder langsamer.</p>

<h2>Die vier Regeln für jede Anpassung</h2>
<ol>
<li><strong>Abstand.</strong> Die Miete muss jeweils mindestens ${jahrD} unverändert bleiben. Erhöhungen nach den §§ 559 bis 560 BGB zählen dabei nicht, sie unterbrechen die Frist nicht.</li>
<li><strong>Textform.</strong> Die Änderung wird durch Erklärung in Textform geltend gemacht. Ein Brief ohne Unterschrift oder eine E-Mail reicht, eine mündliche Ankündigung nicht.</li>
<li><strong>Inhalt.</strong> Die Erklärung muss die eingetretene Änderung des Index nennen und die neue Miete oder die Erhöhung als Geldbetrag. Wer nur „plus Inflation“ schreibt, hat nichts wirksam erklärt.</li>
<li><strong>Fälligkeit.</strong> Die geänderte Miete ist ab dem Beginn des übernächsten Monats nach Zugang der Erklärung zu zahlen. Eine Rückwirkung gibt es nicht.</li>
</ol>

<h2>Ein Beispiel mit aktuellen Werten</h2>
<p>Die Nettokaltmiete beträgt ${h.eur(MIETE, 2)}. Sie wurde zuletzt mit dem Indexstand für ${mon(VON, 'de')} angepasst, ${h.num(r.vpiVon, 1)} Punkte, und gilt seit dem ${h.date(LETZTE_WIRKUNG)}. Der Vermieter stützt seine neue Erklärung auf den Stand für ${mon(last, 'de')}, ${h.num(r.vpiBis, 1)} Punkte. Das sind ${h.pct(r.aenderung, 2)} mehr, die neue Miete beträgt ${h.eur(r.neu, 2)}, ${h.eur(r.plus, 2)} mehr im Monat. Geht die Erklärung am ${h.date(ZUGANG)} zu, ist die neue Miete ab dem ${h.date(r.wirksam!)} zu zahlen. Die Jahresfrist ${abstandOk ? `ist gewahrt, denn ein Jahr nach der letzten Änderung ist der ${h.date(jahrUm)}` : `ist nicht gewahrt: Vor dem ${h.date(jahrUm)} darf die neue Miete nicht gelten`}.</p>
<p>Was eine Indexmiete in Zeiten hoher Inflation bedeutet, zeigt derselbe Betrag zwei Jahre früher. Von August 2021 bis August 2022 stieg der Index um ${h.pct(infl.aenderung, 1)}, die Miete wäre auf ${h.eur(infl.neu, 2)} gestiegen; ein Jahr später um weitere ${h.pct(infl2.aenderung, 1)} auf ${h.eur(infl2.neu, 2)}. In zwei Jahren also ${h.eur(zweiJahre.neu - MIETE, 2)} mehr im Monat, ein Plus von ${h.pct(zweiJahre.aenderung, 1)}. Bei einer Erhöhung auf die Vergleichsmiete hätte die ${h.a('kappungsgrenze', 'Kappungsgrenze')} das in drei Jahren auf höchstens ${h.pct(P.erhoehung.kappung, 0)} begrenzt, eine Indexmiete kennt diese Grenze nicht.</p>

<h2>Die letzten zwölf Monate</h2>
${h.table(['Monat', 'VPI 2020 = 100', 'Vorjahresmonat', 'Veränderung', `${tausendD} nach einem Jahr`], zwoelf.map((z) => [mon(z.m, 'de'), h.num(z.v, 1), h.num(z.r.vpiVon, 1), h.pct(z.r.aenderung, 1), h.eur(z.r.neu, 2)]), `Verbraucherpreisindex für Deutschland, Statistisches Bundesamt, Stand ${h.date(P.vpi.stand)}`, ['l', 'r', 'r', 'r', 'r'])}
<p>Die Jahresveränderung lag in diesen zwölf Monaten zwischen ${h.pct(tief.r.aenderung, 1)} (${mon(tief.m, 'de')}) und ${h.pct(hoch.r.aenderung, 1)} (${mon(hoch.m, 'de')}). Die letzte Spalte zeigt, was aus ${h.eur(1000)} wird, wenn die Miete genau ein Jahr nach der letzten Anpassung mit dem Wert dieses Monats angepasst wird. Ihre eigene Rechnung mit beliebigen Monaten macht der ${h.a('indexmiete-rechner', 'Indexmiete-Rechner')}; prüfen Sie dort auch, ob der Vermieter den richtigen Ausgangsmonat genommen hat, nämlich den der letzten Anpassung, nicht den des Mietbeginns.</p>

<h2>Was eine Indexmiete ausschließt</h2>
<ul>
<li><strong>Keine Erhöhung auf den Mietspiegel.</strong> § 557b Abs. 2 Satz 3 BGB schließt eine Erhöhung nach § 558 BGB aus. Liegt Ihre Miete unter der ortsüblichen Vergleichsmiete, bleibt das so, solange die Indexmiete gilt.</li>
<li><strong>Modernisierung nur ausnahmsweise.</strong> Eine Erhöhung nach ${h.src('bgb559', '§ 559 BGB')} oder ${h.src('bgb559e', '§ 559e BGB')} kann der Vermieter nur verlangen, soweit er bauliche Maßnahmen auf Grund von Umständen durchgeführt hat, die er nicht zu vertreten hat. Ausgenommen davon ist eine Modernisierung nach ${h.src('bgb555b', '§ 555b Nr. 1a BGB')}, also der Einbau oder die Aufstellung einer Heizungsanlage; sie kann er umlegen. Wie eine solche Maßnahme angekündigt werden muss, steht auf der Seite zur ${h.a('modernisierungsankuendigung', 'Modernisierungsankündigung')}.</li>
<li><strong>Mietpreisbremse nur am Anfang.</strong> In einer Gemeinde mit Landesverordnung nach ${h.src('bgb556d', '§ 556d BGB')} darf die Ausgangsmiete die Vergleichsmiete um höchstens ${auf} Prozent übersteigen. Für die späteren Anpassungen gilt die ${h.a('mietpreisbremse', 'Mietpreisbremse')} nicht mehr (§ 557b Abs. 4 BGB).</li>
</ul>
<p>Betriebskosten sind von alledem nicht betroffen: Vorauszahlungen werden nach jeder Abrechnung angepasst, unabhängig vom Index.</p>

<h2>Indexmiete oder Staffelmiete?</h2>
<p>Beide Modelle ersetzen die Erhöhung auf den Mietspiegel durch eine Regel, die schon im Vertrag steht. Die ${h.a('staffelmiete', 'Staffelmiete')} nennt feste Beträge und unterliegt in Gemeinden mit Mietpreisbremse bei jeder Stufe der Grenze; die Indexmiete folgt den Preisen und ist nur am Anfang gebremst. Bei niedriger Inflation ist die Indexmiete für Mieter oft günstiger, bei hoher teurer. Eine Kündigungssperre wie bei der Staffelmiete sieht § 557b BGB nicht vor; ob der Vertrag sie gesondert enthält, steht in seinen übrigen Klauseln.</p>
`,
  },
  en: {
    slug: 'index-linked-rent',
    nav: 'Index-linked rent',
    card: 'Rent that tracks inflation: rules, limits and the latest index values.',
    title: 'Index-Linked Rent 2026: Rules, Consumer Prices and Limits',
    description: `Index-linked rent (Indexmiete) 2026: consumer price index only, one year between changes, a notice in euros. Index values up to ${mon(last, 'en')}, year on year.`,
    h1: 'Index-linked rent: when inflation sets the rent',
    intro: 'An index-linked rent rises and falls with consumer prices, and in exchange rules out increases to the rent index level.',
    resume: `With an index-linked rent (Indexmiete) under Section 557b of the German Civil Code (BGB), landlord and tenant agree in writing that the rent follows the consumer price index for Germany published by the Federal Statistical Office (Destatis). No other index is allowed. The rent must stay unchanged for at least ${jahrE} between adjustments. Each change is claimed by a notice in text form stating the change in the index and the new amount in euros, and applies from the start of the month after next following receipt. Increases to the local reference rent are excluded, modernisation surcharges are possible only in narrow cases, and the rent brake applies only to the starting rent. There is no increase cap. In ${mon(last, 'en')} the index stood at ${nE(VPI[last])} points, ${pE(r.aenderung)} above the same month a year earlier. A rent of ${eE(MIETE, 0)} last adjusted on the ${mon(VON, 'en')} figure therefore rises to ${eE(r.neu)}, ${eE(r.plus)} more a month. If the notice arrives on ${dE(ZUGANG)}, the new rent is due from ${dE(r.wirksam!)}.`,
    faqs: [
      { q: 'Can an index-linked rent go down?', a: `Yes. The clause ties the rent to the index in both directions. If the consumer price index falls below its level at the last adjustment, you can claim the reduction yourself, also in text form with the index change and the new amount, no earlier than ${jahrE} after the last change. Most recently the index slipped from ${mon(vorRueck, 'en')} to ${mon(letzterRueck, 'en')}, from ${nE(VPI[vorRueck])} to ${nE(VPI[letzterRueck])} points, but what counts is always the comparison with the last adjustment.` },
      { q: 'Can the landlord also raise an index-linked rent to the rent index level?', a: 'No. Section 557b(2) sentence 3 BGB rules out an increase under Section 558 BGB while the index clause applies. The landlord cannot bring the rent up to the local rent index (Mietspiegel), however far below it is. Equally, no increase cap protects you when inflation is high. He can still adjust service charges under Section 560 BGB.' },
      { q: 'Does the rent brake cover later index increases?', a: `No, only the starting rent (Section 557b(4) BGB). If the first rent in a rent-brake municipality was too high, you can complain and reclaim the excess, and later adjustments are then calculated from the lawful rent. If an indexed rent ends up above the rent index plus ${auf} per cent years later, that is lawful as long as it was correctly calculated from the index.` },
      { q: 'Can the landlord wait several years and then claim the whole index rise?', a: 'Yes. He does not have to adjust every year. If he asks after three years, he calculates from the index at the last adjustment to the current one and so captures the whole rise, but only going forward. You owe nothing for the years without a notice, because the changed rent is payable only from the start of the month after next following receipt.' },
      { q: 'Which modernisation costs can be passed on under an index-linked rent?', a: 'Only those from works the landlord carried out because of circumstances outside his control, for example because a statute required them. There is one exception: installing or setting up a heating system under Section 555b no. 1a BGB, for which an increase under Section 559 or 559e BGB is possible even with an index rent. Voluntary upgrades cannot be passed on.' },
      { q: 'Does an index-rent clause have to be signed?', a: 'Yes. Section 557b(1) BGB requires a written agreement, meaning a document signed by both sides, usually the lease. For later adjustments text form is enough, so a letter without a handwritten signature or an e-mail will do. If the clause itself lacks written form, it is void and the landlord can only raise the rent under the general rules.' },
    ],
    body: (h) => `
<h2>How an index-linked rent works</h2>
<p>An index-linked rent sets no fixed amounts, only a yardstick: the price index for the cost of living of all private households in Germany, compiled by the Federal Statistical Office and known as the consumer price index (Verbraucherpreisindex, VPI). ${h.src('bgb557b', 'Section 557b BGB')} allows no other index, neither a regional one nor a construction cost index. The agreement must be made in writing. When the index rises, the landlord may raise the rent in the same proportion; when it falls, the tenant may ask for a reduction.</p>
<p>The arithmetic is simple: new rent equals current rent times the new index value divided by the index value at the last adjustment. Destatis publishes the figures every month on a 2020 = 100 basis (${h.src('vpi', 'consumer price index')}). The index measures the prices of a basket of goods, not the housing market, so an index rent can rise faster than local rents, as in 2022 and 2023, or more slowly.</p>

<h2>Four rules for every adjustment</h2>
<ol>
<li><strong>Interval.</strong> The rent must stay unchanged for at least ${jahrE} at a time. Increases under Sections 559 to 560 BGB are disregarded and do not interrupt the period.</li>
<li><strong>Text form.</strong> The change is claimed by a notice in text form (Textform). An unsigned letter or an e-mail is enough; a verbal announcement is not.</li>
<li><strong>Content.</strong> The notice must state the change in the index and the new rent or the increase as a sum of money. “Plus inflation” on its own achieves nothing.</li>
<li><strong>When it is due.</strong> The new rent is payable from the start of the month after next following receipt of the notice. There is no backdating.</li>
</ol>

<h2>A worked example with current figures</h2>
<p>The net cold rent is ${h.eur(MIETE, 2)}. It was last adjusted on the index for ${mon(VON, 'en')}, ${h.num(r.vpiVon, 1)} points, and has applied since ${h.date(LETZTE_WIRKUNG)}. The landlord bases his new notice on the figure for ${mon(last, 'en')}, ${h.num(r.vpiBis, 1)} points. That is ${h.pct(r.aenderung, 2)} more, so the new rent is ${h.eur(r.neu, 2)}, ${h.eur(r.plus, 2)} more per month. If the notice arrives on ${h.date(ZUGANG)}, the new rent is due from ${h.date(r.wirksam!)}. The one-year rule ${abstandOk ? `is met, since a year after the last change is ${h.date(jahrUm)}` : `is not met: the new rent cannot apply before ${h.date(jahrUm)}`}.</p>
<p>What an index rent means when inflation is high shows if you run the same amount two years earlier. From August 2021 to August 2022 the index rose by ${h.pct(infl.aenderung, 1)}, taking the rent to ${h.eur(infl.neu, 2)}; a year later it rose another ${h.pct(infl2.aenderung, 1)}, to ${h.eur(infl2.neu, 2)}. That is ${h.eur(zweiJahre.neu - MIETE, 2)} more a month within two years, an increase of ${h.pct(zweiJahre.aenderung, 1)}. Under an ordinary increase to the reference rent, the ${h.a('kappungsgrenze', 'increase cap')} would have limited the rise to at most ${h.pct(P.erhoehung.kappung, 0)} in three years; an index rent has no such cap.</p>

<h2>The last twelve months</h2>
${h.table(['Month', 'CPI 2020 = 100', 'Same month a year earlier', 'Change', `${tausendE} after one year`], zwoelf.map((z) => [mon(z.m, 'en'), h.num(z.v, 1), h.num(z.r.vpiVon, 1), h.pct(z.r.aenderung, 1), h.eur(z.r.neu, 2)]), `Consumer price index for Germany, Federal Statistical Office, as of ${h.date(P.vpi.stand)}`, ['l', 'r', 'r', 'r', 'r'])}
<p>Over these twelve months the annual change ranged from ${h.pct(tief.r.aenderung, 1)} (${mon(tief.m, 'en')}) to ${h.pct(hoch.r.aenderung, 1)} (${mon(hoch.m, 'en')}). The last column shows what ${h.eur(1000)} becomes if the rent is adjusted exactly one year after the previous adjustment, using that month’s figure. The ${h.a('indexmiete-rechner', 'index rent calculator')} does the sum for any pair of months; use it to check that the landlord started from the right month, which is the month of the last adjustment, not the start of the lease.</p>

<h2>What an index-linked rent rules out</h2>
<ul>
<li><strong>No increase to the rent index.</strong> Section 557b(2) sentence 3 BGB excludes increases under Section 558 BGB. If your rent is below the local reference rent, it stays there for as long as the index clause applies.</li>
<li><strong>Modernisation only by way of exception.</strong> An increase under ${h.src('bgb559', 'Section 559 BGB')} or ${h.src('bgb559e', 'Section 559e BGB')} is only possible for building work the landlord carried out because of circumstances he is not responsible for. The exception to that is modernisation under ${h.src('bgb555b', 'Section 555b no. 1a BGB')}, meaning the installation of a heating system, which he may pass on. How such work has to be announced is explained on the ${h.a('modernisierungsankuendigung', 'modernisation notice page')}.</li>
<li><strong>Rent brake only at the start.</strong> In a municipality covered by a state ordinance under ${h.src('bgb556d', 'Section 556d BGB')}, the starting rent may exceed the reference rent by no more than ${auf} per cent. Later adjustments are outside the ${h.a('mietpreisbremse', 'rent brake')} (Section 557b(4) BGB).</li>
</ul>
<p>Service charges are unaffected by all of this: advance payments are adjusted after each annual statement, whatever the index does.</p>

<h2>Index-linked or graduated rent?</h2>
<p>Both models replace increases to the rent index with a rule written into the lease. A ${h.a('staffelmiete', 'graduated rent')} (Staffelmiete) sets fixed amounts, and in rent-brake municipalities every step is checked against the ceiling; an index rent follows prices and is only checked at the start. When inflation is low an index rent often works out cheaper for tenants, when it is high, dearer. Section 557b BGB contains no notice waiver like the one allowed for graduated rents; whether your lease has a separate one depends on its other clauses.</p>
`,
  },
});
