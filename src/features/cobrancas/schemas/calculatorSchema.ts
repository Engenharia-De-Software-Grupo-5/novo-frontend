import * as z from 'zod';

export const calculatorSchema = z.object({
  dueDate: z.string().min(1, 'Informe a data de vencimento.'),
  paymentDate: z.string().min(1, 'Informe a data de pagamento.'),
  value: z
    .string()
    .min(1, 'Informe o valor.')
    .refine((value) => Number(value) > 0, 'Informe um valor maior que zero.'),
  penalty: z
    .string()
    .min(1, 'Informe a multa.')
    .refine((value) => Number(value) >= 0, 'A multa não pode ser negativa.'),
  interest: z
    .string()
    .min(1, 'Informe os juros.')
    .refine((value) => Number(value) >= 0, 'Os juros não podem ser negativos.'),
});

export type CalculatorFormValues = z.infer<typeof calculatorSchema>;
