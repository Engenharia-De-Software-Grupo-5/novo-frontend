export interface User {
  id: string;
  name: string;
  email: string;
  status: 'ativo' | 'inativo' | 'pendente';
  inviteDate: string;
  inviteDuration: '1 day' | '3 days' | '7 days';
}
