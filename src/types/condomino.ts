export type CondominoStatus = "ativo" | "inativo" | "pendente";

// Tipos auxiliares para organizar o objeto principal
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface ProfessionalInfo {
  companyName: string;
  companyPhone: string;
  companyAddress: string;
  position: string;
  yearsWorking: string;
}

export interface BankingInfo {
  bank: string;
  accountType: string;
  accountNumber: string;
  agency: string;
}

export interface Spouse {
  name: string;
  rg: string;
  cpf: string;
  profession: string;
  monthlyIncome: number;
}

export interface AdditionalResident {
  name: string;
  relationship: string;
  age: number;
}

export interface CondominoDocuments {
  rg: string;
  cpf: string;
  incomeProof: string;
}

/**
 * Objeto completo do Condômino (usado em Detalhes e Edição)
 */
export interface CondominoFull {
  id: string;
  condominiumId: string;
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
  emergencyContact: EmergencyContact;
  professionalInfo: ProfessionalInfo;
  bankingInfo: BankingInfo;
  spouse?: Spouse;
  additionalResidents: AdditionalResident[];
  documents: CondominoDocuments;
  status: CondominoStatus;
}

/**
 * Interface específica para a Tabela 
 */
export interface CondominoSummary {
  id: string;
  name: string;
  email: string;
  cpf: string;
  status: CondominoStatus;
}

/**
 * Resposta da API para listagem paginada
 */
export interface CondominosResponse {
  items: CondominoSummary[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}