import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/features/components/ui/dialog';
import { Separator } from '@/features/components/ui/separator';
import { ScrollArea } from '@/features/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { CondominoFull } from '@/types/condomino';
import { PersonalInfoSection } from './PersonalInfoSection';
import { FinanceSection } from './FinanceSection';
import { DocumentSection } from './DocumentSection';
import { useEffect, useState } from 'react';
import { getCondominoById } from '../../services/condominos.service';
import { AdditionalResidentsSection } from './AdditionalResidentsSection';
import { EmergencyContactsSection } from './EmergencyContacts';

interface ViewCondominoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  condominoId: string;
  condominioId: string;
}

export function ViewCondominoDialog({
  open,
  onOpenChange,
  condominoId,
  condominioId,
}: ViewCondominoDialogProps) {
  const [data, setData] = useState<CondominoFull | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Só busca se o dialog estiver ABERTO e tiver ID
    if (open && condominoId) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const result = await getCondominoById(condominioId, condominoId);
          setData(result);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [open, condominoId, condominioId]);

  const formatCurrency = (val?: number) =>
    val
      ? new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(val)
      : '—';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] flex-col overflow-hidden p-0 sm:max-w-187.5">
        <DialogHeader className="shrink-0 border-b bg-slate-50/50 p-6">
          <DialogTitle className="text-2xl font-bold">
            {isLoading
              ? 'Carregando...'
              : data?.name || 'Detalhes do Condômino'}
          </DialogTitle>
          <DialogDescription>
            {isLoading
              ? 'Buscando dados no servidor...'
              : `Visualizando informações de ${data?.name}`}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <Loader2 className="text-primary/60 h-10 w-10 animate-spin" />
            </div>
          ) : data ? (
            <div className="space-y-8 p-6">
              <PersonalInfoSection
                data={data}
                formatCurrency={formatCurrency}
              />

              <Separator />

              <FinanceSection data={data} formatCurrency={formatCurrency} />

              <AdditionalResidentsSection
                residents={data.additionalResidents}
              />

              <EmergencyContactsSection contacts={data.emergencyContacts} />

              <Separator />

              <DocumentSection data={data} />
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
