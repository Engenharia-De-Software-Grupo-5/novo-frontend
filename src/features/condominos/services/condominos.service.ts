import { apiRequest, buildQueryString } from '@/lib/api-client';
import {
  CondominoCreateDTO,
  CondominoFull,
  CondominosResponse,
} from '@/types/condomino';


const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getCondominos = async (
  condId: string,
  params?: {
    page?: number;
    limit?: number;
    columns?: string[];
    content?: string[];
    sort?: string;
  }
): Promise<CondominosResponse> => {
  try {
    const queryParams: Record<string, string | number | string[] | undefined> = {
      page: params?.page,
      limit: params?.limit,
      sort: params?.sort,
    };

    if (params?.columns && params?.content && params.columns.length > 0) {
      queryParams.columns = params.columns;
      queryParams.content = params.content;
    }

    const query = buildQueryString(queryParams);

    return await apiRequest<CondominosResponse>(`/api/condominios/${condId}/condominos${query}`, {
          method: 'GET',
        });

  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};
/**
 * BUSCA ÚNICA (Para detalhes)
 */
export async function getCondominoById(
  condominioId: string,
  condominoId: string
): Promise<CondominoFull> {
  const response = await apiRequest<{ data: CondominoFull }>(
    `/api/condominios/${condominioId}/condominos/${condominoId}`,
    { method: 'GET' }
  );
  return response.data;
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
