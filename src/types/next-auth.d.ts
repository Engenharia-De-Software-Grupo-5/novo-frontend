import { type DefaultSession } from 'next-auth';

import type { CondominiumItem, PermissionItem } from './user';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      status: string;
      accessToken: string;
      isAdminMaster: boolean;
      currentRole?: string;
      currentCondId?: string;
    } & DefaultSession['user'];
    permission: PermissionItem[];
    condominium: CondominiumItem[];
  }

  interface User {
    id: string;
    accessToken: string;
    status: string;
    isAdminMaster: boolean;
    permission: PermissionItem[];
    condominium: CondominiumItem[];
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id?: string;
    accessToken?: string;
    exp?: number;
    status?: string;
    isAdminMaster?: boolean;
    permission?: PermissionItem[];
    condominium?: CondominiumItem[];
    currentRole?: string;
    currentCondId?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    accessToken?: string;
    exp?: number;
    status?: string;
    isAdminMaster?: boolean;
    permission?: PermissionItem[];
    condominium?: CondominiumItem[];
    currentRole?: string;
    currentCondId?: string;
  }
}

export type responseAuthApi = {
  sub: string;
  email: string;
  cpf: string;
  name: string;
  isAdminMaster?: boolean;
  permission: [PermissionItem];
  condominium: [CondominiumItem];
  iat: number;
  exp: number;
};
