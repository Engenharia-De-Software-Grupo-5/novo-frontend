'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Loga o erro para monitoramento (substituir por um serviço real futuramente)
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <main className="bg-muted flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border bg-white p-8 text-center shadow-lg">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image src="/logo-icon.png" alt="Moratta" width={40} height={40} />
        </div>

        {/* Ícone de erro */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-red-100 p-3 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-xl font-semibold text-gray-900">
          Algo deu errado
        </h1>

        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          Ocorreu um erro inesperado. Nossa equipe foi notificada. Tente
          novamente ou retorne à tela inicial.
        </p>

        <div className="flex flex-col gap-2 border-t pt-6 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="bg-primary hover:bg-primary/90 focus:ring-primary inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Tentar novamente
          </button>
          <Link
            href="/condominios"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none"
          >
            Voltar ao início
          </Link>
        </div>
      </div>

      <p className="text-muted-foreground mt-6 max-w-md text-center text-xs">
        Moratta &mdash; Sistema de Gestão Condominial
      </p>
    </main>
  );
}
