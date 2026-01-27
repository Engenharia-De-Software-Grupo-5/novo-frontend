import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/mocks/users';
import { DONO_FAKE } from '@/mocks/auth';


export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const sort = searchParams.get('sort');
  const order = searchParams.get('order') || 'asc';

  const loggedUser = DONO_FAKE;  
  const condominiumId = loggedUser.memberships[0].condominiumId;

  const condominiumUsers = users.filter(user =>
    user.memberships.some(membership => membership.condominiumId === condominiumId)
  );

  const sortedUsers = [...condominiumUsers];

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
      total: condominiumUsers.length,
      page,
      limit,
      totalPages: Math.ceil(condominiumUsers.length / limit),
    },
  });
}


export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log('Received user data:', body);

  return NextResponse.json(
    { message: 'User created successfully', data: body },
    { status: 201 }
  );
}
