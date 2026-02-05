import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, MapPin, User, Building2, Calendar } from "lucide-react";
import { Button } from "@/features/components/ui/button";
import { Badge } from "@/features/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/components/ui/card";
import { DeleteImovelButton } from "../_components/delete-imovel-button";

export default function DetalhesImovelPage({ params }: { params: { id: string } }) {

  const imovel = {
    id: params.id,
    identificacao: "Apto 302 - Edifício Solar",
    status: "ocupado",
    tipo: "Apartamento",
    estrutura: { area: "85", quartos: "3", suites: "1", banheiros: "2" },
    endereco: {
        rua: "Rua das Flores", numero: "123", bairro: "Centro", 
        cidade: "Campina Grande", estado: "PB", cep: "58400-000",
        complemento: "Bloco A"
    },
    locatario: {
        nome: "João da Silva",
        logradouro: "Rua das Flores", numero: "123", bairro: "Centro"
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'ocupado': return "bg-blue-100 text-blue-700 hover:bg-blue-100";
        case 'vago': return "bg-green-100 text-green-700 hover:bg-green-100";
        default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-8">
      
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/imoveis"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{imovel.identificacao}</h1>
                    <Badge className={getStatusColor(imovel.status)}>{imovel.status.toUpperCase()}</Badge>
                </div>
                <p className="text-gray-500 flex items-center mt-1 text-sm">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {imovel.endereco.rua}, {imovel.endereco.numero} - {imovel.endereco.bairro}
                </p>
            </div>
        </div>

        <div className="flex gap-3">
            {/* Botão de Excluir*/}
            <DeleteImovelButton id={imovel.id} />
            
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href={`/imoveis/${imovel.id}/editar`}>
                    <Pencil className="mr-2 h-4 w-4" /> Editar
                </Link>
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Coluna Principal */}
          <div className="md:col-span-2 space-y-6">
             
             {/* Card Dados Gerais */}
             <Card>
                <CardHeader><CardTitle className="text-base">Informações do Imóvel</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                        <span className="block text-gray-500">Tipo</span>
                        <span className="font-medium">{imovel.tipo}</span>
                    </div>
                    <div>
                        <span className="block text-gray-500">Área Total</span>
                        <span className="font-medium">{imovel.estrutura.area} m²</span>
                    </div>
                    <div>
                        <span className="block text-gray-500">Quartos</span>
                        <span className="font-medium">{imovel.estrutura.quartos}</span>
                    </div>
                    <div>
                        <span className="block text-gray-500">Banheiros</span>
                        <span className="font-medium">{imovel.estrutura.banheiros}</span>
                    </div>
                </CardContent>
             </Card>

             {/* Card Endereço */}
             <Card>
                <CardHeader><CardTitle className="text-base">Endereço Completo</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p><span className="text-gray-500">Logradouro:</span> {imovel.endereco.rua}, {imovel.endereco.numero}</p>
                    <p><span className="text-gray-500">Complemento:</span> {imovel.endereco.complemento}</p>
                    <p><span className="text-gray-500">Bairro:</span> {imovel.endereco.bairro}</p>
                    <p><span className="text-gray-500">Cidade/UF:</span> {imovel.endereco.cidade} - {imovel.endereco.estado}</p>
                    <p><span className="text-gray-500">CEP:</span> {imovel.endereco.cep}</p>
                </CardContent>
             </Card>
          </div>

          <div className="space-y-6">
             <Card className="bg-gray-50 border-gray-200">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center">
                        <User className="h-4 w-4 mr-2" /> Locatário Atual
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {imovel.status === 'ocupado' ? (
                        <div className="text-sm">
                            <p className="font-bold text-gray-900 mb-1">{imovel.locatario.nome}</p>
                            <p className="text-gray-500 text-xs">Endereço cadastral:</p>
                            <p className="text-gray-600 truncate">{imovel.locatario.logradouro}, {imovel.locatario.numero}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Nenhum locatário vinculado.</p>
                    )}
                </CardContent>
             </Card>
          </div>
      </div>
    </div>
  );
}