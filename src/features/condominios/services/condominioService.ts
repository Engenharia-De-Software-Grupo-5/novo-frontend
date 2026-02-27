'use server';

import { Condominium } from '@/types/condominium';
import { apiRequest } from '@/lib/api-client';

const basePath = '/api/condominios';

export const getCondominios = async (): Promise<Condominium[]> => {
  try {
    return await apiRequest<Condominium[]>(basePath, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching condominios:', error);
    return [];
  }
};

export const getCondominioById = async (id: string): Promise<Condominium> => {
  return await apiRequest<Condominium>(`${basePath}/${id}`, {
    method: 'GET',
  });
};

export const postCondominio = async (
  data: Partial<Condominium>
): Promise<void> => {
  await apiRequest(basePath, {
    method: 'POST',
    body: data,
  });
};

export const putCondominio = async (
  id: string,
  data: Partial<Condominium>
): Promise<void> => {
  await apiRequest(`${basePath}/${id}`, {
    method: 'PUT',
    body: data,
  });
};

export const patchCondominio = async (
  id: string,
  data: Record<string, unknown>
): Promise<void> => {
  await apiRequest(`${basePath}/${id}`, {
    method: 'PATCH',
    body: data,
  });
};

export const deleteCondominio = async (id: string): Promise<void> => {
  await apiRequest(`${basePath}/${id}`, {
    method: 'DELETE',
  });
};
