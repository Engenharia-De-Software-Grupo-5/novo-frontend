import { NextRequest, NextResponse } from 'next/server';
import { getEmployeesDb, getPaymentsDb } from '@/mocks/in-memory-db';

import { FileAttachment } from '@/types/file';
import { PaymentDetail, PaymentStatus } from '@/types/payment';
import { secureRandom } from '@/lib/secure-random';

function resolvePaymentStatus(
  paymentDate: string | undefined,
  dueDate: string
): PaymentStatus {
  if (paymentDate?.trim()) return 'pago';

  const due = new Date(dueDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return due < today ? 'atrasado' : 'agendado';
}

interface ParsedPaymentBody {
  body: Partial<PaymentDetail>;
  keptProofs: FileAttachment[] | undefined;
  uploadedProofs: FileAttachment[];
}

async function parsePaymentBody(
  request: NextRequest,
  currentProofs: FileAttachment[]
): Promise<ParsedPaymentBody> {
  const contentType = request.headers.get('content-type') ?? '';

  if (!contentType.includes('multipart/form-data')) {
    const body = (await request.json()) as Partial<PaymentDetail>;
    return { body, keptProofs: undefined, uploadedProofs: [] };
  }

  const formData = await request.formData();
  const dataField = formData.get('data');
  const body: Partial<PaymentDetail> = dataField
    ? JSON.parse(dataField as string)
    : {};

  const existingIdsField = formData.get('existingFileIds');
  const existingFileIds: string[] | undefined = existingIdsField
    ? JSON.parse(existingIdsField as string)
    : undefined;

  const keptProofs =
    existingFileIds === undefined
      ? undefined
      : currentProofs.filter((c) => existingFileIds.includes(c.id));

  const uploadedProofs = formData
    .getAll('newFiles')
    .filter((f): f is File => f instanceof File)
    .map((file) => ({
      id: `file-${secureRandom(9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: `/uploads/proofs/${secureRandom(9)}_${file.name}`,
    }));

  return { body, keptProofs, uploadedProofs };
}

function mergeFinalProofs(
  current: FileAttachment[],
  kept: FileAttachment[] | undefined,
  uploaded: FileAttachment[]
): FileAttachment[] {
  if (kept === undefined && uploaded.length === 0) return current;
  return [...(kept ?? []), ...uploaded];
}

function resolveEmployeeInfo(
  body: Partial<PaymentDetail>,
  currentPayment: PaymentDetail,
  condId: string
): { employeeName: string; employeeRole: string } {
  let employeeName = currentPayment.name;
  let employeeRole = currentPayment.role;
  const employeesDb = getEmployeesDb(condId);
  if (body.employeeId && body.employeeId !== currentPayment.employeeId) {
    const employee = employeesDb.find((e) => e.id === body.employeeId);
    if (employee) {
      employeeName = employee.name;
      employeeRole = employee.role;
    }
  }

  return { employeeName, employeeRole };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string; paymentId: string }> }
) {
  const { condId, paymentId } = await params;
  const paymentsDb = getPaymentsDb(condId);

  const payment = paymentsDb.find((p) => p.id === paymentId);

  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }

  return NextResponse.json(payment);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string; paymentId: string }> }
) {
  const { condId, paymentId } = await params;
  const paymentsDb = getPaymentsDb(condId);

  const index = paymentsDb.findIndex((p) => p.id === paymentId);

  if (index === -1) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }

  const currentPayment = paymentsDb[index];
  const { body, keptProofs, uploadedProofs } = await parsePaymentBody(
    request,
    currentPayment.proofs ?? []
  );

  const finalProofs = mergeFinalProofs(
    currentPayment.proofs ?? [],
    keptProofs,
    uploadedProofs
  );

  const merged = { ...currentPayment, ...body };
  const status = resolvePaymentStatus(merged.paymentDate, merged.dueDate);

  const { employeeName, employeeRole } = resolveEmployeeInfo(
    body,
    currentPayment,
    condId
  );

  const updatedPayment: PaymentDetail = {
    ...currentPayment,
    ...body,
    name: employeeName,
    role: employeeRole,
    status,
    proofs: finalProofs,
  };

  paymentsDb[index] = updatedPayment;

  return NextResponse.json(updatedPayment);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string; paymentId: string }> }
) {
  const { condId, paymentId } = await params;
  const paymentsDb = getPaymentsDb(condId);

  const paymentIndex = paymentsDb.findIndex((p) => p.id === paymentId);

  if (paymentIndex === -1) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }

  paymentsDb.splice(paymentIndex, 1);

  return NextResponse.json({ success: true });
}
