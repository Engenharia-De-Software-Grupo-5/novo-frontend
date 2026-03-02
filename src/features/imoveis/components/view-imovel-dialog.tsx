'use client';

import { Badge } from '@/features/components/ui/badge';
import { Button } from '@/features/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/features/components/ui/dialog';
import { Download, FileText } from 'lucide-react';

import { FileAttachment } from '@/types/file';
import { ImovelDetail } from '@/types/imoveis';

import { StatusBadge } from './status-badge';

interface ViewImovelDialogProps {
  readonly imovel: ImovelDetail;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

function FieldItem({
  label,
  value,
}: {
  readonly label: string;
  readonly value?: string | null;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-muted-foreground text-xs">{value || '—'}</p>
    </div>
  );
}

function FileSection({
  label,
  files,
  emptyMessage,
}: {
  readonly label: string;
  readonly files: FileAttachment[];
  readonly emptyMessage: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      {files.length > 0 ? (
        files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between rounded-md border bg-gray-50 p-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <FileText className="text-muted-foreground h-4 w-4" />
              <span
                className="max-w-[220px] truncate text-xs"
                title={file.name}
              >
                {file.name}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => window.open(file.link, '_blank')}
              className="h-6 w-6"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground text-xs">{emptyMessage}</p>
      )}
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
      <DialogContent className="top-0 left-0 h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none border-0 p-4 sm:top-[50%] sm:left-[50%] sm:h-auto sm:w-full sm:max-w-[520px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg sm:border sm:p-6">
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

          <FileSection
            label="Documentos de Vistoria"
            files={imovel.vistorias ?? []}
            emptyMessage="Nenhum documento de vistoria anexado."
          />

          <FileSection
            label="Documentos"
            files={imovel.documentos ?? []}
            emptyMessage="Nenhum documento anexado."
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
