// app/auth/acesso-negado/page.tsx
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ motivo?: string }>;
}

export default async function AcessoNegadoPage({ searchParams }: PageProps) {
  const { motivo } = await searchParams;

  const mensagens: Record<string, string> = {
    inativo: 'Sua conta está inativa.',
    pendente: 'Sua conta está aguardando aprovação.',
    bloqueado: 'Seu acesso foi restringido pela administração.',
  };

  const mensagem = mensagens[motivo ?? ''] ?? 'Seu acesso está bloqueado no momento.';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full rounded-xl border border-gray-200 bg-white p-8 text-center shadow-lg">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-red-100 p-3 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
        </div>
        
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Acesso Restrito
        </h1>
        
        <p className="mb-2 font-medium text-gray-700">{mensagem}</p>
        
        <p className="mb-8 text-sm text-gray-500 leading-relaxed">
          Se você acredita que isso é um erro ou deseja regularizar sua situação, 
          entre em contato com a administração do condomínio.
        </p>
        
        <div className="border-t pt-6">
          <Link 
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Sair e voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}