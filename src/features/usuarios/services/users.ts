import { User, Role } from '@/types/user';

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
  inviteDuration: string; // Ex: "7 days"
}

export interface UpdateUserPayload {
  role?: string;
  status?: 'ativo' | 'inativo' | 'pendente';
}
