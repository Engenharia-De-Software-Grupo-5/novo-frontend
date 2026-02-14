import { PaymentResponse } from '@/types/payment';
import { apiRequest, buildQueryString } from '@/lib/api-client';

const basePath = (condId: string) => `/api/condominios/${condId}/pagamentos`;

export const getPayments = async (
  condId: string,
  params?: {
    page?: number;
    limit?: number;
    sort?: string;
    columns?: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content?: any[];
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
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};
