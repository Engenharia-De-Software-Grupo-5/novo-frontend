import * as z from 'zod';

import { PAYMENT_TYPES } from '../constants';

export const paymentFormSchema = z
  .object({
    employeeId: z
      .string({ message: 'Selecione um funcionário.' })
      .min(1, 'Selecione um funcionário.'),
    type: z.enum(PAYMENT_TYPES.map((t) => t.value) as [string, ...string[]], {
      message: 'Selecione o tipo de pagamento.',
    }),
    amount: z
      .string({ message: 'Informe o valor.' })
      .min(1, 'Informe o valor.'),
    dueDate: z.string().optional(),
    paymentDate: z.string().optional(),
    observation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.dueDate && !data.paymentDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe a data de vencimento ou a data de pagamento.',
        path: ['dueDate'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe a data de vencimento ou a data de pagamento.',
        path: ['paymentDate'],
      });
    }
  });

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
