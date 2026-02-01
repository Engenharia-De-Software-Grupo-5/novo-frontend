import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserData } from "../../services/users";
import { updateUser } from "../../services/users.service";

export function useUpdateUser(condominioId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateUserData;
    }) => updateUser(condominioId, userId, data),

    onSuccess: () => {
      // refaz a listagem após editar
      queryClient.invalidateQueries({
        queryKey: ['users', condominioId],
      });
    },

    onError: (error) => {
      console.error('Erro ao atualizar usuário:', error);
    },
  });
}