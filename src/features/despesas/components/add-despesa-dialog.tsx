'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/features/components/ui/form';
import { Input } from '@/features/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/components/ui/select';
import { useFileUpload } from '@/features/hooks/useFileUpload';
import { getImoveis } from '@/features/imoveis/services/imovelService';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Plus, Trash2, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { DespesaDetail } from '@/types/despesa';
import { ImovelSummary } from '@/types/imoveis';

import { DESPESA_TIPOS, FORMA_PAGAMENTO } from '../constants';
import { DespesaFormData, despesaSchema } from '../schemas/despesaSchema';
import { create, update } from '../services/despesaService';

interface DespesaDialogProps {
  readonly despesa?: DespesaDetail;
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}

export function DespesaDialog({
  despesa,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: DespesaDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imoveis, setImoveis] = useState<ImovelSummary[]>([]);

  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string;

  const isEditing = !!despesa;
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (value: boolean) => controlledOnOpenChange?.(value)
    : setInternalOpen;

  const {
    files,
    existingAttachments,
    hasAnyFiles,
    handleFileChange,
    removeFile,
    removeExistingAttachment,
    resetFiles,
    setInitialAttachments,
  } = useFileUpload({ accept: 'application/pdf' });

  const form = useForm<DespesaFormData>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      nome: '',
      valor: '',
      data: '',
      tipo: '',
      formaPagamento: '',
      idImovel: null,
    },
  });

  // Buscar imóveis quando o dialog abre
  useEffect(() => {
    if (!open) return;

    const fetchImoveis = async () => {
      try {
        const response = await getImoveis(condId, { limit: 100 });
        setImoveis(response.items);
      } catch (error) {
        console.error('Failed to fetch imoveis', error);
      }
    };

    void fetchImoveis();
  }, [open, condId]);

  // Popular form quando editando
  useEffect(() => {
    if (despesa && open) {
      form.reset({
        nome: despesa.nome ?? '',
        valor: String(despesa.valor ?? ''),
        data: despesa.data ?? '',
        tipo: despesa.tipo ?? '',
        formaPagamento: despesa.formaPagamento ?? '',
        idImovel: despesa.idImovel ?? null,
      });
      if (despesa.anexos) {
        setInitialAttachments(despesa.anexos);
      }
    }
  }, [despesa, open, form, setInitialAttachments]);

  async function onSubmit(data: DespesaFormData) {
    try {
      setIsSubmitting(true);

      const payload: Partial<DespesaDetail> = {
        ...data,
        valor: Number(data.valor),
        idImovel: data.idImovel || null,
      };

      const existingFileIds = existingAttachments.map((a) => a.id);

      if (isEditing) {
        await update(condId, despesa.id, payload as DespesaDetail, {
          newFiles: files,
          existingFileIds,
        });
        toast.success(`Despesa "${data.nome}" atualizada com sucesso!`);
      } else {
        await create(condId, payload as DespesaDetail, {
          newFiles: files.length > 0 ? files : undefined,
        });
        toast.success(`Despesa "${data.nome}" adicionada com sucesso!`);
      }

      router.refresh();
      setOpen(false);

      if (!isEditing) {
        form.reset();
        resetFiles();
      }
    } catch (error) {
      console.error('Error submitting despesa:', error);
      toast.error(
        isEditing
          ? 'Erro ao atualizar despesa. Tente novamente.'
          : 'Erro ao adicionar despesa. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  let buttonLabel = 'Salvar';
  if (isSubmitting) {
    buttonLabel = isEditing ? 'Salvando...' : 'Adicionando...';
  } else if (!isEditing) {
    buttonLabel = 'Adicionar';
  }

  const dialogContent = (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? 'Editar Despesa' : 'Nova Despesa'}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? 'Altere os dados ou adicione novos comprovantes.'
            : 'Preencha os dados da nova despesa.'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Despesa *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Manutenção" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Valor e Data */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="R$ 0,00"
                      type="number"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tipo e Forma de Pagamento */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DESPESA_TIPOS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="formaPagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Pagamento *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FORMA_PAGAMENTO.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Imóvel (Opcional) */}
          <FormField
            control={form.control}
            name="idImovel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imóvel (Opcional)</FormLabel>
                <Select
                  onValueChange={(val) =>
                    field.onChange(val === '__none__' ? null : val)
                  }
                  value={field.value ?? '__none__'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhum" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="__none__">Nenhum</SelectItem>
                    {imoveis.map((imovel) => (
                      <SelectItem key={imovel.idImovel} value={imovel.idImovel}>
                        {imovel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Anexos (PDF) */}
          <div className="space-y-2">
            <label
              htmlFor="despesa-file-upload"
              className="text-sm leading-none font-medium"
            >
              Anexos (PDF)
            </label>
            <div className="relative">
              <Input
                id="despesa-file-upload"
                type="file"
                multiple
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                title=""
              />
              <div className="flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 py-4 transition-colors hover:bg-gray-100">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Upload className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Clique para anexar comprovantes
                  </span>
                </div>
              </div>
            </div>

            {hasAnyFiles && (
              <div className="mt-2 space-y-2">
                {/* Arquivos já existentes (edição) */}
                {existingAttachments.map((attachment) => (
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
                      onClick={() => removeExistingAttachment(attachment.id)}
                      className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* Novos arquivos */}
                {files.map((file, index) => (
                  <div
                    key={`new-${file.name}-${index}`}
                    className="flex items-center justify-between rounded-md border bg-gray-50 p-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="text-muted-foreground h-4 w-4" />
                      <span
                        className="max-w-[220px] truncate"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {buttonLabel}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );

  // Modo controlado (edição via data-table-row-actions)
  if (isControlled) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {dialogContent}
      </Dialog>
    );
  }

  // Modo não controlado (criação com botão trigger)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto flex h-8">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Despesa
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}

// Re-export para retrocompatibilidade
export const AddDespesaDialog = DespesaDialog;
