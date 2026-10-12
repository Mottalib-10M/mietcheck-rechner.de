/** Mietminderung (§ 536 BGB) : quote appliquée au loyer brut (BGH, 6.4.2005, XII ZR 225/03), au jour près. */
import NumberField from '../ui/NumberField';
import DateField from '../ui/DateField';
import ResultCard from './ResultCard';
import Shell, { Row2 } from './Shell';
import { useUrl } from './useUrl';
import { fmt, T, type L } from './i18n';
import { minderung } from '../../lib/engine/miete';
import { cmp } from '../../lib/engine/dates';

export default function MinderungRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const f = fmt(lang);
  const [s, set] = useUrl({ kalt: 750, nk: 220, q: 10, von: '2026-01-10', bis: '2026-03-15' });
  const ok = cmp(s.von, s.bis) <= 0;
  const r = minderung({ kalt: s.kalt, nebenkosten: s.nk, quote: s.q / 100, von: s.von, bis: ok ? s.bis : s.von });
  return (
    <Shell
      form={<>
        <Row2>
          <NumberField id="mi-kalt" label={T(lang, 'Nettokaltmiete pro Monat', 'Net cold rent per month')} value={s.kalt} onChange={set('kalt')} unit="€" max={10000} lang={lang} />
          <NumberField id="mi-nk" label={T(lang, 'Nebenkosten-Vorauszahlung', 'Service-charge advance')} value={s.nk} onChange={set('nk')} unit="€" max={3000} lang={lang} />
        </Row2>
        <Row2>
          <NumberField id="mi-q" label={T(lang, 'Minderungsquote', 'Reduction rate')} value={s.q} onChange={set('q')} unit="%" max={100} decimals={1} lang={lang} />
        </Row2>
        <Row2>
          <DateField id="mi-von" label={T(lang, 'Mangel besteht seit', 'Defect since')} value={s.von} onChange={set('von')} />
          <DateField id="mi-bis" label={T(lang, 'Behoben am (oder heute)', 'Fixed on (or today)')} value={s.bis} onChange={set('bis')} />
        </Row2>
      </>}
      result={<ResultCard head={T(lang, 'Minderung für den Zeitraum', 'Reduction for the period')} big={f.eur2(r.summe)}
        sub={ok ? undefined : T(lang, 'Das Ende liegt vor dem Beginn.', 'The end is before the start.')}
        rows={[
          { label: T(lang, 'Bruttomiete (Basis)', 'Gross rent (basis)'), value: f.eur2(r.brutto) },
          { label: T(lang, 'Minderung pro vollem Monat', 'Reduction per full month'), value: f.eur2(r.monat), strong: true },
          { label: T(lang, 'Zu zahlen im vollen Monat', 'Payable in a full month'), value: f.eur2(r.neueMiete) },
          { label: T(lang, 'Tage mit Mangel', 'Days with the defect'), value: f.num(r.tage) },
        ]}
        note={T(lang, 'Die Quote legt kein Gesetz fest: Sie hängt von Art und Schwere des Mangels ab und wird im Streit vom Gericht bestimmt. Die Minderung setzt eine Mängelanzeige voraus (§ 536c BGB).', 'No statute fixes the rate: it depends on the kind and severity of the defect and, in a dispute, is set by the court. The reduction requires you to report the defect (Section 536c BGB).')}
        methodHref={methodHref} methodLabel={T(lang, 'So rechnen wir', 'How we calculate')} />}
    />
  );
}
