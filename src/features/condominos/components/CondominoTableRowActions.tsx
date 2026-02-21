'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  MoreVertical,
  ScanEye,
  Trash2,
  Flag,
  FlagOff,
} from 'lucide-react';
import { Button } from '@/features/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/features/components/ui/dropdown-menu';

import { CondominoSummary } from '@/types/condomino';
import { DeleteCondominoDialog } from './DeleteCondominoDialog';
import { DeactivateCondominoDialog } from './DeactivateCondominoDialog';
import { ViewCondominoDialog } from './ViewDialog/ViewCondominoDialog';

interface CondominoTableRowActionsProps {
  condomino: CondominoSummary;
}

export function CondominoTableRowActions({
  condomino,
}: CondominoTableRowActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showToggleStatusDialog, setShowToggleStatusDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const params = useParams();
  const condId = params?.condId as string;
  const isInactive = condomino.status === 'inativo' || condomino.status == 'pendente';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault(); 
              console.log('Abrindo Dialog para ID:', condomino.id); 
              setShowViewDialog(true);
            }}
          >
            Visualizar <ScanEye className="ml-auto h-4 w-4" />
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setShowToggleStatusDialog(true)}>
            {isInactive ? 'Ativar' : 'Desativar'}
            {isInactive ? (
              <Flag className="text-muted-foreground ml-auto h-4 w-4" />
            ) : (
              <FlagOff className="text-muted-foreground ml-auto h-4 w-4" />
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteDialog(true)}
          >
            Excluir <Trash2 className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewCondominoDialog
        condominoId={condomino.id}
        condominioId={condId}
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
      />

      <DeleteCondominoDialog
        condomino={condomino}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        condominioId={condId}
      />

      <DeactivateCondominoDialog
        condomino={condomino}
        open={showToggleStatusDialog}
        onOpenChange={setShowToggleStatusDialog}
        condominioId={condId}
      />
    </>
  );
}
