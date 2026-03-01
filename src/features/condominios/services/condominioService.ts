'use server';

import { Condominium, CondominiumResponse } from '@/types/condominium';
import type { responseAuthApi } from '@/types/next-auth';
import { apiRequest } from '@/lib/api-client';
import { unstable_update } from '@/lib/auth';

import {
  condominiumDtoRequest,
  condominiumDtoResponse,
} from '../schema/condominiumDto';

const basePath = '/api/condominios';
const basePathReal = '/api/v1/condominiums';

export const getCondominios = async (): Promise<Condominium[]> => {
  try {
    const response = await apiRequest<CondominiumResponse[]>(
      basePathReal,
      {
        method: 'GET',
      },
      true
    );

    try {
      const authData = await apiRequest<responseAuthApi>(
        '/api/v1/me',
        {
          method: 'GET',
        },
        true
      );

      if (authData && authData.permission) {
        await unstable_update({
          permission: authData.permission,
          condominium: authData.condominium,
        });
      }
    } catch (authError) {
      console.error('Error fetching /auth/me invisibly:', authError);
    }

    return response.map(condominiumDtoResponse);
  } catch (error) {
    console.error('Error fetching condominios:', error);
    return [];
  }
};

export const getCondominioById = async (id: string): Promise<Condominium> => {
  return await apiRequest<Condominium>(`${basePathReal}/${id}`, {
    method: 'GET',
  });
};

export const postCondominio = async (
  data: Partial<Condominium>
): Promise<void> => {
  console.log('POST CONDOMINIO', data);
  data = condominiumDtoRequest(data);
  await apiRequest(
    basePathReal,
    {
      method: 'POST',
      body: data,
    },
    true
  );
};

export const putCondominio = async (
  id: string,
  data: Partial<Condominium>
): Promise<void> => {
  data = condominiumDtoRequest(data);
  console.log('PUT CONDOMINIO', data);
  await apiRequest(
    `${basePathReal}/${id}`,
    {
      method: 'PUT',
      body: data,
    },
    true
  );
};

export const patchCondominio = async (
  id: string,
  data: Partial<Condominium>
): Promise<void> => {
  data = condominiumDtoRequest(data);
  await apiRequest(`${basePathReal}/${id}`, {
    method: 'PATCH',
    body: data,
  });
};

export const deleteCondominio = async (id: string): Promise<void> => {
  await apiRequest(
    `${basePathReal}/${id}`,
    {
      method: 'DELETE',
    },
    true
  );
};
