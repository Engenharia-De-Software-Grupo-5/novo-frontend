'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/features/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/components/ui/dialog';
import { Input } from '@/features/components/ui/input';
import { Label } from '@/features/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/components/ui/select';
import { Textarea } from '@/features/components/ui/textarea';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Role } from '@/types/user';

import { inviteUser } from '../services/users.service';

export function AddUserDialog() {
  const router = useRouter();
  const params = useParams();
  const condId = params.condId as string;

  const rolesDisponiveis: Exclude<Role, 'Dono'>[] = ['Financeiro', 'RH'];

  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Financeiro');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      await inviteUser(condId, {
        name,
        email,
        role: role.toLowerCase(),
        message,
      });

      toast.success('Convite enviado com sucesso!');

      setName('');
      setEmail('');
      setRole('Financeiro');
      setMessage('');
      setOpen(false);

      await new Promise((resolve) => setTimeout(resolve, 300));
      router.refresh();
    } catch {
      toast.error('Erro ao enviar convite. Tente novamente.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-blue text-brand-blue-text gap-2 hover:bg-blue-900">
          <Plus className="h-4 w-4" />
          Adicionar Usuário
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Envie um convite por e-mail para que o usuário crie sua conta.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Nome */}
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="João Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* E-mail */}
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Cargo */}
          <div className="grid gap-2">
            <Label htmlFor="role">Cargo</Label>
            <Select
              value={role.toLowerCase()}
              onValueChange={(v) => setRole(v as Role)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                {rolesDisponiveis.map((r) => (
                  <SelectItem key={r} value={r.toLowerCase()}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mensagem Opcional */}
          <div className="grid gap-2">
            <Label htmlFor="message">Mensagem (opcional)</Label>
            <Textarea
              id="message"
              placeholder="Olá! Junte-se à nossa equipe..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-brand-blue"
            >
              {isPending ? 'Enviando...' : 'Enviar Convite'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
