'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/features/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/features/components/ui/command';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/features/components/ui/select';
import { toast } from '@/features/components/ui/sonner';
import { useFileUpload } from '@/features/hooks/useFileUpload';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  ChevronsUpDown,
  FileText,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import { CobrancaDetail, CobrancaTenant } from '@/types/cobranca';
import { cn } from '@/lib/utils';

import {
  COBRANCA_PAYMENT_METHODS,
  COBRANCA_STATUSES,
  COBRANCA_TYPES,
} from '../constants';
import {
  cobrancaFormSchema,
  CobrancaFormValues,
} from '../schemas/cobrancaSchema';
import {
  getCobrancaTenants,
  postCobranca,
  putCobranca,
} from '../services/cobrancaService';

interface CobrancaDialogProps {
  cobranca?: CobrancaDetail;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const defaultValues: Partial<CobrancaFormValues> = {
  tenantId: '',
  dueDate: '',
  value: '',
  penalty: '',
  interest: '',
  observation: '',
};

export function CobrancaDialog({
  cobranca,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CobrancaDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [openTenant, setOpenTenant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenants, setTenants] = useState<CobrancaTenant[]>([]);
  const [tenantSearch, setTenantSearch] = useState('');
  const [debouncedTenantSearch] = useDebounce(tenantSearch, 350);

  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string;

  const isEditing = !!cobranca;
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
  } = useFileUpload();

  const form = useForm<CobrancaFormValues>({
    resolver: zodResolver(cobrancaFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;

    const loadTenants = async () => {
      try {
        const data = await getCobrancaTenants(condId);
        setTenants(data);
      } catch (error) {
        console.error('Error loading tenants', error);
        toast.error('Erro ao carregar condôminos.');
      }
    };

    void loadTenants();
  }, [open, condId]);

  useEffect(() => {
    if (!debouncedTenantSearch) return;

    const found = tenants.some((tenant) =>
      tenant.name.toLowerCase().includes(debouncedTenantSearch.toLowerCase())
    );

    if (!found) setOpenTenant(true);
  }, [debouncedTenantSearch, tenants]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (cobranca) {
      form.reset({
        tenantId: cobranca.tenantId,
        type: cobranca.type,
        status: cobranca.status,
        dueDate: cobranca.dueDate,
        value: String(cobranca.value),
        penalty: String(cobranca.penalty),
        interest: String(cobranca.interest),
        paymentMethod: cobranca.paymentMethod,
        observation: cobranca.observation || '',
      });
      setInitialAttachments(cobranca.attachments || []);
      return;
    }

    form.reset(defaultValues);
    setTenantSearch('');
    resetFiles();
  }, [open, cobranca, form, resetFiles, setInitialAttachments]);

  const buildPayload = (
    values: CobrancaFormValues
  ): Partial<CobrancaDetail> => {
    const status = isEditing
      ? (values.status ?? cobranca?.status ?? 'pendente')
      : 'pendente';

    return {
      tenantId: values.tenantId,
      type: values.type,
      status,
      dueDate: values.dueDate,
      value: Number(values.value),
      penalty: Number(values.penalty),
      interest: Number(values.interest),
      paymentMethod: values.paymentMethod,
      observation: isEditing ? values.observation || undefined : undefined,
      isActive: status !== 'desativada',
    };
  };

  const onSubmit = async (values: CobrancaFormValues) => {
    try {
      setIsSubmitting(true);

      const payload = buildPayload(values);

      if (isEditing && cobranca) {
        await putCobranca(condId, cobranca.id, payload, {
          newFiles: files,
          existingFileIds: existingAttachments.map((a) => a.id),
        });
        toast.success('Cobrança atualizada com sucesso.');
      } else {
        await postCobranca(condId, payload);
        toast.success('Cobrança adicionada com sucesso.');
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error('Error saving charge', error);
      const errorMsg = isEditing
        ? 'Erro ao atualizar cobrança. Tente novamente.'
        : 'Erro ao adicionar cobrança. Tente novamente.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTenants = tenants.filter((tenant) =>
    tenant.name.toLowerCase().includes(tenantSearch.toLowerCase())
  );

  const content = (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
      <DialogHeader className="space-y-2 pb-1">
        <DialogTitle>
          {isEditing ? 'Editar cobrança' : 'Adicionar nova cobrança'}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? 'Atualize os dados para editar a cobrança.'
            : 'Informe os dados para cadastrar uma nova cobrança no sistema.'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="tenantId"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3">
                <FormLabel>Condômino *</FormLabel>
                <Popover open={openTenant} onOpenChange={setOpenTenant}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTenant}
                        className={cn(
                          'w-full justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? tenants.find((tenant) => tenant.id === field.value)
                              ?.name || 'Escolher condômino'
                          : 'Escolher condômino'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Buscar condômino..."
                        value={tenantSearch}
                        onValueChange={setTenantSearch}
                      />
                      <CommandList>
                        <CommandEmpty>
                          Nenhum condômino encontrado.
                        </CommandEmpty>
                        <CommandGroup>
                          {filteredTenants.map((tenant) => (
                            <CommandItem
                              key={tenant.id}
                              value={tenant.name}
                              onSelect={() => {
                                form.setValue('tenantId', tenant.id);
                                setOpenTenant(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  tenant.id === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {tenant.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Tipo *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COBRANCA_TYPES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing ? (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Situação *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar situação" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COBRANCA_STATUSES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Data de vencimento *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Valor *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="R$ 0,00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="penalty"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Multa (R$) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="R$ 0,00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interest"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Juros por Mês (%) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Forma de pagamento *</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {COBRANCA_PAYMENT_METHODS.map((item) => (
                      <label
                        key={item.value}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={item.value}
                          checked={field.value === item.value}
                          onChange={() => field.onChange(item.value)}
                          className="accent-primary h-4 w-4"
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isEditing ? (
            <>
              <FormField
                control={form.control}
                name="observation"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Observação</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Informações complementares..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label
                  htmlFor="cobranca-file-upload"
                  className="text-sm leading-none font-medium"
                >
                  Anexos (PDF)
                </label>
                <div className="relative">
                  <Input
                    id="cobranca-file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    title=""
                  />
                  <div className="flex w-full items-center justify-center rounded-md border border-dashed py-4">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <Upload className="h-4 w-4" />
                      Clique para fazer upload
                    </div>
                  </div>
                </div>
                {hasAnyFiles && (
                  <div className="space-y-2">
                    {existingAttachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between rounded-md border p-2 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="text-muted-foreground h-4 w-4" />
                          {attachment.name}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeExistingAttachment(attachment.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {files.map((file, index) => (
                      <div
                        key={`new-file-${index}`}
                        className="flex items-center justify-between rounded-md border p-2 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="text-muted-foreground h-4 w-4" />
                          {file.name}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditing
                  ? 'Salvando...'
                  : 'Adicionando...'
                : isEditing
                  ? 'Editar cobrança'
                  : 'Adicionar cobrança'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );

  if (isControlled) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {content}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8">
          <Plus className="mr-1 h-4 w-4" />
          Adicionar cobrança
        </Button>
      </DialogTrigger>
      {content}
    </Dialog>
  );
}

export const AddCobrancaDialog = CobrancaDialog;
