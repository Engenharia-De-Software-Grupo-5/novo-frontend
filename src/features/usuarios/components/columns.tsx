import { ColumnDef } from "@tanstack/react-table";
import { UserSummary } from "@/types/user";
import { StatusBadge } from "./StatusBadge"; // Seu componente de badge
import { UserTableRowActions } from "./UserTableRowActions"; // O que criamos com os hooks

export const columns: ColumnDef<UserSummary>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "role",
    header: "Cargo",
    cell: ({ row }) => (
      <span className="capitalize badge-role">{row.original.role}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "lastAccess",
    header: "Último acesso",
    cell: () => <span className="text-muted-foreground text-sm">Hoje</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => <UserTableRowActions user={row.original} />,
  },
];