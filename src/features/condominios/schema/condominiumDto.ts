import {
  Condominium,
  CondominiumRequest,
  CondominiumResponse,
} from '@/types/condominium';

export const condominiumDtoResponse = (
  condominium: CondominiumResponse
): Condominium => {
  return {
    id: condominium.id,
    name: condominium.name,
  };
};

export const condominiumDtoRequest = (
  condominium: Partial<Condominium>
): CondominiumRequest => {
  return {
    name: condominium.name || '',
    description: 'description',
    address: {
      zip: '12345678',
      neighborhood: 'neighborhood',
      city: 'city',
      complement: 'complement',
      number: 1,
      street: 'street',
      uf: 'SP',
    },
  };
};
