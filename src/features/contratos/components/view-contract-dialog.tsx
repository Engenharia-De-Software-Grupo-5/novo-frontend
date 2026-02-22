'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/features/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/features/components/ui/dialog';
import { FileText, Loader2 } from 'lucide-react';

import { ContratoDetail } from '@/types/contrato';

import { getContratoById } from '../services/contratoService';

interface ViewContractDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly contractId: string;
  readonly condId: string;
}

const formatDate = (value: string) => {
  if (!value) return '-';
  return new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR');
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

    void loadData();
  }, [open, condId, contractId]);

  let dialogContent;
  if (isLoading) {
    dialogContent = (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    );
  } else if (data) {
    dialogContent = (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">Imóvel</p>
          <p className="text-muted-foreground text-sm">{data.property}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Locatário</p>
          <p className="text-muted-foreground text-sm">{data.tenantName}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Data de criação</p>
            <p className="text-muted-foreground text-sm">
              {formatDate(data.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Data de vencimento</p>
            <p className="text-muted-foreground text-sm">
              {formatDate(data.dueDate)}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Arquivo PDF</p>
          <Button variant="outline" size="sm" className="mt-2" asChild>
            <a href={data.pdfFileUrl} target="_blank" rel="noreferrer">
              <FileText className="mr-2 h-4 w-4" />
              {data.pdfFileName}
            </a>
          </Button>
        </div>
      </div>
    );
  } else {
    dialogContent = (
      <p className="text-muted-foreground py-8 text-center text-sm">
        Não foi possível carregar o contrato.
      </p>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Visualizar Contrato</DialogTitle>
          <DialogDescription>
            Exibição resumida dos dados essenciais do contrato.
          </DialogDescription>
        </DialogHeader>

        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}
