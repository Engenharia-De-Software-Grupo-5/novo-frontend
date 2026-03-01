'use server';

import { revalidatePath } from 'next/cache';

import {
  ModeloContratoDetail,
  ModeloContratoRequest,
  ModeloContratoResponse,
} from '@/types/modelo-contrato';
import { apiRequest, buildQueryString } from '@/lib/api-client';

const basePath = (condId: string) =>
  `/api/condominios/${condId}/modelos-contrato`;
const basePathReal = (condId: string) =>
  `/api/v1/condominios/${condId}/modelos-contrato`;

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
      queryParams.columnName = params.columns;
      queryParams.content = params.content;
    }

    const query = buildQueryString(queryParams);

    return await apiRequest<ModeloContratoResponse>(
      `${basePathReal(condId)}/paginated${query}`,
      {
        method: 'GET',
      },
      true
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
  return apiRequest<ModeloContratoDetail>(
    `${basePathReal(condId)}/${modelId}`,
    {
      method: 'GET',
    },
    true
  );
};

export const postModeloContrato = async (
  condId: string,
  data: ModeloContratoRequest
): Promise<void> => {
  console.log('CRIAR MODELO', data);
  await apiRequest(
    basePathReal(condId),
    {
      method: 'POST',
      body: data,
    },
    true
  );

  revalidatePath(`/condominios/${condId}/modelos-contrato`);
};

export const deleteModeloContrato = async (
  condId: string,
  modelId: string
): Promise<void> => {
  await apiRequest(
    `${basePathReal(condId)}/${modelId}`,
    {
      method: 'DELETE',
    },
    true
  );

  revalidatePath(`/condominios/${condId}/modelos`);
};
