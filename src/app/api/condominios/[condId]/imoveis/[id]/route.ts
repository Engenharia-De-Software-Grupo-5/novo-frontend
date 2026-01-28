import { NextRequest, NextResponse } from 'next/server';
import { mockImoveis } from '@/mocks/imoveis';



import { Imovel } from '@/types/imoveis';

/**
 * @swagger
 * /api/condominios/{condId}/imoveis/{id}:
 *   get:
 *     summary: Get a property (imovel) by ID
 *     tags:
 *       - Imoveis
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
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Property not found
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const imovel = mockImoveis.find((i) => i.idImovel === id);

  if (!imovel) {
    return NextResponse.json({ error: 'Imovel not found' }, { status: 404 });
  }

  return NextResponse.json(imovel);
}

/**
 * @swagger
 * /api/condominios/{condId}/imoveis/{id}:
 *   put:
 *     summary: Update a property
 *     tags:
 *       - Imoveis
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
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Property updated successfully
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = (await request.json()) as Partial<Imovel>;
  console.log(`Updated information for imovel ${id}:`, body);
  return NextResponse.json(body);
}

/**
 * @swagger
 * /api/condominios/{condId}/imoveis/{id}:
 *   patch:
 *     summary: Partially update a property
 *     tags:
 *       - Imoveis
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
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Property updated successfully
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = (await request.json()) as Partial<Imovel>;
  console.log(`Patched information for imovel ${id}:`, body);
  return NextResponse.json(body);
}

/**
 * @swagger
 * /api/condominios/{condId}/imoveis/{id}:
 *   delete:
 *     summary: Delete a property
 *     tags:
 *       - Imoveis
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
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property deleted successfully
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log(`imovel com id ${id} foi apagado`);
  return NextResponse.json({ message: 'Imovel deleted' });
}