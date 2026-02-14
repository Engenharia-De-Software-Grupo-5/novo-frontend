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

export const PAYMENT_TYPES = [
  { label: 'Salário', value: 'salário' },
  { label: '13º Salário', value: '13º salário' },
  { label: 'Adiantamento', value: 'adiantamento' },
  { label: 'Adicional Noturno', value: 'adicional noturno' },
  { label: 'Bonificação', value: 'bonificação' },
  { label: 'Comissão', value: 'comissão' },
  { label: 'Férias', value: 'ferias' },
  { label: 'Hora Extra', value: 'hora extra' },
  { label: 'Serviço', value: 'serviço' },
  { label: 'Outros', value: 'outros' },
] as const;
