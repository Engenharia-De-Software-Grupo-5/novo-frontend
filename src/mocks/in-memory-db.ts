import { CobrancaDetail, CobrancaTenant } from '@/types/cobranca';
import { DespesaDetail } from '@/types/despesa';
import { EmployeeDetail } from '@/types/employee';
import { PaymentDetail } from '@/types/payment';
import { User } from '@/types/user';

import { mockCobrancaDetails, mockCobrancaTenants } from './cobrancas';
import { mockCondominiums } from './condominiums';
import { mockCondominos } from './condominos';
import { mockContractDetails } from './contratos';
import { mockDespesas } from './despesas';
import { mockEmployeeDetails } from './employees';
import { mockImoveis } from './imoveis';
import { mockContractModelDetails } from './modelos-contrato';
import { mockPaymentDetails } from './payments';
import { users } from './users';
import { CondominoFull } from '@/types/condomino';

// "Database" in memory.
// This allows persistence while the server is running.
// Resetting the server (npm run dev) resets the data.
export const employeesDb = [...mockEmployeeDetails];
export const condominiumsDb = [...mockCondominiums];
export const paymentsDb = [...mockPaymentDetails];
export const contractsDb = [...mockContractDetails];
export const contractModelsDb = [...mockContractModelDetails];
export const despesasDb = [...mockDespesas];
export const cobrancasDb = [...mockCobrancaDetails];
export const cobrancaTenantsDb = [...mockCobrancaTenants];
export const condominosDb = [...mockCondominos];

export const imoveisDb = [...mockImoveis];

const condominiumIds = mockCondominiums.map((condo) => condo.id);

function shiftDate(date: string | undefined, offsetDays: number) {
  if (!date) return date;
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  parsed.setDate(parsed.getDate() + offsetDays);
  return parsed.toISOString().split('T')[0];
}

function buildEmployeesByCondominium() {
  const byCondo: Record<string, EmployeeDetail[]> = {};

  condominiumIds.forEach((condId, condoIndex) => {
    byCondo[condId] = mockEmployeeDetails.map((employee, employeeIndex) => {
      let localStatus = employee.status;
      if (condoIndex !== 0) {
        if (condoIndex === 1) {
          if ((employeeIndex + 1) % 5 === 0) {
            localStatus = 'pendente';
          }
        } else if (employeeIndex % 7 === 0) {
          localStatus = 'inativo';
        }
      }

      return {
        ...employee,
        id: `${condId}-${employee.id}`,
        // Pequena variação determinística para não repetir exatamente os mesmos dados em todos os condomínios
        status: localStatus,
      };
    });
  });

  return byCondo;
}

function buildPaymentsByCondominium() {
  const byCondo: Record<string, PaymentDetail[]> = {};

  condominiumIds.forEach((condId, condoIndex) => {
    const dayOffset = condoIndex * 9;
    byCondo[condId] = mockPaymentDetails.map((payment) => ({
      ...payment,
      id: `${condId}-${payment.id}`,
      employeeId: `${condId}-${payment.employeeId}`,
      dueDate: shiftDate(payment.dueDate, dayOffset) ?? payment.dueDate,
      paymentDate: shiftDate(payment.paymentDate, dayOffset),
      value: Math.round(payment.value * (1 + condoIndex * 0.04)),
    }));
  });

  return byCondo;
}

export const employeesDbByCondominium = buildEmployeesByCondominium();
export const paymentsDbByCondominium = buildPaymentsByCondominium();

function buildDespesasByCondominium() {
  const byCondo: Record<string, DespesaDetail[]> = {};

  condominiumIds.forEach((condId, condoIndex) => {
    const dayOffset = condoIndex * 6;
    byCondo[condId] = mockDespesas.map((despesa) => ({
      ...despesa,
      id: `${condId}-${despesa.id}`,
      data: shiftDate(despesa.data, dayOffset) ?? despesa.data,
      valor: Math.round(despesa.valor * (1 + condoIndex * 0.03) * 100) / 100,
    }));
  });

  return byCondo;
}

function buildUsersByCondominium() {
  const byCondo: Record<string, User[]> = {};

  condominiumIds.forEach((condId, condoIndex) => {
    byCondo[condId] = users.map((user, userIndex) => ({
      ...user,
      id: `${condId}-${user.id}`,
      inviteDate:
        condoIndex === 0
          ? user.inviteDate
          : `${String((userIndex % 28) + 1).padStart(2, '0')}-${String(((condoIndex + userIndex) % 12) + 1).padStart(2, '0')}-2024`,
    }));
  });

  return byCondo;
}

function buildCobrancaTenantsByCondominium() {
  const byCondo: Record<string, CobrancaTenant[]> = {};

  condominiumIds.forEach((condId) => {
    byCondo[condId] = mockCobrancaTenants.map((tenant) => ({
      ...tenant,
      id: `${condId}-${tenant.id}`,
      email: tenant.email.replace('@', `+${condId}@`),
    }));
  });

  return byCondo;
}

function buildCobrancasByCondominium() {
  const byCondo: Record<string, CobrancaDetail[]> = {};
  const tenantsByCondo = buildCobrancaTenantsByCondominium();

  const monthlyFactorForCondoOne: Record<string, number> = {
    '01': 2.7,
    '02': 0.52,
    '03': 0.6,
    '04': 2.25,
    '05': 0.7,
    '06': 2.35,
    '07': 0.55,
    '08': 2.05,
    '09': 0.68,
    '10': 2.4,
    '11': 0.58,
    '12': 2.15,
  };

  condominiumIds.forEach((condId, condoIndex) => {
    const dayOffset = condoIndex * 7;
    const condoTenants = tenantsByCondo[condId];
    const tenantIdMap = new Map(
      condoTenants.map((tenant) => [
        tenant.id.replace(`${condId}-`, ''),
        tenant,
      ])
    );

    byCondo[condId] = mockCobrancaDetails
      .map((cobranca) => {
        const mappedTenant = tenantIdMap.get(cobranca.tenantId);
        if (!mappedTenant) return null;

        const shiftedDueDate =
          shiftDate(cobranca.dueDate, dayOffset) ?? cobranca.dueDate;
        const month = shiftedDueDate.slice(5, 7);
        const baseCondoFactor = 1 + condoIndex * 0.025;
        const condoFactor =
          condId === '1'
            ? 12 * (monthlyFactorForCondoOne[month] ?? 1)
            : baseCondoFactor;

        return {
          ...cobranca,
          id: `${condId}-${cobranca.id}`,
          tenantId: mappedTenant.id,
          name: mappedTenant.name,
          email: mappedTenant.email,
          cpf: mappedTenant.cpf,
          dueDate: shiftedDueDate,
          paymentDate: shiftDate(cobranca.paymentDate, dayOffset),
          value: Math.round(cobranca.value * condoFactor),
        };
      })
      .filter((item): item is CobrancaDetail => item !== null);
  });

  return { byCondo, tenantsByCondo };
}



export const despesasDbByCondominium = buildDespesasByCondominium();
export const usersDbByCondominium = buildUsersByCondominium();
const cobrancasByCondominium = buildCobrancasByCondominium();
export const cobrancasDbByCondominium = cobrancasByCondominium.byCondo;
export const cobrancaTenantsDbByCondominium =
  cobrancasByCondominium.tenantsByCondo;

export function getEmployeesDb(condId: string): EmployeeDetail[] {
  if (!employeesDbByCondominium[condId]) {
    employeesDbByCondominium[condId] = [];
  }
  return employeesDbByCondominium[condId];
}

export function getPaymentsDb(condId: string): PaymentDetail[] {
  if (!paymentsDbByCondominium[condId]) {
    paymentsDbByCondominium[condId] = [];
  }
  return paymentsDbByCondominium[condId];
}

export function getDespesasDb(condId: string): DespesaDetail[] {
  if (!despesasDbByCondominium[condId]) {
    despesasDbByCondominium[condId] = [];
  }
  return despesasDbByCondominium[condId];
}

export function getUsersDb(condId: string): User[] {
  if (!usersDbByCondominium[condId]) {
    usersDbByCondominium[condId] = [];
  }
  return usersDbByCondominium[condId];
}

export function getCobrancasDb(condId: string): CobrancaDetail[] {
  if (!cobrancasDbByCondominium[condId]) {
    cobrancasDbByCondominium[condId] = [];
  }
  return cobrancasDbByCondominium[condId];
}

export function getCobrancaTenantsDb(condId: string): CobrancaTenant[] {
  if (!cobrancaTenantsDbByCondominium[condId]) {
    cobrancaTenantsDbByCondominium[condId] = [];
  }
  return cobrancaTenantsDbByCondominium[condId];
}

function buildCondominosByCondominium() {
  const byCondo: Record<string, CondominoFull[]> = {};

  condominiumIds.forEach((condId) => {
    byCondo[condId] = mockCondominos
      .filter((c) => c.condominiumId === condId)
      .map((c) => ({ ...c, id: `${condId}-${c.id}` }));
  });

  return byCondo;
}

export const condominosDbByCondominium = buildCondominosByCondominium();

export function getCondominosDb(condId: string): CondominoFull[] {
  if (!condominosDbByCondominium[condId]) {
    condominosDbByCondominium[condId] = [];
  }
  return condominosDbByCondominium[condId];
}
