export function SectionTitle({
  icon: Icon,
  title,
}: {
  readonly icon: React.ElementType;
  readonly title: string;
}) {
  return (
    <div className="mt-6 mb-4 flex items-center gap-2 first:mt-0">
      <div className="rounded-md bg-slate-100 p-1.5">
        <Icon className="h-4 w-4 text-slate-600" />
      </div>
      <h3 className="text-[12px] font-bold tracking-wider text-slate-700 uppercase">
        {title}
      </h3>
    </div>
  );
}

export function Info({
  label,
  value,
  className = '',
}: {
  readonly label: string;
  readonly value: string | number | null | undefined;
  readonly className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[10px] font-semibold tracking-tight text-slate-500 uppercase">
        {label}
      </span>
      <span className="text-sm leading-none font-medium text-slate-900">
        {typeof value === 'string' || typeof value === 'number' ? value : '—'}
      </span>
    </div>
  );
}
