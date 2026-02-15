'use client';

import { Badge } from '@/features/components/ui/badge';

import { PAYMENT_STATUSES } from '../constants';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = PAYMENT_STATUSES.find((s) => s.value === status);
  const Icon = statusConfig?.icon;

  let badgeClasses = 'bg-gray-100 text-gray-700 hover:bg-gray-100';
  let iconClass = 'text-gray-500';

  if (status === 'pago') {
    badgeClasses = 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50';
    iconClass = 'text-emerald-600';
  } else if (status === 'agendado') {
    badgeClasses = 'bg-blue-50 text-blue-700 hover:bg-blue-50';
    iconClass = 'text-blue-600';
  } else if (status === 'atrasado') {
    badgeClasses = 'bg-red-50 text-red-700 hover:bg-red-50';
    iconClass = 'text-red-600';
  }

  return (
    <Badge
      variant="outline"
      className={`flex w-fit items-center gap-1 border-transparent ${badgeClasses} capitalize`}
    >
      {Icon && <Icon className={`h-3 w-3 ${iconClass}`} />}
      {statusConfig?.label || status}
    </Badge>
  );
}
