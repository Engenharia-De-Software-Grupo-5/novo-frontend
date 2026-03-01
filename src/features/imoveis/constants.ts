import { Building2, CheckCircle2, Clock3, Home, PauseCircle } from 'lucide-react';

export const DEFAULT_COND_ID = 'COND-001';

export const IMOVEIS_TIPOS = [
  { label: 'Apartamento', value: 'APARTMENT', icon: Building2 },
  { label: 'Casa', value: 'HOUSE', icon: Home },
] as const;

export const IMOVEIS_SITUACOES = [
  { label: 'Ativo', value: 'ACTIVE', icon: CheckCircle2 },
  { label: 'Inativo', value: 'INACTIVE', icon: PauseCircle },
  { label: 'Manutenção', value: 'MAINTENANCE', icon: Clock3 },
  { label: 'Na Planta', value: 'OFF_PLAN', icon: Clock3 },
] as const;

export const IMOVEIS_COLUMN_LABELS: Record<string, string> = {
  name: 'Nome Interno',
  tipo: 'Tipo',
  situacao: 'Situação',
  endereco: 'Endereço',
  bairro: 'Bairro',
  cidade: 'Cidade',
};