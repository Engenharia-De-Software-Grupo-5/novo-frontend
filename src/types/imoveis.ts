import { FileAttachment } from '@/types/file';

export type ImovelTipo = 'HOUSE' | 'APARTMENT' | 'COMMERCIAL';
export type ImovelSituacao = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'OFF_PLAN';

export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  nomePredio?: string;
  bloco?: string;
  torre?: string;
}

export interface Locatario {
  nome: string;
  cpf: string;
  telefone: string;
}

export interface ImovelDetail {
  idCondominio: string;
  idImovel: string;
  nome: string;
  numeroUnidade?: string; 
  observacoes?: string;
  tipo: ImovelTipo;
  situacao: ImovelSituacao;
  endereco: Endereco;
  locatario: Locatario | null;
  vistorias?: FileAttachment[];
  documentos?: FileAttachment[];
}

export interface ImovelSummary {
  idImovel: string;
  name: string;
  tipo: ImovelTipo;
  situacao: ImovelSituacao;
  endereco: string;
  bairro: string;
  cidade: string;
}

export interface ImovelResponse {
  items: ImovelSummary[];
  meta: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type Imovel = ImovelDetail;