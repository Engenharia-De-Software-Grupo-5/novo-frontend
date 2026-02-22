import { NextRequest, NextResponse } from 'next/server';
import { getCobrancasDb, getCobrancaTenantsDb } from '@/mocks/in-memory-db';

import { CobrancaDetail, CobrancaStatus } from '@/types/cobranca';
import { FileAttachment } from '@/types/file';

const resolveStatus = (
  dueDate: string,
  paymentDate?: string,
  isActive = true
): CobrancaStatus => {
  if (!isActive) return 'desativada';
  if (paymentDate) return 'pago';

  const due = new Date(dueDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return due < today ? 'vencida' : 'pendente';
};

interface ParsedCobrancaBody {
  body: Partial<CobrancaDetail>;
  keptAttachments: FileAttachment[] | undefined;
  uploadedAttachments: FileAttachment[];
}

async function parseCobrancaBody(
  request: NextRequest,
  currentAttachments: FileAttachment[]
): Promise<ParsedCobrancaBody> {
  const contentType = request.headers.get('content-type') ?? '';

  if (!contentType.includes('multipart/form-data')) {
    const body = (await request.json()) as Partial<CobrancaDetail>;
    return { body, keptAttachments: undefined, uploadedAttachments: [] };
  }

  const formData = await request.formData();
  const dataField = formData.get('data');
  const body: Partial<CobrancaDetail> = dataField
    ? JSON.parse(dataField as string)
    : {};

  const existingIds = formData.get('existingFileIds');
  const idsToKeep: string[] | undefined = existingIds
    ? JSON.parse(existingIds as string)
    : undefined;

  const keptAttachments =
    idsToKeep !== undefined
      ? currentAttachments.filter((item) => idsToKeep.includes(item.id))
      : undefined;

  const uploadedAttachments = formData
    .getAll('newFiles')
    .filter((file): file is File => file instanceof File)
    .map((file) => ({
      id: `att-${Math.random().toString(36).slice(2, 11)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: `/uploads/cobrancas/${Math.random().toString(36).slice(2, 11)}_${file.name}`,
    }));

  return { body, keptAttachments, uploadedAttachments };
}

function mergeFinalAttachments(
  current: FileAttachment[],
  kept: FileAttachment[] | undefined,
  uploaded: FileAttachment[]
): FileAttachment[] {
  if (kept === undefined && uploaded.length === 0) return current;
  return [...(kept ?? []), ...uploaded];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string; cobrancaId: string }> }
) {
  await request;
  const { condId, cobrancaId } = await params;
  const cobrancasDb = getCobrancasDb(condId);
  const found = cobrancasDb.find((item) => item.id === cobrancaId);

  if (!found) {
    return NextResponse.json(
      { error: 'Cobrança não encontrada.' },
      { status: 404 }
    );
  }

  return NextResponse.json(found);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string; cobrancaId: string }> }
) {
  const { condId, cobrancaId } = await params;
  const cobrancasDb = getCobrancasDb(condId);
  const cobrancaTenantsDb = getCobrancaTenantsDb(condId);
  const index = cobrancasDb.findIndex((item) => item.id === cobrancaId);

  if (index < 0) {
    return NextResponse.json(
      { error: 'Cobrança não encontrada.' },
      { status: 404 }
    );
  }

  const current = cobrancasDb[index];
  const { body, keptAttachments, uploadedAttachments } =
    await parseCobrancaBody(request, current.attachments ?? []);

  const tenantId = body.tenantId ?? current.tenantId;
  const tenant = cobrancaTenantsDb.find((item) => item.id === tenantId);
  if (!tenant) {
    return NextResponse.json(
      { error: 'Condômino não encontrado.' },
      { status: 400 }
    );
  }

  const isActive = body.isActive ?? current.isActive;
  const dueDate = body.dueDate ?? current.dueDate;
  const paymentDate = body.paymentDate ?? current.paymentDate;
  const status = body.status ?? resolveStatus(dueDate, paymentDate, isActive);

  const finalAttachments = mergeFinalAttachments(
    current.attachments ?? [],
    keptAttachments,
    uploadedAttachments
  );

  const updated: CobrancaDetail = {
    ...current,
    ...body,
    tenantId: tenant.id,
    name: tenant.name,
    email: tenant.email,
    cpf: tenant.cpf,
    status,
    isActive,
    value: Number(body.value ?? current.value),
    penalty: Number(body.penalty ?? current.penalty),
    interest: Number(body.interest ?? current.interest),
    attachments: finalAttachments,
  };

  cobrancasDb[index] = updated;

  return NextResponse.json(updated);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string; cobrancaId: string }> }
) {
  const { condId, cobrancaId } = await params;
  const cobrancasDb = getCobrancasDb(condId);
  const index = cobrancasDb.findIndex((item) => item.id === cobrancaId);

  if (index < 0) {
    return NextResponse.json(
      { error: 'Cobrança não encontrada.' },
      { status: 404 }
    );
  }

  const body = (await request.json()) as Partial<CobrancaDetail>;
  const current = cobrancasDb[index];

  const isActive = body.isActive ?? current.isActive;
  const status = resolveStatus(
    body.dueDate ?? current.dueDate,
    body.paymentDate ?? current.paymentDate,
    isActive
  );

  const updated: CobrancaDetail = {
    ...current,
    ...body,
    status,
    isActive,
  };

  cobrancasDb[index] = updated;
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string; cobrancaId: string }> }
) {
  await request;
  const { condId, cobrancaId } = await params;
  const cobrancasDb = getCobrancasDb(condId);
  const index = cobrancasDb.findIndex((item) => item.id === cobrancaId);

  if (index < 0) {
    return NextResponse.json(
      { error: 'Cobrança não encontrada.' },
      { status: 404 }
    );
  }

  cobrancasDb.splice(index, 1);
  return NextResponse.json({ success: true });
}
