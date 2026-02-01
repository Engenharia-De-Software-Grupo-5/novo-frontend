import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../../services/users.service';


interface UseDeleteUserParams {
  condominioId: string;
}

export function useDeleteUser({ condominioId }: UseDeleteUserParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      deleteUser(condominioId, userId),

    onSuccess: () => {
      // refaz a listagem de usuários
      queryClient.invalidateQueries({
        queryKey: ['users', condominioId],
      });
    },

    onError: (error) => {
      console.error('Erro ao excluir usuário:', error);
    },
  });
}
