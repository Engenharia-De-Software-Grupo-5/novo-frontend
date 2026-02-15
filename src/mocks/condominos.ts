import { CondominoFull } from "@/types/condomino";

export const condominos: CondominoFull[] = [
  {
    id: "1",
    condominiumId: "COND-001",

    name: "João Silva",
    birthDate: "1990-05-10",
    maritalStatus: "Solteiro",
    rg: "12345678",
    issuingAuthority: "SSP-SP",
    cpf: "12345678900",
    monthlyIncome: 7500,
    email: "joao.silva@email.com",
    primaryPhone: "11999999999",
    address: "Rua das Flores, 123 - São Paulo",

    emergencyContact: {
      name: "Maria Silva",
      relationship: "Mãe",
      phone: "11888888888",
    },

    professionalInfo: {
      companyName: "Tech Solutions",
      companyPhone: "1133334444",
      companyAddress: "Av. Paulista, 1000",
      position: "Desenvolvedor",
      yearsWorking: "5",
    },

    bankingInfo: {
      bank: "Banco do Brasil",
      accountType: "Corrente",
      accountNumber: "12345-6",
      agency: "0001",
    },

    additionalResidents: [
      {
        name: "Pedro Silva",
        relationship: "Filho",
        age: 8,
      },
    ],

    documents: {
      rg: "rg-url",
      cpf: "cpf-url",
      incomeProof: "income-proof-url",
    },

    status: "ativo",
  },

  {
    id: "2",
    condominiumId: "COND-002",

    name: "Ana Costa",
    birthDate: "1985-09-22",
    maritalStatus: "Casada",
    rg: "87654321",
    issuingAuthority: "SSP-RJ",
    cpf: "98765432100",
    monthlyIncome: 12000,
    email: "ana.costa@email.com",
    primaryPhone: "21999999999",
    secondaryPhone: "21888888888",
    address: "Rua Atlântica, 456 - Rio de Janeiro",

    emergencyContact: {
      name: "Carlos Costa",
      relationship: "Esposo",
      phone: "21777777777",
    },

    professionalInfo: {
      companyName: "Finance Corp",
      companyPhone: "2133332222",
      companyAddress: "Centro - RJ",
      position: "Gerente Financeira",
      yearsWorking: "10",
    },

    bankingInfo: {
      bank: "Itaú",
      accountType: "Poupança",
      accountNumber: "65432-1",
      agency: "1234",
    },

    spouse: {
      name: "Carlos Costa",
      rg: "11223344",
      cpf: "11223344556",
      profession: "Advogado",
      monthlyIncome: 9000,
    },

    additionalResidents: [],

    documents: {
      rg: "rg-url",
      cpf: "cpf-url",
      incomeProof: "income-proof-url",
    },

    status: "pendente",
  },
];
