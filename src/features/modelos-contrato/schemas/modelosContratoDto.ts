import {
  ModeloContratoDetail,
  ModeloContratoRequest,
} from '@/types/modelo-contrato';

export const modelosContratoDtoRequest = (
  dto: ModeloContratoDetail
): ModeloContratoRequest => {
  return {
    name: dto.name,
    description: dto.description,
    template: dto.rawText,
  };
};
