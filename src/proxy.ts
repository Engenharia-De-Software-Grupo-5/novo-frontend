// import { NextResponse } from 'next/server';

// import { auth } from '@/lib/auth';

// export default auth((req) => {
//   const { pathname } = req.nextUrl;
//   const isLoggedIn = !!req.auth;
//   console.log('req.auth = ', req.auth);
//   console.log('isLoggedIn = ', isLoggedIn);

//   // Rotas públicas — passa direto
//   const isPublicRoute =
//     pathname.startsWith('/auth') ||
//     pathname.match(/^\/condominios\/[^\/]+\/form$/);
//   if (isPublicRoute) return NextResponse.next();

//   // Não autenticado — redireciona para login
//   if (!isLoggedIn) {
//     return NextResponse.redirect(new URL('/auth/login', req.url));
//   }

//   // Autorização por role (Rotas Privadas)
//   const userRole = req.auth?.user.role as string;

//   // Definição das regras de acesso baseadas na rota
//   const routeAccessMap = [
//     {
//       match: (path: string) =>
//         path.includes('/pagamentos') || path.includes('/financeiro'),
//       allowedRoles: ['Financeiro', 'Dono'],
//     },
//     {
//       match: (path: string) =>
//         path.includes('/funcionarios') || path.includes('/rh'),
//       allowedRoles: ['RH', 'Dono'],
//     },
//     {
//       match: (path: string) => path.startsWith('/admin'),
//       allowedRoles: ['Dono'],
//     },
//   ];

//   for (const route of routeAccessMap) {
//     if (route.match(pathname)) {
//       if (!route.allowedRoles.includes(userRole)) {
//         // Tenta extrair o condId (ID do condomínio) da URL atual
//         const matchCondId = pathname.match(/^\/condominios\/([^\/]+)/);
//         const condId = matchCondId ? matchCondId[1] : '0'; // Se não tiver, cai no 0 (padrão)

//         // Redireciona para o condomínio atual se não tiver permissão
//         return NextResponse.redirect(
//           new URL(`/condominios/${condId}`, req.url)
//         );
//       }
//     }
//   }

//   return NextResponse.next();
// });

// export const config = {
//   // Define quais rotas o middleware intercepta
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };


import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  console.log('req.auth = ', req.auth);
  console.log('isLoggedIn = ', isLoggedIn);

  // Rotas públicas — passa direto
  const isPublicRoute =
    pathname.startsWith('/auth') ||
    pathname.match(/^\/condominios\/[^\/]+\/form$/);
  if (isPublicRoute) return NextResponse.next();

  // Não autenticado — redireciona para login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Autorização por role e status (Rotas Privadas)
  const userRole = req.auth?.user.role as string;
  const userStatus = req.auth?.user.status as string;

  if (!userRole || !userStatus) {
  // Se não tem role ou status, redireciona ou nega o acesso
  return Response.redirect(new URL('/auth/login', req.url));
}

  // Bloqueia usuários com status diferente de ativo
  if (userStatus && userStatus.toLowerCase() !== 'ativo') {
    const redirectUrl = new URL('/auth/denied-access', req.url);
    redirectUrl.searchParams.set('motivo', userStatus.toLowerCase());
    return NextResponse.redirect(redirectUrl);
  }

  // Definição das regras de acesso baseadas na rota
  const routeAccessMap = [
    {
      match: (path: string) =>
        path.includes('/pagamentos') || path.includes('/financeiro'),
      allowedRoles: ['Financeiro', 'Dono'],
    },
    {
      match: (path: string) =>
        path.includes('/funcionarios') || path.includes('/rh'),
      allowedRoles: ['RH', 'Dono'],
    },
    {
      match: (path: string) => path.startsWith('/admin'),
      allowedRoles: ['Dono'],
    },
  ];

  for (const route of routeAccessMap) {
    if (route.match(pathname)) {
      if (!route.allowedRoles.includes(userRole)) {
        // Tenta extrair o condId (ID do condomínio) da URL atual
        const matchCondId = pathname.match(/^\/condominios\/([^\/]+)/);
        const condId = matchCondId ? matchCondId[1] : '0'; // Se não tiver, cai no 0 (padrão)

        // Redireciona para o condomínio atual se não tiver permissão
        return NextResponse.redirect(
          new URL(`/condominios/${condId}`, req.url)
        );
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  // Define quais rotas o middleware intercepta
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};