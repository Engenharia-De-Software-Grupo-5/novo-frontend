

import { User, Phone} from "lucide-react";
import { CondominoFull } from "@/types/condomino";
import {SectionTitle, Info} from "./Section"

// --- SEÇÃO PESSOAL ---
interface SectionProps {
  readonly data: CondominoFull;
  readonly formatCurrency: (val?: number) => string;
}

export function PersonalInfoSection({ data, formatCurrency }: SectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <SectionTitle icon={User} title="Informações Pessoais" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Info label="Data de Nascimento" value={data.birthDate} />
          <Info label="Estado Civil" value={data.maritalStatus} />
          <Info label="RG" value={`${data.rg} (${data.issuingAuthority})`} />
          <Info label="Renda Mensal" value={formatCurrency(data.monthlyIncome)} />
        </div>
      </div>

      <div>
        <SectionTitle icon={Phone} title="Contato e Localização" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Info label="E-mail" value={data.email} className="col-span-2" />
          <Info label="Telefone Principal" value={data.primaryPhone} />
          <Info label="Telefone Secundário" value={data.secondaryPhone} />
          <Info label="Endereço Completo" value={data.address} className="col-span-2 md:col-span-4" />
        </div>
      </div>
    </div>
  );
}