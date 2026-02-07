import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserData, UsersResponse } from "../../services/users";
import { updateUser } from "../../services/users.service";

export function useUpdateUser(condominioId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    { userId: string; data: UpdateUserData }
  >({
    mutationFn: ({ userId, data }) =>
      updateUser(condominioId, userId, data),

    onSuccess: (_response, variables) => {
      queryClient.setQueriesData(
        {
          queryKey: ['users', condominioId],
        },
        (old: UsersResponse | undefined) => {
          if (!old) return old;

          return {
            ...old,
            items: old.items.map((user) =>
              user.id === variables.userId
                ? { ...user, ...variables.data }
                : user
            ),
          };
        }
      );
    },
  });
}
