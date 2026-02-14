import { useQuery } from "@tanstack/react-query";
import { getCondominos } from "@/features/condominos/services/condominos.service";
import { CondominiumStatus } from '@/types/condomino';

interface Params {
  condominiumId: string;
  page: number;
  limit: number;
  cpfFilter?: string;        // filtro por CPF
  statusFilter?: CondominiumStatus[];   // filtro por status
}

export function useCondominos({
  condominiumId,
  page,
  limit,
  cpfFilter = '',
  statusFilter = [],
}: Params) {
  return useQuery({
    queryKey: ['condominos', condominiumId, page, limit, cpfFilter, statusFilter],
    queryFn: async () => {
      const res = await getCondominos(condominiumId, page, limit);

      let filteredItems = res.data;

      // filtro de CPF
      if (cpfFilter) {
        filteredItems = filteredItems.filter((c) =>
          c.cpf.includes(cpfFilter)
        );
      }

      // filtro de status
      if (statusFilter.length > 0) {
        filteredItems = filteredItems.filter((c) =>
          statusFilter.includes(c.status)
        );
      }

      return {
        ...res,
        data: filteredItems,
        totalItems: filteredItems.length,
        totalPages: Math.max(1, Math.ceil(filteredItems.length / limit)),
      };
    },
    enabled: !!condominiumId,
  });
}
