
interface SectionHeaderProps {
  readonly title: string;
  readonly description?: string;
}

export const SectionHeader = ({ title, description }: SectionHeaderProps) => (
  <div className="space-y-1">
    <h2 className="text-base font-bold text-slate-900">{title}</h2>
    {description && <p className="text-sm text-slate-400">{description}</p>}
  </div>
);