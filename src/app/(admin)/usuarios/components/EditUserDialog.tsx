'use client';

import { useEffect, useState } from 'react';
import { useUpdateUser } from '@/feature/usuarios/hooks/mutations/use-update-user';
import { Button } from '@/features/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/features/components/ui/dialog';
import { Label } from '@/features/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/components/ui/select';
import { toast } from 'sonner';

import { User } from '@/types/user';

type UserStatus = 'ativo' | 'inativo' | 'pendente';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
}: EditUserDialogProps) {
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<UserStatus>('pendente');

  const { mutate: updateUser, isPending } = useUpdateUser(user?.condominioId);

  // sempre que abrir o dialog, sincroniza com o user
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRole(user.role);
      setStatus(user.status);
    }
  }, [user, open]);

  if (!user) return null;

  const handleSubmit = () => {
    updateUser(
      {
        userId: user.id,
        data: {
          role,
          status,
        },
      },
      {
        onSuccess: () => {
          toast.success('Usuário atualizado com sucesso!');
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Editar usuário</DialogTitle>
          <DialogDescription>
            Altere o cargo ou o status de acesso do usuário.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 text-sm">
          {/* Nome */}
          <div>
            <Label>Nome</Label>
            <div className="border-input bg-background text-muted-foreground h-10 rounded-md border px-3 py-2 text-sm">
              {user.name}
            </div>
          </div>

          {/* Email */}
          <div>
            <Label>E-mail</Label>
            <div className="border-input bg-background text-muted-foreground h-10 rounded-md border px-3 py-2 text-sm">
              {user.email}
            </div>
          </div>

          {/* Cargo / Status editáveis */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label>Cargo</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  {/* Dono só se fizer sentido */}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as UserStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Informações extras (readonly) */}
          {user.status === 'ativo' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label>Primeiro acesso</Label>
                <div className="border-input bg-muted text-muted-foreground h-10 rounded-md border px-3 py-2 text-sm">
                  15/01/2026
                </div>
              </div>

              <div className="grid gap-1">
                <Label>Último acesso</Label>
                <div className="border-input bg-muted text-muted-foreground h-10 rounded-md border px-3 py-2 text-sm">
                  22/01/2026
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button
            className="bg-brand-blue hover:bg-blue-900"
            onClick={handleSubmit}
          >
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
