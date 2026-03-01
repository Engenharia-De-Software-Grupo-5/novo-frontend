import { NextRequest, NextResponse } from 'next/server';
import { imoveisDb } from '@/mocks/in-memory-db';

import { FileAttachment } from '@/types/file';
import { ImovelDetail } from '@/types/imoveis';
import { secureRandom } from '@/lib/secure-random';

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
    return NextResponse.json(
      { error: 'Imóvel não encontrado' },
      { status: 404 }
    );
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
  const index = getImovelIndex(condId, id);

  if (index === -1) {
    return NextResponse.json(
      { error: 'Imóvel não encontrado' },
      { status: 404 }
    );
  }

  const current = imoveisDb[index];

  let body: Partial<ImovelDetail>;
  let keptVistorias: FileAttachment[] | undefined;
  let keptDocumentos: FileAttachment[] | undefined;
  let uploadedVistorias: FileAttachment[] = [];
  let uploadedDocumentos: FileAttachment[] = [];

  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const dataField = formData.get('data');
    body = dataField ? JSON.parse(dataField as string) : {};

    // Single existingFileIds covers all kept attachments (vistorias + documentos)
    const existingIdsField = formData.get('existingFileIds');
    const existingFileIds: string[] | undefined = existingIdsField
      ? JSON.parse(existingIdsField as string)
      : undefined;

    // New uploads
    uploadedVistorias = (formData.getAll('vistoriasFiles') as File[])
      .filter((f): f is File => f instanceof File)
      .map((file) => ({
        id: `vst-${secureRandom(9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/uploads/vistorias/${secureRandom(9)}_${file.name}`,
      }));

    uploadedDocumentos = (formData.getAll('documentosFiles') as File[])
      .filter((f): f is File => f instanceof File)
      .map((file) => ({
        id: `doc-${secureRandom(9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/uploads/documentos/${secureRandom(9)}_${file.name}`,
      }));

    // Filter each array independently against the unified existingFileIds set
    if (existingFileIds !== undefined) {
      keptVistorias = (current.vistorias ?? []).filter((v) =>
        existingFileIds.includes(v.id)
      );
      keptDocumentos = (current.documentos ?? []).filter((d) =>
        existingFileIds.includes(d.id)
      );
    }

    console.log(
      `PUT: Mantidas ${keptVistorias?.length ?? 'todas'} vistorias, ${keptDocumentos?.length ?? 'todos'} documentos; ${uploadedVistorias.length} nova(s) vistoria(s), ${uploadedDocumentos.length} novo(s) documento(s)`
    );
  } else {
    body = (await request.json()) as Partial<ImovelDetail>;
  }

  const hasLocatario =
    !!body.locatario?.nome ||
    !!body.locatario?.cpf ||
    !!body.locatario?.telefone;

  let updatedLocatario = current.locatario;
  if (body.locatario !== undefined) {
    if (hasLocatario) {
      updatedLocatario = {
        nome: body.locatario?.nome || '',
        cpf: body.locatario?.cpf || '',
        telefone: body.locatario?.telefone || '',
      };
    } else {
      updatedLocatario = null;
    }
  }

  const finalVistorias = [
    ...(keptVistorias ?? current.vistorias ?? []),
    ...uploadedVistorias,
  ];
  const finalDocumentos = [
    ...(keptDocumentos ?? current.documentos ?? []),
    ...uploadedDocumentos,
  ];

  const updated: ImovelDetail = {
    ...current,
    ...body,
    idCondominio: current.idCondominio,
    idImovel: current.idImovel,
    endereco: {
      ...current.endereco,
      ...body.endereco,
    },
    locatario: updatedLocatario,
    vistorias: finalVistorias.length > 0 ? finalVistorias : undefined,
    documentos: finalDocumentos.length > 0 ? finalDocumentos : undefined,
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
    return NextResponse.json(
      { error: 'Imóvel não encontrado' },
      { status: 404 }
    );
  }

  const current = imoveisDb[index];
  let patchedLocatario = current.locatario;
  if (body.locatario !== undefined) {
    const hasPatchedLocatario =
      body.locatario?.nome || body.locatario?.cpf || body.locatario?.telefone;
    if (hasPatchedLocatario) {
      patchedLocatario = {
        nome: body.locatario?.nome || '',
        cpf: body.locatario?.cpf || '',
        telefone: body.locatario?.telefone || '',
      };
    } else {
      patchedLocatario = null;
    }
  }

  const patched: ImovelDetail = {
    ...current,
    ...body,
    endereco: {
      ...current.endereco,
      ...body.endereco,
    },
    locatario: patchedLocatario,
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
    return NextResponse.json(
      { error: 'Imóvel não encontrado' },
      { status: 404 }
    );
  }

  imoveisDb.splice(index, 1);

  return NextResponse.json({ message: `Imóvel ${id} foi removido.` });
}
