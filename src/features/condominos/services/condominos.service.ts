import { CondominiumFull } from "@/types/condomino";
import { CondominoListItem } from "@/features/condominos/services/condominos";


interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ListResponse {
  data: CondominoListItem[];
  meta: PaginationMeta;
}

/**
 * Listar moradores por condomínio (paginado)
 */
export async function getCondominos(
  condominiumId: string,
  page: number = 1,
  limit: number = 10
): Promise<ListResponse> {
  const response = await fetch(
    `/api/condominios/${condominiumId}/condominos?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar moradores");
  }

  return response.json();
}

/**
 * Buscar morador completo por ID
 */
export async function getCondominoById(
  condominiumId: string,
  moradorId: string
): Promise<CondominiumFull> {
  const response = await fetch(
    `/api/condominios/${condominiumId}/condominos/${moradorId}`
  );

  if (!response.ok) {
    throw new Error("Morador não encontrado");
  }

  const result = await response.json();

  return result.data;
}

/**
 * Remover morador
 */
export async function deleteCondomino(
  condominiumId: string,
  moradorId: string
): Promise<void> {
  const response = await fetch(
    `/api/condominios/${condominiumId}/condominos/${moradorId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao remover morador");
  }
}
