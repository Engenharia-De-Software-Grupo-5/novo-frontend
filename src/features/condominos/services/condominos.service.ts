'use server';

import { revalidatePath } from 'next/cache';

import {
  CondominoAPI,
  CondominoCreateDTO,
  CondominoFull,
  CondominosAPIResponse,
  CondominosResponse,
  CondominoStatus,
  CondominoSummary,
} from '@/types/condomino';
import { apiRequest, buildQueryString } from '@/lib/api-client';
import { buildFormDataBody, FileUploadOptions } from '@/lib/form-data';

const basePath = (condId: string) => `/api/v1/condominios/${condId}/condominos`;
const isReal = true;

const statusFromApi: Record<string, string> = {
  ACTIVE: 'ativo',
  INACTIVE: 'inativo',
  PENDING: 'pendente',
};

const statusToApiMap: Record<string, 'ACTIVE' | 'INACTIVE' | 'PENDING'> = {
  ativo: 'ACTIVE',
  inativo: 'INACTIVE',
  pendente: 'PENDING',
};

function mapStatusToApi(status: string): 'ACTIVE' | 'INACTIVE' | 'PENDING' {
  const mapped = statusToApiMap[status.toLowerCase()];
  if (!mapped) throw new Error(`Status inválido: ${status}`);
  return mapped;
}


function mapCondominoFromApi(condomino: CondominoAPI): CondominoSummary {
  return {
    id: condomino.id,
    name: condomino.name,
    email: condomino.email,
    cpf: condomino.cpf,
    status: (statusFromApi[condomino.status] ?? 'pendente') as CondominoStatus,
  };
}


function mapCondominoFullFromApi(condomino: CondominoAPI): CondominoFull {
  return {
    id: condomino.id,
    condominiumId: condomino.condominiumId,
    name: condomino.name,
    birthDate: condomino.birthDate,
    maritalStatus: condomino.maritalStatus,
    rg: condomino.rg,
    issuingAuthority: condomino.issuingAuthority,
    cpf: condomino.cpf,
    monthlyIncome: condomino.monthlyIncome,
    email: condomino.email,
    primaryPhone: condomino.primaryPhone,
    secondaryPhone: condomino.secondaryPhone ?? undefined,
    address: condomino.address,
    emergencyContacts: condomino.emergencyContacts.map((e) => ({
      name: e.name,
      relationship: e.relationship,
      phone: e.phone,
    })),
    professionalInfo: condomino.professionalInfo
      ? {
          companyName: condomino.professionalInfo.companyName,
          companyPhone: condomino.professionalInfo.companyPhone,
          companyAddress: condomino.professionalInfo.companyAddress?.street ?? '',
          position: condomino.professionalInfo.position,
          monthsWorking: condomino.professionalInfo.monthsWorking,
        }
      : { companyName: '', companyPhone: '', companyAddress: '', position: '', monthsWorking: 0 },
    bankingInfo: condomino.bankingInfo
      ? {
          bank: condomino.bankingInfo.bank,
          accountType: condomino.bankingInfo.accountType,
          accountNumber: condomino.bankingInfo.accountNumber,
          agency: condomino.bankingInfo.agency,
        }
      : { bank: '', accountType: '', accountNumber: '', agency: '' },
    spouse: condomino.spouse
      ? {
          name: condomino.spouse.name,
          rg: condomino.spouse.rg,
          cpf: condomino.spouse.cpf,
          profession: condomino.spouse.profession,
          monthlyIncome: condomino.spouse.monthlyIncome,
        }
      : undefined,
    additionalResidents: condomino.additionalResidents.map((r) => ({
      name: r.name,
      relationship: r.relationship,
      age: 0, // API não retorna age, só birthDate
    })),
    documents: {},
    status: (statusFromApi[condomino.status] ?? 'pendente') as CondominoStatus,
  };
}

export const getCondominos = async (
  condId: string,
  params?: {
    page?: number;
    limit?: number;
    columns?: string[];
    content?: string[];
    sort?: string;
  }
): Promise<CondominosResponse> => {
  try {
    const queryParams: Record<string, string | number | string[] | undefined> =
      {
        page: params?.page,
        limit: params?.limit,
        sort: params?.sort,
      };

    if (params?.columns && params?.content && params.columns.length > 0) {
      queryParams.columnName = params.columns;
      queryParams.content = params.content;
    }

    const query = buildQueryString(queryParams);

    const response = await apiRequest<CondominosAPIResponse>(
      `${basePath(condId)}${query}`,
      {
        method: 'GET',
      },
      isReal
    );

    return {
      ...response,
      items: response.items.map(mapCondominoFromApi),
    };
  } catch (error) {
    console.error('Error fetching condominos:', error);
    return {
      items: [],
      meta: { totalItems: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
};


export const getCondominoById = async (
  condId: string,
  condominoId: string
): Promise<CondominoFull> => {
  const response = await apiRequest<CondominoAPI>(
    `${basePath(condId)}/${condominoId}`,
    { method: 'GET' },
    isReal
  );
  //console.log('RESPONSE BYID ', response);
  return mapCondominoFullFromApi(response);
};

export const postCondomino = async (
  condId: string,
  data: Partial<CondominoCreateDTO>,
  options?: FileUploadOptions
): Promise<void> => {
  await apiRequest(basePath(condId), {
    method: 'POST',
    body: buildFormDataBody(data, options),
  },isReal);

  revalidatePath(`/condominios/${condId}/condominos`);
};


export const deleteCondomino = async (
  condId: string,
  condominoId: string
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${condominoId}`, {
    method: 'DELETE',
  }, isReal);

  revalidatePath(`/condominios/${condId}/condominos`);
};



export const patchCondomino = async (
  condId: string,
  condominoId: string,
  data: Partial<CondominoFull>
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${condominoId}`, {
    method: 'PATCH',
    body: data,
  }, isReal);

  revalidatePath(`/condominios/${condId}/condominos`);
};

export const changeCondominoStatus = async (
  condId: string,
  condominoId: string,
  status: CondominoStatus
): Promise<void> => {
  const condomino = await getCondominoById(condId, condominoId);

  await patchCondomino(condId, condominoId, {
    maritalStatus: condomino.maritalStatus,
    monthlyIncome: condomino.monthlyIncome,
    email: condomino.email,
    primaryPhone: condomino.primaryPhone,
    address: condomino.address,
    status: mapStatusToApi(status) as unknown as CondominoStatus,
  });
};



export const putCondomino = async (
  condId: string,
  condominoId: string,
  data: Partial<CondominoFull>,
  options?: FileUploadOptions
): Promise<void> => {
  await apiRequest(`${basePath(condId)}/${condominoId}`, {
    method: 'PUT',
    body: buildFormDataBody(data, options),
  }, isReal);

  revalidatePath(`/condominios/${condId}/condominos`);
};
