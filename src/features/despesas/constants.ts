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
  { label: "PIX", value: "pix", icon: CreditCard },
  { label: "Boleto", value: "boleto", icon: Receipt },
  { label: "Transferência", value: "transferencia", icon: Building },
];

export const COLUMN_LABELS: Record<string, string> = {
  nome: "Nome",
  idImovel: "ID Imóvel",
  tipo: "Tipo",
  data: "Data",
  valor: "Valor",
  formaPagamento: "Forma Pagamento",
};