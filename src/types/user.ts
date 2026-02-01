export type Role = "Financeiro" | "RH" | "Dono"

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'ativo' | 'inativo' | 'pendente';
  inviteDate: string;
  inviteDuration: '1 day' | '3 days' | '7 days';
  condominioId: string; 
}
