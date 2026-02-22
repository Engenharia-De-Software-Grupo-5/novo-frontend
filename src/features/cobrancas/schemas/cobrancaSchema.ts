import * as z from 'zod';

import {
  COBRANCA_PAYMENT_METHODS,
  COBRANCA_STATUSES,
  COBRANCA_TYPES,
} from '../constants';

const cobrancaTypeValues = COBRANCA_TYPES.map((item) => item.value) as [
  (typeof COBRANCA_TYPES)[number]['value'],
  ...(typeof COBRANCA_TYPES)[number]['value'][],
];

const cobrancaStatusValues = COBRANCA_STATUSES.map((item) => item.value) as [
  (typeof COBRANCA_STATUSES)[number]['value'],
  ...(typeof COBRANCA_STATUSES)[number]['value'][],
];

const cobrancaPaymentMethodValues = COBRANCA_PAYMENT_METHODS.map(
  (item) => item.value
) as [
  (typeof COBRANCA_PAYMENT_METHODS)[number]['value'],
  ...(typeof COBRANCA_PAYMENT_METHODS)[number]['value'][],
];

export const cobrancaFormSchema = z.object({
  tenantId: z.string().min(1, 'Selecione um condômino.'),
  type: z.enum(cobrancaTypeValues, {
    message: 'Selecione um tipo.',
  }),
  status: z
    .enum(cobrancaStatusValues, {
      message: 'Selecione uma situação.',
    })
    .optional(),
  dueDate: z.string().min(1, 'Informe a data de vencimento.'),
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
  paymentMethod: z.enum(cobrancaPaymentMethodValues, {
    message: 'Selecione uma forma de pagamento.',
  }),
  observation: z.string().optional(),
});

export type CobrancaFormValues = z.infer<typeof cobrancaFormSchema>;
