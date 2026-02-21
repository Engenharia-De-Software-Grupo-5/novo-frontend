'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/features/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/features/components/ui/dialog';
import { Skeleton } from '@/features/components/ui/skeleton';
import { Download, FileText } from 'lucide-react';

import { DespesaDetail } from '@/types/despesa';

import { DESPESA_TIPOS, FORMA_PAGAMENTO } from '../constants';
import { despesaService } from '../services/despesaService';

interface ViewDespesaDialogProps {
  condId: string;
  despesaId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewDespesaDialog({
  condId,
  despesaId,
  open,
  onOpenChange,
}: ViewDespesaDialogProps) {
  const [despesa, setDespesa] = useState<DespesaDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && despesaId) {
      const fetchDespesa = async () => {
        setLoading(true);
        try {
          const data = await despesaService.getById(condId, despesaId);
          setDespesa(data);
        } catch (error) {
          console.error('Erro ao buscar detalhes da despesa:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDespesa();
    } else {
      setDespesa(null);
    }
  }, [open, despesaId, condId]);

  const getLabel = (lista: { value: string; label: string }[], value: string) =>
    lista.find((item) => item.value === value)?.label || value;

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const formatarData = (dataString: string) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Despesa</DialogTitle>
          <DialogDescription>
            Visualizando informações completas e comprovantes.
          </DialogDescription>
        </DialogHeader>

        {loading || !despesa ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{despesa.nome}</h3>
                <p className="text-muted-foreground text-sm">
                  ID: {despesa.id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">
                  Valor:
                </span>
                <p className="text-base font-semibold">
                  {formatarMoeda(despesa.valor)}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Data:</span>
                <p>{formatarData(despesa.data)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Tipo:</span>
                <p>{getLabel(DESPESA_TIPOS, despesa.tipo)}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">
                  Pagamento:
                </span>
                <p>{getLabel(FORMA_PAGAMENTO, despesa.formaPagamento)}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <span className="text-muted-foreground font-medium">
                  Vínculo:
                </span>
                <div>
                  {despesa.idImovel ? (
                    <span className="font-medium">
                      Imóvel {despesa.idImovel}
                    </span>
                  ) : (
                    <Badge variant="secondary" className="text-xs font-normal">
                      Despesa do condomínio
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <span className="text-muted-foreground text-sm font-medium">
                Comprovantes / Anexos
              </span>
              {despesa.anexos && despesa.anexos.length > 0 ? (
                <ul className="space-y-2">
                  {despesa.anexos.map((anexo) => (
                    <li
                      key={anexo.id}
                      className="bg-muted/50 flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
                        <span className="truncate text-sm">{anexo.name}</span>
                      </div>
                      <a
                        href={anexo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:bg-primary/10 rounded-md p-2 transition-colors"
                        title="Baixar anexo"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  Nenhum anexo vinculado a esta despesa.
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
