import {
  DespesaDetail,
  DespesaRequestAPI,
  DespesaResponseAPI,
  DespesaSummary,
} from '@/types/despesa';

export const formatDate = (date: string) => {
  return new Date(date).toISOString().split('T')[0];
};

export const despesaDtoRequest = (data: DespesaDetail): DespesaRequestAPI => {
  return {
    targetType: data.idImovel ? 'PROPERTY' : 'CONDOMINIUM',
    description: data.nome,
    propertyId: data.idImovel || '',
    expenseType: data.tipo,
    value: data.valor,
    expenseDate: formatDate(data.data),
    paymentMethod: data.formaPagamento.toUpperCase(),
    // filesToKeep: [],
  };
};

export const despesaDtoResponse = (
  data: DespesaResponseAPI
): DespesaSummary => {
  return {
    id: data.id,
    nome: data.description,
    idImovel: data.propertyId,
    tipo: data.expenseType,
    valor: data.value,
    data: formatDate(data.expenseDate),
    formaPagamento: data.paymentMethod,
  };
};

export const despesaDtoResponseDetail = (
  data: DespesaResponseAPI
): DespesaDetail => {
  return {
    id: data.id,
    nome: data.description,
    idImovel: data.propertyId,
    tipo: data.expenseType,
    valor: data.value,
    data: formatDate(data.expenseDate),
    formaPagamento: data.paymentMethod,
    anexos: data.expenseFiles,
  };
};
