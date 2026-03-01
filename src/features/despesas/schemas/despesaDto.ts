import { DespesaDetail, DespesaRequestAPI } from '@/types/despesa';

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
