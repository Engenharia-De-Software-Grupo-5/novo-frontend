import cobrancasJson from './cobrancas.json';

import { CobrancaDetail, CobrancaSummary, CobrancaTenant } from '@/types/cobranca';

interface CobrancasMockPayload {
  tenants: CobrancaTenant[];
  charges: CobrancaDetail[];
}

const payload = cobrancasJson as CobrancasMockPayload;

export const mockCobrancaTenants: CobrancaTenant[] = payload.tenants;

export const mockCobrancaDetails: CobrancaDetail[] = payload.charges;

export const mockCobrancaSummaries: CobrancaSummary[] = mockCobrancaDetails.map(
  (detail) => ({
    id: detail.id,
    tenantId: detail.tenantId,
    name: detail.name,
    email: detail.email,
    cpf: detail.cpf,
    type: detail.type,
    status: detail.status,
    dueDate: detail.dueDate,
    value: detail.value,
    isActive: detail.isActive,
  })
);
