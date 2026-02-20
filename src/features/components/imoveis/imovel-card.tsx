import { MapPin, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/features/components/ui/card";
import { Badge } from "@/features/components/ui/badge";
import Link from "next/link";
import { Imovel } from "@/types/imoveis";

interface ImovelCardProps {
  data: Imovel;
}

export function ImovelCard({ data }: ImovelCardProps) {
  
  const getStatusConfig = (status: string) => {
    const s = (status || "inativo").toLowerCase();
    switch (s) {
      case "ativo": 
        return { label: "Ativo", icon: CheckCircle2, className: "bg-primary/10 text-primary border-primary/20" };
      case "inativo": 
        return { label: "Inativo", icon: AlertCircle, className: "bg-muted text-muted-foreground border-border" };
      case "manutenção": 
        return { label: "Manutenção", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" };
      case "na planta":
        return { label: "Na Planta", icon: Clock, className: "bg-amber-100 text-amber-700 border-amber-200" };
      default: 
        return { label: status || "Pendente", icon: AlertCircle, className: "bg-secondary text-secondary-foreground" };
    }
  };

  const statusConfig = getStatusConfig(data?.situacao);
  const StatusIcon = statusConfig.icon;

  const tipoFormatado = data?.tipo 
    ? data.tipo.charAt(0).toUpperCase() + data.tipo.slice(1) 
    : "Novo Imóvel";

  const tituloImovel = data?.endereco?.nomePredio 
    ? `${data.endereco.nomePredio} - ${data.endereco.numero || ''}`
    : `${tipoFormatado} ${data?.idImovel || ''}`;

  return (
    <Link href={`/imoveis/${data?.idImovel || '#'}`} className="block group h-full">
      <Card className="h-full border border-border shadow-none hover:shadow-md transition-all duration-200 bg-card text-card-foreground rounded-xl flex flex-col pb-6">
        
        <div className="h-48 bg-muted w-full relative overflow-hidden rounded-t-xl border-b border-border/50">
        </div>

        <CardContent className="p-4 flex flex-col gap-6 pt-6 flex-1">
          
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-foreground text-base line-clamp-2">
                {tituloImovel}
            </h3>
            <Badge variant="outline" className={`font-medium shadow-none gap-1.5 px-2 py-0.5 shrink-0 ${statusConfig.className}`}>
                <StatusIcon className="h-3.5 w-3.5" />
                {statusConfig.label}
            </Badge>
          </div>

          <div className="space-y-3 mt-auto">
              <div className="flex items-start text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-muted-foreground/70" />
                <span className="line-clamp-2 leading-relaxed">
                    {data?.endereco?.rua || 'Endereço não informado'}
                    {data?.endereco?.numero ? `, ${data.endereco.numero}` : ''} 
                    {data?.endereco?.bairro ? ` - ${data.endereco.bairro}` : ''}
                </span>
              </div>

              <div className="flex flex-col pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Código</span>
                  <span className="text-sm font-medium">{data?.idImovel || '-'}</span>
              </div>
          </div>

        </CardContent>
      </Card>
    </Link>
  );
}
