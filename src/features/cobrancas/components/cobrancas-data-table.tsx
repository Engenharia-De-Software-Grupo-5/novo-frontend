'use client';

import { DataTable } from '@/features/components/data-table/data-table';

import { CobrancaSummary } from '@/types/cobranca';

import {
  COBRANCA_COLUMN_LABELS,
  COBRANCA_STATUSES,
  COBRANCA_TYPES,
} from '../constants';
import { AddCobrancaDialog } from './add-cobranca-dialog';
import { CalculatorDialog } from './calculator-dialog';
import { columns } from './columns';

interface CobrancasDataTableProps {
  readonly data: CobrancaSummary[];
  readonly pageCount: number;
}

export function CobrancasDataTable({
  data,
  pageCount,
}: CobrancasDataTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      pageCount={pageCount}
      searchColumnId="name"
      searchPlaceholder="Filtrar cobranças..."
      facetedFilters={[
        {
          columnId: 'type',
          title: 'Tipo',
          options: COBRANCA_TYPES.map((item) => ({
            label: item.label,
            value: item.value,
          })),
        },
        {
          columnId: 'status',
          title: 'Situação',
          options: COBRANCA_STATUSES.map((item) => ({
            label: item.label,
            value: item.value,
          })),
        },
      ]}
      columnLabels={COBRANCA_COLUMN_LABELS}
      filterMappings={[
        { columnId: 'name' },
        { columnId: 'type', isArray: true },
        { columnId: 'status', isArray: true },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <CalculatorDialog />
          <AddCobrancaDialog />
        </div>
      }
    />
  );
}
