import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../../services/users.service';
import { UsersResponse } from '../../services/users';

export function useDeleteUser(condominioId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    string // userId
  >({
    mutationFn: (userId) =>
      deleteUser(condominioId, userId),

    onSuccess: (_response, userId) => {
      queryClient.setQueriesData(
        {
          queryKey: ['users', condominioId],
        },
        (old: UsersResponse | undefined) => {
          if (!old) return old;

          return {
            ...old,
            totalItems: old.totalItems - 1,
            items: old.items.filter((user) => user.id !== userId),
          };
        }
      );
    },

    onError: (error) => {
      console.error('Erro ao excluir usuário:', error);
    },
  });
}
