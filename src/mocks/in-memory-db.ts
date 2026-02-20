import { mockCondominiums } from './condominiums';
import { mockEmployeeDetails } from './employees';
import { mockImoveis } from './imoveis';
import { mockPaymentDetails } from './payments';

// "Database" in memory.
// This allows persistence while the server is running.
// Resetting the server (npm run dev) resets the data.
export const employeesDb = [...mockEmployeeDetails];
export const condominiumsDb = [...mockCondominiums];
export const paymentsDb = [...mockPaymentDetails];
export const imoveisDb = [...mockImoveis];
