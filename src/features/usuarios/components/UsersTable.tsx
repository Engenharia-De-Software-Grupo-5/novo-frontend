'use client';

import { DataTable } from '@/features/components/data-table';

import { User } from '@/types/user';

import {
  USER_COLUMN_LABELS,
  USER_ROLES,
  USER_STATUSES,
} from '../utils/constants';
import { AddUserDialog } from './AddUserDialog';
import { columns } from './columns';

interface UsersDataTableProps {
  readonly data: User[];
  readonly pageCount: number;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export function UsersDataTable({ data, pageCount }: UsersDataTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      pageCount={pageCount}
      searchColumnId="name"
      searchPlaceholder="Buscar usuários..."
      facetedFilters={[
        {
          columnId: 'role',
          title: 'Cargo',
          options: USER_ROLES.map((r) => ({
            label: r.label,
            value: r.value,
          })),
        },
        {
          columnId: 'status',
          title: 'Status',
          options: USER_STATUSES.map((s) => ({
            label: s.label,
            value: s.value,
          })),
        },
      ]}
      columnLabels={USER_COLUMN_LABELS}
      filterMappings={[
        { columnId: 'name' },
        { columnId: 'role', isArray: true },
        { columnId: 'status', isArray: true },
      ]}
      actions={<AddUserDialog />}
    />
  );
}
