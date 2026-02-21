'use client';

import * as React from 'react';
import { Button } from '@/features/components/ui/button';
import { Input } from '@/features/components/ui/input';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

export interface FacetedFilterConfig {
  columnId: string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumnId?: string;
  searchPlaceholder?: string;
  facetedFilters?: FacetedFilterConfig[];
  columnLabels?: Record<string, string>;
  actions?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  searchColumnId = 'name',
  searchPlaceholder = 'Filtrar...',
  facetedFilters = [],
  columnLabels = {},
  actions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Local state for debounced search
  const [searchValue, setSearchValue] = React.useState(
    (table.getColumn(searchColumnId)?.getFilterValue() as string) ?? ''
  );

  // Sync local state when table filter changes externally (e.g. from URL on load)
  React.useEffect(() => {
    setSearchValue(
      (table.getColumn(searchColumnId)?.getFilterValue() as string) ?? ''
    );
  }, [table.getColumn(searchColumnId)?.getFilterValue()]);

  // Debounce filter update
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const currentValue = table
        .getColumn(searchColumnId)
        ?.getFilterValue() as string;
      if (currentValue !== searchValue) {
        table.getColumn(searchColumnId)?.setFilterValue(searchValue);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue, table, searchColumnId]);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full flex-wrap items-center gap-2">
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="h-9 w-full sm:w-[220px] lg:w-[250px]"
        />
        {facetedFilters.map((filter) =>
          table.getColumn(filter.columnId) ? (
            <DataTableFacetedFilter
              key={filter.columnId}
              column={table.getColumn(filter.columnId)}
              title={filter.title}
              options={filter.options}
            />
          ) : null
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 lg:px-3"
          >
            Limpar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:shrink-0 sm:justify-start">
        <DataTableViewOptions table={table} columnLabels={columnLabels} />
        {actions}
      </div>
    </div>
  );
}
