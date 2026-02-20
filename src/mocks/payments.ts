import { EMPLOYEE_ROLES } from '../features/funcionarios/constants';
import { FileAttachment } from '../types/file';
import {
  PaymentDetail,
  PaymentStatus,
  PaymentSummary,
  PaymentType,
} from '../types/payment';

const roles = EMPLOYEE_ROLES.map((r) => r.value);

const names = [
  'Ana Silva',
  'Carlos Souza',
  'Mariana Oliveira',
  'Pedro Santos',
  'Julia Lima',
  'Rafael Costa',
  'Fernanda Pereira',
  'Lucas Rodrigues',
  'Beatriz Almeida',
  'Gabriel Nascimento',
];

const paymentTypes: PaymentType[] = [
  'salário',
  'hora extra',
  'adicional noturno',
  'comissão',
  'bonificação',
  'ferias',
  '13º salário',
  'adiantamento',
  'serviço',
  'outros',
];

const statuses: PaymentStatus[] = ['agendado', 'pago', 'atrasado'];

const generateFile = (id: string, name: string): FileAttachment => ({
  id,
  name,
  type: 'application/pdf',
  size: 1024 * (Math.floor(Math.random() * 5) + 1),
  url: '#',
});

export const mockPaymentDetails: PaymentDetail[] = Array.from({
  length: 50,
}).map((_, i) => {
  const name = names[i % names.length];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const type = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
  const hasProof = Math.random() > 0.5;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) - 15);
  const dueDateStr = dueDate.toISOString().split('T')[0];

  let paymentDate: string | undefined = undefined;
  if (status === 'pago') {
    const pDate = new Date(dueDate);
    pDate.setDate(pDate.getDate() - Math.floor(Math.random() * 5));
    paymentDate = pDate.toISOString().split('T')[0];
  } else if (status === 'atrasado') {
    // expired due date
    const pDate = new Date();
    pDate.setDate(pDate.getDate() - Math.floor(Math.random() * 10) - 1);
    // dueDate should be in the past for 'atrasado'
    // but we set dueDate above randomly around today. keeping it simple.
  }

  return {
    id: `${i + 1}`,
    employeeId: `${(i % names.length) + 1}`,
    name: name,
    role: roles[i % roles.length],
    value: Math.floor(Math.random() * 5000) + 1200,
    status: status,
    paymentDate: paymentDate,
    type: type,
    dueDate: dueDateStr,
    observation:
      Math.random() > 0.7 ? 'Pagamento referente ao mês anterior.' : undefined,
    proofs:
      status === 'pago' && hasProof
        ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
            (_, idx) =>
              generateFile(`proof-${i}-${idx}`, `comprovante_${i}_${idx}.pdf`)
          )
        : [],
  };
});

export const mockPaymentSummaries: PaymentSummary[] = mockPaymentDetails.map(
  (detail) => ({
    id: detail.id,
    name: detail.name,
    role: detail.role,
    value: detail.value,
    status: detail.status,
    paymentDate: detail.paymentDate,
  })
);
