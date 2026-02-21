import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/mocks/users';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * @swagger
 * /api/condominios/{condId}/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: condId
 *         required: true
 *         schema:
 *           type: string
 *         description: Condominium ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       404:
 *         description: User not found
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = users.find((u) => u.id === id);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

/**
 * @swagger
 * /api/condominios/{condId}/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: condId
 *         required: true
 *         schema:
 *           type: string
 *         description: Condominium ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: Record<string, unknown>;

  const contentType = request.headers.get('content-type') || '';

  // Seguindo o exemplo de funcionários para tratar multipart (FormData) ou JSON
  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const dataField = formData.get('data');
    body = dataField ? JSON.parse(dataField as string) : {};
  } else {
    body = await request.json();
  }

  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Atualização robusta conforme sua interface User
  users[index] = {
    ...users[index],
    ...body,

    id: users[index].id,
  };

  console.log(`PUT: Usuário ${id} editado com sucesso:`, body);
  return NextResponse.json(users[index]);
}
/**
 * @swagger
 * /api/condominios/{condId}/users/{id}:
 *   patch:
 *     summary: Partially update a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: condId
 *         required: true
 *         schema:
 *           type: string
 *         description: Condominium ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const user = users.find((u) => u.id === id);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const dataToUpdate = typeof body === 'string' ? JSON.parse(body) : body;

  Object.assign(user, dataToUpdate);

  console.log('Dados atualizados corretamente no Mock:', user);

  return NextResponse.json(user);
}

/**
 * @swagger
 * /api/condominios/{condId}/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: condId
 *         required: true
 *         schema:
 *           type: string
 *         description: Condominium ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Busca o índice no banco de dados de usuários
  // Substitua 'usersDb' pelo nome real do seu array de usuários
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: 'Usuário não encontrado' },
      { status: 404 }
    );
  }

  // Remove o usuário de verdade
  users.splice(index, 1);

  console.log(`Usuário com id ${id} foi apagado`);

  return NextResponse.json({
    message: `Usuário com id ${id} foi apagado`,
  });
}
