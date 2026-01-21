import { users } from '@/mocks/users';
import { User } from '@/types/user';

export function getUsersByCondominium(
  condominiumId: string
): User[] {
  return users.filter(user =>
    user.memberships.some(
      m => m.condominiumId === condominiumId
    )
  );
}