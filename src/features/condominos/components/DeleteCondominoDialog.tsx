"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
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

// Importe o seu novo service e o tipo correto
import { deleteCondomino } from "../services/condominos.service"
import { CondominoSummary } from "@/types/condomino"

interface DeleteCondominoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  condomino: CondominoSummary | null 
  condominioId: string
}

export function DeleteCondominoDialog({
  open,
  onOpenChange,
  condomino,
  condominioId
}: DeleteCondominoDialogProps) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  if (!condomino) return null

  const handleConfirm = async () => {
    setIsPending(true)
    try {
      // Usando o service que criamos
      await deleteCondomino(condominioId, condomino.id)
      
      onOpenChange(false)
      toast.success('Condômino excluído com sucesso!')
      
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Revalida os dados da tabela no servidor
      router.refresh()
    } catch (error) {
      toast.error('Erro ao excluir condômino')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          {/* Ícone mantido */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Trash2 className="h-6 w-6" />
          </div>

          <DialogTitle>Excluir condômino</DialogTitle>

          <DialogDescription className="text-sm">
            Essa ação é irreversível e impede que o condômino <br />
            <strong>{condomino.name}</strong> acesse qualquer conteúdo do sistema <br />
            para sempre.
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
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Excluindo..." : "Excluir condômino"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}