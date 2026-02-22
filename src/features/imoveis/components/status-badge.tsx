import { Badge } from '@/features/components/ui/badge';
import { ImovelSituacao } from '@/types/imoveis';

interface StatusBadgeProps {
  readonly status: ImovelSituacao;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'ativo') {
    return (
      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
        Ativo
      </Badge>
    );
  }

  if (status === 'manutenção') {
    return (
      <Badge
        variant="outline"
        className="bg-destructive/10 text-destructive border-destructive/20"
      >
        Manutenção
      </Badge>
    );
  }

  if (status === 'na planta') {
    return (
      <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
        Na Planta
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
      Inativo
    </Badge>
  );
}
