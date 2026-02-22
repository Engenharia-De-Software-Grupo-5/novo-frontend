'use client';

import { Badge } from '@/features/components/ui/badge';

import { EMPLOYEE_STATUSES } from '../constants';

interface StatusBadgeProps {
  readonly status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = EMPLOYEE_STATUSES.find((s) => s.value === status);
  const Icon = statusConfig?.icon;

  let statusColor = '';
  if (status === 'ativo') {
    statusColor = 'text-green-500';
  } else if (status === 'inativo') {
    statusColor = 'text-destructive';
  }

  return (
    <Badge variant="muted" className="flex w-fit items-center gap-1 capitalize">
      {Icon && <Icon className={`h-3 w-3 ${statusColor}`} />}
      {statusConfig?.label || status}
    </Badge>
  );
}
