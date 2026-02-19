import { NextRequest, NextResponse } from 'next/server';
import { condominiumsDb } from '@/mocks/in-memory-db';

import { Condominium } from '@/types/condominium';

/**
 * @swagger
 * /api/condominios:
 *   get:
 *     summary: List condominiums
 *     description: Returns a list of all condominiums.
 *     tags:
 *       - Condominiums
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Condominium'
 */
export async function GET() {
  return NextResponse.json(condominiumsDb);
}

/**
 * @swagger
 * /api/condominios:
 *   post:
 *     summary: Create a new condominium
 *     tags:
 *       - Condominiums
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Condominium'
 *     responses:
 *       201:
 *         description: Condominium created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Condominium'
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<Condominium>;

  const newCondominium: Condominium = {
    id: Math.random().toString(36).substr(2, 9),
    name: body.name || 'Novo Condomínio',
  };

  condominiumsDb.push(newCondominium);

  return NextResponse.json(newCondominium, { status: 201 });
}
