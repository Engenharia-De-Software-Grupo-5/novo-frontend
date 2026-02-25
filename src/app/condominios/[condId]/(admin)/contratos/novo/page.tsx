import { getCondominos } from '@/features/condominos/services/condominos.service';
import AddContratos from '@/features/contratos/components/add-contratos';
import { getImoveis } from '@/features/imoveis/services/imovelService';

interface NovoContratoPageProps {
  readonly params: Promise<{ condId: string }>;
}

export default async function NovoContratoPage({
  params,
}: NovoContratoPageProps) {
  const { condId } = await params;

  const [condominosResponse, imoveisResponse] = await Promise.all([
    getCondominos(condId, { page: 1, limit: 100 }),
    getImoveis(condId, { page: 1, limit: 100 }),
  ]);

  return (
    <AddContratos
      condId={condId}
      tenants={condominosResponse.items}
      properties={imoveisResponse.items}
    />
  );
}
