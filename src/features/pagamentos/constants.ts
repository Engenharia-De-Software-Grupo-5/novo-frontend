import { CircleCheck, CircleX, Clock } from 'lucide-react';

export const PAYMENT_STATUSES = [
  { label: 'Pago', value: 'pago', icon: CircleCheck },
  { label: 'Agendado', value: 'agendado', icon: Clock },
  { label: 'Atrasado', value: 'atrasado', icon: CircleX },
] as const;

export const PAYMENT_COLUMN_LABELS: Record<string, string> = {
  name: 'Nome',
  role: 'Cargo',
  value: 'Valor',
  status: 'Status',
  paymentDate: 'Data Pagamento',
};
