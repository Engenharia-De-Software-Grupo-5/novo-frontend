import { useState } from 'react';
import { useCreateUser } from '@/features/usuarios/hooks/mutations/use-create-user';
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

export function AddUserDialog() {
  // Filtramos o "Dono" da lista de opções exibidas
  const rolesDisponiveis: Exclude<Role, 'Dono'>[] = ['Financeiro', 'RH'];

  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Financeiro');
  const [inviteDuration, setInviteDuration] = useState<number>(7);

  const { mutate: createUser, isPending } = useCreateUser('condominio-id-aqui');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // sendemail to user
    createUser(
      {
        email,
        role,
        inviteDuration,
      },
      {
        onSuccess: () => {
          toast.success('Convite enviado com sucesso!');
          setOpen(false);
          setEmail('');
          setRole('Financeiro');
          setInviteDuration(7);
        },
        onError: () => {
          toast.error('Erro ao enviar convite');
        },
      }
    );
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
            Envie um convite por e-mail para que o usuário crie sua conta e
            tenha acesso ao sistema. O convite terá um link seguro e prazo de
            validade.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
            <div className="text-brand-gray bottom-8 text-left text-[10px] md:text-xs">
              O convite será enviado para este endereço.
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Cargo</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                {rolesDisponiveis.map((role) => (
                  <SelectItem key={role} value={role.toLowerCase()}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-brand-gray bottom-8 text-left text-[10px] md:text-xs">
              Define o nível de acesso após o cadastro.
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Validade do convite</Label>
            <Select
              defaultValue="7"
              value={String(inviteDuration)}
              onValueChange={(v) => setInviteDuration(Number(v))}
            >
              <SelectTrigger id="expiry">
                <SelectValue placeholder="Selecione o prazo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 dias</SelectItem>
                <SelectItem value="14">14 dias</SelectItem>
                <SelectItem value="21">21 dias</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-brand-gray bottom-8 text-left text-[10px] md:text-xs">
              O link enviado com o convide expira por padrão em 7 dias.
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Mensagem</Label>
            <Textarea placeholder="Type your message here." />
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit"  disabled={isPending} className="bg-brand-blue">
              Enviar Convite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
