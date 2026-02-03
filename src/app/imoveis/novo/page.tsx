'use client';

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/features/components/ui/button";
import { ImovelForm } from "../_components/imovel-form";
import { ImovelCard } from "../_components/imovel-card";

export default function NovoImovelPage() {
  
  const [formData, setFormData] = useState({
    identificacao: "",
    status: "", 
    endereco: {
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        cep: ""
    },

    locatario: {
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        cep: ""
    }
  });

  const handleSubmit = () => {
    console.log("Enviando dados:", formData);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl pb-20">
        <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" asChild>
                <Link href="/imoveis"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Adicionar Novo Imóvel</h1>
                <p className="text-muted-foreground">Preencha as informações para cadastrar um novo imóvel</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <div className="lg:col-span-2 space-y-6">
                <ImovelForm formData={formData} setFormData={setFormData} />
                
                <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1" asChild>
                        <Link href="/imoveis">Cancelar</Link>
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
                        <Save className="w-4 h-4 mr-2" /> Salvar Imóvel
                    </Button>
                </div>
            </div>

            <div className="lg:col-span-1 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                     <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Pré-visualização
                    </h3>
                </div>
                
                <div className="pointer-events-none opacity-100">
                    <ImovelCard 
                        data={{
                            id: "preview",
                            identificacao: formData.identificacao || "Identificação do Imóvel",
                            
                            endereco: formData.endereco.logradouro 
                                ? `${formData.endereco.logradouro}, ${formData.endereco.numero} - ${formData.endereco.bairro}`
                                : "Endereço do imóvel...",
                                
                            status: (formData.status as any) || "vago",
                            locatario: formData.status === 'ocupado' ? "Locatário (Dados Cadastrais)" : undefined
                        }} 
                    />
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                    <p className="font-semibold mb-1">Dica:</p>
                    <p className="opacity-90">Preencha os campos obrigatórios (*) marcados no formulário.</p>
                </div>
            </div>
        </div>
    </div>
  );
}