import { EmployeeDetail, EmployeeResponse } from '@/types/employee';
import { apiRequest, buildQueryString } from '@/lib/api-client';

const basePath = (condId: string) => `/api/condominios/${condId}/funcionarios`;

interface FileUploadOptions {
  /** New files to upload */
  newFiles?: File[];
  /** IDs of existing contracts that the user chose to KEEP (the ones NOT removed) */
  existingContractIds?: string[];
}

/**
 * Builds the request body for employee creation/update.
 *
 * Uses FormData (multipart/form-data) when there are new files to upload
 * or when the list of existing contracts has been modified.
 * Otherwise, falls back to plain JSON.
 */
function buildEmployeeBody(
  data: Partial<EmployeeDetail>,
  options?: FileUploadOptions
): FormData | Partial<EmployeeDetail> {
  const { newFiles = [], existingContractIds } = options ?? {};

  const hasNewFiles = newFiles.length > 0;
  const hasExistingContractChanges = existingContractIds !== undefined;

  // If there's nothing file-related, send plain JSON
  if (!hasNewFiles && !hasExistingContractChanges) {
    return data;
  }

  const formData = new FormData();
  formData.append('data', JSON.stringify(data));

  // Send the list of existing contract IDs to keep
  if (existingContractIds) {
    formData.append('existingContractIds', JSON.stringify(existingContractIds));
  }

  // Append each new file
  newFiles.forEach((file) => {
    formData.append('contracts', file);
  });

  return formData;
}

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
  data: Partial<EmployeeDetail>,
  options?: FileUploadOptions
): Promise<void> => {
  await apiRequest(basePath(condId), {
    method: 'POST',
    body: buildEmployeeBody(data, options),
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
    body: buildEmployeeBody(data, options),
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
