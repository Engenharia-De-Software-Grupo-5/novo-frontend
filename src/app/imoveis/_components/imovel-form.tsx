import { Upload } from "lucide-react";
import { Input } from "@/features/components/ui/input";
import { Label } from "@/features/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/components/ui/select";

interface ImovelFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function ImovelForm({ formData, setFormData }: ImovelFormProps) {
  
  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      
      <Card>
        <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Informações Básicas</CardTitle>
            <p className="text-sm text-muted-foreground">Informações para identificação interna</p>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="identificacao">Identificação do Imóvel *</Label>
                    <Input 
                        id="identificacao"
                        placeholder="Ex: Apto 302" 
                        value={formData.identificacao}
                        onChange={(e) => handleChange('identificacao', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Status *</Label>
                    <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
                        <SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="vago">Vago</SelectItem>
                            <SelectItem value="ocupado">Ocupado</SelectItem>
                            <SelectItem value="manutencao">Em Manutenção</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Foto do Imóvel</Label>
                <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground mb-3" />
                    <p className="text-sm text-gray-600 font-medium">Clique para fazer upload da foto</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG até 5MB</p>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Endereço</CardTitle>
            <p className="text-sm text-muted-foreground">Informações para localização</p>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 space-y-2">
                    <Label>Logradouro *</Label>
                    <Input 
                        placeholder="Ex: Rua das Palmeiras" 
                        value={formData.endereco?.logradouro}
                        onChange={(e) => handleNestedChange('endereco', 'logradouro', e.target.value)}
                    />
                </div>
                <div className="col-span-1 space-y-2">
                    <Label>Número *</Label>
                    <Input 
                        placeholder="120" 
                        value={formData.endereco?.numero}
                        onChange={(e) => handleNestedChange('endereco', 'numero', e.target.value)}
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Complemento</Label>
                    <Input 
                        placeholder="Ex: Bloco B, Apto 302" 
                        value={formData.endereco?.complemento}
                        onChange={(e) => handleNestedChange('endereco', 'complemento', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Bairro *</Label>
                    <Input 
                        placeholder="Ex: Centro" 
                        value={formData.endereco?.bairro}
                        onChange={(e) => handleNestedChange('endereco', 'bairro', e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Cidade *</Label>
                    <Input 
                        placeholder="Ex: Campina Grande" 
                        value={formData.endereco?.cidade}
                        onChange={(e) => handleNestedChange('endereco', 'cidade', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>CEP *</Label>
                    <Input 
                        placeholder="00000-000" 
                        value={formData.endereco?.cep}
                        onChange={(e) => handleNestedChange('endereco', 'cep', e.target.value)}
                    />
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Dados do Locatário</CardTitle>
            <p className="text-sm text-muted-foreground">Informações contratuais</p>
        </CardHeader>
        <CardContent className="space-y-4">
             {/* Linha 1: Logradouro e Número */}
             <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 space-y-2">
                    <Label>Logradouro *</Label>
                    <Input 
                        placeholder="Ex: Rua das Palmeiras" 
                        value={formData.locatario?.logradouro}
                        onChange={(e) => handleNestedChange('locatario', 'logradouro', e.target.value)}
                    />
                </div>
                <div className="col-span-1 space-y-2">
                    <Label>Número *</Label>
                    <Input 
                        placeholder="120" 
                        value={formData.locatario?.numero}
                        onChange={(e) => handleNestedChange('locatario', 'numero', e.target.value)}
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Complemento</Label>
                    <Input 
                        placeholder="Ex: Bloco B, Apto 302" 
                        value={formData.locatario?.complemento}
                        onChange={(e) => handleNestedChange('locatario', 'complemento', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Bairro *</Label>
                    <Input 
                        placeholder="Ex: Centro" 
                        value={formData.locatario?.bairro}
                        onChange={(e) => handleNestedChange('locatario', 'bairro', e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Cidade *</Label>
                    <Input 
                        placeholder="Ex: Campina Grande" 
                        value={formData.locatario?.cidade}
                        onChange={(e) => handleNestedChange('locatario', 'cidade', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>CEP *</Label>
                    <Input 
                        placeholder="00000-000" 
                        value={formData.locatario?.cep}
                        onChange={(e) => handleNestedChange('locatario', 'cep', e.target.value)}
                    />
                </div>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}