/**
 * État d'un outil dans l'adresse (lien partageable), selon la règle d'hydratation de url-state.ts :
 * premier rendu = valeurs par défaut du build, lecture de l'URL seulement après le montage.
 */
import { useEffect, useState } from 'react';
import { readParams, updateURL } from '../../lib/url-state';
type V = string | number;
export function useUrl<S extends Record<string, V>>(defaults: S): [S, <K extends keyof S>(k: K) => (v: S[K]) => void] {
  const [s, setS] = useState<S>(defaults);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (![...u.keys()].length) return;
    const next = { ...defaults };
    for (const k of Object.keys(defaults) as Array<keyof S>) {
      const raw = u.get(String(k)); if (raw === null) continue;
      if (typeof defaults[k] === 'number') { const n = parseFloat(raw); if (!isNaN(n)) (next as Record<string, V>)[k as string] = n; }
      else (next as Record<string, V>)[k as string] = raw;
    }
    setS(next);
  }, []);
  useEffect(() => { updateURL(s); }, [s]);
  const set = <K extends keyof S>(k: K) => (v: S[K]) => setS((o) => ({ ...o, [k]: v }));
  return [s, set];
}
