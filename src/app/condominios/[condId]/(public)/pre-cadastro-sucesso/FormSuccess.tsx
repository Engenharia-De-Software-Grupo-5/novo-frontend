'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FormSuccess() {
  const router = useRouter();
  const params = useParams();
  const condominiumId = params.condId;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push(`/condominios/${condominiumId}/condominos?page=1&limit=10`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router, condominiumId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center flex flex-col items-center gap-6">
        {/* Ícone animado */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 animate-bounce">
          <svg
            className="w-10 h-10 text-green-500"
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

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-800">
            Cadastro realizado com sucesso!
          </h1>
          <p className="text-gray-500 text-sm">
            Suas informações foram enviadas e estão sendo processadas.
          </p>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(countdown / 5) * 100}%` }}
          />
        </div>

        <p className="text-xs text-gray-400">
          Redirecionando em <span className="font-semibold text-gray-600">{countdown}s</span>...
        </p>

        <button
          onClick={() => router.push(`/condominios/${condominiumId}/condominos?page=1&limit=10`)}
          className="mt-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Ir agora
        </button>
      </div>
    </div>
  );
}
