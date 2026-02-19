import { EMPLOYEE_ROLES } from '../features/funcionarios/constants';
import {
  EmployeeDetail,
  EmployeeFile,
  EmployeeSummary,
} from '../types/employee';

const roles = EMPLOYEE_ROLES.map((r) => r.value);

const names = [
  'Ana Silva',
  'Carlos Souza',
  'Mariana Oliveira',
  'Pedro Santos',
  'Julia Lima',
  'Rafael Costa',
  'Fernanda Pereira',
  'Lucas Rodrigues',
  'Beatriz Almeida',
  'Gabriel Nascimento',
  'Larissa Alves',
  'Mateus Ribeiro',
  'Camila Gonçalves',
  'Thiago Martins',
  'Isabela Carvalho',
  'Rodrigo Ferreira',
  'Amanda Rocha',
  'Bruno Barbosa',
  'Carolina Dias',
  'Daniel Moreira',
  'Eduarda Pinto',
  'Felipe Teixeira',
  'Gabriela Cavalcanti',
  'Hugo Cardoso',
  'Igor Castro',
  'Joana Correia',
  'Kevin Melo',
  'Luana Azevedo',
  'Miguel Barros',
  'Natalia Cunha',
];

const getSeededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateFile = (
  id: string,
  name: string,
  seed: number
): EmployeeFile => ({
  id,
  name,
  type: 'application/pdf',
  size: 1024 * (Math.floor(getSeededRandom(seed) * 5) + 1),
  url: '#',
});

export const mockEmployeeDetails: EmployeeDetail[] = names.map((name, i) => {
  const seed = i * 1000;
  const contractsCount = Math.floor(getSeededRandom(seed) * 4); // 0 to 3
  const contracts = Array.from({ length: contractsCount }).map((_, j) =>
    generateFile(
      `file-detail-${i}-${j}`,
      `contrato_202${3 + j}.pdf`,
      seed + j + 1
    )
  );

  const isInactive = getSeededRandom(seed + 10) <= 0.5; // 50% chance

  let status: 'ativo' | 'pendente' | 'inativo';
  if (isInactive) {
    status = 'inativo';
  } else {
    status = contracts.length > 0 ? 'ativo' : 'pendente';
  }

  return {
    id: `${i + 1}`,
    name: name,
    role: roles[i % roles.length],
    status,
    lastContract:
      contracts.length > 0 ? contracts[contracts.length - 1] : undefined,
    email: `${name.toLowerCase().replace(' ', '.')}@empresa.com`,
    cpf: `123.${Math.floor(getSeededRandom(seed + 20) * 900) + 100}.${
      Math.floor(getSeededRandom(seed + 30) * 900) + 100
    }-${Math.floor(getSeededRandom(seed + 40) * 90) + 10}`,
    birthDate: '1990-05-15',
    admissionDate: '2022-03-10',
    phone: `(11) 9${Math.floor(getSeededRandom(seed + 50) * 9000) + 1000}-${
      Math.floor(getSeededRandom(seed + 60) * 9000) + 1000
    }`,
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    Contracts: contracts,
  };
});

export const mockEmployeeSummaries: EmployeeSummary[] = mockEmployeeDetails.map(
  (detail) => ({
    id: detail.id,
    name: detail.name,
    role: detail.role,
    status: detail.status,
    lastContract: detail.lastContract,
  })
);
