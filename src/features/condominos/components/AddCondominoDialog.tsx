'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/features/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/components/ui/dialog';
import { Input } from '@/features/components/ui/input';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export function AddCondominoDialog() {
  const [open, setOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const params = useParams();
  const condominiumId = params?.condId as string;

  const baseUrl =
    globalThis.window === undefined ? '' : globalThis.window.location.origin;
  const preCadastroLink = `${baseUrl}/condominios/${condominiumId}/pre-cadastro`;

  const handleCopy = () => {
    navigator.clipboard.writeText(preCadastroLink);
    setLinkCopied(true);
    toast.success('Link copiado com sucesso!');
    setTimeout(() => setLinkCopied(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-blue gap-2 text-white hover:bg-blue-900">
          Adicionar condômino
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Formulário de pré-cadastro</DialogTitle>
        </DialogHeader>

        <div className="text-muted-foreground mt-4 flex flex-col gap-4 text-sm">
          <p>
            Envie este link para o condômino realizar seu pré-cadastro. Ele
            precisará preencher informações pessoais e anexar documentos.
          </p>

          <div className="flex gap-2">
            <Input
              readOnly
              value={preCadastroLink}
              className="bg-muted flex-1"
            />
            <Button
              variant="outline"
              onClick={handleCopy}
              className="shrink-0 px-3"
            >
              <Copy
                className={`h-4 w-4 ${linkCopied ? 'text-green-500' : ''}`}
              />
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
  );
}
