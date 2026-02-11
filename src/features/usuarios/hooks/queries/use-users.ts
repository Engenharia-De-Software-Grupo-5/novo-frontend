import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/features/usuarios/services/users.service';
import { Role, Status } from '@/types/user';


interface Params {
  condominioId: string;
  page: number;
  limit: number;
  filter: string;
}


export function useUsers({
  condominioId,
  page,
  limit,
  filter,
  roles,
  statuses, // novo
}: Params & { roles?: Role[]; statuses?: Status[] }) {
  return useQuery({
    queryKey: ['users', condominioId, page, limit, filter, roles, statuses],
    queryFn: async () => {
      const res = await getUsers(condominioId!, page, limit);

      let filteredItems = res.items;

      // filtro de texto
      if (filter) {
        filteredItems = filteredItems.filter((u) =>
          `${u.name} ${u.email}`.toLowerCase().includes(filter.toLowerCase())
        );
      }

      // filtro de roles
      if (roles && roles.length > 0) {
        filteredItems = filteredItems.filter((u) => roles.includes(u.role as Role));
      }

      // filtro de status
      if (statuses && statuses.length > 0) {
        filteredItems = filteredItems.filter((u) => statuses.includes(u.status));
      }

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
