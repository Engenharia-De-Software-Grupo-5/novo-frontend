import { CircleCheck, CircleX, Loader } from 'lucide-react';

export const EMPLOYEE_ROLES = [
  { label: 'Gerente', value: 'gerente' },
  { label: 'Porteiro', value: 'porteiro' },
  { label: 'Zelador', value: 'zelador' },
  { label: 'Faxineiro', value: 'faxineiro' },
] as const;

export const EMPLOYEE_STATUSES = [
  { label: 'Ativo', value: 'ativo', icon: CircleCheck },
  { label: 'Pendente', value: 'pendente', icon: Loader },
  { label: 'Inativo', value: 'inativo', icon: CircleX },
] as const;

export const EMPLOYEE_COLUMN_LABELS: Record<string, string> = {
  name: 'Nome',
  role: 'Cargo',
  status: 'Status',
  lastContract: 'Último Contrato',
};
