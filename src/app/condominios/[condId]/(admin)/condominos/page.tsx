import { CondominosDataTable } from '@/features/condominos/components/CondominosDataTable';
import { getCondominos } from '@/features/condominos/services/condominos.service';

interface PageProps {
  readonly params: Promise<{ condId: string }>;
  readonly searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}
export default async function CondominosPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const sParams = await searchParams;
  const condId = resolvedParams.condId;

  const page = Number(sParams.page) || 1;
  const limit = Number(sParams.limit) || 10;
  const sort = sParams.sort as string | undefined;

  const rawColumns = sParams.columns;
  const rawContent = sParams.content;
  let columnsArr: string[] = [];
  if (rawColumns) {
    columnsArr = Array.isArray(rawColumns) ? rawColumns : [rawColumns];
  }

  let contentArr: string[] = [];
  if (rawContent) {
    contentArr = Array.isArray(rawContent) ? rawContent : [rawContent];
  }

  const data = await getCondominos(condId, {
    page,
    limit,
    sort,
    columns: columnsArr.length > 0 ? columnsArr : undefined,
    content: contentArr.length > 0 ? contentArr : undefined,
  });

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-brand-dark text-xl font-semibold">
          Cadastro de Condôminos
        </h1>
        <p className="text-brand-gray mt-1 text-sm">
          Gerencie os condôminos do sistema, veja informações importantes,
          aprove ou rejeite um pré cadastro
        </p>
      </div>
      <CondominosDataTable data={data.items} pageCount={data.meta.totalPages} />
    </div>
  );
}
