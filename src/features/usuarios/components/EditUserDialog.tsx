'use client';

import { useEffect, useState } from 'react';
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
import { Label } from '@/features/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/components/ui/select';
import { toast } from 'sonner';

import { Role, User } from '@/types/user';

import { updateUser } from '../services/users.service';

type UserStatus = 'ativo' | 'inativo' | 'pendente';

interface EditUserDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly user: User | null;
  readonly condominioId: string;
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  condominioId,
}: EditUserDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // Estados locais para edição
  const [role, setRole] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<UserStatus>('pendente');

  const roles: Role[] = ['Financeiro', 'RH'];

  // Sincroniza os estados quando o dialog abre ou o user muda
  useEffect(() => {
    if (user && open) {
      setRole(user.role);
      setStatus(user.status);
    }
  }, [user, open]);

  if (!user) return null;

  const handleSubmit = async () => {
    setIsPending(true);
    try {
      await updateUser(condominioId, user.id, role as string, status);

      onOpenChange(false);
      toast.success('Usuário atualizado com sucesso!');

      await new Promise((resolve) => setTimeout(resolve, 300));

      router.refresh();
    } catch {
      toast.error('Erro ao atualizar usuário');
    } finally {
      setIsPending(false);
    }
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
          {/* Nome (Read-only estilo seu) */}
          <div>
            <Label>Nome</Label>
            <div className="border-input bg-background text-muted-foreground mt-1 h-10 rounded-md border px-3 py-2 text-sm">
              {user.name}
            </div>
          </div>

          {/* Email (Read-only estilo seu) */}
          <div>
            <Label>E-mail</Label>
            <div className="border-input bg-background text-muted-foreground mt-1 h-10 rounded-md border px-3 py-2 text-sm">
              {user.email}
            </div>
          </div>

          {/* Cargo / Status editáveis */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label>Cargo</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((roleOption) => (
                    <SelectItem key={roleOption} value={roleOption}>
                      {roleOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as UserStatus)}
              >
                <SelectTrigger className="mt-1">
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

          {/* Informações extras (Renderização condicional mantida) */}
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

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>

          <Button
            className="bg-brand-blue hover:bg-blue-900"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
