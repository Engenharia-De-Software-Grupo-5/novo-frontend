'use server';

import { revalidatePath } from 'next/cache';

import { ImovelDetail, ImovelResponse } from '@/types/imoveis';
import { apiRequest, buildQueryString } from '@/lib/api-client';
import { 
  imovelDtoRequest, 
  imovelDtoResponse, 
  imovelDtoSummaryResponse 
} from '@/features/imoveis/schemas/imovelDto';

const basePath = (condId: string) => `/api/condominios/${condId}/imoveis`;

export interface ImovelFileOptions {
  newVistoriasFiles?: File[];
  newDocumentosFiles?: File[];
  existingFileIds?: string[];
}

function buildImovelFormData(
  data: any, 
  options?: ImovelFileOptions
): FormData | any {
  const {
    newVistoriasFiles = [],
    newDocumentosFiles = [],
    existingFileIds,
  } = options ?? {};

  const hasFiles =
    newVistoriasFiles.length > 0 ||
    newDocumentosFiles.length > 0 ||
    existingFileIds !== undefined;

  if (!hasFiles) {
    return data;
  }

  const formData = new FormData();
  formData.append('data', JSON.stringify(data));

  if (existingFileIds !== undefined) {
    formData.append('existingFileIds', JSON.stringify(existingFileIds));
  }

  for (const file of newVistoriasFiles) {
    formData.append('vistoriasFiles', file);
  }

  for (const file of newDocumentosFiles) {
    formData.append('documentosFiles', file);
  }

  return formData;
}

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

    const response = await apiRequest<any>(`${basePath(condId)}${query}`, {
      method: 'GET',
    });

    return {
      ...response,
      items: response.items ? response.items.map((item: any) => imovelDtoSummaryResponse(item)) : [],
    } as ImovelResponse;
  } catch (error) {
    console.error('Error fetching imoveis:', error);
    return {
      items: [],
      meta: { totalItems: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};

export const getImovelById = async (
  condId: string,
  imovelId: string
): Promise<ImovelDetail> => {
  const response = await apiRequest<any>(`${basePath(condId)}/${imovelId}`, {
    method: 'GET',
  });

  return {
    ...imovelDtoResponse(response),
    vistorias: response.vistorias || [],
    documentos: response.documentos || [],
  } as unknown as ImovelDetail;
};

export const postImovel = async (
  condId: string,
  data: ImovelDetail,
  options?: ImovelFileOptions
): Promise<ImovelDetail> => {
  const translatedData = imovelDtoRequest(data);
  const body = buildImovelFormData(translatedData, options);

  const response = await apiRequest<any>(basePath(condId), {
    method: 'POST',
    body,
  });

  revalidatePath(`/condominios/${condId}/imoveis`);

  const resultData = response.data || response;

  return {
    ...imovelDtoResponse(resultData),
    vistorias: resultData.vistorias || [],
    documentos: resultData.documentos || [],
  } as unknown as ImovelDetail;
};

export const putImovel = async (
  condId: string,
  imovelId: string,
  data: Partial<ImovelDetail>,
  options?: ImovelFileOptions
): Promise<ImovelDetail> => {
  const translatedData = imovelDtoRequest(data);
  const body = buildImovelFormData(translatedData, options);

  const result = await apiRequest<any>(
    `${basePath(condId)}/${imovelId}`,
    {
      method: 'PUT',
      body,
    }
  );

  revalidatePath(`/condominios/${condId}/imoveis`);

  return {
    ...imovelDtoResponse(result),
    vistorias: result.vistorias || [],
    documentos: result.documentos || [],
  } as unknown as ImovelDetail;
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