import { FileAttachment } from './file';

export interface DespesaSummary {
  id: string;
  nome: string;
  idImovel?: string | null;
  tipo: string;
  data: string;
  valor: number;
  formaPagamento: string;
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
