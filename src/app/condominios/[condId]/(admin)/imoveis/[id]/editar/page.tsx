'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

import { ImovelForm } from '@/features/components/imoveis/imovel-form';
import { Button } from '@/features/components/ui/button';
import { getImovelById, putImovel } from '@/features/imoveis/services/imovelService';
import { ImovelSituacao } from '@/types/imoveis';

interface ImovelFormState {
  identificacao: string;
  status: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    cep: string;
  };
  locatario: {
    nome: string;
    cpf: string;
    telefone: string;
  };
}

function mapSituacaoToStatus(situacao: ImovelSituacao): string {
  if (situacao === 'manutenção') return 'manutencao';
  if (situacao === 'na planta') return 'na planta';
  if (situacao === 'ativo') return 'vago';
  return 'vago';
}

function mapStatusToSituacao(status: string): ImovelSituacao {
  if (status === 'manutencao') return 'manutenção';
  if (status === 'na planta') return 'na planta';
  if (status === 'vago' || status === 'ocupado') return 'ativo';
  return 'inativo';
}

export default function EditarImovelAdminPage({
  params,
}: {
  params: Promise<{ condId: string; id: string }>;
}) {
  const { condId, id } = use(params);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ImovelFormState>({
    identificacao: '',
    status: 'vago',
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

  useEffect(() => {
    const loadImovel = async () => {
      try {
        const imovel = await getImovelById(condId, id);
        setFormData({
          identificacao: imovel.endereco.nomePredio || imovel.idImovel,
          status: mapSituacaoToStatus(imovel.situacao),
          endereco: {
            logradouro: imovel.endereco.rua,
            numero: imovel.endereco.numero,
            complemento: imovel.endereco.bloco || imovel.endereco.torre || '',
            bairro: imovel.endereco.bairro,
            cidade: imovel.endereco.cidade,
            cep: '',
          },
          locatario: {
            nome: imovel.locatario?.nome || '',
            cpf: imovel.locatario?.cpf || '',
            telefone: imovel.locatario?.telefone || '',
          },
        });
      } catch (error) {
        console.error('Error loading imovel:', error);
        toast.error('Erro ao carregar imóvel.');
        router.push(`/condominios/${condId}/imoveis`);
      } finally {
        setIsLoading(false);
      }
    };

    loadImovel();
  }, [condId, id, router]);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);

      const hasLocatario =
        !!formData.locatario.nome ||
        !!formData.locatario.cpf ||
        !!formData.locatario.telefone;

      await putImovel(condId, id, {
        situacao: mapStatusToSituacao(formData.status),
        endereco: {
          rua: formData.endereco.logradouro,
          numero: formData.endereco.numero,
          bairro: formData.endereco.bairro,
          cidade: formData.endereco.cidade,
          estado: 'SP',
          nomePredio: formData.identificacao || undefined,
          bloco: formData.endereco.complemento || undefined,
        },
        locatario: hasLocatario
          ? {
              nome: formData.locatario.nome,
              cpf: formData.locatario.cpf,
              telefone: formData.locatario.telefone,
            }
          : null,
      });

      toast.success('Imóvel atualizado com sucesso.');
      router.push(`/condominios/${condId}/imoveis/${id}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating imovel:', error);
      toast.error('Erro ao salvar alterações.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <p className="text-muted-foreground">Carregando imóvel...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" className="border-border hover:bg-accent" asChild>
          <Link href={`/condominios/${condId}/imoveis/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
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
            <Link href={`/condominios/${condId}/imoveis/${id}`}>Cancelar</Link>
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[150px]"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>
    </div>
  );
}
