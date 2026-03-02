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
import { Textarea } from '@/features/components/ui/textarea';
import { getFuncionarios } from '@/features/funcionarios/services/funcionarioService';
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
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

import { EmployeeSummary } from '@/types/employee';
import { PaymentDetail, PaymentType } from '@/types/payment';
import { cn } from '@/lib/utils';

import { PAYMENT_TYPES } from '../constants';
import { paymentFormSchema, PaymentFormValues } from '../schemas/paymentSchema';
import { postPayment, putPayment } from '../services/paymentService';

interface PaymentDialogProps {
  readonly payment?: PaymentDetail;
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}

export function PaymentDialog({
  payment,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: PaymentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [openEmployee, setOpenEmployee] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string;

  const isEditing = !!payment;
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

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      employeeId: '',
      type: 'salário',
      amount: '',
      dueDate: '',
      paymentDate: '',
      observation: '',
    },
  });

  useEffect(() => {
    if (!open) return;

    const fetchEmployees = async () => {
      try {
        const queryParams: {
          limit: number;
          columns?: string[];
          content?: string[];
        } = { limit: 20 };

        if (debouncedSearchQuery) {
          queryParams.columns = ['name'];
          queryParams.content = [debouncedSearchQuery];
        }

        const response = await getFuncionarios(condId, queryParams);
        setEmployees(response.items);
      } catch (error) {
        console.error('Failed to fetch employees', error);
        toast.error('Erro ao carregar funcionários');
      }
    };

    void fetchEmployees();
  }, [open, condId, debouncedSearchQuery]);

  useEffect(() => {
    if (payment && open) {
      form.reset({
        employeeId: payment.employeeId,
        type: payment.type,
        amount: String(payment.value),
        dueDate: payment.dueDate,
        paymentDate: payment.paymentDate || '',
        observation: payment.observation || '',
      });
      setInitialAttachments(payment.proofs || []);
    }
  }, [payment, open, form, setInitialAttachments]);

  async function onSubmit(data: PaymentFormValues) {
    try {
      setIsSubmitting(true);

      const paymentPayload: Partial<PaymentDetail> = {
        employeeId: data.employeeId,
        type: data.type as PaymentType,
        value: Number(data.amount),
        dueDate: data.dueDate || data.paymentDate || '',
        paymentDate: data.paymentDate || undefined,
        observation: data.observation,
      };

      const existingFileIds = existingAttachments.map((a) => a.id);

      if (isEditing) {
        await putPayment(condId, payment.id, paymentPayload, {
          newFiles: files,
          existingFileIds,
        });
        toast.success('Pagamento atualizado com sucesso!');
      } else {
        await postPayment(condId, paymentPayload, {
          newFiles: files.length > 0 ? files : undefined,
        });
        toast.success('Pagamento registrado com sucesso!');
      }

      router.refresh();
      setOpen(false);

      if (!isEditing) {
        form.reset();
        resetFiles();
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      const errorMsg = isEditing
        ? 'Erro ao atualizar pagamento. Tente novamente.'
        : 'Erro ao registrar pagamento. Tente novamente.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  let submitButtonLabel = 'Adicionar registro';
  if (isSubmitting) {
    submitButtonLabel = isEditing ? 'Salvando...' : 'Adicionando...';
  } else if (isEditing) {
    submitButtonLabel = 'Salvar';
  }

  const dialogContent = (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">
          {isEditing ? 'Editar Pagamento' : 'Adicionar registro de pagamento'}
        </DialogTitle>
        <DialogDescription className="text-sm font-normal">
          {isEditing
            ? 'Altere os dados abaixo para atualizar o pagamento.'
            : 'Informe os dados para cadastrar um novo registro de pagamento no sistema.'}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Funcionario */}
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => {
              let displayValue = 'Selecione um funcionário';

              if (field.value) {
                const foundEmployee = employees.find(
                  (employee) => employee.id === field.value
                );

                if (foundEmployee?.name) {
                  displayValue = foundEmployee.name;
                } else if (payment?.employeeId === field.value) {
                  displayValue = payment.name;
                }
              }

              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Funcionário *</FormLabel>
                  <Popover open={openEmployee} onOpenChange={setOpenEmployee}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openEmployee}
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {displayValue}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[300px] p-0">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Procurar funcionário..."
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                        />
                        <CommandList>
                          <CommandEmpty>
                            Nenhum funcionário encontrado.
                          </CommandEmpty>
                          <CommandGroup>
                            {employees.map((employee) => (
                              <CommandItem
                                value={employee.name}
                                key={employee.id}
                                onSelect={() => {
                                  form.setValue('employeeId', employee.id);
                                  setOpenEmployee(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    employee.id === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {employee.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* Tipo de Pagamento */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Tipo de Pagamento *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PAYMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Valor */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Valor do pagamento *
                </FormLabel>
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

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Data de Vencimento *
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Data de Pagamento
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Observação */}
          <FormField
            control={form.control}
            name="observation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Observação
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Digite uma observação..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Comprovante */}
          <div className="space-y-2">
            <label
              htmlFor="payment-file-upload"
              className="text-sm leading-none font-medium"
            >
              Comprovante (PDF)
            </label>
            <div className="relative">
              <Input
                id="payment-file-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                title=""
              />
              <div className="flex w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 py-4 transition-colors hover:bg-gray-100">
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Upload className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Clique para anexar comprovante
                  </span>
                </div>
              </div>
            </div>
            {hasAnyFiles && (
              <div className="space-y-2">
                {/* Existing files */}
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

                {/* New files */}
                {files.map((file, index) => (
                  <div
                    key={`new-${file.name}`}
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
              {submitButtonLabel}
            </Button>
          </DialogFooter>
        </form>
      </Form>
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
          Adicionar Pagamento
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}

export const AddPaymentDialog = PaymentDialog;
