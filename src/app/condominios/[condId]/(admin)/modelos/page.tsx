import { Metadata } from 'next';

import { ModelosContratoDataTable } from '@/features/modelos-contrato/components/modelos-contrato-data-table';
import { getModelosContrato } from '@/features/modelos-contrato/services/modeloContratoService';

export const metadata: Metadata = {
  title: 'Modelos de Contrato',
  description: 'Gerencie os modelos de contrato do condominio.',
};

interface ModelosContratoPageProps {
  params: Promise<{ condId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ModelosContratoPage({
  params,
  searchParams,
}: ModelosContratoPageProps) {
  const { condId } = await params;
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || 10;
  const sort = resolvedSearchParams.sort as string | undefined;

  const rawColumns = resolvedSearchParams.columns;
  const rawContent = resolvedSearchParams.content;
  const columnsArr = rawColumns
    ? Array.isArray(rawColumns)
      ? rawColumns
      : [rawColumns]
    : [];
  const contentArr = rawContent
    ? Array.isArray(rawContent)
      ? rawContent
      : [rawContent]
    : [];

  const { data: models, meta } = await getModelosContrato(condId, {
    page,
    limit,
    columns: columnsArr.length > 0 ? columnsArr : undefined,
    content: contentArr.length > 0 ? contentArr : undefined,
    sort,
  });

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Modelos de Contrato</h2>
        <p className="text-muted-foreground">
          Cadastre, consulte e mantenha os modelos reutilizaveis de contrato.
        </p>
      </div>
      <ModelosContratoDataTable data={models} pageCount={meta.totalPages} />
    </div>
  );
}
