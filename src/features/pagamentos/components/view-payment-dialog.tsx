'use client';

import { Badge } from '@/features/components/ui/badge';
import { Button } from '@/features/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/features/components/ui/dialog';
// Reuse StatusBadge from funcionarios or create a new one?
// Funcionarios one takes "ativo" | "inativo" | "ferias" | "afastado".
// PaymentStatus is "agendado" | "pago" | "atrasado".
// I'll create a local badge helper or just use Badge directly with color mapping.
import { Download, FileText } from 'lucide-react';

import { PaymentDetail } from '@/types/payment';

import { StatusBadge } from './status-badge';

interface ViewPaymentDialogProps {
  payment: PaymentDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function FieldItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-0.5">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-muted-foreground text-xs">{value || '—'}</p>
    </div>
  );
}

export function ViewPaymentDialog({
  payment,
  open,
  onOpenChange,
}: ViewPaymentDialogProps) {
  const proofs = payment.proofs ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Pagamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <FieldItem label="Funcionário" value={payment.name} />

          <div className="space-y-0.5">
            <p className="text-sm font-medium">Cargo</p>
            <Badge variant="muted" className="capitalize">
              {payment.role}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FieldItem label="Tipo de Pagamento" value={payment.type} />
            <FieldItem
              label="Valor"
              value={new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(payment.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FieldItem
              label="Data de Vencimento"
              value={new Date(payment.dueDate).toLocaleDateString('pt-BR')}
            />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Data de Pagamento</p>
              <p className="text-muted-foreground text-xs">
                {payment.paymentDate
                  ? new Date(payment.paymentDate).toLocaleDateString('pt-BR')
                  : '—'}
              </p>
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="text-sm font-medium">Status</p>
            <StatusBadge status={payment.status} />
          </div>

          <FieldItem label="Observação" value={payment.observation} />

          {/* Comprovantes Anexados */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Comprovantes anexados</p>
            {proofs.length > 0 ? (
              proofs.map((proof) => (
                <div
                  key={proof.id}
                  className="flex items-center justify-between rounded-md border bg-gray-50 p-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    <span
                      className="max-w-[220px] truncate text-xs"
                      title={proof.name}
                    >
                      {proof.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(proof.url, '_blank')}
                    className="h-6 w-6"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-xs">
                Nenhum comprovante anexado.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
