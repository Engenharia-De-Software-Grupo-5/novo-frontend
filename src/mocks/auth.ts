import { User } from '@/types/user';

export const ADMIN_FAKE: User = {
  id: 'ADMIN-001',
  name: 'admin',
  email: 'admin@condx.com',
  role: 'Admin',
  status: 'ativo',
  inviteDate: '01-01-2024',
};

export const FINANCEIRO_FAKE: User = {
  id: 'FINANCEIRO-001',
  name: 'financeiro',
  email: 'financeiro@condx.com',
  role: 'Financeiro',
  status: 'ativo',
  inviteDate: '01-01-2024',
};

export const RH_FAKE: User = {
  id: 'RH-001',
  name: 'rh',
  email: 'rh@condx.com',
  role: 'RH',
  status: 'ativo',
  inviteDate: '01-01-2024',
};
