'use client';

import { DataTable } from '@/features/components/data-table';

import { ImovelSummary } from '@/types/imoveis';

import {
  IMOVEIS_COLUMN_LABELS,
  IMOVEIS_SITUACOES,
  IMOVEIS_TIPOS,
} from '../constants';
import { ImovelDialog } from './add-imovel-dialog';
import { columns } from './columns';

interface ImoveisDataTableProps {
  data: ImovelSummary[];
  pageCount: number;
}

export function ImoveisDataTable({ data, pageCount }: ImoveisDataTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      pageCount={pageCount}
      searchColumnId="name"
      searchPlaceholder="Filtrar imóveis..."
      facetedFilters={[
        {
          columnId: 'tipo',
          title: 'Tipo',
          options: IMOVEIS_TIPOS.map((tipo) => ({
            label: tipo.label,
            value: tipo.value,
            icon: tipo.icon,
          })),
        },
        {
          columnId: 'situacao',
          title: 'Situação',
          options: IMOVEIS_SITUACOES.map((situacao) => ({
            label: situacao.label,
            value: situacao.value,
            icon: situacao.icon,
          })),
        },
      ]}
      columnLabels={IMOVEIS_COLUMN_LABELS}
      filterMappings={[
        { columnId: 'name' },
        { columnId: 'tipo', isArray: true },
        { columnId: 'situacao', isArray: true },
      ]}
      actions={<ImovelDialog />}
    />
  );
}
