import AddModeloContrato from '@/features/modelos-contrato/components/add-modelo-contrato';

interface NovoModeloPageProps {
  readonly params: Promise<{ condId: string }>;
}

export default async function NovoModeloPage({ params }: NovoModeloPageProps) {
  const { condId } = await params;

  return <AddModeloContrato condId={condId} />;
}
