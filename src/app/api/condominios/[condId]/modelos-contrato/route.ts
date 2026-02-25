import { NextRequest, NextResponse } from 'next/server';
import { contractModelsDb } from '@/mocks/in-memory-db';

import { ModeloContratoDetail } from '@/types/modelo-contrato';
import { extractTemplateInputs } from '@/lib/contratos-template-inputs';
import { secureRandom } from '@/lib/secure-random';

const buildSearchIndex = (model: ModeloContratoDetail) => {
  return [model.name, model.purpose, model.createdAt].join(' ').toLowerCase();
};

const hydrateModelInputs = (
  model: ModeloContratoDetail
): ModeloContratoDetail => ({
  ...model,
  inputs: extractTemplateInputs(model.rawText || ''),
});

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

  let models = contractModelsDb
    .filter((item) => item.condId === condId)
    .map(hydrateModelInputs);

  for (const [col, values] of filterMap.entries()) {
    if (col === 'name') {
      const term = values[0].toLowerCase();
      models = models.filter((model) => buildSearchIndex(model).includes(term));
      continue;
    }

    models = models.filter((model) => {
      const fieldValue = model[col as keyof typeof model];
      if (fieldValue === undefined) return false;

      return values.some(
        (v) => String(fieldValue).toLowerCase() === v.toLowerCase()
      );
    });
  }

  const sortedModels = [...models];

  if (sortField) {
    sortedModels.sort((a, b) => {
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

  const totalItems = models.length;
  const totalPages = Math.ceil(totalItems / limit);
  const safePage = Math.max(1, Math.min(page, totalPages > 0 ? totalPages : 1));

  const startIndex = (safePage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedModels = sortedModels
    .slice(startIndex, endIndex)
    .map((item) => ({
      id: item.id,
      name: item.name,
      purpose: item.purpose,
      createdAt: item.createdAt,
    }));

  return NextResponse.json({
    items: paginatedModels,
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
  const body = (await request.json()) as Partial<ModeloContratoDetail>;
  const rawText = body.rawText || '';
  const name = body.name?.trim();
  const purpose = body.purpose?.trim();

  if (!name || !purpose || !rawText.trim()) {
    return NextResponse.json(
      { error: 'Nome, finalidade e conteúdo do modelo são obrigatórios.' },
      { status: 400 }
    );
  }

  const newModel: ModeloContratoDetail = {
    id: secureRandom(9),
    condId,
    name,
    purpose,
    rawText,
    inputs: extractTemplateInputs(rawText),
    createdAt: new Date().toISOString().split('T')[0],
  };

  contractModelsDb.unshift(newModel);

  return NextResponse.json(
    { message: 'Modelo criado com sucesso', items: newModel },
    { status: 201 }
  );
}
