/** Mietkaution (§ 551 BGB) : plafond de trois loyers nets froids, trois versements, intérêts. */
import NumberField from '../ui/NumberField';
import DateField from '../ui/DateField';
import ResultCard from './ResultCard';
import Shell, { Row2 } from './Shell';
import { useUrl } from './useUrl';
import { fmt, T, type L } from './i18n';
import { kaution } from '../../lib/engine/miete';

export default function KautionRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const f = fmt(lang);
  const [s, set] = useUrl({ kalt: 850, verlangt: 2550, beginn: '2026-11-01', zins: 0.5, jahre: 4 });
  const r = kaution({ kaltmiete: s.kalt, verlangt: s.verlangt, beginn: s.beginn, zins: s.zins / 100, jahre: s.jahre });
  return (
    <Shell
      form={<>
        <Row2>
          <NumberField id="ka-kalt" label={T(lang, 'Nettokaltmiete pro Monat', 'Net cold rent per month')} value={s.kalt} onChange={set('kalt')} unit="€" max={20000} lang={lang} help={T(lang, 'Ohne Nebenkosten-Vorauszahlung', 'Without the service-charge advance')} />
          <NumberField id="ka-v" label={T(lang, 'Verlangte Kaution', 'Deposit asked for')} value={s.verlangt} onChange={set('verlangt')} unit="€" max={100000} lang={lang} />
        </Row2>
        <Row2>
          <DateField id="ka-b" label={T(lang, 'Mietbeginn', 'Start of tenancy')} value={s.beginn} onChange={set('beginn')} />
        </Row2>
        <Row2>
          <NumberField id="ka-z" label={T(lang, 'Zinssatz der Anlage', 'Interest rate of the account')} value={s.zins} onChange={set('zins')} unit="%" max={10} decimals={2} lang={lang} />
          <NumberField id="ka-j" label={T(lang, 'Dauer der Miete', 'Length of tenancy')} value={s.jahre} onChange={set('jahre')} unit={T(lang, 'Jahre', 'years')} max={60} lang={lang} />
        </Row2>
      </>}
      result={<ResultCard head={T(lang, 'Höchstens zulässige Kaution', 'Maximum lawful deposit')} big={f.eur2(r.hoechst)}
        sub={r.zuviel > 0 ? T(lang, `${f.eur2(r.zuviel)} mehr verlangt als erlaubt`, `${f.eur2(r.zuviel)} more than allowed`) : undefined}
        rows={[
          { label: T(lang, 'Drei Raten zu je', 'Three instalments of'), value: f.eur2(r.rate), strong: true },
          ...r.raten.map((d, k) => ({ label: `${k + 1}. ${T(lang, 'Rate fällig', 'instalment due')}`, value: f.date(d) })),
          { label: T(lang, 'Zinsen bis zum Auszug', 'Interest until move-out'), value: f.eur2(r.zinsen) },
          { label: T(lang, 'Kündigungsgrenze bei Verzug', 'Arrears that allow termination'), value: f.eur2(r.verzugsgrenze) },
        ]}
        note={T(lang, 'Die Zinsen stehen dem Mieter zu und erhöhen die Kaution (§ 551 Abs. 3 BGB). Den Zinssatz Ihres Kautionskontos finden Sie im Kontoauszug.', 'Interest belongs to the tenant and is added to the deposit (Section 551(3) BGB). Your deposit account statement shows the rate.')}
        methodHref={methodHref} methodLabel={T(lang, 'So rechnen wir', 'How we calculate')} />}
    />
  );
}
