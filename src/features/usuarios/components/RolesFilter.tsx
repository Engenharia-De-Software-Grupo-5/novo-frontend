import { useState } from 'react';
import { Badge } from '@/features/components/ui/badge';
import { Button } from '@/features/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/components/ui/popover';
import { Check, Plus } from 'lucide-react';

import { Role } from '@/types/user';
import { cn } from '@/lib/utils';

interface RolesFilterProps {
  value?: Role[];
  onChange: (selectedRoles: Role[]) => void;
}

export function RolesFilter({ value = [], onChange }: RolesFilterProps) {
  const allRoles: Role[] = ['Financeiro', 'RH'];
  const [selected, setSelected] = useState<Role[]>(value);

  const toggleRole = (role: Role) => {
    const newSelected = selected.includes(role)
      ? selected.filter((r) => r !== role)
      : [...selected, role];

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
          Cargo
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
                {selected.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selected.length} selected
                  </Badge>
                ) : (
                  selected.map((role) => (
                    <Badge
                      key={role}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {role}
                    </Badge>
                  ))
                )}
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 bg-white p-2 dark:bg-gray-800">
        <div className="flex flex-col gap-1">
          {allRoles.map((role) => {
            const isSelected = selected.includes(role);
            return (
              <div
                key={role}
                className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded p-2"
                onClick={() => toggleRole(role)}
              >
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

                <span className="text-sm text-black dark:text-white">
                  {role}
                </span>
              </div>
            );
          })}

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
