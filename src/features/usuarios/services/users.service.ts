'use server';

import { revalidatePath } from 'next/cache';

import {
  Role,
  Status,
  User,
  UserAPI,
  UserAPIAccess,
  UserAPIResponse,
  UsersResponse,
} from '@/types/user';
import { apiRequest, buildQueryString } from '@/lib/api-client';

const baseUrl = '/api/v1';
const isReal = true;

// DTO de mapeamento de status
const statusToApi: Record<string, 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'> = {
  ativo: 'ACTIVE',
  inativo: 'INACTIVE',
  pendente: 'SUSPENDED',
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

function mapUserFromApi(user: UserAPI, condId: string): User {
  const access = user.accesses?.find(
    (a: UserAPIAccess) => a.condominium.id === condId
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    inviteDate: user.inviteDate,
    role: access?.permission?.name as Role,
    status: statusFromApi[access?.status ?? ''] as Status,
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
    const queryParams: Record<string, string | number | string[] | undefined> =
      {
        page: params?.page,
        limit: params?.limit,
        sort: params?.sort,
      };

    const mappedContent = params?.content?.map((value, index) => {
      const column = params?.columns?.[index];
      if (column === 'status') return mapStatusToApi(value);
      return value;
    });

    if (params?.columns && mappedContent && params.columns.length > 0) {
      queryParams.columnName = params.columns;
      queryParams.content = mappedContent;
    }

    const query = buildQueryString(queryParams);

    const response = await apiRequest<UserAPIResponse>(
      `${baseUrl}/condominiums/${condId}/users/paginated${query}`,
      { method: 'GET' },
      isReal
    );

    return {
      ...response,
      items: response.items
        .filter((user) =>
          user.accesses.some((a) => a.condominium.id === condId)
        )
        .map((user) => mapUserFromApi(user, condId)),
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
    status: 'SUSPENDED',
    role: data.role,
    message: data.message ?? 'NAO EXISTE MENSAGEM!',
  };

  console.log('PAYLOAD ', payload);

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
  userRole: string,
  status: Status
) {
  await apiRequest(
    `${baseUrl}/condominiums/${condominioId}/users/${userId}`,
    {
      method: 'PATCH',
      body: { role: userRole, status: mapStatusToApi(status) },
    },
    isReal
  );

  revalidatePath(`/condominios/${condominioId}/usuarios`);
}

export async function changeUserStatus(
  condominioId: string,
  userId: string,
  userRole: string,
  status: string
) {
  const response = await apiRequest(
    `${baseUrl}/condominiums/${condominioId}/users/${userId}`,
    {
      method: 'PATCH',
      body: { role: userRole, status: mapStatusToApi(status) },
    },
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
