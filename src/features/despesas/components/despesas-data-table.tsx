'use client';

import { useParams } from 'next/navigation';
import { DataTable } from '@/features/components/data-table/data-table';

import { DespesaSummary } from '@/types/despesa';

import { COLUMN_LABELS, DESPESA_TIPOS } from '../constants';
import { AddDespesaDialog } from './add-despesa-dialog';
import { columns } from './columns';

interface DespesasDataTableProps {
  readonly data: DespesaSummary[];
  readonly pageCount: number;
}

export function DespesasDataTable({ data, pageCount }: DespesasDataTableProps) {
  const params = useParams();
  const condId = params.condId as string;

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      searchColumnId="nome"
      searchPlaceholder="Buscar despesa por nome..."
      columnLabels={COLUMN_LABELS}
      actions={<AddDespesaDialog />}
      facetedFilters={[
        { columnId: 'tipo', title: 'Tipo', options: DESPESA_TIPOS },
      ]}
      filterMappings={[
        { columnId: 'nome' },
        { columnId: 'tipo', isArray: true },
      ]}
    />
  );
}
