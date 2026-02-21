import { Building2, CheckCircle2, Clock3, Home, PauseCircle } from 'lucide-react';

export const DEFAULT_COND_ID = 'COND-001';

export const IMOVEIS_TIPOS = [
  { label: 'Apartamento', value: 'apartamento', icon: Building2 },
  { label: 'Casa', value: 'casa', icon: Home },
] as const;

export const IMOVEIS_SITUACOES = [
  { label: 'Ativo', value: 'ativo', icon: CheckCircle2 },
  { label: 'Inativo', value: 'inativo', icon: PauseCircle },
  { label: 'Manutenção', value: 'manutenção', icon: Clock3 },
  { label: 'Na Planta', value: 'na planta', icon: Clock3 },
] as const;

export const IMOVEIS_COLUMN_LABELS: Record<string, string> = {
  name: 'Identificação',
  tipo: 'Tipo',
  situacao: 'Situação',
  endereco: 'Endereço',
  bairro: 'Bairro',
  cidade: 'Cidade',
};
