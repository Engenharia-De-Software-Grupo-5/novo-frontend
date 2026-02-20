"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Flag, FlagOff } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/features/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/features/components/ui/dialog"

// Importando o service de condôminos e a interface de sumário
import { changeCondominoStatus, updateCondomino } from "../services/condominos.service"
import { CondominoSummary } from "@/types/condomino"

interface DeactivateCondominoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  condomino: CondominoSummary | null // Atualizado para o seu novo type
  condominioId: string
}

export function DeactivateCondominoDialog({
  open,
  onOpenChange,
  condomino,
  condominioId
}: DeactivateCondominoDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  if (!condomino) return null;

  // Lógica de alternância de status
  const currentStatus = condomino.status as 'ativo' | 'inativo';
  const newStatus = currentStatus === 'inativo' ? 'ativo' : 'inativo';

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      // Usando a mesma lógica do seu changeUserStatus
      await changeCondominoStatus(condominioId, condomino.id, newStatus);
      
      onOpenChange(false);
      toast.success(
        newStatus === 'ativo' 
          ? 'Condômino ativado com sucesso!' 
          : 'Condômino desativado com sucesso!'
      );
      
      // Delay pequeno para garantir que o banco/memória atualizou antes do refresh
      await new Promise((resolve) => setTimeout(resolve, 300));
      router.refresh();
      
    } catch (error) {
      toast.error('Erro ao alterar status do condômino');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
            newStatus === 'inativo' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            {newStatus === 'inativo' ? <FlagOff className="h-6 w-6" /> : <Flag className="h-6 w-6" />}
          </div>

          <DialogTitle>
            {newStatus === 'ativo' ? 'Ativar condômino?' : 'Desativar condômino?'}
          </DialogTitle>

          <DialogDescription className="text-sm">
            Essa ação fará com que <strong>{condomino.name}</strong> fique com o status{" "}
            <span className="font-bold">{newStatus}</span> no sistema.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            className={newStatus === 'inativo' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Processando..." : `Tornar ${newStatus}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}