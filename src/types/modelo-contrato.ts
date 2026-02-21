export interface ModeloContratoInput {
  key: string;
  group: string | null;
  field: string;
  label: string;
}

export interface ModeloContratoSummary {
  id: string;
  name: string;
  purpose: string;
  createdAt: string;
}

export interface ModeloContratoDetail extends ModeloContratoSummary {
  condId: string;
  rawText: string;
  inputs: ModeloContratoInput[];
}

export interface ModeloContratoResponse {
  data: ModeloContratoSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
