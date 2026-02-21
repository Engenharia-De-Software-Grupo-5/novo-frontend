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
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { User, UserSummary } from '@/types/user';

import { deleteUser } from '../services/users.service';

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  condominioId: string;
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  user,
  condominioId,
}: DeleteUserDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await deleteUser(condominioId, user.id);

      onOpenChange(false);
      toast.success('Usuário excluído com sucesso!');

      await new Promise((resolve) => setTimeout(resolve, 300));

      router.refresh();
    } catch (error) {
      toast.error('Erro ao excluir usuário');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          {/* Ícone com seu estilo exato */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Trash2 className="h-6 w-6" />
          </div>

          <DialogTitle>Excluir usuário</DialogTitle>

          <DialogDescription className="text-sm">
            Essa ação é irreversível e impede que o usuário <br />
            <strong>{user.name}</strong> acesse qualquer conteúdo do sistema{' '}
            <br />
            para sempre.
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
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? 'Excluindo...' : 'Excluir usuário'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
