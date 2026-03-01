import { DespesaSummary, FormaPagamento } from '@/types/despesa';

// 1. A interface exata do que o back-end responde (em inglês)
export interface ExpenseResponse {
  id: string; 
  targetType: 'CONDOMINIUM' | 'PROPERTY';
  condominiumId?: string;
  propertyId?: string;
  description: string;
  expenseType: string;
  value: number;
  expenseDate: string | Date; 
  paymentMethod: FormaPagamento;
}

// 2. Traduz do Back (Inglês) para o Front (Português) -> Usado no GET
export const despesaDtoResponse = (expense: ExpenseResponse): DespesaSummary => {
  return {
    id: expense.id, 
    nome: expense.description,
    valor: expense.value,
    data: typeof expense.expenseDate === 'string' 
      ? expense.expenseDate 
      : new Date(expense.expenseDate).toISOString().split('T')[0],
    tipo: expense.expenseType,
    formaPagamento: expense.paymentMethod,
    idImovel: expense.targetType === 'PROPERTY' && expense.propertyId ? expense.propertyId : null,
    status: 'pendente', 
  };
};

// 3. Traduz do Front (Português) para o Back (Inglês) -> Usado no POST/PUT
export const despesaDtoRequest = (despesa: Partial<DespesaSummary>) => {
  return {
    description: despesa.nome,
    value: despesa.valor,
    expenseDate: despesa.data,
    expenseType: despesa.tipo,
    paymentMethod: despesa.formaPagamento,
    targetType: despesa.idImovel ? 'PROPERTY' : 'CONDOMINIUM',
    propertyId: despesa.idImovel || undefined,
  };
};