import { FileAttachment } from './file';

export type PaymentType =
  | 'salário'
  | 'hora extra'
  | 'adicional noturno'
  | 'comissão'
  | 'bonificação'
  | 'ferias'
  | '13º salário'
  | 'adiantamento'
  | 'serviço'
  | 'outros';

export type PaymentStatus = 'agendado' | 'pago' | 'atrasado';

export interface PaymentSummary {
  id: string;
  name: string;
  role: string;
  value: number;
  status: PaymentStatus;
  paymentDate?: string;
}

export interface PaymentDetail extends PaymentSummary {
  employeeId: string;
  type: PaymentType;
  dueDate: string;
  observation?: string;
  proofs?: FileAttachment[];
}

export interface PaymentResponse {
  items: PaymentSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
