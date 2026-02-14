import { NextRequest, NextResponse } from 'next/server';
import { paymentsDb } from '@/mocks/in-memory-db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { condId: string; paymentId: string } }
) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { paymentId } = await params;

  const index = paymentsDb.findIndex((p) => p.id === paymentId);

  if (index === -1) {
    return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
  }

  paymentsDb.splice(index, 1);

  return NextResponse.json(
    { message: 'Payment deleted successfully' },
    { status: 200 }
  );
}
