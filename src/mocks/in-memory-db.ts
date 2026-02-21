import { mockCondominiums } from './condominiums';
import { mockCobrancaDetails, mockCobrancaTenants } from './cobrancas';
import { mockEmployeeDetails } from './employees';
import { mockImoveis } from './imoveis';
import { mockPaymentDetails } from './payments';
import { mockDespesas } from './despesas';

// "Database" in memory.
// This allows persistence while the server is running.
// Resetting the server (npm run dev) resets the data.
export const employeesDb = [...mockEmployeeDetails];
export const condominiumsDb = [...mockCondominiums];
export const paymentsDb = [...mockPaymentDetails];
export const cobrancasDb = [...mockCobrancaDetails];
export const cobrancaTenantsDb = [...mockCobrancaTenants];
export const despesasDb  = [...mockDespesas];

export const imoveisDb = [...mockImoveis];
