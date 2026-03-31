import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IngredientForm } from '../IngredientForm';

describe('IngredientForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders name field and submit button', () => {
    render(<IngredientForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
  });

  it('shows validation error when name is empty', async () => {
    const user = userEvent.setup();
    render(<IngredientForm onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    });
  });

  it('calls onSubmit with form data on valid submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<IngredientForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Nombre'), 'Cebolla');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: 'Cebolla' });
    });
  });

  it('shows server error when onSubmit throws', async () => {
    const user = userEvent.setup();
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new Error('El ingrediente ya existe'));
    render(<IngredientForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Nombre'), 'Cebolla');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => {
      expect(screen.getByText('El ingrediente ya existe')).toBeInTheDocument();
    });
  });

  it('renders with custom submit label', () => {
    render(
      <IngredientForm onSubmit={vi.fn()} submitLabel="Crear ingrediente" />,
    );

    expect(
      screen.getByRole('button', { name: 'Crear ingrediente' }),
    ).toBeInTheDocument();
  });

  it('populates default values when editing', () => {
    render(
      <IngredientForm onSubmit={vi.fn()} defaultValues={{ name: 'Lechuga' }} />,
    );

    expect(screen.getByLabelText('Nombre')).toHaveValue('Lechuga');
  });
});
