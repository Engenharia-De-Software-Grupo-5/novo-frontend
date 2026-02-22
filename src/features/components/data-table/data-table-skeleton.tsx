import { Skeleton } from '@/features/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/components/ui/table';

interface DataTableSkeletonProps {
  /**
   * Number of columns to render in the skeleton table.
   * @default 5
   */
  readonly columnCount?: number;
  /**
   * Number of rows to render in the skeleton table.
   * @default 10
   */
  readonly rowCount?: number;
  /**
   * Number of filter buttons to render in the toolbar.
   * @default 2
   */
  readonly filterCount?: number;
  /**
   * Whether to show the search input skeleton.
   * @default true
   */
  readonly showSearch?: boolean;
  /**
   * Whether to show the action button skeleton (e.g. "Add" button).
   * @default true
   */
  readonly showActions?: boolean;
}

export function DataTableSkeleton({
  columnCount = 5,
  rowCount = 10,
  filterCount = 2,
  showSearch = true,
  showActions = true,
}: DataTableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {showSearch && <Skeleton className="h-9 w-[250px]" />}
          {Array.from({ length: filterCount }).map((_, i) => (
            <Skeleton key={`filter-${i}`} className="h-9 w-[100px]" />
          ))}
        </div>
        <div className="flex items-center space-x-2">
          {showActions && <Skeleton className="h-9 w-[140px]" />}
          <Skeleton className="h-9 w-[100px]" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, i) => (
                <TableHead key={`head-${i}`}>
                  <Skeleton className="h-4 w-[80px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>
                {Array.from({ length: columnCount }).map((_, colIndex) => {
                  let widthClass = 'w-[100px]';
                  if (colIndex === 0) {
                    widthClass = 'w-[180px]';
                  } else if (colIndex === columnCount - 1) {
                    widthClass = 'w-[40px]';
                  }

                  return (
                    <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                      <Skeleton className={`h-4 ${widthClass}`} />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-2">
        <Skeleton className="h-4 w-[180px]" />
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-9 w-[70px]" />
          </div>
          <Skeleton className="h-4 w-[100px]" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </div>
    </div>
  );
}
