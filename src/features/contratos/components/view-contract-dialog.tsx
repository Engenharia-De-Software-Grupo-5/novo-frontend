'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/features/components/ui/dialog';

import { ContratoDetail } from '@/types/contrato';

import { StatusBadge } from './status-badge';

interface ViewContractDialogProps {
  contract: ContratoDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function FieldItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-0.5">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-muted-foreground text-xs">{value || '-'}</p>
    </div>
  );
}

const formatDate = (value: string) => {
  if (!value) return '-';
  return new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR');
};

export function ViewContractDialog({
  contract,
  open,
  onOpenChange,
}: ViewContractDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Contrato</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <FieldItem label="Locatário" value={contract.tenantName} />
          <FieldItem label="Imóvel" value={contract.property} />
          <FieldItem label="Endereço do imóvel" value={contract.propertyAddress} />

          <div className="grid grid-cols-2 gap-4">
            <FieldItem label="Data Início" value={formatDate(contract.startDate)} />
            <FieldItem
              label="Data Vencimento"
              value={formatDate(contract.endDate)}
            />
          </div>

          <div className="space-y-0.5">
            <p className="text-sm font-medium">Status</p>
            <StatusBadge status={contract.status} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
