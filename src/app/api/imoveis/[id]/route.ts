import { NextRequest, NextResponse } from 'next/server';
import { mockImoveis } from '@/mocks/imoveis';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const imovel = mockImoveis.find((i) => i.idImovel === id);

  if (!imovel) {
    return NextResponse.json({ error: 'Imovel not found' }, { status: 404 });
  }

  return NextResponse.json(imovel);
}
