'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ImovelForm,
  ImovelFormData,
  ImovelFormErrors,
} from '@/features/components/imoveis/imovel-form';
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
import { Input } from '@/features/components/ui/input';
import { useFileUpload } from '@/features/hooks/useFileUpload';
import { FileText, Plus, Save, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { ImovelDetail, ImovelSituacao } from '@/types/imoveis';

import { imovelFormSchema } from '../schemas/imovelSchema';
import { postImovel, putImovel } from '../services/imovelService';

interface ImovelDialogProps {
  readonly imovel?: ImovelDetail;
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
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

const initialFormState: ImovelFormData = {
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
  const [formData, setFormData] = useState<ImovelFormData>(initialFormState);
  const [formErrors, setFormErrors] = useState<ImovelFormErrors>({});

  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string;

  const isEditing = !!imovel;
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (value: boolean) => controlledOnOpenChange?.(value)
    : setInternalOpen;

  // Clear errors whenever formData changes
  const handleSetFormData: React.Dispatch<
    React.SetStateAction<ImovelFormData>
  > = (update) => {
    setFormErrors({});
    setFormData(update);
  };

  // File upload hooks — one per type
  const {
    files: vistoriasFiles,
    existingAttachments: existingVistorias,
    hasAnyFiles: hasAnyVistorias,
    handleFileChange: handleVistoriasChange,
    removeFile: removeVistoria,
    removeExistingAttachment: removeExistingVistoria,
    resetFiles: resetVistorias,
    setInitialAttachments: setInitialVistorias,
  } = useFileUpload({ accept: 'application/pdf,.pdf' });

  const {
    files: documentosFiles,
    existingAttachments: existingDocumentos,
    hasAnyFiles: hasAnyDocumentos,
    handleFileChange: handleDocumentosChange,
    removeFile: removeDocumento,
    removeExistingAttachment: removeExistingDocumento,
    resetFiles: resetDocumentos,
    setInitialAttachments: setInitialDocumentos,
  } = useFileUpload({ accept: 'application/pdf,.pdf' });

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
      setInitialVistorias(imovel.vistorias ?? []);
      setInitialDocumentos(imovel.documentos ?? []);
    }

    if (!imovel && open) {
      setFormData(initialFormState);
      setFormErrors({});
    }
  }, [imovel, open, setInitialVistorias, setInitialDocumentos]);

  async function onSubmit() {
    // ── Zod validation ──────────────────────────────
    const parsed = imovelFormSchema.safeParse({
      nome: formData.nome,
      status: formData.status,
      tipo: formData.tipo,
      endereco: {
        logradouro: formData.endereco?.logradouro ?? '',
        numero: formData.endereco?.numero ?? '',
        complemento: formData.endereco?.complemento,
        bairro: formData.endereco?.bairro ?? '',
        cidade: formData.endereco?.cidade ?? '',
        cep: formData.endereco?.cep,
      },
    });

    if (!parsed.success) {
      const fmt = parsed.error.format();
      setFormErrors({
        nome: fmt.nome?._errors[0],
        status: fmt.status?._errors[0],
        tipo: fmt.tipo?._errors[0],
        endereco: {
          logradouro: fmt.endereco?.logradouro?._errors[0],
          numero: fmt.endereco?.numero?._errors[0],
          bairro: fmt.endereco?.bairro?._errors[0],
          cidade: fmt.endereco?.cidade?._errors[0],
        },
      });
      return;
    }

    setFormErrors({});

    try {
      setIsSubmitting(true);

      // Single existingFileIds combining all kept attachments (vistorias + documentos)
      const existingFileIds = [
        ...existingVistorias.map((a) => a.id),
        ...existingDocumentos.map((a) => a.id),
      ];

      const payload: Partial<ImovelDetail> = {
        nome: formData.nome,
        tipo: formData.tipo || 'apartamento',
        situacao: mapStatusToSituacao(formData.status),
        endereco: {
          rua: formData.endereco?.logradouro || '',
          numero: formData.endereco?.numero || '',
          bairro: formData.endereco?.bairro || '',
          cidade: formData.endereco?.cidade || '',
          estado: 'SP',
          bloco: formData.endereco?.complemento || undefined,
        },
        locatario: null,
      };

      if (isEditing && imovel) {
        await putImovel(condId, imovel.idImovel, payload, {
          newVistoriasFiles: vistoriasFiles,
          newDocumentosFiles: documentosFiles,
          existingFileIds,
        });
        toast.success(`Imóvel "${formData.nome}" atualizado com sucesso!`);
      } else {
        await postImovel(
          condId,
          {
            idCondominio: condId,
            idImovel: '',
            nome: formData.nome,
            tipo: formData.tipo || 'apartamento',
            situacao: mapStatusToSituacao(formData.status),
            endereco: {
              rua: formData.endereco?.logradouro || '',
              numero: formData.endereco?.numero || '',
              bairro: formData.endereco?.bairro || '',
              cidade: formData.endereco?.cidade || '',
              estado: 'SP',
              bloco: formData.endereco?.complemento || undefined,
            },
            locatario: null,
          },
          {
            newVistoriasFiles:
              vistoriasFiles.length > 0 ? vistoriasFiles : undefined,
            newDocumentosFiles:
              documentosFiles.length > 0 ? documentosFiles : undefined,
          }
        );
        toast.success(`Imóvel "${formData.nome}" adicionado com sucesso!`);
      }

      router.refresh();
      setOpen(false);

      if (!isEditing) {
        setFormData(initialFormState);
        resetVistorias();
        resetDocumentos();
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

  function renderUploadSection(
    label: string,
    inputId: string,
    hasAny: boolean,
    existingList: { id: string; name: string }[],
    newFilesList: File[],
    onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onRemoveExisting: (id: string) => void,
    onRemoveNew: (index: number) => void
  ) {
    return (
      <div className="space-y-2">
        <label htmlFor={inputId} className="text-sm leading-none font-medium">
          {label}
        </label>
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Input
              id={inputId}
              type="file"
              accept=".pdf"
              onChange={onChangeHandler}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              title=""
            />
            <div className="flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 py-4 transition-colors hover:bg-gray-100">
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Upload className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Clique para adicionar arquivo
                </span>
              </div>
            </div>
          </div>

          {hasAny && (
            <div className="space-y-2">
              <span className="text-sm font-medium">Arquivos anexados</span>

              {existingList.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between rounded-md border bg-gray-50 p-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    <span
                      className="max-w-[220px] truncate"
                      title={attachment.name}
                    >
                      {attachment.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveExisting(attachment.id)}
                    className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {newFilesList.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-md border bg-gray-50 p-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    <span className="max-w-[220px] truncate" title={file.name}>
                      {file.name}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveNew(index)}
                    className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const dialogContent = (
    <DialogContent className="top-0 left-0 h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none border-0 p-0 sm:top-[50%] sm:left-[50%] sm:h-auto sm:w-full sm:max-w-[920px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:gap-4 sm:rounded-lg sm:border sm:p-6">
      <DialogHeader className="px-4 pt-4 sm:px-0 sm:pt-0">
        <DialogTitle>
          {isEditing ? 'Editar Imóvel' : 'Adicionar Imóvel'}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? 'Altere os dados abaixo para atualizar o imóvel.'
            : 'Preencha os dados abaixo para cadastrar um novo imóvel.'}
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-[calc(100dvh-10.5rem)] overflow-y-auto px-4 pb-4 sm:max-h-[70vh] sm:px-0 sm:pb-0">
        <div className="space-y-6">
          <ImovelForm
            formData={formData}
            setFormData={handleSetFormData}
            errors={formErrors}
          />

          {/* Vistorias Upload */}
          {renderUploadSection(
            'Vistorias (PDF)',
            'imovel-vistorias-upload',
            hasAnyVistorias,
            existingVistorias,
            vistoriasFiles,
            handleVistoriasChange,
            removeExistingVistoria,
            removeVistoria
          )}

          {/* Documentos Upload */}
          {renderUploadSection(
            'Documentos (PDF)',
            'imovel-documentos-upload',
            hasAnyDocumentos,
            existingDocumentos,
            documentosFiles,
            handleDocumentosChange,
            removeExistingDocumento,
            removeDocumento
          )}
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
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {dialogContent}
      </Dialog>
    );
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
