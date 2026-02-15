"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FlagOff } from "lucide-react"
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
import { updateCondomino } from "../services/condominos.service"
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
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  if (!condomino) return null

  const handleConfirm = async () => {
    setIsPending(true)
    try {
      // Chamada ao service usando PATCH para alterar apenas o status
      await updateCondomino(condominioId, condomino.id, { status: "inativo" })
      
      toast.success('Condômino desativado com sucesso!')
      
  
      onOpenChange(false)

      await new Promise((resolve) => setTimeout(resolve, 300));
      
     
      router.refresh()
      
    } catch (error) {
      toast.error('Erro ao desativar condômino')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          {/* Ícone com seu estilo exato */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <FlagOff className="h-6 w-6" />
          </div>

          <DialogTitle>Você tem certeza?</DialogTitle>

          <DialogDescription className="text-sm">
            Essa ação impede que o condômino <strong>{condomino.name}</strong> <br />
            acesse as funcionalidades do condomínio no sistema.
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
            className="bg-red-100 text-red-700 hover:bg-red-200"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Processando..." : "Tornar inativo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}