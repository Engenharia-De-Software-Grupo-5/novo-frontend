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
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Trash2, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { EmployeeDetail, EmployeeFile } from '@/types/employee';

import { putFuncionario } from '../services/funcionarioService';

const employeeFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email inválido.' })
    .optional()
    .or(z.literal('')),
  name: z.string().min(2, {
    message: 'Nome deve ter pelo menos 2 caracteres.',
  }),
  cpf: z
    .string()
    .min(11, { message: 'CPF deve ter 11 dígitos.' })
    .max(14, { message: 'CPF muito longo.' }),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data de nascimento inválida.',
  }),
  admissionDate: z.string().optional(),
  role: z.string({
    message: 'Por favor selecione um cargo.',
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EmployeeDialogProps {
  employee?: EmployeeDetail;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EmployeeDialog({
  employee,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: EmployeeDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [existingContracts, setExistingContracts] = useState<EmployeeFile[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const condId = params?.condId as string;

  const isEditing = !!employee;
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (value: boolean) => controlledOnOpenChange?.(value)
    : setInternalOpen;

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: '',
      email: '',
      cpf: '',
      birthDate: '',
      admissionDate: '',
      role: undefined,
      phone: '',
      address: '',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (employee && open) {
      form.reset({
        name: employee.name ?? '',
        email: employee.email ?? '',
        cpf: employee.cpf ?? '',
        birthDate: employee.birthDate ?? '',
        admissionDate: employee.admissionDate ?? '',
        role: employee.role ?? undefined,
        phone: employee.phone ?? '',
        address: employee.address ?? '',
      });
      setExistingContracts(employee.Contracts ?? []);
    }
  }, [employee, open, form]);

  async function onSubmit(data: EmployeeFormValues) {
    try {
      setIsSubmitting(true);
      if (isEditing) {
        await putFuncionario(condId, employee.id, { ...data });
        toast.success(`Funcionário "${data.name}" atualizado com sucesso!`);
        router.refresh();
      } else {
        console.log('Form submitted:', { ...data, files });
        // TODO: Implement POST API call
        toast.success('Funcionário adicionado com sucesso!');
      }
      setOpen(false);
      if (!isEditing) {
        form.reset();
        setFiles([]);
      }
    } catch (error) {
      console.error('Error submitting employee:', error);
      toast.error(
        isEditing
          ? 'Erro ao atualizar funcionário. Tente novamente.'
          : 'Erro ao adicionar funcionário. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const invalidFiles = newFiles.filter(
        (file) => file.type !== 'application/pdf'
      );
      if (invalidFiles.length > 0) {
        toast.error('Apenas arquivos PDF são permitidos.');
        e.target.value = '';
        return;
      }
      setFiles((prev) => [...prev, ...newFiles]);
      e.target.value = '';
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeExistingContract = (contractId: string) => {
    setExistingContracts((prev) => prev.filter((c) => c.id !== contractId));
  };

  const hasAnyFiles = files.length > 0 || existingContracts.length > 0;

  const dialogContent = (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? 'Editar Funcionário' : 'Adicionar Funcionário'}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? 'Altere os dados abaixo para atualizar o funcionário.'
            : 'Preencha os dados abaixo para adicionar um novo funcionário.'}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nome Completo */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CPF */}
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF *</FormLabel>
                <FormControl>
                  <Input placeholder="000.000.000-00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Data de Nascimento & Data de Admissão */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="admissionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Admissão</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Cargo */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cargo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gerente">Gerente</SelectItem>
                    <SelectItem value="porteiro">Porteiro</SelectItem>
                    <SelectItem value="zelador">Zelador</SelectItem>
                    <SelectItem value="faxineiro">Faxineiro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Telefone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Endereço */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Rua, Número, Bairro, Cidade - UF"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contrato (Upload) */}
          <div className="space-y-2">
            <label className="text-sm leading-none font-medium">
              Contrato (PDF)
            </label>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Input
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
                      Clique para adicionar contrato
                    </span>
                  </div>
                </div>
              </div>

              {/* Contratos Anexados */}
              {hasAnyFiles && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">
                    Contratos anexados
                  </span>

                  {/* Existing contracts (from server) */}
                  {existingContracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="flex items-center justify-between rounded-md border bg-gray-50 p-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="text-muted-foreground h-4 w-4" />
                        <span
                          className="max-w-[220px] truncate"
                          title={contract.name}
                        >
                          {contract.name}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExistingContract(contract.id)}
                        className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Newly uploaded files */}
                  {files.map((file, index) => (
                    <div
                      key={`new-${index}`}
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
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting
                ? isEditing
                  ? 'Salvando...'
                  : 'Adicionando...'
                : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );

  // When controlled (edit mode), no trigger needed
  if (isControlled) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {dialogContent}
      </Dialog>
    );
  }

  // When uncontrolled (create mode), render with trigger
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8">
          Adicionar Funcionário
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}

// Re-export for backwards compatibility
export const AddEmployeeDialog = EmployeeDialog;
