import { FileAttachment } from './file';

export interface EmployeeSummary {
  id: string;
  name: string;
  role: string;
  status: 'ativo' | 'pendente' | 'inativo';
  lastContract?: FileAttachment;
}

export interface EmployeeDetail extends EmployeeSummary {
  email?: string;
  cpf: string;
  birthDate: string;
  admissionDate?: string;
  phone?: string;
  address?: string;
  Contracts?: FileAttachment[];
}

export interface EmployeeResponse {
  items: EmployeeSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
