'use client';

import { Badge } from '@/features/components/ui/badge';
import { Button } from '@/features/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/features/components/ui/dialog';
import { FileText } from 'lucide-react';

import { CobrancaDetail } from '@/types/cobranca';

import { COBRANCA_TYPES } from '../constants';
import { StatusBadge } from './status-badge';

interface ViewCobrancaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cobranca: CobrancaDetail;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const formatDate = (date?: string) =>
  date ? new Date(date).toLocaleDateString('pt-BR') : '-';

const paymentMethodLabel: Record<CobrancaDetail['paymentMethod'], string> = {
  boleto: 'Boleto',
  pix: 'PIX',
};

export function ViewCobrancaDialog({
  open,
  onOpenChange,
  cobranca,
}: ViewCobrancaDialogProps) {
  const typeLabel =
    COBRANCA_TYPES.find((item) => item.value === cobranca.type)?.label || cobranca.type;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader className="space-y-2 pb-1">
          <DialogTitle>Visualizar cobrança</DialogTitle>
          <DialogDescription>Detalhes completos da cobrança selecionada.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-muted-foreground">Condômino</p>
              <p className="font-medium">{cobranca.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{cobranca.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">CPF</p>
              <p className="font-medium">{cobranca.cpf}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Tipo</p>
              <Badge variant="muted">{typeLabel}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Situação</p>
              <StatusBadge status={cobranca.status} />
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Forma de pagamento</p>
              <p className="font-medium">{paymentMethodLabel[cobranca.paymentMethod]}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Data de vencimento</p>
              <p className="font-medium">{formatDate(cobranca.dueDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Data de pagamento</p>
              <p className="font-medium">{formatDate(cobranca.paymentDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Valor</p>
              <p className="font-medium">{formatCurrency(cobranca.value)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Multa</p>
              <p className="font-medium">{formatCurrency(cobranca.penalty)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Juros</p>
              <p className="font-medium">{cobranca.interest}%</p>
            </div>
          </div>

          {cobranca.observation ? (
            <div className="space-y-1">
              <p className="text-muted-foreground">Observação</p>
              <p className="rounded-md border bg-muted/30 p-3">{cobranca.observation}</p>
            </div>
          ) : null}

          {cobranca.attachments && cobranca.attachments.length > 0 ? (
            <div className="space-y-2">
              <p className="text-muted-foreground">Anexos</p>
              {cobranca.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 rounded-md border bg-muted/20 p-2"
                >
                  <FileText className="text-muted-foreground h-4 w-4" />
                  <span>{attachment.name}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
