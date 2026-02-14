import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/mocks/users';

import { User } from '@/types/user';

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
  { params }: { params: Promise<{ condId: string }> } // Adicione isso aqui!
) {
  const { condId } = await params;

  if (!condId) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

  // filtra pelos usuários do condomínio
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const sort = searchParams.get('sort');
  const order = searchParams.get('order') || 'asc';

  // Agora o condId vem direto do parametro da rota, sem erro de split
  const condominiumUsers = users.filter((u) => u.condominioId === condId);

  // ordena se necessário
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

  // paginação
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
 *               inviteDate:
 *                 type: string
 *               inviteDuration:
 *                 type: string
 *                 enum: [1 day, 3 days, 7 days]
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