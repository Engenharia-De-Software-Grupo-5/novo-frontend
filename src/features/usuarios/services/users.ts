import { User, Role } from '@/types/user';

export interface UsersResponse {
  items: User[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}


export interface CreateUserPayload {
  email: string;
  role: Role;
  inviteDuration: number;
}


export interface CreateUserData extends CreateUserPayload {
  condominioId: string;
}

export interface UpdateUserData {
  role?: string;
  status?: 'ativo' | 'pendente' | 'inativo';
}
