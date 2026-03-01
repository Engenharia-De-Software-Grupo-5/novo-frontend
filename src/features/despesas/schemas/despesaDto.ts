import {
  DespesaDetail,
  DespesaRequestAPI,
  DespesaResponseAPI,
  DespesaSummary,
} from '@/types/despesa';

export const despesaDtoRequest = (data: DespesaDetail): DespesaRequestAPI => {
  return {
    targetType: data.idImovel ? 'PROPERTY' : 'CONDOMINIUM',
    description: data.nome,
    propertyId: data.idImovel || '',
    expenseType: data.tipo,
    value: data.valor,
    expenseDate: data.data,
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
    data: data.expenseDate,
    formaPagamento: data.paymentMethod,
    status: 'pago',
  };
};
