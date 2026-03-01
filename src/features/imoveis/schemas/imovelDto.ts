import { ImovelDetail, ImovelSummary } from '@/types/imoveis';

export interface PropertyResponse {
  id: string;
  identifier: string;
  propertyAddress: any; 
  unityNumber: string;
  unityType: string;
  propertySituation: string;
  observations?: string;
  condominium?: {
    id: string;
    name: string;
  };
}

export const imovelDtoSummaryResponse = (property: PropertyResponse): ImovelSummary => {
  return {
    idImovel: property.id,
    name: property.identifier || `Unidade ${property.unityNumber || ''}`,
    tipo: property.unityType as any,
    situacao: property.propertySituation as any,
    endereco: property.propertyAddress?.rua || property.propertyAddress?.street || 'Sem endereço',
    bairro: property.propertyAddress?.bairro || property.propertyAddress?.neighborhood || '',
    cidade: property.propertyAddress?.cidade || property.propertyAddress?.city || '',
  };
};

export const imovelDtoResponse = (property: PropertyResponse): ImovelDetail => {
  return {
    idImovel: property.id,
    idCondominio: property.condominium?.id || '',
    nome: property.identifier || '',
    numeroUnidade: property.unityNumber || '',
    observacoes: property.observations || '',
    tipo: property.unityType as any,
    situacao: property.propertySituation as any,
    endereco: property.propertyAddress || {
      rua: '', numero: '', bairro: '', cidade: '', estado: ''
    },
    locatario: null, 
  };
};

export const imovelDtoRequest = (imovel: Partial<ImovelDetail>) => {
  return {
    identifier: imovel.nome,
    unityNumber: imovel.numeroUnidade || imovel.nome, 
    unityType: imovel.tipo,
    propertySituation: imovel.situacao,
    observations: imovel.observacoes,
    propertyAddress: imovel.endereco,
  };
};