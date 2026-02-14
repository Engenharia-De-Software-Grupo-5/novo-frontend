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

import { deactivateUser } from '../services/users.service';

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


  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await deactivateUser(condominioId, user.id);
      onOpenChange(false);

      toast.success('Usuário desativado com sucesso!');

      await new Promise((resolve) => setTimeout(resolve, 300));
      
      router.refresh();
    } catch (error) {
      toast.error('Erro ao desativar usuário');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <FlagOff className="h-6 w-6" />
          </div>
          <DialogTitle>Você tem certeza?</DialogTitle>
          <DialogDescription className="text-sm">
            Essa ação impede que o usuário <strong>{user.name}</strong> acesse o
            sistema.
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
            className="bg-red-100 text-red-700 hover:bg-red-200"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? 'Processando...' : 'Tornar inativo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
