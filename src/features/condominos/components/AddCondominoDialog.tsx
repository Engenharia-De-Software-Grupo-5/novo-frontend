"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/features/components/ui/dialog";
import { Button } from "@/features/components/ui/button";
import { Input } from "@/features/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export function AddCondominoDialog() {
  const [open, setOpen] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  

  const params = useParams()
  const condominiumId = params?.condId as string

  // Usamos o window.location.origin para o link ser dinâmico (localhost ou produção)
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  const preCadastroLink = `${baseUrl}/condominio/${condominiumId}/form`

  const handleCopy = () => {
    navigator.clipboard.writeText(preCadastroLink)
    setLinkCopied(true)
    toast.success("Link copiado com sucesso!")
    setTimeout(() => setLinkCopied(false), 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-blue text-white gap-2 hover:bg-blue-900">
          Adicionar condômino
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Formulário de pré-cadastro</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4 text-sm text-muted-foreground">
          <p>
            Envie este link para o condômino realizar seu pré-cadastro. 
            Ele precisará preencher informações pessoais e anexar documentos.
          </p>

          <div className="flex gap-2">
            <Input
              readOnly
              value={preCadastroLink}
              className="flex-1 bg-muted"
            />
            <Button 
              variant="outline" 
              onClick={handleCopy} 
              className="px-3 shrink-0"
            >
              <Copy className={`w-4 h-4 ${linkCopied ? "text-green-500" : ""}`} />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}