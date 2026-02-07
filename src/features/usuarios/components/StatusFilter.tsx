import { Button } from "@/features/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/features/components/ui/popover";
import { Status } from "@/types/user";
import { Badge, Plus } from "lucide-react";
import { useState } from "react";

interface StatusFilterProps {
  value?: Status[];
  onChange: (selectedStatus: Status[]) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  const allStatus: Status[] = ["ativo", "inativo", "pendente"];
  const [selected, setSelected] = useState<Status | undefined>(value?.[0]);

  const selectStatus = (status: Status) => {
    if (selected === status) {
      setSelected(undefined);
      onChange([]);
    } else {
      setSelected(status);
      onChange([status]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 flex items-center gap-1">
          <Plus /> Status
          {selected && <Badge className="ml-2">{selected}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        {allStatus.map((status) => (
          <div
            key={status}
            className={`p-2 cursor-pointer rounded ${
              selected === status ? "bg-brand-gray text-white" : ""
            }`}
            onClick={() => selectStatus(status)}
          >
            {status}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}