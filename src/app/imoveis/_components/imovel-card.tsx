import { MapPin, User } from "lucide-react";
import { Card, CardContent } from "@/features/components/ui/card";
import Link from "next/link";

interface ImovelCardProps {
  data: {
    id: string;
    identificacao: string;
    endereco: string;
    status: "vago" | "ocupado" | "manutencao" | "na planta";
    locatario?: string;
  };
}

export function ImovelCard({ data }: ImovelCardProps) {
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ocupado": 
        return { label: "Alugado", color: "text-blue-600" };
      case "vago": 
        return { label: "Vago", color: "text-gray-500" };
      case "manutencao": 
        return { label: "Manutenção", color: "text-gray-500" };
      default: 
        return { label: "Link", color: "text-blue-600 cursor-pointer" };
    }
  };

  const statusConfig = getStatusConfig(data.status);

  return (
    <Link href={`/imoveis/${data.id}`} className="block group h-full">
      <Card className="h-full border border-gray-100 shadow-none hover:shadow-md transition-all duration-200 bg-white rounded-xl flex flex-col pb-6">
        
        <div className="h-48 bg-gray-100 w-full relative overflow-hidden rounded-t-xl border-b border-gray-50">
        </div>

        <CardContent className="p-4 flex flex-col gap-6 pt-6">
          
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900 text-base">
                {data.identificacao}
            </h3>
            <span className={`text-sm font-medium ${statusConfig.color}`}>
                {statusConfig.label}
            </span>
          </div>

          <div className="space-y-3">
              <div className="flex items-start text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
                <span className="line-clamp-2 leading-relaxed">{data.endereco}</span>
              </div>

              <div className="flex items-center text-sm text-gray-500 h-5">
                {data.locatario ? (
                    <>
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate">{data.locatario}</span>
                    </>
                ) : (
                    <span className="block h-full w-full"></span> 
                )}
              </div>
          </div>

        </CardContent>
      </Card>
    </Link>
  );
}