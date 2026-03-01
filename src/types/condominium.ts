export interface Condominium {
  id: string;
  name: string;
}

export interface CondominiumResponse {
  id: string;
  name: string;
  description: string;
  address: {
    id: string;
    zip: string;
    neighborhood: string;
    city: string;
    complement: string | null;
    number: number;
    street: string;
    uf: string;
  };
}

export interface CondominiumRequest {
  name: string;
  description: string;
  address: {
    zip: string;
    neighborhood: string;
    city: string;
    complement: string | null;
    number: number;
    street: string;
    uf: string;
  };
}
