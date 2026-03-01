import { DespesaSummary, FormaPagamento } from '@/types/despesa'; 

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

const formatSafeDate = (dateVal: any): string => {
  if (!dateVal) return ''; 
  
  const d = new Date(dateVal);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0]; 
  }
  
  return typeof dateVal === 'string' ? dateVal.split('T')[0] : '';
};

export const despesaDtoResponse = (expense: ExpenseResponse): DespesaSummary => {
  return {
    id: expense.id || '', 
    nome: expense.description || 'Sem descrição',
    valor: expense.value || 0,
    
    data: formatSafeDate(expense.expenseDate),
    
    tipo: expense.expenseType || '',
    formaPagamento: expense.paymentMethod,
    idImovel: expense.targetType === 'PROPERTY' && expense.propertyId ? expense.propertyId : null,
    status: 'pendente', 
  };
};

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