import { UsersDataTable } from '@/features/usuarios/components/UsersTable';
import { getUsers } from '@/features/usuarios/services/users.service';

interface PageProps {
  readonly params: Promise<{ condId: string }>;
  readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function UsersPage({ params, searchParams }: PageProps) {
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

  console.log('sParams:', sParams);
  const data = await getUsers(condId, {
    page,
    limit,
    sort,
    columns: columnsArr.length > 0 ? columnsArr : undefined,
    content: contentArr.length > 0 ? contentArr : undefined,
  });

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-brand-dark text-xl font-semibold">
          Gerencie os usuários do sistema
        </h1>

        <p className="text-brand-gray mt-1 text-sm">
          Aprove acessos pendentes, atribua cargos e visualize informações
          essenciais dos usuários do sistema.
        </p>
      </div>

      <UsersDataTable data={data.data} pageCount={data.meta.totalPages} />
    </div>
  );
}
