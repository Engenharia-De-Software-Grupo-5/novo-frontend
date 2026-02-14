import { Trash2 } from "lucide-react";
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
import { useDeleteCondomino } from "@/features/condominos/hooks/mutations/use-delete-condomino";
import { CondominoListItem } from "../services/condominos";

interface DeleteCondominoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  morador: CondominoListItem | null;
  condominiumId: string;
}

export function DeleteCondominoDialog({
  open,
  onOpenChange,
  morador,
  condominiumId
}: DeleteCondominoDialogProps) {
  const { mutate: deleteCondomino, isPending } = useDeleteCondomino();

  if (!morador) return null;

  const handleConfirm = () => {
    deleteCondomino(
      { condominiumId, moradorId: morador.id },
      {
        onSuccess: () => {
          toast.success('Condômino excluído com sucesso!');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Erro ao excluir condômino');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Trash2 className="h-6 w-6" />
          </div>

          <DialogTitle>Excluir condômino</DialogTitle>

          <DialogDescription className="text-sm">
            Essa ação é irreversível e impede que o condômino <br />
            <strong>{morador.name}</strong> acesse qualquer conteúdo do sistema <br />
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
  );
}