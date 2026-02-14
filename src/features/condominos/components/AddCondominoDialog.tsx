"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/features/components/ui/dialog";
import { Button } from "@/features/components/ui/button";
import { Input } from "@/features/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface AddCondominoDialogProps {
  condominiumId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddCondominoDialog({ condominiumId, open, onOpenChange }: AddCondominoDialogProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const preCadastroLink = `https://localhost/condominio/${condominiumId}/form`;

  const handleCopy = () => {
    navigator.clipboard.writeText(preCadastroLink);
    setLinkCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setLinkCopied(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-brand-blue text-brand-blue-text gap-2 hover:bg-blue-900">Adicionar condômino</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Formulário de pré-cadastro</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <p>
            Envie este link para o condômino realizar seu pré-cadastro. Ele precisará preencher informações pessoais e anexar documentos.
          </p>

          <div className="flex gap-2">
            <Input
              readOnly
              value={preCadastroLink}
              className="flex-1"
            />
            <Button variant="outline" onClick={handleCopy} className="px-3">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
