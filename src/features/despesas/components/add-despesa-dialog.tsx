'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/features/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { DESPESA_TIPOS, FORMA_PAGAMENTO } from '../constants';
import { DespesaFormData, despesaSchema } from '../schemas/despesaSchema';
import { create } from '../services/despesaService';

interface AddDespesaDialogProps {
  readonly condId: string;
}

export function AddDespesaDialog({ condId }: AddDespesaDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { files, handleFileChange, removeFile, resetFiles } = useFileUpload();

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

  const onSubmit = async (data: DespesaFormData) => {
    try {
      const payload = { ...data, idImovel: data.idImovel || null };

      await create(condId, payload, {
        newFiles: files.length > 0 ? files : undefined,
      });

      toast.success('Despesa adicionada com sucesso!');
      setOpen(false);
      form.reset();
      resetFiles();
      router.refresh();
    } catch (error) {
      toast.error('Ocorreu um erro ao adicionar a despesa.');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto flex h-8">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Despesa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nova Despesa</DialogTitle>
          <DialogDescription>
            Preencha os dados da nova despesa.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Despesa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Manutenção" {...field} />
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
                          field.onChange(Number.parseFloat(e.target.value) || 0)
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                htmlFor="add-despesa-file-upload"
                className="text-sm leading-none font-medium"
              >
                Anexos (PDF)
              </label>
              <Input
                id="add-despesa-file-upload"
                type="file"
                multiple
                accept="application/pdf"
                onChange={handleFileChange}
              />
              {files.map((file: File, index: number) => (
                <div
                  key={index}
                  className="bg-secondary mt-2 flex justify-between rounded p-2 text-sm"
                >
                  <span className="truncate">{file.name}</span>
                  <X
                    className="text-destructive h-4 w-4 cursor-pointer"
                    onClick={() => removeFile(index)}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
