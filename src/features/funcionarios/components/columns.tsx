'use client';

import { Badge } from '@/features/components/ui/badge';
import { Button } from '@/features/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/features/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import {
  CircleCheck,
  CircleX,
  Download,
  FileText,
  Loader,
  MoreHorizontal,
} from 'lucide-react';

import { EmployeeSummary } from '@/types/employee';

import { DataTableColumnHeader } from './data-table-column-header';

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
      const role = row.getValue('role') as string;
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
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant="muted"
          className="flex w-fit items-center gap-1 capitalize"
        >
          {status === 'ativo' && <CircleCheck className="h-3 w-3" />}
          {status === 'pendente' && <Loader className="h-3 w-3" />}
          {status === 'inativo' && <CircleX className="h-3 w-3" />}
          {status}
        </Badge>
      );
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
    cell: ({ row }) => {
      const employee = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(employee.id)}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Visualizar</DropdownMenuItem>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Apagar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
