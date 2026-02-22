import { AlertCircle, Phone } from "lucide-react";
import { SectionTitle } from "./Section";
import { EmergencyContact } from "@/types/condomino";

export function EmergencyContactsSection({ contacts }: { readonly contacts: EmergencyContact[] }) {
  if (!contacts || contacts.length === 0) return null;

  return (
    <div>
      <SectionTitle icon={AlertCircle} title="Contatos de Emergência" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {contacts.map((contact, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-orange-100 bg-orange-50/30">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-900">{contact.name}</span>
              <div className="flex items-center gap-2 text-[11px] text-orange-700 font-medium">
                <span className="uppercase tracking-wider">{contact.relationship}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {contact.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}