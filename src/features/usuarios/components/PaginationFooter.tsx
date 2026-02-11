'use client';

import { Button } from '@/features/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface PaginationFooterProps {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
export function PaginationFooter({
  page,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationFooterProps) {
  const hasTotalPages = totalPages > 1;
  const safePage = Math.max(1, page);

  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;

  const end = totalItems === 0 ? 0 : Math.min(safePage * pageSize, totalItems);

  const goToPage = (p: number) => {
    const nextPage = Math.min(Math.max(1, p), totalPages || 1);

    onPageChange(nextPage);
  };

  console.log({ page, onPageChange });

  return (
    <div className="text-muted-foreground flex flex-col gap-3 border-t px-6 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Esquerda */}
      <span>
        itens de {start} a {end} exibidos
      </span>

      {/* Centro */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span>Linhas por página</span>

          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-18">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span>
          Página {safePage}
          {hasTotalPages ? ` de ${totalPages}` : ''}
        </span>
      </div>

      {/* Direita */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          disabled={page === 1}
          onClick={() => goToPage(1)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          disabled={safePage === 1}
          onClick={() => goToPage(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          disabled={page === totalPages}
          onClick={() => goToPage(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          disabled={page === totalPages}
          onClick={() => goToPage(totalPages)}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
