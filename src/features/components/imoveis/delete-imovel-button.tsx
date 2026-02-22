'use client';

import { useParams, useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/features/components/ui/alert-dialog';
import { Button } from '@/features/components/ui/button';

import { DEFAULT_COND_ID } from '@/features/imoveis/constants';
import { deleteImovel } from '@/features/imoveis/services/imovelService';

interface DeleteImovelButtonProps {
  readonly id: string;
  readonly condId?: string;
}

export function DeleteImovelButton({ id, condId }: DeleteImovelButtonProps) {
  const router = useRouter();
  const params = useParams();
  const currentCondId = condId || (params?.condId as string) || DEFAULT_COND_ID;
  const listPath = `/condominios/${currentCondId}/imoveis`;

  const handleDelete = async () => {
    try {
      await deleteImovel(currentCondId, id);
      toast.success('Imóvel excluído com sucesso.');
      router.push(listPath);
      router.refresh();
    } catch (error) {
      console.error('Error deleting imovel:', error);
      toast.error('Erro ao excluir imóvel.');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" /> Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá permanentemente o
            imóvel e removerá seus dados dos nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Sim, excluir imóvel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
