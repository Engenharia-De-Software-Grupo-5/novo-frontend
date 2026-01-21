// src/services/auth.service.ts
import { DONO_FAKE } from '@/mocks/auth';
import { User } from '@/types/user';

export async function login(
  email: string,
  password: string
): Promise<User> {
  // senha mock
  if (email === DONO_FAKE.email && password === '123456') {
    return DONO_FAKE;
  }

  throw new Error('Invalid credentials');
}
