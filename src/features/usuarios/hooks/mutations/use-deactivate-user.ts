import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deactivateUser } from '../../services/users.service';
import { UsersResponse } from '../../services/users';

export function useDeactivateUser(condominioId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    string // userId
  >({
    mutationFn: (userId) =>
      deactivateUser(condominioId, userId),

    onSuccess: (_response, userId) => {
      queryClient.setQueriesData(
        {
          queryKey: ['users', condominioId],
        },
        (old: UsersResponse | undefined) => {
          if (!old) return old;

          return {
            ...old,
            items: old.items.map((user) =>
              user.id === userId
                ? { ...user, status: 'inativo' }
                : user
            ),
          };
        }
      );
    },

    onError: (error) => {
      console.error('Erro ao desativar usuário:', error);
    },
  });
}
