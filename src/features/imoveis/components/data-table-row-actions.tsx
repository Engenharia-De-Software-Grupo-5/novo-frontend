'use client';

import { useState } from 'react';
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

import { ImovelDetail, ImovelSummary } from '@/types/imoveis';

import { DEFAULT_COND_ID } from '../constants';
import { deleteImovel, getImovelById } from '../services/imovelService';
import { ImovelDialog } from './add-imovel-dialog';
import { ViewImovelDialog } from './view-imovel-dialog';

interface DataTableRowActionsProps {
  readonly imovel: ImovelSummary;
}

export function DataTableRowActions({ imovel }: DataTableRowActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [imovelDetail, setImovelDetail] = useState<ImovelDetail | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string | undefined;

  async function handleView() {
    try {
      const detail = await getImovelById(
        condId || DEFAULT_COND_ID,
        imovel.idImovel
      );
      setImovelDetail(detail);
      setShowViewDialog(true);
    } catch (error) {
      console.error('Error fetching imovel details:', error);
      toast.error('Erro ao carregar dados do imóvel.');
    }
  }

  async function handleEdit() {
    try {
      const detail = await getImovelById(
        condId || DEFAULT_COND_ID,
        imovel.idImovel
      );
      setImovelDetail(detail);
      setShowEditDialog(true);
    } catch (error) {
      console.error('Error fetching imovel details:', error);
      toast.error('Erro ao carregar dados do imóvel.');
    }
  }

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
          <DropdownMenuItem
            className="flex items-center justify-between gap-2"
            onSelect={handleView}
          >
            Visualizar
            <ScanEye className="h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center justify-between gap-2"
            onSelect={handleEdit}
          >
            Editar
            <PencilLine className="h-4 w-4" />
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

      {imovelDetail && showViewDialog && (
        <ViewImovelDialog
          imovel={imovelDetail}
          open={showViewDialog}
          onOpenChange={(value) => {
            setShowViewDialog(value);
            if (!value) setImovelDetail(null);
          }}
        />
      )}

      {imovelDetail && showEditDialog && (
        <ImovelDialog
          imovel={imovelDetail}
          open={showEditDialog}
          onOpenChange={(value) => {
            setShowEditDialog(value);
            if (!value) setImovelDetail(null);
          }}
        />
      )}
    </>
  );
}
