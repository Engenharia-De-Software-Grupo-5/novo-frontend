import { NextRequest, NextResponse } from 'next/server';
import { getEmployeesDb, getPaymentsDb } from '@/mocks/in-memory-db';

import { FileAttachment } from '@/types/file';
import { PaymentDetail, PaymentStatus } from '@/types/payment';

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
  const employeesDb = getEmployeesDb(condId);
  const paymentsDb = getPaymentsDb(condId);

  const index = paymentsDb.findIndex((p) => p.id === paymentId);

  if (index === -1) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }

  const currentPayment = paymentsDb[index];

  let body: Partial<PaymentDetail> = {};
  let keptProofs: FileAttachment[] | undefined;
  let uploadedProofs: FileAttachment[] = [];
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const dataField = formData.get('data');
    if (dataField) {
      body = JSON.parse(dataField as string);
    }

    // Parse existing file IDs that the user chose to keep
    const existingIdsField = formData.get('existingFileIds');
    const existingFileIds: string[] | undefined = existingIdsField
      ? JSON.parse(existingIdsField as string)
      : undefined;

    // Process uploaded files into simulated FileAttachment objects
    const uploadedFiles = formData.getAll('newFiles');
    uploadedProofs = uploadedFiles
      .filter((f): f is File => f instanceof File)
      .map((file) => ({
        id: `file-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/uploads/proofs/${Math.random().toString(36).substr(2, 9)}_${file.name}`,
      }));

    // Filter existing proofs to only keep the ones the user didn't remove
    if (existingFileIds !== undefined) {
      keptProofs = (currentPayment.proofs || []).filter((c) =>
        existingFileIds.includes(c.id)
      );
    }
  } else {
    body = await request.json();
  }

  // Merge kept proofs + newly uploaded proofs
  // If keptProofs is undefined (not sent), we assume no change was intended for existing files?
  // Actually, the frontend sends existingFileIds if it wants to keep them. If it sends empty list, it means remove all.
  // If it doesn't send "existingFileIds" field at all? usually sends it.
  // In `useFileUpload`, we send `existingFileIds`.

  let finalProofs = currentPayment.proofs || [];
  if (keptProofs !== undefined || uploadedProofs.length > 0) {
    finalProofs = [...(keptProofs ?? []), ...uploadedProofs];
  }

  // Determine status (re-evaluating based on new or existing data)
  // We need to merge body into current to check dates
  const mergedForDates = { ...currentPayment, ...body };

  let status: PaymentStatus = 'agendado';
  // Use paymentDate if exists and not empty
  if (mergedForDates.paymentDate && mergedForDates.paymentDate.trim() !== '') {
    status = 'pago';
  } else {
    const dueDateStr = mergedForDates.dueDate;
    const due = new Date(dueDateStr);
    const today = new Date();
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (due < today) {
      status = 'atrasado';
    }
  }

  // Update employee info if ID changed
  let employeeName = currentPayment.name;
  let employeeRole = currentPayment.role;

  if (body.employeeId && body.employeeId !== currentPayment.employeeId) {
    const employee = employeesDb.find((e) => e.id === body.employeeId);
    if (employee) {
      employeeName = employee.name;
      employeeRole = employee.role;
    }
  }

  const updatedPayment: PaymentDetail = {
    ...currentPayment,
    ...body,
    name: employeeName,
    role: employeeRole,
    status: status,
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
