/** Kündigungsfrist (§ 573c BGB) : troisième jour ouvrable (samedi compris, BGH VIII ZR 206/04), préavis selon la durée. */
import SelectField from '../ui/SelectField';
import DateField from '../ui/DateField';
import ResultCard from './ResultCard';
import Shell, { Row2 } from './Shell';
import { useUrl } from './useUrl';
import { fmt, T, type L } from './i18n';
import { kuendigung, LAENDER, type Land } from '../../lib/engine/miete';

export const LAND_NAMEN: Record<Land, string> = { BW: 'Baden-Württemberg', BY: 'Bayern', BE: 'Berlin', BB: 'Brandenburg', HB: 'Bremen', HH: 'Hamburg', HE: 'Hessen', MV: 'Mecklenburg-Vorpommern', NI: 'Niedersachsen', NW: 'Nordrhein-Westfalen', RP: 'Rheinland-Pfalz', SL: 'Saarland', SN: 'Sachsen', ST: 'Sachsen-Anhalt', SH: 'Schleswig-Holstein', TH: 'Thüringen' };
export default function KuendigungRechner({ lang = 'de', methodHref, partei: p0 = 'mieter' }: { lang?: L; methodHref?: string; partei?: 'mieter' | 'vermieter' }) {
  const f = fmt(lang);
  const [s, set] = useUrl({ p: p0 as string, zugang: '2026-11-03', seit: '2019-04-01', land: 'BE' });
  const land = (LAENDER as readonly string[]).includes(s.land) ? (s.land as Land) : 'BE';
  const r = kuendigung({ zugang: s.zugang, partei: s.p === 'vermieter' ? 'vermieter' : 'mieter', ueberlassen: s.seit, land });
  return (
    <Shell
      form={<>
        <Row2>
          <SelectField id="ku-p" label={T(lang, 'Wer kündigt?', 'Who gives notice?')} value={s.p} onChange={set('p')} options={[{ value: 'mieter', label: T(lang, 'Mieter', 'Tenant') }, { value: 'vermieter', label: T(lang, 'Vermieter', 'Landlord') }]} />
          <SelectField id="ku-l" label={T(lang, 'Bundesland (Feiertage)', 'State (public holidays)')} value={land} onChange={set('land')} options={LAENDER.map((k) => ({ value: k, label: LAND_NAMEN[k] }))} />
        </Row2>
        <Row2>
          <DateField id="ku-z" label={T(lang, 'Kündigung kommt an am', 'Notice arrives on')} value={s.zugang} onChange={set('zugang')} />
          {s.p === 'vermieter' && <DateField id="ku-s" label={T(lang, 'Wohnung überlassen seit', 'Flat handed over since')} value={s.seit} onChange={set('seit')} />}
        </Row2>
      </>}
      result={<ResultCard head={T(lang, 'Mietverhältnis endet am', 'Tenancy ends on')} big={f.date(r.ende)}
        rows={[
          { label: T(lang, 'Kündigungsfrist', 'Notice period'), value: `${r.monate} ${T(lang, 'Monate', 'months')}`, strong: true },
          { label: T(lang, '3. Werktag in diesem Monat', '3rd working day this month'), value: f.date(r.stichtag) },
          { label: T(lang, 'Zählt der Zugangsmonat mit?', 'Does the month of receipt count?'), value: r.imMonat ? T(lang, 'ja', 'yes') : T(lang, 'nein', 'no') },
        ]}
        note={r.samstag ? T(lang, 'Der dritte Werktag ist ein Samstag. Ob die Frist dann auf Montag rückt, hat der BGH offengelassen: Sicherer ist der Zugang bis Freitag.', 'The third working day is a Saturday. The Federal Court left open whether the deadline then moves to Monday: delivery by Friday is safer.') : T(lang, 'Maßgeblich ist der Zugang beim Empfänger, nicht das Absendedatum. Der Samstag zählt als Werktag, Sonn- und Feiertage nicht.', 'What counts is when the notice reaches the other side, not when it was sent. Saturday counts as a working day, Sundays and public holidays do not.')}
        methodHref={methodHref} methodLabel={T(lang, 'So rechnen wir', 'How we calculate')} />}
    />
  );
}
