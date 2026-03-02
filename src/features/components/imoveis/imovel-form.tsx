'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/features/components/ui/card';
import { Input } from '@/features/components/ui/input';
import { Label } from '@/features/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/components/ui/select';

export interface ImovelFormData {
  nome: string;
  status: string;
  tipo?: 'casa' | 'apartamento';
  endereco?: {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    cep?: string;
  };
}

export interface ImovelFormErrors {
  nome?: string;
  status?: string;
  tipo?: string;
  endereco?: {
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
  };
}

interface ImovelFormProps {
  readonly formData: ImovelFormData;
  readonly setFormData: React.Dispatch<React.SetStateAction<ImovelFormData>>;
  readonly errors?: ImovelFormErrors;
}

export function ImovelForm({ formData, setFormData, errors }: ImovelFormProps) {
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (
    parent: 'endereco',
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-foreground text-base font-semibold">
            Informações Básicas
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Informações para identificação interna
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Interno do Imóvel *</Label>
              <Input
                id="nome"
                placeholder="Ex: Apartamento 302 - Bloco A"
                value={formData.nome || ''}
                onChange={(e) => handleChange('nome', e.target.value)}
                className="bg-background border-border"
              />
              {errors?.nome && (
                <p className="text-destructive text-sm">{errors.nome}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => handleChange('status', val)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vago">Vago</SelectItem>
                  <SelectItem value="ocupado">Ocupado</SelectItem>
                  <SelectItem value="manutencao">Em Manutenção</SelectItem>
                  <SelectItem value="na planta">Na Planta</SelectItem>
                </SelectContent>
              </Select>
              {errors?.status && (
                <p className="text-destructive text-sm">{errors.status}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-foreground text-base font-semibold">
            Endereço
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Informações para localização
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2 md:col-span-3">
              <Label>Logradouro *</Label>
              <Input
                placeholder="Ex: Rua das Palmeiras"
                value={formData.endereco?.logradouro || ''}
                onChange={(e) =>
                  handleNestedChange('endereco', 'logradouro', e.target.value)
                }
                className="bg-background border-border"
              />
              {errors?.endereco?.logradouro && (
                <p className="text-destructive text-sm">
                  {errors.endereco.logradouro}
                </p>
              )}
            </div>
            <div className="space-y-2 md:col-span-1">
              <Label>Número *</Label>
              <Input
                placeholder="120"
                value={formData.endereco?.numero || ''}
                onChange={(e) =>
                  handleNestedChange('endereco', 'numero', e.target.value)
                }
                className="bg-background border-border"
              />
              {errors?.endereco?.numero && (
                <p className="text-destructive text-sm">
                  {errors.endereco.numero}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Complemento</Label>
              <Input
                placeholder="Ex: Bloco B, Apto 302"
                value={formData.endereco?.complemento || ''}
                onChange={(e) =>
                  handleNestedChange('endereco', 'complemento', e.target.value)
                }
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>Bairro *</Label>
              <Input
                placeholder="Ex: Centro"
                value={formData.endereco?.bairro || ''}
                onChange={(e) =>
                  handleNestedChange('endereco', 'bairro', e.target.value)
                }
                className="bg-background border-border"
              />
              {errors?.endereco?.bairro && (
                <p className="text-destructive text-sm">
                  {errors.endereco.bairro}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Cidade *</Label>
              <Input
                placeholder="Ex: Campina Grande"
                value={formData.endereco?.cidade || ''}
                onChange={(e) =>
                  handleNestedChange('endereco', 'cidade', e.target.value)
                }
                className="bg-background border-border"
              />
              {errors?.endereco?.cidade && (
                <p className="text-destructive text-sm">
                  {errors.endereco.cidade}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>CEP *</Label>
              <Input
                placeholder="00000-000"
                value={formData.endereco?.cep || ''}
                onChange={(e) =>
                  handleNestedChange('endereco', 'cep', e.target.value)
                }
                className="bg-background border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
