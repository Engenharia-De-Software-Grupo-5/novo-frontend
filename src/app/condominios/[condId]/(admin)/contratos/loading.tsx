import { DataTableSkeleton } from '@/features/components/data-table';

export default function ContratosLoading() {
  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Gerenciar Contratos
          </h2>
          <p className="text-muted-foreground">
            Visualize contratos ativos, vencidos e agendados com busca por
            locatário, imóvel e datas de vigência.
          </p>
        </div>
      </div>

      <DataTableSkeleton
        columnCount={6}
        rowCount={10}
        filterCount={1}
        showSearch
        showActions
      />
    </div>
  );
}
