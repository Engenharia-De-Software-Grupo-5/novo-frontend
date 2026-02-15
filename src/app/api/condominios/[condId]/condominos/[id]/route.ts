import { NextRequest, NextResponse } from "next/server";
import { condominos } from "@/mocks/condominos";


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
  { params }: { params:  Promise<{ condId: string; id: string }> }
) {
  
  const { condId, id } = await params;

  // Verifica se os parâmetros estão chegando

  const morador = condominos.find(
    (c) => c.id === id && c.condominiumId === condId
  );

  if (!morador) {
    return NextResponse.json({ error: "Condômino not found" }, { status: 404 });
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
  const { id } = await params;
  const body = (await request.json()) as { status: CondominiumStatus };
  const index = condominos.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Condômino not found" }, { status: 404 });
  }

  condominos[index].status = body.status;

  return NextResponse.json({ message: "Status updated", data: condominos[index] });
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
  const { id } = await params;

  // Busca o índice no banco de dados de condôminos
  const index = condominos.findIndex((c) => c.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Condômino não encontrado" }, 
      { status: 404 }
    );
  }

  // Remove o item do array
  condominos.splice(index, 1);

  console.log(`Condômino com id ${id} foi apagado`);
  
  return NextResponse.json({ 
    message: `Condômino com id ${id} foi apagado` 
  });
}