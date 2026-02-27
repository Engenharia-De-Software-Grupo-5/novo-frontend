// src/services/auth.service.ts
import { ADMIN_FAKE, FINANCEIRO_FAKE, RH_FAKE } from '@/mocks/auth';

import { User } from '@/types/user';

export async function login(email: string, password: string): Promise<User> {
  // senha mock
  if (email === ADMIN_FAKE.email && password === '123456') {
    return ADMIN_FAKE;
  }
  if (email === FINANCEIRO_FAKE.email && password === '123456') {
    return FINANCEIRO_FAKE;
  }
  if (email === RH_FAKE.email && password === '123456') {
    return RH_FAKE;
  }

  throw new Error('Invalid credentials');
}

export async function loginWithApi(email: string, password: string) {
  // const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Usado apenas no server-side
  const apiUrl = 'https://api.bemconnect.com.br/api/v1'; // Usado apenas no server-side

  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userLogin: email, password }),
    });

    if (!response.ok) {
      console.error('Login Failed! Status:', response.status);
      console.error('Login Failed! Payload:', await response.text());
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error connecting to login API:', error);
    return null;
  }
}

export async function logout(): Promise<void> {
  // Simulando logout do mock (não faz nada assíncrono real, mas limparia estado)
  return;
}

export async function logoutWithApi(token: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await fetch(`${apiUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Error connecting to logout API:', error);
    return false;
  }
}
