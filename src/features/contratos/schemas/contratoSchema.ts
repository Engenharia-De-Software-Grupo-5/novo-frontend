import { z } from 'zod';

const statusValues = ['ativo', 'vencido', 'agendado'] as const;

export const contratoSchema = z.object({
  tenantName: z.string().min(1, 'Nome do locatário é obrigatório'),
  propertyAddress: z.string().min(1, 'Endereço do imóvel é obrigatório'),
  property: z.string().min(1, 'Imóvel é obrigatório'),
  status: z.enum(statusValues),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  endDate: z.string().min(1, 'Data de vencimento é obrigatória'),
}).refine(
  (data) => new Date(data.endDate) >= new Date(data.startDate),
  {
    path: ['endDate'],
    message: 'Data de vencimento deve ser maior ou igual à data de início',
  }
);

export type ContratoFormData = z.infer<typeof contratoSchema>;
