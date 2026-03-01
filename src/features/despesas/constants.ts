import {
  AlertCircle,
  Bolt,
  Building,
  CheckCircle2,
  Clock,
  CreditCard,
  Hammer,
  Receipt,
} from 'lucide-react';

export const DESPESA_STATUS = [
  { label: 'Pago', value: 'pago', icon: CheckCircle2 },
  { label: 'Pendente', value: 'pendente', icon: Clock },
  { label: 'Atrasado', value: 'atrasado', icon: AlertCircle },
];

export const DESPESA_TIPOS = [
  { label: 'Manutenção', value: 'MANUTENCAO', icon: Hammer },
  { label: 'Consumo', value: 'CONSUMO', icon: Bolt },
  { label: 'Reforma', value: 'REFORMA', icon: Building },
  { label: 'Boleto Mensal', value: 'BOLETO', icon: Receipt },
  { label: 'Equipamentos', value: 'EQUIPAMENTOS', icon: Hammer },
];

export const FORMA_PAGAMENTO = [
  { label: 'PIX', value: 'PIX', icon: CreditCard },
  { label: 'Boleto', value: 'BOLETO', icon: Receipt },
  { label: 'Transferência', value: 'TRANSFER', icon: Building },
  { label: 'Cartão Crédito', value: 'CREDIT_CARD', icon: CreditCard },
  { label: 'Cartão Débito', value: 'DEBIT_CARD', icon: CreditCard },
  { label: 'Dinheiro', value: 'CASH', icon: CreditCard },
];

export const COLUMN_LABELS: Record<string, string> = {
  nome: 'Nome',
  idImovel: 'ID Imóvel',
  tipo: 'Tipo',
  data: 'Data',
  valor: 'Valor',
  formaPagamento: 'Forma Pagamento',
};
