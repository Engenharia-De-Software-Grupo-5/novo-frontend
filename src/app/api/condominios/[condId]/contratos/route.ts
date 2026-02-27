import { NextRequest, NextResponse } from 'next/server';
import { contractModelsDb, contractsDb } from '@/mocks/in-memory-db';

import { ContratoDetail } from '@/types/contrato';
import { secureRandom } from '@/lib/secure-random';

const buildSearchIndex = (contract: ContratoDetail) => {
  return [
    contract.tenantName,
    contract.property,
    contract.createdAt,
    contract.dueDate,
    contract.pdfFileName,
  ]
    .join(' ')
    .toLowerCase();
};

const normalizeValue = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value : '';

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

  if (sortParam?.includes('.')) {
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
      if (!filterMap.has(col)) filterMap.set(col, []);
      filterMap.get(col)!.push(val);
    }
  }

  let contracts = contractsDb.filter((contract) => contract.condId === condId);

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
        (v) =>
          (typeof fieldValue === 'object'
            ? JSON.stringify(fieldValue)
            : String(fieldValue)
          ).toLowerCase() === v.toLowerCase()
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
    items: paginatedContracts,
    meta: {
      totalItems: totalItems,
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
  const contentType = request.headers.get('content-type') || '';

  let payload: Omit<ContratoDetail, 'id' | 'condId'> | null = null;

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const contractFile = formData.get('contractPdf');

    if (!(contractFile instanceof File)) {
      return NextResponse.json(
        { error: 'Arquivo PDF do contrato é obrigatório.' },
        { status: 400 }
      );
    }

    payload = {
      tenantName: normalizeValue(formData.get('tenantName')) || 'Sem locatário',
      tenantId: normalizeValue(formData.get('tenantId')) || undefined,
      property: normalizeValue(formData.get('property')) || 'Sem imóvel',
      propertyId: normalizeValue(formData.get('propertyId')) || undefined,
      createdAt:
        normalizeValue(formData.get('createdAt')) ||
        new Date().toISOString().split('T')[0],
      dueDate:
        normalizeValue(formData.get('dueDate')) ||
        new Date().toISOString().split('T')[0],
      pdfFileName: contractFile.name || 'contrato.pdf',
      pdfFileUrl: `/mock-files/contracts/${Date.now()}-${contractFile.name}`,
      sourceType: 'upload',
    };
  } else {
    const body = (await request.json()) as Partial<ContratoDetail> & {
      modelInputValues?: Record<string, string>;
    };

    if (!body.modelId) {
      return NextResponse.json(
        { error: 'Modelo de contrato é obrigatório para este fluxo.' },
        { status: 400 }
      );
    }

    const selectedModel = contractModelsDb.find(
      (model) => model.id === body.modelId && model.condId === condId
    );

    if (!selectedModel) {
      return NextResponse.json(
        { error: 'Modelo não encontrado.' },
        { status: 404 }
      );
    }

    payload = {
      tenantName: body.tenantName || 'Sem locatário',
      tenantId: body.tenantId,
      property: body.property || 'Sem imóvel',
      propertyId: body.propertyId,
      createdAt: body.createdAt || new Date().toISOString().split('T')[0],
      dueDate: body.dueDate || new Date().toISOString().split('T')[0],
      pdfFileName: `contrato-${selectedModel.name.toLowerCase().replaceAll(' ', '-')}.pdf`,
      pdfFileUrl: `/mock-files/contracts/gerado-${Date.now()}.pdf`,
      sourceType: 'model',
      modelId: selectedModel.id,
      modelName: selectedModel.name,
      modelInputValues: body.modelInputValues || {},
    };
  }

  const newContract: ContratoDetail = {
    id: secureRandom(9),
    condId,
    ...payload,
  };

  contractsDb.unshift(newContract);

  return NextResponse.json(
    { message: 'Contrato criado com sucesso', items: newContract },
    { status: 201 }
  );
}
