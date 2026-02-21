'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/features/components/ui/dropdown-menu';
import { MoreHorizontal, PencilLine, ScanEye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { ImovelSummary } from '@/types/imoveis';

import { DEFAULT_COND_ID } from '../constants';
import { deleteImovel } from '../services/imovelService';

interface DataTableRowActionsProps {
  imovel: ImovelSummary;
}

export function DataTableRowActions({ imovel }: DataTableRowActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string | undefined;

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deleteImovel(condId || DEFAULT_COND_ID, imovel.idImovel);
      toast.success(`Imóvel "${imovel.name}" excluído com sucesso!`);
      router.refresh();
    } catch (error) {
      console.error('Error deleting imovel:', error);
      toast.error('Erro ao excluir imóvel. Tente novamente.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
              <Link
              href={
                condId
                  ? `/condominios/${condId}/imoveis/${imovel.idImovel}`
                  : `/imoveis/${imovel.idImovel}`
              }
              className="flex items-center justify-between gap-2"
            >
              Visualizar
              <ScanEye className="h-4 w-4" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
              <Link
              href={
                condId
                  ? `/condominios/${condId}/imoveis/${imovel.idImovel}/editar`
                  : `/imoveis/${imovel.idImovel}/editar`
              }
              className="flex items-center justify-between gap-2"
            >
              Editar
              <PencilLine className="h-4 w-4" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive flex items-center justify-between gap-2"
            onSelect={() => setShowDeleteDialog(true)}
          >
            Excluir
            <Trash2 className="h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir imóvel</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o imóvel{' '}
              <span className="text-foreground font-semibold">{imovel.name}</span>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
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
    </>
  );
}
