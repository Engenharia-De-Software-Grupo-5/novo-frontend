import {
  CheckCircle,
  HelpCircle,
  Loader,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'ativo' | 'pendente' | 'inativo';

interface StatusBadgeProps {
  readonly status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  console.log("Status recebido no Badge:", status);
  const statusOptions = {
    ativo: {
      label: 'Ativo',
      icon: CheckCircle,
      iconClass: 'text-emerald-500',
    },
    pendente: {
      label: 'Pendente',
      icon: Loader,
      iconClass: 'text-brand-gray',
    },
    inativo: {
      label: 'Inativo',
      icon: XCircle,
      iconClass: 'text-red-500',
    },
  }

  const config = statusOptions[status as keyof typeof statusOptions] || {
    label: status || 'N/A',
    icon: HelpCircle,
    iconClass: 'text-slate-400',
  };

  const Icon = config.icon;


  return (
    <span className="text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs">
      <Icon
        className={cn(
          'h-3.5 w-3.5',
          config.iconClass
        )}
      />
      {config.label}
    </span>
  );
}