import { CondominoFull } from '@/types/condomino';

export const condominos: CondominoFull[] = [
  {
    id: '1',
    condominiumId: '1',

    name: 'João Silva',
    birthDate: '1990-05-10',
    maritalStatus: 'Solteiro',
    rg: '12345678',
    issuingAuthority: 'SSP-SP',
    cpf: '12345678900',
    monthlyIncome: 7500,
    email: 'joao.silva@email.com',
    primaryPhone: '11999999999',
    address: 'Rua das Flores, 123 - São Paulo',

    emergencyContacts: [
      {
        name: 'Maria Silva',
        relationship: 'Mãe',
        phone: '11888888888',
      },
    ],

    professionalInfo: {
      companyName: 'Tech Solutions',
      companyPhone: '1133334444',
      companyAddress: 'Av. Paulista, 1000',
      position: 'Desenvolvedor',
      monthsWorking: 5,
    },

    bankingInfo: {
      bank: 'Banco do Brasil',
      accountType: 'Corrente',
      accountNumber: '12345-6',
      agency: '0001',
    },

    additionalResidents: [
      {
        name: 'Pedro Silva',
        relationship: 'Filho',
        age: 8,
      },
    ],

    documents: {
      rg: {
        id: 'file-rg-1',
        name: 'joao-rg.pdf',
        type: 'application/pdf',
        size: 245000,
        url: '/mock-files/joao-rg.pdf',
      },
      cpf: {
        id: 'file-cpf-1',
        name: 'joao-cpf.pdf',
        type: 'application/pdf',
        size: 180000,
        url: '/mock-files/joao-cpf.pdf',
      },
      incomeProof: {
        id: 'file-income-1',
        name: 'joao-income-proof.pdf',
        type: 'application/pdf',
        size: 320000,
        url: '/mock-files/joao-income-proof.pdf',
      },
    },

    status: 'ativo',
  },

  {
    id: '2',
    condominiumId: '1',

    name: 'Ana Costa',
    birthDate: '1985-09-22',
    maritalStatus: 'Casada',
    rg: '87654321',
    issuingAuthority: 'SSP-RJ',
    cpf: '98765432100',
    monthlyIncome: 12000,
    email: 'ana.costa@email.com',
    primaryPhone: '21999999999',
    secondaryPhone: '21888888888',
    address: 'Rua Atlântica, 456 - Rio de Janeiro',

    emergencyContacts: [
      {
        name: 'Carlos Costa',
        relationship: 'Esposo',
        phone: '21777777777',
      },
    ],

    professionalInfo: {
      companyName: 'Finance Corp',
      companyPhone: '2133332222',
      companyAddress: 'Centro - RJ',
      position: 'Gerente Financeira',
      monthsWorking: 10,
    },

    bankingInfo: {
      bank: 'Itaú',
      accountType: 'Poupança',
      accountNumber: '65432-1',
      agency: '1234',
    },

    spouse: {
      name: 'Carlos Costa',
      rg: '11223344',
      cpf: '11223344556',
      profession: 'Advogado',
      monthlyIncome: 9000,
    },

    additionalResidents: [],

    documents: {
      rg: {
        id: 'file-rg-1',
        name: 'joao-rg.pdf',
        type: 'application/pdf',
        size: 245000,
        url: '/mock-files/joao-rg.pdf',
      },
      cpf: {
        id: 'file-cpf-1',
        name: 'joao-cpf.pdf',
        type: 'application/pdf',
        size: 180000,
        url: '/mock-files/joao-cpf.pdf',
      },
      incomeProof: {
        id: 'file-income-1',
        name: 'joao-income-proof.pdf',
        type: 'application/pdf',
        size: 320000,
        url: '/mock-files/joao-income-proof.pdf',
      },
    },
    status: 'pendente',
  },
];
