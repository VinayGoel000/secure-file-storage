export interface ApiOk<T> {
  status: 'ok';
  data: T;
}

export interface ApiError {
  status: 'error';
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export type ApiResponse<T> = ApiOk<T> | ApiError;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiErrorClass extends Error {
  statusCode: number;
  errors?: Array<{ field: string; message: string }>;

  constructor(statusCode: number, message: string, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    options.body = JSON.stringify(options.body);
  }

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch {
    throw new ApiErrorClass(0, 'Network error. Please check your connection and try again.');
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    throw new ApiErrorClass(res.status || 500, 'Unexpected server response.');
  }

  if (!res.ok) {
    const errBody = body as ApiError;
    throw new ApiErrorClass(
      errBody.statusCode || res.status,
      errBody.message || 'An unexpected error occurred.',
      errBody.errors,
    );
  }

  const apiBody = body as ApiResponse<T>;

  if (apiBody.status === 'ok' && 'data' in apiBody) {
    return apiBody.data;
  }

  throw new ApiErrorClass(500, 'Unexpected server response.');
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),

  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: data as BodyInit }),

  put: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PUT', body: data as BodyInit }),

  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PATCH', body: data as BodyInit }),

  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export { ApiErrorClass };
