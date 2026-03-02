import { Metadata } from 'next';
import { PagamentosDataTable } from '@/features/pagamentos/components/pagamentos-data-table';
import { getPayments } from '@/features/pagamentos/services/paymentService';

export const metadata: Metadata = {
  title: 'Pagamentos',
  description: 'Gerencie os pagamentos do condomínio',
};

interface PagamentosPageProps {
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

export default async function PagamentosPage({
  params,
  searchParams,
}: PagamentosPageProps) {
  const { condId } = await params;

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || 20;
  const sort = resolvedSearchParams.sort;

  // Normalize columns and content to arrays
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

  const { items: pagamentos, meta } = await getPayments(condId, {
    page,
    limit,
    sort,
    columns,
    content,
  });

  return (
    <div className="flex flex-col space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pagamentos</h2>
          <p className="text-muted-foreground">
            Gerencie os pagamentos dos funcionários.
          </p>
        </div>
        <div className="flex items-center space-x-2"></div>
      </div>

      <PagamentosDataTable data={pagamentos} pageCount={meta.totalPages} />
    </div>
  );
}
