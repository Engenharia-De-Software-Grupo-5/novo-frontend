import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      status: string;
      accessToken: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: string;
    accessToken: string;
    status: string;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
    exp?: number;
    status?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
    exp?: number;
    status?: string;
  }
}
