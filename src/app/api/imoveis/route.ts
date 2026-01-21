import { NextRequest, NextResponse } from 'next/server';
import { mockImoveis } from '@/mocks/imoveis';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const sort = searchParams.get('sort');
  const order = searchParams.get('order') || 'asc';

  const sortedImoveis = [...mockImoveis];

  if (sort) {
    sortedImoveis.sort((a, b) => {
      const fieldA = a[sort as keyof typeof a];
      const fieldB = b[sort as keyof typeof b];

      if (fieldA < fieldB) return order === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedImoveis = sortedImoveis.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedImoveis,
    meta: {
      total: mockImoveis.length,
      page,
      limit,
      totalPages: Math.ceil(mockImoveis.length / limit),
    },
  });
}
