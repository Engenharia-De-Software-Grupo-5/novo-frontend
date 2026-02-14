import { Button } from "@/features/components/ui/button";
import { Input } from "@/features/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/features/components/ui/popover";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface CpfFilterProps {
  value?: string;
  onChange: (cpf: string) => void;
}

export function CpfFilter({ value = '', onChange }: CpfFilterProps) {
  const [cpfInput, setCpfInput] = useState(value);

  useEffect(() => {
    setCpfInput(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpfInput(e.target.value);
    onChange(e.target.value);
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
          CPF
          {cpfInput && (
            <span className="bg-border mx-1 inline-block h-4 w-px" />
          )}
          {cpfInput && (
            <span className="hidden gap-1 lg:flex">
              {cpfInput}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 bg-white p-2 dark:bg-gray-800">
        <div className="flex flex-col gap-1">
          <Input
            placeholder="Digite o CPF..."
            value={cpfInput}
            onChange={handleInputChange}
            className="h-8"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}