import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { co2Aufteilung } from '../../lib/engine/miete';
import { formatMoney, formatNumber, formatPercent } from '../../lib/format';

const C = P.co2;
// Valeurs par défaut : immeuble 24 000 kg, 960 m², vos coûts CO2 95 €.
const r = co2Aufteilung({ kg: 24000, flaeche: 960, kosten: 95 });
const gut = co2Aufteilung({ kg: 9000, flaeche: 960, kosten: 95 });
const alt = co2Aufteilung({ kg: 52000, flaeche: 960, kosten: 95 });
const denk = co2Aufteilung({ kg: 52000, flaeche: 960, kosten: 95, einschraenkung: 'eine' });
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const nD = (x: number) => formatNumber(x, 1, 'de'), nE = (x: number) => formatNumber(x, 1, 'en');
const pD = (x: number) => formatPercent(x, 0, 'de'), pE = (x: number) => formatPercent(x, 0, 'en');
const band = (i: number, l: 'de' | 'en') => { const s = C.stufen[i], lo = i ? C.stufen[i - 1].bis : 0; return s.bis === null ? (l === 'de' ? `ab ${lo}` : `${lo} or more`) : i === 0 ? (l === 'de' ? `unter ${s.bis}` : `below ${s.bis}`) : `${lo} – ${s.bis}`; };

export default defineGuide({
  id: 'co2-kosten-rechner',
  group: 'rechner',
  order: 90,
  tool: 'co2',
  related: ['heizkostenabrechnung', 'nebenkostenabrechnung-pruefen', 'nebenkosten', 'modernisierung-rechner'],
  sources: ['co2kostaufg', 'co2kostaufg5', 'co2kostaufg7', 'co2kostaufg9', 'behg10'],
  de: {
    slug: 'co2-kosten-aufteilung',
    nav: 'CO2-Kosten-Aufteilung',
    card: 'Anteil von Mieter und Vermieter nach dem Stufenmodell.',
    title: 'CO2-Kosten Aufteilung 2026: Anteil von Mieter und Vermieter',
    description: 'CO2-Kosten-Aufteilung 2026 nach dem Stufenmodell des CO2KostAufG: Ausstoß je m², Stufe 1 bis 10, Anteil des Vermieters in Euro und Kürzungsrecht von 3 Prozent.',
    h1: 'CO2-Kosten: Wie viel davon muss Ihr Vermieter tragen?',
    intro: 'Drei Werte aus der Heizkostenabrechnung genügen: CO2-Ausstoß des Gebäudes, Wohnfläche und Ihre CO2-Kosten.',
    resume: `Seit 2023 teilen Mieter und Vermieter die Kosten des CO2-Preises für Heizung und Warmwasser nach einem Stufenmodell auf, das im Kohlendioxidkostenaufteilungsgesetz steht. Je schlechter das Gebäude, desto mehr trägt der Vermieter: Bei weniger als 12 Kilogramm CO2 je Quadratmeter Wohnfläche und Jahr zahlt der Mieter alles, ab 52 Kilogramm nur noch 5 Prozent. Der Vermieter muss den Ausstoß bei der Heizkostenabrechnung ermitteln, auf eine Nachkommastelle runden und die Einstufung angeben. Beispiel: Ein Haus mit 960 m² Wohnfläche hat ${nD(24000)} kg CO2 ausgestoßen, ${nD(r.kgM2)} kg je Quadratmeter. Das ist Stufe ${r.stufe}: Der Mieter trägt ${pD(r.mieterAnteil)}, der Vermieter ${pD(r.vermieterAnteil)}. Von ${eD(95, 0)} CO2-Kosten Ihrer Wohnung übernimmt der Vermieter ${eD(r.vermieter)}. Fehlt die Aufteilung in der Abrechnung, dürfen Sie Ihren Heizkostenanteil um ${pD(C.kuerzung)} kürzen. Der CO2-Preis lag 2025 bei ${C.behg_preis['2025']} Euro je Tonne; für 2026 gilt ein Korridor von ${C.behg_2026_min} bis ${C.behg_2026_max} Euro.`,
    faqs: [
      { q: 'Wo finde ich den CO2-Ausstoß meines Hauses?', a: 'In der Heizkostenabrechnung: Der Vermieter muss den Anteil an den CO2-Kosten, die Einstufung des Gebäudes und die Berechnungsgrundlagen ausweisen (§ 7 Abs. 3 CO2KostAufG). Die Brennstofflieferanten geben den Ausstoß auf ihren Rechnungen an. Versorgen Sie sich mit einer Gasetagenheizung selbst, rechnen Sie selbst und fordern den Vermieteranteil von ihm an.' },
      { q: 'Muss der Vermieter auch bei einem Denkmal etwas zahlen?', a: `Ja, aber weniger. Verhindern öffentlich-rechtliche Vorgaben wie Denkmalschutz, ein Anschlusszwang an Fernwärme oder eine Erhaltungssatzung eine wesentliche Verbesserung, halbiert sich sein Anteil (§ 9 CO2KostAufG). In Stufe 10 trägt er dann ${pD(denk.vermieterAnteil)} statt ${pD(alt.vermieterAnteil)}. Sind Gebäude und Heizung zugleich betroffen, entfällt die Aufteilung. Die Umstände muss er nachweisen.` },
      { q: 'Lohnt sich der Blick auf die Stufe auch bei einem guten Gebäude?', a: `Nur zur Kontrolle. Mit ${nD(gut.kgM2)} kg je Quadratmeter liegt ein gut gedämmtes Haus in Stufe ${gut.stufe}, und der Mieter trägt ${pD(gut.mieterAnteil)} seiner CO2-Kosten. Prüfen sollten Sie dann, ob die Fläche stimmt: Je kleiner die angesetzte Wohnfläche, desto höher der Wert je Quadratmeter und desto mehr muss der Vermieter tragen.` },
    ],
    body: (h) => `
<h2>Das Stufenmodell</h2>
${h.table(['kg CO2 je m² und Jahr', 'Anteil Mieter', 'Anteil Vermieter'], C.stufen.map((s, i) => [band(i, 'de'), h.pct(s.mieter, 0), h.pct(1 - s.mieter, 0)]), 'Anlage zum Kohlendioxidkostenaufteilungsgesetz, Wohngebäude', ['l', 'r', 'r'])}
<p>Der Rechner teilt den Ausstoß des Gebäudes durch die Wohnfläche, rundet auf eine Nachkommastelle, wie ${h.src('co2kostaufg5', '§ 5 CO2KostAufG')} es vorschreibt, und sucht die Stufe in der ${h.src('co2kostaufg', 'Anlage')}. Mit dem Anteil des Vermieters multipliziert er Ihre CO2-Kosten vor der Aufteilung. Den Abschlag nach ${h.src('co2kostaufg9', '§ 9')} wählen Sie selbst, wenn die Abrechnung sich auf Denkmalschutz, Anschlusszwang oder eine Erhaltungssatzung beruft.</p>
<h2>Wenn die Aufteilung fehlt</h2>
<p>Bestimmt der Vermieter Ihren Anteil nicht oder fehlen die Angaben in der Abrechnung, dürfen Sie den auf Sie entfallenden Anteil an den Heizkosten um drei Prozent kürzen (${h.src('co2kostaufg7', '§ 7 Abs. 4 CO2KostAufG')}). Dieses Kürzungsrecht tritt neben die Kürzungsrechte der Heizkostenverordnung, die die Seite zur ${h.a('heizkostenabrechnung', 'Heizkostenabrechnung')} erklärt. Der CO2-Preis selbst folgt aus ${h.src('behg10', '§ 10 BEHG')}: ${C.behg_preis['2024']} Euro je Tonne 2024, ${C.behg_preis['2025']} Euro 2025, und 2026 werden die Zertifikate innerhalb eines Korridors von ${C.behg_2026_min} bis ${C.behg_2026_max} Euro versteigert.</p>
`,
  },
  en: {
    slug: 'co2-cost-split',
    nav: 'CO2 cost split',
    card: 'Tenant and landlord shares under the ten-step model.',
    title: 'CO2 Cost Split Germany 2026: Tenant and Landlord Shares',
    description: 'CO2 cost split 2026 for German rentals under the ten-step model: emissions per m², step 1 to 10, the landlord share in euros and the 3 per cent deduction.',
    h1: 'CO2 costs: how much must your landlord pay?',
    intro: 'Three figures from your heating statement are enough: the building’s CO2 emissions, its floor area and your CO2 costs.',
    resume: `Since 2023, tenants and landlords in Germany share the cost of the CO2 price on heating and hot water under a ten-step model set out in the Carbon Cost Allocation Act (Kohlendioxidkostenaufteilungsgesetz, CO2KostAufG). The worse the building, the more the landlord pays: below 12 kilograms of CO2 per square metre of floor area a year the tenant pays everything, from 52 kilograms only 5 per cent. The landlord must work out the emissions with the heating statement, round them to one decimal and state the step. Example: a building with 960 m² of floor area emitted ${nE(24000)} kg of CO2, ${nE(r.kgM2)} kg per square metre. That is step ${r.stufe}: the tenant bears ${pE(r.mieterAnteil)}, the landlord ${pE(r.vermieterAnteil)}. Of your flat's ${eE(95, 0)} CO2 costs the landlord covers ${eE(r.vermieter)}. If the statement lacks the split, you may cut your heating share by ${pE(C.kuerzung)}. The CO2 price was ${C.behg_preis['2025']} euros a tonne in 2025; for 2026 a corridor of ${C.behg_2026_min} to ${C.behg_2026_max} euros applies.`,
    faqs: [
      { q: 'Where do I find my building’s CO2 emissions?', a: 'In the heating statement: the landlord must show the CO2 share, the building’s step and the basis of the calculation (Section 7(3) CO2KostAufG). Fuel suppliers state the emissions on their invoices. If you heat your flat yourself, for instance with a gas boiler in the flat, you do the calculation and claim the landlord’s share from him.' },
      { q: 'Does the landlord pay anything for a listed building?', a: `Yes, but less. If public-law rules such as listed-building protection, a duty to connect to district heating or a conservation by-law prevent a substantial improvement, his share is halved (Section 9 CO2KostAufG). At step 10 he then bears ${pE(denk.vermieterAnteil)} instead of ${pE(alt.vermieterAnteil)}. If both the building and the heating are affected, there is no split at all. He must prove the circumstances.` },
      { q: 'Is the step worth checking in a well-insulated building?', a: `Only as a check. At ${nE(gut.kgM2)} kg per square metre a well-insulated building sits at step ${gut.stufe}, and the tenant bears ${pE(gut.mieterAnteil)} of his CO2 costs. What is worth checking then is the floor area: the smaller the area used, the higher the value per square metre and the more the landlord must bear.` },
    ],
    body: (h) => `
<h2>The ten-step model</h2>
${h.table(['kg CO2 per m² a year', 'tenant share', 'landlord share'], C.stufen.map((s, i) => [band(i, 'en'), h.pct(s.mieter, 0), h.pct(1 - s.mieter, 0)]), 'Annex to the Carbon Cost Allocation Act, residential buildings', ['l', 'r', 'r'])}
<p>The calculator divides the building's emissions by its floor area, rounds to one decimal as ${h.src('co2kostaufg5', 'Section 5 CO2KostAufG')} requires, and looks up the step in the ${h.src('co2kostaufg', 'annex')}. It multiplies your CO2 costs before the split by the landlord's share. You choose the reduction under ${h.src('co2kostaufg9', 'Section 9')} yourself if the statement relies on listed status, a connection duty or a conservation by-law.</p>
<h2>When the split is missing</h2>
<p>If the landlord does not work out your share or the statement lacks the details, you may cut your share of the heating costs by three per cent (${h.src('co2kostaufg7', 'Section 7(4) CO2KostAufG')}). This comes on top of the deduction rights in the Heating Costs Ordinance explained on the ${h.a('heizkostenabrechnung', 'heating statement')} page. The CO2 price itself follows from ${h.src('behg10', 'Section 10 of the Fuel Emissions Trading Act')}: ${C.behg_preis['2024']} euros a tonne in 2024, ${C.behg_preis['2025']} euros in 2025, and in 2026 certificates are auctioned within a corridor of ${C.behg_2026_min} to ${C.behg_2026_max} euros.</p>
`,
  },
});
