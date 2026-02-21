'use client';

import { RoleGuard } from '@/features/components/auth/RoleGuard';
import { DataTable } from '@/features/components/data-table';

import { EmployeeSummary } from '@/types/employee';

import {
  EMPLOYEE_COLUMN_LABELS,
  EMPLOYEE_ROLES,
  EMPLOYEE_STATUSES,
} from '../constants';
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
          options: EMPLOYEE_ROLES.map((r) => ({
            label: r.label,
            value: r.value,
          })),
        },
        {
          columnId: 'status',
          title: 'Status',
          options: EMPLOYEE_STATUSES.map((s) => ({
            label: s.label,
            value: s.value,
          })),
        },
      ]}
      columnLabels={EMPLOYEE_COLUMN_LABELS}
      filterMappings={[
        { columnId: 'name' },
        { columnId: 'role', isArray: true },
        { columnId: 'status', isArray: true },
      ]}
      actions={
        <RoleGuard roles={['Admin']}>
          <AddEmployeeDialog />
        </RoleGuard>
      }
    />
  );
}
