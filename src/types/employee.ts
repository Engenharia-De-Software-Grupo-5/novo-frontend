import { FileAttachment } from './file';

/** @deprecated Use `FileAttachment` from `@/types/file` directly for new code */
export type EmployeeFile = FileAttachment;

export interface EmployeeSummary {
  id: string;
  name: string;
  role: string;
  status: 'ativo' | 'pendente' | 'inativo';
  lastContract?: EmployeeFile;
}

export interface EmployeeDetail extends EmployeeSummary {
  email?: string;
  cpf: string;
  birthDate: string;
  admissionDate?: string;
  phone?: string;
  address?: string;
  Contracts?: EmployeeFile[];
}

export interface EmployeeResponse {
  data: EmployeeSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
