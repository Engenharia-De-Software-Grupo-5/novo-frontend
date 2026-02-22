import { NextRequest, NextResponse } from 'next/server';
import { getEmployeesDb } from '@/mocks/in-memory-db';

import { EmployeeDetail } from '@/types/employee';
import { FileAttachment } from '@/types/file';
import { secureRandom } from '@/lib/secure-random';

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
 *         name: columns
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Column names to filter by (parallel array with content)
 *       - in: query
 *         name: content
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter values (parallel array with columns)
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
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string }> }
) {
  const { condId } = await params;
  // Simulate API delay for loading state testing
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  const searchParams = request.nextUrl.searchParams;

  const page = Number.parseInt(searchParams.get('page') || '1');
  const limit = Number.parseInt(searchParams.get('limit') || '20');
  const sortParam = searchParams.get('sort');
  let sortField = sortParam;
  let sortOrder = searchParams.get('order') || 'asc';

  if (sortParam && sortParam.includes('.')) {
    const [field, order] = sortParam.split('.');
    sortField = field;
    sortOrder = order;
  }

  // Filters via columns[] and content[] parallel arrays
  const columnsArr = request.nextUrl.searchParams.getAll('columns');
  const contentArr = request.nextUrl.searchParams.getAll('content');

  // Build a filter map: column -> values[]
  const filterMap = new Map<string, string[]>();
  for (let i = 0; i < columnsArr.length; i++) {
    const col = columnsArr[i];
    const val = contentArr[i];
    if (col && val !== undefined) {
      if (!filterMap.has(col)) {
        filterMap.set(col, []);
      }
      filterMap.get(col)!.push(val);
    }
  }

  let employees = getEmployeesDb(condId);

  // Apply filters generically
  for (const [col, values] of filterMap.entries()) {
    if (col === 'name') {
      // Name uses prefix match (startsWith)
      const nameLower = values[0].toLowerCase();
      employees = employees.filter((e) =>
        e.name.toLowerCase().startsWith(nameLower)
      );
    } else {
      // Other columns use exact match (any of the values)
      employees = employees.filter((e) => {
        const fieldValue = e[col as keyof typeof e];
        if (fieldValue === undefined) return false;
        return values.some(
          (v) => String(fieldValue).toLowerCase() === v.toLowerCase()
        );
      });
    }
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
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string }> }
) {
  const { condId } = await params;
  const employeesDb = getEmployeesDb(condId);
  let body: EmployeeDetail;
  let uploadedContracts: FileAttachment[] = [];
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const dataField = formData.get('data');
    body = dataField ? JSON.parse(dataField as string) : {};

    // Process uploaded files into simulated FileAttachment objects
    const uploadedFiles = formData.getAll('files');
    uploadedContracts = uploadedFiles
      .filter((f): f is File => f instanceof File)
      .map((file) => ({
        id: `file-${secureRandom(9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/uploads/contracts/${secureRandom(9)}_${file.name}`,
      }));

    console.log(
      `POST: Received ${uploadedFiles.length} file(s):`,
      uploadedContracts.map((f) => ({ id: f.id, name: f.name, size: f.size }))
    );
  } else {
    body = (await request.json()) as EmployeeDetail;
  }

  console.log('Received employee data:', body);

  const allContracts = [...uploadedContracts];

  const newEmployee: EmployeeDetail = {
    ...body,
    id: secureRandom(9),
    status: allContracts.length > 0 ? 'ativo' : 'pendente',
    role: body.role || 'porteiro',
    Contracts: allContracts,
    lastContract:
      allContracts.length > 0
        ? allContracts[allContracts.length - 1]
        : undefined,
  };

  employeesDb.push(newEmployee);

  return NextResponse.json(
    { message: 'Employee created successfully', data: newEmployee },
    { status: 201 }
  );
}
