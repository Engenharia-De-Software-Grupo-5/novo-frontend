'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ImovelForm,
  ImovelFormData,
} from '@/features/components/imoveis/imovel-form';
import { Button } from '@/features/components/ui/button';
import { postImovel } from '@/features/imoveis/services/imovelService';
import { ArrowLeft, Building2, MapPin, Save } from 'lucide-react';
import { toast } from 'sonner';

import { ImovelSituacao } from '@/types/imoveis';

function mapStatusToSituacao(status: string): ImovelSituacao {
  if (status === 'manutencao') return 'manutenção';
  if (status === 'na planta') return 'na planta';
  if (status === 'vago' || status === 'ocupado') return 'ativo';
  return 'inativo';
}

export default function NovoImovelAdminPage() {
  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ImovelFormData>({
    identificacao: '',
    status: '',
    tipo: 'apartamento',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      cep: '',
    },
    locatario: {
      nome: '',
      cpf: '',
      telefone: '',
    },
  });

  const listPath = `/condominios/${condId}/imoveis`;
  const detailsPath = '#';

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const hasLocatario =
        !!formData.locatario?.nome ||
        !!formData.locatario?.cpf ||
        !!formData.locatario?.telefone;

      const created = await postImovel(condId, {
        idCondominio: condId,
        idImovel: '',
        tipo: formData.tipo || 'apartamento',
        situacao: mapStatusToSituacao(formData.status),
        endereco: {
          rua: formData.endereco?.logradouro || '',
          numero: formData.endereco?.numero || '',
          bairro: formData.endereco?.bairro || '',
          cidade: formData.endereco?.cidade || '',
          estado: 'SP',
          nomePredio: formData.identificacao || undefined,
          bloco: formData.endereco?.complemento || undefined,
        },
        locatario: hasLocatario
          ? {
              nome: formData.locatario?.nome || '',
              cpf: formData.locatario?.cpf || '',
              telefone: formData.locatario?.telefone || '',
            }
          : null,
      });

      toast.success('Imóvel criado com sucesso.');
      router.push(`${listPath}/${created.idImovel}`);
      router.refresh();
    } catch (error) {
      console.error('Error creating imovel:', error);
      toast.error('Erro ao cadastrar imóvel.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={listPath}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Adicionar Imóvel
          </h2>
          <p className="text-muted-foreground">
            Preencha os dados para cadastrar uma nova unidade.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <ImovelForm formData={formData} setFormData={setFormData} />

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" asChild>
              <Link href={listPath}>Cancelar</Link>
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Salvando...' : 'Salvar Imóvel'}
            </Button>
          </div>
        </div>

        <div className="bg-card sticky top-6 space-y-4 rounded-xl border p-4 xl:col-span-1">
          <h3 className="text-foreground text-2xl leading-none font-semibold tracking-tight">
            Pré-visualização
          </h3>

          <div className="bg-background overflow-hidden rounded-xl border shadow-sm">
            <div className="bg-muted flex h-40 items-center justify-center">
              <Building2 className="text-muted-foreground/60 h-14 w-14" />
            </div>
            <div className="space-y-3 p-4">
              <h4 className="text-foreground text-2xl leading-tight font-semibold">
                {formData.identificacao || 'Identificação do Imóvel'}
              </h4>
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <MapPin className="h-3.5 w-3.5" />
                {formData.endereco?.logradouro
                  ? `${formData.endereco.logradouro}, ${formData.endereco.numero || ''}`
                  : 'Endereço não informado'}
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href={detailsPath}>Ver detalhes</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            <p>
              Dica: Preencha todos os campos obrigatórios (*) para salvar o
              imóvel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
