// src/services/auth.service.ts
import { DONO_FAKE } from '@/mocks/auth';

import { User } from '@/types/user';

export async function login(email: string, password: string): Promise<User> {
  // senha mock
  if (email === DONO_FAKE.email && password === '123456') {
    return DONO_FAKE;
  }

  throw new Error('Invalid credentials');
}

export async function loginWithApi(email: string, password: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Usado apenas no server-side

  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) return null;

    // Exemplo do que o backend retorna: { accessToken: "ey...", user: { id, email, role } }
    return await response.json();
  } catch (error) {
    console.error('Error connecting to login API:', error);
    return null;
  }
}
