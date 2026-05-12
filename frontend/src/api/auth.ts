import apiClient from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: 'SME' | 'INVESTOR';
}

export interface AuthUser {
  userId: number;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'SME' | 'INVESTOR';
  token: string;
}

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const { data } = await apiClient.post('/api/auth/login', payload);
  return data.data as AuthUser;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const { data } = await apiClient.post('/api/auth/register', payload);
  return data.data as AuthUser;
}
