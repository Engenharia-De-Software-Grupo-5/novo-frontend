'use client';

import { useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';

export default function PreCadastroSucesso() {
  const searchParams = useSearchParams();
  const fromForm = searchParams.get('submitted');

  if (fromForm !== 'true') {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center flex flex-col items-center gap-4">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">Formulário enviado com sucesso!</h1>
        <p className="text-gray-500 text-sm">
          Suas informações foram recebidas. Em breve entraremos em contato.
        </p>
      </div>
    </div>
  );
}
