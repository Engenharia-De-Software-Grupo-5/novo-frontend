import {
  CheckCircle,
  Loader2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'ativo' | 'pendente' | 'inativo';

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    ativo: {
      label: 'Ativo',
      icon: CheckCircle,
      iconClass: 'text-emerald-500',
    },
    pendente: {
      label: 'Pendente',
      icon: Loader2,
      iconClass: 'text-brand-gray',
      spinning: true,
    },
    inativo: {
      label: 'Inativo',
      icon: XCircle,
      iconClass: 'text-red-500',
    },
  }[status];

  const Icon = config.icon;

  return (
    <span className="text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs">
      <Icon
        className={cn(
          'h-3.5 w-3.5',
          config.iconClass,
          config.spinning && 'animate-spin'
        )}
      />
      {config.label}
    </span>
  );
}