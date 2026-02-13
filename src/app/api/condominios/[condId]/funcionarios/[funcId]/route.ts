import { NextRequest, NextResponse } from 'next/server';
import { mockEmployeeDetails } from '@/mocks/employees';

import { EmployeeDetail } from '@/types/employee';

/**
 * @swagger
 * /api/condominios/{condId}/funcionarios/{funcId}:
 *   get:
 *     summary: Get an employee by ID
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: condId
 *         required: true
 *         schema:
 *           type: string
 *         description: Condominium ID
 *       - in: path
 *         name: funcId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeDetail'
 *       404:
 *         description: Employee not found
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ funcId: string }> }
) {
  const { funcId } = await params;
  const employee = mockEmployeeDetails.find((e) => e.id === funcId);

  if (!employee) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  console.log(employee);
  return NextResponse.json(employee);
}

/**
 * @swagger
 * /api/condominios/{condId}/funcionarios/{funcId}:
 *   put:
 *     summary: Update an employee
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: condId
 *         required: true
 *         schema:
 *           type: string
 *         description: Condominium ID
 *       - in: path
 *         name: funcId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeDetail'
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeDetail'
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ funcId: string }> }
) {
  const { funcId } = await params;
  const body = (await request.json()) as Partial<EmployeeDetail>;
  console.log(`Updated information for employee ${funcId}:`, body);
  return NextResponse.json(body);
}

/**
 * @swagger
 * /api/condominios/{condId}/funcionarios/{funcId}:
 *   patch:
 *     summary: Partially update an employee
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: condId
 *         required: true
 *         schema:
 *           type: string
 *         description: Condominium ID
 *       - in: path
 *         name: funcId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeDetail'
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EmployeeDetail'
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ funcId: string }> }
) {
  const { funcId } = await params;
  const body = (await request.json()) as Partial<EmployeeDetail>;
  console.log(`Patched information for employee ${funcId}:`, body);
  return NextResponse.json(body);
}

/**
 * @swagger
 * /api/condominios/{condId}/funcionarios/{funcId}:
 *   delete:
 *     summary: Delete an employee
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: condId
 *         required: true
 *         schema:
 *           type: string
 *         description: Condominium ID
 *       - in: path
 *         name: funcId
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ funcId: string }> }
) {
  const { funcId } = await params;
  console.log(`employee com id ${funcId} foi apagado`);
  return NextResponse.json({
    message: `Employee com id ${funcId} foi apagado`,
  });
}
