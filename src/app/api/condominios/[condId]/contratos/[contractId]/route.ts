import { NextRequest, NextResponse } from 'next/server';
import { contractsDb } from '@/mocks/in-memory-db';
import { ContratoDetail } from '@/types/contrato';

const getLegacyValue = (record: Record<string, unknown>, key: string) => {
  const value = record[key];
  return typeof value === 'string' ? value : '';
};

const normalizeContract = (contract: ContratoDetail): ContratoDetail => {
  const asRecord = contract as unknown as Record<string, unknown>;

  return {
    ...contract,
    propertyName: contract.propertyName || getLegacyValue(asRecord, 'property'),
    startDate: contract.startDate || getLegacyValue(asRecord, 'createdAt'),
    content:
      contract.content ||
      (contract.modelInputValues
        ? JSON.stringify(contract.modelInputValues)
        : 'Contrato enviado por upload'),
    tenantId: contract.tenantId || '',
    propertyId: contract.propertyId || '',
  };
};

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

  return NextResponse.json(normalizeContract(contract));
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Contrato não pode ser editado após criação.' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Contrato não pode ser editado após criação.' },
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
