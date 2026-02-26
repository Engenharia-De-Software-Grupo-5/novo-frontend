import { loginWithApi } from '@/features/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { responseAuthApi } from '@/types/next-auth';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const data = await loginWithApi(
            credentials.email as string,
            credentials.password as string
          );
          if (!data) {
            console.error('NextAuth: loginWithApi returned null');
            return null;
          }
          if (!data.access_token) {
            console.error(
              'NextAuth: loginWithApi returned data without access_token!',
              data
            );
            return null;
          }

          let decoded: responseAuthApi;
          try {
            decoded = jwtDecode(data.access_token);
          } catch (e) {
            throw new Error('NextAuth: failed to decode jwt token', e);
          }

          return {
            id: String(decoded?.sub || ''),
            accessToken: data.access_token,
            status: 'ativo',
            isAdminMaster: Boolean(decoded?.isAdminMaster),
            permission: decoded?.permission || [],
            condominium: decoded?.condominium || [],
            email: credentials.email as string,
            name: data.name || decoded?.name || 'User',
          };

          //   const userMocado = await login(
          //     credentials.email as string,
          //     credentials.password as string
          //   );

          //   if (!userMocado) return null;

          //   // Fake payload for the mock matching new spec
          //   return {
          //     id: userMocado.id,
          //     email: userMocado.email,
          //     status: userMocado.status,
          //     name: userMocado.name,
          //     accessToken: 'fake-jwt-token-12345',
          //     isAdminMaster: true,
          //     permission: [
          //       { id: '1', name: 'Admin' },
          //       { id: '2', name: 'Financeiro' },
          //       { id: '3', name: 'RH' },
          //     ],
          //     condominium: [{ id: '1', name: 'Condomínio Fake' }],
          //   };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.status = user.status;
        token.name = user.name;
        token.isAdminMaster = user.isAdminMaster;
        token.permission = user.permission;
        token.condominium = user.condominium;

        // Decodifica o JWT do backend para pegar a data de expiração
        try {
          const decoded = jwtDecode(user.accessToken as string);
          token.exp = decoded.exp; // O NextAuth usará isso para invalidar a sessão
        } catch {
          // Usado para lidar com o token falso/mocado (24 horas pra expirar)
          token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
        }
      }

      // Handle Client-Side session updates (e.g., when switching condominiums)
      if (trigger === 'update' && session) {
        if (session.currentCondId) {
          token.currentCondId = session.currentCondId;
        }
        if (session.currentRole) {
          token.currentRole = session.currentRole;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Repassa os dados do token para a sessão pública do frontend
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.accessToken = token.accessToken as string;
        session.user.status = token.status as string;
        session.user.isAdminMaster = token.isAdminMaster as boolean;
        session.user.currentCondId = token.currentCondId as string | undefined;
        session.user.currentRole = token.currentRole as string | undefined;
      }

      session.permission = token.permission as typeof session.permission;
      session.condominium = token.condominium as typeof session.condominium;

      return session;
    },
  },
});
