import { NextResponse } from 'next/server';
import { getDespesasDb } from '@/mocks/in-memory-db';

import { DespesaDetail } from '@/types/despesa';
import { secureRandom } from '@/lib/secure-random';

export async function GET(
  request: Request,
  props: { params: Promise<{ condId: string; id: string }> }
) {
  const params = await props.params;
  const despesasDb = getDespesasDb(params.condId);

  const despesa = despesasDb.find((d) => d.id === params.id);

  if (!despesa)
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

  return NextResponse.json(despesa);
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ condId: string; id: string }> }
) {
  const params = await props.params;
  const despesasDb = getDespesasDb(params.condId);

  const index = despesasDb.findIndex((d) => d.id === params.id);
  if (index === -1)
    return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

  const contentType = request.headers.get('content-type') || '';
  let data: Partial<DespesaDetail>;
  let finalAnexos = [...despesasDb[index].anexos];

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();

    const parsedData: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      if (key !== 'anexos' && key !== 'existingFileIds') {
        if (typeof value === 'string') {
          try {
            parsedData[key] = JSON.parse(value);
          } catch {
            parsedData[key] = value;
          }
        } else {
          parsedData[key] = value;
        }
      }
    });
    data = parsedData as unknown as Partial<DespesaDetail>;

    const existingFileIdsStr = formData.get('existingFileIds');
    if (existingFileIdsStr) {
      const existingIds = JSON.parse(existingFileIdsStr as string);
      finalAnexos = finalAnexos.filter((a) => existingIds.includes(a.id));
    }

    const novosAnexos = formData
      .getAll('anexos')
      .filter((f): f is File => f instanceof File)
      .map((file) => ({
        id: `file-${secureRandom(9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/uploads/${secureRandom(9)}_${file.name}`,
      }));

    finalAnexos = [...finalAnexos, ...novosAnexos];
  } else {
    data = (await request.json()) as Partial<DespesaDetail>;
  }

  despesasDb[index] = { ...despesasDb[index], ...data, anexos: finalAnexos };
  return NextResponse.json(despesasDb[index]);
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ condId: string; id: string }> }
) {
  const params = await props.params;
  const despesasDb = getDespesasDb(params.condId);

  const index = despesasDb.findIndex((d) => d.id === params.id);
  if (index !== -1) {
    despesasDb.splice(index, 1);
  }

  return new NextResponse(null, { status: 204 });
}
