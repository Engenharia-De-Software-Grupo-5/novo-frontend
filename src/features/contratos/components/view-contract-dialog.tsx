'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/features/components/ui/dialog';
import { ScrollArea } from '@/features/components/ui/scroll-area';
import { Separator } from '@/features/components/ui/separator';
import { ContratoDetail } from '@/types/contrato';

import { getContratoById } from '../services/contratoService';
import { StatusBadge } from './status-badge';

interface ViewContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractId: string;
  condId: string;
}

function FieldItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-muted-foreground text-sm">{value || '-'}</p>
    </div>
  );
}

const formatDate = (value?: string) => {
  if (!value) return '-';
  return new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR');
};

const formatMoney = (value?: number) => {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function ViewContractDialog({
  open,
  onOpenChange,
  contractId,
  condId,
}: ViewContractDialogProps) {
  const [data, setData] = useState<ContratoDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open || !contractId) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await getContratoById(condId, contractId);
        setData(result);
      } catch (error) {
        console.error('Error fetching contract detail:', error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [open, condId, contractId]);

  const title = useMemo(() => {
    if (isLoading) return 'Carregando contrato...';
    return data?.tenantName || 'Detalhes do Contrato';
  }, [data?.tenantName, isLoading]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] flex-col overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="shrink-0 border-b bg-slate-50/50 p-6">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>
            {isLoading
              ? 'Buscando dados no servidor...'
              : data
                ? `Visualizando informações do contrato ${data.id}`
                : 'Não foi possível carregar os dados do contrato.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <Loader2 className="text-primary/60 h-10 w-10 animate-spin" />
            </div>
          ) : data ? (
            <div className="space-y-8 p-6">
              <section className="space-y-4">
                <h3 className="text-lg font-semibold">Resumo</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FieldItem label="ID do contrato" value={data.id} />
                  <FieldItem
                    label="Data de início"
                    value={formatDate(data.startDate)}
                  />
                  <FieldItem
                    label="Data de vencimento"
                    value={formatDate(data.endDate)}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Status</p>
                  <StatusBadge status={data.status} />
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <h3 className="text-lg font-semibold">Locatário e Imóvel</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldItem label="Locatário" value={data.tenantName} />
                  <FieldItem
                    label="2º proponente"
                    value={data.secondProposerName || '-'}
                  />
                  <FieldItem label="Imóvel" value={data.property} />
                  <FieldItem
                    label="Endereço do imóvel"
                    value={data.propertyAddress}
                  />
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <h3 className="text-lg font-semibold">Dados do Locador</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldItem label="Nome completo" value={data.renterName} />
                  <FieldItem label="CPF/CNPJ" value={data.renterCpf} />
                  <FieldItem label="Telefone" value={data.renterPhone} />
                  <FieldItem label="Email" value={data.renterEmail} />
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <h3 className="text-lg font-semibold">Valores e Encargos</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FieldItem
                    label="Valor do aluguel"
                    value={formatMoney(data.rentValue)}
                  />
                  <FieldItem
                    label="Taxa de condomínio"
                    value={formatMoney(data.condoFee)}
                  />
                  <FieldItem label="IPTU" value={formatMoney(data.iptuValue)} />
                  <FieldItem label="TCR" value={formatMoney(data.tcrValue)} />
                </div>
              </section>

              <Separator />

              <section className="space-y-2">
                <h3 className="text-lg font-semibold">Informações Adicionais</h3>
                <p className="text-muted-foreground text-sm">
                  {data.additionalInfo || 'Sem observações adicionais.'}
                </p>
              </section>
            </div>
          ) : (
            <div className="p-10 text-center text-slate-500">
              Não foi possível carregar os dados.
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
