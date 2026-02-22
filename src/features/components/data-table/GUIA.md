# GUIA: Como criar uma nova DataTable

## Contexto

DataTable genérico reutilizável em `src/features/components/data-table/`.
Inclui: paginação, busca, filtros facetados, ordenação, visibilidade de colunas,
skeleton de carregamento, e sync bidirecional com a URL.

Implementação de referência: **Funcionários**. Use-a como modelo.

---

## Referência (Funcionários)

Leia estes arquivos ANTES de começar. Cada um é modelo direto para o equivalente da sua feature.

| O que                                | Caminho                                                            |
| ------------------------------------ | ------------------------------------------------------------------ |
| Tipos                                | `src/types/employee.ts`                                            |
| Constantes (roles, statuses, labels) | `src/features/funcionarios/constants.ts`                           |
| Schema Zod                           | `src/features/funcionarios/schemas/employeeSchema.ts`              |
| Hook de upload                       | `src/hooks/useFileUpload.ts` (genérico, reutilizável)              |
| Service API                          | `src/features/funcionarios/services/funcionarioService.ts`         |
| Mock de dados                        | `src/mocks/employees.ts`                                           |
| In-memory DB                         | `src/mocks/in-memory-db.ts`                                        |
| Rota API (lista + POST)              | `src/app/api/condominios/[condId]/funcionarios/route.ts`           |
| Rota API (por id)                    | `src/app/api/condominios/[condId]/funcionarios/[funcId]/route.ts`  |
| Colunas da tabela                    | `src/features/funcionarios/components/columns.tsx`                 |
| Wrapper client                       | `src/features/funcionarios/components/funcionarios-data-table.tsx` |
| Ações de linha                       | `src/features/funcionarios/components/data-table-row-actions.tsx`  |
| StatusBadge                          | `src/features/funcionarios/components/status-badge.tsx`            |
| Dialog criar/editar                  | `src/features/funcionarios/components/add-employee-dialog.tsx`     |
| Dialog visualizar                    | `src/features/funcionarios/components/view-employee-dialog.tsx`    |
| Page (Server Component)              | `src/app/condominios/[condId]/(admin)/funcionarios/page.tsx`       |
| Loading (Skeleton)                   | `src/app/condominios/[condId]/(admin)/funcionarios/loading.tsx`    |

---

## Passo a Passo

### 1. Tipo da entidade

Crie `src/types/Contratos.ts` com `ContratosSummary` (tabela), `ContratosDetail` (formulários) e `ContratosResponse` (resposta paginada com `data` + `meta`).

### 2. Constantes

Crie `src/features/Contratos/constants.ts` com opções de filtro (com `label`, `value`, `icon`), e `COLUMN_LABELS: Record<string, string>`.

### 3. Service API

Crie `src/features/Contratos/services/ContratosService.ts` com get, getById, post, put, patch, delete. Use `apiRequest` e `buildQueryString` de `@/lib/api-client`.

**Regra de filtros**: filtros usam arrays paralelos `columns[]` e `content[]`:

```typescript
params?: { page?: number; limit?: number; columns?: string[]; content?: string[]; sort?: string; }
```

**Upload de arquivos (só se a feature tiver upload)**: post e put aceitam `FileUploadOptions` de `@/lib/form-data`:

```typescript
import { buildFormDataBody, FileUploadOptions } from '@/lib/form-data';

// FileUploadOptions = { newFiles?: File[]; existingFileIds?: string[] }
```

Use `buildFormDataBody(data, options, 'nomeDoField')` no body do request. Ela decide o formato:

- **Sem arquivos** → retorna o objeto JSON puro
- **Com arquivos** → retorna `FormData` com campos `data`, `existingFileIds`, e o field de arquivos

`apiRequest` detecta `FormData` automaticamente.

### 4. Dados mock

Crie `src/mocks/Contratos.ts` e adicione ao `src/mocks/in-memory-db.ts`.

### 5. Rotas API

- `src/app/api/.../Contratos/route.ts` — GET lista paginada + POST
- `src/app/api/.../Contratos/[id]/route.ts` — GET, PUT, PATCH, DELETE

GET aceita: `page`, `limit`, `sort`, `columns[]`, `content[]`.
Filtros processados assim: `getAll('columns')` e `getAll('content')` → monta Map → filtra.
Coluna `name` usa `startsWith`; demais usam match exato.

**POST e PUT com arquivos (só se a feature tiver upload)**: checar `content-type` do request:

- Se `multipart/form-data` → `request.formData()`, ler campo `data` (JSON), campo de arquivos (nome do field)
- Senão → `request.json()` normal

No mock, usar `FileAttachment` de `@/types/file` para gerar objetos simulados:

```typescript
import { FileAttachment } from '@/types/file';
const uploaded: FileAttachment[] = formData.getAll('files')
  .filter((f): f is File => f instanceof File)
  .map((file) => ({
    id: `file-${Math.random().toString(36).slice(2,11)}`,
    name: file.name, type: file.type, size: file.size,
    url: `/uploads/${secureRandom(9)_${file.name}`,
  }));
```

**PUT com arquivos existentes**: ler campo `existingFileIds` (JSON array de IDs). Filtrar os registros atuais para manter apenas esses IDs, depois concatenar com os novos uploads.

### 6. Colunas (columns.tsx)

Crie `src/features/Contratos/components/columns.tsx` (`'use client'`).
Use `DataTableColumnHeader` de `@/features/components/data-table`.
Colunas com filtro facetado precisam de `filterFn: (row, id, value) => value.includes(row.getValue(id))`.
Última coluna: `{ id: 'actions', cell: ... }`.

### 7. Wrapper client (OBRIGATÓRIO)

Crie `src/features/Contratos/components/Contratos-data-table.tsx` (`'use client'`).
Recebe APENAS `data` e `pageCount`. Importa internamente columns, constantes e dialogs.
Passa para `<DataTable>`: columns, searchColumnId, searchPlaceholder, facetedFilters, columnLabels, filterMappings, actions.

**filterMappings** usa apenas `{ columnId, isArray? }` — sem `urlParam`:

```typescript
filterMappings={[
  { columnId: 'name' },
  { columnId: 'role', isArray: true },
  { columnId: 'status', isArray: true },
]}
```

**Por que é obrigatório**: page.tsx é Server Component; columns tem funções não serializáveis. O wrapper resolve isso.

### 8. Ações de linha (opcional)

Crie `data-table-row-actions.tsx` com DropdownMenu (ver, editar, ativar/desativar, excluir). Use `router.refresh()` após ações.

### 9. Schema Zod

Crie `schemas/ContratosSchema.ts` com schema + type inferido. Use `z.enum` das constantes.
Se tiver upload: use o hook genérico `useFileUpload` de `@/hooks/useFileUpload`. O hook gerencia:

- `files: File[]` — arquivos novos selecionados pelo usuário
- `existingAttachments: FileAttachment[]` — arquivos vindos do servidor (editáveis com remove)
- `handleFileChange`, `removeFile`, `removeExistingAttachment`, `resetFiles`, `setInitialAttachments`

### 10. Dialogs (opcional)

Dialog criar/editar com `react-hook-form` + schema. Dialog visualizar em modo leitura.

**No `onSubmit` do dialog com upload (só se aplicável)**, passar os arquivos para o service:

```typescript
// Edição: enviar novos arquivos + IDs dos existentes mantidos
await putService(
  id,
  { ...data },
  {
    newFiles: files,
    existingFileIds: existingAttachments.map((a) => a.id),
  }
);

// Criação: enviar apenas novos arquivos
await postService(
  { ...data },
  {
    newFiles: files.length > 0 ? files : undefined,
  }
);
```

### 11. Page (Server Component)

Crie `src/app/.../Contratos/page.tsx`. Extrai `columns`/`content` de searchParams (normalizar para array), chama o service, renderiza o wrapper passando `data` e `pageCount`.

### 12. Loading (Skeleton)

Crie `src/app/.../Contratos/loading.tsx`. Use `DataTableSkeleton` de `@/features/components/data-table`.
O layout deve espelhar a page.tsx. Props: `columnCount`, `rowCount`, `filterCount`, `showSearch`, `showActions`.

---

## Componentes genéricos (NÃO recrie)

Importar de `@/features/components/data-table`:

| Componente              | Quando usar       |
| ----------------------- | ----------------- |
| `DataTable`             | No wrapper client |
| `DataTableColumnHeader` | No columns.tsx    |
| `DataTableSkeleton`     | No loading.tsx    |

Os demais (`Toolbar`, `Pagination`, `FacetedFilter`, `ViewOptions`) são internos do DataTable.

Utilitários em `src/lib/`:

- `api-client.ts` — `apiRequest`, `buildQueryString`
- `form-data.ts` — `buildFormDataBody`, `FileUploadOptions` (só se tiver upload)

Tipos genéricos em `src/types/file.ts`: `FileAttachment` (tipo base para qualquer arquivo anexo).
Hook genérico em `src/hooks/useFileUpload.ts` (reutilizável em qualquer feature com upload).

---

## Estrutura de pastas

```
src/types/file.ts                          (FileAttachment genérico)
src/types/Contratos.ts
src/hooks/useFileUpload.ts                 (hook genérico, se aplicável)
src/lib/form-data.ts                       (buildFormDataBody, se aplicável)
src/mocks/Contratos.ts
src/features/Contratos/
  ├── constants.ts
  ├── schemas/ContratosSchema.ts
  ├── services/ContratosService.ts
  └── components/
      ├── columns.tsx
      ├── Contratos-data-table.tsx          (wrapper, OBRIGATÓRIO)
      ├── data-table-row-actions.tsx
      ├── status-badge.tsx
      ├── add-Contratos-dialog.tsx
      └── view-Contratos-dialog.tsx
src/app/api/.../Contratos/
  ├── route.ts
  └── [id]/route.ts
src/app/.../Contratos/
  ├── page.tsx
  └── loading.tsx
```

---

## Checklist

- [ ] Tipo da entidade
- [ ] Constantes
- [ ] Service API
- [ ] Mock + in-memory-db
- [ ] Rotas API (lista + por id)
- [ ] columns.tsx
- [ ] Wrapper client
- [ ] Row actions
- [ ] Schema Zod
- [ ] Dialogs (criar/editar + visualizar)
- [ ] StatusBadge
- [ ] page.tsx
- [ ] loading.tsx
