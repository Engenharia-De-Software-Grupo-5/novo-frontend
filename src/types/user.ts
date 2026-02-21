export type Role = 'Financeiro' | 'RH' | 'Admin';
export type Status = 'ativo' | 'inativo' | 'pendente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  inviteDate: string;
}
