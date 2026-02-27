import { ContratoDetail, ContratoPostDTO, ContratoResponse } from '@/types/contrato';
import { apiRequest, buildQueryString } from '@/lib/api-client';

const basePath = (condId: string) => `/api/condominios/${condId}/contratos`;

export const getContratos = async (
  condId: string,
  params?: {
    page?: number;
    limit?: number;
    columns?: string[];
    content?: string[];
    sort?: string;
  }
): Promise<ContratoResponse> => {
  try {
    const queryParams: Record<string, string | number | string[] | undefined> =
      {
        page: params?.page,
        limit: params?.limit,
        sort: params?.sort,
      };

    if (params?.columns && params?.content && params.columns.length > 0) {
      queryParams.columns = params.columns;
      queryParams.content = params.content;
    }

    const query = buildQueryString(queryParams);

    return await apiRequest<ContratoResponse>(`${basePath(condId)}${query}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return {
      items: [],
      meta: { totalItems: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};

export const getContratoById = async (
  condId: string,
  contractId: string
): Promise<ContratoDetail> => {
  return apiRequest<ContratoDetail>(`${basePath(condId)}/${contractId}`, {
    method: 'GET',
  });
};

export const postContrato = async (
  condId: string,
  data:
    | FormData
    | (ContratoPostDTO & {
        sourceType?: 'upload' | 'model';
        modelId?: string;
        modelName?: string;
        modelInputValues?: Record<string, string>;
      })
): Promise<void> => {
  await apiRequest(basePath(condId), {
    method: 'POST',
    body: data,
  });

  revalidatePath(`/condominios/${condId}/contratos`);
};

export const deleteContrato = async (
  condId: string,
  contractId: string
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${contractId}`, {
    method: 'DELETE',
  });

  revalidatePath(`/condominios/${condId}/contratos`);
};
