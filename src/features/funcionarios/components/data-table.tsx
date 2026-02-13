'use client';

import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/features/components/ui/table';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search params parsing
  const page = searchParams?.get('page') ? Number(searchParams.get('page')) : 1;
  const per_page = searchParams?.get('limit')
    ? Number(searchParams.get('limit'))
    : 10;
  const sort = searchParams?.get('sort');
  const [column, order] = sort?.split('.') ?? [];

  // Create query string helper
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Table state
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Initialize sorting from URL
  const [sorting, setSorting] = React.useState<SortingState>(
    column && order ? [{ id: column, desc: order === 'desc' }] : []
  );

  // Initialize pagination from URL
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: page - 1,
      pageSize: per_page,
    });

  // Helper to parse filters from URL
  const parseFiltersFromURL = React.useCallback(() => {
    const filters: ColumnFiltersState = [];
    const search = searchParams?.get('search');
    if (search) {
      filters.push({ id: 'name', value: search });
    }

    const role = searchParams?.getAll('role');
    if (role && role.length > 0) {
      filters.push({ id: 'role', value: role });
    }

    const status = searchParams?.getAll('status');
    if (status && status.length > 0) {
      filters.push({ id: 'status', value: status });
    }
    return filters;
  }, [searchParams]);

  // Initialize filters from URL
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    () => parseFiltersFromURL()
  );

  // Sync Table State -> URL
  React.useEffect(() => {
    const params: Record<string, string | number | null> = {
      page: pageIndex + 1,
      limit: pageSize,
    };

    // Handle sorting
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      params.sort = `${id}.${desc ? 'desc' : 'asc'}`;
    } else {
      params.sort = null;
    }

    // Handle filters
    // Reset specific filter keys first
    // We don't have access to "previous" params easily without reparsing,
    // but createQueryString merges with existing.
    // However, createQueryString implementation from previous steps was:
    // "const newSearchParams = new URLSearchParams(searchParams?.toString()); ... newSearchParams.set(key, val) ... delete(key)"
    // This merges updates into existing params.
    // We need to be careful to remove keys if filter is cleared.
    // So we should iterate known filter keys and set/delete them based on current state.

    // Helper to find filter value
    const getFilterValue = (id: string) =>
      columnFilters.find((f) => f.id === id)?.value;

    const nameFilter = getFilterValue('name');
    params.search = (nameFilter as string) || null;

    // For array filters, we can't use our simple createQueryString which takes Record<string, string|number|null>
    // functionality needs to be expanded or handled handled manually.
    // let's manually construct the URLSearchParams derived from state/base.

    const newSearchParams = new URLSearchParams(searchParams?.toString());

    // Helper to update param
    const updateParam = (key: string, value: unknown) => {
      newSearchParams.delete(key);
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => newSearchParams.append(key, String(v)));
        } else {
          newSearchParams.set(key, String(value));
        }
      }
    };

    updateParam('page', pageIndex + 1);
    updateParam('limit', pageSize);
    if (sorting.length > 0) {
      updateParam('sort', params.sort);
    } else {
      newSearchParams.delete('sort');
    }

    updateParam('search', nameFilter);

    const roleFilter = getFilterValue('role');
    updateParam('role', roleFilter);

    const statusFilter = getFilterValue('status');
    updateParam('status', statusFilter);

    const queryString = newSearchParams.toString();

    if (
      `${pathname}?${queryString}` !== `${pathname}?${searchParams?.toString()}`
    ) {
      router.push(`${pathname}?${queryString}`, {
        scroll: false,
      });
    }
  }, [
    pageIndex,
    pageSize,
    sorting,
    columnFilters,
    pathname,
    router,
    searchParams,
  ]);

  // Sync URL -> Table State (e.g. back button)
  React.useEffect(() => {
    setPagination({
      pageIndex: page - 1,
      pageSize: per_page,
    });
    // Sync sorting from URL if needed as well
    const [column, order] = searchParams?.get('sort')?.split('.') ?? [];
    setSorting(column && order ? [{ id: column, desc: order === 'desc' }] : []);

    setColumnFilters(parseFiltersFromURL());
  }, [page, per_page, searchParams, parseFiltersFromURL]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination: { pageIndex, pageSize },
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
