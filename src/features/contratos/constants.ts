import { CalendarClock, CircleAlert, CircleCheck } from 'lucide-react';

export const CONTRACT_STATUSES = [
  { label: 'Ativo', value: 'ativo', icon: CircleCheck },
  { label: 'Vencido', value: 'vencido', icon: CircleAlert },
  { label: 'Agendado', value: 'agendado', icon: CalendarClock },
] as const;

export const CONTRACT_COLUMN_LABELS: Record<string, string> = {
  propertyName: 'Imóvel',
  tenantName: 'Locatário',
  startDate: 'Data de Início',
  dueDate: 'Data de Vencimento',
  pdfFileName: 'PDF do Contrato',
};
