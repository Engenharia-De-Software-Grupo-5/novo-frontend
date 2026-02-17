import { Button } from "@/features/components/ui/button";
import { Download, FileCheck, FileText } from "lucide-react";
import { SectionTitle } from "./Section";
import { CondominoFull } from "@/types/condomino";

export function DocumentSection({ data }: { data: CondominoFull }) {
  const docs = [
    { label: "RG (Frente e Verso)", key: "rg" },
    { label: "CPF", key: "cpf" },
    { label: "Comprovante de Renda", key: "incomeProof" },
  ];

  return (
    <div>
      <SectionTitle icon={FileText} title="Documentos Anexados" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {docs.map((doc) => {
          const hasFile = !!data.documents?.[doc.key as keyof typeof data.documents];

          return (
            <div 
              key={doc.key} 
              className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${hasFile ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                  <FileCheck className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-700">{doc.label}</span>
                  <span className="text-[10px] text-slate-400 uppercase">
                    {hasFile ? "Arquivo disponível" : "Não enviado"}
                  </span>
                </div>
              </div>

              {hasFile && (
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 text-slate-400 hover:text-blue-600"
                  onClick={() => console.log(`Baixando ${doc.key}...`)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}