'use client';

import { DataTableColumnHeader } from '@/features/components/data-table';
import { ColumnDef } from '@tanstack/react-table';

import { ModeloContratoSummary } from '@/types/modelo-contrato';

import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<ModeloContratoSummary>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome do Modelo" />
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    cell: ({ row }) => row.original.description,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions modelo={row.original} />,
  },
];
