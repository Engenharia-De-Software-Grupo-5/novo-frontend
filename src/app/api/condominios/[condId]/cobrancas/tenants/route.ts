import { NextResponse } from 'next/server';
import { getCobrancaTenantsDb } from '@/mocks/in-memory-db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ condId: string }> }
) {
  await request;
  const { condId } = await params;
  return NextResponse.json(getCobrancaTenantsDb(condId));
}
