'use server';

import { revalidatePath } from 'next/cache';

import {
  ModeloContratoDetail,
  ModeloContratoResponse,
} from '@/types/modelo-contrato';
import { apiRequest, buildQueryString } from '@/lib/api-client';

const basePath = (condId: string) =>
  `/api/condominios/${condId}/modelos-contrato`;

export const getModelosContrato = async (
  condId: string,
  params?: {
    page?: number;
    limit?: number;
    columns?: string[];
    content?: string[];
    sort?: string;
  }
): Promise<ModeloContratoResponse> => {
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

    return await apiRequest<ModeloContratoResponse>(
      `${basePath(condId)}${query}`,
      {
        method: 'GET',
      }
    );
  } catch (error) {
    console.error('Error fetching contract models:', error);
    return {
      items: [],
      meta: { totalItems: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};

export const getModeloContratoById = async (
  condId: string,
  modelId: string
): Promise<ModeloContratoDetail> => {
  return apiRequest<ModeloContratoDetail>(`${basePath(condId)}/${modelId}`, {
    method: 'GET',
  });
};

export const postModeloContrato = async (
  condId: string,
  data: Partial<ModeloContratoDetail>
): Promise<void> => {
  await apiRequest(basePath(condId), {
    method: 'POST',
    body: data,
  });

  revalidatePath(`/condominios/${condId}/modelos-contrato`);
};
