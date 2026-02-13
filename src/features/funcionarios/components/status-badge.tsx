'use client';

import { Badge } from '@/features/components/ui/badge';

import { EMPLOYEE_STATUSES } from '../constants';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = EMPLOYEE_STATUSES.find((s) => s.value === status);
  const Icon = statusConfig?.icon;

  return (
    <Badge variant="muted" className="flex w-fit items-center gap-1 capitalize">
      {Icon && (
        <Icon
          className={`h-3 w-3 ${status === 'ativo' ? 'text-green-500' : status === 'inativo' ? 'text-destructive' : ''}`}
        />
      )}
      {statusConfig?.label || status}
    </Badge>
  );
}
