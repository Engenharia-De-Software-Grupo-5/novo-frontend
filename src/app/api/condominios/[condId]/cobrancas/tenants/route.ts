import { NextResponse } from 'next/server';
import { getCobrancaTenantsDb } from '@/mocks/in-memory-db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ condId: string }> }
) {
  await _request;
  const { condId } = await params;
  return NextResponse.json(getCobrancaTenantsDb(condId));
}
