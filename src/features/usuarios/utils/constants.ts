import { ShieldCheck, UserCog, CheckCircle2, XCircle, Clock } from "lucide-react";

export const USER_ROLES = [
  { label: "Financeiro", value: "Financeiro", icon: ShieldCheck },
  { label: "RH", value: "RH", icon: UserCog },
];

export const USER_STATUSES = [
  { label: "Ativo", value: "ACTIVE", icon: CheckCircle2 },
  { label: "Inativo", value: "INACTIVE", icon: XCircle },
  { label: "Pendente", value: "SUSPENDED", icon: Clock },
];

export const USER_COLUMN_LABELS = {
  name: "Nome",
  role: "Cargo",
  status: "Status",
  email: "E-mail",
};