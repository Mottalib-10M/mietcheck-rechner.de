/** Cadre commun des outils : formulaire à gauche, carte de résultat à droite (RECETTE §5, premier écran). */
import type { ReactNode } from 'react';
export default function Shell({ form, result, foot }: { form: ReactNode; result: ReactNode; foot?: ReactNode }) {
  return (
    <div className="rechner not-prose rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">{form}</form>
        {result}
      </div>
      {foot && <div className="mt-3 text-xs text-navy-600">{foot}</div>}
    </div>
  );
}
export const Row2 = ({ children }: { children: ReactNode }) => <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">{children}</div>;
