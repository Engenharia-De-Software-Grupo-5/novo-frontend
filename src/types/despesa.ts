import { FileAttachment } from './file';

export interface DespesaSummary {
  id: string;
  nome: string;
  idImovel?: string | null;
  tipo: string;
  data: string;
  valor: number;
  formaPagamento: string;
}

export interface DespesaResponseAPI {
  id: string;
  targetType: string;
  description: string;
  propertyId: string;
  expenseType: string;
  value: number;
  expenseDate: string;
  expenseFiles: FileAttachment[];
  paymentMethod: string;
}
export interface DespesaRequestAPI {
  targetType: string;
  description: string;
  propertyId?: string;
  expenseType: string;
  value: number;
  expenseDate: string;
  paymentMethod: string;
  filesToKeep?: string[];
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
export interface DespesaResponseApiGetAll {
  items: DespesaResponseAPI[];
  meta: {
    pageIndex: number;
    pageCount: number;
    totalItems: number;
  };
}
