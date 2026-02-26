'use server';

import { revalidatePath } from 'next/cache';

import { ImovelDetail, ImovelResponse } from '@/types/imoveis';
import { apiRequest, buildQueryString } from '@/lib/api-client';

const basePath = (condId: string) => `/api/condominios/${condId}/imoveis`;

export const getImoveis = async (
  condId: string,
  params?: {
    page?: number;
    limit?: number;
    columns?: string[];
    content?: string[];
    sort?: string;
  }
): Promise<ImovelResponse> => {
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

    return await apiRequest<ImovelResponse>(`${basePath(condId)}${query}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching imoveis:', error);
    return {
      items: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};

export const getImovelById = async (
  condId: string,
  imovelId: string
): Promise<ImovelDetail> => {
  return apiRequest<ImovelDetail>(`${basePath(condId)}/${imovelId}`, {
    method: 'GET',
  });
};

export const postImovel = async (
  condId: string,
  data: ImovelDetail
): Promise<ImovelDetail> => {
  const response = await apiRequest<{ data: ImovelDetail }>(basePath(condId), {
    method: 'POST',
    body: data,
  });

  revalidatePath(`/condominios/${condId}/imoveis`);

  return response.data;
};

export const putImovel = async (
  condId: string,
  imovelId: string,
  data: Partial<ImovelDetail>
): Promise<ImovelDetail> => {
  const result = await apiRequest<ImovelDetail>(
    `${basePath(condId)}/${imovelId}`,
    {
      method: 'PUT',
      body: data,
    }
  );

  revalidatePath(`/condominios/${condId}/imoveis`);

  return result;
};

export const patchImovel = async (
  condId: string,
  imovelId: string,
  data: Record<string, unknown>
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${imovelId}`, {
    method: 'PATCH',
    body: data,
  });

  revalidatePath(`/condominios/${condId}/imoveis`);
};

export const deleteImovel = async (
  condId: string,
  imovelId: string
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${imovelId}`, {
    method: 'DELETE',
  });

  revalidatePath(`/condominios/${condId}/imoveis`);
};
