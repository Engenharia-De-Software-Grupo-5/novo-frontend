'use client';

import { DataTableColumnHeader } from '@/features/components/data-table';
import { Badge } from '@/features/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

import { ImovelSummary } from '@/types/imoveis';

import { DataTableRowActions } from './data-table-row-actions';
import { StatusBadge } from './status-badge';

export const columns: ColumnDef<ImovelSummary>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome Interno" />
    ),
  },
  {
    accessorKey: 'tipo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const tipo = row.getValue<string>('tipo');
      return (
        <Badge variant="muted" className="capitalize">
          {tipo}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'situacao',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Situação" />
    ),
    cell: ({ row }) => {
      const situacao = row.getValue<ImovelSummary['situacao']>('situacao');
      return <StatusBadge status={situacao} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'bairro',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bairro" />
    ),
  },
  {
    accessorKey: 'cidade',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cidade" />
    ),
  },
  {
    accessorKey: 'endereco',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Endereço" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions imovel={row.original} />,
  },
];
