import { z } from 'zod';

export const contratoSchema = z
  .object({
    tenantName: z.string().min(1, 'Nome do locatário é obrigatório'),
    property: z.string().min(1, 'Imóvel é obrigatório'),
    createdAt: z.string().min(1, 'Data de criação é obrigatória'),
    dueDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  })
  .refine((data) => new Date(data.dueDate) >= new Date(data.createdAt), {
    path: ['dueDate'],
    message: 'Data de vencimento deve ser maior ou igual à data de criação',
  });

export type ContratoFormData = z.infer<typeof contratoSchema>;
