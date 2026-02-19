import { NextRequest, NextResponse } from 'next/server';
import { contractsDb } from '@/mocks/in-memory-db';

import { ContratoDetail } from '@/types/contrato';

const buildSearchIndex = (contract: ContratoDetail) => {
  return [
    contract.tenantName,
    contract.property,
    contract.propertyAddress,
    contract.startDate,
    contract.endDate,
  ]
    .join(' ')
    .toLowerCase();
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const sortParam = searchParams.get('sort');
  let sortField = sortParam;
  let sortOrder = searchParams.get('order') || 'asc';

  if (sortParam && sortParam.includes('.')) {
    const [field, order] = sortParam.split('.');
    sortField = field;
    sortOrder = order;
  }

  const columnsArr = searchParams.getAll('columns');
  const contentArr = searchParams.getAll('content');

  const filterMap = new Map<string, string[]>();
  for (let i = 0; i < columnsArr.length; i++) {
    const col = columnsArr[i];
    const val = contentArr[i];

    if (col && val !== undefined) {
      if (!filterMap.has(col)) {
        filterMap.set(col, []);
      }
      filterMap.get(col)!.push(val);
    }
  }

  let contracts = contractsDb;

  for (const [col, values] of filterMap.entries()) {
    if (col === 'tenantName') {
      const term = values[0].toLowerCase();
      contracts = contracts.filter((c) => buildSearchIndex(c).includes(term));
      continue;
    }

    contracts = contracts.filter((c) => {
      const fieldValue = c[col as keyof typeof c];
      if (fieldValue === undefined) return false;

      return values.some(
        (v) => String(fieldValue).toLowerCase() === v.toLowerCase()
      );
    });
  }

  const sortedContracts = [...contracts];

  if (sortField) {
    sortedContracts.sort((a, b) => {
      const fieldA = a[sortField as keyof typeof a];
      const fieldB = b[sortField as keyof typeof b];

      if (fieldA === undefined && fieldB === undefined) return 0;
      if (fieldA === undefined) return 1;
      if (fieldB === undefined) return -1;

      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalItems = contracts.length;
  const totalPages = Math.ceil(totalItems / limit);
  const safePage = Math.max(1, Math.min(page, totalPages > 0 ? totalPages : 1));

  const startIndex = (safePage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedContracts = sortedContracts.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedContracts,
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
  const { condId } = await params;
  const body = (await request.json()) as Partial<ContratoDetail>;

  const newContract: ContratoDetail = {
    id: Math.random().toString(36).substr(2, 9),
    condId,
    tenantName: body.tenantName || 'Sem nome',
    propertyAddress: body.propertyAddress || 'Sem endereço',
    property: body.property || 'Sem imóvel',
    status: body.status || 'agendado',
    startDate: body.startDate || new Date().toISOString().split('T')[0],
    endDate: body.endDate || new Date().toISOString().split('T')[0],
  };

  contractsDb.unshift(newContract);

  return NextResponse.json(
    { message: 'Contrato criado com sucesso', data: newContract },
    { status: 201 }
  );
}
