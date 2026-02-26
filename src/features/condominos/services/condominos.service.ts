'use server';
import { revalidatePath } from 'next/cache';
import {
  CondominoCreateDTO,
  CondominoFull,
  CondominosResponse,
} from '@/types/condomino';
import { apiRequest, buildQueryString } from '@/lib/api-client';
import { buildFormDataBody, FileUploadOptions } from '@/lib/form-data';

const basePath = (condId: string) => `/api/condominios/${condId}/condominos`;

export const getCondominos = async (
  condId: string,
  params?: {
    page?: number;
    limit?: number;
    columns?: string[];
    content?: string[];
    sort?: string;
  }
): Promise<CondominosResponse> => {
  try {
    const queryParams: Record<string, string | number | string[] | undefined> = {
      page: params?.page,
      limit: params?.limit,
      sort: params?.sort,
    };

    if (params?.columns && params?.content && params.columns.length > 0) {
      queryParams.columns = params.columns;
      queryParams.content = params.content;
    }

    const query = buildQueryString(queryParams);

  
    return await apiRequest<CondominosResponse>(`${basePath(condId)}${query}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching condominos:', error);
    return {
      items: [],
      meta: { totalItems: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};

export const getCondominoById = async (
  condId: string,
  condominoId: string
): Promise<CondominoFull> => {
  return apiRequest<CondominoFull>(`${basePath(condId)}/${condominoId}`, {
    method: 'GET',
  });
};

export const postCondomino = async (
  condId: string,
  data: Partial<CondominoCreateDTO>,
  options?: FileUploadOptions
): Promise<void> => {
  await apiRequest(basePath(condId), {
    method: 'POST',
    body: buildFormDataBody(data, options),
  });

  revalidatePath(`/condominios/${condId}/condominos`);
};

export const putCondomino = async (
  condId: string,
  condominoId: string,
  data: Partial<CondominoFull>,
  options?: FileUploadOptions
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${condominoId}`, {
    method: 'PUT',
    body: buildFormDataBody(data, options),
  });

  revalidatePath(`/condominios/${condId}/condominos`);
};

export const patchCondomino = async (
  condId: string,
  condominoId: string,
  data: Partial<CondominoFull>
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${condominoId}`, {
    method: 'PATCH',
    body: data,
  });

  revalidatePath(`/condominios/${condId}/condominos`);
};

export const deleteCondomino = async (
  condId: string,
  condominoId: string
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${condominoId}`, {
    method: 'DELETE',
  });

  revalidatePath(`/condominios/${condId}/condominos`);
};

export const changeCondominoStatus = async (
  condId: string,
  condominoId: string,
  status: 'ativo' | 'inativo'
): Promise<void> => {
  await patchCondomino(condId, condominoId, { status });
};