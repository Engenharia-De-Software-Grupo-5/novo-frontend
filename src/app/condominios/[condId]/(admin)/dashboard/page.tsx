import { Metadata } from 'next';

import { getCobrancas } from '@/features/cobrancas/services/cobrancaService';
import { DashboardClient } from '@/features/dashboard/components/dashboard-client';
import { despesaService } from '@/features/despesas/services/despesaService';
import { getFuncionarios } from '@/features/funcionarios/services/funcionarioService';
import { getImoveis } from '@/features/imoveis/services/imovelService';
import { getPayments } from '@/features/pagamentos/services/paymentService';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Acompanhamento consolidado do condomínio.',
};

interface DashboardPageProps {
  params: Promise<{
    condId: string;
  }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { condId } = await params;

  const [pagamentosResponse, despesasResponse, cobrancasResponse, funcionariosResponse, imoveisResponse] =
    await Promise.all([
      getPayments(condId, { page: 1, limit: 500 }),
      despesaService.getAll(condId, { page: 1, limit: 500 }),
      getCobrancas(condId, { page: 1, limit: 500 }),
      getFuncionarios(condId, { page: 1, limit: 500 }),
      getImoveis(condId, { page: 1, limit: 500 }),
    ]);

  return (
    <DashboardClient
      pagamentos={pagamentosResponse.data}
      despesas={despesasResponse.data}
      cobrancas={cobrancasResponse.data}
      funcionarios={funcionariosResponse.data}
      imoveis={imoveisResponse.data}
    />
  );
}
