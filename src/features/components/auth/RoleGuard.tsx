'use client';

import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';

import { Role } from '@/types/user';

interface RoleGuardProps {
  roles: Role[]; // Lista de roles permitidas listadas no types/user.ts
  children: ReactNode;
  fallback?: ReactNode; // O que renderizar caso o usuário não tenha permissão (ex: null, ou um trecho <p>Não autorizado</p>)
}

export function RoleGuard({
  roles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { data: session, status } = useSession();

  // Enquanto carrega a sessão, não queremos mostrar a página restrita erroniamente
  if (status === 'loading') {
    return null;
  }

  const userRole = session?.user?.role as Role | undefined;

  // Se o usuário não tiver uma role, ou se a role dele não estiver na lista de roles permitidas
  if (!userRole || !roles.includes(userRole)) {
    return <>{fallback}</>;
  }

  // Se passou, renderiza os children normalmente!
  return <>{children}</>;
}
