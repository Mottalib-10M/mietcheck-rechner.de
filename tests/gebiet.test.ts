/** Recherche des communes dans les Verordnungen des Länder (src/data/laender.json). */
import { describe, expect, it } from 'vitest';
import { status, LAENDER_VO } from '../src/lib/engine/gebiet';
const D = '2026-10-12';
describe('Verordnungen der Länder', () => {
  it('16 Länder, Listen nicht leer, wo eine Verordnung besteht', () => {
    expect(LAENDER_VO).toHaveLength(16);
    for (const l of LAENDER_VO) for (const v of [l.mpb, l.kappung]) if (v) expect(v.gemeinden.length).toBeGreaterThan(0);
  });
  it.each([['BE', 'Berlin'], ['HH', 'Hamburg'], ['BY', 'München'], ['NW', 'Köln'], ['HE', 'Frankfurt am Main'], ['BW', 'Stuttgart'], ['NW', 'Düsseldorf'], ['SN', 'Leipzig'], ['SN', 'Dresden'], ['NI', 'Hannover'], ['BY', 'Nürnberg'], ['HB', 'Bremen'], ['NW', 'Dortmund'], ['NW', 'Düren'], ['BB', 'Potsdam'], ['MV', 'Rostock'], ['TH', 'Jena']])('%s %s : Mietpreisbremse und 15 % am 12.10.2026', (l, g) => {
    const s = status(l, g, D);
    expect(s.mpb, `${g} mpb`).toBe(true);
    expect(s.kappung, `${g} kappung`).toBe(0.15);
  });
  it('Essen : nicht in der Verordnung NRW', () => {
    for (const g of ['Essen']) { const s = status('NW', g, D); expect(s.gefunden).toBe(false); expect(s.kappung).toBe(0.2); }
  });
  it('Schleswig-Holstein : Kappung ohne Mietpreisbremse ; Saarland : nichts', () => {
    const sh = status('SH', 'Ahrensburg', D); expect(sh.mpb).toBe(false); expect(sh.kappung).toBe(0.15);
    expect(status('SL', 'Saarbrücken', D).gefunden).toBe(false);
  });
  it('Baden-Württemberg läuft am 31.12.2026 aus, Hessen am 25.11.2026', () => {
    expect(status('BW', 'Stuttgart', '2027-01-15').mpb).toBe(false);
    expect(status('HE', 'Frankfurt am Main', '2026-12-01').mpb).toBe(false);
  });
});
