import { NextRequest, NextResponse } from 'next/server';
import { contractsDb } from '@/mocks/in-memory-db';

import { ContratoDetail } from '@/types/contrato';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const { contractId } = await params;

  const contract = contractsDb.find((item) => item.id === contractId);

  if (!contract) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
  }

  return NextResponse.json(contract);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const { contractId } = await params;
  const body = (await request.json()) as Partial<ContratoDetail>;

  const index = contractsDb.findIndex((item) => item.id === contractId);

  if (index === -1) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
  }

  contractsDb[index] = { ...contractsDb[index], ...body };

  return NextResponse.json(contractsDb[index]);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const { contractId } = await params;
  const body = (await request.json()) as Partial<ContratoDetail>;

  const index = contractsDb.findIndex((item) => item.id === contractId);

  if (index === -1) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
  }

  contractsDb[index] = { ...contractsDb[index], ...body };

  return NextResponse.json(contractsDb[index]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  const { contractId } = await params;

  const index = contractsDb.findIndex((item) => item.id === contractId);

  if (index === -1) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
  }

  contractsDb.splice(index, 1);

  return NextResponse.json({ success: true });
}
