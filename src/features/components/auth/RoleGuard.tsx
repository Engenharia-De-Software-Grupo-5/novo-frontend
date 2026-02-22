'use client';

import { ReactNode, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Role } from '@/types/user';

interface RoleGuardProps {
  readonly roles: Role[]; // Lista de roles permitidas listadas no types/user.ts
  readonly children: ReactNode;
  readonly fallback?: ReactNode; // O que renderizar caso o usuário não tenha permissão (ex: null, ou um trecho <p>Não autorizado</p>)
}

export function RoleGuard({
  roles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { data: session, status } = useSession();
  // Lazy initializer: returns true immediately on the client, false during SSR.
  // Avoids the useEffect + setState pattern that causes cascading renders.
  const [mounted] = useState(() => typeof window !== 'undefined');

  // Garante árvore estável entre SSR e hidratação inicial no cliente.
  if (!mounted || status === 'loading') {
    return <>{fallback}</>;
  }

  const userRole = session?.user?.role as Role | undefined;

  // Se o usuário não tiver uma role, ou se a role dele não estiver na lista de roles permitidas
  if (!userRole || !roles.includes(userRole)) {
    return <>{fallback}</>;
  }

  // Se passou, renderiza os children normalmente!
  return <>{children}</>;
}
