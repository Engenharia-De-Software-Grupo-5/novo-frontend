import { Metadata } from 'next';
import { columns } from '@/features/funcionarios/components/columns';
import { DataTable } from '@/features/funcionarios/components/data-table';
import { getFuncionarios } from '@/features/funcionarios/services/funcionarioService';
import { z } from 'zod';

export const metadata: Metadata = {
  title: 'Funcionários',
  description: 'Gerencie os funcionários do condomínio.',
};

interface FuncionariosPageProps {
  params: Promise<{
    condId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
  const search = resolvedSearchParams.search as string | undefined;
  const role = resolvedSearchParams.role as string | string[] | undefined;
  const status = resolvedSearchParams.status as string | string[] | undefined;

  const { data: funcionarios, meta } = await getFuncionarios(condId, {
    page,
    limit,
    search,
    role,
    status,
  });
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Funcionários</h2>
          <p className="text-muted-foreground">
            Gerencie os usuários do sistema, aprove acessos pendentes, atribua
            cargos e acompanhe informações essenciais como status e contratos.
          </p>
        </div>
      </div>
      <DataTable
        data={funcionarios}
        columns={columns}
        pageCount={meta.totalPages}
      />
    </div>
  );
}
