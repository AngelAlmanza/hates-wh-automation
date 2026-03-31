import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from './LoginForm';
import { AuthContext, type AuthContextType } from '../../../context/auth-context';

function renderWithAuth(authOverrides: Partial<AuthContextType> = {}) {
  const defaultAuth: AuthContextType = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    ...authOverrides,
  };

  return {
    ...render(
      <AuthContext.Provider value={defaultAuth}>
        <LoginForm />
      </AuthContext.Provider>,
    ),
    auth: defaultAuth,
  };
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders username and password fields', () => {
    renderWithAuth();

    expect(screen.getByLabelText('Usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup();
    renderWithAuth();

    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => {
      expect(screen.getByText('El usuario es requerido')).toBeInTheDocument();
      expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument();
    });
  });

  it('calls login with form data on valid submit', async () => {
    const user = userEvent.setup();
    const loginFn = vi.fn().mockResolvedValue(undefined);
    renderWithAuth({ login: loginFn });

    await user.type(screen.getByLabelText('Usuario'), 'pariente');
    await user.type(screen.getByLabelText('Contraseña'), '$Demo1234');
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => {
      expect(loginFn).toHaveBeenCalledWith('pariente', '$Demo1234');
    });
  });

  it('shows server error when login fails', async () => {
    const user = userEvent.setup();
    const loginFn = vi.fn().mockRejectedValue(new Error('Invalid'));
    renderWithAuth({ login: loginFn });

    await user.type(screen.getByLabelText('Usuario'), 'pariente');
    await user.type(screen.getByLabelText('Contraseña'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas. Intenta de nuevo.')).toBeInTheDocument();
    });
  });
});
