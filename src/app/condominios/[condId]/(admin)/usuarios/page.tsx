import { getUsers } from "@/features/usuarios/services/users.service";
import { UsersDataTable } from "@/features/usuarios/components/UsersTable";
import { parseTableFilters } from "@/features/components/data-table/parse-table-filters";

interface PageProps {
  params: Promise<{ condId: string }>; 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function UsersPage({ params, searchParams }: PageProps) {

  const resolvedParams = await params;
  const sParams = await searchParams;
  const condId = resolvedParams.condId;

  const filterMap = parseTableFilters(sParams);

  const data = await getUsers(condId, {
    page: Number(sParams.page) || 1,
    limit: Number(sParams.limit) || 10,
    search: sParams.q as string,
    roles: filterMap.get('role') ?? [],
    statuses: filterMap.get('status') ?? [],
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
      
      <UsersDataTable 
        data={data.items} 
        pageCount={data.totalPages} 
      />
    </div>
  );
}