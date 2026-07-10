import { ApiResponse } from '@org/shared-types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export class UnauthorizedError extends Error {
  constructor(message = 'Session expired or unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

export async function fetchApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser ? localStorage.getItem('token') : null;
  const activeTenantId = isBrowser ? localStorage.getItem('activeTenantId') : null;

  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (activeTenantId) {
    headers.set('X-Tenant-ID', activeTenantId);
  }

  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (unauthorizedHandler) {
      unauthorizedHandler();
    }
    throw new UnauthorizedError();
  }

  let result: ApiResponse<T>;
  try {
    result = await response.json();
  } catch {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  if (!response.ok || !result.success) {
    const detailMsg = result.errors ? result.errors.join(', ') : result.message;
    throw new Error(detailMsg || `Request failed with status ${response.status}`);
  }

  return result;
}
