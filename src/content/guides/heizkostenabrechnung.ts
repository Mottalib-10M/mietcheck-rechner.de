import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { heizkostenKuerzung } from '../../lib/engine/miete';
import { formatMoney } from '../../lib/format';

const H = P.heizkosten;
// Beispielhaus : 18 000 € Heizkosten, 960 m², 30 000 Verbrauchseinheiten.
// Wohnung : 72 m² und 2 700 Einheiten (überdurchschnittlicher Verbrauch).
const KOSTEN = 18000, FL_HAUS = 960, FL_WHG = 72, EH_HAUS = 30000, EH_WHG = 2700;
const verteilung = (vq: number) => {
  const verbrauch = KOSTEN * vq * EH_WHG / EH_HAUS;
  const flaeche = KOSTEN * (1 - vq) * FL_WHG / FL_HAUS;
  return { vq, verbrauch, flaeche, summe: verbrauch + flaeche };
};
const V50 = verteilung(H.verbrauch_min), V70 = verteilung(H.verbrauch_max);
const nurFlaeche = KOSTEN * FL_WHG / FL_HAUS;
// Kürzungen auf den Anteil der Wohnung bei 70 % Verbrauch.
const ANTEIL = Math.round(V70.summe * 100) / 100;
const FAELLE = [
  { de: 'Abrechnung vollständig', en: 'statement complete', o: {} },
  { de: 'monatliche Verbrauchsinformation fehlt', en: 'monthly consumption information missing', o: { ohneInfo: true } },
  { de: 'CO2-Aufteilung fehlt', en: 'CO2 split missing', o: { ohneCo2Aufteilung: true } },
  { de: 'beides fehlt', en: 'both missing', o: { ohneInfo: true, ohneCo2Aufteilung: true } },
  { de: 'nicht nach Verbrauch abgerechnet', en: 'not billed by consumption', o: { nichtVerbrauchsabhaengig: true } },
].map((f) => ({ ...f, r: heizkostenKuerzung({ anteil: ANTEIL, ...f.o }) }));
const info = FAELLE[1].r, co2 = FAELLE[2].r, pausch = FAELLE[4].r;
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const p = (x: number) => Math.round(x * 100);

export default defineGuide({
  id: 'heizkostenabrechnung',
  group: 'nebenkosten',
  order: 30,
  mini: 'heizkuerzung',
  miniHref: 'co2-kosten-rechner',
  related: ['co2-kosten-rechner', 'nebenkostenabrechnung', 'nebenkosten', 'nebenkosten-nachzahlung', 'nebenkostenabrechnung-pruefen'],
  sources: ['heizkostenv7', 'heizkostenv12', 'heizkostenv6a', 'co2kostaufg7', 'co2kostaufg'],
  de: {
    slug: 'heizkostenabrechnung',
    nav: 'Heizkostenabrechnung',
    card: 'Verbrauchsanteil, Verbrauchsinformation und Ihre Kürzungsrechte.',
    title: 'Heizkostenabrechnung 2026: Verbrauchsanteil, Kürzungsrecht',
    description: 'Heizkostenabrechnung 2026: 50 bis 70 Prozent nach Verbrauch, monatliche Verbrauchsinformation, CO2-Kosten und die Kürzung um 15 oder 3 Prozent nach HeizkostenV.',
    h1: 'Heizkostenabrechnung: wie verteilt wird und wann Sie kürzen dürfen',
    intro: 'Bei Heizung und Warmwasser bestimmt Ihr eigener Verbrauch den größeren Teil der Rechnung, und Versäumnisse des Vermieters kosten ihn bares Geld.',
    resume: `Für zentral beheizte Häuser schreibt die Heizkostenverordnung vor, dass mindestens ${p(H.verbrauch_min)} und höchstens ${p(H.verbrauch_max)} Prozent der Heizkosten nach dem erfassten Verbrauch verteilt werden; der Rest geht nach Wohnfläche (§ 7 HeizkostenV). In einem Haus mit ${eD(KOSTEN, 0)} Heizkosten zahlt eine Wohnung mit ${FL_WHG} von ${FL_HAUS} m² und ${p(EH_WHG / EH_HAUS)} Prozent des Verbrauchs bei der Verteilung ${p(H.verbrauch_min)} zu ${100 - p(H.verbrauch_min)} genau ${eD(V50.summe)}, bei ${p(H.verbrauch_max)} zu ${100 - p(H.verbrauch_max)} schon ${eD(V70.summe)}. Rechnet der Vermieter entgegen der Verordnung nicht nach Verbrauch ab, dürfen Sie Ihren Anteil um ${p(H.kuerzung_pauschal)} Prozent kürzen (§ 12 Abs. 1). Fehlt die monatliche Verbrauchsinformation, die bei fernablesbaren Zählern seit Januar 2022 Pflicht ist, sind es ${p(H.kuerzung_info)} Prozent. Weitere ${p(P.co2.kuerzung)} Prozent erlaubt § 7 Abs. 4 CO2KostAufG, wenn die Aufteilung der CO2-Kosten fehlt. Auf einen Anteil von ${eD(ANTEIL)} bedeuten fehlende Verbrauchsinformation und fehlende CO2-Aufteilung zusammen ${eD(FAELLE[3].r.betrag)} weniger.`,
    faqs: [
      { q: 'Wie viel Prozent der Heizkosten müssen nach Verbrauch abgerechnet werden?', a: `Zwischen ${p(H.verbrauch_min)} und ${p(H.verbrauch_max)} Prozent, den Wert innerhalb dieser Spanne legt der Vermieter fest. Genau ${p(H.verbrauch_max)} Prozent sind Pflicht in Häusern, die den Wärmeschutz von 1994 nicht erreichen, mit Öl oder Gas heizen und deren frei liegende Leitungen überwiegend gedämmt sind. Der übrige Teil wird nach Wohn- oder Nutzfläche oder nach umbautem Raum verteilt, so steht es in § 7 Abs. 1 HeizkostenV.` },
      { q: 'Was muss in der monatlichen Verbrauchsinformation stehen?', a: 'Nach § 6a Abs. 2 HeizkostenV mindestens Ihr Verbrauch im letzten Monat in Kilowattstunden, ein Vergleich mit dem Vormonat und mit demselben Monat des Vorjahres, soweit diese Daten vorliegen, und ein Vergleich mit einem normierten oder durch Vergleichstests ermittelten Durchschnittsnutzer derselben Nutzerkategorie. Die Pflicht gilt, wenn fernablesbare Zähler oder Heizkostenverteiler eingebaut sind. Fehlt sie, gibt Ihnen § 12 ein eigenes Kürzungsrecht.' },
      { q: 'Um wie viel darf ich die Heizkosten kürzen, wenn nicht nach Verbrauch abgerechnet wird?', a: `Um ${p(H.kuerzung_pauschal)} Prozent des auf Sie entfallenden Anteils, nach § 12 Abs. 1 Satz 1 HeizkostenV. Das gilt, wenn Zähler fehlen, nicht abgelesen wurden oder der Vermieter trotz Zählern alles nach Fläche verteilt. Bei einem Anteil von ${eD(ANTEIL)} sind das ${eD(pausch.betrag)}. Die Kürzung erklären Sie dem Vermieter schriftlich und ziehen den Betrag von der Nachzahlung ab oder verlangen ihn zurück.` },
      { q: 'Was passiert, wenn in der Heizkostenabrechnung die CO2-Kosten fehlen?', a: `Der Vermieter muss in der Heizkostenabrechnung Ihren Anteil an den CO2-Kosten, die Einstufung des Gebäudes und die Berechnungsgrundlagen ausweisen (§ 7 Abs. 3 CO2KostAufG). Fehlt das, dürfen Sie Ihren Heizkostenanteil um ${p(P.co2.kuerzung)} Prozent kürzen, im Beispiel um ${eD(co2.betrag)}. Wie viel der Vermieter eigentlich hätte übernehmen müssen, zeigt der CO2-Kosten-Rechner; oft ist das mehr als die Kürzung.` },
      { q: 'Gilt das Kürzungsrecht auch in einer vermieteten Eigentumswohnung?', a: 'Ja, im Verhältnis zwischen Ihnen und Ihrem Vermieter. § 12 Abs. 1 Satz 4 HeizkostenV nimmt nur das Verhältnis zwischen dem einzelnen Wohnungseigentümer und der Eigentümergemeinschaft aus. Rechnet die Gemeinschaft gegenüber Ihrem Vermieter nicht nach Verbrauch ab, kann er sich dort nicht auf die Kürzung berufen, Sie ihm gegenüber aber schon.' },
      { q: 'Warum wird ein Teil der Heizkosten nach Wohnfläche verteilt?', a: 'Weil nicht alle Wärme in der Wohnung ankommt, die der Kessel erzeugt: Leitungen im Keller und im Treppenhaus geben Wärme ab, und auch eine Wohnung mit kalten Heizkörpern wird von den Nachbarwohnungen mitgewärmt. Der Flächenanteil, die sogenannten Grundkosten, bildet diese verbrauchsunabhängige Wärme ab. Je höher der Verbrauchsanteil, desto stärker lohnt sich sparsames Heizen.' },
    ],
    body: (h) => `
<h2>Die Verteilung nach § 7 HeizkostenV</h2>
<p>Die Heizkostenverordnung gilt für Häuser mit zentraler Heizung oder Wärmelieferung, also Fernwärme oder Contracting. Sie geht dem Mietvertrag vor: Auch wenn dort etwas anderes steht, muss nach ${h.src('heizkostenv7', '§ 7 Abs. 1 HeizkostenV')} ein Anteil von mindestens ${h.pct(H.verbrauch_min, 0)} und höchstens ${h.pct(H.verbrauch_max, 0)} der Kosten nach dem erfassten Wärmeverbrauch verteilt werden. Den Rest, die Grundkosten, verteilt der Vermieter nach der Wohn- oder Nutzfläche oder nach dem umbauten Raum; er kann auch nur die Fläche der beheizten Räume zugrunde legen. In älteren Häusern mit Öl- oder Gasheizung, die das Anforderungsniveau der Wärmeschutzverordnung von 1994 nicht erfüllen und deren frei liegende Leitungen überwiegend gedämmt sind, ist der Verbrauchsanteil auf genau ${h.pct(H.verbrauch_max, 0)} festgelegt.</p>
<p>Was zu den Heizkosten gehört, zählt § 7 Abs. 2 auf: Brennstoff und Lieferung, Strom für die Wärmeerzeugung, Betriebsstrom, Bedienung, Überwachung und Pflege, Prüfung und Einstellung durch eine Fachkraft, Reinigung von Anlage und Heizraum, Immissionsschutzmessungen, Miete und Eichung der Messgeräte sowie die Kosten von Abrechnung und Verbrauchsinformation. Reparaturen gehören nicht dazu.</p>

<h2>Beispiel: was der Verbrauchsanteil ausmacht</h2>
<p>Ein Haus mit ${h.num(FL_HAUS)} m² verbraucht im Jahr Wärme für ${h.eur(KOSTEN, 0)}. Die Wohnung hat ${h.num(FL_WHG)} m², also ${h.pct(FL_WHG / FL_HAUS, 1)} der Fläche, aber ${h.num(EH_WHG)} von ${h.num(EH_HAUS)} abgelesenen Einheiten, also ${h.pct(EH_WHG / EH_HAUS, 0)} des Verbrauchs.</p>
${h.table(['Verteilung', 'nach Verbrauch', 'nach Fläche', 'Anteil der Wohnung'], [
  [`${h.pct(V50.vq, 0)} zu ${h.pct(1 - V50.vq, 0)}`, h.eur(V50.verbrauch, 2), h.eur(V50.flaeche, 2), h.eur(V50.summe, 2)],
  [`${h.pct(V70.vq, 0)} zu ${h.pct(1 - V70.vq, 0)}`, h.eur(V70.verbrauch, 2), h.eur(V70.flaeche, 2), h.eur(V70.summe, 2)],
  ['nur nach Fläche (unzulässig)', '', h.eur(nurFlaeche, 2), h.eur(nurFlaeche, 2)],
], 'Heizkostenanteil einer Wohnung mit überdurchschnittlichem Verbrauch', ['l', 'r', 'r', 'r'])}
<p>Wer mehr verbraucht als der Durchschnitt, zahlt bei einem hohen Verbrauchsanteil mehr; wer sparsam heizt, profitiert. Die letzte Zeile zeigt, warum eine reine Flächenverteilung dem sparsamen Nachbarn schadet und deshalb verboten ist. Prüfen Sie in Ihrer Abrechnung, welcher Prozentsatz angewendet wurde, ob Ihre abgelesenen Einheiten mit den Werten auf Ihrem Ableseprotokoll oder in der Verbrauchsinformation übereinstimmen und ob die Summe aller Einheiten plausibel ist.</p>

<h2>Monatliche Verbrauchsinformation nach § 6a</h2>
<p>Sind fernablesbare Zähler oder Heizkostenverteiler eingebaut, muss der Gebäudeeigentümer Ihnen seit dem 1. Januar 2022 monatlich mitteilen, wie viel Sie verbraucht haben (${h.src('heizkostenv6a', '§ 6a HeizkostenV')}). Die Mitteilung muss mindestens enthalten:</p>
<ul>
<li>Ihren Verbrauch im letzten Monat in Kilowattstunden,</li>
<li>den Vergleich mit Ihrem Vormonat und mit demselben Monat des Vorjahres, soweit die Daten erhoben wurden,</li>
<li>den Vergleich mit einem normierten oder durch Vergleichstests ermittelten Durchschnittsnutzer derselben Nutzerkategorie.</li>
</ul>
<p>Mit der Jahresabrechnung muss er Ihnen außerdem Informationen über den Anteil der eingesetzten Energieträger, die erhobenen Steuern und Abgaben, die Entgelte für Messgeräte, Ablesung und Abrechnung sowie Kontaktadressen von Verbraucherorganisationen und Energieagenturen zugänglich machen (§ 6a Abs. 3). Bei Fernwärme gehören die Treibhausgasemissionen und der Primärenergiefaktor des Netzes dazu.</p>

<h2>Ihre Kürzungsrechte</h2>
<p>Die Verordnung setzt bei Versäumnissen auf Kürzungsrechte: Der Vermieter verliert Geld aus der Abrechnung. ${h.src('heizkostenv12', '§ 12 Abs. 1 HeizkostenV')} kennt zwei Stufen. Wird entgegen der Verordnung nicht verbrauchsabhängig abgerechnet, dürfen Sie Ihren Anteil um ${h.pct(H.kuerzung_pauschal, 0)} kürzen. Hat der Eigentümer entgegen § 5 Abs. 2 oder 3 keine fernablesbaren Geräte eingebaut, oder teilt er die Informationen nach § 6a nicht oder nicht vollständig mit, sind es ${h.pct(H.kuerzung_info, 0)}. Hinzu kommt ein eigenes Kürzungsrecht nach ${h.src('co2kostaufg7', '§ 7 Abs. 4 CO2KostAufG')}: ${h.pct(P.co2.kuerzung, 0)} des Heizkostenanteils, wenn der Vermieter die CO2-Kosten nicht aufteilt oder Einstufung und Berechnungsgrundlagen nicht ausweist.</p>
${h.table(['Fall', 'Kürzung', 'Betrag', 'verbleibt'], FAELLE.map((f) => [f.de, h.pct(f.r.quote, 0), h.eur(f.r.betrag, 2), h.eur(f.r.rest, 2)]), `Kürzungen auf einen Heizkostenanteil von ${h.eur(ANTEIL, 2)}`, ['l', 'r', 'r', 'r'])}
<p>Die Kürzungsrechte stehen in verschiedenen Vorschriften und knüpfen an verschiedene Versäumnisse an; der kleine Rechner oben zählt sie zusammen, wenn mehrere zutreffen. Erklären Sie die Kürzung schriftlich, nennen Sie den Grund und den Betrag, und ziehen Sie ihn von einer Nachzahlung ab oder fordern Sie ihn aus einem Guthaben zusätzlich. Die Einwendungsfrist von zwölf Monaten nach Zugang gilt auch hier, wie auf der Seite zur ${h.a('nebenkostenabrechnung', 'Nebenkostenabrechnung')} beschrieben.</p>

<h2>CO2-Kosten in der Heizkostenabrechnung</h2>
<p>Seit 2023 teilen Vermieter und Mieter die CO2-Abgabe auf Öl und Gas nach einem ${h.src('co2kostaufg', 'Stufenmodell')}: Je schlechter das Gebäude, desto mehr trägt der Vermieter. Die Abrechnung muss Ihren Anteil, die Einstufung des Gebäudes und die Berechnungsgrundlagen ausweisen. Die Kürzung um ${h.pct(P.co2.kuerzung, 0)} ist oft weniger wert als die richtige Aufteilung: In einem schlecht gedämmten Haus muss der Vermieter einen großen Teil der CO2-Kosten selbst tragen. Rechnen Sie deshalb beides mit dem ${h.a('co2-kosten-rechner', 'CO2-Kosten-Rechner')} nach und verlangen Sie den höheren Betrag.</p>
<p>Wärmepumpen sind ein Sonderfall: Wird ihr Verbrauch noch nicht erfasst, musste der Eigentümer bis zum 30. September 2025 Messgeräte einbauen; die Verordnung gilt dann ab dem nächsten Abrechnungszeitraum (§ 12 Abs. 3). Ergibt die Heizkostenabrechnung eine Nachzahlung, lesen Sie weiter bei ${h.a('nebenkosten-nachzahlung', 'Nebenkosten-Nachzahlung')}.</p>
`,
  },
  en: {
    slug: 'heating-cost-statement',
    nav: 'Heating-cost statement',
    card: 'Consumption share, monthly usage information and your right to deduct.',
    title: 'Heating Cost Statement 2026: Consumption Split, Deductions',
    description: 'Heating cost statement 2026: 50 to 70 per cent by consumption, monthly usage reports, CO2 costs, and when you may deduct 15 or 3 per cent as a tenant.',
    h1: 'Heating-cost statement: how costs are split and when you can deduct',
    intro: 'For heating and hot water, your own consumption drives most of the bill, and a landlord who skips the rules loses real money.',
    resume: `In buildings with central heating, the German Heating Costs Ordinance (Heizkostenverordnung, HeizkostenV) requires at least ${p(H.verbrauch_min)} and at most ${p(H.verbrauch_max)} per cent of heating costs to be split by metered consumption, with the rest split by floor area (Section 7). In a building with ${eE(KOSTEN, 0)} of heating costs, a flat with ${FL_WHG} of ${FL_HAUS} m² and ${p(EH_WHG / EH_HAUS)} per cent of the consumption pays ${eE(V50.summe)} under a ${p(H.verbrauch_min)}/${100 - p(H.verbrauch_min)} split and ${eE(V70.summe)} under ${p(H.verbrauch_max)}/${100 - p(H.verbrauch_max)}. If the landlord does not bill by consumption as the ordinance requires, you may cut your share by ${p(H.kuerzung_pauschal)} per cent (Section 12(1)). If the monthly usage report is missing, compulsory with remotely read meters since January 2022, the cut is ${p(H.kuerzung_info)} per cent. A further ${p(P.co2.kuerzung)} per cent is allowed under Section 7(4) of the Carbon Cost Allocation Act (CO2KostAufG) if the CO2 cost split is missing. On a share of ${eE(ANTEIL)}, a missing usage report plus a missing CO2 split together mean ${eE(FAELLE[3].r.betrag)} less to pay.`,
    faqs: [
      { q: 'What share of heating costs must follow actual consumption?', a: `Between ${p(H.verbrauch_min)} and ${p(H.verbrauch_max)} per cent; the landlord picks the figure within that range. Exactly ${p(H.verbrauch_max)} per cent is mandatory in older oil- or gas-heated buildings that do not meet the 1994 insulation standard and whose exposed pipes are mostly insulated. The remainder is split by floor area or by enclosed volume, as Section 7(1) of the Heating Costs Ordinance sets out.` },
      { q: 'What must the monthly heating usage report contain?', a: 'Under Section 6a(2) of the ordinance, at least your consumption in the last month in kilowatt hours, a comparison with the previous month and with the same month a year earlier where data exist, and a comparison with a standardised or benchmarked average user of the same category. The duty applies once remotely readable meters or heat cost allocators are installed. If it is missing, Section 12 gives you a separate right to deduct.' },
      { q: 'How much can I deduct if heating is not billed by consumption?', a: `${p(H.kuerzung_pauschal)} per cent of your share, under Section 12(1), first sentence, of the ordinance. This applies where meters are missing, were not read, or the landlord ignored them and split everything by area. On a share of ${eE(ANTEIL)} that is ${eE(pausch.betrag)}. Tell the landlord in writing, then deduct the amount from any balance due or claim it back.` },
      { q: 'What can I do if the CO2 costs are not shown on my heating bill?', a: `The landlord must show your share of CO2 costs, the building’s classification and the basis of calculation in the heating statement (Section 7(3) CO2KostAufG). If he does not, you may reduce your heating share by ${p(P.co2.kuerzung)} per cent, ${eE(co2.betrag)} in our example. The CO2 cost calculator shows how much the landlord should have borne; that is often more than the deduction.` },
      { q: 'Do these deduction rights apply if I rent a condominium flat?', a: 'Yes, between you and your landlord. Section 12(1), fourth sentence, only excludes the relationship between an individual flat owner and the owners’ association (Wohnungseigentümergemeinschaft). If the association bills your landlord without consumption metering, he cannot deduct against the association, but you can still deduct against him.' },
      { q: 'Why is part of the heating bill split by floor area?', a: 'Because not all the heat the boiler produces reaches individual flats: pipes in the cellar and stairwell give off heat, and a flat with cold radiators is still warmed by its neighbours. The area-based part, the fixed or basic costs (Grundkosten), reflects this shared heat. The higher the consumption share, the more it pays to heat sparingly.' },
    ],
    body: (h) => `
<h2>How Section 7 of the ordinance splits the bill</h2>
<p>The Heating Costs Ordinance applies to buildings with central heating or supplied heat, such as district heating or contracting. It overrides the lease: whatever your contract says, ${h.src('heizkostenv7', 'Section 7(1) HeizkostenV')} requires at least ${h.pct(H.verbrauch_min, 0)} and at most ${h.pct(H.verbrauch_max, 0)} of costs to be split by metered heat consumption. The rest, the basic costs, is split by living or usable floor area or by enclosed volume; the landlord may also use only the area of heated rooms. In older buildings heated by oil or gas that fall short of the 1994 Thermal Insulation Ordinance and whose exposed pipes are mostly insulated, the consumption share is fixed at exactly ${h.pct(H.verbrauch_max, 0)}.</p>
<p>Section 7(2) lists what heating costs include: fuel and delivery, power used to generate heat, operating power, operation, supervision and care, inspection and adjustment by a specialist, cleaning of the system and boiler room, emission measurements, rental and calibration of meters, and the costs of billing and usage reports. Repairs are not included.</p>

<h2>Example: what the consumption share changes</h2>
<p>A building of ${h.num(FL_HAUS)} m² uses ${h.eur(KOSTEN, 0)} of heat a year. The flat has ${h.num(FL_WHG)} m², ${h.pct(FL_WHG / FL_HAUS, 1)} of the area, but ${h.num(EH_WHG)} of ${h.num(EH_HAUS)} metered units, ${h.pct(EH_WHG / EH_HAUS, 0)} of consumption.</p>
${h.table(['Split', 'by consumption', 'by area', 'Flat’s share'], [
  [`${h.pct(V50.vq, 0)} / ${h.pct(1 - V50.vq, 0)}`, h.eur(V50.verbrauch, 2), h.eur(V50.flaeche, 2), h.eur(V50.summe, 2)],
  [`${h.pct(V70.vq, 0)} / ${h.pct(1 - V70.vq, 0)}`, h.eur(V70.verbrauch, 2), h.eur(V70.flaeche, 2), h.eur(V70.summe, 2)],
  ['area only (not allowed)', '', h.eur(nurFlaeche, 2), h.eur(nurFlaeche, 2)],
], 'Heating share of a flat with above-average consumption', ['l', 'r', 'r', 'r'])}
<p>Heavy users pay more under a high consumption share; careful users gain. The last row shows why a pure area split penalises thrifty neighbours and is therefore banned. On your own statement, check which percentage was used, whether your metered units match your reading record or monthly report, and whether the building total looks plausible.</p>

<h2>Monthly usage reports under Section 6a</h2>
<p>Where remotely readable meters or heat cost allocators are installed, the owner has had to tell you every month since 1 January 2022 how much you used (${h.src('heizkostenv6a', 'Section 6a HeizkostenV')}). The report must include at least:</p>
<ul>
<li>your consumption last month in kilowatt hours,</li>
<li>a comparison with your previous month and with the same month last year, where the data were collected,</li>
<li>a comparison with a standardised or benchmarked average user of the same category.</li>
</ul>
<p>With the annual statement he must also give you information on the mix of energy sources, taxes and levies charged, fees for meters, reading and billing, and contact details of consumer organisations and energy agencies (Section 6a(3)). For district heating this includes the network’s greenhouse gas emissions and primary energy factor.</p>

<h2>Your right to deduct</h2>
<p>The ordinance enforces itself through deductions: a landlord who skips a duty loses money from the statement. ${h.src('heizkostenv12', 'Section 12(1) HeizkostenV')} has two levels. If costs are not billed by consumption as required, you may cut your share by ${h.pct(H.kuerzung_pauschal, 0)}. If the owner has failed to fit remotely readable devices as Section 5(2) or (3) requires, or does not provide the Section 6a information in full, the cut is ${h.pct(H.kuerzung_info, 0)}. On top comes a separate right in ${h.src('co2kostaufg7', 'Section 7(4) CO2KostAufG')}: ${h.pct(P.co2.kuerzung, 0)} of your heating share if the landlord does not split CO2 costs or does not show the classification and calculation basis.</p>
${h.table(['Case', 'Deduction', 'Amount', 'Left to pay'], FAELLE.map((f) => [f.en, h.pct(f.r.quote, 0), h.eur(f.r.betrag, 2), h.eur(f.r.rest, 2)]), `Deductions on a heating share of ${h.eur(ANTEIL, 2)}`, ['l', 'r', 'r', 'r'])}
<p>The deduction rights sit in different provisions and attach to different failures; the small calculator above adds them up where several apply. Announce the deduction in writing, giving reason and amount, and take it off any balance due or claim it on top of a credit. The twelve-month objection period after receipt applies here too, as explained on the ${h.a('nebenkostenabrechnung', 'service-charge statement page')}.</p>

<h2>CO2 costs in the heating statement</h2>
<p>Since 2023, landlord and tenant share the CO2 levy on oil and gas according to a ${h.src('co2kostaufg', 'ten-step model')}: the worse the building, the more the landlord bears. The statement must show your share, the building’s step and the calculation basis. The ${h.pct(P.co2.kuerzung, 0)} deduction is often worth less than a correct split, because in a poorly insulated building the landlord carries a large part of the CO2 cost. So run both through the ${h.a('co2-kosten-rechner', 'CO2 cost calculator')} and claim the higher figure.</p>
<p>Heat pumps are a special case: where their consumption was not yet metered, the owner had to install meters by 30 September 2025, and the ordinance then applies from the next billing period (Section 12(3)). If your heating statement ends in a balance to pay, continue with the ${h.a('nebenkosten-nachzahlung', 'service-charge top-up page')}.</p>
`,
  },
});
