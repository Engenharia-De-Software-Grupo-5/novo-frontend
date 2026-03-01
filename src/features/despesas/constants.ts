import { CheckCircle2, AlertCircle, Clock, CreditCard, Receipt, Building, Hammer, Bolt } from "lucide-react";

export const DESPESA_STATUS = [
  { label: "Pago", value: "pago", icon: CheckCircle2 },
  { label: "Pendente", value: "pendente", icon: Clock },
  { label: "Atrasado", value: "atrasado", icon: AlertCircle },
];

export const DESPESA_TIPOS = [
  { label: "Manutenção", value: "manutencao", icon: Hammer },
  { label: "Consumo", value: "consumo", icon: Bolt },
  { label: "Reforma", value: "reforma", icon: Building },
  { label: "Boleto Mensal", value: "boleto", icon: Receipt },
  { label: "Equipamentos", value: "equipamentos", icon: Hammer },
];

export const FORMA_PAGAMENTO = [
  { label: 'Pix', value: 'PIX' },
  { label: 'Boleto', value: 'BOLETO' },
  { label: 'Cartão de Crédito', value: 'CREDIT_CARD' },
  { label: 'Cartão de Débito', value: 'DEBIT_CARD' },
  { label: 'Dinheiro', value: 'CASH' },
];

export const COLUMN_LABELS: Record<string, string> = {
  nome: "Nome",
  idImovel: "ID Imóvel",
  tipo: "Tipo",
  data: "Data",
  valor: "Valor",
  formaPagamento: "Forma Pagamento",
};