'use server';

import { revalidatePath } from 'next/cache';

import { DespesaDetail, DespesaResponse } from '@/types/despesa';
import { apiRequest, buildQueryString } from '@/lib/api-client';
import { buildFormDataBody, FileUploadOptions } from '@/lib/form-data';
import { despesaDtoRequest, despesaDtoResponse} from "@/features/despesas/schemas/despesaDto"

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

  // Alteração: apiRequest recebe <any> e mapeamos os items com o DTO
  const result = await apiRequest<any>(`${getBaseUrl(condId)}${queryString}`);
  
  return {
    ...result,
    items: result.items.map((item: any) => despesaDtoResponse(item)),
  } as DespesaResponse;
};

export const getById = async (
  condId: string,
  id: string
): Promise<DespesaDetail> => {
  // Alteração: Traduz a resposta do back para o front
  const result = await apiRequest<any>(`${getBaseUrl(condId)}/${id}`);
  
  return {
    ...despesaDtoResponse(result),
    anexos: result.attachments || [], 
  } as DespesaDetail;
};

export const create = async (
  condId: string,
  data: Partial<DespesaDetail>,
  fileOptions?: FileUploadOptions
): Promise<DespesaDetail> => {
  // Alteração: Traduz os dados antes de montar o FormData
  const translatedData = despesaDtoRequest(data);
  const body = buildFormDataBody(translatedData, fileOptions, 'anexos');
  
  const result = await apiRequest<any>(getBaseUrl(condId), {
    method: 'POST',
    body,
  });

  revalidatePath(`/condominios/${condId}/despesas`);

  // Alteração: Traduz a resposta do back para o front
  return {
    ...despesaDtoResponse(result),
    anexos: result.attachments || [],
  } as DespesaDetail;
};

export const update = async (
  condId: string,
  id: string,
  data: Partial<DespesaDetail>,
  fileOptions?: FileUploadOptions
): Promise<DespesaDetail> => {
  // Alteração: Traduz os dados antes de montar o FormData
  const translatedData = despesaDtoRequest(data);
  const body = buildFormDataBody(translatedData, fileOptions, 'anexos');
  
  const result = await apiRequest<any>(
    `${getBaseUrl(condId)}/${id}`,
    {
      method: 'PUT',
      body,
    }
  );

  revalidatePath(`/condominios/${condId}/despesas`);

  // Alteração: Traduz a resposta do back para o front
  return {
    ...despesaDtoResponse(result),
    anexos: result.attachments || [],
  } as DespesaDetail;
};

export const deleteDespesa = async (
  condId: string,
  id: string
): Promise<void> => {
  // Sem alterações
  const result = await apiRequest<void>(`${getBaseUrl(condId)}/${id}`, {
    method: 'DELETE',
  });

  revalidatePath(`/condominios/${condId}/despesas`);

  return result;
};