import { DespesasDataTable } from '@/features/despesas/components/despesas-data-table';
import { despesaService } from '@/features/despesas/services/despesaService';

export default async function DespesasPage(props: {
  readonly params: Promise<{ condId: string }>;
  readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;

  const columnsParam = searchParams.columns || searchParams['columns[]'];
  const contentParam = searchParams.content || searchParams['content[]'];

  let columns: string[] = [];
  if (Array.isArray(columnsParam)) {
    columns = columnsParam;
  } else if (columnsParam) {
    columns = [columnsParam];
  }

  let content: string[] = [];
  if (Array.isArray(contentParam)) {
    content = contentParam;
  } else if (contentParam) {
    content = [contentParam];
  }

  const response = await despesaService.getAll(params.condId, {
    page,
    limit,
    columns,
    content,
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Gerenciar despesas
          </h2>
          <p className="text-muted-foreground">
            Controle as saídas financeiras e registre contas a pagar
          </p>
        </div>
      </div>
      <DespesasDataTable
        data={response.data}
        pageCount={response.meta.pageCount}
      />
    </div>
  );
}
