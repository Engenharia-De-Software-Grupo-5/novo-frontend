import { z } from "zod";

export const despesaSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  valor: z.number().min(0.01, "O valor deve ser maior que zero."),
  data: z.string().min(1, "A data é obrigatória."),
  tipo: z.string().min(1, "Selecione o tipo."),
  formaPagamento: z.string().min(1, "Selecione a forma de pagamento."),
  idImovel: z.string().optional().nullable(),
});

export type DespesaFormData = z.infer<typeof despesaSchema>;