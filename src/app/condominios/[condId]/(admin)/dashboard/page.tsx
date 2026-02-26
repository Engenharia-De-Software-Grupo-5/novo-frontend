import { Metadata } from 'next';
import { getCobrancas } from '@/features/cobrancas/services/cobrancaService';
import { getCondominos } from '@/features/condominos/services/condominos.service';
import { DashboardClient } from '@/features/dashboard/components/dashboard-client';
import { getAll } from '@/features/despesas/services/despesaService';
import { getFuncionarios } from '@/features/funcionarios/services/funcionarioService';
import { getImoveis } from '@/features/imoveis/services/imovelService';
import { getPayments } from '@/features/pagamentos/services/paymentService';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Acompanhamento consolidado do condomínio.',
};

interface DashboardPageProps {
  readonly params: Promise<{
    condId: string;
  }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { condId } = await params;

  const [
    pagamentosResponse,
    despesasResponse,
    cobrancasResponse,
    funcionariosResponse,
    imoveisResponse,
    condominosResponse,
  ] = await Promise.all([
    getPayments(condId, { page: 1, limit: 500 }),
    getAll(condId, { page: 1, limit: 500 }),
    getCobrancas(condId, { page: 1, limit: 500 }),
    getFuncionarios(condId, { page: 1, limit: 500 }),
    getImoveis(condId, { page: 1, limit: 500 }),
    getCondominos(condId, { page: 1, limit: 1 }),
  ]);

  return (
    <DashboardClient
      pagamentos={pagamentosResponse.items}
      despesas={despesasResponse.items}
      cobrancas={cobrancasResponse.items}
      funcionarios={funcionariosResponse.items}
      imoveis={imoveisResponse.items}
      condominosTotal={condominosResponse.meta.total}
    />
  );
}
