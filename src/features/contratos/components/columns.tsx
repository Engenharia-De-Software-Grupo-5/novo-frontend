'use client';

import { DataTableColumnHeader } from '@/features/components/data-table';
import { Badge } from '@/features/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

import { ContratoSummary } from '@/types/contrato';

import { DataTableRowActions } from './data-table-row-actions';
import { StatusBadge } from './status-badge';

const formatDate = (value: string) => {
  if (!value) return '-';
  return new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR');
};

export const columns: ColumnDef<ContratoSummary>[] = [
  {
    accessorKey: 'tenantName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome Locatário" />
    ),
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="font-medium">{row.original.tenantName}</p>
        <p className="text-muted-foreground text-xs">{row.original.propertyAddress}</p>
      </div>
    ),
  },
  {
    accessorKey: 'property',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Imóvel" />
    ),
    cell: ({ row }) => {
      const property = row.getValue('property') as string;
      return (
        <Badge variant="muted" className="font-normal">
          {property}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return <StatusBadge status={status} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Início" />
    ),
    cell: ({ row }) => {
      const startDate = row.getValue('startDate') as string;
      return <span>{formatDate(startDate)}</span>;
    },
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data Vencimento" />
    ),
    cell: ({ row }) => {
      const endDate = row.getValue('endDate') as string;
      return <span>{formatDate(endDate)}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions contract={row.original} />,
  },
];
