'use client';

import { Badge } from '@/features/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/features/components/ui/dialog';

import { ImovelDetail } from '@/types/imoveis';

import { StatusBadge } from './status-badge';

interface ViewImovelDialogProps {
  readonly imovel: ImovelDetail;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

function FieldItem({ label, value }: { readonly label: string; readonly value?: string | null }) {
  return (
    <div className="space-y-0.5">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-muted-foreground text-xs">{value || '—'}</p>
    </div>
  );
}

export function ViewImovelDialog({
  imovel,
  open,
  onOpenChange,
}: ViewImovelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-0 top-0 h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none border-0 p-4 sm:left-[50%] sm:top-[50%] sm:h-auto sm:w-full sm:max-w-[520px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg sm:border sm:p-6">
        <DialogHeader>
          <DialogTitle>Detalhes do Imóvel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <FieldItem label="Código" value={imovel.idImovel} />
          <FieldItem label="Nome Interno" value={imovel.nome} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Tipo</p>
              <Badge variant="muted" className="capitalize">
                {imovel.tipo}
              </Badge>
            </div>

            <div className="space-y-0.5">
              <p className="text-sm font-medium">Status</p>
              <StatusBadge status={imovel.situacao} />
            </div>
          </div>

          <FieldItem label="Condomínio" value={imovel.idCondominio} />
          <FieldItem
            label="Endereço"
            value={`${imovel.endereco.rua}, ${imovel.endereco.numero}`}
          />
          <FieldItem label="Bairro" value={imovel.endereco.bairro} />
          <FieldItem
            label="Cidade/UF"
            value={`${imovel.endereco.cidade}/${imovel.endereco.estado}`}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
