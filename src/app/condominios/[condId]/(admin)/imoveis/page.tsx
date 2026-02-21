import { Metadata } from 'next';
import { ImoveisDataTable } from '@/features/imoveis/components/imoveis-data-table';
import { getImoveis } from '@/features/imoveis/services/imovelService';

export const metadata: Metadata = {
  title: 'Imóveis',
  description: 'Gerencie os imóveis do condomínio.',
};

interface ImoveisPageProps {
  params: Promise<{ condId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ImoveisPage({ params, searchParams }: ImoveisPageProps) {
  const { condId } = await params;
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || 10;
  const sort = resolvedSearchParams.sort as string | undefined;

  const rawColumns = resolvedSearchParams.columns;
  const rawContent = resolvedSearchParams.content;
  const columns = rawColumns
    ? Array.isArray(rawColumns)
      ? rawColumns
      : [rawColumns]
    : undefined;
  const content = rawContent
    ? Array.isArray(rawContent)
      ? rawContent
      : [rawContent]
    : undefined;

  const { data: imoveis, meta } = await getImoveis(condId, {
    page,
    limit,
    sort,
    columns,
    content,
  });

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Imóveis</h2>
          <p className="text-muted-foreground">
            Visualize e filtre os imóveis por tipo e situação, com paginação e
            busca sincronizadas na URL.
          </p>
        </div>
      </div>
      <ImoveisDataTable data={imoveis} pageCount={meta.totalPages} />
    </div>
  );
}
