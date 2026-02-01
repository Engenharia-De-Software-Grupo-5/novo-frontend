import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deactivateUser } from '../../services/users.service';


interface UseDeactivateUserParams {
  condominioId: string;
}

export function useDeactivateUser({ condominioId }: UseDeactivateUserParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      deactivateUser(condominioId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', condominioId],
      });
    },

    onError: (error) => {
      console.error('Erro ao desativar usuário:', error);
    },
  });
}