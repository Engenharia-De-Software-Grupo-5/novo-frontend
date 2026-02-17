import { AdditionalResident } from "@/types/condomino";
import { SectionTitle } from "./Section";
import { Users } from "lucide-react";

export function AdditionalResidentsSection({ residents }: { residents: AdditionalResident[] }) {
  if (!residents || residents.length === 0) return null;

  return (
    <div>
      <SectionTitle icon={Users} title="Moradores Adicionais" />
      <div className="border rounded-lg overflow-hidden border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left p-3 text-[10px] uppercase font-bold text-slate-500">Nome</th>
              <th className="text-left p-3 text-[10px] uppercase font-bold text-slate-500">Parentesco</th>
              <th className="text-left p-3 text-[10px] uppercase font-bold text-slate-500">Idade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {residents.map((res, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-3 font-medium text-slate-900">{res.name}</td>
                <td className="p-3 text-slate-600">{res.relationship}</td>
                <td className="p-3 text-slate-600">{res.age} anos</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}