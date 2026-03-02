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
import { Row } from '@tanstack/react-table';
import { Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { DespesaDetail, DespesaSummary } from '@/types/despesa';

import { deleteDespesa, getById } from '../services/despesaService';
import { DespesaDialog } from './add-despesa-dialog';
import { ViewDespesaDialog } from './view-despesa-dialog';

interface DataTableRowActionsProps {
  readonly row: Row<DespesaSummary>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const despesa = row.original;
  const params = useParams();
  const router = useRouter();
  const condId = params.condId as string;

  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [despesaDetail, setDespesaDetail] = useState<DespesaDetail | null>(
    null
  );

  async function handleEdit() {
    try {
      const detail = await getById(condId, despesa.id);
      setDespesaDetail(detail);
      setShowEditDialog(true);
    } catch (error) {
      console.error('Error fetching despesa details:', error);
      toast.error('Erro ao carregar dados da despesa.');
    }
  }

  const confirmDelete = async () => {
    try {
      await deleteDespesa(condId, despesa.id);
      toast.success('Despesa excluída com sucesso!');
      router.refresh();
    } catch {
      toast.error('Erro ao excluir a despesa.');
    } finally {
      setShowDeleteAlert(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => setShowViewDialog(true)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            Visualizar
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            onClick={() => setShowDeleteAlert(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewDespesaDialog
        condId={condId}
        despesaId={despesa.id}
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
      />

      {despesaDetail && showEditDialog && (
        <DespesaDialog
          despesa={despesaDetail}
          open={showEditDialog}
          onOpenChange={(value) => {
            setShowEditDialog(value);
            if (!value) setDespesaDetail(null);
          }}
        />
      )}

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              {
                'Esta ação não pode ser desfeita. Isso excluirá permanentemente a despesa'
              }
              <span className="text-foreground font-semibold">
                {' '}
                {despesa.nome}{' '}
              </span>
              {'dos registros do condomínio.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
