import { CondominosDataTable } from '@/features/condominos/components/CondominosDataTable';
import { getCondominos } from '@/features/condominos/services/condominos.service';

interface PageProps {
  params: Promise<{ condId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CondominosPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const sParams = await searchParams;
  const condId = resolvedParams.condId;

  const data = await getCondominos(condId, {
    page: Number(sParams.page) || 1,
    limit: Number(sParams.limit) || 10,
    search: sParams.q as string,
    statuses:
      typeof sParams.status === 'string'
        ? [sParams.status]
        : (sParams.status as string[]),
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

      <CondominosDataTable data={data.items} pageCount={data.totalPages} />
    </div>
  );
}
