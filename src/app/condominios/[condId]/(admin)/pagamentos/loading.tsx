import { DataTableSkeleton } from '@/features/components/data-table';
import { Skeleton } from '@/features/components/ui/skeleton';

export default function PagamentosLoading() {
  return (
    <div className="flex flex-col space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[150px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[140px]" />
        </div>
      </div>

      <DataTableSkeleton
        columnCount={6} // name, role, value, status, paymentDate, actions
        rowCount={10}
        filterCount={2} // status, role
        showSearch
        showActions
      />
    </div>
  );
}
