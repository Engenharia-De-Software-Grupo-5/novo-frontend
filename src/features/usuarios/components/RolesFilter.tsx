import { Button } from "@/features/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/features/components/ui/popover";
import { Role } from "@/types/user";
import { Badge, Plus } from "lucide-react";
import { useState } from "react";

interface RolesFilterProps {
  value?: Role[];
  onChange: (selectedRoles: Role[]) => void;
}

export function RolesFilter({ value, onChange }: RolesFilterProps) {
  const allRoles: Role[] = ["Financeiro", "RH"];
  const [selected, setSelected] = useState<Role | undefined>(value?.[0]);

  const selectRole = (role: Role) => {
    if (selected === role) {
      setSelected(undefined);
      onChange([]);
    } else {
      setSelected(role);
      onChange([role]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex items-center gap-1"
        >
          <Plus /> Cargo
          {selected && <Badge className="ml-2">{selected}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        {allRoles.map((role) => (
          <div
            key={role}
            className={`p-2 cursor-pointer rounded ${
              selected === role ? "bg-brand-gray text-white" : ""
            }`}
            onClick={() => selectRole(role)}
          >
            {role}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}