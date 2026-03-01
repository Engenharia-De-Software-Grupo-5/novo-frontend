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

  // TODO: alterar role
  const currentRole = (await getCurrentRole(condId)) ?? 'Admin';
  console.log('currentRole', currentRole);
  return (
    <div className="min-h-screen">
      <CondominioSessionProvider condId={condId} role={currentRole} />
      <main>{children}</main>
    </div>
  );
}
