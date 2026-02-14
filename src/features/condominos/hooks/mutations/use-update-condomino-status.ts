import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCondominoStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      condominiumId,
      moradorId,
      status,
    }: {
      condominiumId: string;
      moradorId: string;
      status: "ativo" | "inativo" | "pendente";
    }) => {
      const response = await fetch(
        `/api/condominios/${condominiumId}/condominos/${moradorId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar status");
      }

      return response.json();
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["condominos", variables.condominiumId],
      });

      queryClient.invalidateQueries({
        queryKey: ["condomino", variables.condominiumId, variables.moradorId],
      });
    },
  });
}
