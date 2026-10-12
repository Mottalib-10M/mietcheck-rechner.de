/** Champ texte avec liste de suggestions (datalist), par exemple le nom d'une commune. */
interface Props { id: string; label: string; value: string; onChange: (v: string) => void; list?: string[]; placeholder?: string; help?: string; className?: string }
export default function TextField({ id, label, value, onChange, list, placeholder, help, className = '' }: Props) {
  return (
    <div className={`grid grid-rows-subgrid row-span-3 content-start gap-y-0 ${className}`}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <input id={id} type="text" autoComplete="off" value={value} placeholder={placeholder} list={list ? `${id}-list` : undefined} onChange={(e) => onChange(e.target.value)} aria-describedby={help ? `${id}-help` : undefined}
        className="w-full rounded-lg border border-navy-300 bg-white h-12 px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
      {list && <datalist id={`${id}-list`}>{list.map((x) => <option key={x} value={x} />)}</datalist>}
      {help && <p id={`${id}-help`} className="mt-1 text-xs text-navy-500">{help}</p>}
    </div>
  );
}
