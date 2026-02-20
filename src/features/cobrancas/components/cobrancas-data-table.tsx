'use client';

import { DataTable } from '@/features/components/data-table/data-table';

import { CobrancaSummary } from '@/types/cobranca';

import { COBRANCA_COLUMN_LABELS, COBRANCA_STATUSES } from '../constants';
import { AddCobrancaDialog } from './add-cobranca-dialog';
import { CalculatorDialog } from './calculator-dialog';
import { columns } from './columns';

interface CobrancasDataTableProps {
  data: CobrancaSummary[];
  pageCount: number;
}

export function CobrancasDataTable({ data, pageCount }: CobrancasDataTableProps) {
  const uniqueCpfFilters = Array.from(
    new Set(data.map((item) => item.cpf).filter(Boolean))
  ).map((cpf) => ({
    label: cpf,
    value: cpf,
  }));

  return (
    <DataTable
      data={data}
      columns={columns}
      pageCount={pageCount}
      searchColumnId="name"
      searchPlaceholder="Filtrar cobranças..."
      facetedFilters={[
        {
          columnId: 'cpf',
          title: 'CPF',
          options: uniqueCpfFilters,
        },
        {
          columnId: 'status',
          title: 'Status',
          options: COBRANCA_STATUSES.map((item) => ({
            label: item.label,
            value: item.value,
          })),
        },
      ]}
      columnLabels={COBRANCA_COLUMN_LABELS}
      filterMappings={[
        { columnId: 'name' },
        { columnId: 'cpf', isArray: true },
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
