'use server';

import { revalidatePath } from 'next/cache';

import {
  DespesaDetail,
  DespesaResponse,
  DespesaResponseAPI,
  DespesaResponseApiGetAll,
} from '@/types/despesa';
import { apiRequest, buildQueryString } from '@/lib/api-client';
import { buildFormDataBody, FileUploadOptions } from '@/lib/form-data';

import { DESPESA_TIPOS, FORMA_PAGAMENTO } from '../constants';
import {
  despesaDtoRequest,
  despesaDtoResponse,
  despesaDtoResponseDetail,
} from '../schemas/despesaDto';

const getBaseUrl = (condId: string) => `/api/condominios/${condId}/despesas`;
const getBaseUrlReal = (condId: string) =>
  `/api/v1/condominios/${condId}/expenses`;

export const getAll = async (
  condId: string,
  params?: {
    page?: number;
    limit?: number;
    columnName?: string[];
    content?: string[];
    sort?: string;
  }
): Promise<DespesaResponse> => {
  const safeParams = params as Record<
    string,
    string | number | string[] | undefined
  >;
  console.log('params', params);
  const mappedColumnName: string[] = [];
  const mappedContent: string[] = [];

  (params?.columnName || []).forEach((col, index) => {
    let newCol = col;
    let newContent = params?.content?.[index];

    if (newCol === 'tipo') {
      newCol = 'expenseType';
      if (newContent) {
        const found = DESPESA_TIPOS.find(
          (t) => t.value === newContent || t.label === newContent
        );
        if (found) {
          newContent = found.value;
        }
      }
    } else if (newCol === 'formaPagamento' || newCol === 'forma_pagamento') {
      newCol = 'paymentMethod';
      if (newContent) {
        const found = FORMA_PAGAMENTO.find(
          (f) => f.value === newContent || f.label === newContent
        );
        if (found) {
          newContent = found.value;
        }
      }
    } else if (newCol == 'nome') {
      newCol = 'description';
    }

    if (newCol) {
      mappedColumnName.push(newCol);
    }
    if (newContent !== undefined) {
      mappedContent.push(newContent);
    }
  });

  safeParams.columnName =
    mappedColumnName.length > 0 ? mappedColumnName : undefined;
  safeParams.content = mappedContent.length > 0 ? mappedContent : undefined;

  const queryString = buildQueryString(safeParams);

  const response = await apiRequest<DespesaResponseApiGetAll>(
    `${getBaseUrlReal(condId)}/paginated${queryString}`,
    {
      method: 'GET',
    },
    true
  );

  console.log('Response', response);
  const despesas = response.items.map((item) => despesaDtoResponse(item));
  return { ...response, items: despesas };
};

export const getById = async (
  condId: string,
  id: string
): Promise<DespesaDetail> => {
  const result = await apiRequest<DespesaResponseAPI>(
    `${getBaseUrlReal(condId)}/${id}`,
    {
      method: 'GET',
    },
    true
  );

  console.log('ResponseGetById', result);
  const despesa = despesaDtoResponseDetail(result);
  return despesa;
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
  data: DespesaDetail,
  fileOptions?: FileUploadOptions
) => {
  const dto = despesaDtoRequest(data);
  const body = buildFormDataBody(dto, fileOptions);
  await apiRequest<void>(
    `${getBaseUrlReal(condId)}/${id}`,
    {
      method: 'PUT',
      body,
    },
    true
  );

  revalidatePath(`/condominios/${condId}/despesas`);
};

export const deleteDespesa = async (
  condId: string,
  id: string
): Promise<void> => {
  const result = await apiRequest<void>(
    `${getBaseUrlReal(condId)}/${id}`,
    {
      method: 'DELETE',
    },
    true
  );

  revalidatePath(`/condominios/${condId}/despesas`);

  return result;
};
