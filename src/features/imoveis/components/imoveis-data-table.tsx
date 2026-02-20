'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { DataTable } from '@/features/components/data-table';
import { Button } from '@/features/components/ui/button';

import { ImovelSummary } from '@/types/imoveis';

import {
  IMOVEIS_COLUMN_LABELS,
  IMOVEIS_SITUACOES,
  IMOVEIS_TIPOS,
} from '../constants';
import { columns } from './columns';

interface ImoveisDataTableProps {
  data: ImovelSummary[];
  pageCount: number;
}

export function ImoveisDataTable({ data, pageCount }: ImoveisDataTableProps) {
  const params = useParams();
  const condId = params?.condId as string | undefined;

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
      actions={
        <Button asChild>
          <Link href={condId ? `/condominios/${condId}/imoveis/novo` : '/imoveis/novo'}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Imóvel
          </Link>
        </Button>
      }
    />
  );
}
