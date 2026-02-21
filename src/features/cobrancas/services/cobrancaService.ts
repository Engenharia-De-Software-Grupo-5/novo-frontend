import { CobrancaDetail, CobrancaResponse, CobrancaTenant } from '@/types/cobranca';
import { apiRequest, buildQueryString } from '@/lib/api-client';
import { buildFormDataBody, FileUploadOptions } from '@/lib/form-data';

const basePath = (condId: string) => `/api/condominios/${condId}/cobrancas`;

export const getCobrancas = async (
  condId: string,
  params?: {
    page?: number;
    limit?: number;
    sort?: string;
    columns?: string[];
    content?: string[];
  }
): Promise<CobrancaResponse> => {
  try {
    const query = buildQueryString({
      page: params?.page,
      limit: params?.limit,
      sort: params?.sort,
      columns: params?.columns,
      content: params?.content,
    });

    return await apiRequest<CobrancaResponse>(`${basePath(condId)}${query}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching charges:', error);
    return {
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};

export const getCobrancaById = async (
  condId: string,
  cobrancaId: string
): Promise<CobrancaDetail> =>
  apiRequest<CobrancaDetail>(`${basePath(condId)}/${cobrancaId}`, {
    method: 'GET',
  });

export const getCobrancaTenants = async (condId: string): Promise<CobrancaTenant[]> =>
  apiRequest<CobrancaTenant[]>(`${basePath(condId)}/tenants`, {
    method: 'GET',
  });

export const postCobranca = async (
  condId: string,
  data: Partial<CobrancaDetail>,
  options?: FileUploadOptions
) =>
  apiRequest(basePath(condId), {
    method: 'POST',
    body: buildFormDataBody(data, options),
  });

export const putCobranca = async (
  condId: string,
  cobrancaId: string,
  data: Partial<CobrancaDetail>,
  options?: FileUploadOptions
) =>
  apiRequest(`${basePath(condId)}/${cobrancaId}`, {
    method: 'PUT',
    body: buildFormDataBody(data, options),
  });

export const patchCobranca = async (
  condId: string,
  cobrancaId: string,
  data: Record<string, unknown>
) =>
  apiRequest(`${basePath(condId)}/${cobrancaId}`, {
    method: 'PATCH',
    body: data,
  });

export const deleteCobranca = async (condId: string, cobrancaId: string) =>
  apiRequest(`${basePath(condId)}/${cobrancaId}`, {
    method: 'DELETE',
  });

