import { apiRequest, buildQueryString } from '@/lib/api-client';
import {
  CondominoCreateDTO,
  CondominoFull,
  CondominosResponse
} from '@/types/condomino';


interface GetCondominosParams {
  page: number;
  limit: number;
  search?: string;
  statuses?: string[];
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
 * BUSCA ÚNICA (Para detalhes)
 */
export async function getCondominoById(
  condominioId: string,
  condominoId: string
): Promise<CondominoFull> {
  
  const url = `${baseUrl}/api/condominios/${condominioId}/condominos/${condominoId}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Erro ao buscar detalhes do condômino');

  const json = await res.json();
  return json.data;
}


export async function createCondomino(
  condominioId: string,
  data: CondominoCreateDTO
) {
 
  const formData = new FormData();

  const { documents, ...rest } = data;
  formData.append('data', JSON.stringify(rest));

  if (documents) {
    if (documents.rg instanceof File) {
      formData.append('files', documents.rg);
    }

    if (documents.cpf instanceof File) {
      formData.append('files', documents.cpf);
    }

    if (documents.incomeProof instanceof File) {
      formData.append('files', documents.incomeProof);
    }
  }


  const url = `${baseUrl}/api/condominios/${condominioId}/condominos`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  console.log('STATUS:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API ERROR:', errorText);
    throw new Error('Erro ao criar condômino');
  }

  const result = await response.json();
  console.log('API SUCCESS:', result);

  return result;
}

/**
 * ATUALIZAÇÃO GENÉRICA (Padrão igual ao de usuários)
 */
export async function updateCondomino(
  condominioId: string, 
  condominoId: string, 
  data: Partial<CondominoFull>
) {
  return apiRequest(`/api/condominios/${condominioId}/condominos/${condominoId}`, {
    method: 'PATCH',
    body: data,
  });
}

/**
 * Helper específico (opcional, igual ao changeUserStatus)
 */
export async function changeCondominoStatus(
  condominioId: string,
  condominoId: string,
  status: 'ativo' | 'inativo'
) {
  return updateCondomino(condominioId, condominoId, { status });
}

/**
 * EXCLUSÃO
 */
export async function deleteCondomino(
  condominioId: string,
  condominoId: string
) {
  return apiRequest(
    `/api/condominios/${condominioId}/condominos/${condominoId}`,
    {
      method: 'DELETE',
    }
  );
}
