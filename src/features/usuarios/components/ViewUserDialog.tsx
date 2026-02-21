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

interface ViewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function ViewUserDialog({
  open,
  onOpenChange,
  user,
}: ViewUserDialogProps) {
  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Convite enviado com sucesso!');
    onOpenChange(false);
  };

  const isPendente = user.status === 'pendente';

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
          {/* Nome */}
          <div>
            <Label>Nome</Label>
            <div className="text-muted-foreground border-input bg-background h-10 rounded-md border px-3 py-2 text-sm">
              {user.name}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label>E-mail</Label>
            <div className="text-muted-foreground border-input bg-background h-10 rounded-md border px-3 py-2 text-sm">
              {user.email}
            </div>
          </div>

          {/* Cargo e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label>Cargo</Label>
              <div className="text-muted-foreground border-input bg-muted h-10 rounded-md border px-3 py-2 text-sm">
                {user.role}
              </div>
            </div>

            <div className="grid gap-1">
              <Label>Status</Label>
              <div className="text-muted-foreground border-input bg-muted h-10 rounded-md border px-3 py-2 text-sm capitalize">
                {user.status}
              </div>
            </div>
          </div>

          
          {isPendente && (
            <>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-1">
                  <Label>Convite enviado em</Label>
                  <div className="text-muted-foreground border-input bg-muted h-10 rounded-md border px-3 py-2 text-sm">
                    {user.inviteDate}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>

          {isPendente && (
            <Button
              className="bg-brand-blue hover:bg-blue-900"
              onClick={handleSubmit}
            >
              Reenviar convite
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
