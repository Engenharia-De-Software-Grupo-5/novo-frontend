import { NextResponse } from 'next/server';





/**
 * @swagger
 * /api:
 *   get:
 *     summary: Health check
 *     description: Returns the status of the API
 *     tags:
 *       - General
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export async function GET() {
  return NextResponse.json({ message: 'API is running' });
}