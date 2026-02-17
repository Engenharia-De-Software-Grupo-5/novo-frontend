import Link from "next/link";
import { ArrowLeft, Pencil, MapPin, User } from "lucide-react";
import { Button } from "@/features/components/ui/button";
import { Badge } from "@/features/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/components/ui/card";
import { DeleteImovelButton } from "@/features/components/imoveis/delete-imovel-button";

import { mockImoveis } from "@/mocks/imoveis";

export default async function DetalhesImovelPage({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = await params;

  const imovel = mockImoveis.find(item => item.idImovel === id);

  if (!imovel) {
    return (
      <div className="container mx-auto p-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Imóvel não encontrado</h1>
        <p className="text-muted-foreground">O código {id} não consta na nossa base de dados.</p>
        <Button asChild><Link href="/imoveis">Voltar para a lista</Link></Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
        case 'ativo': return "bg-primary/10 text-primary border-primary/20";
        case 'manutenção': return "bg-destructive/10 text-destructive border-destructive/20";
        case 'na planta': return "bg-amber-100 text-amber-700 border-amber-200";
        default: return "bg-secondary text-secondary-foreground border-border";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-8">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="border-border hover:bg-accent" asChild>
                <Link href="/imoveis"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground">
                        {imovel.endereco.nomePredio || imovel.tipo.toUpperCase()} {imovel.idImovel}
                    </h1>
                    <Badge variant="outline" className={getStatusColor(imovel.situacao)}>
                        {imovel.situacao.toUpperCase()}
                    </Badge>
                </div>
                <p className="text-muted-foreground flex items-center mt-1 text-sm">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground/70" />
                    {imovel.endereco.rua}, {imovel.endereco.numero} - {imovel.endereco.bairro}
                </p>
            </div>
        </div>

        <div className="flex gap-3">
            <DeleteImovelButton id={imovel.idImovel} />
            <Button asChild>
                <Link href={`/imoveis/${imovel.idImovel}/editar`}>
                    <Pencil className="mr-2 h-4 w-4" /> Editar
                </Link>
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
             
             <Card className="bg-card border-border">
                <CardHeader><CardTitle className="text-base text-foreground">Informações do Imóvel</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                        <span className="block text-muted-foreground">Tipo</span>
                        <span className="font-medium text-foreground capitalize">{imovel.tipo}</span>
                    </div>
                    <div>
                        <span className="block text-muted-foreground">Área Total</span>
                        <span className="font-medium text-foreground">{imovel.estrutura.area} m²</span>
                    </div>
                    <div>
                        <span className="block text-muted-foreground">Quartos / Suítes</span>
                        <span className="font-medium text-foreground">{imovel.estrutura.numQuartos} / {imovel.estrutura.numSuites}</span>
                    </div>
                    <div>
                        <span className="block text-muted-foreground">Banheiros</span>
                        <span className="font-medium text-foreground">{imovel.estrutura.numBanheiros}</span>
                    </div>
                </CardContent>
             </Card>

             <Card className="bg-card border-border">
                <CardHeader><CardTitle className="text-base text-foreground">Endereço Completo</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p><span className="text-muted-foreground">Rua:</span> <span className="text-foreground">{imovel.endereco.rua}, {imovel.endereco.numero}</span></p>
                    {imovel.endereco.nomePredio && (
                        <p><span className="text-muted-foreground">Edifício:</span> <span className="text-foreground">{imovel.endereco.nomePredio}</span></p>
                    )}
                    <p><span className="text-muted-foreground">Bairro:</span> <span className="text-foreground">{imovel.endereco.bairro}</span></p>
                    <p><span className="text-muted-foreground">Cidade/UF:</span> <span className="text-foreground">{imovel.endereco.cidade} - {imovel.endereco.estado}</span></p>
                </CardContent>
             </Card>
          </div>

          <div className="space-y-6">
             <Card className="bg-muted/30 border-border shadow-sm">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center text-foreground">
                        <User className="h-4 w-4 mr-2 text-muted-foreground/70" /> Outras Informações
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="text-sm space-y-2">
                        {imovel.outros.map((item, index) => (
                            <li key={index} className="flex items-center gap-2 text-foreground/80">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </CardContent>
             </Card>
          </div>
      </div>
    </div>
  );
}