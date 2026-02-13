import { useState } from 'react';
import { Badge } from '@/features/components/ui/badge';
import { Button } from '@/features/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/components/ui/popover';
import { Check, Plus } from 'lucide-react';

import { Status } from '@/types/user';
import { cn } from '@/lib/utils';

interface StatusFilterProps {
  value?: Status[];
  onChange: (selectedStatus: Status[]) => void;
}

export function StatusFilter({ value = [], onChange }: StatusFilterProps) {
  const allStatus: Status[] = ['ativo', 'inativo', 'pendente'];
  const [selected, setSelected] = useState<Status[]>(value);

  const toggleStatus = (status: Status) => {
    const newSelected = selected.includes(status)
      ? selected.filter((s) => s !== status)
      : [...selected, status];

    setSelected(newSelected);
    onChange(newSelected);
  };

  const clearAll = () => {
    setSelected([]);
    onChange([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 items-center gap-2 text-black dark:text-white"
        >
          <Plus />
          Status
          {selected.length > 0 && (
            <>
              <span className="bg-border mx-1 inline-block h-4 w-px" />

              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selected.length}
              </Badge>

              <span className="hidden gap-1 lg:flex">
                {selected.map((status) => (
                  <Badge
                    key={status}
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {status}
                  </Badge>
                ))}
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 bg-white p-2 dark:bg-gray-800">
        <div className="flex flex-col gap-1">
          {allStatus.map((status) => {
            const isSelected = selected.includes(status);
            return (
              <div
                key={status}
                className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded p-2"
                onClick={() => toggleStatus(status)}
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded border',
                    isSelected
                      ? 'bg-primary border-primary text-white'
                      : 'border-gray-300'
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </div>

                {/* Texto do status */}
                <span className="text-sm text-black dark:text-white">
                  {status}
                </span>
              </div>
            );
          })}

          {/* Botão limpar */}
          {selected.length > 0 && (
            <div
              className="mt-1 cursor-pointer rounded p-2 text-center text-sm text-red-600 hover:underline"
              onClick={clearAll}
            >
              Clear filters
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
