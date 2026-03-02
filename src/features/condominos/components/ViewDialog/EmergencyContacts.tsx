import { AlertCircle, Phone } from 'lucide-react';

import { EmergencyContact } from '@/types/condomino';

import { SectionTitle } from './Section';

export function EmergencyContactsSection({
  contacts,
}: {
  readonly contacts: EmergencyContact[];
}) {
  if (!contacts || contacts.length === 0) return null;

  return (
    <div>
      <SectionTitle icon={AlertCircle} title="Contatos de Emergência" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {contacts.map((contact) => (
          <div
            key={`${contact.name}-${contact.phone}`}
            className="flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50/30 p-3"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-900">
                {contact.name}
              </span>
              <div className="flex items-center gap-2 text-[11px] font-medium text-orange-700">
                <span className="tracking-wider uppercase">
                  {contact.relationship}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {contact.phone}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
