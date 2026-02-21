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

const getSeededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateFile = (
  id: string,
  name: string,
  seed: number
): FileAttachment => ({
  id,
  name,
  type: 'application/pdf',
  size: 1024 * (Math.floor(getSeededRandom(seed) * 5) + 1),
  url: '#',
});

// Base date fixa para mocks determinísticos (não usa Date.now())
const BASE_DATE = new Date('2025-06-15');

export const mockPaymentDetails: PaymentDetail[] = Array.from({
  length: 50,
}).map((_, i) => {
  const seed = i * 777;
  const name = names[i % names.length];
  const status =
    statuses[Math.floor(getSeededRandom(seed + 1) * statuses.length)];
  const type =
    paymentTypes[Math.floor(getSeededRandom(seed + 2) * paymentTypes.length)];
  const hasProof = getSeededRandom(seed + 3) > 0.5;

  const dueDate = new Date(BASE_DATE);
  dueDate.setDate(
    dueDate.getDate() + Math.floor(getSeededRandom(seed + 4) * 30) - 15
  );
  const dueDateStr = dueDate.toISOString().split('T')[0];

  let paymentDate: string | undefined = undefined;
  if (status === 'pago') {
    const pDate = new Date(dueDate);
    pDate.setDate(pDate.getDate() - Math.floor(getSeededRandom(seed + 5) * 5));
    paymentDate = pDate.toISOString().split('T')[0];
  }

  return {
    id: `${i + 1}`,
    employeeId: `${(i % names.length) + 1}`,
    name: name,
    role: roles[i % roles.length],
    value: Math.floor(getSeededRandom(seed + 6) * 5000) + 1200,
    status: status,
    paymentDate: paymentDate,
    type: type,
    dueDate: dueDateStr,
    observation:
      getSeededRandom(seed + 7) > 0.7
        ? 'Pagamento referente ao mês anterior.'
        : undefined,
    proofs:
      status === 'pago' && hasProof
        ? Array.from({
            length: Math.floor(getSeededRandom(seed + 8) * 3) + 1,
          }).map((_, idx) =>
            generateFile(
              `proof-${i}-${idx}`,
              `comprovante_${i}_${idx}.pdf`,
              seed + 9 + idx
            )
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
