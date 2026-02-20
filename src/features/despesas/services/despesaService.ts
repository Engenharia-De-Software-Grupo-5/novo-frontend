import { apiRequest, buildQueryString } from '@/lib/api-client';
import { buildFormDataBody, FileUploadOptions } from '@/lib/form-data';
import { DespesaSummary, DespesaDetail, DespesaResponse } from '@/types/despesa';

const getBaseUrl = (condId: string) => `/api/condominios/${condId}/despesas`;

export const despesaService = {
  getAll: async (
    condId: string, 
    params?: { page?: number; limit?: number; columns?: string[]; content?: string[]; sort?: string; }
  ): Promise<DespesaResponse> => {
    const safeParams = params as Record<string, string | number | string[] | undefined>;
    const queryString = buildQueryString(safeParams);
    
    return apiRequest<DespesaResponse>(`${getBaseUrl(condId)}${queryString}`);
  },

  getById: async (condId: string, id: string): Promise<DespesaDetail> => {
    return apiRequest<DespesaDetail>(`${getBaseUrl(condId)}/${id}`);
  },

  create: async (condId: string, data: Partial<DespesaDetail>, fileOptions?: FileUploadOptions): Promise<DespesaDetail> => {
    const body = buildFormDataBody(data, fileOptions, 'anexos');
    return apiRequest<DespesaDetail>(getBaseUrl(condId), {
      method: 'POST',
      body,
    });
  },

  update: async (condId: string, id: string, data: Partial<DespesaDetail>, fileOptions?: FileUploadOptions): Promise<DespesaDetail> => {
    const body = buildFormDataBody(data, fileOptions, 'anexos');
    return apiRequest<DespesaDetail>(`${getBaseUrl(condId)}/${id}`, {
      method: 'PUT',
      body,
    });
  },

  delete: async (condId: string, id: string): Promise<void> => {
    return apiRequest<void>(`${getBaseUrl(condId)}/${id}`, {
      method: 'DELETE',
    });
  }
};