'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Save } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/features/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/features/components/ui/dialog';
import { ImovelForm, ImovelFormData } from '@/features/components/imoveis/imovel-form';
import {
  ImovelDetail,
  ImovelSituacao,
  ImovelTipo,
} from '@/types/imoveis';

import { postImovel, putImovel } from '../services/imovelService';

interface ImovelDialogProps {
  imovel?: ImovelDetail;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ImovelFormState extends ImovelFormData {
  nome: string;
  status: string;
  tipo?: ImovelTipo;
  endereco: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    cep: string;
  };
}

function mapStatusToSituacao(status: string): ImovelSituacao {
  if (status === 'manutencao') return 'manutenção';
  if (status === 'na planta') return 'na planta';
  if (status === 'vago' || status === 'ocupado') return 'ativo';
  return 'inativo';
}

function mapSituacaoToStatus(situacao: ImovelSituacao): string {
  if (situacao === 'manutenção') return 'manutencao';
  if (situacao === 'na planta') return 'na planta';
  if (situacao === 'ativo') return 'vago';
  return 'vago';
}

const initialFormState: ImovelFormState = {
  nome: '',
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
};

export function ImovelDialog({
  imovel,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ImovelDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ImovelFormState>(initialFormState);

  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string;

  const isEditing = !!imovel;
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (value: boolean) => controlledOnOpenChange?.(value)
    : setInternalOpen;

  useEffect(() => {
    if (imovel && open) {
      setFormData({
        nome: imovel.nome,
        status: mapSituacaoToStatus(imovel.situacao),
        tipo: imovel.tipo,
        endereco: {
          logradouro: imovel.endereco.rua,
          numero: imovel.endereco.numero,
          complemento: imovel.endereco.bloco || imovel.endereco.torre || '',
          bairro: imovel.endereco.bairro,
          cidade: imovel.endereco.cidade,
          cep: '',
        },
      });
    }

    if (!imovel && open) {
      setFormData(initialFormState);
    }
  }, [imovel, open]);

  async function onSubmit() {
    try {
      setIsSubmitting(true);

      const payload: Partial<ImovelDetail> = {
        nome: formData.nome,
        tipo: formData.tipo || 'apartamento',
        situacao: mapStatusToSituacao(formData.status),
        endereco: {
          rua: formData.endereco.logradouro,
          numero: formData.endereco.numero,
          bairro: formData.endereco.bairro,
          cidade: formData.endereco.cidade,
          estado: 'SP',
          bloco: formData.endereco.complemento || undefined,
        },
        locatario: null,
      };

      if (isEditing && imovel) {
        await putImovel(condId, imovel.idImovel, payload);
        toast.success(`Imóvel "${formData.nome}" atualizado com sucesso!`);
      } else {
        await postImovel(condId, {
          idCondominio: condId,
          idImovel: '',
          nome: formData.nome,
          tipo: formData.tipo || 'apartamento',
          situacao: mapStatusToSituacao(formData.status),
          endereco: {
            rua: formData.endereco.logradouro,
            numero: formData.endereco.numero,
            bairro: formData.endereco.bairro,
            cidade: formData.endereco.cidade,
            estado: 'SP',
            bloco: formData.endereco.complemento || undefined,
          },
          locatario: null,
        });
        toast.success(`Imóvel "${formData.nome}" adicionado com sucesso!`);
      }

      router.refresh();
      setOpen(false);

      if (!isEditing) {
        setFormData(initialFormState);
      }
    } catch (error) {
      console.error('Error submitting imovel:', error);
      toast.error(
        isEditing
          ? 'Erro ao atualizar imóvel. Tente novamente.'
          : 'Erro ao adicionar imóvel. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const dialogContent = (
    <DialogContent className="left-0 top-0 h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none border-0 p-0 sm:left-[50%] sm:top-[50%] sm:h-auto sm:w-full sm:max-w-[920px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:gap-4 sm:rounded-lg sm:border sm:p-6">
      <DialogHeader className="px-4 pt-4 sm:px-0 sm:pt-0">
        <DialogTitle>{isEditing ? 'Editar Imóvel' : 'Adicionar Imóvel'}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? 'Altere os dados abaixo para atualizar o imóvel.'
            : 'Preencha os dados abaixo para cadastrar um novo imóvel.'}
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-[calc(100dvh-10.5rem)] overflow-y-auto px-4 pb-4 sm:max-h-[70vh] sm:px-0 sm:pb-0">
        <div className="space-y-6">
          <ImovelForm formData={formData} setFormData={setFormData} />
        </div>
      </div>

      <DialogFooter className="border-t px-4 py-3 sm:border-0 sm:px-0 sm:py-0">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  if (isControlled) {
    return <Dialog open={open} onOpenChange={setOpen}>{dialogContent}</Dialog>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Imóvel
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
