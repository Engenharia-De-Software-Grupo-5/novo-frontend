import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="bg-muted flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border bg-white p-8 text-center shadow-lg">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image src="/logo-icon.png" alt="Moratta" width={40} height={40} />
        </div>

        {/* Código do erro */}
        <p className="text-primary mb-2 text-7xl font-bold tracking-tight">
          404
        </p>

        <h1 className="mb-2 text-xl font-semibold text-gray-900">
          Página não encontrada
        </h1>

        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          A página que você está procurando não existe ou foi movida. Verifique
          o endereço ou retorne ao início.
        </p>

        <div className="border-t pt-6">
          <Link
            href="/condominios"
            className="bg-primary hover:bg-primary/90 focus:ring-primary inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Voltar para a tela inicial
          </Link>
        </div>
      </div>

      <p className="text-muted-foreground mt-6 max-w-md text-center text-xs">
        Moratta &mdash; Sistema de Gestão Condominial
      </p>
    </main>
  );
}
