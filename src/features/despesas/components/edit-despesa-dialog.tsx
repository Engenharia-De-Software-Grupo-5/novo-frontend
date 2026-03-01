'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/features/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Loader2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { DESPESA_TIPOS, FORMA_PAGAMENTO } from '../constants';
import { DespesaFormData, despesaSchema } from '../schemas/despesaSchema';
import { getById, update } from '../services/despesaService';

interface EditDespesaDialogProps {
  readonly condId: string;
  readonly despesaId: string;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function EditDespesaDialog({
  condId,
  despesaId,
  open,
  onOpenChange,
}: EditDespesaDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    files,
    existingAttachments,
    handleFileChange,
    removeFile,
    removeExistingAttachment,
    resetFiles,
    setInitialAttachments,
  } = useFileUpload();

  const form = useForm<DespesaFormData>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      nome: '',
      valor: 0,
      data: '',
      tipo: '',
      formaPagamento: '',
      idImovel: '',
    },
  });

  useEffect(() => {
    if (open && despesaId) {
      const fetchDespesa = async () => {
        setLoading(true);
        try {
          const data = await getById(condId, despesaId);
          form.reset({
            nome: data.nome,
            valor: data.valor,
            data: data.data,
            tipo: data.tipo,
            formaPagamento: data.formaPagamento,
            idImovel: data.idImovel || '',
          });
          if (data.anexos) {
            setInitialAttachments(data.anexos);
          }
        } catch {
          toast.error('Erro ao carregar os dados da despesa.');
          onOpenChange(false);
        } finally {
          setLoading(false);
        }
      };
      fetchDespesa();
    } else {
      form.reset();
      resetFiles();
    }
  }, [
    open,
    despesaId,
    condId,
    form,
    setInitialAttachments,
    resetFiles,
    onOpenChange,
  ]);

  const onSubmit = async (data: DespesaFormData) => {
    try {
      const payload = { ...data, idImovel: data.idImovel || null };

      await update(condId, despesaId, payload, {
        newFiles: files.length > 0 ? files : undefined,
        existingFileIds: existingAttachments.map((a) => a.id),
      });

      toast.success('Despesa atualizada com sucesso!');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar a despesa.');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Despesa</DialogTitle>
          <DialogDescription>
            Altere os dados ou adicione novos comprovantes.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Despesa</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
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
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                      <FormLabel>Pagamento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="idImovel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imóvel (Opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: AP 302"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="edit-despesa-file-upload"
                  className="text-sm leading-none font-medium"
                >
                  Anexos (PDF)
                </label>
                <Input
                  id="edit-despesa-file-upload"
                  type="file"
                  multiple
                  accept="application/pdf"
                  onChange={handleFileChange}
                />

                {existingAttachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <span className="text-muted-foreground text-xs font-semibold uppercase">
                      Já anexados
                    </span>
                    {existingAttachments.map((file) => (
                      <div
                        key={file.id}
                        className="bg-secondary flex items-center justify-between rounded p-2 text-sm"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <X
                          className="text-destructive h-4 w-4 shrink-0 cursor-pointer"
                          onClick={() => removeExistingAttachment(file.id)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {files.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <span className="text-muted-foreground text-xs font-semibold uppercase">
                      Novos arquivos
                    </span>
                    {files.map((file: File, index: number) => (
                      <div
                        key={file.name}
                        className="bg-secondary flex justify-between rounded p-2 text-sm"
                      >
                        <span className="truncate">{file.name}</span>
                        <X
                          className="text-destructive h-4 w-4 cursor-pointer"
                          onClick={() => removeFile(index)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
