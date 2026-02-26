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
  inviteDate: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  status: Status;
  createdAt: string;
}

export interface UsersResponse {
  items: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
