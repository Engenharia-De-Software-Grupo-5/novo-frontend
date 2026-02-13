'use client';

import { Badge } from '@/features/components/ui/badge';
import { CircleCheck, CircleX, Loader } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="muted" className="flex w-fit items-center gap-1 capitalize">
      {status === 'ativo' && <CircleCheck className="h-3 w-3 text-green-500" />}
      {status === 'pendente' && <Loader className="h-3 w-3" />}
      {status === 'inativo' && <CircleX className="text-destructive h-3 w-3" />}
      {status}
    </Badge>
  );
}
