/** Indexmiete (§ 557b BGB) : loyer × VPI nouveau ÷ VPI ancien (Destatis, 2020 = 100). */
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import DateField from '../ui/DateField';
import ResultCard from './ResultCard';
import Shell, { Row2 } from './Shell';
import { useUrl } from './useUrl';
import { fmt, T, type L } from './i18n';
import { indexmiete, vpiMonate, VPI } from '../../lib/engine/miete';

const MON = { de: ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'], en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] };
export default function IndexRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const f = fmt(lang);
  const last = vpiMonate[vpiMonate.length - 1];
  const [s, set] = useUrl({ miete: 900, von: '2025-08', bis: last, zugang: '2026-10-15' });
  const von = VPI[s.von] !== undefined ? s.von : vpiMonate[0];
  const bis = VPI[s.bis] !== undefined ? s.bis : last;
  const r = indexmiete({ miete: s.miete, von, bis, zugang: s.zugang });
  const opts = [...vpiMonate].reverse().map((m) => { const [y, mo] = m.split('-'); return { value: m, label: `${MON[lang][Number(mo) - 1]} ${y} · ${f.num(VPI[m], 1)}` }; });
  return (
    <Shell
      form={<>
        <Row2>
          <NumberField id="ix-m" label={T(lang, 'Aktuelle Nettokaltmiete', 'Current net cold rent')} value={s.miete} onChange={set('miete')} unit="€" max={20000} lang={lang} />
          <DateField id="ix-z" label={T(lang, 'Erklärung erhalten am', 'Notice received on')} value={s.zugang} onChange={set('zugang')} />
        </Row2>
        <Row2>
          <SelectField id="ix-von" label={T(lang, 'Index bei der letzten Anpassung', 'Index at the last adjustment')} value={von} onChange={set('von')} options={opts} />
          <SelectField id="ix-bis" label={T(lang, 'Neuer Indexstand', 'New index value')} value={bis} onChange={set('bis')} options={opts} />
        </Row2>
      </>}
      result={<ResultCard head={T(lang, 'Neue Miete nach Index', 'New rent under the index')} big={f.eur2(r.neu)}
        sub={`${r.aenderung >= 0 ? '+' : ''}${f.pct(r.aenderung, 2)} · ${r.plus >= 0 ? '+' : ''}${f.eur2(r.plus)} ${T(lang, 'pro Monat', 'per month')}`}
        rows={[
          { label: T(lang, 'VPI alt', 'Old CPI'), value: f.num(r.vpiVon, 1) },
          { label: T(lang, 'VPI neu', 'New CPI'), value: f.num(r.vpiBis, 1) },
          { label: T(lang, 'Zu zahlen ab', 'Payable from'), value: r.wirksam ? f.date(r.wirksam) : '–', strong: true },
        ]}
        note={T(lang, 'Zwischen zwei Anpassungen muss die Miete mindestens ein Jahr unverändert bleiben. Die Erklärung in Textform nennt beide Indexstände und die neue Miete oder die Erhöhung in Euro (§ 557b Abs. 3 BGB).', 'The rent must stay unchanged for at least a year between two adjustments. The written notice states both index values and the new rent or the increase in euros (Section 557b(3) BGB).')}
        methodHref={methodHref} methodLabel={T(lang, 'So rechnen wir', 'How we calculate')} />}
      foot={T(lang, 'Verbraucherpreisindex für Deutschland, 2020 = 100, Statistisches Bundesamt, Stand 10.9.2026.', 'Consumer price index for Germany, 2020 = 100, Federal Statistical Office, as of 10 Sep 2026.')}
    />
  );
}
