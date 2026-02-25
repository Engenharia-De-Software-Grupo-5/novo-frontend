import { FileAttachment } from './file';

export type CobrancaTipo =
  | 'boleto_mensal'
  | 'taxa_mudanca'
  | 'reserva'
  | 'multa'
  | 'outros';

export type CobrancaStatus = 'pago' | 'pendente' | 'vencida' | 'desativada';

export type CobrancaFormaPagamento = 'boleto' | 'pix';

export interface CobrancaTenant {
  id: string;
  name: string;
  email: string;
  cpf: string;
}

export interface CobrancaSummary {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  cpf: string;
  type: CobrancaTipo;
  status: CobrancaStatus;
  dueDate: string;
  value: number;
  isActive: boolean;
}

export interface CobrancaDetail extends CobrancaSummary {
  paymentMethod: CobrancaFormaPagamento;
  penalty: number;
  interest: number;
  paymentDate?: string;
  observation?: string;
  attachments?: FileAttachment[];
}

export interface CobrancaResponse {
  items: CobrancaSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
