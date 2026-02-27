import { ReactNode } from 'react';
import { CondominioSessionProvider } from '@/features/components/condominio/condominio-session-provider';

import { getCurrentRole } from '@/lib/get-current-role';

interface CondominioLayoutProps {
  children: ReactNode;
  params: Promise<{
    condId: string;
  }>;
}

export default async function CondominioLayout({
  children,
  params,
}: CondominioLayoutProps) {
  const resolvedParams = await params;
  const { condId } = resolvedParams;

  const currentRole = await getCurrentRole(condId);
  console.log('currentRole', currentRole);
  return (
    <div className="min-h-screen">
      <CondominioSessionProvider condId={condId} role={currentRole} />
      <main>{children}</main>
    </div>
  );
}
