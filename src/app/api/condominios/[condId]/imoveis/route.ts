import { NextRequest, NextResponse } from 'next/server';
import { imoveisDb } from '@/mocks/in-memory-db';

import { ImovelDetail, ImovelSummary } from '@/types/imoveis';

function toSummary(imovel: ImovelDetail): ImovelSummary {
  const name = imovel.endereco.nomePredio
    ? `${imovel.endereco.nomePredio} - ${imovel.idImovel}`
    : `${imovel.tipo.toUpperCase()} ${imovel.idImovel}`;

  return {
    idImovel: imovel.idImovel,
    name,
    tipo: imovel.tipo,
    situacao: imovel.situacao,
    endereco: `${imovel.endereco.rua}, ${imovel.endereco.numero}`,
    bairro: imovel.endereco.bairro,
    cidade: imovel.endereco.cidade,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string }> }
) {
  const { condId } = await params;
  const searchParams = request.nextUrl.searchParams;

  const page = Number.parseInt(searchParams.get('page') || '1', 10);
  const limit = Number.parseInt(searchParams.get('limit') || '20', 10);
  const sortParam = searchParams.get('sort');

  let sortField = sortParam;
  let sortOrder = searchParams.get('order') || 'asc';

  if (sortParam && sortParam.includes('.')) {
    const [field, order] = sortParam.split('.');
    sortField = field;
    sortOrder = order === 'desc' ? 'desc' : 'asc';
  }

  const columnsArr = searchParams.getAll('columns');
  const contentArr = searchParams.getAll('content');

  const filterMap = new Map<string, string[]>();
  for (let i = 0; i < columnsArr.length; i++) {
    const col = columnsArr[i];
    const value = contentArr[i];

    if (!col || value === undefined) continue;

    if (!filterMap.has(col)) {
      filterMap.set(col, []);
    }

    filterMap.get(col)!.push(value);
  }

  let summaries = imoveisDb
    .filter((imovel) => imovel.idCondominio === condId)
    .map(toSummary);

  for (const [col, values] of filterMap.entries()) {
    if (col === 'name') {
      const term = values[0]?.toLowerCase() || '';
      summaries = summaries.filter((imovel) =>
        imovel.name.toLowerCase().startsWith(term)
      );
      continue;
    }

    summaries = summaries.filter((imovel) => {
      const fieldValue = imovel[col as keyof ImovelSummary];
      if (fieldValue === undefined) return false;

      return values.some((value) => {
        return String(fieldValue).toLowerCase() === value.toLowerCase();
      });
    });
  }

  if (sortField) {
    summaries = [...summaries].sort((a, b) => {
      const fieldA = a[sortField as keyof ImovelSummary];
      const fieldB = b[sortField as keyof ImovelSummary];

      if (fieldA === undefined && fieldB === undefined) return 0;
      if (fieldA === undefined) return 1;
      if (fieldB === undefined) return -1;

      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalItems = summaries.length;
  const totalPages = Math.ceil(totalItems / limit);
  const safePage = Math.max(1, Math.min(page, totalPages > 0 ? totalPages : 1));

  const startIndex = (safePage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedImoveis = summaries.slice(startIndex, endIndex);

  console.log(paginatedImoveis);

  return NextResponse.json({
    data: paginatedImoveis,
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
  const body = (await request.json()) as Partial<ImovelDetail>;

  const nowId = `IMV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const hasLocatario =
    !!body.locatario?.nome ||
    !!body.locatario?.cpf ||
    !!body.locatario?.telefone;

  const newImovel: ImovelDetail = {
    idCondominio: condId,
    idImovel: body.idImovel || nowId,
    tipo: body.tipo || 'apartamento',
    situacao: body.situacao || 'ativo',
    endereco: {
      rua: body.endereco?.rua || '',
      numero: body.endereco?.numero || '',
      bairro: body.endereco?.bairro || '',
      cidade: body.endereco?.cidade || '',
      estado: body.endereco?.estado || '',
      nomePredio: body.endereco?.nomePredio,
      bloco: body.endereco?.bloco,
      torre: body.endereco?.torre,
    },
    locatario: hasLocatario
      ? {
          nome: body.locatario?.nome || '',
          cpf: body.locatario?.cpf || '',
          telefone: body.locatario?.telefone || '',
        }
      : null,
  };

  imoveisDb.unshift(newImovel);

  return NextResponse.json(
    { message: 'Imóvel criado com sucesso', data: newImovel },
    { status: 201 }
  );
}
