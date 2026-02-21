export type ImovelTipo = 'casa' | 'apartamento';

export type ImovelSituacao =
  | 'ativo'
  | 'inativo'
  | 'manutenção'
  | 'na planta';

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
  tipo: ImovelTipo;
  situacao: ImovelSituacao;
  endereco: Endereco;
  locatario: Locatario | null;
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
  data: ImovelSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Compatibilidade com o código legado
export type Imovel = ImovelDetail;
