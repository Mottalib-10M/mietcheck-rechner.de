/**
 * Carte de résultat commune aux outils : un chiffre principal, des lignes de détail, une note.
 * `data-resultat` : bloc contrôlé par check-premier-ecran (RECETTE §5, règle du 2026-10-11).
 * Sur téléphone, tant que la carte n'est pas à l'écran, une barre collante en bas rappelle le
 * chiffre clé et y mène d'un geste ; elle disparaît dès que la carte est visible.
 */
import { useEffect, useRef, useState } from 'react';

export interface Row { label: string; value: string; strong?: boolean }
export default function ResultCard({ head, big, sub, rows, note, methodHref, methodLabel }: { head: string; big: string; sub?: string; rows: Row[]; note?: string; methodHref?: string; methodLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hors, setHors] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setHors(!e.isIntersecting && e.boundingClientRect.top > 0), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <>
      <div ref={ref} id="resultat" aria-live="polite" data-resultat className="mt-6 scroll-mt-20 rounded-xl border border-accent-200 bg-accent-50/60 p-4 sm:p-5 lg:sticky lg:top-20 lg:mt-0">
        <p className="text-sm font-medium text-navy-700">{head}</p>
        <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{big}</p>
        {sub && <p className="mt-1 text-navy-700">{sub}</p>}
        <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
          {rows.map((r) => <tr key={r.label}><td className="py-1.5 pr-3 text-navy-700">{r.label}</td><td className={`tabular-nums py-1.5 text-right ${r.strong ? 'font-semibold text-navy-900' : 'text-navy-900'}`}>{r.value}</td></tr>)}
        </tbody></table>
        {note && <p className="mt-3 text-sm text-navy-700">{note}</p>}
        {methodHref && <a href={methodHref} className="mt-2 inline-block text-sm font-medium text-accent-700 underline">{methodLabel}</a>}
      </div>
      {hors && (
        <a href="#resultat" aria-hidden="true" tabIndex={-1} className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-accent-200 bg-white/95 px-4 py-3 shadow-[0_-4px_12px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
          <span className="text-sm font-medium text-navy-700">{head}</span>
          <span className="tabular-nums text-xl font-bold text-navy-900">{big}</span>
        </a>
      )}
    </>
  );
}
