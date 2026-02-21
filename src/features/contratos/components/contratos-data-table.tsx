'use client';

import { DataTable } from '@/features/components/data-table';

import { ContratoSummary } from '@/types/contrato';

import { CONTRACT_COLUMN_LABELS, CONTRACT_STATUSES } from '../constants';
import { AddContractButton } from './add-contract-button';
import { columns } from './columns';

interface ContratosDataTableProps {
  data: ContratoSummary[];
  pageCount: number;
}

export function ContratosDataTable({ data, pageCount }: ContratosDataTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      pageCount={pageCount}
      searchColumnId="tenantName"
      searchPlaceholder="Buscar por contratos..."
      facetedFilters={[
        {
          columnId: 'status',
          title: 'Status',
          options: CONTRACT_STATUSES.map((s) => ({
            label: s.label,
            value: s.value,
            icon: s.icon,
          })),
        },
      ]}
      columnLabels={CONTRACT_COLUMN_LABELS}
      filterMappings={[{ columnId: 'tenantName' }, { columnId: 'status', isArray: true }]}
      actions={<AddContractButton />}
    />
  );
}
