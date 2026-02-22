import { Metadata } from 'next';
import { ContratosDataTable } from '@/features/contratos/components/contratos-data-table';
import { getContratos } from '@/features/contratos/services/contratoService';

export const metadata: Metadata = {
  title: 'Contratos',
  description: 'Gerencie os contratos do condomínio.',
};

interface ContratosPageProps {
  readonly params: Promise<{ condId: string }>;
  readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ContratosPage({
  params,
  searchParams,
}: ContratosPageProps) {
  const resolvedParams = await params;
  const { condId } = resolvedParams;

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || 10;
  const sort = resolvedSearchParams.sort as string | undefined;

  const rawColumns = resolvedSearchParams.columns;
  const rawContent = resolvedSearchParams.content;
  let columnsArr: string[] = [];
  if (rawColumns) {
    columnsArr = Array.isArray(rawColumns) ? rawColumns : [rawColumns];
  }

  let contentArr: string[] = [];
  if (rawContent) {
    contentArr = Array.isArray(rawContent) ? rawContent : [rawContent];
  }

  const { data: contratos, meta } = await getContratos(condId, {
    page,
    limit,
    columns: columnsArr.length > 0 ? columnsArr : undefined,
    content: contentArr.length > 0 ? contentArr : undefined,
    sort,
  });

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Gerenciar Contratos
          </h2>
          <p className="text-muted-foreground">
            Visualize imóvel, locatário, datas e PDF dos contratos cadastrados.
          </p>
        </div>
      </div>
      <ContratosDataTable data={contratos} pageCount={meta.totalPages} />
    </div>
  );
}
