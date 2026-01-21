export type Role = 'DONO' | 'GERENTE' | 'SINDICO' | 'FINANCEIRO' | 'RH';

export interface CondominiumMembership {
  condominiumId: string;
  role: Role;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'ativo' | 'inativo' | 'pendente';
  inviteDate: string;
  inviteDuration: '1 day' | '3 days' | '7 days';
  memberships: CondominiumMembership[];
}
