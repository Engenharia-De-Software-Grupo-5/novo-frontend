import { EmployeeDetail, EmployeeResponse } from '@/types/employee';
import { apiRequest, buildQueryString } from '@/lib/api-client';

const basePath = (condId: string) => `/api/condominios/${condId}/funcionarios`;

export const getFuncionarios = async (
  condId: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string | string[];
    status?: string | string[];
  }
): Promise<EmployeeResponse> => {
  try {
    const query = buildQueryString({
      page: params?.page,
      limit: params?.limit,
      name: params?.search,
      role: params?.role
        ? Array.isArray(params.role)
          ? params.role
          : [params.role]
        : undefined,
      status: params?.status
        ? Array.isArray(params.status)
          ? params.status
          : [params.status]
        : undefined,
    });

    return await apiRequest<EmployeeResponse>(`${basePath(condId)}${query}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return {
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};

export const getFuncionarioById = async (
  condId: string,
  funcId: string
): Promise<EmployeeDetail> => {
  return apiRequest<EmployeeDetail>(`${basePath(condId)}/${funcId}`, {
    method: 'GET',
  });
};

export const postFuncionario = async (
  condId: string,
  data: Partial<EmployeeDetail>
): Promise<void> => {
  await apiRequest(basePath(condId), {
    method: 'POST',
    body: data,
  });
};

export const putFuncionario = async (
  condId: string,
  funcId: string,
  data: Partial<EmployeeDetail>
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${funcId}`, {
    method: 'PUT',
    body: data,
  });
};

export const patchFuncionario = async (
  condId: string,
  funcId: string,
  data: Record<string, unknown>
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${funcId}`, {
    method: 'PATCH',
    body: data,
  });
};

export const deleteFuncionario = async (
  condId: string,
  funcId: string
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${funcId}`, {
    method: 'DELETE',
  });
};
