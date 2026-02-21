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

  const page = Number.parseInt(searchParams.get('page') || '1');
  const limit = Number.parseInt(searchParams.get('limit') || '20');

  const sortParam = searchParams.get('sort');
  let sortField = sortParam;
  let sortOrder = searchParams.get('order') || 'asc';

  if (sortParam && sortParam.includes('.')) {
    const [field, order] = sortParam.split('.');
    sortField = field;
    sortOrder = order;
  }

  // columns[] + content[] (contrato da DataTable)
  const columnsArr = searchParams.getAll('columns');
  const contentArr = searchParams.getAll('content');

  const filterMap = new Map<string, string[]>();

  console.log('=== DEBUG ===');
  console.log('columnsArr:', columnsArr);
  console.log('contentArr:', contentArr);
  console.log('filterMap:', Object.fromEntries(filterMap));
  console.log('users total:', users.length);
  console.log('primeiro user:', users[0]);

  for (let i = 0; i < columnsArr.length; i++) {
    const col = columnsArr[i];
    const val = contentArr[i];

    if (col && val !== undefined) {
      if (!filterMap.has(col)) {
        filterMap.set(col, []);
      }
      filterMap.get(col)!.push(val);
    }
  }

  let filteredUsers = [...users];

  console.log('filteredUsers:', filteredUsers.length);

  // Aplicar filtros dinamicamente
  for (const [col, values] of filterMap.entries()) {
    if (col === 'name') {
      const searchLower = values[0].toLowerCase();
      filteredUsers = filteredUsers.filter((u) =>
        u.name.toLowerCase().includes(searchLower)
      );
    } else {
      filteredUsers = filteredUsers.filter((u) => {
        const fieldValue = u[col as keyof typeof u];
        if (fieldValue === undefined) return false;

        return values.some(
          (v) => String(fieldValue).toLowerCase() === v.toLowerCase()
        );
      });
    }
  }

  const sortedUsers = [...filteredUsers];

  if (sortField) {
    sortedUsers.sort((a, b) => {
      const fieldA = a[sortField as keyof typeof a];
      const fieldB = b[sortField as keyof typeof b];

      if (fieldA === undefined && fieldB === undefined) return 0;
      if (fieldA === undefined) return 1;
      if (fieldB === undefined) return -1;

      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / limit);
  const safePage = Math.max(1, Math.min(page, totalPages || 1));

  const startIndex = (safePage - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedUsers,
    meta: {
      total: totalItems,
      page: safePage,
      limit,
      totalPages,
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

  console.log('\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('CONVITE SERÁ ENVIADO PELO BACKEND');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Payload recebido:');
  console.log(body);

  return NextResponse.json(
    { message: 'User created successfully', data: body },
    { status: 201 }
  );
}
