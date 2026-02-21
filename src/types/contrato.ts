export type ContractStatus = 'ativo' | 'vencido' | 'agendado';

export interface ContratoSummary {
  id: string;
  tenantName: string;
  propertyAddress: string;
  property: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
}

export interface ContratoDetail extends ContratoSummary {
  condId: string;
  renterName?: string;
  renterCpf?: string;
  renterPhone?: string;
  renterEmail?: string;
  secondProposerName?: string;
  secondProposerCpf?: string;
  rentValue?: number;
  condoFee?: number;
  iptuValue?: number;
  tcrValue?: number;
  additionalInfo?: string;
}

export interface ContratoResponse {
  data: ContratoSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
