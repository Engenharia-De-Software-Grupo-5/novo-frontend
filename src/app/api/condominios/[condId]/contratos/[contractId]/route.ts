import { NextRequest, NextResponse } from 'next/server';
import { contractsDb } from '@/mocks/in-memory-db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ condId: string; contractId: string }> }
) {
  const { condId, contractId } = await params;

  const contract = contractsDb.find(
    (item) => item.id === contractId && item.condId === condId
  );

  if (!contract) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
  }

  return NextResponse.json(contract);
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Contrato não pode ser editado após criação. PUT' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Contrato não pode ser editado após criação. PATCH' },
    { status: 405 }
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ condId: string; contractId: string }> }
) {
  const { condId, contractId } = await params;

  const index = contractsDb.findIndex(
    (item) => item.id === contractId && item.condId === condId
  );

  if (index === -1) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
  }

  contractsDb.splice(index, 1);

  return NextResponse.json({ success: true });
}
