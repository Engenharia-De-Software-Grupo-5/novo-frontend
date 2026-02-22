import { DataTableSkeleton } from '@/features/components/data-table';

export default function ImoveisLoading() {
  return (
    <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:space-y-8 lg:p-8">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Gerenciar Imóveis
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Visualize e filtre os imóveis por tipo e situação, com paginação e
            busca sincronizadas na URL.
          </p>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-0">
          <DataTableSkeleton
            columnCount={7}
            rowCount={10}
            filterCount={2}
            showSearch
            showActions
          />
        </div>
      </div>
    </div>
  );
}
