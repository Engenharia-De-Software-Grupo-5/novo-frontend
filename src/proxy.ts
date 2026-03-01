import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';

interface RouterMap {
  match: (path: string) => boolean;
  allowedRoles: string[];
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  console.log('pathname', pathname);
  // console.log('req.auth = ', req.auth);
  // console.log('isLoggedIn = ', isLoggedIn);

  // Rotas públicas — passa direto
  const isPublicRoute =
    pathname.startsWith('/auth') ||
    /^\/condominios\/[^/]+\/form$/.exec(pathname);
  if (isPublicRoute) return NextResponse.next();

  // Não autenticado — redireciona para login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Autorização por role e status (Rotas Privadas)
  const userStatus = req.auth?.user.status as string;
  const isAdminMaster = req.auth?.user?.isAdminMaster as boolean | undefined;

  if (!userStatus) {
    // Se não tem status, redireciona ou nega o acesso
    return Response.redirect(new URL('/auth/login', req.url));
  }

  // Bloqueia usuários com status diferente de ativo
  if (userStatus && userStatus.toLowerCase() !== 'ativo') {
    const redirectUrl = new URL('/auth/denied-access', req.url);
    redirectUrl.searchParams.set('motivo', userStatus.toLowerCase());
    return NextResponse.redirect(redirectUrl);
  }

  // Se for Admin Master, dá bypass em todas as rotas
  if (isAdminMaster) {
    return NextResponse.next();
  }

  // Tenta extrair o condId (ID do condomínio) da URL atual
  const matchCondId = pathname.match(/^\/condominios\/([^\/]+)/);
  const condId = matchCondId ? matchCondId[1] : undefined;

  // Encontra a permissão (Role) do usuário no condomínio em questão baseado no Token
  const permissions = req.auth?.permission || [];
  const condominiums = req.auth?.condominium || [];
  const currentRoleMatch = permissions.at(
    condominiums.findIndex((c) => c.id === condId)
  );
  // TODO: alterar role
  const userRole = currentRoleMatch?.name ?? 'Admin';

  // Definição das regras de acesso baseadas na rota
  const routeAccessMap: RouterMap[] = [
    {
      match: (path: string) =>
        path.includes('/pagamentos') ||
        path.includes('/financeiro') ||
        path.includes('/cobrancas'),
      allowedRoles: ['Financeiro', 'Admin'],
    },
    {
      match: (path: string) => path.includes('/funcionarios'),
      allowedRoles: ['RH', 'Admin'],
    },
    {
      match: (path: string) => path.includes('/usuarios'),
      allowedRoles: ['Admin'],
    },
  ];
  for (const route of routeAccessMap) {
    if (route.match(pathname)) {
      if (
        !userRole ||
        !route.allowedRoles.find(
          (role) => role.toLowerCase() === userRole.toLowerCase()
        )
      ) {
        // Redireciona para o condomínio atual se não tiver permissão
        const fallbackCondId = condId || '0';
        console.error(`BLOQUEADO ${userRole} ${condId}`);
        return NextResponse.redirect(
          new URL(`/condominios/${fallbackCondId}`, req.url)
        );
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  // Define quais rotas o middleware intercepta
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
