import { api } from '@/lib/api';

export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

interface RegisterResponse {
  user: AuthUser;
}

interface LoginResponse {
  user: AuthUser;
}

interface MeResponse {
  user: AuthUser;
}

export async function register(email: string, password: string): Promise<AuthUser> {
  const data = await api.post<RegisterResponse>('/api/auth/register', { email, password });
  return data.user;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const data = await api.post<LoginResponse>('/api/auth/login', { email, password });
  return data.user;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const data = await api.get<MeResponse>('/api/auth/me');
  return data.user;
}

export async function logout(): Promise<void> {
  await api.post('/api/auth/logout');
}
