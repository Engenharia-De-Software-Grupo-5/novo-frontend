'use server';

import { revalidatePath } from 'next/cache';

import { DespesaDetail, DespesaResponse } from '@/types/despesa';
import { apiRequest, buildQueryString } from '@/lib/api-client';
import { buildFormDataBody, FileUploadOptions } from '@/lib/form-data';

const getBaseUrl = (condId: string) => `/api/condominios/${condId}/despesas`;

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

  return apiRequest<DespesaResponse>(`${getBaseUrl(condId)}${queryString}`);
};

export const getById = async (
  condId: string,
  id: string
): Promise<DespesaDetail> => {
  return apiRequest<DespesaDetail>(`${getBaseUrl(condId)}/${id}`);
};

export const create = async (
  condId: string,
  data: Partial<DespesaDetail>,
  fileOptions?: FileUploadOptions
): Promise<DespesaDetail> => {
  const body = buildFormDataBody(data, fileOptions, 'anexos');
  const result = await apiRequest<DespesaDetail>(getBaseUrl(condId), {
    method: 'POST',
    body,
  });

  revalidatePath(`/condominios/${condId}/despesas`);

  return result;
};

export const update = async (
  condId: string,
  id: string,
  data: Partial<DespesaDetail>,
  fileOptions?: FileUploadOptions
): Promise<DespesaDetail> => {
  const body = buildFormDataBody(data, fileOptions, 'anexos');
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
