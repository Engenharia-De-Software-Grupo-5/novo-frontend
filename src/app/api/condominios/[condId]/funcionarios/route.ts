import { NextRequest, NextResponse } from 'next/server';
import { employeesDb } from '@/mocks/in-memory-db';

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
  const sortParam = searchParams.get('sort');
  let sortField = sortParam;
  let sortOrder = searchParams.get('order') || 'asc';

  if (sortParam && sortParam.includes('.')) {
    const [field, order] = sortParam.split('.');
    sortField = field;
    sortOrder = order;
  }

  // Filters
  const name = searchParams.get('name');
  const role = searchParams.get('role'); // Single role string due to URLSearchParams limitation in simple extraction
  const status = searchParams.get('status');

  let employees = employeesDb;
  const roles = request.nextUrl.searchParams.getAll('role'); // Get all roles
  const statuses = request.nextUrl.searchParams.getAll('status'); // Get all statuses

  // Apply filters
  if (name) {
    const nameLower = name.toLowerCase();
    employees = employees.filter((e) =>
      e.name.toLowerCase().startsWith(nameLower)
    );
  }

  if (roles.length > 0) {
    employees = employees.filter((e) =>
      roles.some((r) => r.toLowerCase() === e.role.toLowerCase())
    );
  } else if (role) {
    // Fallback if accessed via .get()
    employees = employees.filter(
      (e) => e.role.toLowerCase() === role.toLowerCase()
    );
  }

  if (statuses.length > 0) {
    employees = employees.filter((e) =>
      statuses.some((s) => s.toLowerCase() === e.status.toLowerCase())
    );
  } else if (status) {
    // Fallback
    employees = employees.filter(
      (e) => e.status.toLowerCase() === status.toLowerCase()
    );
  }

  const sortedEmployees = [...employees];

  if (sortField) {
    sortedEmployees.sort((a, b) => {
      const fieldA = a[sortField as keyof typeof a];
      const fieldB = b[sortField as keyof typeof b];

      if (fieldA === undefined && fieldB === undefined) return 0;
      if (fieldA === undefined) return 1;
      if (fieldB === undefined) return -1;

      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const totalItems = employees.length;
  const totalPages = Math.ceil(totalItems / limit);
  const safePage = Math.max(1, Math.min(page, totalPages > 0 ? totalPages : 1));

  const startIndex = (safePage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedEmployees = sortedEmployees.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedEmployees,
    meta: {
      total: totalItems,
      page: safePage,
      limit,
      totalPages,
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

  const newEmployee: EmployeeDetail = {
    ...body,
    id: Math.random().toString(36).substr(2, 9),
    status: 'ativo',
    role: body.role || 'porteiro',
  };

  employeesDb.push(newEmployee);

  return NextResponse.json(
    { message: 'Employee created successfully', data: newEmployee },
    { status: 201 }
  );
}
