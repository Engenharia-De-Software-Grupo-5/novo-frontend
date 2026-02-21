'use client';

import { useState } from 'react';
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
import { Flag, FlagOff } from 'lucide-react';
import { toast } from 'sonner';

import { CondominoSummary } from '@/types/condomino';

import { changeCondominoStatus } from '../services/condominos.service';

interface DeactivateCondominoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  condomino: CondominoSummary;
  condominioId: string;
}

export function DeactivateCondominoDialog({
  open,
  onOpenChange,
  condomino,
  condominioId,
}: DeactivateCondominoDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  if (!condomino) return null;

  const isAtivo = condomino.status === 'ativo';
  const newStatus = isAtivo ? 'inativo' : 'ativo';

  const handleConfirm = async () => {
    try {
      setIsPending(true);

      await changeCondominoStatus(condominioId, condomino.id, newStatus);

      onOpenChange(false);

      await new Promise((resolve) => setTimeout(resolve, 300));

      toast.success(
        newStatus === 'ativo'
          ? 'Condômino ativado com sucesso!'
          : 'Condômino desativado com sucesso!'
      );

      router.refresh();
    } catch {
      toast.error('Erro ao alterar status do condômino');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              isAtivo
                ? 'bg-red-100 text-red-600'
                : 'bg-green-100 text-green-600'
            }`}
          >
            {isAtivo ? (
              <FlagOff className="h-6 w-6" />
            ) : (
              <Flag className="h-6 w-6" />
            )}
          </div>

          <DialogTitle>
            {isAtivo ? 'Desativar condômino?' : 'Ativar condômino?'}
          </DialogTitle>

          <DialogDescription className="text-sm">
            Essa ação fará com que <strong>{condomino.name}</strong> fique com o
            status <span className="font-bold">{newStatus}</span> no sistema.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>

          <Button
            className={
              isAtivo
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? 'Processando...' : isAtivo ? 'Desativar' : 'Ativar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
