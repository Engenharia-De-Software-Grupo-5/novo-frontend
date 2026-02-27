'use client';

import { DataTableColumnHeader } from '@/features/components/data-table';
import { Badge } from '@/features/components/ui/badge';
import { Button } from '@/features/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Download, FileText } from 'lucide-react';

import { EmployeeSummary } from '@/types/employee';

import { DataTableRowActions } from './data-table-row-actions';
import { StatusBadge } from './status-badge';

export const columns: ColumnDef<EmployeeSummary>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cargo" />
    ),
    cell: ({ row }) => {
      const role = row.getValue<string>('role');
      return (
        <Badge variant="muted" className="capitalize">
          {role}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue<string>('status');
      return <StatusBadge status={status} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'lastContract',
    header: 'Último Contrato',
    cell: ({ row }) => {
      const contract = row.original.lastContract;
      if (!contract)
        return <span className="text-muted-foreground text-sm">Nenhum</span>;

      return (
        <div className="flex items-center gap-2">
          <Badge variant="muted" className="font-normal">
            <FileText className="mr-1 h-3 w-3" />
            {contract.name}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => window.open(contract.url, '_blank')}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions employee={row.original} />,
  },
];
