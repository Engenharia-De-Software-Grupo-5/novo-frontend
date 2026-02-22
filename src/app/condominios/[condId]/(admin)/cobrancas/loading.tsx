import { DataTableSkeleton } from '@/features/components/data-table';
import { Skeleton } from '@/features/components/ui/skeleton';

export default function CobrancasLoading() {
  return (
    <div className="flex flex-col space-y-4 p-8 pt-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[240px]" />
        <Skeleton className="h-4 w-[420px]" />
      </div>
      <DataTableSkeleton columnCount={9} rowCount={10} filterCount={2} showSearch showActions />
    </div>
  );
}

