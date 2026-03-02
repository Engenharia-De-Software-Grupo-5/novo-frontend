import { FileAttachment } from './file';

export type CondominoStatus = 'ativo' | 'inativo' | 'pendente';

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
  monthsWorking: number;
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
  rg?: FileAttachment;
  cpf?: FileAttachment;
  incomeProof?: FileAttachment;
}

/**
 * Objeto completo do Condômino (usado em Detalhes)
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
  emergencyContacts: EmergencyContact[];
  professionalInfo: ProfessionalInfo;
  bankingInfo: BankingInfo;
  spouse?: Spouse;
  additionalResidents: AdditionalResident[];
  documents: CondominoDocuments;
  status: CondominoStatus;
}

export interface CondominoCreateDTO extends Omit<
  CondominoFull,
  'id' | 'documents' | 'status'
> {
  documents?: {
    rg?: File;
    cpf?: File;
    incomeProof?: File;
  };
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
  meta: {
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}






export interface CondominoAPIAddress {
  id: string;
  zip: string;
  street: string;
  neighborhood: string;
  city: string;
  uf: string;
  number: number;
  complement: string;
}

export interface CondominoAPISpouse {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  profession: string;
  monthlyIncome: number;
  birthDate: string;
}

export interface CondominoAPIAdditionalResident {
  id: string;
  name: string;
  birthDate: string;
  relationship: string;
}

export interface CondominoAPIProfessionalInfo {
  id: string;
  position: string;
  companyName: string;
  companyPhone: string;
  companyAddress: CondominoAPIAddress;
  monthsWorking: number;
}

export interface CondominoAPIBankingInfo {
  id: string;
  bank: string;
  accountNumber: string;
  agency: string;
  accountType: string;
}

export interface CondominoAPIEmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface CondominoAPIDocument {
  id: string;
  cpfFileId: string;
  incomeProofId: string;
}

export interface CondominoAPI {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  issuingAuthority: string;
  maritalStatus: string;
  email: string;
  primaryPhone: string;
  secondaryPhone?: string;
  birthDate: string;
  monthlyIncome: number;
  status: string;
  spouse?: CondominoAPISpouse;
  additionalResidents: CondominoAPIAdditionalResident[];
  professionalInfo: CondominoAPIProfessionalInfo;
  bankingInfo: CondominoAPIBankingInfo;
  emergencyContacts: CondominoAPIEmergencyContact[];
  documents: CondominoAPIDocument[];
  address: string;
  condominiumId: string;
}

export interface CondominosAPIResponse {
  items: CondominoAPI[];
  meta: {
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}
