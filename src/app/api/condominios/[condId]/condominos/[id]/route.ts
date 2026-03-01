import { NextRequest, NextResponse } from 'next/server';
import { getCondominosDb } from '@/mocks/in-memory-db';

/**
 * @swagger
 * /api/condominios/{condId}/condominos/{id}:
 *   get:
 *     summary: Get a condômino by ID
 *     tags:
 *       - Condominos
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
 *         description: Condômino ID
 *     responses:
 *       200:
 *         description: Condômino details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Condômino not found
 */
/**
 * GET - Retorna um condômino específico
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ condId: string; id: string }> }
) {
  const { condId, id } = await params;
  const condominosDb = getCondominosDb(condId);

  const morador = condominosDb.find((c) => c.id === id);

  if (!morador) {
    return NextResponse.json({ error: 'Condômino not found' }, { status: 404 });
  }

  return NextResponse.json(morador);
}


/**
 * @swagger
 * /api/condominios/{condId}/condominos/{id}:
 *   patch:
 *     summary: Update condômino status
 *     tags:
 *       - Condominos
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
 *         description: Condômino ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ativo, inativo, pendente]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Condômino not found
 */

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string; id: string }> }
) {
  const { condId, id } = await params;
  const condominosDb = getCondominosDb(condId);
  const body = (await request.json()) as Partial<(typeof condominosDb)[0]>;

  const index = condominosDb.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Condômino not found' }, { status: 404 });
  }

  condominosDb[index] = { ...condominosDb[index], ...body };

  console.log(`Patched condômino ${id}:`, body);
  return NextResponse.json(condominosDb[index]);
}
/**
 * @swagger
 * /api/condominios/{condId}/condominos/{id}:
 *   delete:
 *     summary: Delete a condômino
 *     tags:
 *       - Condominos
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
 *         description: Condômino ID
 *     responses:
 *       200:
 *         description: Condômino deleted successfully
 *       404:
 *         description: Condômino not found
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ condId: string; id: string }> }
) {
  const { condId, id } = await params;
  const condominosDb = getCondominosDb(condId);

  const index = condominosDb.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: 'Condômino não encontrado' },
      { status: 404 }
    );
  }

  condominosDb.splice(index, 1);

  console.log(`Condômino com id ${id} foi apagado`);
  return NextResponse.json({ message: `Condômino com id ${id} foi apagado` });
}