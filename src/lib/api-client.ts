import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_URL_REAL = 'https://api.bemconnect.com.br/api/v1';

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
  isReal: boolean = false
): Promise<T> {
  const { body, headers, ...rest } = options;

  const isFormData = body instanceof FormData;

  let requestBody: BodyInit | null | undefined;
  if (isFormData) {
    requestBody = body as FormData;
  } else if (body) {
    requestBody = JSON.stringify(body);
  } else {
    requestBody = undefined;
  }

 
  
  const session = await auth();
  const token = session?.user?.accessToken;

  const authHeaders: Record<string, string> = {};
  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  console.log('Fetching:', `${API_URL}${path}`);
  const response = await fetch(`${isReal ? API_URL_REAL : API_URL}${path}`, {
    headers: {
      // Don't set Content-Type for FormData — the browser sets it
      // automatically with the correct multipart boundary
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...authHeaders,
      ...headers,
    },
    body: requestBody,
    ...rest,
  });
  console.log('Response status:', response.status, 'URL:', response.url);


  if (response.status === 401) {
    redirect('/login');
  }

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`);
  }

  // Some responses (e.g. DELETE 204) may have no body
  const text = await response.text();
  return text ? JSON.parse(text) : (undefined as T);
}

export function buildQueryString(
  params: Record<string, string | number | string[] | undefined>
): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;

    if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, v));
    } else {
      query.set(key, String(value));
    }
  }

  const str = query.toString();
  return str ? `?${str}` : '';
}
