
export function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 mt-6 first:mt-0">
      <div className="p-1.5 bg-slate-100 rounded-md">
        <Icon className="h-4 w-4 text-slate-600" />
      </div>
      <h3 className="text-[12px] font-bold uppercase tracking-wider text-slate-700">{title}</h3>
    </div>
  );
}

export function Info({ label, value, className = "" }: { label: string; value: any; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[10px] font-semibold uppercase text-slate-500 tracking-tight">{label}</span>
      <span className="text-sm text-slate-900 font-medium leading-none">
        {typeof value === "string" || typeof value === "number" ? value : "—"}
      </span>
    </div>
  );
}