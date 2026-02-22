'use client';

import { DataTableColumnHeader } from '@/features/components/data-table';
import { Button } from '@/features/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { FileText } from 'lucide-react';

import { ContratoSummary } from '@/types/contrato';

import { DataTableRowActions } from './data-table-row-actions';

const formatDate = (value: string) => {
  if (!value) return '-';
  return new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR');
};

export const columns: ColumnDef<ContratoSummary>[] = [
  {
    accessorKey: 'property',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Imóvel" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.property}</span>
    ),
  },
  {
    accessorKey: 'tenantName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Locatário" />
    ),
    cell: ({ row }) => <span>{row.original.tenantName}</span>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Criação" />
    ),
    cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Vencimento" />
    ),
    cell: ({ row }) => <span>{formatDate(row.original.dueDate)}</span>,
  },
  {
    accessorKey: 'pdfFileName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PDF do Contrato" />
    ),
    cell: ({ row }) => (
      <Button variant="outline" size="sm" asChild>
        <a href={row.original.pdfFileUrl} target="_blank" rel="noreferrer">
          <FileText className="mr-2 h-4 w-4" />
          {row.original.pdfFileName}
        </a>
      </Button>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions contract={row.original} />,
  },
];
