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

export interface Estrutura {
  area: number; // em metros quadrados
  numSuites: number;
  numQuartos: number;
  numBanheiros: number;
}

export interface Imovel {
  idCondominio: string;
  idImovel: string;
  tipo: 'casa' | 'apartamento';
  situacao: 'ativo' | 'inativo' | 'manutenção' | 'na planta';
  endereco: Endereco;
  estrutura: Estrutura;
  outros: string[];
}
