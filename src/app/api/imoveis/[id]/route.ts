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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  console.log(`Updated information for imovel ${id}:`, body);
  return NextResponse.json(body);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  console.log(`Patched information for imovel ${id}:`, body);
  return NextResponse.json(body);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log(`imovel com id ${id} foi apagado`);
  return NextResponse.json({ message: 'Imovel deleted' });
}