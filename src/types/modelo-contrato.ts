export interface ModeloContratoInput {
  key: string;
  group: string | null;
  field: string;
  label: string;
}

export interface ModeloContratoSummary {
  id: string;
  name: string;
  description: string;
}

export interface ModeloContratoDetail extends ModeloContratoSummary {
  condId: string;
  rawText: string;
  inputs: ModeloContratoInput[];
}

export interface ModeloContratoRequest {
  name: string;
  description: string;
  template: string;
}

export interface ModeloContratoResponse {
  items: ModeloContratoSummary[];
  meta: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
