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
import { toast } from '@/features/components/ui/sonner';
import { Download, Eye, MoreHorizontal, PencilLine, Trash2 } from 'lucide-react';

import { CobrancaDetail, CobrancaSummary } from '@/types/cobranca';

import {
  deleteCobranca,
  getCobrancaById,
} from '../services/cobrancaService';
import { CobrancaDialog } from './add-cobranca-dialog';
import { ViewCobrancaDialog } from './view-cobranca-dialog';

interface DataTableRowActionsProps {
  cobranca: CobrancaSummary;
}

export function DataTableRowActions({ cobranca }: DataTableRowActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [cobrancaDetail, setCobrancaDetail] = useState<CobrancaDetail | null>(null);

  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string;

  const fetchDetail = async (intent: 'view' | 'edit') => {
    try {
      toast.loading('Carregando detalhes...');
      const data = await getCobrancaById(condId, cobranca.id);
      setCobrancaDetail(data);
      if (intent === 'view') {
        setShowViewDialog(true);
      } else {
        setShowEditDialog(true);
      }
    } catch (error) {
      console.error('Error loading charge detail', error);
      toast.error('Erro ao carregar detalhes da cobrança.');
    } finally {
      toast.dismiss();
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCobranca(condId, cobranca.id);
      toast.success('Cobrança excluída com sucesso.');
      router.refresh();
    } catch (error) {
      console.error('Error deleting charge', error);
      toast.error('Erro ao excluir cobrança. Tente novamente.');
    } finally {
      setShowDeleteDialog(false);
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    const payload = JSON.stringify(cobranca, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${cobranca.id}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Arquivo da cobrança gerado com sucesso.');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex items-center gap-1.5"
            onSelect={() => fetchDetail('view')}
          >
            Visualizar
            <Eye className="h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center justify-between gap-2"
            onSelect={() => fetchDetail('edit')}
          >
            Editar
            <PencilLine className="h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center justify-between gap-2"
            onSelect={handleDownload}
          >
            Baixar cobrança
            <Download className="h-4 w-4" />
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
            <AlertDialogTitle>Excluir cobrança</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a cobrança de{' '}
              <span className="text-foreground font-semibold">{cobranca.name}</span>? Esta ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showEditDialog && cobrancaDetail && (
        <CobrancaDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          cobranca={cobrancaDetail}
        />
      )}

      {showViewDialog && cobrancaDetail && (
        <ViewCobrancaDialog
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
          cobranca={cobrancaDetail}
        />
      )}
    </>
  );
}
