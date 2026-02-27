import { User } from '@/types/user';

export interface UsersResponse {
  items: User[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface InviteUserPayload {
  email: string;
  role: string;
}

export interface UpdateUserPayload {
  role?: string;
  status?: 'ativo' | 'inativo' | 'pendente';
}
