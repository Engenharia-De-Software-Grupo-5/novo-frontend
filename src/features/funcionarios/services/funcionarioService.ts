import { EmployeeDetail, EmployeeResponse } from '@/types/employee';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.search) queryParams.set('name', params.search);
    if (params?.role) {
      if (Array.isArray(params.role)) {
        params.role.forEach((r) => queryParams.append('role', r));
      } else {
        queryParams.set('role', params.role);
      }
    }
    if (params?.status) {
      if (Array.isArray(params.status)) {
        params.status.forEach((s) => queryParams.append('status', s));
      } else {
        queryParams.set('status', params.status);
      }
    }

    const queryString = queryParams.toString();
    const url = `${API_URL}/api/condominios/${condId}/funcionarios${queryString ? `?${queryString}` : ''}`;

    console.log(url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch employees: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    // Return empty array or rethrow depending on desired error handling
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };
  }
};

export const deleteFuncionario = async (
  condId: string,
  funcId: string
): Promise<void> => {
  const url = `${API_URL}/api/condominios/${condId}/funcionarios/${funcId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete employee: ${response.statusText}`);
  }
};

export const patchFuncionario = async (
  condId: string,
  funcId: string,
  data: Record<string, unknown>
): Promise<void> => {
  const url = `${API_URL}/api/condominios/${condId}/funcionarios/${funcId}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update employee: ${response.statusText}`);
  }
};

export const getFuncionarioById = async (
  condId: string,
  funcId: string
): Promise<EmployeeDetail> => {
  const url = `${API_URL}/api/condominios/${condId}/funcionarios/${funcId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch employee: ${response.statusText}`);
  }

  return await response.json();
};

export const putFuncionario = async (
  condId: string,
  funcId: string,
  data: Partial<EmployeeDetail>
): Promise<void> => {
  const url = `${API_URL}/api/condominios/${condId}/funcionarios/${funcId}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update employee: ${response.statusText}`);
  }
};
