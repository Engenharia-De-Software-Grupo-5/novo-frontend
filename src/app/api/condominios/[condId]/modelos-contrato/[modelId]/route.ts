import { NextRequest, NextResponse } from 'next/server';

import { contractModelsDb } from '@/mocks/in-memory-db';
import { extractTemplateInputs } from '@/lib/contratos-template-inputs';
import { ModeloContratoDetail } from '@/types/modelo-contrato';

const hydrateModelInputs = (model: ModeloContratoDetail): ModeloContratoDetail => ({
  ...model,
  inputs: extractTemplateInputs(model.rawText || ''),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ condId: string; modelId: string }> }
) {
  const { condId, modelId } = await params;

  const model = contractModelsDb.find(
    (item) => item.id === modelId && item.condId === condId
  );

  if (!model) {
    return NextResponse.json({ error: 'Model not found' }, { status: 404 });
  }

  return NextResponse.json(hydrateModelInputs(model));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string; modelId: string }> }
) {
  const { condId, modelId } = await params;
  const body = (await request.json()) as Partial<ModeloContratoDetail>;

  const index = contractModelsDb.findIndex(
    (item) => item.id === modelId && item.condId === condId
  );

  if (index === -1) {
    return NextResponse.json({ error: 'Model not found' }, { status: 404 });
  }

  const nextRawText = body.rawText ?? contractModelsDb[index].rawText;
  const nextName = body.name?.trim() || contractModelsDb[index].name;
  const nextPurpose = body.purpose?.trim() || contractModelsDb[index].purpose;

  if (!nextName || !nextPurpose || !nextRawText.trim()) {
    return NextResponse.json(
      { error: 'Nome, finalidade e conteúdo do modelo são obrigatórios.' },
      { status: 400 }
    );
  }

  contractModelsDb[index] = {
    ...contractModelsDb[index],
    name: nextName,
    purpose: nextPurpose,
    rawText: nextRawText,
    id: contractModelsDb[index].id,
    condId: contractModelsDb[index].condId,
  };
  contractModelsDb[index].inputs = extractTemplateInputs(contractModelsDb[index].rawText);

  return NextResponse.json(hydrateModelInputs(contractModelsDb[index]));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string; modelId: string }> }
) {
  return PUT(request, { params });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ condId: string; modelId: string }> }
) {
  const { condId, modelId } = await params;

  const index = contractModelsDb.findIndex(
    (item) => item.id === modelId && item.condId === condId
  );

  if (index === -1) {
    return NextResponse.json({ error: 'Model not found' }, { status: 404 });
  }

  contractModelsDb.splice(index, 1);

  return NextResponse.json({ success: true });
}
