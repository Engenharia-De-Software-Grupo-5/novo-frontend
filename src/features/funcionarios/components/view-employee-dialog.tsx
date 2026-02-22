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

import { EmployeeDetail } from '@/types/employee';

import { StatusBadge } from './status-badge';

interface ViewEmployeeDialogProps {
  readonly employee: EmployeeDetail;
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

export function ViewEmployeeDialog({
  employee,
  open,
  onOpenChange,
}: ViewEmployeeDialogProps) {
  const contracts = employee.Contracts ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Funcionário</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <FieldItem label="Email" value={employee.email} />
          <FieldItem label="Nome Completo" value={employee.name} />
          <FieldItem label="CPF" value={employee.cpf} />

          <div className="grid grid-cols-2 gap-4">
            <FieldItem label="Data de Nascimento" value={employee.birthDate} />
            <FieldItem
              label="Data de Admissão"
              value={employee.admissionDate}
            />
          </div>

          <div className="space-y-0.5">
            <p className="text-sm font-medium">Cargo</p>
            <Badge variant="muted" className="capitalize">
              {employee.role}
            </Badge>
          </div>

          <div className="space-y-0.5">
            <p className="text-sm font-medium">Status</p>
            <StatusBadge status={employee.status} />
          </div>

          <FieldItem label="Telefone" value={employee.phone} />
          <FieldItem label="Endereço" value={employee.address} />

          {/* Contratos Anexados */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Contratos anexados</p>
            {contracts.length > 0 ? (
              contracts.map((contract) => (
                <div
                  key={contract.id}
                  className="flex items-center justify-between rounded-md border bg-gray-50 p-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    <span
                      className="max-w-[220px] truncate text-xs"
                      title={contract.name}
                    >
                      {contract.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(contract.url, '_blank')}
                    className="h-6 w-6"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-xs">
                Nenhum contrato anexado.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
