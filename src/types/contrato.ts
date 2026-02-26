export interface ContratoSummary {
  id: string;
  condId: string;
  propertyId?: string;
  tenantName: string;
  tenantId?: string;
  property: string;
  createdAt: string;
  dueDate: string;
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
  items: ContratoSummary[];
  meta: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
