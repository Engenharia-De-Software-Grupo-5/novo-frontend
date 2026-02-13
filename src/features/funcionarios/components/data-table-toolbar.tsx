'use client';

import * as React from 'react';
import { Button } from '@/features/components/ui/button';
import { Input } from '@/features/components/ui/input';
import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Local state for debounced search
  const [searchValue, setSearchValue] = React.useState(
    (table.getColumn('name')?.getFilterValue() as string) ?? ''
  );

  // Sync local state when table filter changes externally (e.g. from URL on load)
  React.useEffect(() => {
    setSearchValue((table.getColumn('name')?.getFilterValue() as string) ?? '');
  }, [table.getColumn('name')?.getFilterValue()]);

  // Debounce filter update
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const currentValue = table.getColumn('name')?.getFilterValue() as string;
      if (currentValue !== searchValue) {
        table.getColumn('name')?.setFilterValue(searchValue);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue, table]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar nomes..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('role') && (
          <DataTableFacetedFilter
            column={table.getColumn('role')}
            title="Cargo"
            options={[
              { label: 'Gerente', value: 'gerente' }, // Adjust as needed
              { label: 'Porteiro', value: 'porteiro' },
              { label: 'Zelador', value: 'zelador' },
              { label: 'Faxineiro', value: 'faxineiro' },
              // Ideally this should come from a constants file or API
            ]}
          />
        )}
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={[
              { label: 'Ativo', value: 'ativo' },
              { label: 'Pendente', value: 'pendente' },
              { label: 'Inativo', value: 'inativo' },
            ]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
        <Button
          size="sm"
          className="h-8 bg-[#1447E6] text-white hover:bg-[#1447E6]/90"
        >
          Adicionar Funcionário
        </Button>
      </div>
    </div>
  );
}
