export interface EmployeeFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

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
