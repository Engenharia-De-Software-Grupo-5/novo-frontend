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
import { Input } from '@/features/components/ui/input';
import { MoreHorizontal, ScanEye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { ContratoSummary } from '@/types/contrato';

import { deleteContrato } from '../services/contratoService';
import { ViewContractDialog } from './view-contract-dialog';

interface DataTableRowActionsProps {
  readonly contract: ContratoSummary;
}

export function DataTableRowActions({ contract }: DataTableRowActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string;

  const canDelete = deleteConfirmation.trim().toLowerCase() === 'deletar contrato';

  async function handleDelete() {
    if (!canDelete) {
      toast.error('Digite "deletar contrato" para confirmar.');
      return;
    }

    try {
      setIsDeleting(true);
      await deleteContrato(condId, contract.id);
      toast.success(`Contrato de "${contract.tenantName}" excluído com sucesso!`);
      router.refresh();
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error('Erro ao excluir contrato. Tente novamente.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setDeleteConfirmation('');
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
            onSelect={() => setShowViewDialog(true)}
          >
            Visualizar
            <ScanEye className="h-4 w-4" />
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

      {showViewDialog && (
        <ViewContractDialog
          contractId={contract.id}
          condId={condId}
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
        />
      )}

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={(open) => {
          setShowDeleteDialog(open);
          if (!open) setDeleteConfirmation('');
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir contrato</AlertDialogTitle>
            <AlertDialogDescription>
              Para confirmar a exclusão do contrato de{' '}
              <span className="text-foreground font-semibold">
                {contract.tenantName}
              </span>
              , digite <strong>deletar contrato</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Input
            value={deleteConfirmation}
            onChange={(event) => setDeleteConfirmation(event.target.value)}
            placeholder="Digite: deletar contrato"
            autoFocus
          />

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting || !canDelete}
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
