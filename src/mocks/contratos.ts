import { ContractStatus, ContratoDetail, ContratoSummary } from '@/types/contrato';

const statusByDate = (endDate: string): ContractStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  if (end < today) return 'vencido';
  if (end > today) return 'agendado';
  return 'ativo';
};

const contractsSeed = [
  {
    tenantName: 'Lucas Almeida',
    property: 'IMV-001 / Ed. Paulista Torre 1',
    propertyAddress: 'Av. Paulista, 1000 - Bela Vista, São Paulo/SP',
    startDate: '2025-01-10',
    endDate: '2026-01-10',
  },
  {
    tenantName: 'Marina Costa',
    property: 'IMV-002 / Ed. Paulista Torre 2',
    propertyAddress: 'Av. Paulista, 1000 - Bela Vista, São Paulo/SP',
    startDate: '2024-05-01',
    endDate: '2025-05-01',
  },
  {
    tenantName: 'Rafael Nunes',
    property: 'IMV-003 / Casa Jardim América',
    propertyAddress: 'Rua das Flores, 123 - Jardim América, São Paulo/SP',
    startDate: '2026-03-01',
    endDate: '2027-03-01',
  },
  {
    tenantName: 'Ana Beatriz',
    property: 'IMV-004 / Solar Augusta',
    propertyAddress: 'Rua Augusta, 500 - Consolação, São Paulo/SP',
    startDate: '2025-10-01',
    endDate: '2026-10-01',
  },
  {
    tenantName: 'Felipe Rocha',
    property: 'IMV-005 / Solar Augusta',
    propertyAddress: 'Rua Augusta, 500 - Consolação, São Paulo/SP',
    startDate: '2024-01-10',
    endDate: '2024-12-31',
  },
  {
    tenantName: 'Camila Matos',
    property: 'IMV-006 / Casa Alameda Santos',
    propertyAddress: 'Alameda Santos, 800 - Cerqueira Cesar, São Paulo/SP',
    startDate: '2026-06-01',
    endDate: '2027-06-01',
  },
  {
    tenantName: 'Gustavo Pires',
    property: 'IMV-007 / Bloco C Faria Lima',
    propertyAddress: 'Av. Brigadeiro Faria Lima, 2000 - Pinheiros, São Paulo/SP',
    startDate: '2025-02-01',
    endDate: '2026-02-01',
  },
  {
    tenantName: 'Bruna Souza',
    property: 'IMV-008 / Casa Oscar Freire',
    propertyAddress: 'Rua Oscar Freire, 300 - Jardins, São Paulo/SP',
    startDate: '2023-09-15',
    endDate: '2024-09-15',
  },
  {
    tenantName: 'Victor Santos',
    property: 'IMV-009 / Ap. Consolacao',
    propertyAddress: 'Rua da Consolacao, 1500 - Consolacao, São Paulo/SP',
    startDate: '2026-01-20',
    endDate: '2027-01-20',
  },
  {
    tenantName: 'Helena Prado',
    property: 'IMV-010 / Ap. Liberdade',
    propertyAddress: 'Rua Vergueiro, 900 - Liberdade, São Paulo/SP',
    startDate: '2025-06-12',
    endDate: '2026-06-12',
  },
  {
    tenantName: 'Diego Moreira',
    property: 'IMV-011 / Casa Av. Brasil',
    propertyAddress: 'Av. Brasil, 100 - Jardim America, São Paulo/SP',
    startDate: '2024-03-10',
    endDate: '2025-03-10',
  },
  {
    tenantName: 'Larissa Mello',
    property: 'IMV-012 / Ap. Centro',
    propertyAddress: 'Rua 25 de Marco, 50 - Centro, São Paulo/SP',
    startDate: '2026-04-01',
    endDate: '2027-04-01',
  },
  {
    tenantName: 'Paulo Guedes',
    property: 'IMV-013 / Ap. Vila Mariana',
    propertyAddress: 'Rua Domingo de Morais, 1200 - Vila Mariana, São Paulo/SP',
    startDate: '2025-08-15',
    endDate: '2026-08-15',
  },
  {
    tenantName: 'Aline Barreto',
    property: 'IMV-014 / Casa Moema',
    propertyAddress: 'Av. Ibirapuera, 2500 - Moema, São Paulo/SP',
    startDate: '2024-07-01',
    endDate: '2025-07-01',
  },
  {
    tenantName: 'Joao Sales',
    property: 'IMV-015 / Ap. Pinheiros',
    propertyAddress: 'Rua Teodoro Sampaio, 800 - Pinheiros, São Paulo/SP',
    startDate: '2026-09-01',
    endDate: '2027-09-01',
  },
];

export const mockContractDetails: ContratoDetail[] = contractsSeed.map(
  (item, index) => ({
    id: `${index + 1}`,
    condId: `COND-${String((index % 3) + 1).padStart(3, '0')}`,
    tenantName: item.tenantName,
    property: item.property,
    propertyAddress: item.propertyAddress,
    startDate: item.startDate,
    endDate: item.endDate,
    status: statusByDate(item.endDate),
  })
);

export const mockContractSummaries: ContratoSummary[] = mockContractDetails.map(
  (item) => ({
    id: item.id,
    tenantName: item.tenantName,
    propertyAddress: item.propertyAddress,
    property: item.property,
    status: item.status,
    startDate: item.startDate,
    endDate: item.endDate,
  })
);
