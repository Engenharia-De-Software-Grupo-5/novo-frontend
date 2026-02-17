import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { toast } from 'sonner';

import { User } from '@/types/user';

import { changeUserStatus } from '../services/users.service';

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
  condominioId,
}: DeactivateUserDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const currentStatus = user.status as
    | 'ativo'
    | 'inativo'
    | 'pendente';

  const newStatus =
    currentStatus === 'inativo' ? 'ativo' : 'inativo';

  const isActive = currentStatus === 'ativo';
  const isInactive = currentStatus === 'inativo';
  const isPendente = currentStatus === 'pendente';

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await changeUserStatus(
        condominioId,
        user.id,
        newStatus
      );

      onOpenChange(false);

      toast.success(
        newStatus === 'ativo'
          ? 'Usuário ativado com sucesso!'
          : 'Usuário desativado com sucesso!'
      );

      await new Promise((resolve) => setTimeout(resolve, 300));
      router.refresh();
    } catch (error) {
      console.log(error)
      toast.error('Erro ao alterar status do usuário');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              newStatus === 'inativo'
                ? 'bg-red-100 text-red-600'
                : 'bg-green-100 text-green-600'
            }`}
          >
            <FlagOff className="h-6 w-6" />
          </div>

          <DialogTitle>
            {newStatus === 'ativo'
              ? 'Ativar usuário?'
              : 'Desativar usuário?'}
          </DialogTitle>

          <DialogDescription className="text-sm">
            {newStatus === 'ativo' ? (
              <>
                Essa ação permitirá que o usuário{' '}
                <strong>{user.name}</strong> volte a acessar o sistema.
              </>
            ) : isPendente ? (
              <>
                O usuário <strong>{user.name}</strong> está pendente.
                Deseja desativá-lo?
              </>
            ) : (
              <>
                Essa ação impede que o usuário{' '}
                <strong>{user.name}</strong> acesse o sistema.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>

          <Button
            className={
              newStatus === 'inativo'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending
              ? 'Processando...'
              : newStatus === 'ativo'
              ? 'Tornar ativo'
              : 'Tornar inativo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
