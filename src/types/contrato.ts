export interface ContratoPostDTO {
  tenantId: string;
  propertyId: string;
  content: string;
  startDate: string;
  dueDate: string;
}

export interface ContratoResponseDTO {
  tenantName: string;
  propertyName: string;
  startDate: string;
  dueDate: string;
}

export interface ContratoSummary extends ContratoResponseDTO {
  id: string;
  condId: string;
  propertyId: string;
  tenantId: string;
  content: string;
  pdfFileName: string;
  pdfFileUrl: string;
  sourceType: 'upload' | 'model';
  modelId?: string;
  modelName?: string;
}

export interface ContratoDetail extends ContratoSummary {
  modelInputValues?: Record<string, string>;
}

export interface ContratoResponse {
  data: ContratoSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
