import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/mocks/users';

import { User } from '@/types/user';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
/**
 * @swagger
 * /api/condominios/{condId}/users:
 *   get:
 *     summary: List users
 *     description: Returns a paginated list of users for a specific condominium.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: condId
 *         required: true
 *         schema:
 *           type: string
 *         description: Condominium ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string }> }
) {
  const { condId } = await params;

  if (!condId) {
    return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
  }

  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const sortParam = searchParams.get('sort');
  const [sortField, sortOrder] = sortParam?.split('.') ?? [];

  const roleFilters = searchParams.getAll('roles').map(r => r.toLowerCase());
  const statusFilters = searchParams.getAll('status').map(s => s.toLowerCase());

  let filteredUsers = users;

  if (roleFilters.length > 0) {
    filteredUsers = filteredUsers.filter(u =>
      roleFilters.includes(u.role.toLowerCase())
    );
  }

  if (statusFilters.length > 0) {
    filteredUsers = filteredUsers.filter(u =>
      statusFilters.includes(u.status.toLowerCase())
    );
  }

  const sortedUsers = [...filteredUsers];

  if (sortField) {
    sortedUsers.sort((a, b) => {
      const fieldA = a[sortField as keyof typeof a];
      const fieldB = b[sortField as keyof typeof b];
      if (fieldA < fieldB) return sortOrder === 'desc' ? 1 : -1;
      if (fieldA > fieldB) return sortOrder === 'desc' ? -1 : 1;
      return 0;
    });
  }

  const startIndex = (page - 1) * limit;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    data: paginatedUsers,
    meta: {
      total: filteredUsers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredUsers.length / limit),
    },
  });
}

/**
 * @swagger
 * /api/condominios/{condId}/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: condId
 *         required: true
 *         schema:
 *           type: string
 *         description: Condominium ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ativo, inativo, pendente]

 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as User;
  console.log('Received user data:', body);

  return NextResponse.json(
    { message: 'User created successfully', data: body },
    { status: 201 }
  );
}
