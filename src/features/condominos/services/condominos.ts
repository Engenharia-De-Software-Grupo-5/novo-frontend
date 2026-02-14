/**
 * Tipo usado para listagem de moradores na tabela
 */
export interface CondominoListItem {
  id: string;
  name: string;
  email: string;
  cpf: string;
  status: "ativo" | "inativo" | "pendente";
}
