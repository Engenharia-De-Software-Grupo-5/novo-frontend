'use client';

import { DataTable } from '@/features/components/data-table';

import { ContratoSummary } from '@/types/contrato';

import { CONTRACT_COLUMN_LABELS } from '../constants';
import { AddContractButton } from './add-contract-button';
import { columns } from './columns';

interface ContratosDataTableProps {
  readonly data: ContratoSummary[];
  readonly pageCount: number;
}

export function ContratosDataTable({ data, pageCount }: ContratosDataTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      pageCount={pageCount}
      searchColumnId="tenantName"
      searchPlaceholder="Buscar por contratos..."
      columnLabels={CONTRACT_COLUMN_LABELS}
      filterMappings={[{ columnId: 'tenantName' }]}
      actions={<AddContractButton />}
    />
  );
}
