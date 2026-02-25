import { Metadata } from 'next';
import { ImoveisDataTable } from '@/features/imoveis/components/imoveis-data-table';
import { getImoveis } from '@/features/imoveis/services/imovelService';

export const metadata: Metadata = {
  title: 'Imóveis',
  description: 'Gerencie os imóveis do condomínio.',
};

interface ImoveisPageProps {
  readonly params: Promise<{ condId: string }>;
  readonly searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function ImoveisPage({
  params,
  searchParams,
}: ImoveisPageProps) {
  const { condId } = await params;
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || 10;
  const sort = resolvedSearchParams.sort as string | undefined;

  const rawColumns = resolvedSearchParams.columns;
  const rawContent = resolvedSearchParams.content;
  let columns: string[] | undefined = undefined;
  if (rawColumns) {
    columns = Array.isArray(rawColumns) ? rawColumns : [rawColumns];
  }
  let content: string[] | undefined = undefined;
  if (rawContent) {
    content = Array.isArray(rawContent) ? rawContent : [rawContent];
  }

  const { items: imoveis, meta } = await getImoveis(condId, {
    page,
    limit,
    sort,
    columns,
    content,
  });

  return (
    <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:space-y-8 lg:p-8">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Gerenciar Imóveis
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Visualize e filtre os imóveis por tipo e situação, com paginação e
            busca sincronizadas na URL.
          </p>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-0">
          <ImoveisDataTable data={imoveis} pageCount={meta.totalPages} />
        </div>
      </div>
    </div>
  );
}
