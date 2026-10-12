/** Nebenkostenabrechnung prüfen : délais (§ 556 Abs. 3 BGB), solde, coût au m² comparé à la Berliner Betriebskostenübersicht, nouvelle avance (§ 560 Abs. 4). */
import NumberField from '../ui/NumberField';
import DateField from '../ui/DateField';
import ResultCard from './ResultCard';
import Shell, { Row2 } from './Shell';
import { useUrl } from './useUrl';
import { fmt, T, type L } from './i18n';
import { bkFristen, bkVergleich, vorauszahlung } from '../../lib/engine/miete';
import { cmp } from '../../lib/engine/dates';

export default function NebenkostenRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const f = fmt(lang);
  const [s, set] = useUrl({ ende: '2025-12-31', zugang: '2026-06-15', fl: 65, kalt: 1500, warm: 1150, vz: 210 });
  const fr = bkFristen({ periodeEnde: s.ende, zugang: s.zugang });
  const v = bkVergleich({ kalt: s.kalt, warm: s.warm, flaeche: s.fl });
  const saldo = s.kalt + s.warm - 12 * s.vz;
  const neu = vorauszahlung({ bisher: s.vz, ergebnis: saldo });
  const late = !!fr.zuSpaet && saldo > 0;
  const head = late ? T(lang, 'Nachzahlung entfällt (zu spät)', 'Top-up lapses (too late)') : saldo >= 0 ? T(lang, 'Nachzahlung laut Abrechnung', 'Top-up due under the statement') : T(lang, 'Guthaben laut Abrechnung', 'Credit under the statement');
  const rows = [
    { label: T(lang, 'Abrechnung musste ankommen bis', 'Statement had to arrive by'), value: f.date(fr.abrechnungBis), strong: true },
    { label: T(lang, 'Einwendungen möglich bis', 'Objections possible until'), value: fr.einwendungBis ? f.date(fr.einwendungBis) : '–' },
    { label: T(lang, 'Kalte Betriebskosten je m² und Monat', 'Cold service charges per m² per month'), value: f.m2(v.kalt) },
    { label: T(lang, 'Berliner Mittelwert 2024 (kalt)', 'Berlin average 2024 (cold)'), value: f.m2(v.refKalt) },
    { label: T(lang, 'Heizung und Warmwasser je m² und Monat', 'Heating and hot water per m² per month'), value: f.m2(v.warm) },
    { label: T(lang, 'Berliner Mittelwert 2024 (warm)', 'Berlin average 2024 (warm)'), value: f.m2(v.refWarm) },
    { label: T(lang, 'Angemessene Vorauszahlung ab jetzt', 'Reasonable advance payment from now'), value: `${f.eur2(neu.neu)} / ${T(lang, 'Monat', 'month')}` },
  ];
  const note = late
    ? T(lang, 'Die Abrechnung kam nach Ablauf der Zwölfmonatsfrist: Eine Nachforderung ist ausgeschlossen, es sei denn, der Vermieter hat die Verspätung nicht zu vertreten. Ein Guthaben muss er trotzdem auszahlen.', 'The statement arrived after the twelve-month deadline: the landlord cannot claim a top-up unless the delay was not his fault. A credit must still be paid out.')
    : T(lang, 'Liegt ein Posten deutlich über dem Berliner Mittelwert, lohnt sich die Belegeinsicht (§ 556 Abs. 4 BGB). Der Vergleich ist eine Orientierung, kein Rechtsanspruch.', 'Where an item is well above the Berlin average, ask to inspect the receipts (Section 556(4) BGB). The comparison is guidance, not a legal entitlement.');
  return (
    <Shell
      form={<>
        <Row2>
          <DateField id="nk-ende" label={T(lang, 'Ende des Abrechnungszeitraums', 'End of the billing period')} value={s.ende} onChange={set('ende')} />
          <DateField id="nk-zugang" label={T(lang, 'Abrechnung erhalten am', 'Statement received on')} value={s.zugang} onChange={set('zugang')} />
        </Row2>
        <Row2>
          <NumberField id="nk-fl" label={T(lang, 'Wohnfläche', 'Floor area')} value={s.fl} onChange={set('fl')} unit="m²" max={500} lang={lang} />
          <NumberField id="nk-vz" label={T(lang, 'Vorauszahlung pro Monat', 'Advance payment per month')} value={s.vz} onChange={set('vz')} unit="€" max={3000} lang={lang} />
        </Row2>
        <Row2>
          <NumberField id="nk-kalt" label={T(lang, 'Kalte Betriebskosten im Jahr', 'Cold service charges for the year')} value={s.kalt} onChange={set('kalt')} unit="€" max={50000} lang={lang} />
          <NumberField id="nk-warm" label={T(lang, 'Heizung und Warmwasser im Jahr', 'Heating and hot water for the year')} value={s.warm} onChange={set('warm')} unit="€" max={50000} lang={lang} />
        </Row2>
      </>}
      result={<ResultCard head={head} big={f.eur2(Math.abs(late ? 0 : saldo))} sub={cmp(s.zugang, s.ende) < 0 ? T(lang, 'Das Zugangsdatum liegt vor dem Ende des Zeitraums.', 'The receipt date is before the end of the period.') : undefined} rows={rows} note={note} methodHref={methodHref} methodLabel={T(lang, 'So rechnen wir', 'How we calculate')} />}
    />
  );
}
