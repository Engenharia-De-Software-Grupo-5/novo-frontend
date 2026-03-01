import * as z from 'zod';

export const imovelFormSchema = z.object({
  nome: z.string().min(1, {
    message: 'Nome é obrigatório.',
  }),
  status: z.enum(['vago', 'ocupado', 'manutencao', 'na planta'], {
    message: 'Status é obrigatório.',
  }),
  tipo: z.enum(['casa', 'apartamento'], {
    message: 'Tipo é obrigatório.',
  }),
  endereco: z.object({
    logradouro: z.string().min(1, {
      message: 'Logradouro é obrigatório.',
    }),
    numero: z.string().min(1, {
      message: 'Número é obrigatório.',
    }),
    complemento: z.string().optional(),
    bairro: z.string().min(1, {
      message: 'Bairro é obrigatório.',
    }),
    cidade: z.string().min(1, {
      message: 'Cidade é obrigatório.',
    }),
    cep: z.string().optional(),
  }),
});

export type ImovelFormValues = z.infer<typeof imovelFormSchema>;
