import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CategoryForm } from '../CategoryForm';

describe('CategoryForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders name and description fields', () => {
    render(<CategoryForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Descripción (opcional)')).toBeInTheDocument();
    expect(screen.getByLabelText('Orden')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
  });

  it('shows validation error when name is empty', async () => {
    const user = userEvent.setup();
    render(<CategoryForm onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    });
  });

  it('calls onSubmit with form data on valid submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<CategoryForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Nombre'), 'Hamburguesas');
    await user.type(
      screen.getByLabelText('Descripción (opcional)'),
      'Descripción de prueba',
    );
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Hamburguesas' }),
      );
    });
  });

  it('shows server error when onSubmit throws', async () => {
    const user = userEvent.setup();
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new Error('Error del servidor'));
    render(<CategoryForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Nombre'), 'Hamburguesas');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => {
      expect(screen.getByText('Error del servidor')).toBeInTheDocument();
    });
  });

  it('renders with custom submit label', () => {
    render(<CategoryForm onSubmit={vi.fn()} submitLabel="Crear categoría" />);

    expect(
      screen.getByRole('button', { name: 'Crear categoría' }),
    ).toBeInTheDocument();
  });

  it('populates default values when editing', () => {
    render(
      <CategoryForm
        onSubmit={vi.fn()}
        defaultValues={{
          name: 'Bebidas',
          description: 'Bebidas frías y calientes',
          sortOrder: 2,
        }}
      />,
    );

    expect(screen.getByLabelText('Nombre')).toHaveValue('Bebidas');
    expect(
      screen.getByLabelText('Descripción (opcional)'),
    ).toHaveValue('Bebidas frías y calientes');
  });
});
