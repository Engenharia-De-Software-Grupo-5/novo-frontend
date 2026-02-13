'use client';

import { DataTable } from '@/features/components/data-table';

import { EmployeeSummary } from '@/types/employee';

import { AddEmployeeDialog } from './add-employee-dialog';
import { columns } from './columns';

interface FuncionariosDataTableProps {
  data: EmployeeSummary[];
  pageCount: number;
}

export function FuncionariosDataTable({
  data,
  pageCount,
}: FuncionariosDataTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      pageCount={pageCount}
      searchColumnId="name"
      searchPlaceholder="Filtrar nomes..."
      facetedFilters={[
        {
          columnId: 'role',
          title: 'Cargo',
          options: [
            { label: 'Gerente', value: 'gerente' },
            { label: 'Porteiro', value: 'porteiro' },
            { label: 'Zelador', value: 'zelador' },
            { label: 'Faxineiro', value: 'faxineiro' },
          ],
        },
        {
          columnId: 'status',
          title: 'Status',
          options: [
            { label: 'Ativo', value: 'ativo' },
            { label: 'Pendente', value: 'pendente' },
            { label: 'Inativo', value: 'inativo' },
          ],
        },
      ]}
      columnLabels={{
        name: 'Nome',
        role: 'Cargo',
        status: 'Status',
        lastContract: 'Último Contrato',
      }}
      filterMappings={[
        { urlParam: 'search', columnId: 'name' },
        { urlParam: 'role', columnId: 'role', isArray: true },
        { urlParam: 'status', columnId: 'status', isArray: true },
      ]}
      actions={<AddEmployeeDialog />}
    />
  );
}
