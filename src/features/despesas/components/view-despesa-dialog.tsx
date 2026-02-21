'use client';

import { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/features/components/ui/dialog";
import { Badge } from "@/features/components/ui/badge";
import { Skeleton } from "@/features/components/ui/skeleton";

import { despesaService } from "../services/despesaService";
import { DespesaDetail } from "@/types/despesa";
import { DESPESA_STATUS, DESPESA_TIPOS, FORMA_PAGAMENTO } from "../constants";

interface ViewDespesaDialogProps {
  condId: string;
  despesaId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewDespesaDialog({ condId, despesaId, open, onOpenChange }: ViewDespesaDialogProps) {
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
          console.error("Erro ao buscar detalhes da despesa:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDespesa();
    } else {
      setDespesa(null);
    }
  }, [open, despesaId, condId]);

  const getLabel = (lista: any[], value: string) => lista.find(item => item.value === value)?.label || value;
  
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
  };

  const formatarData = (dataString: string) => {
    if (!dataString) return "";
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
          <div className="space-y-6 mt-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{despesa.nome}</h3>
                <p className="text-sm text-muted-foreground">
                  ID: {despesa.id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium">Valor:</span>
                <p className="text-base font-semibold">{formatarMoeda(despesa.valor)}</p>
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
                <span className="text-muted-foreground font-medium">Pagamento:</span>
                <p>{getLabel(FORMA_PAGAMENTO, despesa.formaPagamento)}</p>
              </div>
              <div className="col-span-2 space-y-1">
                <span className="text-muted-foreground font-medium">Vínculo:</span>
                <div>
                  {despesa.idImovel ? (
                    <span className="font-medium">Imóvel {despesa.idImovel}</span>
                  ) : (
                    <Badge variant="secondary" className="font-normal text-xs">Despesa do condomínio</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <span className="text-sm font-medium text-muted-foreground">Comprovantes / Anexos</span>
              {despesa.anexos && despesa.anexos.length > 0 ? (
                <ul className="space-y-2">
                  {despesa.anexos.map((anexo) => (
                    <li key={anexo.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm truncate">{anexo.name}</span>
                      </div>
                      <a 
                        href={anexo.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary hover:bg-primary/10 p-2 rounded-md transition-colors"
                        title="Baixar anexo"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">Nenhum anexo vinculado a esta despesa.</p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}