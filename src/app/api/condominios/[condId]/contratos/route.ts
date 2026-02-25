import { NextRequest, NextResponse } from 'next/server';

import { condominos } from '@/mocks/condominos';
import { contractsDb, contractModelsDb, imoveisDb } from '@/mocks/in-memory-db';
import { ContratoDetail, ContratoPostDTO } from '@/types/contrato';

const normalizeValue = (value: FormDataEntryValue | null) =>
  typeof value === 'string' ? value : '';

const getLegacyValue = <T extends object, K extends string>(
  record: T,
  key: K
): string => {
  const value = (record as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : '';
};

const normalizeContract = (contract: ContratoDetail): ContratoDetail => {
  const propertyName = contract.propertyName || getLegacyValue(contract, 'property');
  const startDate = contract.startDate || getLegacyValue(contract, 'createdAt');
  const content =
    contract.content ||
    (contract.modelInputValues
      ? JSON.stringify(contract.modelInputValues)
      : 'Contrato enviado por upload');

  return {
    ...contract,
    propertyName,
    startDate,
    content,
    tenantId: contract.tenantId || '',
    propertyId: contract.propertyId || '',
  };
};

const buildSearchIndex = (contract: ContratoDetail) => {
  return [
    contract.tenantName,
    contract.propertyName,
    contract.startDate,
    contract.dueDate,
    contract.pdfFileName,
    contract.content,
  ]
    .join(' ')
    .toLowerCase();
};

const toSafeToken = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

const buildPdfFileName = (tenantName: string) => {
  const words = tenantName.split(/\s+/).filter(Boolean);
  const firstName = toSafeToken(words[0] || 'locatario');
  const secondName = toSafeToken(words[1] || 'semsobrenome');
  return `${firstName}_${secondName}_contrato.pdf`;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string }> }
) {
  const { condId } = await params;
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const sortParam = searchParams.get('sort');
  let sortField = sortParam;
  let sortOrder = searchParams.get('order') || 'asc';

  if (sortParam && sortParam.includes('.')) {
    const [field, order] = sortParam.split('.');
    sortField = field;
    sortOrder = order;
  }

  if (sortField === 'property') sortField = 'propertyName';
  if (sortField === 'createdAt') sortField = 'startDate';

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

  let contracts = contractsDb
    .filter((contract) => contract.condId === condId)
    .map(normalizeContract);

  for (const [col, values] of filterMap.entries()) {
    const normalizedCol =
      col === 'property' ? 'propertyName' : col === 'createdAt' ? 'startDate' : col;

    if (normalizedCol === 'tenantName') {
      const term = values[0].toLowerCase();
      contracts = contracts.filter((c) => buildSearchIndex(c).includes(term));
      continue;
    }

    contracts = contracts.filter((c) => {
      const fieldValue = c[normalizedCol as keyof typeof c];
      if (fieldValue === undefined) return false;
      return values.some((v) => String(fieldValue).toLowerCase() === v.toLowerCase());
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
  const contentType = request.headers.get('content-type') || '';
  let payload: ContratoPostDTO | null = null;
  let modelInputValues: Record<string, string> | undefined;
  let modelId: string | undefined;
  let modelName: string | undefined;
  let sourceType: 'upload' | 'model' = 'upload';
  let uploadedFile: File | null = null;

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const contractFile = formData.get('contractPdf');
    uploadedFile = contractFile instanceof File ? contractFile : null;

    payload = {
      tenantId: normalizeValue(formData.get('tenantId')),
      propertyId: normalizeValue(formData.get('propertyId')),
      content:
        normalizeValue(formData.get('content')) ||
        (uploadedFile ? `Arquivo enviado: ${uploadedFile.name}` : ''),
      startDate:
        normalizeValue(formData.get('startDate')) ||
        normalizeValue(formData.get('createdAt')),
      dueDate: normalizeValue(formData.get('dueDate')),
    };
  } else {
    const body = (await request.json()) as Partial<ContratoPostDTO> & {
      sourceType?: 'upload' | 'model';
      createdAt?: string;
      startDate?: string;
      modelId?: string;
      modelInputValues?: Record<string, string>;
    };

    sourceType = body.sourceType || (body.modelId ? 'model' : 'upload');

    payload = {
      tenantId: body.tenantId || '',
      propertyId: body.propertyId || '',
      content: body.content || '',
      startDate: body.startDate || body.createdAt || '',
      dueDate: body.dueDate || '',
    };

    if (sourceType === 'model') {
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
        return NextResponse.json({ error: 'Modelo não encontrado.' }, { status: 404 });
      }

      modelId = selectedModel.id;
      modelName = selectedModel.name;
    }

    modelInputValues = body.modelInputValues || undefined;
  }

  if (
    !payload.tenantId ||
    !payload.propertyId ||
    !payload.content ||
    !payload.startDate ||
    !payload.dueDate
  ) {
    return NextResponse.json(
      { error: 'PostDTO inválido. Campos obrigatórios: tenantId, propertyId, content, startDate, dueDate.' },
      { status: 400 }
    );
  }

  const tenant = condominos.find(
    (item) => item.condominiumId === condId && item.id === payload.tenantId
  );

  if (!tenant) {
    return NextResponse.json({ error: 'Locatário não encontrado.' }, { status: 404 });
  }

  const property = imoveisDb.find(
    (item) => item.idCondominio === condId && item.idImovel === payload.propertyId
  );

  if (!property) {
    return NextResponse.json({ error: 'Imóvel não encontrado.' }, { status: 404 });
  }

  const tenantName = tenant.name;
  const propertyName =
    property.nome?.trim() || `${payload.propertyId} / ${property.tipo.toUpperCase()}`;
  const pdfFileName = buildPdfFileName(tenantName);
  const pdfFileUrl = uploadedFile
    ? `/mock-files/contracts/${Date.now()}-${pdfFileName}`
    : `/mock-files/contracts/gerado-${Date.now()}-${pdfFileName}`;

  const newContract: ContratoDetail = {
    id: Math.random().toString(36).slice(2, 11),
    condId,
    tenantId: payload.tenantId,
    propertyId: payload.propertyId,
    content: payload.content,
    tenantName,
    propertyName,
    startDate: payload.startDate,
    dueDate: payload.dueDate,
    pdfFileName,
    pdfFileUrl,
    sourceType,
    modelId,
    modelName,
    modelInputValues,
  };

  contractsDb.unshift(newContract);

  return NextResponse.json(
    { message: 'Contrato criado com sucesso', data: newContract },
    { status: 201 }
  );
}
