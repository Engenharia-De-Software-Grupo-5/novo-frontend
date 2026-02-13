import * as z from 'zod';

export const employeeFormSchema = z.object({
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

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
