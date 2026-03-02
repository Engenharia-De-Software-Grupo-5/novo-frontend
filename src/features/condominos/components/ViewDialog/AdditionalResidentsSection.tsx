import { Users } from 'lucide-react';

import { AdditionalResident } from '@/types/condomino';

import { SectionTitle } from './Section';

export function AdditionalResidentsSection({
  residents,
}: {
  readonly residents: AdditionalResident[];
}) {
  if (!residents || residents.length === 0) return null;

  return (
    <div>
      <SectionTitle icon={Users} title="Moradores Adicionais" />
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="p-3 text-left text-[10px] font-bold text-slate-500 uppercase">
                Nome
              </th>
              <th className="p-3 text-left text-[10px] font-bold text-slate-500 uppercase">
                Parentesco
              </th>
              <th className="p-3 text-left text-[10px] font-bold text-slate-500 uppercase">
                Idade
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {residents.map((res) => (
              <tr
                key={`${res.name}-${res.relationship}`}
                className="transition-colors hover:bg-slate-50/50"
              >
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
