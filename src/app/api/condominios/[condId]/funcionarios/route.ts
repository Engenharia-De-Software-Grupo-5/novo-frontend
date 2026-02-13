import { NextRequest, NextResponse } from 'next/server';
import { mockEmployeeSummaries } from '@/mocks/employees';

import { EmployeeDetail } from '@/types/employee';

/**
 * @swagger
 * /api/condominios/{condId}/funcionarios:
 *   get:
 *     summary: List employees
 *     description: Returns a paginated list of employees for a specific condominium.
 *     tags:
 *       - Employees
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
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name (prefix match)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
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
 *                     $ref: '#/components/schemas/EmployeeSummary'
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

  // Filters
  const name = searchParams.get('name');
  const role = searchParams.get('role');
  const status = searchParams.get('status');

  let employees = mockEmployeeSummaries;
  // Apply filters
  if (name) {
    const nameLower = name.toLowerCase();
    employees = employees.filter((e) =>
      e.name.toLowerCase().startsWith(nameLower)
    );
  }

  if (role) {
    employees = employees.filter(
      (e) => e.role.toLowerCase() === role.toLowerCase()
    );
  }

  if (status) {
    employees = employees.filter(
      (e) => e.status.toLowerCase() === status.toLowerCase()
    );
  }

  const sortedEmployees = [...employees];

  if (sort) {
    sortedEmployees.sort((a, b) => {
      const fieldA = a[sort as keyof typeof a];
      const fieldB = b[sort as keyof typeof b];

      if (fieldA === undefined && fieldB === undefined) return 0;
      if (fieldA === undefined) return 1;
      if (fieldB === undefined) return -1;

      if (fieldA < fieldB) return order === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedEmployees = sortedEmployees.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedEmployees,
    meta: {
      total: employees.length,
      page,
      limit,
      totalPages: Math.ceil(employees.length / limit),
    },
  });
}

/**
 * @swagger
 * /api/condominios/{condId}/funcionarios:
 *   post:
 *     summary: Create a new employee
 *     tags:
 *       - Employees
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
 *             $ref: '#/components/schemas/EmployeeDetail'
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/EmployeeDetail'
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as EmployeeDetail;
  console.log('Received employee data:', body);

  return NextResponse.json(
    { message: 'Employee created successfully', data: body },
    { status: 201 }
  );
}
