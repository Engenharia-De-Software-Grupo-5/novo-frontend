import { UsersResponse } from '@/types/user';
import { apiRequest, buildQueryString } from '@/lib/api-client';

import { UpdateUserPayload } from './users';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
    const queryParams: Record<string, string | number | string[] | undefined> = {
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

  

    return await apiRequest<UsersResponse>(`/api/condominios/${condId}/usuarios${query}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      items: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};


export async function inviteUser(
  condominioId: string,
  data: { email: string; role: string }
) {
  return apiRequest(`/api/condominios/${condominioId}/usuarios`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * ATUALIZAÇÃO (PUT ou PATCH)
 */
export async function updateUser(
  condominioId: string,
  userId: string,
  data: UpdateUserPayload
) {
  return apiRequest(`/api/condominios/${condominioId}/usuarios/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function changeUserStatus(
  condominioId: string,
  userId: string,
  status: 'ativo' | 'inativo'
) {
  return apiRequest(`/api/condominios/${condominioId}/usuarios/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/**
 * EXCLUSÃO
 */
export async function deleteUser(condominioId: string, userId: string) {
  return apiRequest(`/api/condominios/${condominioId}/usuarios/${userId}`, {
    method: 'DELETE',
  });
}
