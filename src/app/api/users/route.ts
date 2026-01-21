import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/mocks/users';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const sort = searchParams.get('sort');
  const order = searchParams.get('order') || 'asc';

  // Simulating delay
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  const sortedUsers = [...users];

  if (sort) {
    sortedUsers.sort((a, b) => {
      const fieldA = a[sort as keyof typeof a];
      const fieldB = b[sort as keyof typeof b];

      if (fieldA < fieldB) return order === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedUsers,
    meta: {
      total: users.length,
      page,
      limit,
      totalPages: Math.ceil(users.length / limit),
    },
  });
}
