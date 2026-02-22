import { NextRequest, NextResponse } from 'next/server';
import { condominos } from '@/mocks/condominos';

import { CondominoFull, CondominoSummary } from '@/types/condomino';
import { FileAttachment } from '@/types/file';

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
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ condId: string }> }
) {
  const { condId } = await params;

  if (!condId) {
    return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
  }

  const searchParams = request.nextUrl.searchParams;

  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);

  const sortParam = searchParams.get('sort');
  let sortField = sortParam;
  let sortOrder = searchParams.get('order') || 'asc';

  if (sortParam && sortParam.includes('.')) {
    const [field, order] = sortParam.split('.');
    sortField = field;
    sortOrder = order;
  }

  const columnsArr = searchParams.getAll('columns');
  const contentArr = searchParams.getAll('content');

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

  // primeiro filtra pelo condomínio
  let filtered = condominos.filter((c) => c.condominiumId === condId);

  // aplica filtros dinamicamente
  for (const [col, values] of filterMap.entries()) {
    if (col === 'name') {
      const searchLower = values[0].toLowerCase();
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchLower)
      );
    } else if (col === 'cpf') {
      const searchLower = values[0].toLowerCase();
      filtered = filtered.filter((c) =>
        c.cpf.toLowerCase().includes(searchLower)
      );
    } else {
      filtered = filtered.filter((c) => {
        const fieldValue = c[col as keyof typeof c];
        if (fieldValue === undefined) return false;

        return values.some(
          (v) => String(fieldValue).toLowerCase() === v.toLowerCase()
        );
      });
    }
  }

  // 🔹 ordenação
  const sorted = [...filtered];

  if (sortField) {
    sorted.sort((a, b) => {
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

  // map para summary
  const mapped: CondominoSummary[] = sorted.map((m) => ({
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

/**
 * @swagger
 * /api/condominios/{condId}/condominos:
 *   post:
 *     summary: Criar condômino
 *     description: Cria um novo condômino para um condomínio específico. Suporta upload de documentos.
 *     tags:
 *       - Condominos
 *     parameters:
 *       - in: path
 *         name: condId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do condomínio
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string contendo os dados do condômino
 *                 example: >
 *                   {
 *                     "name": "Beatriz Meneses",
 *                     "birthDate": "1998-02-10",
 *                     "maritalStatus": "solteiro",
 *                     "cpf": "12345678900",
 *                     "rg": "1234567",
 *                     "issuingAuthority": "SSP-PB",
 *                     "monthlyIncome": 5000,
 *                     "email": "beatriz@email.com",
 *                     "primaryPhone": "83999999999",
 *                     "address": "Rua A, 123",
 *                     "emergencyContact": {
 *                       "name": "Maria",
 *                       "phone": "83988888888"
 *                     },
 *                     "professionalInfo": {
 *                       "companyName": "Empresa X",
 *                       "position": "Analista",
 *                       "yearsWorking": 3
 *                     },
 *                     "bankingInfo": {
 *                       "bank": "Nubank",
 *                       "accountType": "corrente",
 *                       "accountNumber": "0000",
 *                       "agency": "0001"
 *                     }
 *                   }
 *               rgFile:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo do RG
 *               cpfFile:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo do CPF
 *               incomeFile:
 *                 type: string
 *                 format: binary
 *                 description: Comprovante de renda
 *     responses:
 *       201:
 *         description: Condômino criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Condominio created successfully
 *                 data:
 *                   $ref: '#/components/schemas/CondominoFull'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
export async function POST(request: NextRequest) {
  let body: Partial<CondominoFull>;

  const contentType = request.headers.get('content-type') || '';
  let uploadedFiles: FileAttachment[] = [];

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();

    const dataField = formData.get('data');
    body = dataField ? JSON.parse(dataField as string) : {};

    const files = formData.getAll('files');

    uploadedFiles = files
      .filter((f): f is File => f instanceof File)
      .map((file) => ({
        id: `file-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/uploads/${Date.now()}_${file.name}`,
      }));

    console.log(`Received ${uploadedFiles.length} file(s)`, uploadedFiles);
  } else {
    body = await request.json();
  }

  // Associando arquivos corretamente
  const documents = {
    rg: uploadedFiles[0],
    cpf: uploadedFiles[1],
    incomeProof: uploadedFiles[2],
  };

  const newCondomino: CondominoFull = {
    ...body,
    id: Math.random().toString(36).substr(2, 9),
    status: 'pendente',
    documents,
  } as CondominoFull;

  condominos.push(newCondomino);

  console.log('CONDOMINOS NOVO', condominos);

  return NextResponse.json(
    { message: 'Condomino created successfully', data: newCondomino },
    { status: 201 }
  );
}
