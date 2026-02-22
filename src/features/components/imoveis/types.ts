export type ImovelStatus = 'ocupado' | 'vago' | 'manutencao' | 'na planta';

export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento?: string;
}

export interface Locatario {
  nome: string;
  logradouro: string;
  numero: string;
  bairro: string;
}

export interface Imovel {
  id: string;
  nome: string;
  status: ImovelStatus;
  tipo: string;
  endereco: Endereco;
  locatario: Locatario | null;
}
