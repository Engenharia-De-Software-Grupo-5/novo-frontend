import { useQuery } from "@tanstack/react-query";
import { getCondominoById } from "@/features/condominos/services/condominos.service";


export function useCondomino(
  condominiumId: string,
  moradorId: string
) {
  return useQuery({
    queryKey: ["condomino", condominiumId, moradorId],
    queryFn: () => getCondominoById(condominiumId, moradorId),
    enabled: !!condominiumId && !!moradorId,
  });
}
