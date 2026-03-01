import { FileAttachment } from './file';


export type FormaPagamento = 
  | 'CASH' 
  | 'PIX' 
  | 'BOLETO' 
  | 'CREDIT_CARD' 
  | 'DEBIT_CARD';

export interface DespesaSummary {
  id: string;
  nome: string;
  idImovel?: string | null;
  tipo: string;
  data: string;
  valor: number;
  formaPagamento: FormaPagamento;
  status: 'pendente' | 'pago' | 'atrasado';
}

export interface DespesaDetail extends DespesaSummary {
  anexos: FileAttachment[];
}

export interface DespesaResponse {
  items: DespesaSummary[];
  meta: {
    pageIndex: number;
    pageCount: number;
    totalItems: number;
  };
}
