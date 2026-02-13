'use client';

import { useState } from 'react';
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
import { Trash2, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

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
  // files will be handled separately in state for now, or could be added here if needed
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export function AddEmployeeDialog() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

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

  function onSubmit(data: EmployeeFormValues) {
    console.log('Form submitted:', { ...data, files });
    // TODO: Implement API call
    setOpen(false);
    form.reset();
    setFiles([]);
    toast.success('Funcionário adicionado com sucesso!');
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-8 bg-[#1447E6] text-white hover:bg-[#1447E6]/90"
        >
          Adicionar Funcionário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Funcionário</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para adicionar um novo funcionário.
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border bg-gray-50 p-2 text-sm"
                      >
                        <span
                          className="max-w-[250px] truncate"
                          title={file.name}
                        >
                          {file.name}
                        </span>
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
                className="w-full bg-[#1447E6] hover:bg-[#1447E6]/90 sm:w-auto"
              >
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
