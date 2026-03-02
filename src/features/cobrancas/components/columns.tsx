'use client';

import { DataTableColumnHeader } from '@/features/components/data-table';
import { Badge } from '@/features/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { GripVertical } from 'lucide-react';

import { CobrancaSummary } from '@/types/cobranca';

import { COBRANCA_TYPES } from '../constants';
import { DataTableRowActions } from './data-table-row-actions';
import { StatusBadge } from './status-badge';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const formatDate = (date: string) => {
  if (!date) {
    return '-';
  }

  return new Date(date).toLocaleDateString('pt-BR');
};

export const columns: ColumnDef<CobrancaSummary>[] = [
  {
    id: 'drag',
    cell: () => <GripVertical className="text-muted-foreground h-4 w-4" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="E-mail" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue('email')}</span>
    ),
  },
  {
    accessorKey: 'cpf',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPF" />
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const type = String(row.getValue('type'));
      const typeLabel =
        COBRANCA_TYPES.find((item) => item.value === type)?.label || type;

      return <Badge variant="muted">{typeLabel}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Situação" />
    ),
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de vencimento" />
    ),
    cell: ({ row }) => (
      <span>{formatDate(String(row.getValue('dueDate')))}</span>
    ),
  },
  {
    accessorKey: 'value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">
        {formatCurrency(Number(row.getValue('value')))}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions cobranca={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];
