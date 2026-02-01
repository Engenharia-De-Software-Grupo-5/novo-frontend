import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/feature/usuarios/services/users.service';


interface Params {
  condominioId: string;
  page: number;
  limit: number;
  filter: string;
}


export function useUsers({ condominioId, page, limit, filter }: Params) {
  return useQuery({
    queryKey: ['users', condominioId, page, limit, filter],
    queryFn: async () => {
      const res = await getUsers(condominioId!, page, limit);

      // filtro client-side (temporário, opcional)
      if (!filter) return res;

      const filteredItems = res.items.filter((u) =>
        `${u.name} ${u.email}`.toLowerCase().includes(filter.toLowerCase())
      );

      return {
        ...res,
        items: filteredItems,
        totalItems: filteredItems.length,
        totalPages: Math.max(1, Math.ceil(filteredItems.length / limit)),
      };
    },
    enabled: !!condominioId,
  });
}
