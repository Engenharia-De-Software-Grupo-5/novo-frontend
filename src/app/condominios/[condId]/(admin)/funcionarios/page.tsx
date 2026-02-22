import { Metadata } from 'next';
import { FuncionariosDataTable } from '@/features/funcionarios/components/funcionarios-data-table';
import { getFuncionarios } from '@/features/funcionarios/services/funcionarioService';

export const metadata: Metadata = {
  title: 'Funcionários',
  description: 'Gerencie os funcionários do condomínio.',
};

interface FuncionariosPageProps {
  readonly params: Promise<{
    condId: string;
  }>;
  readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FuncionariosPage({
  params,
  searchParams,
}: FuncionariosPageProps) {
  const resolvedParams = await params;
  const { condId } = resolvedParams;

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const limit = Number(resolvedSearchParams.limit) || 10;
  const sort = resolvedSearchParams.sort as string | undefined;

  // Extract columns and content filter arrays
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

  const { data: funcionarios, meta } = await getFuncionarios(condId, {
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
            Gerenciar Funcionários
          </h2>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema, aprove acessos pendentes, atribua
            cargos e acompanhe informações essenciais como status e contratos.
          </p>
        </div>
      </div>
      <FuncionariosDataTable data={funcionarios} pageCount={meta.totalPages} />
    </div>
  );
}
