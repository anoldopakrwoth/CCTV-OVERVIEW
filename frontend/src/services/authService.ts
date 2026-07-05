import api from '@/services/api';
import type { LoginCredentials, LoginResponse } from '@/types';
import { clearTokens, setStoredUser, setTokens } from '@/utils/tokenStorage';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const MOCK_USER = {
  id: 1,
  email: 'operator@sentryvision.local',
  name: 'Security Operator',
};

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  if (USE_MOCK) {
    await delay(600);
    const response: LoginResponse = {
      access: createMockJwt(Date.now() + 3600_000),
      refresh: createMockJwt(Date.now() + 86_400_000),
      user: { ...MOCK_USER, email: credentials.email },
    };
    setTokens(response.access, response.refresh);
    setStoredUser(response.user);
    return response;
  }

  const { data } = await api.post<LoginResponse>('auth/login/', credentials);
  setTokens(data.access, data.refresh);
  setStoredUser(data.user);
  return data;
}

export async function logout(): Promise<void> {
  if (!USE_MOCK) {
    try {
      await api.post('auth/logout/');
    } catch {
      // Ignore logout errors — clear local session regardless
    }
  }
  clearTokens();
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createMockJwt(expiresAtMs: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ exp: Math.floor(expiresAtMs / 1000) }));
  return `${header}.${payload}.mock-signature`;
}
