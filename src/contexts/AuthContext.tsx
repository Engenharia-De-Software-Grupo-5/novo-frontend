'use client';

import { createContext, useContext, useState } from 'react';
import { login as loginService } from '@/features/services/auth.service';

import { User } from '@/types/user';

interface AuthContextData {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;

    const saved = localStorage.getItem('authUser');
    return saved ? JSON.parse(saved) : null;
  });

  async function login(email: string, password: string) {
    const loggedUser = await loginService(email, password);
    setUser(loggedUser);
    localStorage.setItem('authUser', JSON.stringify(loggedUser));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('authUser');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
