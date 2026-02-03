import Link from "next/link";
import { LayoutGrid, List, Plus, Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

import { Button } from "@/features/components/ui/button";
import { Input } from "@/features/components/ui/input";
import { ImovelCard } from "./_components/imovel-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/components/ui/select";

const imoveisMock = [
  { id: "1", identificacao: "Apto 332", endereco: "Rua das Flores, 123, Bloco A", status: "ocupado", locatario: "José Roberto Junior" },
  { id: "2", identificacao: "Apto 333", endereco: "Rua das Flores, 123, Bloco A", status: "vago" },
  { id: "3", identificacao: "Apto 401", endereco: "Rua das Flores, 123, Bloco B", status: "manutencao", locatario: "José Roberto Junior" },
  { id: "4", identificacao: "Apto 402", endereco: "Rua das Flores, 123, Bloco B", status: "ocupado", locatario: "José Roberto Junior" },
  { id: "5", identificacao: "Apto 402", endereco: "Rua das Flores, 123, Bloco C", status: "ocupado", locatario: "José Roberto Junior" },
  { id: "6", identificacao: "Apto 402", endereco: "Rua das Flores, 123, Bloco D", status: "ocupado", locatario: "José Roberto Junior" },
  { id: "7", identificacao: "Apto 402", endereco: "Rua das Flores, 123, Bloco E", status: "ocupado", locatario: "José Roberto Junior" },
  { id: "8", identificacao: "Apto 402", endereco: "Rua das Flores, 123, Bloco F", status: "ocupado", locatario: "José Roberto Junior" },
] as const;

export default function ImoveisPage() {
  return (
    <div className="container mx-auto p-8 space-y-8 max-w-[1600px]">
      
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Gerencie os imóveis do sistema
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl">
            Centralize a gestão dos imóveis do sistema, com controle de status, gerenciamento de documentos, informações detalhadas e cadastro de novas unidades
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        <div className="flex flex-1 gap-3 w-full md:w-auto">
            <div className="relative w-full max-w-xs">
                <Input 
                    placeholder="Filtrar imóveis..." 
                    className="bg-white border-gray-200 h-10 w-full" 
                />
            </div>
            
            <Button variant="outline" className="rounded-full border-gray-200 text-gray-600 h-10 px-4 hover:bg-gray-50 font-normal">
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Tipo
            </Button>
            <Button variant="outline" className="rounded-full border-gray-200 text-gray-600 h-10 px-4 hover:bg-gray-50 font-normal">
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Status
            </Button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
             <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 h-10">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white shadow-sm rounded-md text-gray-900">
                    <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900" asChild>
                    <Link href="/imoveis/table">
                        <List className="h-4 w-4" />
                    </Link>
                </Button>
             </div>

             <Button className="bg-blue-600 hover:bg-blue-700 h-10 px-6 font-medium" asChild>
                <Link href="/imoveis/novo">
                    Adicionar Imóvel
                </Link>
             </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
        {imoveisMock.map((imovel) => (
            <ImovelCard key={imovel.id} data={imovel as any} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-6 text-sm text-gray-500">
        
        <div>itens de 0 a {imoveisMock.length} exibidos</div>
        
        <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">Cards por página</span>
                <Select defaultValue="8">
                    <SelectTrigger className="w-[70px] h-8">
                        <SelectValue placeholder="8" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="16">16</SelectItem>
                        <SelectItem value="32">32</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium">Pagina 1 de 7</span>
                <div className="flex gap-1 ml-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 border-gray-200" disabled>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 border-gray-200">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}