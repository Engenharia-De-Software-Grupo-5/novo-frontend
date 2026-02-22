import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/features/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/features/components/ui/dropdown-menu';
import {
  Flag,
  FlagOff,
  MoreVertical,
  PencilLine,
  ScanEye,
  Trash2,
} from 'lucide-react';

import { User } from '@/types/user';

import { DeactivateUserDialog } from './DeactivateUserDialog';
import { DeleteUserDialog } from './DeleteUserDialog';
import { EditUserDialog } from './EditUserDialog';
import { ViewUserDialog } from './ViewUserDialog';

interface UserTableRowActionsProps {
  readonly user: User;
}

export function UserTableRowActions({ user }: UserTableRowActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showToggleStatusDialog, setShowToggleStatusDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const params = useParams();
  const condId = params?.condId as string;
  const isInactive = user.status === 'inativo' || user.status == 'pendente';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setShowViewDialog(true)}>
            Visualizar <ScanEye className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
            Editar <PencilLine className="ml-auto h-4 w-4" />
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

      <ViewUserDialog
        user={user}
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
      />
      <EditUserDialog
        user={user}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        condominioId={condId}
      />

      <DeleteUserDialog
        user={user}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        condominioId={condId}
      />

      <DeactivateUserDialog
        user={user}
        open={showToggleStatusDialog}
        onOpenChange={setShowToggleStatusDialog}
        condominioId={condId}
      />
    </>
  );
}
