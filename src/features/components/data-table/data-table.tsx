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
import { DataTableToolbar, FacetedFilterConfig } from './data-table-toolbar';

/**
 * Maps a URL query param to a table column filter.
 * Example: { urlParam: 'search', columnId: 'name' }
 */
export interface FilterMapping {
  urlParam: string;
  columnId: string;
  isArray?: boolean;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  searchColumnId?: string;
  searchPlaceholder?: string;
  facetedFilters?: FacetedFilterConfig[];
  columnLabels?: Record<string, string>;
  filterMappings?: FilterMapping[];
  actions?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  searchColumnId = 'name',
  searchPlaceholder = 'Filtrar...',
  facetedFilters = [],
  columnLabels = {},
  filterMappings = [],
  actions,
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

  // Helper to parse filters from URL based on filterMappings
  const parseFiltersFromURL = React.useCallback(() => {
    const filters: ColumnFiltersState = [];

    for (const mapping of filterMappings) {
      if (mapping.isArray) {
        const values = searchParams?.getAll(mapping.urlParam);
        if (values && values.length > 0) {
          filters.push({ id: mapping.columnId, value: values });
        }
      } else {
        const value = searchParams?.get(mapping.urlParam);
        if (value) {
          filters.push({ id: mapping.columnId, value });
        }
      }
    }

    return filters;
  }, [searchParams, filterMappings]);

  // Initialize filters from URL
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    () => parseFiltersFromURL()
  );

  // Sync Table State -> URL
  React.useEffect(() => {
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

    // Handle sorting
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      updateParam('sort', `${id}.${desc ? 'desc' : 'asc'}`);
    } else {
      newSearchParams.delete('sort');
    }

    // Handle filters based on filterMappings
    for (const mapping of filterMappings) {
      const filterValue = columnFilters.find(
        (f) => f.id === mapping.columnId
      )?.value;
      updateParam(mapping.urlParam, filterValue);
    }

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
    filterMappings,
  ]);

  // Sync URL -> Table State (e.g. back button)
  React.useEffect(() => {
    setPagination({
      pageIndex: page - 1,
      pageSize: per_page,
    });
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
      <DataTableToolbar
        table={table}
        searchColumnId={searchColumnId}
        searchPlaceholder={searchPlaceholder}
        facetedFilters={facetedFilters}
        columnLabels={columnLabels}
        actions={actions}
      />
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
