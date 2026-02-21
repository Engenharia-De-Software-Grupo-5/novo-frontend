'use client';

import { DataTable } from '@/features/components/data-table';
import { ModeloContratoSummary } from '@/types/modelo-contrato';

import { AddModeloContratoButton } from './add-modelo-contrato-button';
import { columns } from './columns';

interface ModelosContratoDataTableProps {
  data: ModeloContratoSummary[];
  pageCount: number;
}

export function ModelosContratoDataTable({
  data,
  pageCount,
}: ModelosContratoDataTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      pageCount={pageCount}
      searchColumnId="name"
      searchPlaceholder="Buscar por modelos..."
      columnLabels={{
        name: 'Nome do Modelo',
        createdAt: 'Data de Criacao',
        purpose: 'Finalidade',
      }}
      filterMappings={[{ columnId: 'name' }]}
      actions={<AddModeloContratoButton />}
    />
  );
}
