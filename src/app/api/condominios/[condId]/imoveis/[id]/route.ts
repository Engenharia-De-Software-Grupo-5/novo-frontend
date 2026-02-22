import { NextRequest, NextResponse } from 'next/server';

import { imoveisDb } from '@/mocks/in-memory-db';
import { ImovelDetail } from '@/types/imoveis';

function getImovelIndex(condId: string, id: string) {
  return imoveisDb.findIndex(
    (imovel) => imovel.idCondominio === condId && imovel.idImovel === id
  );
}

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ condId: string; id: string }>;
  }
) {
  const { condId, id } = await params;
  const imovel = imoveisDb.find(
    (item) => item.idCondominio === condId && item.idImovel === id
  );

  if (!imovel) {
    return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
  }

  return NextResponse.json(imovel);
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ condId: string; id: string }>;
  }
) {
  const { condId, id } = await params;
  const body = (await request.json()) as Partial<ImovelDetail>;
  const index = getImovelIndex(condId, id);

  if (index === -1) {
    return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
  }

  const current = imoveisDb[index];
  const hasLocatario =
    !!body.locatario?.nome || !!body.locatario?.cpf || !!body.locatario?.telefone;

  const updated: ImovelDetail = {
    ...current,
    ...body,
    idCondominio: current.idCondominio,
    idImovel: current.idImovel,
    endereco: {
      ...current.endereco,
      ...body.endereco,
    },
    locatario:
      body.locatario === undefined
        ? current.locatario
        : hasLocatario
          ? {
              nome: body.locatario?.nome || '',
              cpf: body.locatario?.cpf || '',
              telefone: body.locatario?.telefone || '',
            }
          : null,
  };

  imoveisDb[index] = updated;

  return NextResponse.json(updated);
}

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ condId: string; id: string }>;
  }
) {
  const { condId, id } = await params;
  const body = (await request.json()) as Partial<ImovelDetail>;
  const index = getImovelIndex(condId, id);

  if (index === -1) {
    return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
  }

  const current = imoveisDb[index];
  const patched: ImovelDetail = {
    ...current,
    ...body,
    endereco: {
      ...current.endereco,
      ...body.endereco,
    },
    locatario:
      body.locatario === undefined
        ? current.locatario
        : body.locatario?.nome || body.locatario?.cpf || body.locatario?.telefone
          ? {
              nome: body.locatario?.nome || '',
              cpf: body.locatario?.cpf || '',
              telefone: body.locatario?.telefone || '',
            }
          : null,
  };

  imoveisDb[index] = patched;

  return NextResponse.json(patched);
}

export async function DELETE(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ condId: string; id: string }>;
  }
) {
  const { condId, id } = await params;
  const index = getImovelIndex(condId, id);

  if (index === -1) {
    return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
  }

  imoveisDb.splice(index, 1);

  return NextResponse.json({ message: `Imóvel ${id} foi removido.` });
}
