'use client';

import { Button } from '@/features/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/features/components/ui/dialog';
import { Label } from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';

import { User } from '@/types/user';
import { useParams, useRouter } from 'next/navigation';
import { inviteUser } from '../services/users.service';
import { useState } from 'react';

interface ViewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export function ViewUserDialog({
  open,
  onOpenChange,
  user,
}: ViewUserDialogProps) {
  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string;

  const [isPending, setIsPending] = useState(false);
  const isPendente = user.status === 'pendente';

  const handleResendInvite = async () => {
    if (!condId) return;

    try {
      setIsPending(true);

      await inviteUser(condId, {
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
      });
      
      onOpenChange(false);
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      toast.success('Convite reenviado com sucesso!');
      router.refresh();
    } catch (error) {
      toast.error('Erro ao reenviar convite. Tente novamente.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Detalhes do usuário</DialogTitle>
          <DialogDescription>
            Informações do usuário, status do acesso e ações administrativas
            disponíveis.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 text-sm">
          <div>
            <Label>Nome</Label>
            <div className="text-muted-foreground border-input bg-background h-10 rounded-md border px-3 py-2">
              {user.name}
            </div>
          </div>

          <div>
            <Label>E-mail</Label>
            <div className="text-muted-foreground border-input bg-background h-10 rounded-md border px-3 py-2">
              {user.email}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label>Cargo</Label>
              <div className="text-muted-foreground border-input bg-muted h-10 rounded-md border px-3 py-2">
                {user.role}
              </div>
            </div>

            <div className="grid gap-1">
              <Label>Status</Label>
              <div className="text-muted-foreground border-input bg-muted h-10 rounded-md border px-3 py-2 capitalize">
                {user.status}
              </div>
            </div>
          </div>

          {isPendente && (
            <div className="grid gap-1">
              <Label>Convite enviado em</Label>
              <div className="text-muted-foreground border-input bg-muted h-10 rounded-md border px-3 py-2">
                {user.inviteDate ?? '-'}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Fechar
          </Button>

          {isPendente && (
            <Button
              className="bg-brand-blue hover:bg-blue-900"
              onClick={handleResendInvite}
              disabled={isPending}
            >
              {isPending ? 'Reenviando...' : 'Reenviar convite'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}