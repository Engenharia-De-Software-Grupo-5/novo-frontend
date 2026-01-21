import { User } from "@/types/user";

export const users: User[] = [
  // {
  //   id: '0',
  //   name: 'Admin Geral',
  //   email: 'admin@condominio.com',
  //   status: 'ativo',
  //   inviteDate: '01-01-2023',
  //   inviteDuration: '7 days',
  //   memberships: [{ condominiumId: '*', role: 'SUPER_ADMIN' }],
  // },
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    status: 'ativo',
    inviteDate: '01-10-2023',
    inviteDuration: '1 day',
    memberships: [{ condominiumId: 'COND-001', role: 'GERENTE' }],
  },
  {
    id: '2',
    name: 'Bruno Souza',
    email: 'bruno.souza@example.com',
    status: 'pendente',
    inviteDate: '15-11-2023',
    inviteDuration: '3 days',
    memberships: [
      {
        condominiumId: 'COND-001',
        role: 'FINANCEIRO',
      },
    ],
  },
  {
    id: '3',
    name: 'Carla Pereira',
    email: 'carla.pereira@example.com',
    status: 'inativo',
    inviteDate: '20-09-2023',
    inviteDuration: '7 days',
    memberships: [
      {
        condominiumId: 'COND-002',
        role: 'RH',
      },
    ],
  },
  {
    id: '4',
    name: 'Daniel Oliveira',
    email: 'daniel.oliveira@example.com',
    status: 'ativo',
    inviteDate: '05-12-2023',
    inviteDuration: '1 day',
    memberships: [
      {
        condominiumId: 'COND-002',
        role: 'GERENTE',
      },
    ],
  },
  {
    id: '5',
    name: 'Eduarda Costa',
    email: 'eduarda.costa@example.com',
    status: 'ativo',
    inviteDate: '10-10-2023',
    inviteDuration: '3 days',
    memberships: [
      {
        condominiumId: 'COND-003',
        role: 'FINANCEIRO',
      },
    ],
  },
  {
    id: '6',
    name: 'Fernando Lima',
    email: 'fernando.lima@example.com',
    status: 'pendente',
    inviteDate: '25-11-2023',
    inviteDuration: '7 days',
    memberships: [
      {
        condominiumId: 'COND-003',
        role: 'RH',
      },
    ],
  },
  {
    id: '7',
    name: 'Gabriela Rocha',
    email: 'gabriela.rocha@example.com',
    status: 'inativo',
    inviteDate: '30-08-2023',
    inviteDuration: '1 day',
    memberships: [
      {
        condominiumId: 'COND-001',
        role: 'GERENTE',
      },
    ],
  },
  {
    id: '8',
    name: 'Henrique Alves',
    email: 'henrique.alves@example.com',
    status: 'ativo',
    inviteDate: '22-10-2023',
    inviteDuration: '3 days',
    memberships: [
      {
        condominiumId: 'COND-002',
        role: 'FINANCEIRO',
      },
    ],
  },
  {
    id: '9',
    name: 'Isabela Martins',
    email: 'isabela.martins@example.com',
    status: 'pendente',
    inviteDate: '01-12-2023',
    inviteDuration: '7 days',
    memberships: [
      {
        condominiumId: 'COND-002',
        role: 'RH',
      },
    ],
  },
  {
    id: '10',
    name: 'João Mendes',
    email: 'joao.mendes@example.com',
    status: 'ativo',
    inviteDate: '15-09-2023',
    inviteDuration: '1 day',
    memberships: [
      {
        condominiumId: 'COND-003',
        role: 'GERENTE',
      },
    ],
  },

  // 🔹 exemplos com MÚLTIPLOS cargos (agora possível 👇)
  {
    id: '11',
    name: 'Karina Santos',
    email: 'karina.santos@example.com',
    status: 'ativo',
    inviteDate: '10-11-2023',
    inviteDuration: '3 days',
    memberships: [
      {
        condominiumId: 'COND-001',
        role: 'FINANCEIRO',
      },
      {
        condominiumId: 'COND-002',
        role: 'FINANCEIRO',
      },
    ],
  },
  {
    id: '12',
    name: 'Lucas Barbosa',
    email: 'lucas.barbosa@example.com',
    status: 'inativo',
    inviteDate: '20-07-2023',
    inviteDuration: '7 days',
    memberships: [
      {
        condominiumId: 'COND-003',
        role: 'RH',
      },
    ],
  },
  {
    id: '13',
    name: 'Mariana Castro',
    email: 'mariana.castro@example.com',
    status: 'ativo',
    inviteDate: '05-10-2023',
    inviteDuration: '1 day',
    memberships: [
      {
        condominiumId: 'COND-001',
        role: 'GERENTE',
      },
    ],
  },
  {
    id: '14',
    name: 'Nicolas Ramos',
    email: 'nicolas.ramos@example.com',
    status: 'pendente',
    inviteDate: '10-12-2023',
    inviteDuration: '3 days',
    memberships: [
      {
        condominiumId: 'COND-002',
        role: 'FINANCEIRO',
      },
    ],
  },
  {
    id: '15',
    name: 'Olivia Dias',
    email: 'olivia.dias@example.com',
    status: 'ativo',
    inviteDate: '25-09-2023',
    inviteDuration: '7 days',
    memberships: [
      {
        condominiumId: 'COND-003',
        role: 'RH',
      },
    ],
  },
];
