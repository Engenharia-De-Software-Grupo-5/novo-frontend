import { useDeactivateUser } from '@/features/usuarios/hooks/mutations/use-deactivate-user';
import { Button } from '@/features/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/features/components/ui/dialog';
import { FlagOff } from 'lucide-react';

import { User } from '@/types/user';
import { toast } from 'sonner';

interface DeactivateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  condominioId: string;
}

export function DeactivateUserDialog({
  open,
  onOpenChange,
  user,
  condominioId
}: DeactivateUserDialogProps) {
 

  const { mutate:deactivateUser, isPending } = useDeactivateUser(condominioId);

   if (!user) return null;

  const handleConfirm = () => {
    deactivateUser(user.id, {
      onSuccess: () => {
        toast.success('Usuário atualizado com sucesso!');
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          {/* Ícone */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <FlagOff className="h-6 w-6" />
          </div>

          <DialogTitle>Você tem certeza?</DialogTitle>

          <DialogDescription className="text-sm">
            Essa ação impede que o usuário{' '}
            {user.name} {' '}
            acesse qualquer conteúdo do sistema.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button
            className="bg-red-100 text-red-700 hover:bg-red-200"
            onClick={handleConfirm}
            disabled={isPending}
          >
            Tornar inativo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
