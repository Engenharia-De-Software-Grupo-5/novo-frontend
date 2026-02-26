'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RoleGuard } from '@/features/components/auth/RoleGuard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/features/components/ui/alert-dialog';
import { Button } from '@/features/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/features/components/ui/dialog';
import { Input } from '@/features/components/ui/input';
import {
  deleteCondominio,
  getCondominios,
  postCondominio,
  putCondominio,
} from '@/features/condominios/services/condominioService';
import { Building2, LogOut, PencilLine, Plus, Trash2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

import { Condominium } from '@/types/condominium';

export default function CondominiosPage() {
  const router = useRouter();
  const [condominiums, setCondominiums] = React.useState<Condominium[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [editingCondo, setEditingCondo] = React.useState<Condominium | null>(
    null
  );
  const [condoName, setCondoName] = React.useState('');
  const [deletingCondo, setDeletingCondo] = React.useState<Condominium | null>(
    null
  );
  const [isDeleting, setIsDeleting] = React.useState(false);

  const fetchCondominiums = React.useCallback(async () => {
    try {
      const data = await getCondominios();
      setCondominiums(data);
    } catch (error) {
      console.error('Failed to fetch condominiums', error);
    }
  }, []);

  React.useEffect(() => {
    fetchCondominiums();
  }, [fetchCondominiums]);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleOpenDialog = (condo?: Condominium) => {
    if (condo) {
      setEditingCondo(condo);
      setCondoName(condo.name);
    } else {
      setEditingCondo(null);
      setCondoName('');
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (editingCondo) {
        // Edit
        await putCondominio(editingCondo.id, {
          name: condoName,
          id: editingCondo.id,
        });
        toast.success('Condomínio atualizado com sucesso');
      } else {
        // Create
        await postCondominio({ name: condoName });
        toast.success('Condomínio criado com sucesso');
      }
      setIsOpen(false);
      fetchCondominiums();
    } catch (error) {
      console.error('Error saving condominio:', error);
      toast.error('Erro ao salvar condomínio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, condo: Condominium) => {
    e.stopPropagation();
    setDeletingCondo(condo);
  };

  const handleDelete = async () => {
    if (!deletingCondo) return;
    setIsDeleting(true);
    try {
      await deleteCondominio(deletingCondo.id);
      toast.success('Condomínio excluído com sucesso');
      fetchCondominiums();
    } catch (error) {
      console.error('Error deleting condominio:', error);
      toast.error('Erro ao excluir condomínio');
    } finally {
      setIsDeleting(false);
      setDeletingCondo(null);
    }
  };

  const handleSwitch = (id: string) => {
    router.push(`/condominios/${id}/dashboard`);
  };

  return (
    <main className="bg-muted relative flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <Image src="/logo-icon.png" alt="Moratta" width={40} height={40} />
          </div>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
            <Building2 className="size-6" />
            Condomínios
          </CardTitle>
          <CardDescription>
            {'Selecione um condomínio para acessar'}
            <RoleGuard roles={[]}>{'ou crie um novo.'}</RoleGuard>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            {condominiums.map((condo) => (
              <button
                key={condo.id}
                type="button"
                onClick={() => handleSwitch(condo.id)}
                className="group hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground border-primary/20 flex size-10 items-center justify-center rounded-md border font-bold shadow-sm">
                    {getInitials(condo.name)}
                  </div>
                  <span className="text-sm font-medium">{condo.name}</span>
                </div>

                <RoleGuard roles={['Admin']} condoId={condo.id}>
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(condo);
                      }}
                    >
                      <PencilLine className="text-muted-foreground size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-destructive size-8"
                      onClick={(e) => handleDeleteClick(e, condo)}
                    >
                      <Trash2 className="text-destructive size-4" />
                    </Button>
                  </div>
                </RoleGuard>
              </button>
            ))}

            {condominiums.length === 0 && (
              <div className="text-muted-foreground rounded-lg border-2 border-dashed p-6 text-center text-sm">
                Nenhum condomínio encontrado.
              </div>
            )}
          </div>
          <RoleGuard roles={[]}>
            <Button
              variant="outline"
              className="mt-2 w-full gap-2 border-dashed"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="size-4" />
              Adicionar Condomínio
            </Button>
          </RoleGuard>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCondo ? 'Editar Condomínio' : 'Adicionar Condomínio'}
            </DialogTitle>
            <DialogDescription>
              {editingCondo
                ? 'Edite o nome do condomínio abaixo.'
                : 'Insira o nome do novo condomínio.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-4">
              <Input
                id="name"
                value={condoName}
                onChange={(e) => setCondoName(e.target.value)}
                placeholder="Nome do Condomínio"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSave();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de confirmação de exclusão */}
      <AlertDialog
        open={!!deletingCondo}
        onOpenChange={(open) => {
          if (!open) setDeletingCondo(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir condomínio</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o condomínio{' '}
              <span className="text-foreground font-semibold">
                {deletingCondo?.name}
              </span>
              ? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="absolute bottom-6 left-6">
        <Button
          variant="outline"
          className="text-muted-foreground hover:text-foreground bg-background shadow-sm"
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair da Conta
        </Button>
      </div>
    </main>
  );
}
