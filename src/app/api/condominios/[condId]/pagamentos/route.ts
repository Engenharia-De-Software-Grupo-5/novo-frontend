import { NextRequest, NextResponse } from 'next/server';
import { employeesDb, paymentsDb } from '@/mocks/in-memory-db';

import { FileAttachment } from '@/types/file';
import { PaymentDetail, PaymentStatus } from '@/types/payment';

/**
 * @swagger
 * /api/condominios/{condId}/pagamentos:
 *   get:
 *     summary: List payments
 *     description: Returns a paginated list of payments for a specific condominium.
 *     tags:
 *       - Payments
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
 *                     $ref: '#/components/schemas/PaymentSummary'
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
  // Simulate API delay for loading state testing
  // await new Promise((resolve) => setTimeout(resolve, 1000));

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

  let payments = paymentsDb;

  // Apply filters generically
  for (const [col, values] of filterMap.entries()) {
    if (col === 'name') {
      // Name uses prefix match (startsWith)
      const nameLower = values[0].toLowerCase();
      payments = payments.filter((p) =>
        p.name.toLowerCase().startsWith(nameLower)
      );
    } else {
      // Other columns use exact match (any of the values)
      payments = payments.filter((p) => {
        const fieldValue = p[col as keyof typeof p];
        if (fieldValue === undefined) return false;
        return values.some(
          (v) => String(fieldValue).toLowerCase() === v.toLowerCase()
        );
      });
    }
  }

  const sortedPayments = [...payments];

  if (sortField) {
    sortedPayments.sort((a, b) => {
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

  const totalItems = payments.length;
  const totalPages = Math.ceil(totalItems / limit);
  const safePage = Math.max(1, Math.min(page, totalPages > 0 ? totalPages : 1));

  const startIndex = (safePage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPayments = sortedPayments.slice(startIndex, endIndex);

  return NextResponse.json({
    data: paginatedPayments,
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
 * /api/condominios/{condId}/pagamentos:
 *   post:
 *     summary: Create a new payment
 *     tags:
 *       - Payments
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   employeeId:
 *                     type: string
 *                   type:
 *                     type: string
 *                   amount:
 *                     type: string
 *                   dueDate:
 *                     type: string
 *                   paymentDate:
 *                     type: string
 *                   observation:
 *                     type: string
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PaymentDetail'
 */
export async function POST(request: NextRequest) {
  let body: PaymentDetail;
  let uploadedProofs: FileAttachment[] = [];
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const dataField = formData.get('data');
    body = dataField ? JSON.parse(dataField as string) : {};

    // Process uploaded files into simulated FileAttachment objects
    const uploadedFiles = formData.getAll('files');
    uploadedProofs = uploadedFiles
      .filter((f): f is File => f instanceof File)
      .map((file) => ({
        id: `file-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/uploads/contracts/${Math.random().toString(36).substr(2, 9)}_${file.name}`,
      }));
  } else {
    body = await request.json();
  }

  // Find employee name for summary
  const employee = employeesDb.find((e) => e.id === body.employeeId);
  const employeeName = employee ? employee.name : 'Desconhecido';
  const employeeRole = employee ? employee.role : 'Outros';

  // Determine status
  let status: PaymentStatus = 'agendado';
  if (body.paymentDate) {
    status = 'pago';
  } else {
    const due = new Date(body.dueDate);
    const today = new Date();
    // Reset time for comparison
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (due < today) {
      status = 'atrasado';
    }
  }

  const newPayment: PaymentDetail = {
    ...body,
    id: Math.random().toString(36).substr(2, 9),
    name: employeeName,
    role: employeeRole,
    value: body.value,
    status,
    proofs: uploadedProofs,
  };

  paymentsDb.unshift(newPayment); // Add to beginning of list

  return NextResponse.json(
    { message: 'Payment created successfully', data: newPayment },
    { status: 201 }
  );
}
