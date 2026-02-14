export type CondominiumStatus = "ativo" | "inativo" | "pendente";

export interface CondominiumFull {
  id: string;
  condominiumId: string; // formato: COND-00X

  // dados pessoais
  name: string;
  birthDate: string;
  maritalStatus: string;
  rg: string;
  issuingAuthority: string;
  cpf: string;
  monthlyIncome: number;
  email: string;
  primaryPhone: string;
  secondaryPhone?: string;
  address: string;

  // contato emergência
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };

  // profissional
  professionalInfo: {
    companyName: string;
    companyPhone: string;
    companyAddress: string;
    position: string;
    yearsWorking: string;
  };

  // bancário
  bankingInfo: {
    bank: string;
    accountType: string;
    accountNumber: string;
    agency: string;
  };

  // cônjuge
  spouse?: {
    name: string;
    rg: string;
    cpf: string;
    profession: string;
    monthlyIncome: number;
  };

  // moradores adicionais
  additionalResidents: {
    name: string;
    relationship: string;
    age: number;
  }[];

  // documentos
  documents: {
    rg: string;
    cpf: string;
    incomeProof: string;
  };

  status: CondominiumStatus;
}
