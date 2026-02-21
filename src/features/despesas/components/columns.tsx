'use client';

import { ColumnDef } from "@tanstack/react-table";
import { DespesaSummary } from "@/types/despesa";
import { DataTableColumnHeader } from "@/features/components/data-table/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "@/features/components/ui/badge";
import { DESPESA_STATUS, DESPESA_TIPOS, FORMA_PAGAMENTO } from "../constants";

export const columns: ColumnDef<DespesaSummary>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            {row.getValue("nome")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "idImovel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vínculo" />
    ),
    cell: ({ row }) => {
      const idImovel = row.getValue("idImovel") as string | null;
      
      if (!idImovel) {
        return <Badge variant="secondary" className="font-normal text-xs">Despesa do condomínio</Badge>;
      }
      return <span className="font-medium">{idImovel}</span>;
    },
  },
  {
    accessorKey: "tipo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const tipo = DESPESA_TIPOS.find(
        (t) => t.value === row.getValue("tipo")
      );

      if (!tipo) return null;

      return (
        <div className="flex items-center text-muted-foreground">
          {tipo.icon && <tipo.icon className="mr-2 h-4 w-4" />}
          <span>{tipo.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "data",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    cell: ({ row }) => {
      const dateStr = row.getValue("data") as string;
      const [ano, mes, dia] = dateStr.split('-');
      return <span>{`${dia}/${mes}/${ano}`}</span>;
    },
  },
  {
    accessorKey: "valor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("valor"));
      const formatado = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
      
      return <span className="font-medium">{formatado}</span>;
    },
  },
  {
    accessorKey: "formaPagamento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pagamento" />
    ),
    cell: ({ row }) => {
      const forma = FORMA_PAGAMENTO.find(
        (f) => f.value === row.getValue("formaPagamento")
      );

      if (!forma) return null;

      return (
        <div className="flex items-center">
          <span>{forma.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];