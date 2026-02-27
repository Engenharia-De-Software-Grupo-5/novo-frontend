import { NextResponse } from 'next/server';
import { getDespesasDb } from '@/mocks/in-memory-db';

import { DespesaDetail } from '@/types/despesa';
import { FileAttachment } from '@/types/file';
import { secureRandom } from '@/lib/secure-random';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ condId: string }> }
) {
  const { condId } = await params;
  const despesasDb = getDespesasDb(condId);
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get('page') || '1');
  const limit = Number.parseInt(searchParams.get('limit') || '10');
  const columns =
    searchParams.getAll('columns').length > 0
      ? searchParams.getAll('columns')
      : searchParams.getAll('columns[]');

  const content =
    searchParams.getAll('content').length > 0
      ? searchParams.getAll('content')
      : searchParams.getAll('content[]');

  let data = [...despesasDb];

  if (columns.length > 0 && content.length > 0) {
    const filters = new Map<string, string[]>();
    columns.forEach((col, index) => {
      if (!filters.has(col)) filters.set(col, []);
      filters.get(col)!.push(content[index]);
    });

    data = data.filter((item: DespesaDetail) => {
      for (const [col, values] of Array.from(filters.entries())) {
        const auxValue = item[col as keyof DespesaDetail];
        const itemValue =
          typeof auxValue === 'object' && auxValue !== null
            ? JSON.stringify(auxValue)
            : String(auxValue);
        if (col === 'nome') {
          if (
            !values.some((v) =>
              itemValue.toLowerCase().includes(v.toLowerCase())
            )
          )
            return false;
        } else if (!values.includes(itemValue)) {
          return false;
        }
      }
      return true;
    });
  }

  const totalItems = data.length;
  const pageCount = Math.ceil(totalItems / limit);
  const paginatedData = data.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    items: paginatedData,
    meta: { pageIndex: page, pageCount, totalItems },
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ condId: string }> }
) {
  const { condId } = await params;
  const despesasDb = getDespesasDb(condId);
  const contentType = request.headers.get('content-type') || '';
  let data: DespesaDetail;
  let anexos: FileAttachment[] = [];

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    data = JSON.parse((formData.get('data') as string) || '{}');

    anexos = formData
      .getAll('anexos')
      .filter((f): f is File => f instanceof File)
      .map((file) => ({
        id: `file-${secureRandom(9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/uploads/${secureRandom(9)}_${file.name}`,
      }));
  } else {
    data = await request.json();
  }

  const novaDespesa = {
    ...data,
    id: `DSP-${secureRandom(7)}`,
    anexos,
  };

  despesasDb.unshift(novaDespesa);
  return NextResponse.json(novaDespesa, { status: 201 });
}
