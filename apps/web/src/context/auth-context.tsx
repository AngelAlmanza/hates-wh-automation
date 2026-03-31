import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { UserProfile } from '@repo/shared';
import * as authLib from '../lib/auth';
import { apiClient } from '../lib/api-client';

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tryRestore = async () => {
      const refreshToken = authLib.getRefreshToken();
      if (!refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        await authLib.refreshTokens();
        const { data } = await apiClient.get<UserProfile>('/auth/profile');
        setUser(data);
      } catch {
        authLib.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    tryRestore();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { user } = await authLib.login({ username, password });
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    await authLib.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
