import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import { PublicRoute } from './PublicRoute';
import { AuthContext, type AuthContextType } from '../../context/auth-context';

function renderWithRoute(authOverrides: Partial<AuthContextType> = {}) {
  const defaultAuth: AuthContextType = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    ...authOverrides,
  };

  return render(
    <AuthContext.Provider value={defaultAuth}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe('PublicRoute', () => {
  it('renders children for unauthenticated users', () => {
    renderWithRoute({ isAuthenticated: false });

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('redirects authenticated users to /dashboard', () => {
    renderWithRoute({
      isAuthenticated: true,
      user: { id: '1', username: 'pariente', displayName: 'Pariente' },
    });

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('shows loading state while auth is initializing', () => {
    renderWithRoute({ isLoading: true });

    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});
