import { MoreVertical, GripVertical, Eye, Pencil, Trash2, CheckCircle2, XCircle, AlertCircle, Home } from "lucide-react";
import { Button } from "@/features/components/ui/button";
import { Badge } from "@/features/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/features/components/ui/dropdown-menu";
import Link from "next/link";

interface ImovelTableProps {
  data: any[];
}

export function ImoveisTable({ data }: ImovelTableProps) {
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "ocupado": 
        return { 
            label: "Alugado", 
            icon: CheckCircle2,
            className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" 
        };
      case "vago": 
        return { 
            label: "Vago", 
            icon: AlertCircle, 
            className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
        };
      case "manutencao": 
        return { 
            label: "Manutenção", 
            icon: XCircle,
            className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" 
        };
      default: 
        return { 
            label: status, 
            icon: AlertCircle,
            className: "bg-gray-100 text-gray-700 border-gray-200" 
        };
    }
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow className="hover:bg-transparent border-gray-100">
            <TableHead className="w-[40px]"></TableHead>
            
            <TableHead className="text-gray-900 font-semibold py-3 text-sm">Nome</TableHead>
            <TableHead className="text-gray-900 font-semibold py-3 text-sm">Localização</TableHead>
            <TableHead className="text-gray-900 font-semibold py-3 text-sm">Status</TableHead>
            <TableHead className="text-gray-900 font-semibold py-3 text-sm">Locatário</TableHead>
            
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((imovel) => {
             const statusConfig = getStatusConfig(imovel.status);
             const StatusIcon = statusConfig.icon;
             
             return (
              <TableRow key={imovel.id} className="hover:bg-gray-50/50 border-gray-100 group">
                <TableCell className="py-3 pl-4">
                    <GripVertical className="h-4 w-4 text-gray-300 cursor-move" />
                </TableCell>

                <TableCell className="font-medium text-gray-900 py-3 text-sm">
                  {imovel.identificacao}
                </TableCell>
                
                <TableCell className="py-3">
                   <div className="inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 max-w-[200px] truncate">
                     {imovel.endereco}
                   </div>
                </TableCell>
                
                <TableCell className="py-3">
                   <Badge variant="outline" className={`font-medium shadow-none gap-1.5 px-2 py-0.5 ${statusConfig.className}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusConfig.label}
                   </Badge>
                </TableCell>

                <TableCell className="py-3 text-sm text-gray-600">
                  {imovel.locatario ? (
                      <span className="font-medium">{imovel.locatario}</span>
                  ) : (
                      <span className="text-gray-400 italic font-light">-</span>
                  )}
                </TableCell>

                <TableCell className="text-right py-3 pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                          <Link href={`/imoveis/${imovel.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                          </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
             );
          })}
        </TableBody>
      </Table>
    </div>
  );
}