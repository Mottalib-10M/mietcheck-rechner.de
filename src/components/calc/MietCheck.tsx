/**
 * Mietcheck : Vergleichsmiete de la ville (Berlin et Hambourg calculées depuis le Mietspiegel, autres
 * villes et communes : valeur saisie depuis l'outil officiel), puis règles de la commune lues dans les
 * Verordnungen des Länder (Mietpreisbremse, Kappungsgrenze 15/20 %) et calcul :
 *  - « neu » : loyer maximal à la signature (§§ 556d–556g BGB), trop-perçu et restitution ;
 *  - « erhoehung » : hausse maximale (§ 558 BGB), délais de consentement et Sperrfrist.
 * Moteurs : lib/engine/berlin.ts, hamburg.ts, gebiet.ts, miete.ts (testés).
 */
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import DateField from '../ui/DateField';
import TextField from '../ui/TextField';
import ResultCard, { type Row } from './ResultCard';
import Shell, { Row2 } from './Shell';
import { useUrl } from './useUrl';
import { fmt, T, type L } from './i18n';
import { STAEDTE, stadt as stadtById } from '../../lib/engine/staedte';
import { status, gemeindenVon, LAENDER_VO } from '../../lib/engine/gebiet';
import { berlinOvm, type Lage } from '../../lib/engine/berlin';
import { hamburgOvm } from '../../lib/engine/hamburg';
import { mietpreisbremse, rueckforderung, mieterhoehung } from '../../lib/engine/miete';
import { LAND_NAMEN } from './KuendigungRechner';
import type { Land } from '../../lib/engine/miete';

type Mode = 'neu' | 'erhoehung';
interface Props { lang?: L; methodHref?: string; mode?: Mode; lockMode?: boolean; fixedStadt?: string; fixedLand?: string; extended?: boolean }

const GRUPPEN = { de: ['Bad und WC', 'Küche', 'Wohnung', 'Gebäude', 'Wohnumfeld'], en: ['Bathroom and WC', 'Kitchen', 'Flat', 'Building', 'Surroundings'] };

export default function MietCheck({ lang = 'de', methodHref, mode = 'neu', lockMode = false, fixedStadt, fixedLand, extended = false }: Props) {
  const f = fmt(lang);
  const startStadt = fixedLand ? 'andere' : fixedStadt ?? 'berlin';
  const [s, set] = useUrl({
    st: startStadt, land: fixedLand ?? 'BY', gem: '', m: mode as string,
    fl: 62, bj: 1965, lage: 'mittel', hl: 'normal', ost: '0', g1: '0', g2: '0', g3: '0', g4: '0', g5: '0', mind: '0', pos: 50, ovm: 11,
    miete: 820, vm: 0, nb: '0', um: '0', beginn: '2026-03-01', ruege: '2026-10-12',
    m3: 0, verl: 860, zugang: '2026-10-05', letzte: '2024-04-01',
  });
  const st = fixedStadt ?? (fixedLand ? 'andere' : s.st);
  const S = st !== 'andere' ? stadtById(st) : undefined;
  const md: Mode = (lockMode ? mode : s.m) === 'erhoehung' ? 'erhoehung' : 'neu';
  const landCode = S ? S.land : fixedLand ?? s.land;
  const gemeinde = S ? S.gemeinde : s.gem;
  const datum = md === 'neu' ? s.beginn : s.zugang;
  const gs = status(landCode, gemeinde, datum);

  // 1. Vergleichsmiete
  let ovm = s.ovm, quelle = T(lang, 'Ihre Eingabe aus dem Mietspiegel', 'Your entry from the rent index'), spanne: [number, number] | null = null, fehler: string | null = null;
  if (S?.schema === 'berlin') {
    const g = [s.g1, s.g2, s.g3, s.g4, s.g5].map(Number);
    const r = berlinOvm({ lage: s.lage as Lage, baujahr: s.bj, ost: s.ost === '1', flaeche: s.fl, gruppen: g, minderausstattung: s.mind === '1' });
    if (r.ok && r.zeile) { ovm = r.ovm; spanne = r.spanne; quelle = T(lang, `Berliner Mietspiegel 2026, Zeile ${r.zeile.zeile}`, `Berlin rent index 2026, line ${r.zeile.zeile}`); }
    else fehler = r.grund === 'neubau' ? T(lang, 'Ab 2025 bezugsfertige Wohnungen sind nicht im Mietspiegel.', 'Flats completed from 2025 are not in the rent index.') : T(lang, 'Für diese Angaben weist der Mietspiegel kein Feld aus.', 'The rent index has no field for these details.');
  } else if (S?.schema === 'hamburg') {
    const r = hamburgOvm({ lage: s.hl as 'normal', baujahr: s.bj, flaeche: s.fl, position: s.pos });
    if (r.ok) { ovm = r.ovm; spanne = [r.feld.unten, r.feld.oben]; quelle = T(lang, `Hamburger Mietenspiegel 2025, Feld ${r.feld.feld}`, `Hamburg rent index 2025, field ${r.feld.feld}`); }
    else fehler = r.grund === 'neubau' ? T(lang, 'Ab 2025 bezugsfertige Wohnungen sind nicht im Mietenspiegel.', 'Flats completed from 2025 are not in the rent index.') : T(lang, 'Leerfeld: zu wenige Daten, der Mietenspiegel nennt keinen Wert.', 'Empty field: too little data, the index gives no value.');
  }
  const ovmMonat = Math.round(ovm * s.fl * 100) / 100;

  // 2. Règles et calcul
  const rows: Row[] = [
    { label: T(lang, 'Ortsübliche Vergleichsmiete', 'Local reference rent'), value: fehler ? '–' : f.m2(ovm), strong: true },
    { label: T(lang, 'Vergleichsmiete für Ihre Fläche', 'Reference rent for your floor area'), value: fehler ? '–' : f.eur2(ovmMonat) },
    ...(spanne ? [{ label: T(lang, 'Spanne im Mietspiegel', 'Range in the rent index'), value: `${f.num(spanne[0], 2)}–${f.num(spanne[1], 2)} €/m²` }] : []),
    { label: T(lang, 'Mietpreisbremse', 'Rent brake'), value: gs.mpb ? T(lang, `gilt bis ${f.date(gs.mpbBis!)}`, `applies until ${f.date(gs.mpbBis!)}`) : T(lang, 'gilt hier nicht', 'does not apply here') },
    { label: T(lang, 'Kappungsgrenze', 'Increase cap'), value: `${f.pct(gs.kappung, 0)} ${T(lang, 'in drei Jahren', 'in three years')}` },
  ];
  let head = '', big = '', sub: string | undefined, note = '';
  if (md === 'neu') {
    const r = mietpreisbremse({ ovm, flaeche: s.fl, miete: s.miete, gebiet: gs.mpb, neubau: s.nb === '1', umfassendModernisiert: s.um === '1', vormiete: s.vm || undefined });
    head = T(lang, 'Höchstens zulässige Miete bei Mietbeginn', 'Maximum rent at the start of the tenancy');
    if (!r.anwendbar) {
      big = T(lang, 'keine Grenze', 'no cap');
      sub = r.grund === 'gebiet' ? T(lang, 'Die Gemeinde steht zu diesem Datum in keiner Verordnung.', 'The municipality is in no ordinance on this date.') : T(lang, 'Ausnahme nach § 556f BGB.', 'Exemption under Section 556f BGB.');
      note = T(lang, 'Ohne Mietpreisbremse gilt bei Vertragsschluss keine Grenze aus §§ 556d ff. BGB. Spätere Erhöhungen folgen trotzdem § 558 BGB mit Vergleichsmiete und Kappungsgrenze.', 'Without the rent brake, Sections 556d ff. BGB set no limit at signing. Later increases still follow Section 558 BGB, with the reference rent and the cap.');
    } else {
      big = fehler ? '–' : f.eur2(r.zulaessig);
      sub = r.ueberMonat > 0 ? T(lang, `${f.eur2(r.ueberMonat)} pro Monat zu viel`, `${f.eur2(r.ueberMonat)} too much per month`) : T(lang, 'Ihre Miete liegt im Rahmen.', 'Your rent is within the limit.');
      rows.push({ label: T(lang, 'Grenze: Vergleichsmiete + 10 %', 'Limit: reference rent + 10%'), value: f.eur2(r.grenzeOvm) });
      if (r.basis === 'vormiete') rows.push({ label: T(lang, 'Maßgeblich: höhere Vormiete', 'Applies: higher previous rent'), value: f.eur2(s.vm) });
      if (extended && r.ueberMonat > 0) {
        const rf = rueckforderung({ ueberMonat: r.ueberMonat, beginn: s.beginn, ruege: s.ruege, heute: s.ruege });
        rows.push({ label: T(lang, 'Rückforderbar bis zur Rüge', 'Recoverable up to the complaint'), value: f.eur2(rf.betrag), strong: true });
        rows.push({ label: T(lang, 'Rüge mit voller Wirkung bis', 'Complaint with full effect until'), value: f.date(rf.frist) });
      }
      note = T(lang, 'Zurückfordern können Sie erst nach einer Rüge in Textform. Kommt sie binnen 30 Monaten nach Mietbeginn und läuft der Vertrag noch, gilt sie ab Vertragsbeginn (§ 556g Abs. 2 BGB).', 'You can only reclaim after a written complaint. If it arrives within 30 months of the start and the tenancy is still running, it reaches back to the start (Section 556g(2) BGB).');
    }
  } else {
    const r = mieterhoehung({ miete: s.miete, mieteVor3: s.m3 || undefined, flaeche: s.fl, ovm, kappung: gs.kappung, verlangt: s.verl, zugang: s.zugang, letzteAenderung: s.letzte });
    head = T(lang, 'Höchstens zulässige neue Miete', 'Maximum lawful new rent');
    big = fehler ? '–' : f.eur2(r.zulaessig);
    sub = r.ueberMonat > 0 ? T(lang, `${f.eur2(r.ueberMonat)} mehr verlangt als erlaubt`, `${f.eur2(r.ueberMonat)} more than allowed`) : `+${f.eur2(r.plusMonat)} (${f.pct(r.plusProzent, 1)})`;
    rows.push({ label: T(lang, 'Grenze Kappung', 'Cap limit'), value: f.eur2(r.grenzeKappung) });
    rows.push({ label: T(lang, 'Bindende Grenze', 'Binding limit'), value: r.bindend === 'kappung' ? T(lang, 'Kappungsgrenze', 'increase cap') : T(lang, 'Vergleichsmiete', 'reference rent') });
    rows.push({ label: T(lang, 'Zustimmen bis', 'Consent by'), value: f.date(r.zustimmungBis) });
    rows.push({ label: T(lang, 'Neue Miete ab', 'New rent from'), value: f.date(r.sperrOk ? r.wirksam : r.fruehWirksam) });
    note = !r.warteOk || !r.sperrOk
      ? T(lang, `Zu früh: Das Verlangen ist erst nach zwölf Monaten seit der letzten Erhöhung zulässig, die neue Miete frühestens nach 15 Monaten, hier ab ${f.date(r.fruehWirksam)}.`, `Too early: a demand is only allowed twelve months after the last increase, and the new rent at the earliest after 15 months, here from ${f.date(r.fruehWirksam)}.`)
      : T(lang, 'Sie müssen nur bis zur zulässigen Höhe zustimmen; eine Teilzustimmung ist möglich. Ohne Zustimmung muss der Vermieter binnen drei weiteren Monaten klagen (§ 558b BGB).', 'You only have to agree up to the lawful amount; partial consent is possible. Without consent the landlord must sue within three further months (Section 558b BGB).');
  }
  if (fehler) note = fehler;
  const vorher = md === 'neu' ? gs.mpbVorher : gs.kappungVorher;
  if (vorher) note += T(lang, ` Die heutige Verordnung gilt erst seit ${f.date(vorher)}. Gerechnet wird mit der Grenze; ob die Vorgängerverordnung Ihre Gemeinde am Stichtag erfasste, steht in deren Gemeindeliste.`, ` The current ordinance only applies since ${f.date(vorher)}. The calculation applies the limit; whether the previous ordinance covered your municipality on that date is in its own list.`);
  if (gs.mpbTeil || gs.kappungTeil) note += T(lang, ' Die Verordnung erfasst nur Teile der Gemeinde: Prüfen Sie Ihren Ortsteil in der Verordnung.', ' The ordinance covers only parts of the municipality: check your district in the ordinance.');

  const yn = [{ value: '0', label: T(lang, 'nein', 'no') }, { value: '1', label: T(lang, 'ja', 'yes') }];
  const gopt = [{ value: '-1', label: T(lang, 'überwiegend schlechter', 'mostly worse') }, { value: '0', label: T(lang, 'ausgeglichen', 'balanced') }, { value: '1', label: T(lang, 'überwiegend besser', 'mostly better') }];
  const gemList = gemeindenVon(landCode);
  const voUrl = (md === 'neu' ? gs.land?.mpb?.url : gs.land?.kappung?.url) ?? gs.land?.mpb?.url ?? gs.land?.kappung?.url;
  return (
    <Shell
      form={<>
        <Row2>
          {!fixedStadt && !fixedLand && <SelectField id="mc-st" label={T(lang, 'Stadt', 'City')} value={s.st} onChange={set('st')} options={[...STAEDTE.map((x) => ({ value: x.id, label: x.name })), { value: 'andere', label: T(lang, 'Andere Gemeinde', 'Other municipality') }]} />}
          {!lockMode && <SelectField id="mc-m" label={T(lang, 'Ihre Lage', 'Your situation')} value={md} onChange={set('m')} options={[{ value: 'neu', label: T(lang, 'Neuer Mietvertrag', 'New tenancy') }, { value: 'erhoehung', label: T(lang, 'Mieterhöhung erhalten', 'Rent increase received') }]} />}
        </Row2>
        {!S && <Row2>
          {!fixedLand && <SelectField id="mc-land" label={T(lang, 'Bundesland', 'State')} value={s.land} onChange={set('land')} options={LAENDER_VO.map((l) => ({ value: l.code, label: LAND_NAMEN[l.code as Land] ?? l.name }))} />}
          <TextField id="mc-gem" label={T(lang, 'Gemeinde', 'Municipality')} value={s.gem} onChange={set('gem')} list={gemList} placeholder={gemList[0] ?? ''} />
        </Row2>}
        <Row2>
          <NumberField id="mc-fl" label={T(lang, 'Wohnfläche', 'Floor area')} value={s.fl} onChange={set('fl')} unit="m²" max={400} lang={lang} />
          {S && S.schema !== 'eingabe'
            ? <NumberField id="mc-bj" label={T(lang, 'Baujahr (bezugsfertig)', 'Year completed')} value={s.bj} onChange={set('bj')} min={1800} max={2026} lang={lang} plain={true} />
            : <NumberField id="mc-ovm" label={T(lang, 'Vergleichsmiete laut Mietspiegel', 'Reference rent from the index')} value={s.ovm} onChange={set('ovm')} unit="€/m²" max={60} decimals={2} lang={lang} />}
        </Row2>
        {S?.schema === 'berlin' && <Row2>
          <SelectField id="mc-lage" label={T(lang, 'Wohnlage (Straßenverzeichnis)', 'Residential location (street list)')} value={s.lage} onChange={set('lage')} options={[{ value: 'einfach', label: T(lang, 'einfach', 'basic') }, { value: 'mittel', label: T(lang, 'mittel', 'average') }, { value: 'gut', label: T(lang, 'gut', 'good') }]} />
          {s.bj >= 1973 && s.bj <= 1990 && <SelectField id="mc-ost" label={T(lang, 'Ehemaliger Ostteil oder West-Staaken', 'Former East Berlin or West-Staaken')} value={s.ost} onChange={set('ost')} options={yn} />}
        </Row2>}
        {S?.schema === 'hamburg' && <Row2>
          <SelectField id="mc-hl" label={T(lang, 'Wohnlage (Wohnlagenverzeichnis)', 'Residential location (official list)')} value={s.hl} onChange={set('hl')} options={[{ value: 'normal', label: T(lang, 'normal', 'normal') }, { value: 'gut', label: T(lang, 'gut', 'good') }]} />
          <SelectField id="mc-pos" label={T(lang, 'Ausstattung im Vergleich', 'Fittings compared')} value={String(s.pos)} onChange={(x) => set('pos')(Number(x))} options={[{ value: '25', label: T(lang, 'schlechter als üblich', 'worse than usual') }, { value: '50', label: T(lang, 'üblich (Mittelwert)', 'usual (median)') }, { value: '75', label: T(lang, 'besser, modernisiert', 'better, modernised') }]} />
        </Row2>}
        <Row2>
          <NumberField id="mc-miete" label={md === 'neu' ? T(lang, 'Vereinbarte Nettokaltmiete', 'Agreed net cold rent') : T(lang, 'Bisherige Nettokaltmiete', 'Current net cold rent')} value={s.miete} onChange={set('miete')} unit="€" max={20000} lang={lang} />
          {md === 'neu'
            ? <DateField id="mc-beginn" label={T(lang, 'Mietbeginn', 'Start of tenancy')} value={s.beginn} onChange={set('beginn')} />
            : <NumberField id="mc-verl" label={T(lang, 'Verlangte neue Miete', 'New rent demanded')} value={s.verl} onChange={set('verl')} unit="€" max={20000} lang={lang} />}
        </Row2>
        {md === 'erhoehung' && <Row2>
          <DateField id="mc-zugang" label={T(lang, 'Schreiben erhalten am', 'Letter received on')} value={s.zugang} onChange={set('zugang')} />
          <DateField id="mc-letzte" label={T(lang, 'Miete zuletzt geändert ab', 'Rent last changed from')} value={s.letzte} onChange={set('letzte')} />
        </Row2>}
        {extended && md === 'erhoehung' && <Row2>
          <NumberField id="mc-m3" label={T(lang, 'Miete vor drei Jahren', 'Rent three years ago')} value={s.m3} onChange={set('m3')} unit="€" max={20000} lang={lang} help={T(lang, 'Ohne Modernisierung und Betriebskosten; leer = bisherige Miete', 'Without modernisation and service charges; empty = current rent')} />
        </Row2>}
        {extended && md === 'neu' && <>
          <Row2>
            <NumberField id="mc-vm" label={T(lang, 'Miete des Vormieters', 'Previous tenant’s rent')} value={s.vm} onChange={set('vm')} unit="€" max={20000} lang={lang} help={T(lang, 'Nur wenn der Vermieter sie genannt hat', 'Only if the landlord disclosed it')} />
            <DateField id="mc-ruege" label={T(lang, 'Rüge abgeschickt am', 'Complaint sent on')} value={s.ruege} onChange={set('ruege')} />
          </Row2>
          <Row2>
            <SelectField id="mc-nb" label={T(lang, 'Erstbezug nach dem 1.10.2014', 'First let after 1 Oct 2014')} value={s.nb} onChange={set('nb')} options={yn} />
            <SelectField id="mc-um" label={T(lang, 'Erste Miete nach Kernsanierung', 'First let after full refurbishment')} value={s.um} onChange={set('um')} options={yn} />
          </Row2>
        </>}
        {S?.schema === 'berlin' && <details className="rounded-lg border border-navy-200 p-3">
          <summary className="cursor-pointer text-sm font-medium text-navy-800">{T(lang, 'Ausstattung genauer einordnen (Orientierungshilfe)', 'Place your fittings in the range (guidance)')}</summary>
          <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            {(['g1', 'g2', 'g3', 'g4', 'g5'] as const).map((k, i) => <SelectField key={k} id={`mc-${k}`} label={GRUPPEN[lang][i]} value={s[k]} onChange={set(k)} options={gopt} />)}
            <SelectField id="mc-mind" label={T(lang, 'Ohne Sammelheizung oder Bad (bis 1949)', 'No central heating or bathroom (to 1949)')} value={s.mind} onChange={set('mind')} options={yn} />
          </div>
        </details>}
      </>}
      result={<ResultCard head={head} big={big} sub={sub} rows={rows} note={note} methodHref={methodHref} methodLabel={T(lang, 'So rechnen wir', 'How we calculate')} />}
      foot={<>
        {S ? <>{quelle} · <a className="underline" href={S.rechner ?? S.url} target="_blank" rel="nofollow noopener noreferrer">{S.schema === 'eingabe' ? T(lang, `Vergleichsmiete im offiziellen Mietspiegel ${S.name} ermitteln`, `Look up the reference rent in the official ${S.name} index`) : T(lang, 'Offizieller Mietspiegel', 'Official rent index')}</a></> : T(lang, 'Vergleichsmiete aus dem Mietspiegel Ihrer Gemeinde eintragen; ohne Mietspiegel helfen drei Vergleichswohnungen oder ein Gutachten (§ 558a BGB).', 'Enter the reference rent from your municipality’s rent index; without one, three comparable flats or an expert opinion are used (Section 558a BGB).')}
        {voUrl && <> · <a className="underline" href={voUrl} target="_blank" rel="nofollow noopener noreferrer">{T(lang, `Verordnung ${gs.land!.name}`, `${gs.land!.name} ordinance`)}</a></>}
      </>}
    />
  );
}
