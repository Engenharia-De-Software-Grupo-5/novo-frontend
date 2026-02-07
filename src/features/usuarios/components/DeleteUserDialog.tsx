import { useDeleteUser } from '@/features/usuarios/hooks/mutations/use-delete-user';
import { Button } from '@/features/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/features/components/ui/dialog';
import { User } from '@/types/user';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';


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
  condominioId
}: DeleteUserDialogProps) {
  

 
  const { mutate: deleteUser, isPending } = useDeleteUser(condominioId);

  if (!user) return null;

  const handleConfirm = () => {
    deleteUser(user.id, {
      onSuccess: () => {
        toast.success('Usuário excluído com sucesso!');
        onOpenChange(false);
      },
      onError: () => {
        toast.error('Erro ao excluir usuário');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          {/* Ícone */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Trash2 className="h-6 w-6" />
          </div>

          <DialogTitle>Excluir usuário</DialogTitle>

          <DialogDescription className="text-sm">
            Essa ação é irreversível e impede que o usuário {' '} <br />
            {user.name} acesse qualquer conteúdo do sistema <br />
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
            Excluir usuário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
