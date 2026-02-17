'use client';

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/features/components/ui/button";
import { ImovelForm } from "@/features/components/imoveis/imovel-form"; 

export default function EditarImovelPage({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = use(params); 
  const router = useRouter(); 

  const [formData, setFormData] = useState({
    identificacao: "Apto 302 - Edifício Solar",
    status: "ocupado",
    tipo: "apartamento",
    situacao: "ativo",
    endereco: {
        logradouro: "Rua das Flores",
        numero: "123",
        complemento: "Bloco A",
        bairro: "Centro",
        cidade: "Campina Grande",
        cep: "58400-000"
    },
    locatario: {
        logradouro: "Rua das Flores",
        numero: "123",
        complemento: "",
        bairro: "Centro",
        cidade: "Campina Grande",
        cep: "58400-000"
    }
  });

  const handleSave = () => {    
    router.push(`/imoveis/${id}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl pb-20">
        <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" className="border-border hover:bg-accent" asChild>
                <Link href={`/imoveis/${id}`}><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-foreground">Editar Imóvel</h1>
                <p className="text-muted-foreground">Atualize as informações da unidade.</p>
            </div>
        </div>

        <div className="space-y-6">
            <ImovelForm formData={formData} setFormData={setFormData} />
            
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" className="border-border hover:bg-accent" asChild>
                    <Link href={`/imoveis/${id}`}>Cancelar</Link>
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[150px]" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                </Button>
            </div>
        </div>
    </div>
  );
}