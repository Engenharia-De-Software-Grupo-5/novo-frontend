"use client"
import { ColumnDef } from "@tanstack/react-table";
import { CondominoSummary } from "@/types/condomino";
import { StatusBadge } from "../../components/StatusBadge"; // Reaproveitando seu componente
import { CondominoTableRowActions } from "./CondominoTableRowActions";

export const columns: ColumnDef<CondominoSummary>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "email",
    header: "E-mail",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    cell: ({ row }) => <span>{row.original.cpf}</span>,
  },
  {
    accessorKey: "status",
    header: "Situação",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <CondominoTableRowActions condomino={row.original} />,
  },
];