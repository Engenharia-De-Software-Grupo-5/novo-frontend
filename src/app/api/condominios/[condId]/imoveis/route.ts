import { NextRequest, NextResponse } from 'next/server';
import { mockImoveis } from '@/mocks/imoveis';

import { Imovel } from '@/types/imoveis';

/**
 * @swagger
 * /api/condominios/{condId}/imoveis:
 *   get:
 *     summary: List properties (imoveis)
 *     tags:
 *       - Imoveis
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

/**
 * @swagger
 * /api/condominios/{condId}/imoveis:
 *   post:
 *     summary: Create a new property (imovel)
 *     tags:
 *       - Imoveis
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
 *               idCondominio:
 *                 type: string
 *               idImovel:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [casa, apartamento]
 *               situacao:
 *                 type: string
 *                 enum: [ativo, inativo, manutenção, na planta]
 *               endereco:
 *                 type: object
 *                 properties:
 *                   rua:
 *                     type: string
 *                   numero:
 *                     type: string
 *                   bairro:
 *                     type: string
 *                   cidade:
 *                     type: string
 *                   estado:
 *                     type: string
 *                   nomePredio:
 *                     type: string
 *                   bloco:
 *                     type: string
 *                   torre:
 *                     type: string
 *               estrutura:
 *                 type: object
 *                 properties:
 *                   area:
 *                     type: number
 *                   numSuites:
 *                     type: number
 *                   numQuartos:
 *                     type: number
 *                   numBanheiros:
 *                     type: number
 *               outros:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as Imovel;
  console.log('Received imovel data:', body);

  return NextResponse.json(
    { message: 'Imovel created successfully', data: body },
    { status: 201 }
  );
}