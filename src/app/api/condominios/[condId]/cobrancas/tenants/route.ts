import { NextResponse } from 'next/server';
import { cobrancaTenantsDb } from '@/mocks/in-memory-db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ condId: string }> }
) {
  await request;
  await params;
  return NextResponse.json(cobrancaTenantsDb);
}

