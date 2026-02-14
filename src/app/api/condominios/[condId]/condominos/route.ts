import { NextRequest, NextResponse } from "next/server";
import { condominos } from "@/mocks/condominos";
import { CondominoListItem } from "@/features/condominos/services/condominos";


/**
 * @swagger
 * /api/condominios/{condId}/condominos:
 *   get:
 *     summary: Listar condôminos
 *     description: Retorna uma lista paginada de condôminos de um condomínio específico.
 *     tags:
 *       - Condominos
 *     parameters:
 *       - in: path
 *         name: condId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do condomínio
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de condôminos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CondominoListItem'
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
  const condId = request.nextUrl.pathname.split("/")[3];

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const filtered = condominos.filter((c) => c.condominiumId === condId);

  const mapped: CondominoListItem[] = filtered.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    cpf: m.cpf,
    status: m.status,
  }));

  const start = (page - 1) * limit;
  const paginated = mapped.slice(start, start + limit);

  return NextResponse.json({
    data: paginated,
    meta: {
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    },
  });
}