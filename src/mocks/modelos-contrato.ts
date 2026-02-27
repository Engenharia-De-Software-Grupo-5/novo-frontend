import {
  ModeloContratoDetail,
  ModeloContratoSummary,
} from '@/types/modelo-contrato';
import { extractTemplateInputs } from '@/lib/contratos-template-inputs';

export const mockContractModelDetails: ModeloContratoDetail[] = [
  {
    id: 'model-2',
    condId: 'ad90f125-1462-4b24-8cbf-caaee6d76651',
    name: 'Locacao com Segundo Proponente',
    purpose: 'Modelo com exigencia de dados do segundo proponente.',
    createdAt: '2026-02-21',
    rawText: `# CONTRATO COM SEGUNDO PROPONENTE

LOCADOR:
Nome: {{locador.nome}}
CPF: {{locador.cpf}}
Telefone: {{locador.telefone}}
E-mail: {{locador.email}}

LOCATARIO:
Nome: {{locatario.nome}}
CPF: {{locatario.cpf}}

SEGUNDO PROPONENTE:
Nome: {{segundo_proponente.nome}}
CPF: {{segundo_proponente.cpf}}
RG: {{segundo_proponente.rg}}
Data de nascimento: {{segundo_proponente.data_nascimento}}
Profissao: {{segundo_proponente.profissao}}
Telefone principal: {{segundo_proponente.telefone_principal}}
E-mail: {{segundo_proponente.email}}

DADOS CONTRATUAIS:
Inicio: {{contrato.data_inicio}}
Fim: {{contrato.data_fim}}
Aluguel: {{financeiro.valor_aluguel}}
Informacoes adicionais: {{contrato.informacoes_adicionais}}
`,
    inputs: extractTemplateInputs(`# CONTRATO COM SEGUNDO PROPONENTE

LOCADOR:
Nome: {{locador.nome}}
CPF: {{locador.cpf}}
Telefone: {{locador.telefone}}
E-mail: {{locador.email}}

LOCATARIO:
Nome: {{locatario.nome}}
CPF: {{locatario.cpf}}

SEGUNDO PROPONENTE:
Nome: {{segundo_proponente.nome}}
CPF: {{segundo_proponente.cpf}}
RG: {{segundo_proponente.rg}}
Data de nascimento: {{segundo_proponente.data_nascimento}}
Profissao: {{segundo_proponente.profissao}}
Telefone principal: {{segundo_proponente.telefone_principal}}
E-mail: {{segundo_proponente.email}}

DADOS CONTRATUAIS:
Inicio: {{contrato.data_inicio}}
Fim: {{contrato.data_fim}}
Aluguel: {{financeiro.valor_aluguel}}
Informacoes adicionais: {{contrato.informacoes_adicionais}}
`),
  },
  {
    id: 'model-3',
    condId: 'ad90f125-1462-4b24-8cbf-caaee6d76651',
    name: 'Locacao Contratual Simplificada',
    purpose: 'Modelo apenas com campos contratuais e financeiros.',
    createdAt: '2026-02-21',
    rawText: `# CONTRATO SIMPLIFICADO

LOCATARIO: {{locatario.nome}}
IMOVEL: {{imovel.endereco}}

Inicio: {{contrato.data_inicio}}
Fim: {{contrato.data_fim}}
Valor aluguel: {{financeiro.valor_aluguel}}
Valor condominio: {{financeiro.valor_condominio}}
Valor IPTU: {{financeiro.valor_iptu}}
Valor TCR: {{financeiro.valor_tcr}}
Observacoes: {{contrato.informacoes_adicionais}}
`,
    inputs: extractTemplateInputs(`# CONTRATO SIMPLIFICADO

LOCATARIO: {{locatario.nome}}
IMOVEL: {{imovel.endereco}}

Inicio: {{contrato.data_inicio}}
Fim: {{contrato.data_fim}}
Valor aluguel: {{financeiro.valor_aluguel}}
Valor condominio: {{financeiro.valor_condominio}}
Valor IPTU: {{financeiro.valor_iptu}}
Valor TCR: {{financeiro.valor_tcr}}
Observacoes: {{contrato.informacoes_adicionais}}
`),
  },
];

export const mockContractModelSummaries: ModeloContratoSummary[] =
  mockContractModelDetails.map((item) => ({
    id: item.id,
    name: item.name,
    purpose: item.purpose,
    createdAt: item.createdAt,
  }));
