import { NextRequest, NextResponse } from 'next/server';
import { employeesDb } from '@/mocks/in-memory-db';

import { EmployeeDetail, EmployeeFile } from '@/types/employee';

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
  const employee = employeesDb.find((e) => e.id === funcId);

  if (!employee) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

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

  let body: Partial<EmployeeDetail>;
  let keptContracts: EmployeeFile[] | undefined;
  let uploadedContracts: EmployeeFile[] = [];
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const dataField = formData.get('data');
    body = dataField ? JSON.parse(dataField as string) : {};

    // Parse existing contract IDs that the user chose to keep
    const existingIdsField = formData.get('existingContractIds');
    const existingContractIds: string[] | undefined = existingIdsField
      ? JSON.parse(existingIdsField as string)
      : undefined;

    // Process uploaded files into simulated EmployeeFile objects
    const contractFiles = formData.getAll('contracts');
    uploadedContracts = contractFiles
      .filter((f): f is File => f instanceof File)
      .map((file) => ({
        id: `file-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/uploads/contracts/${Math.random().toString(36).substr(2, 9)}_${file.name}`,
      }));

    // Filter the employee's existing contracts to only keep the ones the user didn't remove
    if (existingContractIds !== undefined) {
      const currentEmployee = employeesDb.find((e) => e.id === funcId);
      keptContracts = (currentEmployee?.Contracts ?? []).filter((c) =>
        existingContractIds.includes(c.id)
      );
    }

    console.log(
      `PUT: Kept ${keptContracts?.length ?? 'all'} existing contracts, received ${uploadedContracts.length} new file(s)`
    );
  } else {
    body = (await request.json()) as Partial<EmployeeDetail>;
  }

  const index = employeesDb.findIndex((e) => e.id === funcId);

  if (index === -1) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  // Merge kept contracts + newly uploaded contracts
  if (keptContracts !== undefined || uploadedContracts.length > 0) {
    const finalContracts = [
      ...(keptContracts ?? employeesDb[index].Contracts ?? []),
      ...uploadedContracts,
    ];
    body.Contracts = finalContracts;
    body.lastContract =
      finalContracts.length > 0
        ? finalContracts[finalContracts.length - 1]
        : undefined;
  }

  employeesDb[index] = { ...employeesDb[index], ...body };

  console.log(`Updated information for employee ${funcId}:`, body);
  return NextResponse.json(employeesDb[index]);
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

  const index = employeesDb.findIndex((e) => e.id === funcId);

  if (index === -1) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  employeesDb[index] = { ...employeesDb[index], ...body };

  console.log(`Patched information for employee ${funcId}:`, body);
  return NextResponse.json(employeesDb[index]);
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

  const index = employeesDb.findIndex((e) => e.id === funcId);

  if (index === -1) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  employeesDb.splice(index, 1);

  console.log(`employee com id ${funcId} foi apagado`);
  return NextResponse.json({
    message: `Employee com id ${funcId} foi apagado`,
  });
}
