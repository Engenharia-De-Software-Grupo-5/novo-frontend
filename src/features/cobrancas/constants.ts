import { CalendarClock, CheckCircle2, CircleOff, CircleX } from 'lucide-react';

export const COBRANCA_STATUSES = [
  { label: 'Pago', value: 'pago', icon: CheckCircle2 },
  { label: 'Pendente', value: 'pendente', icon: CalendarClock },
  { label: 'Vencida', value: 'vencida', icon: CircleX },
  { label: 'Desativada', value: 'desativada', icon: CircleOff },
] as const;

export const COBRANCA_TYPES = [
  { label: 'Boleto mensal', value: 'boleto_mensal' },
  { label: 'Taxa de mudança', value: 'taxa_mudanca' },
  { label: 'Reservas', value: 'reserva' },
  { label: 'Multa', value: 'multa' },
  { label: 'Outros', value: 'outros' },
] as const;

export const COBRANCA_PAYMENT_METHODS = [
  { label: 'Boleto', value: 'boleto' },
  { label: 'PIX', value: 'pix' },
] as const;

export const COBRANCA_COLUMN_LABELS: Record<string, string> = {
  name: 'Nome',
  email: 'E-mail',
  cpf: 'CPF',
  type: 'Tipo',
  status: 'Situação',
  dueDate: 'Data de vencimento',
  value: 'Valor',
};
