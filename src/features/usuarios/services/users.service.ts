import { CreateUserData, CreateUserPayload, UpdateUserData, UsersResponse } from "./users";

export async function getUsers(
  condominioId: string,
  page: number,
  limit: number
): Promise<UsersResponse> {

  const res = await fetch(
    `/api/condominios/${condominioId}/users?page=${page}&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error('Erro ao buscar usuários');
  }

  const json = await res.json();

  return {
    items: json.data,                   // já vem paginado do backend
    totalItems: json.meta.total,        // total de usuários
    totalPages: json.meta.totalPages,   // total de páginas
    page: json.meta.page,               // página atual
    limit: json.meta.limit,             // limite usado
  };
}


export async function createUser(
  condominioId: string,
  data: CreateUserPayload
): Promise<unknown> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const payload: CreateUserData = {
    ...data,
    condominioId,
  };

  console.log(
    `[Mock POST] Usuário criado no condomínio: ${condominioId}`,
    payload
  );

  return { success: true };
}

export async function updateUser(
  condominioId: string,
  userId: string,
  data: UpdateUserData
): Promise<unknown> {
  const res = await fetch(
    `/api/condominios/${condominioId}/users/${userId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  console.log(data)

  if (!res.ok) {
    throw new Error('Erro ao atualizar usuário');
  }

  return res.json();
}

export async function deactivateUser(
  condominioId: string,
  userId: string
): Promise<unknown> {
  const payload: UpdateUserData = {
    status: 'inativo',
  };

  const res = await fetch(
    `/api/condominios/${condominioId}/users/${userId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  console.log('[Mock PATCH] Usuário desativado:', payload);

  if (!res.ok) {
    throw new Error('Erro ao desativar usuário');
  }

  return res.json();
}

export async function deleteUser(
  condominioId: string,
  userId: string
): Promise<unknown> {
  // mock de delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const res = await fetch(
    `/api/condominios/${condominioId}/users/${userId}`,
    {
      method: 'DELETE',
    }
  );

  console.log('[Mock DELETE] Usuário excluído:', {
    condominioId,
    userId,
  });

  if (!res.ok) {
    throw new Error('Erro ao excluir usuário');
  }


  return res.json?.();
}
