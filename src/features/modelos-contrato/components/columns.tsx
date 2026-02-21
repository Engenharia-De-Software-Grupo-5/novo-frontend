'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/features/components/data-table';
import { ModeloContratoSummary } from '@/types/modelo-contrato';

const formatDate = (value: string) => {
  if (!value) return '-';
  return new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR');
};

export const columns: ColumnDef<ModeloContratoSummary>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome do Modelo" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Criacao" />
    ),
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: 'purpose',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Finalidade" />
    ),
    cell: ({ row }) => (
      <p className="text-muted-foreground line-clamp-2 text-sm">
        {row.original.purpose}
      </p>
    ),
  },
];
