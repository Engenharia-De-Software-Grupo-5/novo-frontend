'use client';

import { ReactNode, useState } from 'react';
import { useSession } from 'next-auth/react';

interface RoleGuardProps {
  readonly roles: string[]; // Lista de roles permitidas (Ex: ['Admin', 'Financeiro'])
  readonly children: ReactNode;
  readonly fallback?: ReactNode; // O que renderizar caso o usuário não tenha permissão (ex: null, ou um trecho <p>Não autorizado</p>)
  readonly condId?: string; // ID do condomínio para buscar permissão extra-sessão
}

export function RoleGuard({
  roles,
  children,
  fallback = null,
  condId,
}: RoleGuardProps) {
  const { data: session, status } = useSession();
  // Lazy initializer: returns true immediately on the client, false during SSR.
  // Avoids the useEffect + setState pattern that causes cascading renders.
  const [mounted] = useState(() => typeof globalThis !== 'undefined');

  // Garante árvore estável entre SSR e hidratação inicial no cliente.
  if (!mounted || status === 'loading') {
    return <>{fallback}</>;
  }

  const isAdminMaster = session?.user?.isAdminMaster;
  let userRole = session?.user?.currentRole;

  if (condId && session?.permission) {
    userRole = session.permission.at(
      session.condominium.findIndex((c) => c.id === condId)
    )?.name;
  }

  // 1. Admin Master sempre tem acesso livre a tudo
  if (isAdminMaster) {
    return <>{children}</>;
  }

  // 2. Se não for master, checa se tem role atual setada e se está na lista
  if (
    !userRole ||
    !roles.find((role) => role.toLowerCase() === userRole.toLowerCase())
  ) {
    return <>{fallback}</>;
  }

  // Se passou, renderiza os children normalmente!
  return <>{children}</>;
}
