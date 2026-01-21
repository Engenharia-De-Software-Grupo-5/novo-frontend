import { NextResponse } from 'next/server';
import { users } from '@/mocks/users';

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = users.find((u) => u.id === id);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
