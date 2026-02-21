import { DataTableSkeleton } from '@/features/components/data-table';

export default function ImoveisLoading() {
  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Imóveis</h2>
          <p className="text-muted-foreground">
            Visualize e filtre os imóveis por tipo e situação, com paginação e
            busca sincronizadas na URL.
          </p>
        </div>
      </div>
      <DataTableSkeleton
        columnCount={7}
        rowCount={10}
        filterCount={2}
        showSearch
        showActions
      />
    </div>
  );
}
