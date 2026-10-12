/** CO2-Kosten zwischen Mieter und Vermieter (CO2KostAufG, Stufenmodell der Anlage). */
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import ResultCard from './ResultCard';
import Shell, { Row2 } from './Shell';
import { useUrl } from './useUrl';
import { fmt, T, type L } from './i18n';
import { co2Aufteilung } from '../../lib/engine/miete';

export default function Co2Rechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const f = fmt(lang);
  const [s, set] = useUrl({ kg: 24000, fl: 960, kosten: 95, e: 'keine' });
  const r = co2Aufteilung({ kg: s.kg, flaeche: s.fl, kosten: s.kosten, einschraenkung: s.e as 'keine' });
  return (
    <Shell
      form={<>
        <Row2>
          <NumberField id="co-kg" label={T(lang, 'CO2-Ausstoß des Gebäudes', 'Building CO2 emissions')} value={s.kg} onChange={set('kg')} unit="kg" max={10000000} lang={lang} help={T(lang, 'Steht in der Heizkostenabrechnung', 'Shown in the heating statement')} />
          <NumberField id="co-fl" label={T(lang, 'Wohnfläche des Gebäudes', 'Building floor area')} value={s.fl} onChange={set('fl')} unit="m²" max={500000} lang={lang} />
        </Row2>
        <Row2>
          <NumberField id="co-k" label={T(lang, 'Ihre CO2-Kosten vor Aufteilung', 'Your CO2 costs before the split')} value={s.kosten} onChange={set('kosten')} unit="€" max={100000} decimals={2} lang={lang} />
          <SelectField id="co-e" label={T(lang, 'Denkmalschutz, Fernwärmezwang u. Ä.', 'Listed building, district-heating duty etc.')} value={s.e} onChange={set('e')} options={[
            { value: 'keine', label: T(lang, 'nein', 'no') },
            { value: 'eine', label: T(lang, 'eine Verbesserung verhindert', 'one improvement blocked') },
            { value: 'beide', label: T(lang, 'Gebäude und Heizung verhindert', 'building and heating blocked') }]} />
        </Row2>
      </>}
      result={<ResultCard head={T(lang, 'Vermieter trägt davon', 'Landlord bears')} big={f.eur2(r.vermieter)}
        sub={`${T(lang, 'Sie tragen', 'You bear')} ${f.eur2(r.mieter)}`}
        rows={[
          { label: T(lang, 'CO2 je m² und Jahr', 'CO2 per m² per year'), value: `${f.num(r.kgM2, 1)} kg` },
          { label: T(lang, 'Stufe der Anlage', 'Step in the annex'), value: `${r.stufe} / 10`, strong: true },
          { label: T(lang, 'Anteil Mieter', 'Tenant share'), value: f.pct(r.mieterAnteil, 0) },
          { label: T(lang, 'Anteil Vermieter', 'Landlord share'), value: f.pct(r.vermieterAnteil, 0) },
        ]}
        note={T(lang, 'Fehlt die Aufteilung in der Heizkostenabrechnung, darf der Mieter seinen Heizkostenanteil um 3 Prozent kürzen (§ 7 Abs. 4 CO2KostAufG).', 'If the heating statement lacks the split, the tenant may cut his heating share by 3 per cent (Section 7(4) CO2KostAufG).')}
        methodHref={methodHref} methodLabel={T(lang, 'So rechnen wir', 'How we calculate')} />}
    />
  );
}
