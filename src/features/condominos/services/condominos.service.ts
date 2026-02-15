import { apiRequest, buildQueryString } from '@/lib/api-client';
import { CondominoFull, CondominosResponse, CondominoSummary } from '@/types/condomino';

interface GetCondominosParams {
  page: number;
  limit: number;
  search?: string;
  statuses?: string[];
}

/**
 * LISTAGEM (Server Side Friendly)
 */
export async function getCondominos(
  condominioId: string,
  params: GetCondominosParams
): Promise<CondominosResponse> {
  if (!condominioId || condominioId === 'undefined') {
    throw new Error('Condomínio ID é obrigatório');
  }

  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    search: params.search,
    status: params.statuses,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/condominios/${condominioId}/condominos${queryString}`;
  
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Erro ao buscar condôminos');
  }

  const json = await res.json();

  return {
    items: json.data,
    totalItems: json.meta.total,
    totalPages: json.meta.totalPages,
    page: json.meta.page,
    limit: json.meta.limit,
  };
}

/**
 * BUSCA ÚNICA (Para detalhes/edição)
 */
export async function getCondominoById(
  condominioId: string,
  condominoId: string
): Promise<CondominoFull> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/condominios/${condominioId}/condominos/${condominoId}`;
  
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Erro ao buscar detalhes do condômino');
  
  const json = await res.json();
  return json.data;
}

/**
 * CRIAÇÃO
 */
export async function createCondomino(condominioId: string, data: Partial<CondominoFull>) {
  return apiRequest(`/api/condominios/${condominioId}/condominos`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * ATUALIZAÇÃO (Geral)
 */
export async function updateCondomino(
  condominioId: string, 
  condominoId: string, 
  data: Partial<CondominoFull> | Partial<CondominoSummary>
) {
  return apiRequest(`/api/condominios/${condominioId}/condominos/${condominoId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * DESATIVAÇÃO (Apenas Status)
 */
export async function deactivateCondomino(condominioId: string, condominoId: string) {
  return apiRequest(`/api/condominios/${condominioId}/condominos/${condominoId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'inativo' }), 
  });
}

/**
 * EXCLUSÃO
 */
export async function deleteCondomino(condominioId: string, condominoId: string) {
  return apiRequest(`/api/condominios/${condominioId}/condominos/${condominoId}`, {
    method: 'DELETE',
  });
}