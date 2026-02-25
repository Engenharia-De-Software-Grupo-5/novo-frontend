import { Metadata } from 'next';
import { CobrancasDataTable } from '@/features/cobrancas/components/cobrancas-data-table';
import { getCobrancas } from '@/features/cobrancas/services/cobrancaService';

export const metadata: Metadata = {
  title: 'Gerenciar cobranças',
  description: 'Gerencie cobranças para inquilinos do condomínio.',
};

interface CobrancasPageProps {
  readonly params: Promise<{
    condId: string;
  }>;
  readonly searchParams: Promise<{
    page?: string;
    limit?: string;
    sort?: string;
    columns?: string | string[];
    content?: string | string[];
  }>;
}

export default async function CobrancasPage({
  params,
  searchParams,
}: CobrancasPageProps) {
  const resolvedParams = await params;
  const { condId } = resolvedParams;

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || 10;
  const sort = resolvedSearchParams.sort;

  let columns: string[] | undefined = undefined;
  if (resolvedSearchParams.columns) {
    columns = Array.isArray(resolvedSearchParams.columns)
      ? resolvedSearchParams.columns
      : [resolvedSearchParams.columns];
  }

  let content: string[] | undefined = undefined;
  if (resolvedSearchParams.content) {
    content = Array.isArray(resolvedSearchParams.content)
      ? resolvedSearchParams.content
      : [resolvedSearchParams.content];
  }

  const { items: cobrancas, meta } = await getCobrancas(condId, {
    page,
    limit,
    sort,
    columns,
    content,
  });

  return (
    <div className="flex h-full flex-1 flex-col space-y-3 px-4 pt-0 pb-4">
      <div className="flex items-center justify-between space-y-2">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Gerenciar Cobranças
          </h2>
          <p className="text-muted-foreground">
            Gerencie as finanças do condomínio, acompanhe o status de
            pagamentos, emita boletos, defina juros e atribua a condôminos.
          </p>
        </div>
      </div>

      <CobrancasDataTable data={cobrancas} pageCount={meta.totalPages} />
    </div>
  );
}
