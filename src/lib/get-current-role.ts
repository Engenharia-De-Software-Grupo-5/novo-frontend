import { auth } from '@/lib/auth';

/**
 * Utility function for Server Components.
 * Retrieves the user's role string based on the given condId
 * by checking the 'permission' array inside the JWT/Session.
 *
 * Returns the matching role name or undefined if not found.
 */
export async function getCurrentRole(
  condId: string
): Promise<string | undefined> {
  const session = await auth();

  if (!session) return undefined;

  // Global override for Admin Master
  if (session.user.isAdminMaster) {
    return 'Admin';
  }
  if (!session.permission || !Array.isArray(session.permission)) {
    return undefined;
  }
  return session.permission.find((p) => p.id === condId)?.name;
}
