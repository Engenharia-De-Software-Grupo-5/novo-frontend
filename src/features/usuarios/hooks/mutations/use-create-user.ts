import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../../services/users.service";
import { CreateUserPayload } from "../../services/users";


export function useCreateUser(condominioId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserPayload) =>
      createUser(condominioId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users', condominioId],
      });
    },

    onError: (error) => {
      console.error('Erro ao criar usuário:', error);
    },
  });
}
