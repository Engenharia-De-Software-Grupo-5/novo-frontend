'use server';

import { revalidatePath } from 'next/cache';

import { UsersResponse } from '@/types/user';
import { apiRequest, buildQueryString } from '@/lib/api-client';

import { UpdateUserPayload } from './users';

export const getUsers = async (
  condId: string,
  params?: {
    page?: number;
    limit?: number;
    columns?: string[];
    content?: string[];
    sort?: string;
  }
): Promise<UsersResponse> => {
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

    console.log(queryParams);
    const query = buildQueryString(queryParams);

    return await apiRequest<UsersResponse>(
      `/api/condominios/${condId}/usuarios${query}`,
      {
        method: 'GET',
      }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      items: [],
      meta: { totalItems: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};

export async function inviteUser(
  condominioId: string,
  data: { name: string; email: string; role: string; message?: string }
) {
  await apiRequest(`/api/condominios/${condominioId}/usuarios`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  revalidatePath(`/condominios/${condominioId}/usuarios`);
}
/**
 * ATUALIZAÇÃO (PUT ou PATCH)
 */
export async function updateUser(
  condominioId: string,
  userId: string,
  data: UpdateUserPayload
) {
  await apiRequest(`/api/condominios/${condominioId}/usuarios/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  revalidatePath(`/condominios/${condominioId}/usuarios`);
}

export async function changeUserStatus(
  condominioId: string,
  userId: string,
  status: 'ativo' | 'inativo'
) {
  await apiRequest(`/api/condominios/${condominioId}/usuarios/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  revalidatePath(`/condominios/${condominioId}/usuarios`);
}

/**
 * EXCLUSÃO
 */
export async function deleteUser(condominioId: string, userId: string) {
  await apiRequest(`/api/condominios/${condominioId}/usuarios/${userId}`, {
    method: 'DELETE',
  });

  revalidatePath(`/condominios/${condominioId}/usuarios`);
}
