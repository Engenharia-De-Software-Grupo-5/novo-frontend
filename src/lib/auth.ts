import { login, loginWithApi } from '@/features/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // ==========================================
          // IMPLEMENTAÇÃO REAL (COM A API)
          // ==========================================
          /*
          const data = await loginWithApi(
            credentials.email as string,
            credentials.password as string
          );
          if (!data) return null;

          return {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
            accessToken: data.accessToken,
          };
          */

          // ==========================================
          // IMPLEMENTAÇÃO TEMPORÁRIA (MOCKS)
          // ==========================================
          const userMocado = await login(
            credentials.email as string,
            credentials.password as string
          );

          if (!userMocado) return null;

          // Fake accessToken for the mock
          return {
            id: userMocado.id,
            email: userMocado.email,
            role: userMocado.role,
            accessToken: 'fake-jwt-token-12345',
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;

        // Decodifica o JWT do backend para pegar a data de expiração
        try {
          const decoded = jwtDecode(user.accessToken as string);
          token.exp = decoded.exp; // O NextAuth usará isso para invalidar a sessão
        } catch (error) {
          // Usado para lidar com o token falso/mocado (24 horas pra expirar)
          token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Repassa os dados do token para a sessão pública do frontend
      if (session.user) {
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
});
