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
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Trash2, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { EmployeeDetail } from '@/types/employee';

import { EMPLOYEE_ROLES } from '../constants';
import {
  employeeFormSchema,
  EmployeeFormValues,
} from '../schemas/employeeSchema';
import {
  postFuncionario,
  putFuncionario,
} from '../services/funcionarioService';

interface EmployeeDialogProps {
  readonly employee?: EmployeeDetail;
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}

export function EmployeeDialog({
  employee,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: EmployeeDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
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
      setInitialAttachments(employee.Contracts ?? []);
    }
  }, [employee, open, form, setInitialAttachments]);

  async function onSubmit(data: EmployeeFormValues) {
    try {
      setIsSubmitting(true);

      // IDs of existing files the user chose to keep (not removed in the UI)
      const existingFileIds = existingAttachments.map((a) => a.id);

      if (isEditing) {
        await putFuncionario(
          condId,
          employee.id,
          { ...data },
          {
            newFiles: files,
            existingFileIds,
          }
        );
        toast.success(`Funcionário "${data.name}" atualizado com sucesso!`);
      } else {
        await postFuncionario(
          condId,
          { ...data },
          {
            newFiles: files.length > 0 ? files : undefined,
          }
        );
        toast.success(`Funcionário "${data.name}" adicionado com sucesso!`);
      }
      router.refresh();
      setOpen(false);
      if (!isEditing) {
        form.reset();
        resetFiles();
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

  let buttonLabel = 'Salvar';
  if (isSubmitting) {
    buttonLabel = isEditing ? 'Salvando...' : 'Adicionando...';
  }

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
                    {EMPLOYEE_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
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
            <label
              htmlFor="employee-file-upload"
              className="text-sm leading-none font-medium"
            >
              Contrato (PDF)
            </label>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Input
                  id="employee-file-upload"
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

                  {/* Existing files (from server) */}
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
              {buttonLabel}
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
