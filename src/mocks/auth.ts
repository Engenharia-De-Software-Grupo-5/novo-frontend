import { User } from '@/types/user';


export const DONO_FAKE: User = {
  id: 'DONO-001',
  name: 'Dono Condomínio 001',
  email: 'owner@condx.com',
  status: 'ativo',
  inviteDate: '01-01-2024',
  inviteDuration: '7 days',
  memberships: [
    {
      condominiumId: 'COND-001',
      role: 'DONO',
    },
  ],
};