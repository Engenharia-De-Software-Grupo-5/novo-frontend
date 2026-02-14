import { FlagOff } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/features/components/ui/dialog";
import { Button } from "@/features/components/ui/button";
import { useUpdateCondominoStatus } from "@/features/condominos/hooks/mutations/use-update-condomino-status";
import { CondominoListItem } from "../services/condominos";

interface DeactivateCondominoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  morador: CondominoListItem | null;
  condominiumId: string;
}

export function DeactivateCondominoDialog({
  open,
  onOpenChange,
  morador,
  condominiumId
}: DeactivateCondominoDialogProps) {
  const { mutate: updateStatus, isPending } = useUpdateCondominoStatus();

  if (!morador) return null;

  const handleConfirm = () => {
    updateStatus(
      { condominiumId, moradorId: morador.id, status: "inativo" },
      {
        onSuccess: () => {
          toast.success('Condômino desativado com sucesso!');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Erro ao desativar condômino');
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <FlagOff className="h-6 w-6" />
          </div>

          <DialogTitle>Você tem certeza?</DialogTitle>

          <DialogDescription className="text-sm">
            Essa ação impede que o condômino <strong>{morador.name}</strong> <br />
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
  );
}