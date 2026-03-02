'use client';

import { DataTable } from '@/features/components/data-table';
import { columns } from './columns';
import { AddCondominoDialog } from './AddCondominoDialog';
import { CondominoSummary } from '@/types/condomino';

const CONDOMINO_STATUSES = [
  { label: 'Ativo', value: 'ACTIVE' },
  { label: 'Inativo', value: 'INACTIVE' },
  { label: 'Pendente', value: 'PENDING' },
];

const CONDOMINO_COLUMN_LABELS = {
  name: 'Nome',
  email: 'E-mail',
  cpf: 'CPF',
  status: 'Situação',
};

interface CondominosDataTableProps {
  readonly data: CondominoSummary[];
  readonly pageCount: number;
}

export function CondominosDataTable({ data, pageCount }: CondominosDataTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      searchColumnId="name"
      searchPlaceholder="Buscar condôminos..."
      columnLabels={CONDOMINO_COLUMN_LABELS}
      facetedFilters={[
        {
          columnId: 'status',
          title: 'Status',
          options: CONDOMINO_STATUSES,
        },
      ]}
      filterMappings={[
        { columnId: 'name' },
        { columnId: 'status', isArray: true },
        { columnId: 'cpf' },
      ]}
      actions={<AddCondominoDialog />}
    />
  );
}