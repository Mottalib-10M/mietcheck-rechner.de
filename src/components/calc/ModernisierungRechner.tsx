/** Modernisierungsumlage (§§ 559, 559c, 559e BGB). */
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import ResultCard from './ResultCard';
import Shell, { Row2 } from './Shell';
import { useUrl } from './useUrl';
import { fmt, T, type L } from './i18n';
import { modernisierung } from '../../lib/engine/miete';

export default function ModernisierungRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const f = fmt(lang);
  const [s, set] = useUrl({ v: 'normal', kosten: 18000, erh: 3000, dm: 0, fl: 70, miete: 700, bisher: 0 });
  const r = modernisierung({ kosten: s.kosten, erhaltung: s.erh, drittmittel: s.dm, flaeche: s.fl, miete: s.miete, bisherM2: s.bisher, vereinfacht: s.v === 'vereinfacht', heizung559e: s.v === 'heizung' });
  return (
    <Shell
      form={<>
        <Row2>
          <SelectField id="mo-v" label={T(lang, 'Verfahren', 'Procedure')} value={s.v} onChange={set('v')} options={[
            { value: 'normal', label: T(lang, '§ 559: 8 Prozent', 'Section 559: 8 per cent') },
            { value: 'vereinfacht', label: T(lang, '§ 559c: vereinfacht, bis 10.000 €', 'Section 559c: simplified, up to €10,000') },
            { value: 'heizung', label: T(lang, '§ 559e: Heizung mit Förderung, 10 %', 'Section 559e: subsidised heating, 10%') }]} />
          <NumberField id="mo-k" label={T(lang, 'Kosten für Ihre Wohnung', 'Costs for your flat')} value={s.kosten} onChange={set('kosten')} unit="€" max={500000} lang={lang} />
        </Row2>
        <Row2>
          {s.v === 'normal' && <NumberField id="mo-e" label={T(lang, 'Darin ersparte Erhaltungskosten', 'Of which saved repair costs')} value={s.erh} onChange={set('erh')} unit="€" max={500000} lang={lang} />}
          <NumberField id="mo-d" label={T(lang, 'Drittmittel, Zuschüsse', 'Third-party funds, grants')} value={s.dm} onChange={set('dm')} unit="€" max={500000} lang={lang} />
        </Row2>
        <Row2>
          <NumberField id="mo-fl" label={T(lang, 'Wohnfläche', 'Floor area')} value={s.fl} onChange={set('fl')} unit="m²" max={500} lang={lang} />
          <NumberField id="mo-m" label={T(lang, 'Nettokaltmiete vorher', 'Net cold rent before')} value={s.miete} onChange={set('miete')} unit="€" max={20000} lang={lang} />
        </Row2>
        <Row2>
          <NumberField id="mo-b" label={T(lang, 'Frühere Umlagen in sechs Jahren', 'Earlier increases within six years')} value={s.bisher} onChange={set('bisher')} unit="€/m²" max={3} decimals={2} lang={lang} />
        </Row2>
      </>}
      result={<ResultCard head={T(lang, 'Zulässige Erhöhung pro Monat', 'Permitted increase per month')} big={f.eur2(r.monat)}
        sub={`${T(lang, 'Neue Miete', 'New rent')} ${f.eur2(r.neueMiete)}`}
        rows={[
          { label: T(lang, 'Umlagefähige Kosten', 'Costs that can be passed on'), value: f.eur2(r.basis) },
          { label: T(lang, 'Abzug Erhaltung', 'Repair deduction'), value: f.eur2(r.erhaltung) },
          { label: `${f.pct(r.umlage, 0)} ${T(lang, 'pro Jahr', 'per year')}`, value: f.eur2(r.jahr) },
          { label: T(lang, 'Ohne Kappung pro Monat', 'Per month before the cap'), value: f.eur2(r.monatRoh) },
          { label: T(lang, 'Kappungsgrenze in sechs Jahren', 'Six-year cap'), value: f.m2(r.kapM2), strong: r.kappungGreift },
        ]}
        note={r.kappungGreift ? T(lang, 'Die Kappungsgrenze greift: Mehr als dieser Betrag darf in sechs Jahren nicht auf die Miete aufgeschlagen werden.', 'The cap applies: no more than this may be added to the rent within six years.') : T(lang, 'Die Erhöhung wird mit Beginn des dritten Monats nach Zugang der Erklärung fällig (§ 559b Abs. 2 BGB).', 'The increase is due from the start of the third month after the notice arrives (Section 559b(2) BGB).')}
        methodHref={methodHref} methodLabel={T(lang, 'So rechnen wir', 'How we calculate')} />}
    />
  );
}
