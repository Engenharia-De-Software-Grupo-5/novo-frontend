import { z } from 'zod';

export const contratoSchema = z
  .object({
    tenantId: z.string().min(1, 'Locatário é obrigatório'),
    propertyId: z.string().min(1, 'Imóvel é obrigatório'),
    content: z.string().min(1, 'Conteúdo é obrigatório'),
    startDate: z.string().min(1, 'Data de início é obrigatória'),
    dueDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  })
  .refine((data) => new Date(data.dueDate) >= new Date(data.startDate), {
    path: ['dueDate'],
    message: 'Data de vencimento deve ser maior ou igual à data de início',
  });

export type ContratoFormData = z.infer<typeof contratoSchema>;
