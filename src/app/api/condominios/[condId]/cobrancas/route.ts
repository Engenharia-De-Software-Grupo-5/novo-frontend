import { NextRequest, NextResponse } from 'next/server';
import { cobrancasDb, cobrancaTenantsDb } from '@/mocks/in-memory-db';

import { CobrancaDetail, CobrancaStatus } from '@/types/cobranca';
import { FileAttachment } from '@/types/file';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string }> }
) {
  await params;
  const searchParams = request.nextUrl.searchParams;
  const page = Number.parseInt(searchParams.get('page') || '1');
  const limit = Number.parseInt(searchParams.get('limit') || '10');
  const sortParam = searchParams.get('sort');
  let sortField = sortParam;
  let sortOrder = searchParams.get('order') || 'asc';

  if (sortParam && sortParam.includes('.')) {
    const [field, order] = sortParam.split('.');
    sortField = field;
    sortOrder = order;
  }

  const columns = searchParams.getAll('columns');
  const content = searchParams.getAll('content');
  const filterMap = new Map<string, string[]>();

  for (let i = 0; i < columns.length; i++) {
    const col = columns[i];
    const value = content[i];
    if (!col || value === undefined) {
      continue;
    }

    if (!filterMap.has(col)) {
      filterMap.set(col, []);
    }

    filterMap.get(col)?.push(value);
  }

  let filtered = [...cobrancasDb];

  for (const [column, values] of filterMap.entries()) {
    if (column === 'name') {
      const query = values[0].toLowerCase();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
      continue;
    }

    filtered = filtered.filter((item) => {
      const current = item[column as keyof CobrancaDetail];
      if (current === undefined) {
        return false;
      }

      return values.some(
        (value) => String(current).toLowerCase() === value.toLowerCase()
      );
    });
  }

  if (sortField) {
    filtered.sort((a, b) => {
      const valueA = a[sortField as keyof CobrancaDetail];
      const valueB = b[sortField as keyof CobrancaDetail];

      if (valueA === undefined && valueB === undefined) return 0;
      if (valueA === undefined) return 1;
      if (valueB === undefined) return -1;

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const safePage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (safePage - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  const summaries = paginated.map((item) => ({
    id: item.id,
    tenantId: item.tenantId,
    name: item.name,
    email: item.email,
    cpf: item.cpf,
    type: item.type,
    status: item.status,
    dueDate: item.dueDate,
    value: item.value,
    isActive: item.isActive,
  }));

  return NextResponse.json({
    data: summaries,
    meta: {
      total: totalItems,
      page: safePage,
      limit,
      totalPages,
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string }> }
) {
  await params;
  const contentType = request.headers.get('content-type') || '';

  let body: Partial<CobrancaDetail> = {};
  let attachments: FileAttachment[] = [];

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const dataField = formData.get('data');
    body = dataField ? JSON.parse(dataField as string) : {};

    attachments = formData
      .getAll('files')
      .filter((file): file is File => file instanceof File)
      .map((file) => ({
        id: `att-${Math.random().toString(36).slice(2, 11)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/uploads/cobrancas/${Math.random().toString(36).slice(2, 11)}_${file.name}`,
      }));
  } else {
    body = await request.json();
  }

  const tenant = cobrancaTenantsDb.find((item) => item.id === body.tenantId);
  if (!tenant) {
    return NextResponse.json(
      { error: 'Condômino não encontrado.' },
      { status: 400 }
    );
  }

  const isActive = body.isActive ?? true;
  const status: CobrancaStatus = 'pendente';

  const created: CobrancaDetail = {
    id: `cob-${Math.random().toString(36).slice(2, 9)}`,
    tenantId: tenant.id,
    name: tenant.name,
    email: tenant.email,
    cpf: tenant.cpf,
    type: body.type || 'boleto_mensal',
    dueDate: body.dueDate || '',
    value: Number(body.value || 0),
    status,
    isActive,
    paymentMethod: body.paymentMethod || 'boleto',
    penalty: Number(body.penalty || 0),
    interest: Number(body.interest || 0),
    paymentDate: body.paymentDate,
    observation: body.observation,
    attachments,
  };

  cobrancasDb.unshift(created);

  return NextResponse.json(
    { message: 'Cobrança criada com sucesso.', data: created },
    { status: 201 }
  );
}
