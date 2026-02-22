'use client';

import { Badge } from '@/features/components/ui/badge';
import { CircleAlert, CircleCheck, CircleDashed } from 'lucide-react';

import { CobrancaStatus } from '@/types/cobranca';

const statusConfig: Record<
  CobrancaStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  pago: {
    label: 'Pago',
    icon: CircleCheck,
    className: 'border-border bg-background text-foreground [&_svg]:text-emerald-500',
  },
  pendente: {
    label: 'Pendente',
    icon: CircleDashed,
    className: 'border-border bg-background text-foreground [&_svg]:text-slate-500',
  },
  vencida: {
    label: 'Vencida',
    icon: CircleAlert,
    className: 'border-border bg-background text-foreground [&_svg]:text-red-500',
  },
  desativada: {
    label: 'Desativada',
    icon: CircleDashed,
    className: 'border-border bg-background text-foreground [&_svg]:text-amber-500',
  },
};

interface StatusBadgeProps {
  readonly status: CobrancaStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`gap-1.5 ${config.className}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}
