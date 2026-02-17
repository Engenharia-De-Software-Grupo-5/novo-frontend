import {UpdateUserPayload } from "./users";

import { apiRequest, buildQueryString } from '@/lib/api-client';
import { UsersResponse } from '@/types/user';

interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
  roles?: string[];
  statuses?: string[];
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getUsers(
  condominioId: string,
  params: GetUsersParams
): Promise<UsersResponse> {
  if (!condominioId || condominioId === 'undefined') {
    throw new Error('Condomínio ID é obrigatório');
  }

  
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    search: params.search,
    roles: params.roles, 
    status: params.statuses,
  });

  
  const url = `${baseUrl}/api/condominios/${condominioId}/usuarios${queryString}`;
  
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Erro ao buscar usuários');
  }

  const json = await res.json();

  return {
    items: json.data,
    totalItems: json.meta.total,
    totalPages: json.meta.totalPages,
    page: json.meta.page,
    limit: json.meta.limit,
  };
}

export async function inviteUser(
  condominioId: string, 
  data: { email: string; role: string; inviteDuration: string }
) {
 
  return apiRequest(`/api/condominios/${condominioId}/usuarios/invite`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createUser(condominioId: string, data: UpdateUserPayload) {
  return apiRequest(`/api/condominios/${condominioId}/usuarios`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * ATUALIZAÇÃO (PUT ou PATCH)
 */
export async function updateUser(condominioId: string, userId: string, data: UpdateUserPayload) {
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