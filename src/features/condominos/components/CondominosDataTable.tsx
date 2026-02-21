'use client';

import { DataTable } from '@/features/components/data-table';
import { columns } from './columns';
import { AddCondominoDialog } from './AddCondominoDialog';
import { CondominoSummary } from '@/types/condomino';

const CONDOMINO_STATUSES = [
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inativo', value: 'inativo' },
  { label: 'Pendente', value: 'pendente' },
];

const CONDOMINO_COLUMN_LABELS = {
  name: 'Nome',
  email: 'E-mail',
  cpf: 'CPF',
  status: 'Situação',
};

interface CondominosDataTableProps {
  data: CondominoSummary[];
  pageCount: number;
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