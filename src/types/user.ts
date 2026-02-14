export type Role = "Financeiro" | "RH" | "Dono"
export type Status = 'ativo' | 'inativo' | 'pendente';


export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  inviteDate: string;
  inviteDuration: '1 day' | '3 days' | '7 days';
  condominioId: string; 
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: string;
  lastAccess?: string;
}

export interface UsersResponse {
  items: UserSummary[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}