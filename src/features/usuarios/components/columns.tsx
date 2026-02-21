import { ColumnDef } from '@tanstack/react-table';

import { User } from '@/types/user';

import { StatusBadge } from '../../components/StatusBadge';
import { UserTableRowActions } from './UserTableRowActions';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: 'role',
    header: 'Cargo',
    cell: ({ row }) => (
      <span className="badge-role capitalize">{row.original.role}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <UserTableRowActions user={row.original} />,
  },
];
