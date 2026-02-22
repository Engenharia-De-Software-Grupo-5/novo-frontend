'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';

import { Button } from '@/features/components/ui/button';

export function AddModeloContratoButton() {
  const params = useParams();
  const condId = params?.condId as string;

  return (
    <Button size="sm" asChild>
      <Link href={`/condominios/${condId}/modelos/novo`}>
        <Plus className="h-4 w-4" />
        Adicionar Modelo
      </Link>
    </Button>
  );
}
