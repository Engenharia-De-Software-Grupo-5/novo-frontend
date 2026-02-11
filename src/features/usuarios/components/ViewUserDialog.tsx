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

    // Lógica de envio aqui (API, etc)

    onOpenChange(false);
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
            <div className="text-muted-foreground border-input bg-background h-10 rounded-md border px-3 py-2 text-sm">
              {user.name}
            </div>
          </div>

          <div>
            <Label>E-mail</Label>
            <div className="text-muted-foreground border-input bg-background h-10 rounded-md border px-3 py-2 text-sm">
              {user.email}
            </div>
          </div>

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

          {user.status === 'pendente' && (
            <>
              {/* Cargo / Status */}
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

              {/* Datas do convite */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label>Convite enviado em</Label>
                  <div className="text-muted-foreground border-input bg-muted h-10 rounded-md border px-3 py-2 text-sm">
                    {user.inviteDate}
                  </div>
                </div>

                <div className="grid gap-1">
                  <Label>Convite expira em</Label>
                  <div className="text-muted-foreground border-input bg-muted h-10 rounded-md border px-3 py-2 text-sm">
                    {user.inviteDuration}
                  </div>
                </div>
              </div>

              {/* Aviso */}
              <p className="text-brand-red-vivid text-right text-xs">
                * convite expirado
              </p>
            </>
          )}
          {user.status === 'ativo' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label>Primeiro acesso</Label>
                <div className="text-muted-foreground border-input bg-muted h-10 rounded-md border px-3 py-2 text-sm">
                  15/01/2026
                </div>
              </div>

              <div className="grid gap-1">
                <Label>Último acesso</Label>
                <div className="text-muted-foreground border-input bg-muted h-10 rounded-md border px-3 py-2 text-sm">
                  22/01/2026
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>

          {user.status === 'pendente' && (
            <Button className="bg-brand-blue  hover:bg-blue-900" onClick={handleSubmit}>
              Reenviar convite
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
