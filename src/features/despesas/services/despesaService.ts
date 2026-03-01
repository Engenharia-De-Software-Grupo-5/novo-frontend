'use server';

import { revalidatePath } from 'next/cache';

import {
  DespesaDetail,
  DespesaResponse,
  DespesaResponseApiGetAll,
} from '@/types/despesa';
import { apiRequest, buildQueryString } from '@/lib/api-client';
import { buildFormDataBody, FileUploadOptions } from '@/lib/form-data';

import { despesaDtoRequest, despesaDtoResponse } from '../schemas/despesaDto';

const getBaseUrl = (condId: string) => `/api/condominios/${condId}/despesas`;
const getBaseUrlReal = (condId: string) =>
  `/api/v1/condominios/${condId}/expenses`;

export const getAll = async (
  condId: string,
  params?: {
    page?: number;
    limit?: number;
    columns?: string[];
    content?: string[];
    sort?: string;
  }
): Promise<DespesaResponse> => {
  const safeParams = params as Record<
    string,
    string | number | string[] | undefined
  >;
  const queryString = buildQueryString(safeParams);

  const response = await apiRequest<DespesaResponseApiGetAll>(
    `${getBaseUrlReal(condId)}/paginated${queryString}`,
    {
      method: 'GET',
    },
    true
  );

  const despesas = response.items.map((item) => despesaDtoResponse(item));
  console.log('Response', despesas);
  return { ...response, items: despesas };
};

export const getById = async (
  condId: string,
  id: string
): Promise<DespesaDetail> => {
  return apiRequest<DespesaDetail>(`${getBaseUrl(condId)}/${id}`);
};

export const create = async (
  condId: string,
  data: DespesaDetail,
  fileOptions?: FileUploadOptions
): Promise<DespesaDetail> => {
  const dto = despesaDtoRequest(data);
  const body = buildFormDataBody(dto, fileOptions);
  const result = await apiRequest<DespesaDetail>(
    `${getBaseUrlReal(condId)}`,
    {
      method: 'POST',
      body,
    },
    true
  );

  revalidatePath(`/condominios/${condId}/despesas`);

  return result;
};

export const update = async (
  condId: string,
  id: string,
  data: Partial<DespesaDetail>,
  fileOptions?: FileUploadOptions
): Promise<DespesaDetail> => {
  const body = buildFormDataBody(data, fileOptions);
  const result = await apiRequest<DespesaDetail>(
    `${getBaseUrl(condId)}/${id}`,
    {
      method: 'PUT',
      body,
    }
  );

  revalidatePath(`/condominios/${condId}/despesas`);

  return result;
};

export const deleteDespesa = async (
  condId: string,
  id: string
): Promise<void> => {
  const result = await apiRequest<void>(`${getBaseUrl(condId)}/${id}`, {
    method: 'DELETE',
  });

  revalidatePath(`/condominios/${condId}/despesas`);

  return result;
};
