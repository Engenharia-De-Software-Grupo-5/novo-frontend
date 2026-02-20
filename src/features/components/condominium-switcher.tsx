'use client';

import * as React from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/features/components/ui/dropdown-menu';
import { Input } from '@/features/components/ui/input';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/features/components/ui/sidebar';
import {
  deleteCondominio,
  getCondominios,
  postCondominio,
  putCondominio,
} from '@/features/condominios/services/condominioService';
import {
  Building2,
  ChevronsUpDown,
  PencilLine,
  Plus,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { Condominium } from '@/types/condominium';

export function CondominiumSwitcher({ condId }: { condId?: string }) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [condominiums, setCondominiums] = React.useState<Condominium[]>([]);
  const [isOpen, setIsOpen] = React.useState(false); // Dialog state
  const [isLoading, setIsLoading] = React.useState(false);
  const [editingCondo, setEditingCondo] = React.useState<Condominium | null>(
    null
  );
  const [condoName, setCondoName] = React.useState('');

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

  const activeCondominium = React.useMemo(
    () => condominiums.find((c) => c.id === condId),
    [condominiums, condId]
  );

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
      toast.error('Erro ao salvar condomínio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Tem certeza que deseja excluir este condomínio?')) return;

    try {
      await deleteCondominio(id);
      toast.success('Condomínio excluído com sucesso');
      fetchCondominiums();
      if (condId === id) {
        router.push('/'); // Or somewhere safe
      }
    } catch (error) {
      toast.error('Erro ao excluir condomínio');
    }
  };

  const handleSwitch = (id: string) => {
    router.push(`/condominios/${id}/dashboard`);
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {activeCondominium ? (
                    <span className="text-xs font-bold">
                      {getInitials(activeCondominium.name)}
                    </span>
                  ) : (
                    <Building2 className="size-4" />
                  )}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeCondominium?.name || 'Selecione um Condomínio'}
                  </span>
                  <span className="truncate text-xs">Condomínio</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Condomínios
              </DropdownMenuLabel>
              {condominiums.map((condo) => (
                <DropdownMenuItem
                  key={condo.id}
                  onClick={() => handleSwitch(condo.id)}
                  className="group gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <span className="text-[10px] font-bold">
                      {getInitials(condo.name)}
                    </span>
                  </div>
                  <span className="flex-1 truncate">{condo.name}</span>

                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(condo);
                      }}
                      className="hover:bg-muted cursor-pointer rounded p-1"
                    >
                      <PencilLine className="text-muted-foreground hover:text-foreground size-4" />
                    </div>
                    <div
                      onClick={(e) => handleDelete(e, condo.id)}
                      className="hover:bg-destructive/10 cursor-pointer rounded p-1"
                    >
                      <Trash2 className="text-destructive hover:text-destructive size-4" />
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              MenuContent
              <DropdownMenuItem
                onClick={() => handleOpenDialog()}
                className="gap-2 p-2"
              >
                <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add Condomínio
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

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
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="name"
                value={condoName}
                onChange={(e) => setCondoName(e.target.value)}
                className="col-span-4"
                placeholder="Nome do Condomínio"
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
    </>
  );
}
