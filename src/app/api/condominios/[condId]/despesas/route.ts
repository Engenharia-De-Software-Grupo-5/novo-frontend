import { NextResponse } from 'next/server';
import { despesasDb } from '@/mocks/in-memory-db';

import { DespesaDetail } from '@/types/despesa';
import { FileAttachment } from '@/types/file';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number.Number.parseInt(searchParams.get('page') || '1');
  const limit = Number.Number.parseInt(searchParams.get('limit') || '10');
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
        const itemValue = String(item[col as keyof DespesaDetail] || '');
        if (col === 'nome') {
          if (
            !values.some((v) =>
              itemValue.toLowerCase().includes(v.toLowerCase())
            )
          )
            return false;
        } else {
          if (!values.includes(itemValue)) return false;
        }
      }
      return true;
    });
  }

  const total = data.length;
  const pageCount = Math.ceil(total / limit);
  const paginatedData = data.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    data: paginatedData,
    meta: { pageIndex: page, pageCount, total },
  });
}

export async function POST(request: Request) {
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
        id: `file-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/uploads/${Math.random().toString(36).substr(2, 9)}_${file.name}`,
      }));
  } else {
    data = await request.json();
  }

  const novaDespesa = {
    ...data,
    id: `DSP-${Math.floor(Math.random() * 10000)}`,
    anexos,
  };

  despesasDb.unshift(novaDespesa);
  return NextResponse.json(novaDespesa, { status: 201 });
}
