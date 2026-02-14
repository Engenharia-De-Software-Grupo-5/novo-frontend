'use client';

import { Badge } from '@/features/components/ui/badge';

import { PAYMENT_STATUSES } from '../constants';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = PAYMENT_STATUSES.find((s) => s.value === status);
  const Icon = statusConfig?.icon;

  return (
    <Badge variant="muted" className="flex w-fit items-center gap-1 capitalize">
      {Icon && (
        <Icon
          className={`h-3 w-3 ${
            status === 'pago'
              ? 'text-green-500'
              : status === 'atrasado'
                ? 'text-destructive'
                : 'text-amber-500' // agendado/pendente color
          }`}
        />
      )}
      {statusConfig?.label || status}
    </Badge>
  );
}
