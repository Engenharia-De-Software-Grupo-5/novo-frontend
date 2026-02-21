import { Briefcase, Landmark } from "lucide-react";
import { Info, SectionTitle } from "./Section";
import { CondominoFull } from "@/types/condomino";


interface SectionProps {
  data: CondominoFull ;
  formatCurrency: (val?: number) => string;
}

export function FinanceSection({ data, formatCurrency }: SectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <SectionTitle icon={Briefcase} title="Dados Profissionais" />
        <div className="grid grid-cols-1 gap-4">
          <Info label="Empresa" value={data.professionalInfo?.companyName} />
          <div className="grid grid-cols-2 gap-4">
            <Info label="Cargo" value={data.professionalInfo?.position} />
            <Info label="Anos na Empresa" value={data.professionalInfo?.monthsWorking} />
          </div>
          <Info label="Telefone Comercial" value={data.professionalInfo?.companyPhone} />
        </div>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <SectionTitle icon={Landmark} title="Dados Bancários" />
        <div className="grid grid-cols-1 gap-4">
          <Info label="Banco" value={data.bankingInfo?.bank} />
          <Info label="Tipo de Conta" value={data.bankingInfo?.accountType} />
          <div className="grid grid-cols-2 gap-4">
            <Info label="Agência" value={data.bankingInfo?.agency} />
            <Info label="Número da Conta" value={data.bankingInfo?.accountNumber} />
          </div>
        </div>
      </div>
    </div>
  );
}