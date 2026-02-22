import { ContratoDetail, ContratoSummary } from '@/types/contrato';

const contractsSeed = [
  {
    id: '1',
    condId: '1',
    tenantName: 'Lucas Almeida',
    tenantId: 'cond-1',
    property: 'IMV-001 / Apartamento 101 - Bloco A',
    propertyId: 'IMV-001',
    createdAt: '2026-01-10',
    dueDate: '2027-01-10',
    pdfFileName: 'contrato-locacao-lucas-almeida.pdf',
    pdfFileUrl: '/mock-files/contracts/contrato-locacao-lucas-almeida.pdf',
    sourceType: 'upload' as const,
  },
  {
    id: '2',
    condId: '1',
    tenantName: 'Marina Costa',
    tenantId: 'cond-2',
    property: 'IMV-002 / Apartamento 202 - Bloco A',
    propertyId: 'IMV-002',
    createdAt: '2025-05-01',
    dueDate: '2026-05-01',
    pdfFileName: 'contrato-modelo-marina-costa.pdf',
    pdfFileUrl: '/mock-files/contracts/contrato-modelo-marina-costa.pdf',
    sourceType: 'model' as const,
    modelId: 'model-1',
    modelName: 'Locacao Residencial Padrao',
    modelInputValues: {
      'locatario.nome': 'Marina Costa',
      'financeiro.valor_aluguel': '2900,00',
    },
  },
];

export const mockContractDetails: ContratoDetail[] = contractsSeed;

export const mockContractSummaries: ContratoSummary[] = mockContractDetails.map(
  (item) => ({
    id: item.id,
    condId: item.condId,
    propertyId: item.propertyId,
    tenantName: item.tenantName,
    tenantId: item.tenantId,
    property: item.property,
    createdAt: item.createdAt,
    dueDate: item.dueDate,
    pdfFileName: item.pdfFileName,
    pdfFileUrl: item.pdfFileUrl,
    sourceType: item.sourceType,
    modelId: item.modelId,
    modelName: item.modelName,
  })
);
