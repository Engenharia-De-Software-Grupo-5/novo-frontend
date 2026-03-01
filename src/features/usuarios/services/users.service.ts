'use server';

import { revalidatePath } from 'next/cache';

import { UsersResponse, User, Status } from '@/types/user';
import { apiRequest, buildQueryString } from '@/lib/api-client';

import { UpdateUserPayload } from './users';

const baseUrl = '/api/v1';
const isReal = true;

// DTO de mapeamento de status
const statusToApi: Record<string, 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'> = {
  ativo: 'ACTIVE',
  inativo: 'INACTIVE',
  suspenso: 'SUSPENDED',
};

const statusFromApi: Record<string, string> = {
  ACTIVE: 'ativo',
  INACTIVE: 'inativo',
  SUSPENDED: 'pendente',
};

function mapStatusToApi(status: string): 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' {
  const mapped = statusToApi[status.toLowerCase()];
  if (!mapped) throw new Error(`Status inválido: ${status}`);
  return mapped;
}

function mapUserFromApi(user: User): User {
  return {
    ...user,
    status: (statusFromApi[user.status as string] ?? user.status) as Status,
  };
}

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
      queryParams.columnName = params.columns;
      queryParams.content = params.content;
    }

    const query = buildQueryString(queryParams);

    const response = await apiRequest<UsersResponse>(
      `${baseUrl}/condominiums/${condId}/users/paginated${query}`,
      { method: 'GET' },
      isReal
    );

    return {
      ...response,
      items: response.items.map(mapUserFromApi),
    };
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
  const payload: Record<string, string> = {
    name: data.name,
    email: data.email,
    status: 'ACTIVE',
    role: data.role.toUpperCase(),
  };

  if (data.message?.trim()) {
    payload.message = data.message.trim();
  }

  await apiRequest(
    `${baseUrl}/condominiums/${condominioId}/users`,
    { method: 'POST', body: payload },
    isReal
  );

  revalidatePath(`/condominios/${condominioId}/usuarios`);
}

export async function updateUser(
  condominioId: string,
  userId: string,
  data: UpdateUserPayload
) {
  const payload = {
    ...data,
    ...(data.status && { status: mapStatusToApi(data.status) }),
  };

  await apiRequest(
    `${baseUrl}/condominiums/${condominioId}/users/${userId}`,
    { method: 'PATCH', body: payload },
    isReal
  );

  revalidatePath(`/condominios/${condominioId}/usuarios`);
}

export async function changeUserStatus(
  condominioId: string,
  userId: string,
  status: string
) {
  await apiRequest(
    `${baseUrl}/condominiums/${condominioId}/users/${userId}`,
    { method: 'PATCH', body: { status: mapStatusToApi(status) } },
    isReal
  );

  revalidatePath(`/condominios/${condominioId}/usuarios`);
}

export async function deleteUser(condominioId: string, userId: string) {
  await apiRequest(
    `${baseUrl}/condominiums/${condominioId}/users/${userId}`,
    { method: 'DELETE' },
    isReal
  );

  revalidatePath(`/condominios/${condominioId}/usuarios`);
}