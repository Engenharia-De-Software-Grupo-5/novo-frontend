export type Role = 'Financeiro' | 'RH' | 'Admin';
export type Status = 'ativo' | 'inativo' | 'pendente';

export interface PermissionItem {
  id: string;
  name: string;
}

export interface CondominiumItem {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: Status;
  role: Role;
  inviteDate: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: string;
}

export interface UsersResponse {
  items: User[];
  meta: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
