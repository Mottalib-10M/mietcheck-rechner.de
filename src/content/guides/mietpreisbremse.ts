import { defineGuide } from '../../lib/guide-types';
import { P } from '../../lib/engine/params';
import { LAENDER_VO } from '../../lib/engine/gebiet';
import { mietpreisbremse } from '../../lib/engine/miete';
import { formatMoney, displayDate } from '../../lib/format';

const M = P.mpb;
const seite = (code: string) => ({ BE: 'mietspiegel-berlin', HH: 'mietspiegel-hamburg', HB: 'mietspiegel-bremen' } as Record<string, string>)[code] ?? `mpb-${code.toLowerCase()}`;
const mit = LAENDER_VO.filter((l) => l.mpb);
const ohne = LAENDER_VO.filter((l) => !l.mpb).map((l) => l.name);
const nGem = mit.reduce((s, l) => s + l.mpb!.gemeinden.length, 0);
const frueh = [...mit].sort((a, b) => (a.mpb!.teile[0].bis < b.mpb!.teile[0].bis ? -1 : 1))[0];
const a = mietpreisbremse({ ovm: 10, flaeche: 70, miete: 850, gebiet: true });
const vm = mietpreisbremse({ ovm: 10, flaeche: 70, miete: 850, gebiet: true, vormiete: 820 });
const mod = mietpreisbremse({ ovm: 10, flaeche: 70, miete: 850, gebiet: true, modZuschlag: 45 });
const eD = (x: number, d = 2) => formatMoney(x, d, 'de'), eE = (x: number, d = 2) => formatMoney(x, d, 'en');
const dD = (s: string) => displayDate(s, 'de-DE'), dE = (s: string) => displayDate(s, 'en-GB');

export default defineGuide({
  id: 'mietpreisbremse',
  group: 'erhoehung',
  order: 40,
  mini: 'mpb',
  miniHref: 'mietpreisbremse-rechner',
  related: ['mietpreisbremse-rechner', 'mietpreisbremse-ruege', 'vergleichsmiete', 'staffelmiete', 'mpb-by', 'mpb-nw'],
  sources: ['bgb556d', 'bgb556e', 'bgb556f', 'bgb556g', 'bgb549'],
  de: {
    slug: 'mietpreisbremse',
    nav: 'Mietpreisbremse',
    card: 'Wo sie gilt, bis wann, welche Ausnahmen es gibt.',
    title: 'Mietpreisbremse 2026: wo sie gilt, bis wann, mit Ausnahmen',
    description: `Mietpreisbremse 2026: höchstens zehn Prozent über der Vergleichsmiete in ${nGem} Gemeinden aus ${mit.length} Ländern, Laufzeiten bis 2029, Vormiete, Neubau und Rüge erklärt.`,
    h1: 'Mietpreisbremse: Regeln, Gebiete und Ausnahmen im Überblick',
    intro: 'Die Mietpreisbremse begrenzt nur die Miete bei Vertragsbeginn und nur dort, wo ein Land sie angeordnet hat.',
    resume: `Die Mietpreisbremse steht in den §§ 556d bis 556g BGB. Wer in einem Gebiet mit angespanntem Wohnungsmarkt einen Mietvertrag über Wohnraum schließt, darf zu Beginn höchstens die ortsübliche Vergleichsmiete plus ${M.aufschlag * 100} Prozent zahlen. Welche Gebiete das sind, bestimmen die Landesregierungen durch Verordnung; jede Verordnung muss spätestens am ${dD(M.vo_spaetestens_bis)} enden. Im Oktober 2026 haben ${mit.length} der 16 Länder eine solche Verordnung mit zusammen ${nGem} Gemeinden. ${ohne.join(', ')} haben keine. Die Grenze kennt vier Ausnahmen: eine höhere Vormiete, eine Modernisierung in den letzten drei Jahren, die erste Vermietung einer Wohnung, die nach dem 1. Oktober 2014 erstmals genutzt wurde, und die erste Vermietung nach umfassender Modernisierung. Bei einer Vergleichsmiete von ${eD(10, 0)} und 70 m² liegt die Grenze bei ${eD(a.zulaessig)}; wer ${eD(850, 0)} vereinbart, zahlt ${eD(a.ueberMonat)} zu viel und kann das nach einer Rüge zurückfordern. Spätere Mieterhöhungen regelt die Mietpreisbremse nicht; dafür gilt die Kappungsgrenze.`,
    faqs: [
      { q: 'Gilt die Mietpreisbremse auch für bestehende Mietverträge?', a: 'Nein. Sie begrenzt nur die Miete, die zu Beginn eines neuen Mietverhältnisses vereinbart wird. Für die Erhöhung einer laufenden Miete gelten die Vergleichsmiete und die Kappungsgrenze nach § 558 BGB. Wer schon länger in seiner Wohnung lebt, prüft eine Erhöhung deshalb mit dem Mieterhöhungsrechner, nicht mit dem Mietpreisbremse-Rechner.' },
      { q: 'Welches Land hat seine Mietpreisbremse am frühesten befristet?', a: `${frueh.name}: Die dortige Verordnung endet am ${dD(frueh.mpb!.teile[0].bis)}. Andere Länder wie Bayern, Berlin, Hamburg oder Nordrhein-Westfalen haben die Höchstdauer bis Ende 2029 ausgeschöpft. Ob ein Land rechtzeitig verlängert, lässt sich erst sagen, wenn die neue Verordnung verkündet ist; der Mietcheck rechnet nur mit verkündeten Texten.` },
      { q: 'Darf der Vermieter mehr verlangen, wenn der Vormieter mehr gezahlt hat?', a: `Ja, bis zur Höhe dieser Vormiete. Erhöhungen, die im letzten Jahr vor dem Ende des alten Mietverhältnisses vereinbart wurden, und Minderungen zählen dabei nicht. Im Beispiel mit 70 m² dürfte der Vermieter statt ${eD(a.zulaessig)} dann ${eD(vm.zulaessig)} verlangen, wenn der Vormieter zuletzt so viel schuldete. Er muss die Vormiete vor Vertragsschluss nennen.` },
      { q: 'Gilt die Mietpreisbremse für möblierte Wohnungen?', a: 'Grundsätzlich ja, wenn die Wohnung auf Dauer vermietet ist. Ausgenommen ist nach § 549 Abs. 2 BGB Wohnraum, der nur zum vorübergehenden Gebrauch vermietet wird, und möblierter Wohnraum in der vom Vermieter selbst bewohnten Wohnung. Für den Möblierungszuschlag gibt es keine amtliche Tabelle; er muss angemessen sein und darf die Grenze nicht unterlaufen.' },
      { q: 'Was passiert, wenn meine Miete über der Grenze liegt?', a: 'Der Vertrag bleibt gültig, nur die Vereinbarung über die Miethöhe ist unwirksam, soweit sie die zulässige Miete übersteigt. Sie schulden also weiterhin die zulässige Miete. Zurückfordern können Sie zu viel Gezahltes erst nach einer Rüge in Textform; innerhalb von 30 Monaten nach Mietbeginn wirkt sie bis zum Vertragsbeginn zurück.' },
      { q: 'Wie erkenne ich eine umfassende Modernisierung, die die Bremse ausschaltet?', a: 'Das Gesetz definiert sie nicht genauer, als dass die erste Vermietung danach ausgenommen ist. Schon das Wort umfassend zeigt, dass ein einzelnes neues Bauteil wie Küche oder Fenster kaum genügt; im Streit entscheiden die Gerichte nach dem Umfang der Arbeiten. Der Vermieter muss sich auf die Ausnahme vor Vertragsschluss in Textform berufen.' },
    ],
    body: (h) => `
<h2>Wie die Grenze berechnet wird</h2>
<p>Ausgangspunkt ist die ortsübliche Vergleichsmiete der Wohnung, so wie sie ${h.a('vergleichsmiete', 'nach § 558 Abs. 2 BGB')} bestimmt wird, in der Regel mit dem Mietspiegel der Gemeinde. Zehn Prozent darauf ergeben die Grenze für die Nettokaltmiete. Betriebskosten zählen nicht mit. Ist eine Inklusivmiete vereinbart, muss man die darin enthaltenen Betriebskosten herausrechnen. Maßgeblich ist der Zeitpunkt des Vertragsbeginns: Steigt die Vergleichsmiete später, wird eine zu hohe Anfangsmiete nicht nachträglich zulässig.</p>
${h.table(['Fall', 'Grenze im Monat', 'Bei 850 € vereinbart'], [
  ['Vergleichsmiete 10 €/m², 70 m², keine Ausnahme', h.eur(a.zulaessig, 2), `${h.eur(a.ueberMonat, 2)} zu viel`],
  ['dasselbe, Vormiete 820 €', h.eur(vm.zulaessig, 2), `${h.eur(vm.ueberMonat, 2)} zu viel`],
  ['dasselbe, Modernisierungszuschlag 45 €', h.eur(mod.zulaessig, 2), `${h.eur(mod.ueberMonat, 2)} zu viel`],
  ['Erstbezug nach dem 1. Oktober 2014', 'keine Grenze', 'zulässig'],
], 'Mietpreisbremse nach §§ 556d und 556e BGB, Beispielrechnung', ['l', 'r', 'r'])}
<h2>Wo die Mietpreisbremse gilt</h2>
<p>Ob Ihre Wohnung unter die Bremse fällt, steht nicht im BGB, sondern in der Verordnung Ihres Landes. ${h.src('bgb556d', '§ 556d Abs. 2 BGB')} ermächtigt die Landesregierungen, Gebiete mit angespanntem Wohnungsmarkt zu bestimmen, und nennt als Anzeichen stark steigende Mieten, eine hohe Mietbelastung der Haushalte, eine wachsende Bevölkerung ohne entsprechenden Neubau und geringen Leerstand. Die Verordnung muss begründet werden und darf nicht über das Ende des Jahres 2029 hinaus gelten. Gilt sie nur für Teile einer Gemeinde, kommt es auf den Ortsteil an.</p>
${h.table(['Land', 'Gemeinden', 'gilt bis'], mit.map((l) => [h.a(seite(l.code), l.name), l.mpb!.gemeinden.length, h.date(l.mpb!.bis)]), `Mietpreisbremse in den Ländern, Stand ${h.date(P.retrieved_at)}`, ['l', 'r', 'r'])}
<p>Für Berlin, Hamburg und Bremen, wo die Verordnung jeweils die ganze Stadt oder Stadtgemeinde erfasst, erklären die Seiten zu den Mietspiegeln die Einzelheiten. Wo keine Verordnung gilt, ist die Anfangsmiete frei vereinbar; Grenzen setzt dann nur das allgemeine Recht, etwa das Verbot der Mietpreisüberhöhung, und später bei jeder Erhöhung die Vergleichsmiete.</p>
<h2>Die vier Ausnahmen</h2>
<p><strong>Vormiete.</strong> Lag die Miete des Vormieters über der Grenze, darf sie weiter verlangt werden (${h.src('bgb556e', '§ 556e Abs. 1')}). Erhöhungen, die im letzten Jahr des alten Vertrags vereinbart wurden, zählen nicht, damit Vermieter die Bremse nicht kurz vor einem Mieterwechsel aushebeln. Auch eine Mietminderung des Vormieters bleibt außer Betracht.</p>
<p><strong>Modernisierung der letzten drei Jahre.</strong> Wurde vor Vertragsbeginn modernisiert, darf die Grenze um den Betrag überschritten werden, den eine Modernisierungsumlage nach § 559 ergeben hätte, gerechnet auf der Basis der Vergleichsmiete ohne die Modernisierung (§ 556e Abs. 2). Der ${h.a('modernisierung-rechner', 'Modernisierungsrechner')} zeigt, wie hoch so ein Betrag ist.</p>
<p><strong>Neubau.</strong> Wohnungen, die nach dem 1. Oktober 2014 erstmals genutzt und vermietet werden, sind ganz ausgenommen (${h.src('bgb556f', '§ 556f Satz 1')}). Das gilt auch für alle späteren Vermietungen derselben Wohnung, nicht nur für die erste.</p>
<p><strong>Umfassende Modernisierung.</strong> Ausgenommen ist die erste Vermietung nach einer umfassenden Modernisierung (§ 556f Satz 2). Bei der nächsten Vermietung gilt die Bremse wieder.</p>
<h2>Die Auskunftspflicht des Vermieters</h2>
<p>Auf jede dieser Ausnahmen kann der Vermieter sich nur stützen, wenn er sie Ihnen vor Ihrer Vertragserklärung unaufgefordert in Textform mitgeteilt hat (${h.src('bgb556g', '§ 556g Abs. 1a BGB')}): die Höhe der Vormiete, die Tatsache einer Modernisierung, den Erstbezug nach dem 1. Oktober 2014 oder die umfassende Modernisierung. Fehlt die Auskunft, gilt die normale Grenze. Holt er sie nach, kann er sich erst zwei Jahre später darauf berufen. Unabhängig davon können Sie jederzeit Auskunft über die Tatsachen verlangen, die für die Miethöhe maßgeblich sind, soweit sie nicht allgemein zugänglich sind.</p>
<h2>Zu viel gezahlte Miete zurückfordern</h2>
<p>Die Rückforderung setzt eine Rüge voraus. Sie muss in Textform erklärt werden, also auch per E-Mail, und sich auf eine erteilte Auskunft beziehen, wenn es eine gab. Kommt die Rüge innerhalb von ${M.ruege_monate} Monaten nach Beginn des Mietverhältnisses und läuft der Vertrag noch, bekommen Sie alles zurück, was Sie seit Beginn zu viel gezahlt haben. Später oder nach dem Auszug nur die Mieten, die nach der Rüge fällig werden. Einzelheiten und ein eigener Rechner stehen auf der Seite zur ${h.a('mietpreisbremse-ruege', 'Rüge')}.</p>
<h2>Staffel- und Indexmiete</h2>
<p>Bei einer ${h.a('staffelmiete', 'Staffelmiete')} gilt die Bremse für jede einzelne Stufe, gemessen an der Vergleichsmiete zum Zeitpunkt, an dem die Stufe fällig wird. Bei einer ${h.a('indexmiete', 'Indexmiete')} gilt sie nur für die Ausgangsmiete; die späteren Anpassungen folgen dem Verbraucherpreisindex. Wer prüfen will, ob eine Ausgangsmiete zulässig war, nutzt den ${h.a('mietpreisbremse-rechner', 'Mietpreisbremse-Rechner')}.</p>
`,
  },
  en: {
    slug: 'rent-brake-explained',
    nav: 'Rent brake explained',
    card: 'Where it applies, until when, and the exemptions.',
    title: 'Rent Brake Germany 2026: Where It Applies, Until When',
    description: `Rent brake Germany 2026: at most ten per cent above the reference rent in ${nGem} municipalities in ${mit.length} states, end dates, previous rent, new builds and refunds.`,
    h1: 'The German rent brake: rules, areas and exemptions',
    intro: 'The rent brake only limits the rent at the start of a lease, and only where a state has imposed it.',
    resume: `Germany's rent brake (Mietpreisbremse) is set out in Sections 556d to 556g of the Civil Code (BGB). If you sign a residential lease in an area with a tight housing market, the starting rent may be at most the local reference rent (ortsübliche Vergleichsmiete) plus ${M.aufschlag * 100} per cent. Which areas these are is decided by the state governments by ordinance, and every ordinance must end by ${dE(M.vo_spaetestens_bis)} at the latest. In October 2026, ${mit.length} of the 16 states have such an ordinance, covering ${nGem} municipalities in total. ${ohne.join(', ')} have none. The ceiling has four exemptions: a higher previous rent, modernisation in the last three years, the first letting of a flat first used after 1 October 2014, and the first letting after a full modernisation. With a reference rent of ${eE(10, 0)} and 70 m² the ceiling is ${eE(a.zulaessig)}; if you agree ${eE(850, 0)}, you overpay ${eE(a.ueberMonat)} and can reclaim it after a complaint. The rent brake does not govern later increases; the increase cap does.`,
    faqs: [
      { q: 'Does the rent brake apply to existing leases?', a: 'No. It only limits the rent agreed at the start of a new tenancy. Increases on a running lease follow the reference rent and the increase cap under Section 558 of the Civil Code. If you have lived in your flat for a while, check an increase with the rent increase calculator, not the rent brake calculator.' },
      { q: 'Which state set the earliest end date for its rent brake?', a: `${frueh.name}: its ordinance ends on ${dE(frueh.mpb!.teile[0].bis)}. Other states such as Bavaria, Berlin, Hamburg or North Rhine-Westphalia used the full term to the end of 2029. Whether a state extends in time can only be said once the new ordinance is published; the rent check only uses published texts.` },
      { q: 'May the landlord charge more if the previous tenant paid more?', a: `Yes, up to that previous rent. Increases agreed in the last year of the old tenancy and any rent reductions are left out. In the 70 m² example, the landlord could then ask ${eE(vm.zulaessig)} instead of ${eE(a.zulaessig)} if the previous tenant last owed that much. He must disclose the previous rent before you sign.` },
      { q: 'Does the rent brake cover furnished flats?', a: 'In principle yes, if the flat is let on a long-term basis. Section 549(2) of the Civil Code exempts housing let only for temporary use, and furnished rooms in a flat the landlord lives in himself. There is no official table for the furniture surcharge; it must be reasonable and may not be used to get around the ceiling.' },
      { q: 'What happens if my rent is above the ceiling?', a: 'The lease stays valid; only the agreement on the rent is void to the extent it exceeds the lawful amount. You therefore still owe the lawful rent. You can only reclaim overpayments after a complaint in text form; within 30 months of the start it reaches back to the beginning of the lease.' },
      { q: 'How do I recognise a full modernisation that switches off the brake?', a: 'The law only says that the first letting after it is exempt. The word full already suggests that a single new element such as a kitchen or windows is hardly enough; in a dispute the courts decide by the scope of the works. The landlord must invoke the exemption in text form before you sign.' },
    ],
    body: (h) => `
<h2>How the ceiling is calculated</h2>
<p>The starting point is the flat's local reference rent, determined ${h.a('vergleichsmiete', 'under Section 558(2) of the Civil Code')}, usually from the municipality's rent index (Mietspiegel). Ten per cent on top gives the ceiling for the net cold rent (Nettokaltmiete). Service charges do not count. If an all-inclusive rent was agreed, the service charges in it must be taken out. What counts is the start of the lease: if the reference rent rises later, an excessive starting rent does not become lawful after the event.</p>
${h.table(['Case', 'Monthly ceiling', 'With €850 agreed'], [
  ['reference rent €10/m², 70 m², no exemption', h.eur(a.zulaessig, 2), `${h.eur(a.ueberMonat, 2)} too much`],
  ['same, previous rent €820', h.eur(vm.zulaessig, 2), `${h.eur(vm.ueberMonat, 2)} too much`],
  ['same, modernisation premium €45', h.eur(mod.zulaessig, 2), `${h.eur(mod.ueberMonat, 2)} too much`],
  ['first let after 1 October 2014', 'no ceiling', 'lawful'],
], 'Rent brake under Sections 556d and 556e BGB, worked example', ['l', 'r', 'r'])}
<h2>Where the rent brake applies</h2>
<p>Whether your flat is covered is not in the Civil Code but in your state's ordinance. ${h.src('bgb556d', 'Section 556d(2) BGB')} empowers state governments to designate areas with a tight housing market and lists as signs sharply rising rents, a high rent burden on households, a growing population without matching new building, and low vacancy. The ordinance must give reasons and may not run beyond the end of 2029. If it covers only parts of a municipality, the district matters.</p>
${h.table(['State', 'Municipalities', 'applies until'], mit.map((l) => [h.a(seite(l.code), l.name), l.mpb!.gemeinden.length, h.date(l.mpb!.bis)]), `Rent brake in the states as of ${h.date(P.retrieved_at)}`, ['l', 'r', 'r'])}
<p>For Berlin, Hamburg and Bremen, where the ordinance covers the whole city, the rent index pages explain the details. Where no ordinance applies, the starting rent can be agreed freely; limits then come only from general law, such as the ban on excessive rents, and later from the reference rent on every increase.</p>
<h2>The four exemptions</h2>
<p><strong>Previous rent.</strong> If the previous tenant's rent was above the ceiling, it may still be charged (${h.src('bgb556e', 'Section 556e(1)')}). Increases agreed in the last year of the old lease do not count, so landlords cannot defeat the brake just before a change of tenant. A rent reduction of the previous tenant is also disregarded.</p>
<p><strong>Modernisation in the last three years.</strong> If the flat was modernised before the lease began, the ceiling may be exceeded by the amount a modernisation increase under Section 559 would have produced, calculated on the reference rent without the modernisation (Section 556e(2)). The ${h.a('modernisierung-rechner', 'modernisation calculator')} shows how large such an amount is.</p>
<p><strong>New builds.</strong> Flats first used and let after 1 October 2014 are exempt altogether (${h.src('bgb556f', 'Section 556f, first sentence')}). This covers every later letting of the same flat too, not just the first.</p>
<p><strong>Full modernisation.</strong> The first letting after a full modernisation is exempt (Section 556f, second sentence). At the next letting the brake applies again.</p>
<h2>The landlord's duty to disclose</h2>
<p>The landlord can only rely on any of these exemptions if he told you, unprompted and in text form, before you made your declaration (${h.src('bgb556g', 'Section 556g(1a) BGB')}): the amount of the previous rent, the fact of a modernisation, a first use after 1 October 2014, or the full modernisation. Without that information the normal ceiling applies. If he discloses later, he can only rely on it two years afterwards. Independently of that, you may ask at any time for the facts that determine the rent, as far as they are not publicly accessible.</p>
<h2>Reclaiming overpaid rent</h2>
<p>A refund requires a complaint (Rüge) in text form, so an e-mail will do, and it must refer to any disclosure the landlord gave. If it arrives within ${M.ruege_monate} months of the start and the tenancy is still running, you recover everything overpaid since the start. Later, or after moving out, only the rent falling due after the complaint. Details and a calculator are on the ${h.a('mietpreisbremse-ruege', 'complaint')} page.</p>
<h2>Graduated and index-linked rents</h2>
<p>With a ${h.a('staffelmiete', 'graduated rent')} the brake applies to each step, measured against the reference rent when the step falls due. With an ${h.a('indexmiete', 'index-linked rent')} it applies only to the starting rent; later adjustments follow the consumer price index. To check whether a starting rent was lawful, use the ${h.a('mietpreisbremse-rechner', 'rent brake calculator')}.</p>
`,
  },
});
