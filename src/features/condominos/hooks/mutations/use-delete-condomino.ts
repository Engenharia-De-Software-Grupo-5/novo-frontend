import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCondomino } from "@/features/condominos/services/condominos.service";

export function useDeleteCondomino() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      condominiumId,
      moradorId,
    }: {
      condominiumId: string;
      moradorId: string;
    }) => deleteCondomino(condominiumId, moradorId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["condominos", variables.condominiumId],
      });
    },
  });
}
