import { PaymentDetail, PaymentResponse } from '@/types/payment';
import { apiRequest, buildQueryString } from '@/lib/api-client';
import { buildFormDataBody, FileUploadOptions } from '@/lib/form-data';

const basePath = (condId: string) => `/api/condominios/${condId}/pagamentos`;

export const getPayments = async (
  condId: string,
  params?: {
    page?: number;
    limit?: number;
    sort?: string;
    columns?: string[];
    content?: string[];
  }
): Promise<PaymentResponse> => {
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

    return await apiRequest<PaymentResponse>(`${basePath(condId)}${query}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return {
      items: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};

export const getPaymentById = async (
  condId: string,
  paymentId: string
): Promise<PaymentDetail> => {
  return apiRequest<PaymentDetail>(`${basePath(condId)}/${paymentId}`, {
    method: 'GET',
  });
};

export const postPayment = async (
  condId: string,
  data: Partial<PaymentDetail>,
  options?: FileUploadOptions
): Promise<void> => {
  await apiRequest(basePath(condId), {
    method: 'POST',
    body: buildFormDataBody(data, options),
  });
};

export const putPayment = async (
  condId: string,
  paymentId: string,
  data: Partial<PaymentDetail>,
  options?: FileUploadOptions
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${paymentId}`, {
    method: 'PUT',
    body: buildFormDataBody(data, options),
  });
};

export const patchPayment = async (
  condId: string,
  paymentId: string,
  data: Record<string, unknown>
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${paymentId}`, {
    method: 'PATCH',
    body: data,
  });
};

export const deletePayment = async (
  condId: string,
  paymentId: string
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${paymentId}`, {
    method: 'DELETE',
  });
};
