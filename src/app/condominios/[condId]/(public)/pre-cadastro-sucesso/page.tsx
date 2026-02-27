'use client';

import { notFound, useSearchParams } from 'next/navigation';

export default function PreCadastroSucesso() {
  const searchParams = useSearchParams();
  const fromForm = searchParams.get('submitted');

  if (fromForm !== 'true') {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-white p-10 text-center shadow-lg">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          Formulário enviado com sucesso!
        </h1>
        <p className="text-sm text-gray-500">
          Suas informações foram recebidas. Em breve entraremos em contato.
        </p>
      </div>
    </div>
  );
}
