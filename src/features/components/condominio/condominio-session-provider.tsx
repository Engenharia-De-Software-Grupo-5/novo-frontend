'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface CondominioSessionProviderProps {
  condId: string;
  role: string | undefined;
}

/**
 * A Client Component that mounts when a user navigates to a condominium.
 * It checks if the current NextAuth session matches this condId and role.
 * If not, it calls `update()` to sync the session state.
 */
export function CondominioSessionProvider({
  condId,
  role,
}: CondominioSessionProviderProps) {
  const { data: session, update, status } = useSession();
  const hasUpdated = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated' || !session) return;

    const currentSessionCondId = session?.user?.currentCondId;
    const currentSessionRole = session?.user?.currentRole;

    // Trigger an update if the session is out of sync with the URL
    if (currentSessionCondId !== condId || currentSessionRole !== role) {
      if (!hasUpdated.current) {
        hasUpdated.current = true;
        update({ currentCondId: condId, currentRole: role });
      }
    }
  }, [condId, role, session, status, update]);

  useEffect(() => {
    hasUpdated.current = false;
  }, [condId, role]);

  return null;
}
