'use client';

import { useParams } from "next/navigation"; 
import { DataTable } from "@/features/components/data-table/data-table";
import { columns } from "./columns";
import { DespesaSummary } from "@/types/despesa";
import { DESPESA_STATUS, DESPESA_TIPOS, FORMA_PAGAMENTO, COLUMN_LABELS } from "../constants";
import { AddDespesaDialog } from "./add-despesa-dialog";

interface DespesasDataTableProps {
  data: DespesaSummary[];
  pageCount: number;
}

export function DespesasDataTable({ data, pageCount }: DespesasDataTableProps) {
  const params = useParams(); 
  const condId = params.condId as string;

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      searchColumnId="nome"
      searchPlaceholder="Buscar despesa por nome..."
      columnLabels={COLUMN_LABELS}
      actions={<AddDespesaDialog condId={condId} />} 
      facetedFilters={[
        { columnId: "tipo", title: "Tipo", options: DESPESA_TIPOS },
        { columnId: "formaPagamento", title: "Forma de Pagto", options: FORMA_PAGAMENTO },
      ]}
      filterMappings={[
        { columnId: 'nome' },
        { columnId: 'tipo', isArray: true },
        { columnId: 'formaPagamento', isArray: true },
      ]}
    />
  );
}