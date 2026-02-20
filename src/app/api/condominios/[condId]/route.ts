import { NextRequest, NextResponse } from 'next/server';
import { condominiumsDb } from '@/mocks/in-memory-db';

import { Condominium } from '@/types/condominium';

/**
 * @swagger
 * /api/condominios/{condId}:
 *   get:
 *     summary: Get a condominium by ID
 *     tags:
 *       - Condominiums
 *     parameters:
 *       - in: path
 *         name: condId
 *         required: true
 *         schema:
 *           type: string
 *         description: Condominium ID
 *     responses:
 *       200:
 *         description: Condominium details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Condominium'
 *       404:
 *         description: Condominium not found
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ condId: string }> }
) {
  const { condId } = await params;
  const condominium = condominiumsDb.find((c) => c.id === condId);

  if (!condominium) {
    return NextResponse.json(
      { error: 'Condominium not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(condominium);
}

/**
 * @swagger
 * /api/condominios/{condId}:
 *   put:
 *     summary: Update a condominium
 *     tags:
 *       - Condominiums
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
 *             $ref: '#/components/schemas/Condominium'
 *     responses:
 *       200:
 *         description: Condominium updated successfully
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string }> }
) {
  const { condId } = await params;
  const body = (await request.json()) as Condominium;

  const index = condominiumsDb.findIndex((c) => c.id === condId);

  if (index === -1) {
    return NextResponse.json(
      { error: 'Condominium not found' },
      { status: 404 }
    );
  }

  condominiumsDb[index] = { ...condominiumsDb[index], ...body };

  return NextResponse.json(condominiumsDb[index]);
}

/**
 * @swagger
 * /api/condominios/{condId}:
 *   patch:
 *     summary: Partially update a condominium
 *     tags:
 *       - Condominiums
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
 *             $ref: '#/components/schemas/Condominium'
 *     responses:
 *       200:
 *         description: Condominium updated successfully
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string }> }
) {
  const { condId } = await params;
  const body = (await request.json()) as Partial<Condominium>;

  const index = condominiumsDb.findIndex((c) => c.id === condId);

  if (index === -1) {
    return NextResponse.json(
      { error: 'Condominium not found' },
      { status: 404 }
    );
  }

  condominiumsDb[index] = { ...condominiumsDb[index], ...body };

  return NextResponse.json(condominiumsDb[index]);
}

/**
 * @swagger
 * /api/condominios/{condId}:
 *   delete:
 *     summary: Delete a condominium
 *     tags:
 *       - Condominiums
 *     parameters:
 *       - in: path
 *         name: condId
 *         required: true
 *         schema:
 *           type: string
 *         description: Condominium ID
 *     responses:
 *       200:
 *         description: Condominium deleted successfully
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ condId: string }> }
) {
  const { condId } = await params;

  const index = condominiumsDb.findIndex((c) => c.id === condId);

  if (index === -1) {
    return NextResponse.json(
      { error: 'Condominium not found' },
      { status: 404 }
    );
  }

  condominiumsDb.splice(index, 1);

  return NextResponse.json({
    message: `Condominium ${condId} deleted successfully`,
  });
}
