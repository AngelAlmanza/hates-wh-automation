import axios from 'axios';
import type { LoginRequest, LoginResponse, RefreshResponse, UserProfile } from '@repo/shared';

const REFRESH_TOKEN_KEY = 'refresh_token';

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setRefreshToken(token: string | null) {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function clearTokens() {
  accessToken = null;
  setRefreshToken(null);
}

export async function login(credentials: LoginRequest): Promise<{ user: UserProfile }> {
  const { data: envelope } = await axios.post<{ data: LoginResponse }>('/api/auth/login', credentials);
  const data = envelope.data;
  setAccessToken(data.accessToken);
  setRefreshToken(data.refreshToken);
  return { user: data.user };
}

export async function refreshTokens(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const { data: envelope } = await axios.post<{ data: RefreshResponse }>('/api/auth/refresh', {
    refreshToken,
  });
  const data = envelope.data;

  setAccessToken(data.accessToken);
  setRefreshToken(data.refreshToken);
  return data.accessToken;
}

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await axios.post('/api/auth/logout', { refreshToken });
    } catch {
      // Ignore errors on logout
    }
  }
  clearTokens();
}
