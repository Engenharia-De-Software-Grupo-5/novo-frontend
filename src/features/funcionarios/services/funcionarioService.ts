import { EmployeeDetail, EmployeeResponse } from '@/types/employee';
import { apiRequest, buildQueryString } from '@/lib/api-client';
import { buildFormDataBody, FileUploadOptions } from '@/lib/form-data';

const basePath = (condId: string) => `/api/condominios/${condId}/funcionarios`;

export const getFuncionarios = async (
  condId: string,
  params?: {
    page?: number;
    limit?: number;
    columns?: string[];
    content?: string[];
    sort?: string;
  }
): Promise<EmployeeResponse> => {
  try {
    const queryParams: Record<string, string | number | string[] | undefined> =
      {
        page: params?.page,
        limit: params?.limit,
        sort: params?.sort,
      };

    // Add columns and content arrays for filtering
    if (params?.columns && params?.content && params.columns.length > 0) {
      queryParams.columns = params.columns;
      queryParams.content = params.content;
    }

    const query = buildQueryString(queryParams);

    return await apiRequest<EmployeeResponse>(`${basePath(condId)}${query}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return {
      items: [],
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
  data: Partial<EmployeeDetail>,
  options?: FileUploadOptions
): Promise<void> => {
  await apiRequest(basePath(condId), {
    method: 'POST',
    body: buildFormDataBody(data, options),
  });
};

export const putFuncionario = async (
  condId: string,
  funcId: string,
  data: Partial<EmployeeDetail>,
  options?: FileUploadOptions
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${funcId}`, {
    method: 'PUT',
    body: buildFormDataBody(data, options),
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
